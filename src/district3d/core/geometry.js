import * as THREE from '/node_modules/three/build/three.module.js';

function areaFromPoints(poly) {
  if (!poly || poly.length < 3) return 0;
  return Math.abs(poly.reduce((sum, p, i) => {
    const next = poly[(i + 1) % poly.length];
    return sum + p.x * next.y - next.x * p.y;
  }, 0) / 2);
}

export function hashNumber(text) {
  let h = 2166136261;
  for (let i = 0; i < String(text).length; i += 1) {
    h ^= String(text).charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function worldPoint(p, center, scale) {
  return new THREE.Vector2((p.x - center.x) * scale, (p.y - center.y) * scale);
}

export function sourcePoint(p, center, scale) {
  return { x: p.x / scale + center.x, y: p.y / scale + center.y };
}

export function pointInPoly(point, poly) {
  if (!poly || poly.length < 3) return false;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const crosses = ((yi > point.y) !== (yj > point.y)) && point.x < ((xj - xi) * (point.y - yi)) / ((yj - yi) || 0.000001) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}

export function rectPoly(minX, minY, maxX, maxY) {
  return [{ x: minX, y: minY }, { x: maxX, y: minY }, { x: maxX, y: maxY }, { x: minX, y: maxY }];
}

export function cleanWorldPoly(poly) {
  const out = [];
  (poly || []).forEach((p) => {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
    const last = out[out.length - 1];
    if (!last || Math.hypot(last.x - p.x, last.y - p.y) > 0.05) out.push({ x: p.x, y: p.y });
  });
  if (out.length > 2 && Math.hypot(out[0].x - out[out.length - 1].x, out[0].y - out[out.length - 1].y) < 0.05) out.pop();
  return out;
}

export function clipPolyHalfPlane(poly, inside, intersect) {
  const out = [];
  if (!poly || !poly.length) return out;
  for (let i = 0; i < poly.length; i += 1) {
    const cur = poly[i];
    const prev = poly[(i + poly.length - 1) % poly.length];
    const ci = inside(cur);
    const pi = inside(prev);
    if (ci !== pi) out.push(intersect(prev, cur));
    if (ci) out.push(cur);
  }
  return cleanWorldPoly(out);
}

export function rotateForGenerationPoint(p, pivot) {
  return { x: pivot.x + (p.y - pivot.y), y: pivot.y - (p.x - pivot.x) };
}

export function unrotateGeneratedPoint(p, pivot) {
  return { x: pivot.x - (p.y - pivot.y), y: pivot.y + (p.x - pivot.x) };
}

export function transformPolygon(poly, transform, pivot) {
  return cleanWorldPoly((poly || []).map((p) => transform(p, pivot)));
}

export function transformRoad(road, transform, pivot) {
  const a = transform(road.a, pivot);
  const b = transform(road.b, pivot);
  return Object.assign({}, road, { a, b, centerline: [a, b] });
}

export function transformParcel(parcel, transform, pivot) {
  return Object.assign({}, parcel, {
    polygon: transformPolygon(parcel.polygon, transform, pivot),
    buildingPolygon: parcel.buildingPolygon ? transformPolygon(parcel.buildingPolygon, transform, pivot) : parcel.buildingPolygon,
  });
}

export function transformBlock(block, transform, pivot) {
  const polygon = transformPolygon(block.polygon, transform, pivot);
  return Object.assign({}, block, {
    polygon,
    area: areaFromPoints(polygon),
    parcels: (block.parcels || []).map((parcel) => transformParcel(parcel, transform, pivot)),
  });
}

export function transformPointAffine(p, affine) {
  const s = affine?.scale || 1;
  return { x: p.x * s + (affine?.tx || 0), y: p.y * s + (affine?.ty || 0) };
}

export function transformPolyAffine(poly, affine) {
  return cleanWorldPoly((poly || []).map((p) => transformPointAffine(p, affine)));
}

export function transformRoadAffine(road, affine) {
  const a = transformPointAffine(road.a, affine);
  const b = transformPointAffine(road.b, affine);
  return Object.assign({}, road, { a, b, centerline: [a, b] });
}

export function transformParcelAffine(parcel, affine) {
  return Object.assign({}, parcel, {
    polygon: transformPolyAffine(parcel.polygon, affine),
    buildingPolygon: parcel.buildingPolygon ? transformPolyAffine(parcel.buildingPolygon, affine) : parcel.buildingPolygon,
  });
}

export function transformBlockAffine(block, affine) {
  const polygon = transformPolyAffine(block.polygon, affine);
  return Object.assign({}, block, {
    polygon,
    area: areaFromPoints(polygon),
    parcels: (block.parcels || []).map((parcel) => transformParcelAffine(parcel, affine)),
  });
}

export function clipPolygonToRect(poly, minX, minY, maxX, maxY) {
  let p = poly || [];
  p = clipPolyHalfPlane(p, (q) => q.x >= minX, (a, b) => {
    const t = (minX - a.x) / ((b.x - a.x) || 0.000001);
    return { x: minX, y: a.y + (b.y - a.y) * t };
  });
  p = clipPolyHalfPlane(p, (q) => q.x <= maxX, (a, b) => {
    const t = (maxX - a.x) / ((b.x - a.x) || 0.000001);
    return { x: maxX, y: a.y + (b.y - a.y) * t };
  });
  p = clipPolyHalfPlane(p, (q) => q.y >= minY, (a, b) => {
    const t = (minY - a.y) / ((b.y - a.y) || 0.000001);
    return { x: a.x + (b.x - a.x) * t, y: minY };
  });
  p = clipPolyHalfPlane(p, (q) => q.y <= maxY, (a, b) => {
    const t = (maxY - a.y) / ((b.y - a.y) || 0.000001);
    return { x: a.x + (b.x - a.x) * t, y: maxY };
  });
  return cleanWorldPoly(p);
}

export function clipPolygonToPolygon(subject, clipper) {
  let out = cleanWorldPoly(subject);
  if (!out.length || !clipper || clipper.length < 3) return [];
  const signedArea = clipper.reduce((sum, a, i) => {
    const b = clipper[(i + 1) % clipper.length];
    return sum + (a.x * b.y - b.x * a.y);
  }, 0);
  const keepLeft = signedArea >= 0;
  for (let i = 0; i < clipper.length; i += 1) {
    const a = clipper[i];
    const b = clipper[(i + 1) % clipper.length];
    const inside = (p) => {
      const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
      return keepLeft ? cross >= -0.001 : cross <= 0.001;
    };
    const intersect = (p, q) => {
      const rx = q.x - p.x;
      const ry = q.y - p.y;
      const sx = b.x - a.x;
      const sy = b.y - a.y;
      const denom = rx * sy - ry * sx || 0.000001;
      const t = ((a.x - p.x) * sy - (a.y - p.y) * sx) / denom;
      return { x: p.x + rx * t, y: p.y + ry * t };
    };
    out = clipPolyHalfPlane(out, inside, intersect);
    if (out.length < 3) return [];
  }
  return cleanWorldPoly(out);
}

export function makeCuts(min, max, count, rand) {
  const span = max - min;
  const weights = Array.from({ length: count }, () => 0.75 + rand() * 0.65);
  const total = weights.reduce((s, v) => s + v, 0);
  const cuts = [min];
  let cursor = min;
  weights.forEach((w) => {
    cursor += span * w / total;
    cuts.push(cursor);
  });
  cuts[cuts.length - 1] = max;
  return cuts;
}

export function seeded3d(seed) {
  let h = 2166136261;
  String(seed || 'district').split('').forEach((ch) => {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  });
  return () => {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
