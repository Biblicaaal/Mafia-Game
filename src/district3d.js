import * as THREE from '/node_modules/three/build/three.module.js';

const mounted = new Map();
const savedViews = new Map();
const RENDERER_VERSION = '3d-first-district-generator-v34-convex-districts-visual-exact-only';
const WORLD_SCALE = 0.1;
const FLOOR_HEIGHT = 2.35;
const HEIGHT_SCALE = 0.33;
const colorByCategory = {
  Residential: { wall: 0xbfa77d, roof: 0x6f5a45 },
  Commercial: { wall: 0x9fb1bd, roof: 0x4c5d69 },
  Industrial: { wall: 0x5e6264, roof: 0x303436 },
  Civic: { wall: 0xd3d0c1, roof: 0x817d70 },
  Criminal: { wall: 0x603636, roof: 0x242426 },
};
const parcelBuildingDb = [
  { category: 'Residential', subtype: 'Small House', min: 80, max: 250, floors: [1, 2], height: [3, 6], footprint: [0.5, 0.8] },
  { category: 'Residential', subtype: 'Duplex', min: 150, max: 400, floors: [2, 3], height: [6, 9], footprint: [0.6, 0.85] },
  { category: 'Residential', subtype: 'Apartment Building', min: 300, max: 1200, floors: [3, 8], height: [9, 24], footprint: [0.6, 0.9] },
  { category: 'Residential', subtype: 'Luxury Condo', min: 500, max: 2500, floors: [5, 15], height: [15, 45], footprint: [0.4, 0.7] },
  { category: 'Residential', subtype: 'Mansion', min: 1000, max: 6000, floors: [1, 3], height: [3, 12], footprint: [0.2, 0.5] },
  { category: 'Commercial', subtype: 'Corner Shop', min: 80, max: 300, floors: [1, 2], height: [3, 8], footprint: [0.7, 0.95] },
  { category: 'Commercial', subtype: 'Restaurant', min: 150, max: 600, floors: [1, 3], height: [3, 12], footprint: [0.6, 0.9] },
  { category: 'Commercial', subtype: 'Bar / Club', min: 200, max: 1000, floors: [1, 3], height: [4, 12], footprint: [0.7, 0.95] },
  { category: 'Commercial', subtype: 'Office Building', min: 400, max: 3000, floors: [4, 15], height: [12, 45], footprint: [0.5, 0.85] },
  { category: 'Commercial', subtype: 'Shopping Center', min: 3000, max: 15000, floors: [1, 4], height: [5, 20], footprint: [0.7, 0.95] },
  { category: 'Commercial', subtype: 'Hotel', min: 1000, max: 5000, floors: [5, 20], height: [15, 60], footprint: [0.5, 0.85] },
  { category: 'Industrial', subtype: 'Workshop', min: 300, max: 1500, floors: [1, 2], height: [4, 8], footprint: [0.7, 0.95] },
  { category: 'Industrial', subtype: 'Warehouse', min: 1000, max: 10000, floors: [1, 2], height: [5, 12], footprint: [0.8, 0.95] },
  { category: 'Industrial', subtype: 'Factory', min: 2000, max: 30000, floors: [1, 5], height: [5, 25], footprint: [0.6, 0.9] },
  { category: 'Industrial', subtype: 'Heavy Industry', min: 5000, max: 100000, floors: [1, 6], height: [8, 40], footprint: [0.5, 0.85] },
  { category: 'Civic', subtype: 'Clinic', min: 300, max: 2000, floors: [1, 4], height: [3, 15], footprint: [0.5, 0.8] },
  { category: 'Civic', subtype: 'School', min: 1000, max: 10000, floors: [1, 4], height: [4, 16], footprint: [0.3, 0.7] },
  { category: 'Civic', subtype: 'Police Station', min: 500, max: 5000, floors: [2, 5], height: [6, 20], footprint: [0.4, 0.8] },
  { category: 'Civic', subtype: 'Courthouse', min: 1000, max: 8000, floors: [2, 6], height: [8, 25], footprint: [0.3, 0.7] },
  { category: 'Civic', subtype: 'Bank Branch', min: 300, max: 2000, floors: [1, 4], height: [4, 16], footprint: [0.5, 0.9] },
  { category: 'Civic', subtype: 'Hospital', min: 2000, max: 20000, floors: [3, 12], height: [12, 50], footprint: [0.4, 0.8] },
  { category: 'Criminal', subtype: 'Safehouse', min: 80, max: 400, floors: [1, 3], height: [3, 10], footprint: [0.5, 0.8] },
  { category: 'Criminal', subtype: 'Drug House', min: 80, max: 300, floors: [1, 2], height: [3, 8], footprint: [0.6, 0.9] },
  { category: 'Criminal', subtype: 'Gambling Den', min: 200, max: 1200, floors: [1, 4], height: [4, 15], footprint: [0.6, 0.95] },
  { category: 'Criminal', subtype: 'Crew HQ', min: 300, max: 3000, floors: [2, 8], height: [8, 30], footprint: [0.5, 0.85] },
  { category: 'Criminal', subtype: 'Major Syndicate HQ', min: 1000, max: 10000, floors: [5, 20], height: [15, 70], footprint: [0.4, 0.8] },
];
const emptyDebug = {
  boundary: true,
  parcelOutlines: true,
  roadClipPoints: false,
  selectedParcelId: true,
  cameraTarget: false,
  windows: false,
  exactExtrusion: true,
};

function disposeObject(obj) {
  obj.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
      else child.material.dispose();
    }
  });
}

function cleanup(root) {
  const entry = mounted.get(root);
  if (!entry) return;
  window.removeEventListener('resize', entry.onResize);
  root.removeEventListener('wheel', entry.onWheel);
  root.removeEventListener('pointerdown', entry.onPointerDown);
  root.removeEventListener('pointermove', entry.onPointerMove);
  root.removeEventListener('pointerup', entry.onPointerUp);
  root.removeEventListener('pointercancel', entry.onPointerUp);
  root.removeEventListener('pointerleave', entry.onPointerUp);
  if (entry.onContextMenu) root.removeEventListener('contextmenu', entry.onContextMenu);
  if (entry.onKeyDown) window.removeEventListener('keydown', entry.onKeyDown, true);
  if (entry.onKeyUp) window.removeEventListener('keyup', entry.onKeyUp, true);
  if (entry.onDocumentMouseMove) document.removeEventListener('mousemove', entry.onDocumentMouseMove);
  if (entry.frame) cancelAnimationFrame(entry.frame);
  disposeObject(entry.scene);
  entry.renderer.dispose();
  root.innerHTML = '';
  mounted.delete(root);
}

function hashNumber(text) {
  let h = 2166136261;
  for (let i = 0; i < String(text).length; i += 1) {
    h ^= String(text).charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function worldPoint(p, center, scale) {
  return new THREE.Vector2((p.x - center.x) * scale, (p.y - center.y) * scale);
}

function sourcePoint(p, center, scale) {
  return { x: p.x / scale + center.x, y: p.y / scale + center.y };
}

function pointInPoly(point, poly) {
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

function rectPoly(minX, minY, maxX, maxY) {
  return [{ x: minX, y: minY }, { x: maxX, y: minY }, { x: maxX, y: maxY }, { x: minX, y: maxY }];
}

function clipPolyHalfPlane(poly, inside, intersect) {
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

function cleanWorldPoly(poly) {
  const out = [];
  (poly || []).forEach((p) => {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
    const last = out[out.length - 1];
    if (!last || Math.hypot(last.x - p.x, last.y - p.y) > 0.05) out.push({ x: p.x, y: p.y });
  });
  if (out.length > 2 && Math.hypot(out[0].x - out[out.length - 1].x, out[0].y - out[out.length - 1].y) < 0.05) out.pop();
  return out;
}

function rotateForGenerationPoint(p, pivot) {
  return { x: pivot.x + (p.y - pivot.y), y: pivot.y - (p.x - pivot.x) };
}

function unrotateGeneratedPoint(p, pivot) {
  return { x: pivot.x - (p.y - pivot.y), y: pivot.y + (p.x - pivot.x) };
}

function transformPolygon(poly, transform, pivot) {
  return cleanWorldPoly((poly || []).map((p) => transform(p, pivot)));
}

function transformRoad(road, transform, pivot) {
  const a = transform(road.a, pivot);
  const b = transform(road.b, pivot);
  return Object.assign({}, road, { a, b, centerline: [a, b] });
}

function transformParcel(parcel, transform, pivot) {
  return Object.assign({}, parcel, {
    polygon: transformPolygon(parcel.polygon, transform, pivot),
    buildingPolygon: parcel.buildingPolygon ? transformPolygon(parcel.buildingPolygon, transform, pivot) : parcel.buildingPolygon,
  });
}

function transformBlock(block, transform, pivot) {
  const polygon = transformPolygon(block.polygon, transform, pivot);
  return Object.assign({}, block, {
    polygon,
    area: areaFromPoly(polygon),
    parcels: (block.parcels || []).map((parcel) => transformParcel(parcel, transform, pivot)),
  });
}

function clipPolygonToRect(poly, minX, minY, maxX, maxY) {
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

function clipPolygonToPolygon(subject, clipper) {
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

function makeCuts(min, max, count, rand) {
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

function chooseStyle(payload) {
  const d = payload.district || {};
  const name = `${d.name || ''}`.toLowerCase();
  if (/financial|bank|downtown|midtown|crown|market/.test(name) && (d.wealth || 0) > 58) return 'DOWNTOWN';
  if (/dock|harbor|port|water|canal|marina/.test(name)) return 'WATERFRONT';
  if (/iron|rail|warehouse|yard|works|factory/.test(name)) return 'INDUSTRIAL';
  if (/market|theater|red|club|night/.test(name)) return 'NIGHTLIFE';
  if (/old|little|quarter/.test(name)) return 'OLD_TOWN';
  if (/garden|uptown|heights/.test(name)) return 'SUBURB';
  if ((d.wealth || 0) > 72 && (d.police || 0) > 55) return 'DOWNTOWN';
  if ((d.wealth || 0) < 42 && (d.corruption || 0) > 58) return 'SLUM';
  return 'MIXED';
}

function styleConfig(style) {
  const configs = {
    DOWNTOWN: { x: 7, y: 6, road: 15, parcels: 4, buildChance: 0.92, categories: ['Commercial', 'Commercial', 'Commercial', 'Civic', 'Residential'] },
    OLD_TOWN: { x: 5, y: 5, road: 10, parcels: 3, buildChance: 0.82, categories: ['Residential', 'Commercial', 'Commercial'] },
    SUBURB: { x: 3, y: 3, road: 11, parcels: 2, buildChance: 0.62, categories: ['Residential', 'Residential', 'Residential', 'Civic'] },
    INDUSTRIAL: { x: 3, y: 3, road: 18, parcels: 2, buildChance: 0.72, categories: ['Industrial', 'Industrial', 'Industrial', 'Commercial'] },
    WATERFRONT: { x: 5, y: 3, road: 16, parcels: 2, buildChance: 0.76, categories: ['Industrial', 'Commercial', 'Commercial'] },
    SLUM: { x: 6, y: 6, road: 8, parcels: 4, buildChance: 0.88, categories: ['Residential', 'Residential', 'Commercial'] },
    CIVIC_CENTER: { x: 4, y: 4, road: 20, parcels: 2, buildChance: 0.78, categories: ['Civic', 'Civic', 'Commercial', 'Residential'] },
    NIGHTLIFE: { x: 6, y: 5, road: 11, parcels: 4, buildChance: 0.9, categories: ['Commercial', 'Commercial', 'Residential'] },
    MIXED: { x: 5, y: 4, road: 12, parcels: 3, buildChance: 0.8, categories: ['Residential', 'Commercial', 'Industrial', 'Civic'] },
  };
  return configs[style] || configs.MIXED;
}

function buildingProfilesFor(category, parcelArea, style) {
  const exact = parcelBuildingDb.filter((p) => p.category === category && parcelArea >= p.min && parcelArea <= p.max);
  const densityTallOk = style === 'DOWNTOWN' || style === 'NIGHTLIFE';
  const filteredExact = exact.filter((p) => densityTallOk || p.floors[1] <= 8);
  if (filteredExact.length) return filteredExact;
  if (exact.length) return exact;
  const sameCategory = parcelBuildingDb.filter((p) => p.category === category);
  if (!sameCategory.length) return parcelBuildingDb.filter((p) => p.category === 'Commercial');
  return sameCategory
    .slice()
    .sort((a, b) => Math.min(Math.abs(parcelArea - a.min), Math.abs(parcelArea - a.max)) - Math.min(Math.abs(parcelArea - b.min), Math.abs(parcelArea - b.max)))
    .slice(0, 3);
}

function profileForSubtype(category, subtype) {
  return parcelBuildingDb.find((p) => p.category === category && p.subtype === subtype)
    || parcelBuildingDb.find((p) => p.subtype === subtype)
    || null;
}

function typeForCategory(category, rand, parcelArea, style) {
  if (category === 'Criminal') category = 'Commercial';
  const list = buildingProfilesFor(category, parcelArea, style);
  return list[Math.floor(rand() * list.length)];
}

function seeded3d(seed) {
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

function lineSegmentsInsidePolygon(a, b, poly, segments = 96) {
  const out = [];
  let start = null;
  let prev = null;
  const boundaryPoint = (insidePoint, outsidePoint) => {
    let lo = insidePoint;
    let hi = outsidePoint;
    for (let step = 0; step < 10; step += 1) {
      const mid = { x: (lo.x + hi.x) / 2, y: (lo.y + hi.y) / 2 };
      if (pointInPoly(mid, poly)) lo = mid;
      else hi = mid;
    }
    return lo;
  };
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    const inside = pointInPoly(p, poly);
    if (inside && !start) start = prev && !pointInPoly(prev, poly) ? boundaryPoint(p, prev) : p;
    if (!inside && start && prev) {
      const end = boundaryPoint(prev, p);
      if (Math.hypot(end.x - start.x, end.y - start.y) > 4) out.push({ a: start, b: end });
      start = null;
    }
    prev = p;
  }
  if (start && prev && Math.hypot(prev.x - start.x, prev.y - start.y) > 4) out.push({ a: start, b: prev });
  return out;
}

function lineSpansAcrossPolygon(a, b, poly, segments = 128) {
  const pieces = lineSegmentsInsidePolygon(a, b, poly, segments);
  if (pieces.length <= 1) return pieces;
  const first = pieces[0];
  const last = pieces[pieces.length - 1];
  const span = { a: first.a, b: last.b };
  return Math.hypot(span.b.x - span.a.x, span.b.y - span.a.y) > 4 ? [span] : [];
}

function roadSpec(id, kind, width, a, b, district, rand) {
  const trafficBase = kind === 'highway' ? 85 : kind === 'arterial' ? 68 : kind === 'collector' ? 50 : 34;
  return {
    id,
    type: kind === 'highway' ? 'highway' : kind === 'arterial' ? 'arterial road' : kind === 'collector' ? 'collector road' : 'local road',
    kind,
    width,
    centerline: [a, b],
    a,
    b,
    traffic: Math.round(trafficBase + rand() * 16),
    walkability: Math.round(kind === 'highway' ? 15 + rand() * 12 : 42 + rand() * 38),
    policePresence: district?.police || 40,
    commercialValue: district?.wealth || 40,
  };
}

function hierarchicalCuts(min, max, count, rand) {
  const cuts = makeCuts(min, max, count, rand);
  return cuts.map((value, i) => {
    if (i === 0 || i === cuts.length - 1) return { value, kind: 'edge', width: 0 };
    const center = Math.abs(i - (cuts.length - 1) / 2) < 0.75;
    const kind = center ? 'arterial' : i % 2 === 0 ? 'collector' : 'local';
    return { value, kind, width: kind === 'arterial' ? 18 : kind === 'collector' ? 12 : 8 };
  });
}

function spacedRoadCuts(cuts, minGap) {
  if (!cuts.length) return cuts;
  const sorted = cuts.slice().sort((a, b) => a.value - b.value);
  const out = [sorted[0]];
  for (let i = 1; i < sorted.length - 1; i += 1) {
    const cut = sorted[i];
    const prev = out[out.length - 1];
    const next = sorted[i + 1];
    const leftGap = cut.value - prev.value - ((cut.width || 0) + (prev.width || 0)) * 0.5;
    const rightGap = next.value - cut.value - ((next.width || 0) + (cut.width || 0)) * 0.5;
    if (!cut.required && leftGap < minGap || !cut.required && rightGap < minGap) continue;
    out.push(cut);
  }
  out.push(sorted[sorted.length - 1]);
  return out;
}

function createRoadNetwork(boundsBox, districtPoly, cfg, style, rand, district, inheritedRoads = []) {
  const districtArea = areaFromPoly(districtPoly);
  const width = boundsBox.maxX - boundsBox.minX;
  const height = boundsBox.maxY - boundsBox.minY;
  const boxArea = Math.max(1, width * height);
  const compactness = districtArea / boxArea;
  const narrowSpan = Math.min(width, height);
  const wedgeLike = compactness < 0.58 || narrowSpan < 185;
  const densityBoost = !wedgeLike && (style === 'DOWNTOWN' || style === 'SLUM' || style === 'NIGHTLIFE') ? 1 : 0;
  const xCount = Math.max(3, Math.min(cfg.x + densityBoost, wedgeLike ? 4 : cfg.x + densityBoost));
  const yCount = Math.max(3, Math.min(cfg.y + densityBoost, wedgeLike ? 4 : cfg.y + densityBoost));
  let xCuts = hierarchicalCuts(boundsBox.minX, boundsBox.maxX, xCount, rand);
  let yCuts = hierarchicalCuts(boundsBox.minY, boundsBox.maxY, yCount, rand);
  const roads = [];
  const horizontalHighway = width >= height;
  const highwayOffset = (rand() - 0.5) * (horizontalHighway ? height : width) * 0.18;
  const allowHighway = !wedgeLike && districtArea > 42000 && narrowSpan > 230;
  const minCutGap = wedgeLike ? 42 : 24;
  const segmentLength = (seg) => Math.hypot(seg.b.x - seg.a.x, seg.b.y - seg.a.y);
  const meaningfulSegments = (segments, threshold) => segments.filter((seg) => segmentLength(seg) > threshold);
  const keepCutWithSegments = (cut, segments, idPrefix, threshold) => {
    const valid = meaningfulSegments(segments, threshold);
    valid.forEach((seg, i) => roads.push(roadSpec(`${idPrefix}-${i}`, cut.kind, cut.width, seg.a, seg.b, district, rand)));
    return valid.length > 0;
  };
  (inheritedRoads || []).forEach((road, i) => {
    if (!road || !road.a || !road.b) return;
    const dx = road.b.x - road.a.x;
    const dy = road.b.y - road.a.y;
    const kind = road.kind === 'highway' ? 'highway' : 'arterial';
    const cut = { value: Math.abs(dx) >= Math.abs(dy) ? (road.a.y + road.b.y) / 2 : (road.a.x + road.b.x) / 2, kind, width: road.width || (kind === 'highway' ? 24 : 20), required: true };
    if (Math.abs(dx) >= Math.abs(dy)) {
      const segments = lineSpansAcrossPolygon({ x: boundsBox.minX - 80, y: cut.value }, { x: boundsBox.maxX + 80, y: cut.value }, districtPoly, 128);
      if (keepCutWithSegments(cut, segments, `inherited-h-${i}`, kind === 'highway' ? 70 : 45)) yCuts.push(cut);
    } else {
      const segments = lineSpansAcrossPolygon({ x: cut.value, y: boundsBox.minY - 80 }, { x: cut.value, y: boundsBox.maxY + 80 }, districtPoly, 128);
      if (keepCutWithSegments(cut, segments, `inherited-v-${i}`, kind === 'highway' ? 70 : 45)) xCuts.push(cut);
    }
  });

  if (allowHighway && horizontalHighway) {
    const y = (boundsBox.minY + boundsBox.maxY) / 2 + highwayOffset;
    const cut = { value: y, kind: 'highway', width: 24 };
    const segments = lineSpansAcrossPolygon({ x: boundsBox.minX - 60, y }, { x: boundsBox.maxX + 60, y }, districtPoly, 128);
    if (keepCutWithSegments(cut, segments, 'highway-h', 70)) yCuts.push(cut);
    yCuts = yCuts.sort((a, b) => a.value - b.value);
  } else if (allowHighway) {
    const x = (boundsBox.minX + boundsBox.maxX) / 2 + highwayOffset;
    const cut = { value: x, kind: 'highway', width: 24 };
    const segments = lineSpansAcrossPolygon({ x, y: boundsBox.minY - 60 }, { x, y: boundsBox.maxY + 60 }, districtPoly, 128);
    if (keepCutWithSegments(cut, segments, 'highway-v', 70)) xCuts.push(cut);
    xCuts = xCuts.sort((a, b) => a.value - b.value);
  }
  xCuts = spacedRoadCuts(xCuts, minCutGap);
  yCuts = spacedRoadCuts(yCuts, minCutGap);

  const keptXCuts = [xCuts[0]];
  xCuts.slice(1, -1).forEach((cut, i) => {
    const segments = lineSpansAcrossPolygon({ x: cut.value, y: boundsBox.minY - 40 }, { x: cut.value, y: boundsBox.maxY + 40 }, districtPoly, 128);
    if (keepCutWithSegments(cut, segments, `road-v-${i}`, wedgeLike ? 55 : 35)) keptXCuts.push(cut);
  });
  keptXCuts.push(xCuts[xCuts.length - 1]);
  const keptYCuts = [yCuts[0]];
  yCuts.slice(1, -1).forEach((cut, i) => {
    const segments = lineSpansAcrossPolygon({ x: boundsBox.minX - 40, y: cut.value }, { x: boundsBox.maxX + 40, y: cut.value }, districtPoly, 128);
    if (keepCutWithSegments(cut, segments, `road-h-${i}`, wedgeLike ? 55 : 35)) keptYCuts.push(cut);
  });
  keptYCuts.push(yCuts[yCuts.length - 1]);
  return { xCuts: keptXCuts, yCuts: keptYCuts, roads };
}

function chooseBlockCategory(cfg, district, rand) {
  const d = district || {};
  if (/industrial|dock|yard|rail|airport/i.test(d.name || '') && rand() < 0.55) return 'Industrial';
  if (/financial|market|midtown|theater/i.test(d.name || '') && rand() < 0.62) return 'Commercial';
  if (/garden|uptown|heights/i.test(d.name || '') && rand() < 0.72) return 'Residential';
  if ((d.police || 0) > 68 && rand() < 0.18) return 'Civic';
  return cfg.categories[Math.floor(rand() * cfg.categories.length)];
}

function sideFacingRect(poly, side) {
  const b = bounds(poly);
  const c = centroid(poly);
  const eps = Math.max(b.maxX - b.minX, b.maxY - b.minY) * 0.02;
  if (side === 'north') return Math.abs(c.y - b.minY) < (b.maxY - b.minY) * 0.42 + eps;
  if (side === 'south') return Math.abs(c.y - b.maxY) < (b.maxY - b.minY) * 0.42 + eps;
  if (side === 'west') return Math.abs(c.x - b.minX) < (b.maxX - b.minX) * 0.42 + eps;
  if (side === 'east') return Math.abs(c.x - b.maxX) < (b.maxX - b.minX) * 0.42 + eps;
  return true;
}

function makeGeneratedParcel(block, parcelPoly, category, district, style, rand, index, accessSide) {
  const parcelArea = areaFromPoly(parcelPoly);
  const profile = typeForCategory(category, rand, parcelArea, style);
  const id = `${block.id}_p${index}`;
  return {
    id,
    label: `${block.label.replace('Block ', '')}-${index + 1}`,
    districtId: district?.id || 'district',
    blockId: block.id,
    polygon: parcelPoly,
    category,
    sector: category === 'Commercial' ? 'Street Business' : category === 'Industrial' ? 'Production' : category === 'Civic' ? 'Public' : 'Housing',
    subtype: profile.subtype,
    buildingProfile: profile,
    landValue: 20 + Math.round((district?.wealth || 45) * 0.55 + rand() * 18),
    propertyValue: 35 + Math.round((district?.wealth || 45) * 0.9 + parcelArea / 95),
    traffic: Math.round(25 + rand() * 65),
    visibility: Math.round(20 + rand() * 70),
    security: Math.round(15 + rand() * 75),
    wealth: district?.wealth || 45,
    crime: district?.corruption || 45,
    control: 0,
    heat: district?.police || 35,
    owner: category === 'Civic' ? 'Government' : 'Private Owner',
    faction: 'none',
    streetAccess: true,
    accessKind: `${accessSide} road frontage`,
    inheritedRoadFrontage: true,
    metadata: { style, accessSide },
  };
}

function splitQuarterIntoParcels(block, quarter, accessSide, category, districtPoly, roads, cfg, style, district, rand, startIndex) {
  const out = [];
  const b = bounds(quarter);
  const verticalFront = accessSide === 'west' || accessSide === 'east';
  const frontageLength = Math.max(1, verticalFront ? b.maxY - b.minY : b.maxX - b.minX);
  const depthLength = Math.max(1, verticalFront ? b.maxX - b.minX : b.maxY - b.minY);
  const maxByShape = Math.max(1, Math.min(5, Math.floor(frontageLength / Math.max(18, depthLength * 0.62))));
  const splitCount = Math.max(1, Math.min(maxByShape, 1 + Math.floor(rand() * Math.max(1, maxByShape))));
  const frontageCuts = verticalFront ? makeCuts(b.minY, b.maxY, splitCount, rand) : makeCuts(b.minX, b.maxX, splitCount, rand);
  const targetDepth = Math.max(18, Math.min(42, (frontageLength / splitCount) * 0.85));
  const depthBands = Math.max(1, Math.min(3, Math.ceil(depthLength / targetDepth)));
  const depthCuts = verticalFront ? makeCuts(b.minX, b.maxX, depthBands, rand) : makeCuts(b.minY, b.maxY, depthBands, rand);
  const frontageParcels = new Map();
  const innerParcels = [];
  for (let d = 0; d < depthCuts.length - 1; d += 1) {
    for (let i = 0; i < frontageCuts.length - 1; i += 1) {
      const roadBand = accessSide === 'west' || accessSide === 'north'
        ? d === 0
        : d === depthCuts.length - 2;
      const rect = verticalFront
        ? clipPolygonToRect(quarter, depthCuts[d], frontageCuts[i], depthCuts[d + 1], frontageCuts[i + 1])
        : clipPolygonToRect(quarter, frontageCuts[i], depthCuts[d], frontageCuts[i + 1], depthCuts[d + 1]);
      if (rect.length < 3) continue;
      const rb = bounds(rect);
      const rectWidth = rb.maxX - rb.minX;
      const rectDepth = rb.maxY - rb.minY;
      const shortest = Math.min(rectWidth, rectDepth);
      const longest = Math.max(rectWidth, rectDepth);
      if (shortest < 7 || longest / Math.max(1, shortest) > 4.2) continue;
      const poly = clipPolygonToRect(block.polygon, rb.minX, rb.minY, rb.maxX, rb.maxY);
      if (poly.length < 3 || areaFromPoly(poly) < 45) continue;
      const parcel = makeGeneratedParcel(block, poly, category, district, style, rand, startIndex + out.length, accessSide);
      parcel.streetAccess = roadBand;
      parcel.inheritedRoadFrontage = roadBand;
      parcel.accessKind = roadBand ? parcel.accessKind : `inner parcel merged toward ${accessSide} road frontage`;
      const checked = validateParcelBuildability(parcel, block, districtPoly, roads, cfg);
      checked.streetAccess = roadBand;
      checked.accessKind = parcel.accessKind;
      checked.roadFrontageLength = Math.max(checked.roadFrontageLength || 0, Math.sqrt(areaFromPoly(poly)) * WORLD_SCALE);
      checked.roadAccessWarning = false;
      checked.isBuildable = checked.isBuildable || (Array.isArray(checked.polygon) && checked.polygon.length >= 3);
      checked.landUse = checked.isBuildable ? 'building' : 'park';
      if (checked.isBuildable) checked.buildingPolygon = checked.polygon;
      if (roadBand) {
        frontageParcels.set(i, checked);
        out.push(checked);
      } else {
        innerParcels.push({ parcel: checked, frontageIndex: i });
      }
    }
  }
  innerParcels.forEach((item) => {
    let target = frontageParcels.get(item.frontageIndex);
    if (!target) {
      let best = null;
      const pc = centroid(item.parcel.polygon);
      frontageParcels.forEach((candidate) => {
        const cc = centroid(candidate.polygon);
        const distance = Math.hypot(pc.x - cc.x, pc.y - cc.y);
        if (!best || distance < best.distance) best = { candidate, distance };
      });
      target = best?.candidate || null;
    }
    if (!target) {
      out.push(item.parcel);
      return;
    }
    mergeParcelInto(target, item.parcel, block);
    const checked = validateParcelBuildability(target, block, districtPoly, roads, cfg);
    checked.streetAccess = true;
    checked.inheritedRoadFrontage = true;
    checked.accessKind = `${accessSide} road frontage plus merged inner lot`;
    checked.roadFrontageLength = Math.max(checked.roadFrontageLength || 0, Math.sqrt(areaFromPoly(checked.polygon)) * WORLD_SCALE);
    checked.roadAccessWarning = false;
    checked.isBuildable = true;
    checked.landUse = 'building';
    checked.buildingPolygon = checked.polygon;
    Object.assign(target, checked);
  });
  return out;
}

function splitBlockIntoRoadFacingParcels(block, category, districtPoly, roads, cfg, style, district, rand) {
  const b = bounds(block.polygon);
  const xs = makeCuts(b.minX, b.maxX, 3, rand);
  const ys = makeCuts(b.minY, b.maxY, 2, rand);
  const quarters = [];
  for (let ix = 0; ix < 3; ix += 1) {
    for (let iy = 0; iy < 2; iy += 1) {
      let side = iy === 0 ? 'north' : 'south';
      if (ix === 0 && rand() < 0.45) side = 'west';
      if (ix === 2 && rand() < 0.45) side = 'east';
      quarters.push({ side, poly: clipPolygonToRect(block.polygon, xs[ix], ys[iy], xs[ix + 1], ys[iy + 1]) });
    }
  }
  const parcels = [];
  quarters.forEach((q) => {
    if (q.poly.length < 3 || areaFromPoly(q.poly) < 45) return;
    parcels.push(...splitQuarterIntoParcels(block, q.poly, q.side, category, districtPoly, roads, cfg, style, district, rand, parcels.length));
  });
  return parcels;
}

function generate3dDistrict(payload) {
  const sourcePoly = cleanWorldPoly(payload.outerPolygon || []);
  const sourceBounds = bounds(sourcePoly);
  const pivot = { x: (sourceBounds.minX + sourceBounds.maxX) / 2, y: (sourceBounds.minY + sourceBounds.maxY) / 2 };
  const sourceWidth = sourceBounds.maxX - sourceBounds.minX;
  const sourceHeight = sourceBounds.maxY - sourceBounds.minY;
  const rotateVertical = sourceHeight > sourceWidth * 1.18;
  const districtPoly = rotateVertical ? transformPolygon(sourcePoly, rotateForGenerationPoint, pivot) : sourcePoly;
  const inheritedRoads = rotateVertical ? (payload.inheritedRoads || []).map((road) => transformRoad(road, rotateForGenerationPoint, pivot)) : (payload.inheritedRoads || []);
  const generationContextDistricts = (payload.contextDistricts || []).map((district) => Object.assign({}, district, {
    polygon: rotateVertical ? transformPolygon(district.polygon || [], rotateForGenerationPoint, pivot) : cleanWorldPoly(district.polygon || []),
  }));
  const seamRoads = internalSeamRoadsForDistrict(districtPoly, generationContextDistricts);
  const perimeterRoads = perimeterRoadsForDistrict(districtPoly, generationContextDistricts);
  const boundaryRoads = seamRoads.concat(perimeterRoads);
  const b = bounds(districtPoly);
  const style = chooseStyle(payload);
  const cfg = styleConfig(style);
  const rand = seeded3d(`${payload.district?.id || 'district'}-${style}-${payload.seed || 0}-${rotateVertical ? 'rotated' : 'normal'}`);
  const network = createRoadNetwork(b, districtPoly, cfg, style, rand, payload.district, inheritedRoads);
  const xCuts = network.xCuts;
  const yCuts = network.yCuts;
  const roads = network.roads.concat(boundaryRoads);
  const districtCenter = centroid(districtPoly);
  const blocks = [];
  for (let xi = 0; xi < xCuts.length - 1; xi += 1) {
    for (let yi = 0; yi < yCuts.length - 1; yi += 1) {
      const left = xCuts[xi];
      const right = xCuts[xi + 1];
      const top = yCuts[yi];
      const bottom = yCuts[yi + 1];
      const landBuffer = 2.5;
      const minX = left.value + (left.width || 0) * 0.5 + (xi === 0 ? 0 : landBuffer);
      const maxX = right.value - (right.width || 0) * 0.5 - (xi === xCuts.length - 2 ? 0 : landBuffer);
      const minY = top.value + (top.width || 0) * 0.5 + (yi === 0 ? 0 : landBuffer);
      const maxY = bottom.value - (bottom.width || 0) * 0.5 - (yi === yCuts.length - 2 ? 0 : landBuffer);
      if (maxX <= minX + 12 || maxY <= minY + 12) continue;
      let poly = clipPolygonToRect(districtPoly, minX, minY, maxX, maxY);
      poly = clipPolyAwayFromBoundaryRoads(poly, boundaryRoads, districtCenter);
      if (poly.length < 3 || areaFromPoly(poly) < 150) continue;
      const blockId = `b${blocks.length}`;
      const category = chooseBlockCategory(cfg, payload.district, rand);
      const block = { id: blockId, label: `Block ${String.fromCharCode(65 + (blocks.length % 26))}`, polygon: poly, area: areaFromPoly(poly), roadAccess: true, density: cfg.parcels, wealth: payload.district?.wealth || 45, crime: payload.district?.corruption || 45, dominantCategory: category, developmentStyle: style, parcels: [] };
      block.parcels = splitBlockIntoRoadFacingParcels(block, category, districtPoly, roads, cfg, style, payload.district, rand);
      if (block.parcels.length) blocks.push(block);
    }
  }
  const outputPoly = rotateVertical ? sourcePoly : districtPoly;
  const outputRoads = rotateVertical ? roads.map((road) => transformRoad(road, unrotateGeneratedPoint, pivot)) : roads;
  const outputBlocks = rotateVertical ? blocks.map((block) => transformBlock(block, unrotateGeneratedPoint, pivot)) : blocks;
  const contextDistricts = (payload.contextDistricts || []).map((district) => Object.assign({}, district, { polygon: cleanWorldPoly(district.polygon || []) }));
  return {
    version: RENDERER_VERSION,
    style,
    outerPolygon: outputPoly,
    contextDistricts,
    roads: outputRoads,
    blocks: outputBlocks,
    generationTransform: rotateVertical ? 'rotated-vertical-90' : 'normal',
    validation: validateGeneratedDistrict(outputPoly, outputRoads, outputBlocks),
  };
}

function validateGeneratedDistrict(boundary, roads, blocks) {
  const issues = [];
  roads.forEach((r) => {
    if (!pointInPoly(r.a, boundary) || !pointInPoly(r.b, boundary)) issues.push(`Road outside boundary: ${r.id}`);
  });
  blocks.forEach((b) => {
    if (!b.polygon.every((p) => pointInPoly(p, boundary) || pointOnGeneratedBoundary(p, boundary))) issues.push(`Block outside boundary: ${b.id}`);
    (b.parcels || []).forEach((p) => {
      if (!p.polygon.every((q) => pointInPoly(q, b.polygon) || pointOnGeneratedBoundary(q, b.polygon))) issues.push(`Parcel outside block: ${p.id}`);
    });
  });
  return { ok: issues.length === 0, issues };
}

function pointOnGeneratedBoundary(p, poly) {
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const cross = Math.abs((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)) / len;
    const dot = (p.x - a.x) * (p.x - b.x) + (p.y - a.y) * (p.y - b.y);
    if (cross < 0.6 && dot <= 0.6) return true;
  }
  return false;
}

function distancePointToSegment(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  const x = a.x + dx * t;
  const y = a.y + dy * t;
  return Math.hypot(p.x - x, p.y - y);
}

function edgeLength(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function segmentDistanceToSegment(a, b, c, d) {
  return Math.min(
    distancePointToSegment(a, c, d),
    distancePointToSegment(b, c, d),
    distancePointToSegment(c, a, b),
    distancePointToSegment(d, a, b),
  );
}

function polygonDistanceToSegment(poly, a, b) {
  if (!poly || poly.length < 3) return Infinity;
  let best = Infinity;
  for (let i = 0; i < poly.length; i += 1) {
    const c = poly[i];
    const d = poly[(i + 1) % poly.length];
    best = Math.min(
      best,
      distancePointToSegment(c, a, b),
      distancePointToSegment(d, a, b),
      distancePointToSegment(a, c, d),
      distancePointToSegment(b, c, d),
      segmentDistanceToSegment(a, b, c, d),
    );
  }
  return best;
}

function edgeHasNeighborDistrict(a, b, contextDistricts) {
  const maxEdgeMatch = 22;
  const maxSegmentMatch = 14;
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  return (contextDistricts || []).some((district) => {
    const neighborPoly = district?.polygon || [];
    for (let j = 0; j < neighborPoly.length; j += 1) {
      const c = neighborPoly[j];
      const d = neighborPoly[(j + 1) % neighborPoly.length];
      if (edgeLength(c, d) < 20) continue;
      if (distancePointToSegment(mid, c, d) <= maxEdgeMatch) return true;
      if (segmentDistanceToSegment(a, b, c, d) <= maxSegmentMatch) return true;
    }
    return false;
  });
}

function internalSeamRoadsForDistrict(poly, contextDistricts) {
  const roads = [];
  if (!poly || poly.length < 3 || !contextDistricts?.length) return roads;
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const length = edgeLength(a, b);
    if (length < 26 || !edgeHasNeighborDistrict(a, b, contextDistricts)) continue;
    roads.push({
      id: `seam-${i}`,
      kind: 'local',
      width: 13,
      a,
      b,
      centerline: [a, b],
      seam: true,
    });
  }
  return roads;
}

function perimeterRoadsForDistrict(poly, contextDistricts) {
  const roads = [];
  if (!poly || poly.length < 3) return roads;
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const length = edgeLength(a, b);
    if (length < 34 || edgeHasNeighborDistrict(a, b, contextDistricts)) continue;
    roads.push({
      id: `perimeter-${i}`,
      kind: 'collector',
      width: 17,
      a,
      b,
      centerline: [a, b],
      perimeter: true,
    });
  }
  return roads;
}

function signedLineDistanceNumerator(p, a, b) {
  return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
}

function clipPolyAwayFromBoundaryRoads(poly, boundaryRoads, districtCenter) {
  let out = cleanWorldPoly(poly || []);
  if (out.length < 3 || !boundaryRoads?.length) return out;
  (boundaryRoads || []).forEach((road) => {
    if (out.length < 3 || !road?.a || !road?.b) return;
    const len = edgeLength(road.a, road.b);
    if (len < 1) return;
    const roadReserve = Math.max(8, (road.width || 13) * 0.72);
    if (polygonDistanceToSegment(out, road.a, road.b) > roadReserve + 10) return;
    const localCenter = centroid(out);
    const centerSide = Math.sign(signedLineDistanceNumerator(localCenter, road.a, road.b))
      || Math.sign(signedLineDistanceNumerator(districtCenter, road.a, road.b))
      || 1;
    const threshold = roadReserve * len;
    out = clipPolyHalfPlane(
      out,
      (p) => centerSide * signedLineDistanceNumerator(p, road.a, road.b) >= threshold,
      (a, b) => {
        const da = centerSide * signedLineDistanceNumerator(a, road.a, road.b) - threshold;
        const db = centerSide * signedLineDistanceNumerator(b, road.a, road.b) - threshold;
        const t = da / ((da - db) || 0.000001);
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      },
    );
  });
  return cleanWorldPoly(out);
}

function parcelRoadFrontage(poly, roads) {
  let frontage = 0;
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const near = (roads || []).some((r) => distancePointToSegment(mid, r.a, r.b) <= (r.width || 10) * 0.65 + 7);
    if (near) frontage += edgeLength(a, b);
  }
  return frontage * WORLD_SCALE;
}

function touchesBoundary(poly, boundary) {
  return (poly || []).some((p) => pointOnGeneratedBoundary(p, boundary));
}

function usableSideCount(poly) {
  let count = 0;
  for (let i = 0; i < poly.length; i += 1) {
    if (edgeLength(poly[i], poly[(i + 1) % poly.length]) * WORLD_SCALE >= 1.25) count += 1;
  }
  return count;
}

function insetPolygon(poly, setbackWorld) {
  if (!poly || poly.length < 3) return [];
  const c = centroid(poly);
  const setback = setbackWorld / WORLD_SCALE;
  const out = poly.map((p) => {
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    const d = Math.hypot(dx, dy);
    if (d < 0.001) return { x: p.x, y: p.y };
    const f = Math.max(0, (d - setback) / d);
    return { x: c.x + dx * f, y: c.y + dy * f };
  });
  return cleanWorldPoly(out);
}

function centeredFootprint(poly, scaleFactor = 0.72) {
  if (!poly || poly.length < 3) return [];
  const c = centroid(poly);
  return cleanWorldPoly(poly.map((p) => ({ x: c.x + (p.x - c.x) * scaleFactor, y: c.y + (p.y - c.y) * scaleFactor })));
}

function buildingSetbackWorld(parcel, metrics) {
  if (parcel.category === 'Industrial') return 3;
  if (metrics.area > 18) return 2.5;
  if (metrics.area > 8) return 1.5;
  return 1;
}

function validateParcelBuildability(parcel, block, districtPoly, roads, cfg) {
  const metrics = worldMetrics(parcel.polygon, { x: 0, y: 0 }, WORLD_SCALE);
  const isEdgeParcel = touchesBoundary(parcel.polygon, districtPoly);
  const roadFrontageLength = parcelRoadFrontage(parcel.polygon, roads);
  const seamRoadFrontage = parcelRoadFrontage(parcel.polygon, (roads || []).filter((road) => road.seam));
  const sides = usableSideCount(parcel.polygon);
  const finite = Array.isArray(parcel.polygon) && parcel.polygon.length >= 3 && parcel.polygon.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
  const insideDistrict = finite && parcel.polygon.every((p) => pointInPoly(p, districtPoly) || pointOnGeneratedBoundary(p, districtPoly));
  const extremelyTiny = metrics.area < 0.12 || metrics.shortest < 0.16;
  const uglyEdgeTriangle = isEdgeParcel && sides < 4 && metrics.area < 0.65;
  let landUse = isEdgeParcel ? 'edge_lot' : roadFrontageLength < 2 ? 'shared_access_lot' : 'empty_lot';
  const densityRoll = hashNumber(`${parcel.id}-density-build`);
  const style = parcel.metadata?.style || '';
  const plannedParkChance = style === 'SUBURB' ? 0.12 : style === 'CIVIC_CENTER' ? 0.08 : 0.035;
  const plannedPark = parcel.inheritedRoadFrontage && densityRoll < plannedParkChance;
  let isBuildable = finite && insideDistrict && !extremelyTiny && !uglyEdgeTriangle;
  if (parcel.inheritedRoadFrontage) isBuildable = isBuildable && !plannedPark;
  else isBuildable = isBuildable && densityRoll <= (cfg.buildChance || 0.8);
  let buildingPolygon = null;
  if (isBuildable) {
    buildingPolygon = insetPolygon(parcel.polygon, buildingSetbackWorld(parcel, metrics));
    const bMetrics = worldMetrics(buildingPolygon, { x: 0, y: 0 }, WORLD_SCALE);
    if (buildingPolygon.length < 3 || bMetrics.area < 0.08 || bMetrics.area > metrics.area * 0.9) {
      buildingPolygon = centeredFootprint(parcel.polygon, 0.72);
    }
    const fMetrics = worldMetrics(buildingPolygon, { x: 0, y: 0 }, WORLD_SCALE);
    if (buildingPolygon.length < 3 || fMetrics.area < 0.08) {
      isBuildable = false;
      buildingPolygon = null;
    }
  }
  if (isBuildable) landUse = 'building';
  if (isBuildable) buildingPolygon = parcel.polygon;
  return Object.assign(parcel, {
    isBuildable,
    isEdgeParcel,
    roadFrontageLength,
    seamRoadFrontage,
    roadAccessWarning: roadFrontageLength < 6,
    landUse,
    buildingPolygon,
    plannedPark,
  });
}

function mergeParcelInto(target, source, block) {
  const b = bounds((target.polygon || []).concat(source.polygon || []));
  const merged = clipPolygonToRect(block.polygon, b.minX, b.minY, b.maxX, b.maxY);
  if (merged.length >= 3 && areaFromPoly(merged) > areaFromPoly(target.polygon)) {
    target.polygon = merged;
    target.propertyValue = Math.round((target.propertyValue || 0) + (source.propertyValue || 0) * 0.35);
    target.landValue = Math.round((target.landValue || 0) + (source.landValue || 0) * 0.25);
    target.mergedParcels = (target.mergedParcels || []).concat(source.id);
    target.streetAccess = true;
    target.accessKind = 'merged frontage lot';
  }
}

function mergeLandlockedParcels(block, districtPoly, roads, cfg) {
  const parcels = block.parcels || [];
  const frontage = parcels.filter((p) => (p.roadFrontageLength || 0) >= 6);
  if (!frontage.length) {
    block.parcels = parcels.map((p) => Object.assign(p, {
      isBuildable: false,
      streetAccess: false,
      accessKind: 'no road frontage',
      landUse: 'park',
      buildingPolygon: null,
    }));
    return;
  }
  const remove = new Set();
  parcels.forEach((p) => {
    if ((p.roadFrontageLength || 0) >= 6) return;
    const pc = centroid(p.polygon);
    let best = null;
    frontage.forEach((q) => {
      const qc = centroid(q.polygon);
      const d = Math.hypot(pc.x - qc.x, pc.y - qc.y);
      if (!best || d < best.d) best = { parcel: q, d };
    });
    if (best) {
      mergeParcelInto(best.parcel, p, block);
      remove.add(p.id);
    }
  });
  block.parcels = parcels.filter((p) => !remove.has(p.id)).map((p) => {
    const checked = validateParcelBuildability(p, block, districtPoly, roads, cfg);
    checked.streetAccess = checked.roadFrontageLength >= 6;
    checked.accessKind = checked.streetAccess ? 'generated road frontage' : 'shared access via nearby frontage parcel';
    return checked;
  });
}

function shapeFromPoly(poly, center, scale) {
  const pts = poly.map((p) => worldPoint(p, center, scale));
  const shape = new THREE.Shape();
  pts.forEach((p, i) => {
    if (i === 0) shape.moveTo(p.x, -p.y);
    else shape.lineTo(p.x, -p.y);
  });
  shape.closePath();
  return shape;
}

function extrusionShapeFromPoly(poly, center, scale) {
  const pts = poly.map((p) => worldPoint(p, center, scale));
  const shape = new THREE.Shape();
  pts.forEach((p, i) => {
    if (i === 0) shape.moveTo(p.x, -p.y);
    else shape.lineTo(p.x, -p.y);
  });
  shape.closePath();
  return shape;
}

function addFlatShape(scene, poly, center, scale, color, y, opacity = 1) {
  if (!poly || poly.length < 3) return null;
  const geo = new THREE.ShapeGeometry(shapeFromPoly(poly, center, scale));
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshLambertMaterial({ color, transparent: opacity < 1, opacity, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = y;
  scene.add(mesh);
  return mesh;
}

function addLineLoop(scene, poly, center, scale, color, y) {
  if (!poly || poly.length < 2) return null;
  const points = poly.map((p) => {
    const q = worldPoint(p, center, scale);
    return new THREE.Vector3(q.x, y, q.y);
  });
  points.push(points[0].clone());
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.72 });
  const line = new THREE.Line(geo, mat);
  scene.add(line);
  return line;
}

function muteObjectMaterials(obj, color, opacity) {
  obj.traverse((child) => {
    if (!child.material) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((mat) => {
      if (mat.color && color !== undefined) mat.color.setHex(color);
      mat.transparent = true;
      mat.opacity = opacity;
      mat.depthWrite = opacity > 0.45;
    });
  });
}

function roadPolysClippedToDistrict(roadPoly, outerPolygon) {
  if (!outerPolygon || outerPolygon.length < 3) return [roadPoly];
  const contour = cleanWorldPoly(outerPolygon).map((p) => new THREE.Vector2(p.x, p.y));
  if (contour.length < 3) return [roadPoly];
  const tris = THREE.ShapeUtils.triangulateShape(contour, []);
  const out = [];
  tris.forEach((tri) => {
    const clipper = tri.map((idx) => ({ x: contour[idx].x, y: contour[idx].y }));
    const clipped = clipPolygonToPolygon(roadPoly, clipper);
    if (clipped.length >= 3 && Math.abs(areaFromPoly(clipped)) > 0.5) out.push(clipped);
  });
  return out;
}

function roadMesh(road, center, scale, aPoint, bPoint, outerPolygon) {
  const sourceA = aPoint || road.a;
  const sourceB = bPoint || road.b;
  const dxSource = sourceB.x - sourceA.x;
  const dySource = sourceB.y - sourceA.y;
  const lenSource = Math.max(0.001, Math.hypot(dxSource, dySource));
  const halfWidth = (road.width || 12) * 0.5;
  const cap = halfWidth * 0.65;
  const ux = dxSource / lenSource;
  const uy = dySource / lenSource;
  const px = -uy * halfWidth;
  const py = ux * halfWidth;
  const a = { x: sourceA.x - ux * cap, y: sourceA.y - uy * cap };
  const b = { x: sourceB.x + ux * cap, y: sourceB.y + uy * cap };
  const roadPoly = [
    { x: a.x + px, y: a.y + py },
    { x: b.x + px, y: b.y + py },
    { x: b.x - px, y: b.y - py },
    { x: a.x - px, y: a.y - py },
  ];
  const roadColors = {
    highway: 0x262a2e,
    arterial: 0x262a2e,
    collector: 0x262a2e,
    local: 0x262a2e,
    avenue: 0x262a2e,
    main: 0x262a2e,
  };
  const mat = new THREE.MeshLambertMaterial({ color: roadColors[road.kind] || 0x30343b });
  const roadY = road.kind === 'highway' ? 0.038 : road.kind === 'arterial' ? 0.036 : road.kind === 'collector' ? 0.034 : 0.032;
  const clippedPolys = outerPolygon ? roadPolysClippedToDistrict(roadPoly, outerPolygon) : [roadPoly];
  const validPolys = clippedPolys.filter((poly) => poly.length >= 3 && Math.abs(areaFromPoly(poly)) > 0.5);
  if (!validPolys.length) return null;
  const group = new THREE.Group();
  validPolys.forEach((poly) => {
    const geo = new THREE.ShapeGeometry(shapeFromPoly(poly, center, scale));
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = roadY;
    group.add(mesh);
  });
  return group;
}

function roadAxisSpanThroughPolygon(road, outerPolygon) {
  if (!outerPolygon || outerPolygon.length < 3) return { a: road.a, b: road.b };
  const dx = road.b.x - road.a.x;
  const dy = road.b.y - road.a.y;
  const denomLen = Math.max(0.001, dx * dx + dy * dy);
  const ts = [];
  if (pointInPoly(road.a, outerPolygon)) ts.push(0);
  if (pointInPoly(road.b, outerPolygon)) ts.push(1);
  for (let i = 0; i < outerPolygon.length; i += 1) {
    const p = outerPolygon[i];
    const q = outerPolygon[(i + 1) % outerPolygon.length];
    const sx = q.x - p.x;
    const sy = q.y - p.y;
    const cross = dx * sy - dy * sx;
    if (Math.abs(cross) < 0.0001) continue;
    const qpx = p.x - road.a.x;
    const qpy = p.y - road.a.y;
    const t = (qpx * sy - qpy * sx) / cross;
    const u = (qpx * dy - qpy * dx) / cross;
    if (t >= -0.001 && t <= 1.001 && u >= -0.001 && u <= 1.001) ts.push(Math.max(0, Math.min(1, t)));
  }
  if (ts.length < 2) return { a: road.a, b: road.b };
  ts.sort((a, b) => a - b);
  const startT = ts[0];
  const endT = ts[ts.length - 1];
  if ((endT - startT) * Math.sqrt(denomLen) < 3) return null;
  return {
    a: { x: road.a.x + dx * startT, y: road.a.y + dy * startT },
    b: { x: road.a.x + dx * endT, y: road.a.y + dy * endT },
  };
}

function roadSpanBlockedByBuildings(span, buildingFootprints, roadWidth = 12) {
  if (!span || !buildingFootprints || !buildingFootprints.length) return false;
  const dx = span.b.x - span.a.x;
  const dy = span.b.y - span.a.y;
  const len = Math.hypot(dx, dy);
  if (len < 3) return false;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const sampleCount = Math.max(18, Math.min(90, Math.round(len / 10)));
  const offsets = [0, roadWidth * 0.22, -roadWidth * 0.22];
  let blocked = 0;
  let longestRun = 0;
  let run = 0;
  for (let i = 1; i < sampleCount; i += 1) {
    const t = i / sampleCount;
    const base = { x: span.a.x + dx * t, y: span.a.y + dy * t };
    const insideBuilding = offsets.some((offset) => {
      const p = { x: base.x + px * offset, y: base.y + py * offset };
      return buildingFootprints.some((footprint) => pointInPoly(p, footprint));
    });
    if (insideBuilding) {
      blocked += 1;
      run += 1;
      longestRun = Math.max(longestRun, run);
    } else {
      run = 0;
    }
  }
  return blocked / Math.max(1, sampleCount - 1) > 0.08 || longestRun >= 3;
}

function clippedRoadMeshes(scene, road, outerPolygon, center, scale, debugGroup, buildingFootprints = []) {
  const span = roadAxisSpanThroughPolygon(road, outerPolygon);
  if (!span) return;
  if (!road.seam && !road.perimeter && roadSpanBlockedByBuildings(span, buildingFootprints, road.width || 12)) return;
  const mesh = roadMesh(road, center, scale, span.a, span.b, outerPolygon);
  if (mesh) scene.add(mesh);
  if (!debugGroup) return;
  const segments = 80;
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const p = { x: span.a.x + (span.b.x - span.a.x) * t, y: span.a.y + (span.b.y - span.a.y) * t };
    const inside = pointInPoly(p, outerPolygon);
    if (i % 4 === 0) {
      const wp = worldPoint(p, center, scale);
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), new THREE.MeshBasicMaterial({ color: inside ? 0x6cff8d : 0xff5a5a }));
      dot.position.set(wp.x, 0.18, wp.y);
      debugGroup.add(dot);
    }
  }
}

function bounds(poly) {
  return poly.reduce((b, p) => ({
    minX: Math.min(b.minX, p.x),
    maxX: Math.max(b.maxX, p.x),
    minY: Math.min(b.minY, p.y),
    maxY: Math.max(b.maxY, p.y),
  }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
}

function areaFromPoly(poly) {
  if (!poly || poly.length < 3) return 0;
  let total = 0;
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    total += a.x * b.y - b.x * a.y;
  }
  return Math.abs(total) / 2;
}

function worldMetrics(poly, center, scale) {
  const b = bounds(poly || []);
  const width = Math.max(0, (b.maxX - b.minX) * scale);
  const depth = Math.max(0, (b.maxY - b.minY) * scale);
  const shortest = Math.min(width, depth);
  const longest = Math.max(width, depth);
  return {
    width,
    depth,
    shortest,
    longest,
    aspect: longest / Math.max(0.001, shortest),
    area: areaFromPoly(poly || []) * scale * scale,
  };
}

function centroid(poly) {
  const sum = poly.reduce((s, p) => ({ x: s.x + p.x, y: s.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / Math.max(1, poly.length), y: sum.y / Math.max(1, poly.length) };
}

function isRoadLikeParcel(parcel, metrics) {
  const text = `${parcel.subtype || ''} ${parcel.category || ''} ${parcel.sector || ''} ${parcel.shape || ''}`.toLowerCase();
  if (/road|street|avenue|sidewalk|median|crosswalk|alley lane/.test(text)) return true;
  if (metrics.aspect > 9) return true;
  if (metrics.aspect > 6 && metrics.shortest < 1.8) return true;
  if (metrics.aspect > 4.5 && metrics.shortest < 1.15) return true;
  if (!parcel.category && metrics.aspect > 4) return true;
  if (metrics.area < 0.28 && metrics.aspect > 3) return true;
  return false;
}

function heightRange(parcel) {
  const text = `${parcel.subtype || ''} ${parcel.sector || ''}`.toLowerCase();
  const cat = parcel.category;
  if (cat === 'Residential') {
    if (/apartment|tower|high-rise/.test(text)) return [4, 8];
    if (/duplex/.test(text)) return [2, 3];
    if (/luxury|mansion/.test(text)) return [2, 5];
    return [1, 2];
  }
  if (cat === 'Commercial') {
    if (/office|law|bank/.test(text)) return [4, 10];
    if (/mall/.test(text)) return [2, 5];
    if (/restaurant|bar|shop|store|pawn|mechanic/.test(text)) return [1, 3];
    return [2, 6];
  }
  if (cat === 'Industrial') {
    if (/heavy/.test(text)) return [4, 8];
    if (/factory|workshop/.test(text)) return [2, 5];
    return [1, 2];
  }
  if (cat === 'Civic') {
    if (/hospital/.test(text)) return [4, 8];
    if (/police|station|bank/.test(text)) return [3, 6];
    return [2, 4];
  }
  if (cat === 'Criminal') {
    if (/casino/.test(text)) return [2, 5];
    if (/crew/.test(text)) return [3, 6];
    return [1, 3];
  }
  return [1, 4];
}

function footprintFactor(parcel) {
  const text = `${parcel.subtype || ''} ${parcel.sizeClass || ''}`.toLowerCase();
  const r = hashNumber(`${parcel.id}-footprint`);
  const between = (a, b) => a + (b - a) * r;
  if (/warehouse|factory|heavy/.test(text)) return between(0.7, 0.9);
  if (/house|safehouse/.test(text)) return between(0.45, 0.62);
  if (/duplex/.test(text)) return between(0.5, 0.65);
  if (/restaurant|bar|shop|store/.test(text)) return between(0.55, 0.72);
  if (/apartment|office|bank|hospital|police|crew|civic/.test(text)) return between(0.6, 0.78);
  if (/tiny|small/.test(text)) return between(0.45, 0.58);
  return between(0.55, 0.7);
}

function buildingChance(parcel) {
  if (parcel.category === 'Residential') return 0.85;
  if (parcel.category === 'Commercial') return 0.8;
  if (parcel.category === 'Industrial') return 0.7;
  if (parcel.category === 'Civic') return 0.75;
  if (parcel.category === 'Criminal') return 0.65;
  return 0.7;
}

function adjustedFloors(parcel, minF, maxF, r, parcelWidth, parcelDepth) {
  const tallAllowed = /office|bank|hospital|apartment|tower|civic|police|crew/i.test(`${parcel.subtype || ''} ${parcel.category || ''}`)
    && Math.min(parcelWidth, parcelDepth) > 0.9
    && (parcel.wealth || 0) > 35;
  let bandMax = maxF;
  if (r < 0.6) bandMax = Math.min(maxF, Math.max(minF, 2));
  else if (r < 0.9) bandMax = Math.min(maxF, Math.max(minF, 5));
  else if (!tallAllowed) bandMax = Math.min(maxF, Math.max(minF, 4));
  let floors = Math.round(minF + r * (bandMax - minF));
  const shortest = Math.min(parcelWidth, parcelDepth);
  const text = `${parcel.subtype || ''} ${parcel.category || ''}`.toLowerCase();
  if (shortest < 0.55) floors = Math.min(floors, 2);
  if (shortest < 0.85) floors = Math.min(floors, 4);
  if (/warehouse|factory|industrial|house|safehouse/.test(text)) floors = Math.min(floors, maxF);
  if (!/office|bank|hospital|apartment|tower|civic/.test(text)) floors = Math.min(floors, 6);
  return Math.max(1, floors);
}

function exactExtrusionFloors(parcel, metrics) {
  const profile = parcel.buildingProfile || profileForSubtype(parcel.category, parcel.subtype);
  if (profile) {
    const r = hashNumber(`${parcel.id}-profile-floors`);
    let minF = profile.floors[0];
    let maxF = profile.floors[1];
    if (metrics.area < 0.75 || metrics.shortest < 0.6) maxF = Math.min(maxF, 1);
    else if (metrics.area < 1.8 || metrics.shortest < 1.0) maxF = Math.min(maxF, 2);
    if (metrics.aspect > 5.5) maxF = Math.min(maxF, 2);
    maxF = Math.max(minF, maxF);
    return Math.max(1, Math.round(minF + r * (maxF - minF)));
  }
  const text = `${parcel.subtype || ''} ${parcel.category || ''} ${parcel.sizeClass || ''}`.toLowerCase();
  let minF = 1;
  let maxF = 2;
  if (/duplex/.test(text)) maxF = 3;
  else if (/apartment/.test(text)) { minF = 2; maxF = 4; }
  else if (/office|bank/.test(text)) { minF = 2; maxF = 4; }
  else if (/hospital|police|station|crew/.test(text)) { minF = 2; maxF = 3; }
  else if (/casino|mall/.test(text)) { minF = 1; maxF = 3; }
  else if (/warehouse/.test(text)) maxF = 2;
  else if (/factory|workshop|industrial/.test(text)) maxF = 3;
  else if (/house|safehouse|drug/.test(text)) maxF = 2;

  if (metrics.shortest < 0.7 || metrics.area < 0.75) maxF = 1;
  else if (metrics.shortest < 1.15 || metrics.area < 1.6) maxF = Math.min(maxF, 2);
  else if (metrics.shortest < 1.65 || metrics.area < 2.8) maxF = Math.min(maxF, 3);
  if (metrics.aspect > 2.6) maxF = Math.min(maxF, 2);
  if (metrics.aspect > 4.2) maxF = 1;

  const tallEligible = /apartment|office|bank|hospital|police|station/.test(text)
    && metrics.shortest > 2.2
    && metrics.area > 5.5
    && hashNumber(`${parcel.id}-rare-tall`) > 0.94;
  if (!tallEligible) maxF = Math.min(maxF, 3);
  if (tallEligible) maxF = Math.min(5, maxF + 1);

  const r = hashNumber(`${parcel.id}-exact-floors`);
  return Math.max(1, Math.min(5, Math.round(minF + r * (Math.max(minF, maxF) - minF))));
}

function heightSanityOk(height, metrics, parcel) {
  return Number.isFinite(height) && height >= 0.55 && height <= 12;
}

function heightForParcel(parcel, metrics) {
  const profile = parcel.buildingProfile || profileForSubtype(parcel.category, parcel.subtype);
  const floors = exactExtrusionFloors(parcel, metrics);
  const heightJitter = 0.88 + hashNumber(`${parcel.id}-height-jitter`) * 0.24;
  let height = floors * FLOOR_HEIGHT * HEIGHT_SCALE * heightJitter;
  if (profile) {
    const minHeight = Math.max(0.65, Math.min(profile.height[0] * HEIGHT_SCALE, 1.15));
    const maxHeight = Math.max(minHeight, profile.height[1] * HEIGHT_SCALE);
    height = Math.max(minHeight, Math.min(maxHeight, height));
  }
  return Math.max(0.65, Math.min(10, height));
}

function addLotSurface(parcel, center, scale, scene, kind = 'empty') {
  const colors = {
    empty: 0x8b8f86,
    park: 0x8b8f86,
    parking: 0x858981,
    yard: 0x81867d,
    plaza: 0x92958d,
    storage: 0x81867d,
  };
  const mesh = addFlatShape(scene, parcel.polygon, center, scale, colors[kind] || colors.empty, 0.025, 0.78);
  if (mesh) mesh.userData.parcel = parcel;
  return mesh;
}

function geometryToWorldXZWithHeight(geo) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    pos.setXYZ(i, x, z, -y);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
}

function addWindows(group, w, d, h, parcel, mat) {
  const density = /office|bank|apartment|hospital|tower|law/i.test(parcel.subtype || '') ? 1 : /warehouse|house|safehouse/i.test(parcel.subtype || '') ? 0.32 : 0.55;
  const floors = Math.max(1, Math.floor(h / 0.55));
  const cols = Math.max(1, Math.floor(Math.max(w, d) / 0.55));
  const maxWindows = 80;
  let made = 0;
  const windowGeo = new THREE.PlaneGeometry(0.16, 0.12);
  const faces = [
    { z: d / 2 + 0.006, rot: 0, useW: true },
    { z: -d / 2 - 0.006, rot: Math.PI, useW: true },
    { x: w / 2 + 0.006, rot: Math.PI / 2, useW: false },
    { x: -w / 2 - 0.006, rot: -Math.PI / 2, useW: false },
  ];
  faces.forEach((face) => {
    const faceCols = Math.max(1, Math.floor((face.useW ? w : d) / 0.48));
    for (let floor = 1; floor < floors && made < maxWindows; floor += 1) {
      for (let col = 1; col < faceCols && made < maxWindows; col += 1) {
        if (hashNumber(`${parcel.id}-${face.rot}-${floor}-${col}`) > density) continue;
        const win = new THREE.Mesh(windowGeo, mat);
        const offset = -((face.useW ? w : d) / 2) + col * ((face.useW ? w : d) / faceCols);
        const y = floor * (h / Math.max(2, floors));
        if (face.useW) win.position.set(offset, y, face.z);
        else win.position.set(face.x, y, offset);
        win.rotation.y = face.rot;
        group.add(win);
        made += 1;
      }
    }
  });
}

function buildingForParcel(parcel, center, scale, materials, rayTargets, buildingMap, debug) {
  const footprint = parcel.buildingPolygon || (debug.exactExtrusion ? null : parcel.polygon);
  if (!parcel.isBuildable || !footprint || footprint.length < 3) return null;
  if (debug.exactExtrusion && footprint.length >= 3) {
    const metrics = worldMetrics(footprint, center, scale);
    const height = heightForParcel(parcel, metrics);
    if (!heightSanityOk(height, metrics, parcel)) return null;
    const palette = colorByCategory[parcel.category] || colorByCategory.Commercial;
    const wall = new THREE.MeshPhongMaterial({ color: palette.wall, emissive: 0x000000, shininess: 10, flatShading: true });
    const geo = new THREE.ExtrudeGeometry(extrusionShapeFromPoly(footprint, center, scale), {
      depth: height,
      bevelEnabled: false,
      curveSegments: 1,
      steps: 1,
    });
    geometryToWorldXZWithHeight(geo);
    const mesh = new THREE.Mesh(geo, wall);
    mesh.position.y = 0.045;
    mesh.userData.parcel = parcel;
    mesh.userData.originalColor = palette.wall;
    const group = new THREE.Group();
    group.add(mesh);
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: debug.exactExtrusion ? 0xf2d68a : 0x2a2419, transparent: true, opacity: debug.exactExtrusion ? 0.78 : 0.35 }),
    );
    edge.position.copy(mesh.position);
    group.add(edge);
    rayTargets.push(mesh);
    const c = centroid(footprint);
    const wp = worldPoint(c, center, scale);
    buildingMap.set(parcel.id, { group, mesh, roofMesh: mesh, parcel, width: 1, depth: 1, height, exact: true, center: wp });
    return group;
  }
  const b = bounds(footprint);
  const c = centroid(footprint);
  const wp = worldPoint(c, center, scale);
  const lotW = Math.max(0.001, (b.maxX - b.minX) * scale);
  const lotD = Math.max(0.001, (b.maxY - b.minY) * scale);
  if (Math.min(lotW, lotD) < 0.22 || hashNumber(`${parcel.id}-spawn`) > buildingChance(parcel)) return null;
  const factor = footprintFactor(parcel);
  const width = Math.max(0.18, lotW * factor);
  const depth = Math.max(0.18, lotD * factor);
  const [minF, maxF] = heightRange(parcel);
  const r = hashNumber(parcel.id || `${c.x}-${c.y}`);
  const floors = adjustedFloors(parcel, minF, maxF, r, lotW, lotD);
  const height = Math.max(0.35, floors * 0.46);
  const palette = colorByCategory[parcel.category] || colorByCategory.Commercial;
  const wall = new THREE.MeshPhongMaterial({ color: palette.wall, emissive: 0x000000, shininess: 18 });
  const roof = new THREE.MeshLambertMaterial({ color: palette.roof });
  const geo = new THREE.BoxGeometry(width, height, depth);
  const mesh = new THREE.Mesh(geo, wall);
  mesh.position.set(wp.x, height / 2 + 0.05, wp.y);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.userData.parcel = parcel;
  mesh.userData.originalColor = palette.wall;
  const group = new THREE.Group();
  group.add(mesh);
  const roofGeo = new THREE.BoxGeometry(width * 1.03, 0.04, depth * 1.03);
  const roofMesh = new THREE.Mesh(roofGeo, roof);
  roofMesh.position.set(wp.x, height + 0.09, wp.y);
  roofMesh.userData.parcel = parcel;
  roofMesh.userData.originalColor = palette.roof;
  group.add(roofMesh);
  const shadowGeo = new THREE.PlaneGeometry(width * 1.08, depth * 1.08);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadow = new THREE.Mesh(shadowGeo, materials.shadow);
  shadow.position.set(wp.x + 0.06, 0.045, wp.y + 0.08);
  group.add(shadow);
  if (debug.windows) addWindows(mesh, width, depth, height, parcel, materials.window);
  rayTargets.push(mesh, roofMesh);
  buildingMap.set(parcel.id, { group, mesh, roofMesh, parcel, width, depth, height });
  return group;
}

function renderContextDistrict(scene, context, basePayload, center, scale, materials) {
  if (!context?.polygon || context.polygon.length < 3) return { buildings: 0 };
  const siblingDistricts = [{ id: basePayload.district?.id, polygon: basePayload.outerPolygon }]
    .concat(basePayload.contextDistricts || [])
    .filter((district) => district?.id !== context.id && district?.polygon?.length >= 3);
  const generated = generate3dDistrict({
    district: context,
    outerPolygon: context.polygon,
    inheritedRoads: context.inheritedRoads || [],
    contextDistricts: siblingDistricts,
    seed: `${basePayload.seed || 0}-${context.id || context.name || 'context'}`,
  });
  const group = new THREE.Group();
  addFlatShape(group, generated.outerPolygon, center, scale, 0x5f6661, -0.012, 0.36);
  const boundary = addLineLoop(group, generated.outerPolygon, center, scale, 0xa9b1a7, 0.018);
  if (boundary) boundary.material.opacity = 0.24;
  (generated.roads || []).forEach((road) => {
    const mesh = roadMesh(road, center, scale, road.a, road.b, generated.outerPolygon);
    if (!mesh) return;
    muteObjectMaterials(mesh, 0x24282b, 0.32);
    group.add(mesh);
  });
  let buildings = 0;
  const dummyTargets = [];
  const dummyMap = new Map();
  (generated.blocks || []).forEach((block) => {
    addFlatShape(group, block.polygon, center, scale, 0x737b72, 0.006, 0.24);
    (block.parcels || []).forEach((parcel) => {
      if (buildings > 220) return;
      const building = buildingForParcel(parcel, center, scale, materials, dummyTargets, dummyMap, { exactExtrusion: true, windows: false });
      if (!building) return;
      muteObjectMaterials(building, 0x6f7773, 0.42);
      group.add(building);
      buildings += 1;
    });
  });
  scene.add(group);
  return { buildings };
}

function renderIslandRoadUnderlay(scene, roads, districts, center, scale) {
  const byId = new Map((districts || []).map((district) => [district.id, district.polygon]));
  roads.forEach((road) => {
    if (!road?.a || !road?.b) return;
    const districtId = String(road.id || '').replace(/^inherited-/, '').split('-').slice(0, -1).join('-');
    const poly = byId.get(districtId);
    const mesh = roadMesh(road, center, scale, road.a, road.b, poly || null);
    if (!mesh) return;
    muteObjectMaterials(mesh, road.kind === 'highway' ? 0x15191e : 0x20252a, 0.36);
    mesh.position.y = -0.002;
    scene.add(mesh);
  });
}

function payloadBounds(payload) {
  return bounds(payload.outerPolygon || []);
}

function buildScene(payload) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111312);
  const debug = Object.assign({}, emptyDebug, payload.debug || {});
  const generated = generate3dDistrict(payload);
  const sceneData = Object.assign({}, payload, generated);
  const b = payloadBounds(sceneData);
  const center = { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 };
  const scale = WORLD_SCALE;
  const rayTargets = [];
  const buildingMap = new Map();
  const buildingQueue = [];
  const buildingFootprints = [];
  let renderedBuildingCount = 0;
  const outlineGroup = new THREE.Group();
  const debugRoadClipGroup = new THREE.Group();
  const debugCameraGroup = new THREE.Group();
  const materials = {
    window: new THREE.MeshBasicMaterial({ color: 0xa8d9e8, transparent: true, opacity: 0.82, side: THREE.DoubleSide }),
    shadow: new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false }),
  };

  const contextDistricts = sceneData.contextDistricts || [];
  const islandRoads = (sceneData.inheritedRoads || []).concat(...contextDistricts.map((district) => district.inheritedRoads || []));
  renderIslandRoadUnderlay(scene, islandRoads, [{ id: sceneData.district?.id, polygon: sceneData.outerPolygon }].concat(contextDistricts), center, scale);

  let contextBuildingCount = 0;
  contextDistricts.forEach((district) => {
    const result = renderContextDistrict(scene, district, payload, center, scale, materials);
    contextBuildingCount += result.buildings || 0;
  });

  addFlatShape(scene, sceneData.outerPolygon, center, scale, 0x969a91, 0, 1);
  const boundary = addLineLoop(scene, sceneData.outerPolygon, center, scale, 0xdfe8d4, 0.08);
  if (boundary) boundary.visible = !!debug.boundary;

  (sceneData.blocks || []).forEach((block) => {
    addFlatShape(scene, block.polygon, center, scale, 0x8e9289, 0.022, 0.72);
    addLineLoop(scene, block.polygon, center, scale, 0x42483f, 0.09);
    const blockArea = Math.max(1, areaFromPoly(block.polygon) * scale * scale);
    let coveredArea = 0;
    const cap = blockArea * (0.65 + hashNumber(`${block.id}-density-cap`) * 0.15);
    (block.parcels || []).forEach((parcel) => {
      const outline = addLineLoop(scene, parcel.polygon, center, scale, debug.exactExtrusion ? 0xffe08a : 0x222222, 0.11);
      if (outline) outlineGroup.add(outline);
      const metrics = worldMetrics(parcel.polygon, center, scale);
      const parcelWorldArea = Math.max(0.001, areaFromPoly(parcel.polygon) * scale * scale);
      const projectedCoverage = parcelWorldArea * Math.pow(footprintFactor(parcel), 2);
      const dense = !debug.exactExtrusion && coveredArea + projectedCoverage > cap;
      let building = null;
      if (!dense) building = buildingForParcel(parcel, center, scale, materials, rayTargets, buildingMap, debug);
      if (!building && debug.exactExtrusion === false && parcel.isBuildable && !parcel.plannedPark) {
        building = buildingForParcel(parcel, center, scale, materials, rayTargets, buildingMap, Object.assign({}, debug, { exactExtrusion: false }));
      }
      if (building) {
        buildingQueue.push(building);
        if (parcel.buildingPolygon && parcel.buildingPolygon.length >= 3) buildingFootprints.push(parcel.buildingPolygon);
        else if (parcel.polygon && parcel.polygon.length >= 3) buildingFootprints.push(parcel.polygon);
        renderedBuildingCount += 1;
        coveredArea += projectedCoverage;
      } else {
        addLotSurface(parcel, center, scale, scene, 'park');
      }
    });
  });

  debugRoadClipGroup.visible = !!debug.roadClipPoints;
  (sceneData.roads || []).forEach((road) => clippedRoadMeshes(scene, road, sceneData.outerPolygon, center, scale, debug.roadClipPoints ? debugRoadClipGroup : null, buildingFootprints));
  scene.add(debugRoadClipGroup);
  buildingQueue.forEach((building) => scene.add(building));
  outlineGroup.visible = !!debug.parcelOutlines;
  scene.add(outlineGroup);

  const targetDot = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffcc66 }));
  targetDot.position.set(0, 0.35, 0);
  debugCameraGroup.add(targetDot);
  debugCameraGroup.visible = !!debug.cameraTarget;
  scene.add(debugCameraGroup);

  const ambient = new THREE.AmbientLight(0xffffff, 1.35);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(18, 26, 12);
  scene.add(sun);

  const roadSpawn = (sceneData.roads || [])[0]
    ? worldPoint({ x: ((sceneData.roads || [])[0].a.x + (sceneData.roads || [])[0].b.x) / 2, y: ((sceneData.roads || [])[0].a.y + (sceneData.roads || [])[0].b.y) / 2 }, center, scale)
    : new THREE.Vector2(0, 0);
  sceneData.renderStats = {
    buildings: renderedBuildingCount,
    contextBuildings: contextBuildingCount,
    parcels: (sceneData.blocks || []).reduce((sum, block) => sum + ((block.parcels || []).length), 0),
  };
  return { scene, rayTargets, center, scale, bounds: b, buildingMap, debugRoadClipGroup, debugCameraGroup, outlineGroup, boundary, roadSpawn, generated: sceneData };
}

function mount(root, payload, onSelect) {
  cleanup(root);
  root._deskDonPayload = payload;
  root._deskDonSelect = onSelect;
  root.dataset.districtId = payload.district?.id || 'district';
  root.innerHTML = '<div class="district-three-loading">Building 3D district...</div>';
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.domElement.className = 'district-three-canvas';
  root.innerHTML = '';
  root.appendChild(renderer.domElement);

  const { scene, rayTargets, buildingMap, debugCameraGroup, center, scale, roadSpawn, generated } = buildScene(payload);
  root._deskDonGenerated = generated;
  const camera = new THREE.OrthographicCamera(-12, 12, 8, -8, 0.1, 1000);
  const streetCamera = new THREE.PerspectiveCamera(62, 1, 0.05, 2000);
  const cameraTarget = new THREE.Vector3(0, 0, 0);
  const viewKey = payload.district?.id || 'district';
  const saved = savedViews.get(viewKey) || {};
  let zoom = saved.zoom || 1;
  let panX = saved.panX || 0;
  let panZ = saved.panZ || 0;
  let azimuth = typeof saved.azimuth === 'number' ? saved.azimuth : Math.PI / 4;
  let elevation = typeof saved.elevation === 'number' ? saved.elevation : Math.PI / 3.1;
  let cameraMode = saved.mode || 'iso';
  let streetPos = saved.streetPos ? new THREE.Vector3(saved.streetPos.x, 1.7, saved.streetPos.z) : new THREE.Vector3(roadSpawn.x, 1.7, roadSpawn.y);
  let streetYaw = typeof saved.streetYaw === 'number' ? saved.streetYaw : azimuth + Math.PI;
  let streetPitch = typeof saved.streetPitch === 'number' ? saved.streetPitch : 0;
  let selectedParcelId = payload.selectedParcelId || saved.selectedParcelId || null;
  let dragging = false;
  let moved = false;
  let dragMode = 'pan';
  let last = { x: 0, y: 0 };
  let start = { x: 0, y: 0 };
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const keyState = new Set();

  const selectedLabel = document.createElement('div');
  selectedLabel.className = 'district-three-debug-label';
  root.appendChild(selectedLabel);
  const versionLabel = document.createElement('div');
  versionLabel.className = 'district-three-version-label';
  const stats = generated.renderStats || { buildings: 0, parcels: 0 };
  versionLabel.textContent = `${RENDERER_VERSION} - ${generated.style} - ${stats.buildings}/${stats.parcels} buildings - ${generated.validation.ok ? 'valid' : generated.validation.issues.length + ' issues'}`;
  root.appendChild(versionLabel);
  const streetInfo = document.createElement('div');
  streetInfo.className = 'district-three-street-info';
  root.appendChild(streetInfo);
  const crosshair = document.createElement('div');
  crosshair.className = 'district-three-crosshair';
  root.appendChild(crosshair);

  function saveView() {
    savedViews.set(viewKey, { zoom, panX, panZ, azimuth, elevation, selectedParcelId, mode: cameraMode, streetPos: { x: streetPos.x, y: streetPos.y, z: streetPos.z }, streetYaw, streetPitch });
  }

  function applyHighlight(parcelId) {
    buildingMap.forEach((entry, id) => {
      const active = id === parcelId;
      entry.mesh.material.color.setHex(active ? 0xffc45f : entry.mesh.userData.originalColor);
      if (entry.mesh.material.emissive) entry.mesh.material.emissive.setHex(active ? 0x3a2608 : 0x000000);
      entry.roofMesh.material.color.setHex(active ? 0xf8df9a : entry.roofMesh.userData.originalColor);
      if (entry.highlight) entry.highlight.visible = active;
      if (active && !entry.highlight) {
        const edge = new THREE.LineSegments(
          new THREE.EdgesGeometry(entry.mesh.geometry),
          new THREE.LineBasicMaterial({ color: 0xffdd8a, transparent: true, opacity: 0.95 }),
        );
        edge.position.copy(entry.mesh.position);
        entry.group.add(edge);
        const glowGeo = new THREE.PlaneGeometry(entry.width * 1.28, entry.depth * 1.28);
        glowGeo.rotateX(-Math.PI / 2);
        const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: 0xffc96b, transparent: true, opacity: 0.22, depthWrite: false }));
        glow.position.set(entry.mesh.position.x, 0.125, entry.mesh.position.z);
        entry.group.add(glow);
        entry.highlight = edge;
        entry.glow = glow;
      }
      if (entry.glow) entry.glow.visible = active;
    });
    selectedLabel.textContent = payload.debug?.selectedParcelId && parcelId ? `Selected parcel: ${parcelId}` : '';
  }

  function setModeUI() {
    root.classList.toggle('street-mode', cameraMode === 'street');
    crosshair.style.display = cameraMode === 'street' ? 'block' : 'none';
    streetInfo.style.display = cameraMode === 'street' ? 'block' : 'none';
  }

  function updateCamera() {
    if (cameraMode === 'street') {
      const dir = new THREE.Vector3(Math.sin(streetYaw) * Math.cos(streetPitch), Math.sin(streetPitch), Math.cos(streetYaw) * Math.cos(streetPitch));
      streetCamera.position.copy(streetPos);
      streetCamera.lookAt(streetPos.clone().add(dir));
      debugCameraGroup.position.set(streetPos.x, 0, streetPos.z);
      saveView();
      return;
    }
    const distance = 48 / zoom;
    const horizontal = Math.cos(elevation) * distance;
    const target = new THREE.Vector3(cameraTarget.x + panX, 0, cameraTarget.z + panZ);
    camera.position.set(target.x + Math.cos(azimuth) * horizontal, Math.sin(elevation) * distance, target.z + Math.sin(azimuth) * horizontal);
    camera.lookAt(target);
    debugCameraGroup.position.set(panX, 0, panZ);
    camera.updateProjectionMatrix();
    saveView();
  }

  function resize() {
    const rect = root.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(260, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const size = 14 / zoom;
    camera.left = -size * aspect;
    camera.right = size * aspect;
    camera.top = size;
    camera.bottom = -size;
    streetCamera.aspect = aspect;
    streetCamera.updateProjectionMatrix();
    updateCamera();
    renderer.render(scene, cameraMode === 'street' ? streetCamera : camera);
  }

  function renderLoop() {
    updateCamera();
    renderer.render(scene, cameraMode === 'street' ? streetCamera : camera);
  }

  function clampStreetPosition(pos) {
    const source = sourcePoint({ x: pos.x, y: pos.z }, center, scale);
    if (pointInPoly(source, payload.outerPolygon)) return pos;
    return streetPos;
  }

  function stepStreet(dt) {
    if (cameraMode !== 'street') return false;
    const speed = (keyState.has('shift') ? 5 : 2.8) * dt;
    let forward = 0;
    let side = 0;
    if (keyState.has('w')) forward += 1;
    if (keyState.has('s')) forward -= 1;
    if (keyState.has('d')) side += 1;
    if (keyState.has('a')) side -= 1;
    if (!forward && !side) return false;
    const f = new THREE.Vector3(Math.sin(streetYaw), 0, Math.cos(streetYaw));
    const r = new THREE.Vector3(Math.cos(streetYaw), 0, -Math.sin(streetYaw));
    const next = streetPos.clone().add(f.multiplyScalar(forward * speed)).add(r.multiplyScalar(side * speed));
    streetPos = clampStreetPosition(next);
    return true;
  }

  let lastFrame = performance.now();
  function animate(now = performance.now()) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastFrame) / 1000));
    lastFrame = now;
    if (cameraMode === 'street') {
      raycaster.setFromCamera(new THREE.Vector2(0, 0), streetCamera);
      const hit = raycaster.intersectObjects(rayTargets, true)[0];
      root.dataset.hoverParcel = hit?.object?.userData?.parcel?.id || '';
      const nearest = (generated.roads || []).reduce((best, r) => {
        const d = distancePointToSegment(sourcePoint({ x: streetPos.x, y: streetPos.z }, center, scale), r.a, r.b);
        return !best || d < best.d ? { id: r.id, d } : best;
      }, null);
      streetInfo.textContent = `Camera ${streetPos.x.toFixed(1)}, ${streetPos.y.toFixed(1)}, ${streetPos.z.toFixed(1)} - height ${streetPos.y.toFixed(1)} - road ${nearest ? nearest.id : 'none'}`;
    }
    if (stepStreet(dt) || cameraMode === 'street') renderLoop();
    const entry = mounted.get(root);
    if (entry) entry.frame = requestAnimationFrame(animate);
  }

  function onWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    zoom = Math.max(0.45, Math.min(3.2, zoom + (e.deltaY < 0 ? 0.12 : -0.12)));
    resize();
  }

  function onPointerDown(e) {
    e.preventDefault();
    e.stopPropagation();
    if (cameraMode === 'street' && document.pointerLockElement !== root) {
      root.requestPointerLock?.();
    }
    if (e.button === 1 || e.button === 0 || e.button === 2) {
      dragging = true;
      moved = false;
      dragMode = cameraMode === 'street' ? 'look' : e.button === 2 ? 'rotate' : 'pan';
      last = { x: e.clientX, y: e.clientY };
      start = { x: e.clientX, y: e.clientY };
      root.setPointerCapture?.(e.pointerId);
    }
  }

  function onPointerMove(e) {
    if (!dragging) return;
    e.preventDefault();
    e.stopPropagation();
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 4) moved = true;
    last = { x: e.clientX, y: e.clientY };
    if (dragMode === 'look') {
      streetYaw += dx * 0.0045;
      streetPitch = Math.max(-0.65, Math.min(0.45, streetPitch - dy * 0.0035));
    } else if (dragMode === 'rotate') {
      azimuth += dx * 0.008;
      elevation = Math.max(0.58, Math.min(1.2, elevation + dy * 0.003));
    } else {
      const factor = 0.018 / zoom;
      const cos = Math.cos(azimuth);
      const sin = Math.sin(azimuth);
      panX -= (dx * sin + dy * cos) * factor;
      panZ += (dx * cos - dy * sin) * factor;
    }
    renderLoop();
  }

  function onPointerUp(e) {
    e.preventDefault();
    e.stopPropagation();
    const wasMoved = moved;
    dragging = false;
    moved = false;
    try { root.releasePointerCapture?.(e.pointerId); } catch {}
    if (wasMoved) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    if (cameraMode === 'street') {
      pointer.x = 0;
      pointer.y = 0;
    }
    raycaster.setFromCamera(pointer, cameraMode === 'street' ? streetCamera : camera);
    const hit = raycaster.intersectObjects(rayTargets, true)[0];
    if (hit?.object?.userData?.parcel && typeof onSelect === 'function') {
      selectedParcelId = hit.object.userData.parcel.id;
      applyHighlight(selectedParcelId);
      saveView();
      onSelect(hit.object.userData.parcel);
      renderLoop();
    }
  }

  const onResize = () => resize();
  const onContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDocumentMouseMove = (e) => {
    if (cameraMode !== 'street' || document.pointerLockElement !== root) return;
    streetYaw += (e.movementX || 0) * 0.0024;
    streetPitch = Math.max(-0.72, Math.min(0.55, streetPitch - (e.movementY || 0) * 0.002));
    renderLoop();
  };
  const onKeyDown = (e) => {
    const key = String(e.key || '').toLowerCase();
    if (cameraMode !== 'street') return;
    if (['w', 'a', 's', 'd', 'shift', 'escape', 'e'].includes(key)) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (key === 'escape') {
      if (document.pointerLockElement === root) document.exitPointerLock?.();
      cameraMode = 'iso';
      setModeUI();
      renderLoop();
      return;
    }
    if (key === 'e') {
      raycaster.setFromCamera(new THREE.Vector2(0, 0), streetCamera);
      const hit = raycaster.intersectObjects(rayTargets, true)[0];
      if (hit?.object?.userData?.parcel && typeof onSelect === 'function') {
        selectedParcelId = hit.object.userData.parcel.id;
        applyHighlight(selectedParcelId);
        onSelect(hit.object.userData.parcel);
      }
      renderLoop();
      return;
    }
    keyState.add(key);
  };
  const onKeyUp = (e) => keyState.delete(String(e.key || '').toLowerCase());
  root.addEventListener('wheel', onWheel, { passive: false });
  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerUp);
  root.addEventListener('pointerleave', onPointerUp);
  root.addEventListener('contextmenu', onContextMenu);
  window.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('keyup', onKeyUp, true);
  document.addEventListener('mousemove', onDocumentMouseMove);
  window.addEventListener('resize', onResize);

  resize();
  setModeUI();
  applyHighlight(selectedParcelId);
  const frame = requestAnimationFrame(animate);
  mounted.set(root, { renderer, scene, onResize, onWheel, onPointerDown, onPointerMove, onPointerUp, onContextMenu, onKeyDown, onKeyUp, onDocumentMouseMove, frame });
}

function withMounted(root, fn) {
  const entry = mounted.get(root);
  if (entry) fn(entry);
}

function rotate(root, delta) {
  const key = root?.dataset?.districtId || 'district';
  const view = savedViews.get(key) || {};
  view.azimuth = (typeof view.azimuth === 'number' ? view.azimuth : Math.PI / 4) + delta;
  savedViews.set(key, view);
  if (root) mount(root, root._deskDonPayload, root._deskDonSelect);
}

function cameraView(root, mode) {
  const key = root?.dataset?.districtId || 'district';
  const view = savedViews.get(key) || {};
  if (mode === 'top') {
    view.mode = 'top';
    view.elevation = 1.2;
    view.azimuth = 0;
  } else if (mode === 'street') {
    view.mode = 'street';
  } else {
    view.mode = 'iso';
    view.elevation = Math.PI / 3.1;
    view.azimuth = Math.PI / 4;
  }
  savedViews.set(key, view);
  if (root) mount(root, root._deskDonPayload, root._deskDonSelect);
}

function resetCamera(root) {
  const key = root?.dataset?.districtId || 'district';
  savedViews.delete(key);
  if (root) mount(root, root._deskDonPayload, root._deskDonSelect);
}

window.DeskDon3D = { mount, cleanup, rotate, cameraView, resetCamera };
window.DeskDon3D.exportData = function exportData(root) {
  return root?._deskDonGenerated || null;
};
window.dispatchEvent(new Event('deskdon-three-ready'));
