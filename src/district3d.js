import * as THREE from '/node_modules/three/build/three.module.js';
import { mergeGeometries } from '/node_modules/three/examples/jsm/utils/BufferGeometryUtils.js';
import { FontLoader } from '/node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '/node_modules/three/examples/jsm/geometries/TextGeometry.js';
import helvetikerBold from '/node_modules/three/examples/fonts/helvetiker_bold.typeface.json';

const mounted = new Map();
const savedViews = new Map();
const RENDERER_VERSION = '3d-first-district-generator-v34-convex-districts-visual-exact-only';
const WORLD_SCALE = 0.1;
const FLOOR_HEIGHT = 2.35;
const HEIGHT_SCALE = 0.33;
const INFO_AREA_SCALE = 13;
const ICON_FONT = new FontLoader().parse(helvetikerBold);
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

function lerpValue(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(a, b, t) {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return ca.lerp(cb, t);
}

function lightingAtPhase(phase) {
  const p = ((phase % 1) + 1) % 1;
  const stops = [
    { p: 0, bg: 0x05070b, ambientColor: 0x6f7fa4, ambient: 0.34, sunColor: 0x7186b5, sun: 0.08, sunPos: [-6, 5, -12] },
    { p: 0.208, bg: 0x070a10, ambientColor: 0x8996ae, ambient: 0.44, sunColor: 0xa8a0bd, sun: 0.16, sunPos: [18, 6, -10] },
    { p: 0.25, bg: 0x12100d, ambientColor: 0xe5b985, ambient: 0.78, sunColor: 0xffb061, sun: 0.72, sunPos: [18, 9, -5] },
    { p: 0.333, bg: 0x111512, ambientColor: 0xe8e1c8, ambient: 1.02, sunColor: 0xffdf9a, sun: 1.05, sunPos: [15, 17, 8] },
    { p: 0.5, bg: 0x121613, ambientColor: 0xf3edd6, ambient: 1.16, sunColor: 0xfff0c8, sun: 1.34, sunPos: [3, 25, 18] },
    { p: 0.708, bg: 0x15110e, ambientColor: 0xd6ae83, ambient: 0.86, sunColor: 0xffbf72, sun: 0.86, sunPos: [-15, 12, 8] },
    { p: 0.792, bg: 0x090b10, ambientColor: 0x8fa0c0, ambient: 0.48, sunColor: 0xb08ccc, sun: 0.24, sunPos: [-18, 6, -6] },
    { p: 0.875, bg: 0x05070b, ambientColor: 0x6f7fa4, ambient: 0.34, sunColor: 0x7186b5, sun: 0.08, sunPos: [-8, 5, -12] },
    { p: 1, bg: 0x05070b, ambientColor: 0x6f7fa4, ambient: 0.34, sunColor: 0x7186b5, sun: 0.08, sunPos: [-6, 5, -12] },
  ];
  let a = stops[0];
  let b = stops[1];
  for (let i = 0; i < stops.length - 1; i += 1) {
    if (p >= stops[i].p && p <= stops[i + 1].p) {
      a = stops[i];
      b = stops[i + 1];
      break;
    }
  }
  const t = (p - a.p) / Math.max(0.001, b.p - a.p);
  return {
    bg: lerpColor(a.bg, b.bg, t),
    ambientColor: lerpColor(a.ambientColor, b.ambientColor, t),
    ambient: lerpValue(a.ambient, b.ambient, t),
    sunColor: lerpColor(a.sunColor, b.sunColor, t),
    sun: lerpValue(a.sun, b.sun, t),
    sunPos: a.sunPos.map((v, i) => lerpValue(v, b.sunPos[i], t)),
    nightMix: p >= 0.875 || p < 0.208 ? 1 : p >= 0.792 ? (p - 0.792) / 0.083 : p < 0.25 ? (0.25 - p) / 0.042 : 0,
  };
}

function periodIndex(period) {
  const names = ['morning', 'afternoon', 'evening', 'night'];
  return Math.max(0, names.indexOf(String(period || 'Morning').toLowerCase()));
}

function lightingForPeriod(period) {
  return lightingAtPhase(periodIndex(period) / 4);
}

function lightingForPayload(payload) {
  if (Number.isFinite(Number(payload?.timeMinuteOfDay))) return lightingAtPhase(Number(payload.timeMinuteOfDay) / 1440);
  return lightingForPeriod(payload?.timePeriod);
}

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
  root.removeEventListener('pointercancel', entry.onPointerCancel || entry.onPointerUp);
  root.removeEventListener('pointerleave', entry.onPointerLeave || entry.onPointerUp);
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

function transformPointAffine(p, affine) {
  const s = affine?.scale || 1;
  return { x: p.x * s + (affine?.tx || 0), y: p.y * s + (affine?.ty || 0) };
}

function transformPolyAffine(poly, affine) {
  return cleanWorldPoly((poly || []).map((p) => transformPointAffine(p, affine)));
}

function transformRoadAffine(road, affine) {
  const a = transformPointAffine(road.a, affine);
  const b = transformPointAffine(road.b, affine);
  return Object.assign({}, road, { a, b, centerline: [a, b] });
}

function transformParcelAffine(parcel, affine) {
  return Object.assign({}, parcel, {
    polygon: transformPolyAffine(parcel.polygon, affine),
    buildingPolygon: parcel.buildingPolygon ? transformPolyAffine(parcel.buildingPolygon, affine) : parcel.buildingPolygon,
  });
}

function transformBlockAffine(block, affine) {
  const polygon = transformPolyAffine(block.polygon, affine);
  return Object.assign({}, block, {
    polygon,
    area: areaFromPoly(polygon),
    parcels: (block.parcels || []).map((parcel) => transformParcelAffine(parcel, affine)),
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

function cleanRectBlockScore(poly) {
  const pts = cleanWorldPoly(poly || []);
  if (pts.length !== 4) return null;
  const b = bounds(pts);
  const width = Math.max(0.001, b.maxX - b.minX);
  const depth = Math.max(0.001, b.maxY - b.minY);
  const fill = areaFromPoly(pts) / Math.max(0.001, width * depth);
  const aspect = Math.min(width, depth) / Math.max(width, depth);
  const axisAligned = pts.every((p) => {
    const onX = Math.abs(p.x - b.minX) < 0.2 || Math.abs(p.x - b.maxX) < 0.2;
    const onY = Math.abs(p.y - b.minY) < 0.2 || Math.abs(p.y - b.maxY) < 0.2;
    return onX && onY;
  });
  if (!axisAligned || fill < 0.985 || aspect < 0.55) return null;
  return { width, depth, aspect, fill };
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
  const payloadEstate = (payload.blocks || []).flatMap((block) => block.parcels || []).find((parcel) => parcel?.isFamilyEstate);
  if (payloadEstate) {
    const estatePoly = rotateVertical ? transformPolygon(payloadEstate.polygon || [], rotateForGenerationPoint, pivot) : cleanWorldPoly(payloadEstate.polygon || []);
    const estateCenter = centroid(estatePoly);
    let best = null;
    blocks.forEach((block) => {
      const rectScore = cleanRectBlockScore(block.polygon || []);
      if (!rectScore) return;
      const blockCenter = centroid(block.polygon || []);
      const distance = Math.hypot(blockCenter.x - estateCenter.x, blockCenter.y - estateCenter.y);
      const blockArea = areaFromPoly(block.polygon || []);
      const displayedArea = worldMetrics(block.polygon || [], { x: 0, y: 0 }, WORLD_SCALE).area * INFO_AREA_SCALE;
      if (displayedArea < 500) return;
      const score = distance - Math.min(blockArea, 7200) * 0.004 - rectScore.aspect * 18 - rectScore.fill * 8;
      if (!best || score < best.score) best = { block, score };
    });
    if (best?.block) {
      const generatedPoly = best.block.polygon;
      const estateParcel = Object.assign({}, payloadEstate, {
        id: payloadEstate.id,
        blockId: best.block.id,
        polygon: generatedPoly,
        buildingPolygon: generatedPoly,
        isBuildable: true,
        isFamilyEstate: true,
        subtype: 'Family Estate',
        category: 'Residential',
        sector: 'Family Headquarters',
        label: 'Family Estate',
        displayName: 'Family Estate',
        buildingProfile: { category: 'Residential', subtype: 'Family Estate', floors: [1, 3], height: [3, 9], footprint: [0.35, 0.6] },
      });
      best.block.parcels = [estateParcel];
      best.block.dominantCategory = 'Family Estate';
    }
  }
  if (!payload.playerSafehouse || payload.playerSafehouse.districtId === payload.district?.id) {
    const candidates = [];
    const fallbacks = [];
    const anyBuildable = [];
    blocks.forEach((block) => {
      (block.parcels || []).forEach((parcel) => {
        const text = `${parcel.subtype || ''} ${parcel.category || ''}`.toLowerCase();
        const parcelArea = worldMetrics(parcel.polygon || [], { x: 0, y: 0 }, WORLD_SCALE).area * INFO_AREA_SCALE;
        if (parcel.isFamilyEstate) return;
        if (parcel.isBuildable) anyBuildable.push({ block, parcel, score: Math.abs(parcelArea - 120) + (parcel.category === 'Residential' ? 0 : 260) });
        if (parcel.category !== 'Residential') return;
        fallbacks.push({ block, parcel, score: Math.abs(parcelArea - 120) + (/small house/.test(text) ? 0 : 36) + (parcelArea > 1100 ? 90 : 0) });
        if (!/small house|apartment/.test(text)) return;
        if (parcelArea < 18) return;
        candidates.push({ block, parcel, score: Math.abs(parcelArea - 120) + (/small house/.test(text) ? 0 : 24) + (parcelArea > 900 ? 80 : 0) });
      });
    });
    candidates.sort((a, b) => a.score - b.score);
    fallbacks.sort((a, b) => a.score - b.score);
    anyBuildable.sort((a, b) => a.score - b.score);
    const chosen = candidates[0] || fallbacks[0] || anyBuildable[0];
    if (chosen?.parcel) {
      Object.assign(chosen.parcel, {
        id: payload.playerSafehouse?.parcelId || chosen.parcel.id,
        blockId: chosen.block.id,
        label: 'Starting Safehouse',
        displayName: 'Starting Safehouse',
        isPlayerSafehouse: true,
        isSafehouse: true,
        defaultFactionControl: 'player_family',
        occupiedBy: 'player_family',
        familyId: 'player',
        description: 'The family starting house: small, quiet, and useful as the first private place to hide, plan, and recover.',
        security: Math.max(chosen.parcel.security || 0, 48),
        strategicValue: Math.max(chosen.parcel.strategicValue || 0, 70),
      });
    }
  }
  if (payload.startingProtectionDistrictId && payload.startingProtectionDistrictId === payload.district?.id) {
    const protectedState = payload.protectedBusinesses || {};
    const commercial = [];
    blocks.forEach((block) => (block.parcels || []).forEach((parcel) => {
      if (parcel.category === 'Commercial' && parcel.isBuildable && !parcel.isFamilyEstate) commercial.push(parcel);
    }));
    commercial.sort((a, b) => hashNumber(`${payload.district?.id}-protect-${a.id}`) - hashNumber(`${payload.district?.id}-protect-${b.id}`));
    commercial.slice(0, 5).forEach((parcel) => {
      parcel.mafiaProtected = true;
      parcel.protectionFamily = 'player';
      parcel.protectionColor = payload.mafiaColor || '#6fb35e';
      parcel.racketWeeklyDue = Math.max(10, Math.round((parcel.propertyValue || 1000) * 0.004));
      parcel.racketReady = !!payload.collectionRushActive;
    });
    Object.keys(protectedState).forEach((id) => {
      const parcel = commercial.find((p) => p.id === id) || blocks.flatMap((block) => block.parcels || []).find((p) => p.id === id);
      if (parcel) {
        parcel.mafiaProtected = true;
        parcel.protectionFamily = protectedState[id].family || 'player';
        parcel.protectionColor = protectedState[id].color || payload.mafiaColor || '#6fb35e';
        parcel.racketWeeklyDue = protectedState[id].weeklyDue || 0;
        parcel.racketReady = !!protectedState[id].ready;
      }
    });
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

function perimeterFromPoly(poly) {
  if (!poly || poly.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    total += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return total;
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
    perimeter: perimeterFromPoly(poly || []) * scale,
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

function openingCountsForParcel(parcel, metrics, height) {
  const area = metrics.area || 0;
  const floors = Math.max(1, Math.round(height / Math.max(0.45, FLOOR_HEIGHT * HEIGHT_SCALE)));
  const dense = /office|bank|apartment|hospital|hotel|tower|condo/i.test(parcel.subtype || '');
  const sparse = /warehouse|factory|heavy|house|safehouse/i.test(parcel.subtype || '');
  const baseWindows = Math.max(1, Math.round(area * (dense ? 1.15 : sparse ? 0.32 : 0.58)));
  const jitter = 0.72 + hashNumber(`${parcel.id}-opening-jitter`) * 0.74;
  const windows = Math.max(0, Math.min(180, Math.round(baseWindows * jitter * Math.max(0.65, floors * 0.55))));
  const doors = Math.max(1, Math.min(8, Math.round(Math.sqrt(Math.max(1, area)) / (dense ? 2.9 : sparse ? 3.8 : 3.3) + hashNumber(`${parcel.id}-doors`) * 1.8)));
  return { doors, windows, floors };
}

function classifyShape(poly, metrics) {
  const corners = Math.max(0, (poly || []).length);
  if (corners <= 3) return 'Triangular';
  if (corners > 6) return 'Irregular polyhedron';
  if (metrics.aspect < 1.18) return 'Square';
  return 'Rectangular';
}

function floorPlanDensity(metrics) {
  const compactness = metrics.perimeter * metrics.perimeter / Math.max(0.001, metrics.area);
  if (compactness > 28 || metrics.aspect > 3.3) return 'Highly fragmented';
  if (compactness < 18 && metrics.aspect < 1.8) return 'Open layout';
  return 'Standard';
}

function buildingVisualProfile(parcel, footprint, metrics, height) {
  const openings = openingCountsForParcel(parcel, metrics, height);
  const airspace = metrics.area * height;
  const surfaceMass = (metrics.perimeter * height + metrics.area * 2) * 0.42;
  return {
    footprint: Number(metrics.area.toFixed(2)),
    width: Number(metrics.width.toFixed(2)),
    depth: Number(metrics.depth.toFixed(2)),
    perimeter: Number(metrics.perimeter.toFixed(2)),
    airspace: Number(airspace.toFixed(2)),
    height: Number(height.toFixed(2)),
    floors: openings.floors,
    volumetricFootprint: Number((airspace / Math.max(0.001, metrics.area)).toFixed(2)),
    shape: classifyShape(footprint, metrics),
    floorPlanDensity: floorPlanDensity(metrics),
    corners: Math.max(0, (footprint || []).length),
    maxStorageVolume: Number((airspace * 0.7).toFixed(2)),
    maxPersonnel: Math.max(1, Math.floor(airspace / 15)),
    frontageWidth: Number(Math.max(metrics.width, metrics.depth).toFixed(2)),
    perimeterDefense: Number(metrics.perimeter.toFixed(2)),
    ingress: openings.doors + openings.windows,
    doors: openings.doors,
    windows: openings.windows,
    structuralMass: Number(surfaceMass.toFixed(2)),
  };
}

function addFacadeOpenings(group, centerPoint, width, depth, height, counts, materials) {
  const windows = Math.min(80, counts.windows || 0);
  const doors = Math.max(1, counts.doors || 1);
  const levels = Math.max(1, counts.floors || 1);
  const perLevel = Math.max(1, Math.ceil(windows / Math.max(1, levels)));
  const windowGeo = new THREE.PlaneGeometry(0.13, 0.1);
  for (let i = 0; i < windows; i += 1) {
    const face = i % 2;
    const level = Math.floor(i / Math.max(1, perLevel));
    const slot = i % perLevel;
    const usable = Math.max(0.25, width * 0.82);
    const x = centerPoint.x - usable / 2 + ((slot + 0.5) / perLevel) * usable;
    const y = 0.18 + Math.min(level + 1, levels) * (height / (levels + 1));
    const z = centerPoint.y + (face === 0 ? depth / 2 + 0.008 : -depth / 2 - 0.008);
    const win = new THREE.Mesh(windowGeo, materials.window);
    win.position.set(x, y, z);
    win.rotation.y = face === 0 ? 0 : Math.PI;
    group.add(win);
  }
  const doorGeo = new THREE.PlaneGeometry(0.18, 0.32);
  for (let i = 0; i < doors; i += 1) {
    const usable = Math.max(0.25, width * 0.72);
    const x = centerPoint.x - usable / 2 + ((i + 0.5) / doors) * usable;
    const door = new THREE.Mesh(doorGeo, materials.door);
    door.position.set(x, 0.21, centerPoint.y + depth / 2 + 0.01);
    group.add(door);
  }
}

function estateInnerRectangle(footprint) {
  const b = bounds(footprint);
  const spanX = Math.max(0.001, b.maxX - b.minX);
  const spanY = Math.max(0.001, b.maxY - b.minY);
  const w = Math.max(0.001, spanX * 0.36);
  const d = Math.max(0.001, spanY * 0.46);
  const cx = b.minX + spanX * 0.72;
  const cy = b.minY + spanY * 0.52;
  return [
    { x: cx - w / 2, y: cy - d / 2 },
    { x: cx + w / 2, y: cy - d / 2 },
    { x: cx + w / 2, y: cy + d / 2 },
    { x: cx - w / 2, y: cy + d / 2 },
  ];
}

function estateDrivewayRectangle(footprint, mansionRect) {
  const b = bounds(footprint);
  const mb = bounds(mansionRect);
  const spanX = Math.max(0.001, b.maxX - b.minX);
  const spanY = Math.max(0.001, b.maxY - b.minY);
  const x0 = b.minX;
  const x1 = Math.max(x0 + spanX * 0.18, Math.min(b.minX + spanX * 0.48, mb.minX - spanX * 0.04));
  const centerY = (mb.minY + mb.maxY) / 2;
  const drivewayDepth = Math.min(spanY * 0.38, Math.max(spanY * 0.24, (mb.maxY - mb.minY) * 0.76));
  const y0 = Math.max(b.minY, centerY - drivewayDepth / 2);
  const y1 = Math.min(b.maxY, centerY + drivewayDepth / 2);
  return [
    { x: x0, y: y0 },
    { x: x1, y: y0 },
    { x: x1, y: y1 },
    { x: x0, y: y1 },
  ];
}

function addEstateFlatRect(group, poly, center, scale, color, y, opacity = 1) {
  const mesh = new THREE.Mesh(
    new THREE.ShapeGeometry(extrusionShapeFromPoly(poly, center, scale)),
    new THREE.MeshLambertMaterial({ color, transparent: opacity < 1, opacity, side: THREE.DoubleSide }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  group.add(mesh);
  return mesh;
}

function iconCanvasTexture(kind, mode = 'face') {
  const canvas = document.createElement('canvas');
  canvas.width = 192;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineJoin = 'miter';
  ctx.lineCap = 'butt';
  const green = '#78b136';
  const black = '#050705';
  if (kind === 'money') {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 150px Georgia, serif';
    if (mode !== 'shadow') {
      ctx.lineWidth = 18;
      ctx.strokeStyle = black;
      ctx.strokeText('$', 96, 99);
    }
    ctx.fillStyle = mode === 'shadow' ? black : green;
    ctx.fillText('$', 96, 99);
  } else {
    const drawHouse = (pad, color) => {
      const roofY = 35 + pad;
      const eaveY = 80 + pad * 0.45;
      const baseY = 163 - pad;
      const left = 39 + pad;
      const right = 153 - pad;
      ctx.beginPath();
      ctx.moveTo(left, baseY);
      ctx.lineTo(left, eaveY);
      ctx.lineTo(28 + pad * 0.25, eaveY);
      ctx.lineTo(96, roofY);
      ctx.lineTo(164 - pad * 0.25, eaveY);
      ctx.lineTo(right, eaveY);
      ctx.lineTo(right, baseY);
      ctx.lineTo(117 - pad * 0.55, baseY);
      ctx.lineTo(117 - pad * 0.55, 116);
      ctx.lineTo(84 + pad * 0.55, 116);
      ctx.lineTo(84 + pad * 0.55, baseY);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };
    if (mode === 'shadow') drawHouse(0, black);
    else {
      drawHouse(0, black);
      drawHouse(13, green);
    }
    ctx.fillStyle = black;
    if (mode !== 'shadow') ctx.fillRect(85, 116, 31, 47);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function makeHouseIconShape(scale = 1) {
  const pts = [
    [-0.42, -0.42], [-0.42, 0.10], [-0.56, 0.10], [0, 0.58], [0.56, 0.10], [0.42, 0.10],
    [0.42, -0.42], [0.15, -0.42], [0.15, -0.06], [-0.15, -0.06], [-0.15, -0.42],
  ];
  const shape = new THREE.Shape();
  pts.forEach(([px, py], i) => {
    const x = px * scale;
    const y = py * scale;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

function offsetIconPolygon(points, distance) {
  const area = points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point[0] * next[1] - next[0] * point[1];
  }, 0) / 2;
  const outward = area > 0 ? 1 : -1;
  return points.map((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const edgeA = [point[0] - previous[0], point[1] - previous[1]];
    const edgeB = [next[0] - point[0], next[1] - point[1]];
    const lengthA = Math.hypot(edgeA[0], edgeA[1]) || 1;
    const lengthB = Math.hypot(edgeB[0], edgeB[1]) || 1;
    const normalA = [outward * edgeA[1] / lengthA, -outward * edgeA[0] / lengthA];
    const normalB = [outward * edgeB[1] / lengthB, -outward * edgeB[0] / lengthB];
    const lineA = [previous[0] + normalA[0] * distance, previous[1] + normalA[1] * distance];
    const lineB = [point[0] + normalB[0] * distance, point[1] + normalB[1] * distance];
    const determinant = edgeA[0] * edgeB[1] - edgeA[1] * edgeB[0];
    if (Math.abs(determinant) < 0.00001) {
      return [point[0] + normalA[0] * distance, point[1] + normalA[1] * distance];
    }
    const deltaX = lineB[0] - lineA[0];
    const deltaY = lineB[1] - lineA[1];
    const t = (deltaX * edgeB[1] - deltaY * edgeB[0]) / determinant;
    return [lineA[0] + edgeA[0] * t, lineA[1] + edgeA[1] * t];
  });
}

function makeHouseIconCoreShape(greenScale = 0.92, floorY = -0.42) {
  const greenOutline = [
    [-0.42 * greenScale, floorY], [-0.42 * greenScale, 0.10 * greenScale],
    [-0.56 * greenScale, 0.10 * greenScale], [0, 0.58 * greenScale],
    [0.56 * greenScale, 0.10 * greenScale], [0.42 * greenScale, 0.10 * greenScale],
    [0.42 * greenScale, floorY],
  ];
  const pts = offsetIconPolygon(greenOutline, 0.04);
  pts[0][1] = floorY;
  pts[pts.length - 1][1] = floorY;
  const shape = new THREE.Shape();
  pts.forEach(([px, py], i) => {
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  });
  shape.closePath();
  return shape;
}

function addExtrudedShapeLayer(group, shape, mat, z, depth) {
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 1, steps: 1 });
  geo.translate(0, 0, z - depth / 2);
  const mesh = new THREE.Mesh(geo, mat);
  group.add(mesh);
  return mesh;
}

function addSolidHouseIcon(icon) {
  const blackMat = new THREE.MeshBasicMaterial({ color: 0x050705, transparent: false, opacity: 1, depthTest: true, depthWrite: true, side: THREE.DoubleSide });
  const greenMat = new THREE.MeshBasicMaterial({ color: 0x28b84f, transparent: false, opacity: 1, depthTest: true, depthWrite: true, side: THREE.DoubleSide });
  const greenScale = 0.92;
  const floorY = -0.42 * greenScale;
  addExtrudedShapeLayer(icon, makeHouseIconCoreShape(greenScale, floorY), blackMat, 0, 0.10);
  addExtrudedShapeLayer(icon, makeHouseIconShape(greenScale), greenMat, 0.08, 0.05);
  addExtrudedShapeLayer(icon, makeHouseIconShape(greenScale), greenMat.clone(), -0.08, 0.05);
}

function addDollarGlyphLayer(icon, mat, scale, z, depth) {
  const geometry = new TextGeometry('$', {
    font: ICON_FONT,
    size: 1,
    depth,
    curveSegments: 8,
    bevelEnabled: false,
  });
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;
  const width = bounds.max.x - bounds.min.x;
  const height = bounds.max.y - bounds.min.y;
  geometry.translate(-bounds.min.x - width / 2, -bounds.min.y - height / 2, z - depth / 2);
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.scale.set(scale, scale, 1);
  icon.add(mesh);
}

function addSolidMoneyIcon(icon) {
  const blackMat = new THREE.MeshBasicMaterial({ color: 0x050705, transparent: false, opacity: 1, depthTest: true, depthWrite: true, side: THREE.DoubleSide });
  const greenMat = new THREE.MeshBasicMaterial({ color: 0x28b84f, transparent: false, opacity: 1, depthTest: true, depthWrite: true, side: THREE.DoubleSide });
  addDollarGlyphLayer(icon, blackMat, 1.10, 0, 0.10);
  addDollarGlyphLayer(icon, greenMat, 1, 0.08, 0.05);
  addDollarGlyphLayer(icon, greenMat.clone(), 1, -0.08, 0.05);
}

function addLayeredIcon(group, x, y, z, kind, scale = 1) {
  const icon = new THREE.Group();
  icon.userData.safehouseIcon = true;
  icon.userData.baseY = y;
  icon.position.set(x, y, z);
  icon.scale.setScalar(scale);
  if (kind === 'house') addSolidHouseIcon(icon);
  else addSolidMoneyIcon(icon);
  icon.traverse((obj) => {
    if (obj.isMesh) {
      obj.renderOrder = 0;
      if (obj.material) {
        obj.material.transparent = false;
        obj.material.opacity = 1;
        obj.material.depthTest = true;
        obj.material.depthWrite = true;
        obj.material.needsUpdate = true;
      }
    }
  });
  group.add(icon);
  return icon;
}

function addSafehouseIcon(group, x, y, z) {
  return addLayeredIcon(group, x, y, z, 'house', 1);
}

function addMoneyIcon(group, x, y, z) {
  const icon = addLayeredIcon(group, x, y, z, 'money', 0.9);
  icon.userData.moneyIcon = true;
  return icon;
}

function addProtectionOverlay(group, footprint, center, scale, wp, width, depth, height, color) {
  const overlay = new THREE.Group();
  overlay.userData.protectionStripes = true;
  const stripeCanvas = document.createElement('canvas');
  stripeCanvas.width = 1024;
  stripeCanvas.height = 1024;
  const ctx = stripeCanvas.getContext('2d');
  ctx.clearRect(0, 0, 1024, 1024);
  ctx.strokeStyle = '#ff2020';
  ctx.globalAlpha = 1;
  ctx.lineCap = 'square';
  ctx.lineWidth = 104;
  for (let i = -1024; i <= 2048; i += 240) {
    ctx.beginPath();
    ctx.moveTo(i, 1024);
    ctx.lineTo(i + 1024, 0);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(stripeCanvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.48, depthWrite: false, depthTest: true, side: THREE.DoubleSide });
  const roofY = height + 0.12;
  if (footprint && footprint.length >= 3) {
    const roofGeometry = new THREE.ShapeGeometry(extrusionShapeFromPoly(footprint, center, scale));
    roofGeometry.computeBoundingBox();
    const box = roofGeometry.boundingBox;
    const spanX = Math.max(0.0001, box.max.x - box.min.x);
    const spanY = Math.max(0.0001, box.max.y - box.min.y);
    const positions = roofGeometry.getAttribute('position');
    const uvs = roofGeometry.getAttribute('uv');
    for (let index = 0; index < positions.count; index += 1) {
      uvs.setXY(index, (positions.getX(index) - box.min.x) / spanX, (positions.getY(index) - box.min.y) / spanY);
    }
    uvs.needsUpdate = true;
    const roof = new THREE.Mesh(roofGeometry, mat);
    roof.rotation.x = -Math.PI / 2;
    roof.position.y = roofY;
    roof.renderOrder = 5;
    overlay.add(roof);
  } else {
    const roof = new THREE.Mesh(new THREE.PlaneGeometry(width * 1.01, depth * 1.01), mat);
    roof.rotation.x = -Math.PI / 2;
    roof.position.set(wp.x, roofY, wp.y);
    roof.renderOrder = 5;
    overlay.add(roof);
  }
  if (!overlay.children.length) return null;
  group.add(overlay);
  return overlay;
}

function playerPawnTexture(pawn) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);
  const a = pawn.appearance || {};
  const colors = a.colors || [pawn.suit || '#242424', pawn.shirt || '#d8d8d8', pawn.accent || '#111111'];
  const hat = a.headwear && a.headwear !== 'None';
  const beard = a.facialHair && a.facialHair !== 'None';
  const glasses = a.accessory && String(a.accessory).includes('Glasses');
  const scar = a.scar && a.scar !== 'None';
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = '#080806';
  ctx.beginPath();
  ctx.arc(64, 64, 58, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(64, 60, 50, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#1b1a16';
  ctx.fillRect(12, 8, 104, 110);
  const sx = 1.55;
  const ox = 14;
  const oy = -1;
  const x = (v) => ox + v * sx;
  const y = (v) => oy + v * sx;
  const path = (points) => {
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(x(p[0]), y(p[1]));
      else ctx.lineTo(x(p[0]), y(p[1]));
    });
    ctx.closePath();
  };
  ctx.fillStyle = colors[0] || pawn.suit || '#242424';
  path([[12, 70], [52, 70], [58, 96], [6, 96]]);
  ctx.fill();
  ctx.fillStyle = colors[1] || pawn.shirt || '#d8d8d8';
  path([[25, 71], [39, 71], [43, 96], [21, 96]]);
  ctx.fill();
  ctx.fillStyle = pawn.hair || '#2b2018';
  path([[13, 29], [20, 17], [33, 11], [47, 17], [54, 30], [50, 45], [40, 36], [24, 36], [16, 46]]);
  ctx.fill();
  ctx.fillStyle = pawn.skin || '#c99a73';
  path([[18, 33], [46, 33], [51, 47], [43, 63], [32, 68], [21, 63], [13, 47]]);
  ctx.fill();
  if (hat) {
    ctx.fillStyle = colors[2] || '#111';
    path([[10, 29], [54, 29], [47, 18], [18, 18]]);
    ctx.fill();
    ctx.fillRect(x(6), y(28), 56 * sx, 3.5 * sx);
  }
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(x(25), y(44), a.eyes === 'Warm' ? 3.2 : 2.7, 0, Math.PI * 2);
  ctx.arc(x(39), y(44), a.eyes === 'Warm' ? 3.2 : 2.7, 0, Math.PI * 2);
  ctx.fill();
  if (glasses) {
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x(25), y(44), 6.5, 0, Math.PI * 2);
    ctx.arc(x(39), y(44), 6.5, 0, Math.PI * 2);
    ctx.moveTo(x(29), y(44));
    ctx.lineTo(x(35), y(44));
    ctx.stroke();
  }
  ctx.strokeStyle = '#14110e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (a.expression === 'Scowl' || a.expression === 'Angry') {
    ctx.moveTo(x(24), y(56));
    ctx.quadraticCurveTo(x(32), y(52), x(41), y(56));
  } else if (a.expression === 'Smirk' || a.expression === 'Charming') {
    ctx.moveTo(x(23), y(54));
    ctx.quadraticCurveTo(x(32), y(60), x(42), y(53));
  } else {
    ctx.moveTo(x(24), y(55));
    ctx.lineTo(x(41), y(55));
  }
  ctx.stroke();
  if (beard) {
    ctx.fillStyle = pawn.hair || '#2b2018';
    ctx.globalAlpha = 0.62;
    path([[20, 55], [31, 69], [44, 55], [39, 65], [25, 65]]);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  if (scar) {
    ctx.strokeStyle = '#7b2a25';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x(42), y(34));
    ctx.lineTo(x(36), y(49));
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = '#f2d68a';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(64, 64, 58, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#f7e5aa';
  ctx.font = 'bold 18px Inter, Arial';
  ctx.textAlign = 'center';
  ctx.fillText(pawn.initials || 'PC', 64, 119);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPlayerPawn(pawn) {
  const group = new THREE.Group();
  group.userData.playerPawn = true;
  group.renderOrder = 40;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: playerPawnTexture(pawn || {}), transparent: true, depthTest: false }));
  sprite.scale.set(2.5, 2.5, 2.5);
  sprite.position.y = 2.75;
  sprite.renderOrder = 41;
  group.add(sprite);
  return group;
}

function cashFloatTexture(amount) {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 54px Inter, Arial';
  ctx.textAlign = 'center';
  ctx.lineWidth = 8;
  const text = `+$${Math.max(0, Math.round(amount || 0)).toLocaleString('en-US')}`;
  ctx.strokeStyle = '#071407';
  ctx.strokeText(text, canvas.width / 2, 65);
  ctx.fillStyle = '#77df64';
  ctx.fillText(text, canvas.width / 2, 65);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function actionProgressTexture(label, progress) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');
  const pct = Math.max(0, Math.min(1, Number(progress) || 0));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(8, 9, 7, 0.94)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#d7bf70';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
  ctx.fillStyle = '#f0dfac';
  ctx.font = 'bold 32px Inter, Arial';
  ctx.textAlign = 'left';
  ctx.fillText(label || 'Working', 24, 43);
  ctx.textAlign = 'right';
  ctx.fillText(`${Math.round(pct * 100)}%`, canvas.width - 24, 43);
  ctx.fillStyle = '#20291e';
  ctx.fillRect(24, 65, canvas.width - 48, 30);
  ctx.strokeStyle = '#66745d';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 65, canvas.width - 48, 30);
  ctx.fillStyle = '#7bd75a';
  ctx.fillRect(27, 68, (canvas.width - 54) * pct, 24);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function lineIntersection2d(a, b, c, d) {
  const rx = b.x - a.x;
  const rz = b.z - a.z;
  const sx = d.x - c.x;
  const sz = d.z - c.z;
  const den = rx * sz - rz * sx;
  if (Math.abs(den) < 0.00001) return null;
  const qx = c.x - a.x;
  const qz = c.z - a.z;
  const t = (qx * sz - qz * sx) / den;
  const u = (qx * rz - qz * rx) / den;
  if (t < -0.001 || t > 1.001 || u < -0.001 || u > 1.001) return null;
  return { x: a.x + rx * t, z: a.z + rz * t, t: Math.max(0, Math.min(1, t)), u: Math.max(0, Math.min(1, u)) };
}

function nearestPointOnRoad2d(p, a, b) {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len2 = dx * dx + dz * dz;
  const t = len2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / len2)) : 0;
  const q = { x: a.x + dx * t, z: a.z + dz * t };
  return { point: q, t, distance: Math.hypot(p.x - q.x, p.z - q.z) };
}

function buildPawnRoadNav(roads, center, scale, blocks = []) {
  const perimeterSegments = [];
  const seen = new Set();
  const blockWorldPolys = (blocks || []).map((block) => (block?.polygon || []).map((point) => {
    const world = worldPoint(point, center, scale);
    return { x: world.x, y: world.y };
  })).filter((poly) => poly.length >= 3);
  (blocks || []).forEach((block) => {
    const poly = block?.polygon || [];
    for (let i = 0; i < poly.length; i += 1) {
      const wa = worldPoint(poly[i], center, scale);
      const wb = worldPoint(poly[(i + 1) % poly.length], center, scale);
      const a = { x: wa.x, z: wa.y };
      const b = { x: wb.x, z: wb.y };
      if (Math.hypot(b.x - a.x, b.z - a.z) <= 0.2) continue;
      const ak = `${Math.round(a.x * 100) / 100},${Math.round(a.z * 100) / 100}`;
      const bk = `${Math.round(b.x * 100) / 100},${Math.round(b.z * 100) / 100}`;
      const key = ak < bk ? `${ak}:${bk}` : `${bk}:${ak}`;
      if (seen.has(key)) continue;
      seen.add(key);
      perimeterSegments.push({ id: `block-edge-${block.id || perimeterSegments.length}-${i}`, a, b, cuts: [], costFactor: 1 });
    }
  });
  const roadSegments = (roads || []).filter((road) => road?.a && road?.b).map((road) => {
    const a = worldPoint(road.a, center, scale);
    const b = worldPoint(road.b, center, scale);
    const samples = [0.2, 0.4, 0.6, 0.8];
    const hidden = samples.some((t) => blockWorldPolys.some((poly) => pointInPoly({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }, poly)));
    return { id: road.id, a: { x: a.x, z: a.y }, b: { x: b.x, z: b.y }, cuts: [], costFactor: hidden ? 30 : 1.15 };
  }).filter((seg) => Math.hypot(seg.b.x - seg.a.x, seg.b.z - seg.a.z) > 0.2);
  // Perimeters provide the visible sidewalk network; raw roads keep irregular
  // districts connected, but buried portions receive a prohibitive route cost.
  const segments = perimeterSegments.length ? perimeterSegments.concat(roadSegments) : roadSegments;
  const nodes = [];
  const nodeKeys = new Map();
  const edges = [];
  function nodeFor(p) {
    const key = `${Math.round(p.x * 100) / 100},${Math.round(p.z * 100) / 100}`;
    if (nodeKeys.has(key)) return nodeKeys.get(key);
    const id = nodes.length;
    nodeKeys.set(key, id);
    nodes.push({ id, x: p.x, z: p.z, edges: [] });
    return id;
  }
  segments.forEach((seg) => {
    seg.cuts.push({ t: 0, point: seg.a }, { t: 1, point: seg.b });
  });
  for (let i = 0; i < segments.length; i += 1) {
    for (let j = i + 1; j < segments.length; j += 1) {
      const hit = lineIntersection2d(segments[i].a, segments[i].b, segments[j].a, segments[j].b);
      if (!hit) continue;
      segments[i].cuts.push({ t: hit.t, point: { x: hit.x, z: hit.z } });
      segments[j].cuts.push({ t: hit.u, point: { x: hit.x, z: hit.z } });
    }
  }
  segments.forEach((seg) => {
    const cuts = seg.cuts.sort((a, b) => a.t - b.t).filter((cut, index, arr) => index === 0 || Math.hypot(cut.point.x - arr[index - 1].point.x, cut.point.z - arr[index - 1].point.z) > 0.05);
    for (let i = 0; i < cuts.length - 1; i += 1) {
      const a = cuts[i].point;
      const b = cuts[i + 1].point;
      const length = Math.hypot(b.x - a.x, b.z - a.z);
      if (length < 0.05) continue;
      const from = nodeFor(a);
      const to = nodeFor(b);
      const id = edges.length;
      edges.push({ from, to, length, cost: length * (seg.costFactor || 1) });
      nodes[from].edges.push(id);
      nodes[to].edges.push(id);
    }
  });
  return { segments, nodes, edges, blockPolys: blockWorldPolys, routeCache: new Map(), streetGrid: null };
}

function streetGridPath(nav, start, end) {
  if (!nav?.blockPolys?.length) return null;
  if (!nav.streetGrid) {
    const points = nav.blockPolys.flat();
    const step = 0.52;
    const minX = Math.floor((Math.min(...points.map((p) => p.x)) - 1.5) / step) * step;
    const maxX = Math.ceil((Math.max(...points.map((p) => p.x)) + 1.5) / step) * step;
    const minZ = Math.floor((Math.min(...points.map((p) => p.y)) - 1.5) / step) * step;
    const maxZ = Math.ceil((Math.max(...points.map((p) => p.y)) + 1.5) / step) * step;
    const cols = Math.max(2, Math.round((maxX - minX) / step) + 1);
    const rows = Math.max(2, Math.round((maxZ - minZ) / step) + 1);
    const blocked = new Uint8Array(cols * rows);
    for (let z = 0; z < rows; z += 1) {
      for (let x = 0; x < cols; x += 1) {
        const point = { x: minX + x * step, y: minZ + z * step };
        if (nav.blockPolys.some((poly) => pointInPoly(point, poly))) blocked[z * cols + x] = 1;
      }
    }
    nav.streetGrid = { step, minX, minZ, cols, rows, blocked };
  }
  const grid = nav.streetGrid;
  const index = (x, z) => z * grid.cols + x;
  const inBounds = (x, z) => x >= 0 && z >= 0 && x < grid.cols && z < grid.rows;
  function nearestOpen(point) {
    const gx = Math.max(0, Math.min(grid.cols - 1, Math.round((point.x - grid.minX) / grid.step)));
    const gz = Math.max(0, Math.min(grid.rows - 1, Math.round((point.z - grid.minZ) / grid.step)));
    for (let radius = 0; radius < Math.max(grid.cols, grid.rows); radius += 1) {
      let best = null;
      for (let dz = -radius; dz <= radius; dz += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== radius) continue;
          const x = gx + dx;
          const z = gz + dz;
          if (!inBounds(x, z) || grid.blocked[index(x, z)]) continue;
          const distance = Math.hypot(grid.minX + x * grid.step - point.x, grid.minZ + z * grid.step - point.z);
          if (!best || distance < best.distance) best = { x, z, distance };
        }
      }
      if (best) return best;
    }
    return null;
  }
  const source = nearestOpen(start);
  const target = nearestOpen(end);
  if (!source || !target) return null;
  const startKey = index(source.x, source.z);
  const targetKey = index(target.x, target.z);
  const open = [startKey];
  const openSet = new Set(open);
  const cameFrom = new Int32Array(grid.cols * grid.rows);
  cameFrom.fill(-1);
  const gScore = new Float64Array(grid.cols * grid.rows);
  gScore.fill(Infinity);
  gScore[startKey] = 0;
  const moves = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  let guard = grid.cols * grid.rows * 2;
  while (open.length && guard-- > 0) {
    let bestAt = 0;
    let bestScore = Infinity;
    for (let i = 0; i < open.length; i += 1) {
      const key = open[i];
      const x = key % grid.cols;
      const z = Math.floor(key / grid.cols);
      const score = gScore[key] + Math.hypot(target.x - x, target.z - z);
      if (score < bestScore) { bestScore = score; bestAt = i; }
    }
    const current = open.splice(bestAt, 1)[0];
    openSet.delete(current);
    if (current === targetKey) {
      const cells = [];
      for (let key = current; key !== -1; key = cameFrom[key]) cells.push({ x: key % grid.cols, z: Math.floor(key / grid.cols) });
      cells.reverse();
      const simplified = cells.filter((cell, i, arr) => {
        if (i === 0 || i === arr.length - 1) return true;
        const prev = arr[i - 1];
        const next = arr[i + 1];
        return (cell.x - prev.x) !== (next.x - cell.x) || (cell.z - prev.z) !== (next.z - cell.z);
      });
      return simplified.map((cell) => ({ x: grid.minX + cell.x * grid.step, z: grid.minZ + cell.z * grid.step }));
    }
    const cx = current % grid.cols;
    const cz = Math.floor(current / grid.cols);
    moves.forEach(([dx, dz]) => {
      const nx = cx + dx;
      const nz = cz + dz;
      if (!inBounds(nx, nz) || grid.blocked[index(nx, nz)]) return;
      if (dx && dz && (grid.blocked[index(cx + dx, cz)] || grid.blocked[index(cx, cz + dz)])) return;
      const next = index(nx, nz);
      const tentative = gScore[current] + (dx && dz ? Math.SQRT2 : 1);
      if (tentative >= gScore[next]) return;
      cameFrom[next] = current;
      gScore[next] = tentative;
      if (!openSet.has(next)) { open.push(next); openSet.add(next); }
    });
  }
  return null;
}

function shortestPawnRoadPath(nav, start, end) {
  if (!nav || !nav.nodes.length || !nav.segments.length) return [start, end];
  const cacheKey = `${start.x.toFixed(2)},${start.z.toFixed(2)}:${end.x.toFixed(2)},${end.z.toFixed(2)}`;
  if (nav.routeCache.has(cacheKey)) return nav.routeCache.get(cacheKey);
  const streetPath = streetGridPath(nav, start, end);
  if (streetPath?.length > 1) {
    nav.routeCache.set(cacheKey, streetPath);
    return streetPath;
  }
  function anchor(p) {
    let best = null;
    nav.segments.forEach((seg) => {
      const near = nearestPointOnRoad2d(p, seg.a, seg.b);
      const score = near.distance + ((seg.costFactor || 1) > 2 ? 1000 : 0);
      if (!best || score < best.score) best = { segment: seg, point: near.point, distance: near.distance, score };
    });
    if (!best) return { point: p, connects: [], segment: null };
    const connects = [];
    nav.nodes.forEach((node) => {
      const d = Math.min(
        Math.hypot(node.x - best.segment.a.x, node.z - best.segment.a.z),
        Math.hypot(node.x - best.segment.b.x, node.z - best.segment.b.z),
        Math.hypot(node.x - best.point.x, node.z - best.point.z),
      );
      if (d < Math.hypot(best.segment.b.x - best.segment.a.x, best.segment.b.z - best.segment.a.z) + 0.1) {
        const onSeg = nearestPointOnRoad2d({ x: node.x, z: node.z }, best.segment.a, best.segment.b);
        if (onSeg.distance < 0.08) connects.push({ id: node.id, length: Math.hypot(node.x - best.point.x, node.z - best.point.z) });
      }
    });
    connects.sort((a, b) => a.length - b.length);
    return { point: best.point, connects: connects.slice(0, 2), segment: best.segment };
  }
  const startAnchor = anchor(start);
  const endAnchor = anchor(end);
  if (startAnchor.segment && endAnchor.segment && startAnchor.segment.id === endAnchor.segment.id) {
    const sameRoad = [startAnchor.point, endAnchor.point];
    nav.routeCache.set(cacheKey, sameRoad);
    return sameRoad;
  }
  const dist = new Array(nav.nodes.length).fill(Infinity);
  const prev = new Array(nav.nodes.length).fill(null);
  const queue = [];
  startAnchor.connects.forEach((c) => {
    dist[c.id] = c.length;
    queue.push(c.id);
  });
  while (queue.length) {
    queue.sort((a, b) => dist[a] - dist[b]);
    const nodeId = queue.shift();
    const node = nav.nodes[nodeId];
    node.edges.forEach((edgeId) => {
      const edge = nav.edges[edgeId];
      const next = edge.from === nodeId ? edge.to : edge.from;
      const nd = dist[nodeId] + (edge.cost || edge.length);
      if (nd < dist[next]) {
        dist[next] = nd;
        prev[next] = nodeId;
        queue.push(next);
      }
    });
  }
  let endNode = null;
  let bestCost = Infinity;
  endAnchor.connects.forEach((c) => {
    const cost = dist[c.id] + c.length;
    if (cost < bestCost) {
      bestCost = cost;
      endNode = c.id;
    }
  });
  if (endNode === null || !Number.isFinite(bestCost)) {
    const direct = [startAnchor.point, endAnchor.point];
    nav.routeCache.set(cacheKey, direct);
    return direct;
  }
  const nodePath = [];
  for (let cur = endNode; cur !== null; cur = prev[cur]) nodePath.push(cur);
  nodePath.reverse();
  const path = [startAnchor.point]
    .concat(nodePath.map((id) => ({ x: nav.nodes[id].x, z: nav.nodes[id].z })))
    .concat([endAnchor.point])
    .filter((p, index, arr) => index === 0 || Math.hypot(p.x - arr[index - 1].x, p.z - arr[index - 1].z) > 0.04);
  nav.routeCache.set(cacheKey, path);
  return path;
}

function pointAlongPath(path, t) {
  if (!path || path.length < 2) return path?.[0] || { x: 0, z: 0 };
  const lengths = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i += 1) {
    const len = Math.hypot(path[i + 1].x - path[i].x, path[i + 1].z - path[i].z);
    lengths.push(len);
    total += len;
  }
  let remaining = total * Math.max(0, Math.min(1, t));
  for (let i = 0; i < lengths.length; i += 1) {
    if (remaining <= lengths[i] || i === lengths.length - 1) {
      const a = path[i];
      const b = path[i + 1];
      const local = lengths[i] ? remaining / lengths[i] : 0;
      return { x: a.x + (b.x - a.x) * local, z: a.z + (b.z - a.z) * local };
    }
    remaining -= lengths[i];
  }
  return path[path.length - 1];
}

function clearRouteVisual(group) {
  if (!group) return;
  while (group.children.length) {
    const child = group.children.pop();
    child.geometry?.dispose?.();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach((material) => material.dispose?.());
  }
}

function buildRouteVisual(group, path, options = {}) {
  clearRouteVisual(group);
  if (!path || path.length < 2) return;
  const queued = !!options.queued;
  const color = new THREE.Color(options.color || (queued ? 0xd6ad48 : 0xffdf78));
  const points = path.map((point) => new THREE.Vector3(point.x, queued ? 0.125 : 0.14, point.z));
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.2);
  const divisions = Math.max(12, Math.min(220, path.length * 8));
  const glow = new THREE.Mesh(
    new THREE.TubeGeometry(curve, divisions, queued ? 0.035 : 0.065, 5, false),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: queued ? 0.2 : 0.28, depthWrite: false }),
  );
  glow.renderOrder = 18;
  group.add(glow);
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineDashedMaterial({ color, transparent: true, opacity: queued ? 0.72 : 0.98, dashSize: queued ? 0.22 : 0.34, gapSize: queued ? 0.15 : 0.12, depthTest: true, depthWrite: false }),
  );
  line.computeLineDistances();
  line.renderOrder = 19;
  line.userData.routeDash = true;
  group.add(line);
}

function addQueuedStopMarker(group, point, order) {
  const marker = new THREE.Group();
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffcf3d, depthTest: true }));
  dot.position.y = 0.22;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.25, 18), new THREE.MeshBasicMaterial({ color: 0xffe58a, transparent: true, opacity: 0.78, side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.135;
  marker.add(dot, ring);
  marker.position.set(point.x, 0, point.z);
  marker.userData.stopOrder = order;
  marker.renderOrder = 21;
  group.add(marker);
}

function updateQueuedRouteObject(entry, pawn, buildingMap) {
  if (!entry?.queuedRouteGroup) return;
  const stops = Array.isArray(pawn?.queuedStops) ? pawn.queuedStops : [];
  if (entry.root) entry.root.dataset.queuedRouteStops = String(stops.length);
  const key = `${pawn?.targetParcelId || pawn?.parcelId || ''}:${stops.map((stop) => `${stop.id}:${stop.parcelId}`).join('|')}`;
  if (entry.queuedRouteGroup.userData.routeKey === key) return;
  entry.queuedRouteGroup.userData.routeKey = key;
  clearRouteVisual(entry.queuedRouteGroup);
  if (!pawn?.visible || !stops.length) return;
  let startBuilding = buildingMap.get(pawn.targetParcelId) || buildingMap.get(pawn.parcelId);
  let start = startBuilding?.center ? { x: startBuilding.center.x, z: startBuilding.center.y } : null;
  stops.forEach((stop, index) => {
    const destination = buildingMap.get(stop.parcelId);
    if (!start || !destination?.center) return;
    const end = { x: destination.center.x, z: destination.center.y };
    const path = shortestPawnRoadPath(entry.roadNav, start, end);
    const segment = new THREE.Group();
    segment.userData.queuedSegment = true;
    buildRouteVisual(segment, path, { queued: true, color: index % 2 ? 0xe2b84f : 0xc99c32 });
    entry.queuedRouteGroup.add(segment);
    const stopPoint = path?.[path.length - 1] || end;
    addQueuedStopMarker(entry.queuedRouteGroup, stopPoint, stop.order || index + 1);
    start = end;
  });
}

function updatePlayerPawnObject(entry, pawn, buildingMap) {
  if (!entry || !entry.playerPawn || !pawn) return false;
  if (pawn.visible === false) {
    entry.playerPawn.visible = false;
    if (entry.playerRoute) entry.playerRoute.visible = false;
    if (entry.queuedRouteGroup) entry.queuedRouteGroup.visible = false;
    return false;
  }
  const from = buildingMap.get(pawn.parcelId);
  const target = pawn.targetParcelId ? buildingMap.get(pawn.targetParcelId) : null;
  const base = from || target;
  if (!base) {
    entry.playerPawn.visible = false;
    if (entry.playerRoute) entry.playerRoute.visible = false;
    if (entry.queuedRouteGroup) entry.queuedRouteGroup.visible = false;
    return false;
  }
  entry.playerPawn.visible = true;
  if (entry.queuedRouteGroup) entry.queuedRouteGroup.visible = true;
  const a = from?.center || target.center;
  const b = target?.center || a;
  const logicalRouteKey = target && from ? `${pawn.parcelId || ''}:${pawn.targetParcelId || ''}:${pawn.routeId || ''}` : '';
  if (logicalRouteKey && entry.playerPawn.userData.logicalRouteKey !== logicalRouteKey) {
    const useCurrent = !!entry.playerPawn.userData.hasPosition && entry.playerPawn.visible;
    entry.playerPawn.userData.logicalRouteKey = logicalRouteKey;
    entry.playerPawn.userData.routeStart = useCurrent
      ? { x: entry.playerPawn.position.x, z: entry.playerPawn.position.z }
      : { x: a.x, z: a.y };
  } else if (!logicalRouteKey) {
    entry.playerPawn.userData.logicalRouteKey = '';
    entry.playerPawn.userData.routeStart = null;
  }
  let t = Math.max(0, Math.min(1, Number(pawn.progress ?? 1)));
  if (target && from && pawn.timeMoving) {
    const duration = Math.max(1, Number(pawn.moveDurationMinutes || 1));
    const stepMinutes = Math.max(0, Number(pawn.moveStepMinutes || 0));
    const periodMs = Math.max(1, Number(pawn.timePeriodMs || 60000));
    const startedAt = Number(pawn.timeStepStartedAt || Date.now());
    const liveStep = Math.min(stepMinutes, Math.max(0, (Date.now() - startedAt) / periodMs) * stepMinutes);
    t = Math.max(0, Math.min(1, t + liveStep / duration));
  }
  const startPoint = target && from && entry.playerPawn.userData.routeStart ? entry.playerPawn.userData.routeStart : { x: a.x, z: a.y };
  const path = target && from ? shortestPawnRoadPath(entry.roadNav, startPoint, { x: b.x, z: b.y }) : [{ x: a.x, z: a.y }];
  if (logicalRouteKey && entry.playerPawn.userData.reportedRouteKey !== logicalRouteKey) {
    let routeDistance = 0;
    for (let i = 0; i < path.length - 1; i += 1) routeDistance += Math.hypot(path[i + 1].x - path[i].x, path[i + 1].z - path[i].z);
    entry.playerPawn.userData.reportedRouteKey = logicalRouteKey;
    entry.root?.dispatchEvent(new CustomEvent('deskdon-player-route-distance', { detail: { routeId: pawn.routeId, worldDistance: routeDistance }, bubbles: true }));
  }
  const pos = pointAlongPath(path, t);
  entry.playerPawn.position.set(pos.x, 0.08, pos.z);
  entry.playerPawn.userData.hasPosition = true;
  if (pawn.cashFloat && pawn.cashFloat.amount) {
    const age = Date.now() - Number(pawn.cashFloat.startedAt || 0);
    if (age < 1800) {
      if (!entry.cashFloat || entry.cashFloat.userData.amount !== pawn.cashFloat.amount || entry.cashFloat.userData.startedAt !== pawn.cashFloat.startedAt) {
        if (entry.cashFloat) {
          entry.cashFloat.material.map?.dispose?.();
          entry.cashFloat.material.dispose?.();
          entry.playerPawn.remove(entry.cashFloat);
        }
        entry.cashFloat = new THREE.Sprite(new THREE.SpriteMaterial({ map: cashFloatTexture(pawn.cashFloat.amount), transparent: true, depthTest: false }));
        entry.cashFloat.userData.amount = pawn.cashFloat.amount;
        entry.cashFloat.userData.startedAt = pawn.cashFloat.startedAt;
        entry.cashFloat.scale.set(3.15, 0.95, 1);
        entry.cashFloat.renderOrder = 42;
        entry.playerPawn.add(entry.cashFloat);
      }
      entry.cashFloat.visible = true;
      entry.cashFloat.position.set(0, 3.55 + age / 1800 * 1.05, 0);
      entry.cashFloat.material.opacity = Math.max(0, 1 - age / 1800);
    } else if (entry.cashFloat) {
      entry.cashFloat.material.map?.dispose?.();
      entry.cashFloat.material.dispose?.();
      entry.playerPawn.remove(entry.cashFloat);
      entry.cashFloat = null;
    }
  } else if (entry.cashFloat) {
    entry.cashFloat.visible = false;
  }
  if (pawn.action && pawn.action.active) {
    const progress = Math.max(0, Math.min(1, Number(pawn.action.progress) || 0));
    const label = pawn.action.label || 'Working';
    const key = `${label}:${Math.round(progress * 100)}`;
    if (!entry.actionProgress || entry.actionProgress.userData.key !== key) {
      if (entry.actionProgress) {
        entry.actionProgress.material.map?.dispose?.();
        entry.actionProgress.material.dispose?.();
        entry.playerPawn.remove(entry.actionProgress);
      }
      entry.actionProgress = new THREE.Sprite(new THREE.SpriteMaterial({ map: actionProgressTexture(label, progress), transparent: true, depthTest: false }));
      entry.actionProgress.userData.key = key;
      entry.actionProgress.scale.set(4.8, 1.12, 1);
      entry.actionProgress.renderOrder = 42;
      entry.playerPawn.add(entry.actionProgress);
    }
    entry.actionProgress.visible = true;
    entry.actionProgress.position.set(0, 4.15, 0);
  } else if (entry.actionProgress) {
    entry.actionProgress.visible = false;
  }
  if (entry.playerRoute) {
    entry.playerRoute.visible = !!target && !!from && t < 1;
    if (entry.playerRoute.visible) {
      const routeKey = `${pawn.parcelId || ''}:${pawn.targetParcelId || ''}:${path.length}:${path[0]?.x.toFixed(2)},${path[0]?.z.toFixed(2)}:${path[path.length - 1]?.x.toFixed(2)},${path[path.length - 1]?.z.toFixed(2)}`;
      if (entry.playerRoute.userData.routeKey !== routeKey) {
        buildRouteVisual(entry.playerRoute, path, { color: 0xffdf78 });
        entry.playerRoute.userData.routeKey = routeKey;
      }
    } else {
      entry.playerRoute.userData.routeKey = '';
    }
  }
  updateQueuedRouteObject(entry, pawn, buildingMap);
  return true;
}

function familyEstateForParcel(parcel, center, scale, materials, rayTargets, buildingMap, debug) {
  const footprint = parcel.polygon || parcel.buildingPolygon;
  if (!parcel.isBuildable || !footprint || footprint.length < 3) return null;
  const metrics = worldMetrics(footprint, center, scale);
  const group = new THREE.Group();
  const palette = colorByCategory.Residential;
  const compoundMat = new THREE.MeshPhongMaterial({ color: 0x8b887b, emissive: 0x070604, shininess: 8, flatShading: true, side: THREE.DoubleSide });
  const mansionMat = new THREE.MeshPhongMaterial({ color: 0xc4b28a, emissive: 0x050403, shininess: 14, flatShading: true, side: THREE.DoubleSide });
  const roofMat = new THREE.MeshLambertMaterial({ color: 0x4d4638 });
  const wallHeight = 0.46;
  const wallThickness = 0.085;
  const wallMeshes = [];
  for (let i = 0; i < footprint.length; i += 1) {
    const a = worldPoint(footprint[i], center, scale);
    const b = worldPoint(footprint[(i + 1) % footprint.length], center, scale);
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len < 0.16) continue;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(len, wallHeight, wallThickness), compoundMat);
    wall.position.set((a.x + b.x) / 2, wallHeight / 2 + 0.055, (a.y + b.y) / 2);
    wall.rotation.y = -Math.atan2(b.y - a.y, b.x - a.x);
    wall.userData.parcel = parcel;
    wall.userData.originalColor = 0x8b887b;
    group.add(wall);
    wallMeshes.push(wall);
  }
  const courtyardGeo = extrusionShapeFromPoly(footprint, center, scale);
  const yard = new THREE.Mesh(
    new THREE.ShapeGeometry(courtyardGeo),
    new THREE.MeshLambertMaterial({ color: 0x74786b, transparent: true, opacity: 0.92, side: THREE.DoubleSide }),
  );
  yard.rotation.x = -Math.PI / 2;
  yard.position.y = 0.052;
  yard.userData.parcel = parcel;
  group.add(yard);

  const inner = estateInnerRectangle(footprint);
  const driveway = estateDrivewayRectangle(footprint, inner);
  const drivewayMesh = addEstateFlatRect(group, driveway, center, scale, 0x25282a, 0.064, 0.95);
  drivewayMesh.userData.parcel = parcel;
  const driveWorld = worldMetrics(driveway, center, scale);
  const driveCenter = worldPoint(centroid(driveway), center, scale);
  const gateHeight = wallHeight + 0.16;
  const gate = new THREE.Mesh(new THREE.BoxGeometry(0.18, gateHeight, Math.max(0.28, driveWorld.depth)), new THREE.MeshPhongMaterial({ color: 0x090909, emissive: 0x010101, flatShading: true }));
  gate.position.set(driveCenter.x - driveWorld.width / 2, gateHeight / 2 + 0.055, driveCenter.y);
  gate.userData.parcel = parcel;
  gate.userData.originalColor = 0x090909;
  group.add(gate);

  const innerMetrics = worldMetrics(inner, center, scale);
  const innerCenter = worldPoint(centroid(inner), center, scale);
  const mansionFloors = 2 + Math.floor(hashNumber(`${parcel.id}-estate-floors`) * 2);
  const mansionHeight = Math.min(1.38, mansionFloors * 0.46);
  const mansion = new THREE.Mesh(new THREE.BoxGeometry(innerMetrics.width, mansionHeight, innerMetrics.depth), mansionMat);
  mansion.position.set(innerCenter.x, mansionHeight / 2 + 0.07, innerCenter.y);
  mansion.userData.parcel = parcel;
  mansion.userData.originalColor = 0xc4b28a;
  group.add(mansion);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(innerMetrics.width * 1.04, 0.05, innerMetrics.depth * 1.04), roofMat);
  roof.position.set(innerCenter.x, mansionHeight + 0.11, innerCenter.y);
  roof.userData.parcel = parcel;
  roof.userData.originalColor = 0x4d4638;
  group.add(roof);
  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(innerMetrics.width, mansionHeight, innerMetrics.depth)),
    new THREE.LineBasicMaterial({ color: 0xf2d68a, transparent: true, opacity: 0.8 }),
  );
  edge.position.copy(mansion.position);
  edge.userData.parcel = parcel;
  edge.userData.detailLine = true;
  group.add(edge);
  const estateMarker = new THREE.Group();
  const estateRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.27, 0.045, 8, 20),
    new THREE.MeshBasicMaterial({ color: 0xffd56b, depthTest: false }),
  );
  estateRing.rotation.x = Math.PI / 2;
  const estateCrown = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.3, 4),
    new THREE.MeshBasicMaterial({ color: 0xffb21f, depthTest: false }),
  );
  estateCrown.rotation.y = Math.PI / 4;
  estateMarker.add(estateRing, estateCrown);
  estateMarker.position.set(innerCenter.x, mansionHeight + 0.72, innerCenter.y);
  estateMarker.userData.baseY = estateMarker.position.y;
  estateMarker.renderOrder = 20;
  group.add(estateMarker);
  group.userData.safehouseMarker = estateMarker;
  const visualProfile = buildingVisualProfile(parcel, inner, innerMetrics, mansionHeight);
  visualProfile.footprint = Number(Math.max(metrics.area, 500 / INFO_AREA_SCALE).toFixed(2));
  visualProfile.width = Number(metrics.width.toFixed(2));
  visualProfile.depth = Number(metrics.depth.toFixed(2));
  visualProfile.perimeter = Number(metrics.perimeter.toFixed(2));
  visualProfile.height = Number((mansionFloors * 0.85).toFixed(2));
  visualProfile.compoundFootprint = Number(metrics.area.toFixed(2));
  visualProfile.mansionFootprint = Number(innerMetrics.area.toFixed(2));
  visualProfile.floors = mansionFloors;
  parcel.visualProfile = visualProfile;
  rayTargets.push(mansion, roof, gate, ...wallMeshes);
  buildingMap.set(parcel.id, { group, mesh: mansion, roofMesh: roof, parcel, width: innerMetrics.width, depth: innerMetrics.depth, height: mansionHeight, exact: true, center: innerCenter, footprint });
  return group;
}

function protectedColorForParcel(parcel, fallback) {
  return fallback;
}

function buildingForParcel(parcel, center, scale, materials, rayTargets, buildingMap, debug) {
  const footprint = parcel.buildingPolygon || (debug.exactExtrusion ? null : parcel.polygon);
  if (!parcel.isBuildable || !footprint || footprint.length < 3) return null;
  if (parcel.isFamilyEstate || parcel.subtype === 'Family Estate') return familyEstateForParcel(parcel, center, scale, materials, rayTargets, buildingMap, debug);
  if (debug.exactExtrusion && footprint.length >= 3) {
    const metrics = worldMetrics(footprint, center, scale);
    const height = heightForParcel(parcel, metrics);
    if (!heightSanityOk(height, metrics, parcel)) return null;
    const palette = colorByCategory[parcel.category] || colorByCategory.Commercial;
    const safehouseColor = parcel.isPlayerSafehouse ? 0x36682c : protectedColorForParcel(parcel, palette.wall);
    const wall = new THREE.MeshPhongMaterial({ color: safehouseColor, emissive: parcel.isPlayerSafehouse ? 0x071406 : 0x000000, shininess: 10, flatShading: true, side: THREE.DoubleSide });
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
    mesh.userData.originalColor = safehouseColor;
    const group = new THREE.Group();
    group.add(mesh);
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: debug.exactExtrusion ? 0xf2d68a : 0x2a2419, transparent: true, opacity: debug.exactExtrusion ? 0.78 : 0.35 }),
    );
    edge.position.copy(mesh.position);
    edge.userData.detailLine = true;
    group.add(edge);
    const c = centroid(footprint);
    const wp = worldPoint(c, center, scale);
    const visualProfile = buildingVisualProfile(parcel, footprint, metrics, height);
    parcel.visualProfile = visualProfile;
    if (parcel.isPlayerSafehouse && !debug.contextOnly) group.userData.safehouseMarker = addSafehouseIcon(group, wp.x, height + 0.92, wp.y);
    if (parcel.mafiaProtected && !debug.contextOnly) group.userData.protectionStripes = addProtectionOverlay(group, footprint, center, scale, wp, metrics.width, metrics.depth, height, parcel.protectionColor || '#ff1d1d');
    if (parcel.racketReady && !debug.contextOnly) {
      group.userData.racketMoneyMarker = addMoneyIcon(group, wp.x, height + 1.05, wp.y);
      group.userData.safehouseMarker = group.userData.racketMoneyMarker;
    }
    if (debug.windows) addFacadeOpenings(group, wp, metrics.width, metrics.depth, height, visualProfile, materials);
    mesh.userData.parcel = parcel;
    rayTargets.push(mesh);
    buildingMap.set(parcel.id, { group, mesh, roofMesh: mesh, parcel, width: metrics.width, depth: metrics.depth, height, exact: true, center: wp, footprint });
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
  const visualMetrics = { width, depth, shortest: Math.min(width, depth), longest: Math.max(width, depth), aspect: Math.max(width, depth) / Math.max(0.001, Math.min(width, depth)), area: width * depth, perimeter: (width + depth) * 2 };
  const visualProfile = buildingVisualProfile(parcel, footprint, visualMetrics, height);
  parcel.visualProfile = visualProfile;
  const palette = colorByCategory[parcel.category] || colorByCategory.Commercial;
  const safehouseColor = parcel.isPlayerSafehouse ? 0x36682c : protectedColorForParcel(parcel, palette.wall);
  const safehouseRoof = parcel.isPlayerSafehouse ? 0x24451f : protectedColorForParcel(parcel, palette.roof);
  const wall = new THREE.MeshPhongMaterial({ color: safehouseColor, emissive: parcel.isPlayerSafehouse ? 0x071406 : 0x000000, shininess: 18, side: THREE.DoubleSide });
  const roof = new THREE.MeshLambertMaterial({ color: safehouseRoof });
  const geo = new THREE.BoxGeometry(width, height, depth);
  const mesh = new THREE.Mesh(geo, wall);
  mesh.position.set(wp.x, height / 2 + 0.05, wp.y);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.userData.parcel = parcel;
  mesh.userData.originalColor = safehouseColor;
  const group = new THREE.Group();
  group.add(mesh);
  const roofGeo = new THREE.BoxGeometry(width * 1.03, 0.04, depth * 1.03);
  const roofMesh = new THREE.Mesh(roofGeo, roof);
  roofMesh.position.set(wp.x, height + 0.09, wp.y);
  roofMesh.userData.parcel = parcel;
  roofMesh.userData.originalColor = safehouseRoof;
  group.add(roofMesh);
  const shadowGeo = new THREE.PlaneGeometry(width * 1.08, depth * 1.08);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadow = new THREE.Mesh(shadowGeo, materials.shadow);
  shadow.position.set(wp.x + 0.06, 0.045, wp.y + 0.08);
  group.add(shadow);
  if (parcel.isPlayerSafehouse && !debug.contextOnly) group.userData.safehouseMarker = addSafehouseIcon(group, wp.x, height + 0.92, wp.y);
  if (parcel.mafiaProtected && !debug.contextOnly) group.userData.protectionStripes = addProtectionOverlay(group, null, center, scale, wp, width, depth, height, parcel.protectionColor || '#ff1d1d');
  if (parcel.racketReady && !debug.contextOnly) {
    group.userData.racketMoneyMarker = addMoneyIcon(group, wp.x, height + 1.05, wp.y);
    group.userData.safehouseMarker = group.userData.racketMoneyMarker;
  }
  if (debug.windows) addFacadeOpenings(group, wp, width, depth, height, visualProfile, materials);
  rayTargets.push(mesh, roofMesh);
  buildingMap.set(parcel.id, { group, mesh, roofMesh, parcel, width, depth, height, center: wp });
  return group;
}

function contextBuildingGeometry(parcel, center, scale) {
  const footprint = parcel.buildingPolygon;
  if (!parcel.isBuildable || !footprint || footprint.length < 3 || parcel.isFamilyEstate || parcel.subtype === 'Family Estate') return null;
  const metrics = worldMetrics(footprint, center, scale);
  const height = heightForParcel(parcel, metrics);
  if (!heightSanityOk(height, metrics, parcel)) return null;
  const geo = new THREE.ExtrudeGeometry(extrusionShapeFromPoly(footprint, center, scale), {
    depth: height,
    bevelEnabled: false,
    curveSegments: 1,
    steps: 1,
  });
  geometryToWorldXZWithHeight(geo);
  geo.translate(0, 0.045, 0);
  return geo;
}

function renderContextDistrict(scene, context, basePayload, center, scale, materials, districtTargets) {
  if (!context?.polygon || context.polygon.length < 3) return { buildings: 0 };
  const fogOpacity = Math.max(0.06, Math.min(0.6, Number(basePayload.fogBuildingOpacity ?? 0.24)));
  const siblingDistricts = [{ id: basePayload.district?.id, polygon: basePayload.outerPolygon }]
    .concat(basePayload.contextDistricts || [])
    .filter((district) => district?.id !== context.id && district?.polygon?.length >= 3);
  const generated = context.selfOuterPolygon?.length && context.selfToFocus
    ? (() => {
      const selfGenerated = generate3dDistrict({
        district: context,
        outerPolygon: context.selfOuterPolygon,
        inheritedRoads: context.selfInheritedRoads || [],
        contextDistricts: context.selfContextDistricts || [],
        seed: basePayload.seed || 0,
      });
      return Object.assign({}, selfGenerated, {
        outerPolygon: transformPolyAffine(selfGenerated.outerPolygon, context.selfToFocus),
        roads: (selfGenerated.roads || []).map((road) => transformRoadAffine(road, context.selfToFocus)),
        blocks: (selfGenerated.blocks || []).map((block) => transformBlockAffine(block, context.selfToFocus)),
      });
    })()
    : generate3dDistrict({
      district: context,
      outerPolygon: context.polygon,
      inheritedRoads: context.inheritedRoads || [],
      contextDistricts: siblingDistricts,
      seed: `${basePayload.seed || 0}-${context.id || context.name || 'context'}`,
    });
  const group = new THREE.Group();
  const hoverObjects = [];
  addFlatShape(group, generated.outerPolygon, center, scale, 0x5f6661, -0.012, 0.36);
  const hoverFill = addFlatShape(group, generated.outerPolygon, center, scale, 0xe4b84a, 0.034, 0.18);
  const hoverLine = addLineLoop(group, generated.outerPolygon, center, scale, 0xffd86a, 0.075);
  if (hoverFill) hoverFill.visible = false;
  if (hoverLine) {
    hoverLine.visible = false;
    hoverLine.material.opacity = 0.95;
  }
  const navSurface = addFlatShape(group, generated.outerPolygon, center, scale, 0x000000, 0.028, 0);
  if (navSurface) {
    navSurface.material.transparent = true;
    navSurface.material.opacity = 0;
    navSurface.material.depthWrite = false;
    navSurface.userData.districtNav = { id: context.id, name: context.name, hoverFill, hoverLine, hoverObjects };
    districtTargets.push(navSurface);
  }
  const boundary = addLineLoop(group, generated.outerPolygon, center, scale, 0xa9b1a7, 0.018);
  if (boundary) boundary.material.opacity = 0.24;
  (generated.roads || []).forEach((road) => {
    const mesh = roadMesh(road, center, scale, road.a, road.b, generated.outerPolygon);
    if (!mesh) return;
    muteObjectMaterials(mesh, 0x24282b, 0.32);
    mesh.userData.hoverColor = 0xb99745;
    mesh.userData.hoverOpacity = 0.62;
    hoverObjects.push(mesh);
    group.add(mesh);
  });
  let buildings = 0;
  const dummyTargets = [];
  const dummyMap = new Map();
  const buildingGeometries = [];
  const edgeGeometries = [];
  (generated.blocks || []).forEach((block) => {
    addFlatShape(group, block.polygon, center, scale, 0x737b72, 0.006, 0.24);
    (block.parcels || []).forEach((parcel) => {
      if (buildings > 220) return;
      const geo = contextBuildingGeometry(parcel, center, scale);
      if (geo) {
        buildingGeometries.push(geo);
        edgeGeometries.push(new THREE.EdgesGeometry(geo));
      } else if (parcel.isFamilyEstate || parcel.subtype === 'Family Estate') {
        const building = buildingForParcel(parcel, center, scale, materials, dummyTargets, dummyMap, { exactExtrusion: true, windows: false, contextOnly: true });
        if (!building) return;
        muteObjectMaterials(building, 0x6f7773, fogOpacity);
        building.userData.fogBuilding = true;
        building.userData.hoverColor = 0xd5b563;
        building.userData.hoverOpacity = 0.72;
        hoverObjects.push(building);
        group.add(building);
      } else return;
      buildings += 1;
    });
  });
  if (buildingGeometries.length) {
    const merged = mergeGeometries(buildingGeometries, false);
    const mesh = new THREE.Mesh(merged, new THREE.MeshLambertMaterial({ color: 0x6f7773, transparent: true, opacity: fogOpacity, side: THREE.DoubleSide }));
    mesh.userData.fogBuilding = true;
    mesh.userData.hoverColor = 0xd5b563;
    mesh.userData.hoverOpacity = 0.72;
    hoverObjects.push(mesh);
    group.add(mesh);
    buildingGeometries.forEach((geo) => geo.dispose());
  }
  if (edgeGeometries.length) {
    const mergedEdges = mergeGeometries(edgeGeometries, false);
    const edge = new THREE.LineSegments(mergedEdges, new THREE.LineBasicMaterial({ color: 0xf2d68a, transparent: true, opacity: 0.32 }));
    edge.userData.detailLine = true;
    edge.userData.fogDetailLine = true;
    edge.userData.hoverColor = 0xd5b563;
    edge.userData.hoverOpacity = 0.72;
    hoverObjects.push(edge);
    group.add(edge);
    edgeGeometries.forEach((geo) => geo.dispose());
  }
  hoverObjects.forEach((obj) => {
    obj.traverse((child) => {
      if (!child.material) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (mat.color) mat.userData.originalHoverColor = mat.color.getHex();
        mat.userData.originalHoverOpacity = mat.opacity;
        mat.userData.originalHoverTransparent = mat.transparent;
        mat.userData.originalHoverDepthWrite = mat.depthWrite;
      });
    });
  });
  scene.add(group);
  return { buildings };
}

function addBridgeLandingMarkers(scene, landings, center, scale) {
  (landings || []).forEach((landing) => {
    if (!landing?.point) return;
    const wp = worldPoint(landing.point, center, scale);
    const group = new THREE.Group();
    group.position.set(wp.x, 0.09, wp.y);
    const baseGeo = new THREE.CylinderGeometry(0.62, 0.82, 0.16, 8);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x2f3433, emissive: 0x090806, flatShading: true });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);
    const capGeo = new THREE.CylinderGeometry(0.34, 0.48, 0.12, 8);
    const capMat = new THREE.MeshLambertMaterial({ color: 0xd0a850, emissive: 0x2a1b05, flatShading: true });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.14;
    group.add(cap);
    const ringGeo = new THREE.RingGeometry(0.92, 1.08, 8);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xe8c36b, transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false }));
    ring.position.y = 0.04;
    group.add(ring);
    scene.add(group);
  });
}

function addStreetLightMarkers(scene, roads, center, scale, period) {
  const key = String(period || '').toLowerCase();
  if (key !== 'evening' && key !== 'night') return;
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: key === 'night' ? 0xffd37a : 0xffbc63, transparent: true, opacity: key === 'night' ? 0.82 : 0.46 });
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffc46f, transparent: true, opacity: key === 'night' ? 0.18 : 0.1, depthWrite: false, side: THREE.DoubleSide });
  const bulbGeo = new THREE.SphereGeometry(0.055, 8, 6);
  const glowGeo = new THREE.CircleGeometry(0.34, 12);
  let count = 0;
  (roads || []).forEach((road) => {
    if (count > 90 || !road?.a || !road?.b) return;
    const len = Math.hypot(road.b.x - road.a.x, road.b.y - road.a.y);
    const spacing = road.kind === 'avenue' ? 42 : 58;
    const steps = Math.max(1, Math.floor(len / spacing));
    for (let i = 1; i <= steps && count <= 90; i += 1) {
      const t = i / (steps + 1);
      const p = { x: road.a.x + (road.b.x - road.a.x) * t, y: road.a.y + (road.b.y - road.a.y) * t };
      const wp = worldPoint(p, center, scale);
      const bulb = new THREE.Mesh(bulbGeo, mat);
      bulb.position.set(wp.x, 0.18, wp.y);
      group.add(bulb);
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.rotation.x = -Math.PI / 2;
      glow.position.set(wp.x, 0.024, wp.y);
      group.add(glow);
      count += 1;
    }
  });
  scene.add(group);
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

function applyEstateFocusDimming(scene, estateParcelId) {
  if (!estateParcelId) return;
  scene.traverse((obj) => {
    if (!obj.material) return;
    let node = obj;
    let isEstate = false;
    while (node) {
      if (node.userData?.parcel?.id === estateParcelId) {
        isEstate = true;
        break;
      }
      node = node.parent;
    }
    if (isEstate) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats.forEach((mat) => {
      if (mat.userData.estateFocusStored) return;
      mat.userData.estateFocusStored = true;
      mat.transparent = true;
      mat.opacity = Math.min(mat.opacity === undefined ? 1 : mat.opacity, 0.18);
      mat.depthWrite = false;
      if (mat.color) mat.color.multiplyScalar(0.58);
      mat.needsUpdate = true;
    });
  });
}

function payloadBounds(payload) {
  return bounds(payload.outerPolygon || []);
}

function buildScene(payload) {
  const scene = new THREE.Scene();
  const lighting = lightingForPayload(payload);
  scene.background = lighting.bg.clone();
  const debug = Object.assign({}, emptyDebug, payload.debug || {});
  const generated = generate3dDistrict(payload);
  const sceneData = Object.assign({}, payload, generated);
  const b = payloadBounds(sceneData);
  const center = { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 };
  const scale = WORLD_SCALE;
  const rayTargets = [];
  const districtTargets = [];
  const safehouseMarkers = [];
  const buildingMap = new Map();
  const buildingQueue = [];
  const buildingFootprints = [];
  let renderedBuildingCount = 0;
  const outlineGroup = new THREE.Group();
  const debugRoadClipGroup = new THREE.Group();
  const debugCameraGroup = new THREE.Group();
  const materials = {
    window: new THREE.MeshBasicMaterial({ color: 0xa8d9e8, transparent: true, opacity: 0.82, side: THREE.DoubleSide }),
    door: new THREE.MeshBasicMaterial({ color: 0x191512, transparent: true, opacity: 0.86, side: THREE.DoubleSide }),
    shadow: new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false }),
  };

  const contextDistricts = sceneData.contextDistricts || [];
  const islandRoads = (sceneData.inheritedRoads || []).concat(...contextDistricts.map((district) => district.inheritedRoads || []));
  renderIslandRoadUnderlay(scene, islandRoads, [{ id: sceneData.district?.id, polygon: sceneData.outerPolygon }].concat(contextDistricts), center, scale);

  let contextBuildingCount = 0;
  contextDistricts.forEach((district) => {
    const result = renderContextDistrict(scene, district, payload, center, scale, materials, districtTargets);
    contextBuildingCount += result.buildings || 0;
  });

  addFlatShape(scene, sceneData.outerPolygon, center, scale, 0x969a91, 0, 1);
  addBridgeLandingMarkers(scene, sceneData.bridgeLandings, center, scale);
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
  // Street lighting is represented by the scene illumination; omit the old floating bulb dots.
  scene.add(debugRoadClipGroup);
  buildingQueue.forEach((building) => {
    scene.add(building);
    if (building.userData.safehouseMarker) safehouseMarkers.push(building.userData.safehouseMarker);
  });
  outlineGroup.visible = !!debug.parcelOutlines;
  scene.add(outlineGroup);
  if (payload.estateFocus) applyEstateFocusDimming(scene, payload.selectedParcelId);

  const targetDot = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffcc66 }));
  targetDot.position.set(0, 0.35, 0);
  debugCameraGroup.add(targetDot);
  debugCameraGroup.visible = !!debug.cameraTarget;
  scene.add(debugCameraGroup);

  const ambient = new THREE.AmbientLight(lighting.ambientColor, lighting.ambient);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(lighting.sunColor, lighting.sun);
  sun.position.set(lighting.sunPos[0], lighting.sunPos[1], lighting.sunPos[2]);
  scene.add(sun);

  const roadSpawn = (sceneData.roads || [])[0]
    ? worldPoint({ x: ((sceneData.roads || [])[0].a.x + (sceneData.roads || [])[0].b.x) / 2, y: ((sceneData.roads || [])[0].a.y + (sceneData.roads || [])[0].b.y) / 2 }, center, scale)
    : new THREE.Vector2(0, 0);
  sceneData.renderStats = {
    buildings: renderedBuildingCount,
    contextBuildings: contextBuildingCount,
    parcels: (sceneData.blocks || []).reduce((sum, block) => sum + ((block.parcels || []).length), 0),
  };
  return { scene, rayTargets, districtTargets, safehouseMarkers, center, scale, bounds: b, buildingMap, debugRoadClipGroup, debugCameraGroup, outlineGroup, boundary, roadSpawn, generated: sceneData, ambient, sun };
}

function mount(root, payload, onSelect) {
  cleanup(root);
  root._deskDonPayload = payload;
  root._deskDonSelect = onSelect;
  root.dataset.districtId = payload.district?.id || 'district';
  root.innerHTML = '<div class="district-three-loading"><span></span></div>';
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
  renderer.domElement.className = 'district-three-canvas';
  root.innerHTML = '';
  root.appendChild(renderer.domElement);

  const { scene, rayTargets, districtTargets, safehouseMarkers, buildingMap, debugCameraGroup, outlineGroup, center, scale, roadSpawn, generated, ambient, sun } = buildScene(payload);
  const roadNav = buildPawnRoadNav(generated.roads || [], center, scale, generated.blocks || []);
  const playerPawn = createPlayerPawn(payload.playerPawn || {});
  const playerRoute = new THREE.Group();
  const queuedRouteGroup = new THREE.Group();
  playerRoute.visible = false;
  scene.add(playerRoute);
  scene.add(queuedRouteGroup);
  scene.add(playerPawn);
  root._deskDonGenerated = generated;
  const camera = new THREE.OrthographicCamera(-12, 12, 8, -8, 0.1, 1000);
  const streetCamera = new THREE.PerspectiveCamera(62, 1, 0.05, 2000);
  const cameraTarget = new THREE.Vector3(0, 0, 0);
  const cameraDirection = new THREE.Vector3();
  const cameraLookTarget = new THREE.Vector3();
  const isoTarget = new THREE.Vector3();
  const estateFocus = !!payload.estateFocus && !!payload.selectedParcelId;
  const viewKey = (payload.district?.id || 'district') + (estateFocus ? ':estate' : '');
  const saved = savedViews.get(viewKey) || {};
  let zoom = saved.zoom || 1;
  let panX = saved.panX || 0;
  let panZ = saved.panZ || 0;
  let azimuth = typeof saved.azimuth === 'number' ? saved.azimuth : Math.PI / 4;
  let elevation = typeof saved.elevation === 'number' ? saved.elevation : Math.PI / 3.1;
  let cameraMode = saved.mode || 'iso';
  let detailVisible = true;
  let lastPixelRatio = 0;
  let markerVisible = true;
  let streetPos = saved.streetPos ? new THREE.Vector3(saved.streetPos.x, 1.7, saved.streetPos.z) : new THREE.Vector3(roadSpawn.x, 1.7, roadSpawn.y);
  let streetYaw = typeof saved.streetYaw === 'number' ? saved.streetYaw : azimuth + Math.PI;
  let streetPitch = typeof saved.streetPitch === 'number' ? saved.streetPitch : 0;
  let selectedParcelId = payload.selectedParcelId || saved.selectedParcelId || null;
  if (estateFocus && buildingMap.has(payload.selectedParcelId)) {
    const estateEntry = buildingMap.get(payload.selectedParcelId);
    selectedParcelId = payload.selectedParcelId;
    panX = estateEntry.center.x;
    panZ = estateEntry.center.y;
    zoom = Math.max(1.7, Math.min(3.2, saved.zoom || 1.9));
    cameraMode = 'iso';
  }
  let targetZoom = zoom;
  let viewportAspect = 1;
  const isoElevation = Math.PI / 3.1;
  let isoSnapOffset = 0;
  let dragging = false;
  let moved = false;
  let districtNavAnimating = false;
  let hoveredDistrictNav = null;
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
  const fpsLabel = document.createElement('div');
  fpsLabel.className = 'district-three-fps-label';
  fpsLabel.textContent = 'FPS --';
  root.appendChild(fpsLabel);
  root.dataset.safehouseMarkers = String(safehouseMarkers.length);
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
      const baseWall = new THREE.Color(entry.mesh.userData.originalColor || 0x888888);
      const baseRoof = new THREE.Color(entry.roofMesh.userData.originalColor || entry.mesh.userData.originalColor || 0x888888);
      const wallHighlight = baseWall.clone().lerp(new THREE.Color(0xffffff), 0.24);
      const roofHighlight = baseRoof.clone().lerp(new THREE.Color(0xffffff), 0.22);
      entry.mesh.material.color.copy(active ? wallHighlight : baseWall);
      if (entry.mesh.material.emissive) entry.mesh.material.emissive.copy(active ? baseWall.clone().multiplyScalar(0.18) : new THREE.Color(0x000000));
      entry.roofMesh.material.color.copy(active ? roofHighlight : baseRoof);
      if (entry.highlight) entry.highlight.visible = active;
      if (active && !entry.highlight) {
        const edgeColor = baseWall.clone().lerp(new THREE.Color(0xffffff), 0.42);
        const edge = new THREE.LineSegments(
          new THREE.EdgesGeometry(entry.mesh.geometry),
          new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity: 0.95 }),
        );
        edge.position.copy(entry.mesh.position);
        edge.userData.detailLine = true;
        entry.group.add(edge);
        entry.highlight = edge;
      }
    });
    selectedLabel.textContent = payload.debug?.selectedParcelId && parcelId ? `Selected parcel: ${parcelId}` : '';
  }

  function setModeUI() {
    root.classList.toggle('street-mode', cameraMode === 'street');
    crosshair.style.display = cameraMode === 'street' ? 'block' : 'none';
    streetInfo.style.display = cameraMode === 'street' ? 'block' : 'none';
  }

  function targetPixelRatio() {
    const deviceRatio = window.devicePixelRatio || 1;
    return Math.min(deviceRatio, 1);
  }

  function applyPerformanceLevel() {
    const nextDetailVisible = cameraMode === 'street' || estateFocus || zoom >= 0.82;
    if (nextDetailVisible !== detailVisible) {
      detailVisible = nextDetailVisible;
      if (outlineGroup) outlineGroup.visible = detailVisible && !!payload.debug?.parcelOutlines;
      scene.traverse((obj) => {
        if (obj.userData?.detailLine) obj.visible = detailVisible;
      });
    }
    const ratio = targetPixelRatio();
    if (Math.abs(ratio - lastPixelRatio) > 0.01) {
      renderer.setPixelRatio(ratio);
      lastPixelRatio = ratio;
    }
  }

  function updateCamera() {
    if (cameraMode === 'street') {
      cameraDirection.set(Math.sin(streetYaw) * Math.cos(streetPitch), Math.sin(streetPitch), Math.cos(streetYaw) * Math.cos(streetPitch));
      streetCamera.position.copy(streetPos);
      cameraLookTarget.copy(streetPos).add(cameraDirection);
      streetCamera.lookAt(cameraLookTarget);
      debugCameraGroup.position.set(streetPos.x, 0, streetPos.z);
      return;
    }
    const distance = 48 / zoom;
    const horizontal = Math.cos(elevation) * distance;
    isoTarget.set(cameraTarget.x + panX, 0, cameraTarget.z + panZ);
    camera.position.set(isoTarget.x + Math.cos(azimuth) * horizontal, Math.sin(elevation) * distance, isoTarget.z + Math.sin(azimuth) * horizontal);
    camera.lookAt(isoTarget);
    debugCameraGroup.position.set(panX, 0, panZ);
    camera.updateProjectionMatrix();
  }

  function resize() {
    applyPerformanceLevel();
    const rect = root.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(260, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    viewportAspect = aspect;
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

  function updateZoomProjection() {
    const size = 14 / zoom;
    camera.left = -size * viewportAspect;
    camera.right = size * viewportAspect;
    camera.top = size;
    camera.bottom = -size;
    camera.updateProjectionMatrix();
  }

  function renderLoop() {
    applyPerformanceLevel();
    updateCamera();
    renderer.render(scene, cameraMode === 'street' ? streetCamera : camera);
    renderedFrames += 1;
  }

  function currentTimePhase(now) {
    const minute = Number.isFinite(Number(payload.timeMinuteOfDay)) ? Number(payload.timeMinuteOfDay) : periodIndex(payload.timePeriod) * 360;
    const base = (((minute % 1440) + 1440) % 1440) / 1440;
    if (!payload.timeMoving) return base;
    const periodMs = Math.max(25, Number(payload.timePeriodMs || 120));
    const stepMinutes = Math.max(1, Number(payload.timeStepMinutes || 1));
    const elapsed = Math.max(0, now - Number(payload.timeStepStartedAt || now));
    return base + Math.min(stepMinutes / 1440, (elapsed / periodMs) * (stepMinutes / 1440));
  }

  function applyLiveLighting(now) {
    const lighting = lightingAtPhase(currentTimePhase(now));
    scene.background.copy(lighting.bg);
    ambient.color.copy(lighting.ambientColor);
    ambient.intensity = lighting.ambient;
    sun.color.copy(lighting.sunColor);
    sun.intensity = lighting.sun;
    sun.position.set(lighting.sunPos[0], lighting.sunPos[1], lighting.sunPos[2]);
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
  let nextRenderAt = performance.now();
  let renderedFrames = 0;
  let fpsLast = performance.now();
  function animate(now = performance.now()) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastFrame) / 1000));
    lastFrame = now;
    if (now - fpsLast >= 1000) {
      const measuredFps = Math.round((renderedFrames * 1000) / Math.max(1, now - fpsLast));
      fpsLabel.textContent = renderedFrames ? `FPS ${measuredFps}` : 'FPS idle';
      renderedFrames = 0;
      fpsLast = now;
    }
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
    const nextMarkerVisible = zoom >= 0.25;
    if (safehouseMarkers.length && markerVisible !== nextMarkerVisible) {
      markerVisible = nextMarkerVisible;
      safehouseMarkers.forEach((marker) => { marker.visible = markerVisible && !marker.userData.racketInactive; });
      renderLoop();
    }
    const activeMarkers = markerVisible ? safehouseMarkers.filter((marker) => marker.visible && !marker.userData.racketInactive) : [];
    const animateSafehouseMarkers = activeMarkers.length && markerVisible;
    if (animateSafehouseMarkers && markerVisible) {
      const timeSpinMultiplier = payload.timeMoving ? Math.max(1, Number(payload.timeVisualSpeed || payload.timeSpeed || 1)) : 1;
      activeMarkers.forEach((marker, i) => {
        marker.rotation.y += dt * (1.1 + i * 0.08) * timeSpinMultiplier;
        const markerScale = zoom < 0.58 ? Math.min(1.9, 1 + (0.58 - zoom) * 1.8) : 1;
        marker.scale.setScalar(markerScale);
        marker.position.y = (marker.userData.baseY || marker.position.y) + Math.sin(now * 0.002 * timeSpinMultiplier + i) * 0.08;
      });
    }
    const pawnAnimating = !!(payload.timeMoving && payload.playerPawn?.targetParcelId);
    const liveEntry = mounted.get(root);
    if (pawnAnimating && liveEntry) {
      [liveEntry.playerRoute, liveEntry.queuedRouteGroup].forEach((routeGroup) => routeGroup?.traverse((object) => {
        if (object.userData?.routeDash && object.material) object.material.dashOffset -= dt * 0.9;
        if (object.userData?.stopOrder) {
          const pulse = 1 + Math.sin(now * 0.004 + object.userData.stopOrder) * 0.08;
          object.scale.setScalar(pulse);
        }
      }));
    }
    const feedbackAnimating = !!(payload.playerPawn?.action?.active || liveEntry?.actionProgress?.visible || liveEntry?.cashFloat || (payload.playerPawn?.cashFloat?.amount && now - Number(payload.playerPawn.cashFloat.startedAt || 0) < 1800));
    if ((pawnAnimating || feedbackAnimating) && liveEntry) updatePlayerPawnObject(liveEntry, payload.playerPawn, buildingMap);
    if (playerPawn?.visible) {
      const markerScale = Math.max(0.9, Math.min(2.6, 1.12 / Math.max(0.45, zoom)));
      playerPawn.scale.setScalar(markerScale);
    }
    const zoomAnimating = Math.abs(targetZoom - zoom) > 0.0005;
    if (zoomAnimating) {
      const blend = 1 - Math.exp(-dt * 13);
      zoom += (targetZoom - zoom) * blend;
      if (Math.abs(targetZoom - zoom) < 0.0005) {
        zoom = targetZoom;
        saveView();
      }
      updateZoomProjection();
    }
    const streetMoved = stepStreet(dt);
    const needsContinuousRender = payload.timeMoving || pawnAnimating || feedbackAnimating || animateSafehouseMarkers || zoomAnimating || streetMoved || cameraMode === 'street';
    if (needsContinuousRender && now >= nextRenderAt) {
      if (payload.timeMoving) applyLiveLighting(now);
      renderLoop();
      nextRenderAt += 1000 / 180;
      if (nextRenderAt < now - 1000 / 180) nextRenderAt = now + 1000 / 180;
    }
    const entry = mounted.get(root);
    if (entry) entry.frame = requestAnimationFrame(animate);
  }

  function onWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    targetZoom = Math.max(0.45, Math.min(3.2, targetZoom * Math.exp(-e.deltaY * 0.0015)));
  }

  function onPointerDown(e) {
    e.preventDefault();
    e.stopPropagation();
    setDistrictHover(hoveredDistrictNav, false);
    hoveredDistrictNav = null;
    root.style.cursor = 'grabbing';
    if (cameraMode === 'street' && document.pointerLockElement !== root) {
      root.requestPointerLock?.();
    }
    if (e.button === 1 || e.button === 0 || e.button === 2) {
      dragging = true;
      moved = false;
      dragMode = cameraMode === 'street' ? 'look' : estateFocus ? 'rotate' : e.button === 2 ? 'rotate' : 'pan';
      isoSnapOffset = 0;
      last = { x: e.clientX, y: e.clientY };
      start = { x: e.clientX, y: e.clientY };
      root.setPointerCapture?.(e.pointerId);
    }
  }

  function onPointerMove(e) {
    if (!estateFocus && !dragging && cameraMode !== 'street' && districtTargets.length) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const districtHit = raycaster.intersectObjects(districtTargets, true)[0];
      const nextNav = districtHit?.object?.userData?.districtNav || null;
      if (nextNav !== hoveredDistrictNav) {
        setDistrictHover(hoveredDistrictNav, false);
        hoveredDistrictNav = nextNav;
        setDistrictHover(hoveredDistrictNav, true);
        root.style.cursor = hoveredDistrictNav ? 'pointer' : 'grab';
        renderLoop();
      }
      return;
    }
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
      const deltaElevation = dy * 0.0035;
      if (Math.abs(elevation - isoElevation) < 0.0001) {
        isoSnapOffset += deltaElevation;
        if (Math.abs(isoSnapOffset) > 0.035) {
          elevation = Math.max(0.22, Math.min(Math.PI / 2 - 0.01, isoElevation + isoSnapOffset - Math.sign(isoSnapOffset) * 0.035));
          isoSnapOffset = 0;
        }
      } else {
        const nextElevation = Math.max(0.22, Math.min(Math.PI / 2 - 0.01, elevation + deltaElevation));
        const crossedIso = (elevation - isoElevation) * (nextElevation - isoElevation) <= 0;
        if (crossedIso || Math.abs(nextElevation - isoElevation) < 0.015) {
          elevation = isoElevation;
          isoSnapOffset = 0;
        } else elevation = nextElevation;
      }
    } else {
      if (estateFocus) return;
      const factor = 0.018 / zoom;
      const cos = Math.cos(azimuth);
      const sin = Math.sin(azimuth);
      panX -= (dx * sin + dy * cos) * factor;
      panZ += (dx * cos - dy * sin) * factor;
    }
    renderLoop();
  }

  function projectedBuildingHit(activeCamera) {
    let best = null;
    const corners = [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ];
    buildingMap.forEach((entry) => {
      const box = new THREE.Box3().setFromObject(entry.group);
      if (!Number.isFinite(box.min.x) || !Number.isFinite(box.max.x)) return;
      corners[0].set(box.min.x, box.min.y, box.min.z);
      corners[1].set(box.min.x, box.min.y, box.max.z);
      corners[2].set(box.min.x, box.max.y, box.min.z);
      corners[3].set(box.min.x, box.max.y, box.max.z);
      corners[4].set(box.max.x, box.min.y, box.min.z);
      corners[5].set(box.max.x, box.min.y, box.max.z);
      corners[6].set(box.max.x, box.max.y, box.min.z);
      corners[7].set(box.max.x, box.max.y, box.max.z);
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      corners.forEach((corner) => {
        const projected = corner.clone().project(activeCamera);
        minX = Math.min(minX, projected.x);
        maxX = Math.max(maxX, projected.x);
        minY = Math.min(minY, projected.y);
        maxY = Math.max(maxY, projected.y);
      });
      const pad = 0.012;
      if (pointer.x < minX - pad || pointer.x > maxX + pad || pointer.y < minY - pad || pointer.y > maxY + pad) return;
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const distance = Math.hypot(pointer.x - cx, pointer.y - cy);
      if (!best || distance < best.distance) best = { entry, distance };
    });
    return best?.entry || null;
  }

  function animateDistrictNavigation(nav) {
    if (!nav?.id || districtNavAnimating) return;
    districtNavAnimating = true;
    const startX = panX;
    const startZ = panZ;
    const targetPoly = (payload.contextDistricts || []).find((district) => district.id === nav.id)?.polygon || null;
    const targetCenter = targetPoly ? worldPoint(centroid(targetPoly), center, scale) : new THREE.Vector2(startX, startZ);
    const startTime = performance.now();
    const duration = 520;
    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      panX = startX + (targetCenter.x - startX) * ease;
      panZ = startZ + (targetCenter.y - startZ) * ease;
      renderLoop();
      if (t < 1) {
        requestAnimationFrame(step);
        return;
      }
      saveView();
      savedViews.set(nav.id, {
        zoom,
        panX: 0,
        panZ: 0,
        azimuth,
        elevation,
        selectedParcelId: null,
        mode: cameraMode,
        streetPos: { x: streetPos.x, y: streetPos.y, z: streetPos.z },
        streetYaw,
        streetPitch,
      });
      const entering = document.createElement('div');
      entering.className = 'district-three-entering district-three-entering-cover';
      const card = document.createElement('div');
      card.className = 'district-three-entering-card';
      const small = document.createElement('small');
      small.textContent = 'Entering...';
      const strong = document.createElement('strong');
      strong.textContent = nav.name || 'District';
      card.appendChild(small);
      card.appendChild(strong);
      entering.appendChild(card);
      root.appendChild(entering);
      window.setTimeout(() => {
        if (typeof onSelect === 'function') onSelect({ districtId: nav.id, name: nav.name, entering: true });
      }, 300);
    }
    requestAnimationFrame(step);
  }

  function setDistrictHover(nav, active) {
    if (!nav) return;
    if (nav.hoverFill) nav.hoverFill.visible = active;
    if (nav.hoverLine) nav.hoverLine.visible = active;
    (nav.hoverObjects || []).forEach((obj) => {
      obj.traverse((child) => {
        if (!child.material) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          if (active) {
            if (mat.color) mat.color.setHex(obj.userData.hoverColor || 0xd5b563);
            mat.transparent = true;
            mat.opacity = obj.userData.hoverOpacity || 0.72;
            mat.depthWrite = mat.opacity > 0.45;
          } else {
            if (mat.color && mat.userData.originalHoverColor !== undefined) mat.color.setHex(mat.userData.originalHoverColor);
            mat.transparent = mat.userData.originalHoverTransparent;
            mat.opacity = mat.userData.originalHoverOpacity;
            mat.depthWrite = mat.userData.originalHoverDepthWrite;
          }
          mat.needsUpdate = true;
        });
      });
    });
  }

  function onPointerUp(e) {
    e.preventDefault();
    e.stopPropagation();
    const wasMoved = moved;
    dragging = false;
    moved = false;
    try { root.releasePointerCapture?.(e.pointerId); } catch {}
    root.style.cursor = 'grab';
    if (wasMoved) {
      if (dragMode === 'rotate' && Math.abs(elevation - isoElevation) < 0.07) elevation = isoElevation;
      renderLoop();
      saveView();
      return;
    }
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    if (cameraMode === 'street') {
      pointer.x = 0;
      pointer.y = 0;
    }
    raycaster.setFromCamera(pointer, cameraMode === 'street' ? streetCamera : camera);
    const hit = raycaster.intersectObjects(rayTargets, true)[0];
    const fallbackEntry = hit?.object?.userData?.parcel ? null : projectedBuildingHit(cameraMode === 'street' ? streetCamera : camera);
    const selectedParcel = hit?.object?.userData?.parcel || fallbackEntry?.parcel || null;
    if (estateFocus && selectedParcel && selectedParcel.id !== payload.selectedParcelId) {
      renderLoop();
      return;
    }
    if (selectedParcel && typeof onSelect === 'function') {
      selectedParcelId = selectedParcel.id;
      applyHighlight(selectedParcelId);
      saveView();
      onSelect(selectedParcel);
      root.dispatchEvent(new CustomEvent('deskdon-building-selected', { detail: selectedParcel, bubbles: true }));
      renderLoop();
      return;
    }
    if (estateFocus) return;
    const districtHit = raycaster.intersectObjects(districtTargets, true)[0];
    if (districtHit?.object?.userData?.districtNav) {
      animateDistrictNavigation(districtHit.object.userData.districtNav);
    }
  }

  function parcelAtClientPoint(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, cameraMode === 'street' ? streetCamera : camera);
    const hit = raycaster.intersectObjects(rayTargets, true)[0];
    const fallbackEntry = hit?.object?.userData?.parcel ? null : projectedBuildingHit(cameraMode === 'street' ? streetCamera : camera);
    return hit?.object?.userData?.parcel || fallbackEntry?.parcel || null;
  }

  const onResize = () => resize();
  const cancelPointerInteraction = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      try { root.releasePointerCapture?.(e.pointerId); } catch {}
    }
    dragging = false;
    moved = false;
    dragMode = '';
    setDistrictHover(hoveredDistrictNav, false);
    hoveredDistrictNav = null;
    root.style.cursor = 'grab';
  };
  const onPointerLeave = cancelPointerInteraction;
  const onPointerCancel = cancelPointerInteraction;
  const onContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedParcel = parcelAtClientPoint(e.clientX, e.clientY);
    if (selectedParcel) {
      selectedParcelId = selectedParcel.id;
      applyHighlight(selectedParcelId);
      saveView();
      if (typeof onSelect === 'function') onSelect(selectedParcel);
      root.dispatchEvent(new CustomEvent('deskdon-building-context', { detail: { parcel: selectedParcel, x: e.clientX, y: e.clientY }, bubbles: true }));
      renderLoop();
    }
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
        root.dispatchEvent(new CustomEvent('deskdon-building-selected', { detail: hit.object.userData.parcel, bubbles: true }));
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
  root.addEventListener('pointercancel', onPointerCancel);
  root.addEventListener('pointerleave', onPointerLeave);
  root.addEventListener('contextmenu', onContextMenu);
  window.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('keyup', onKeyUp, true);
  document.addEventListener('mousemove', onDocumentMouseMove);
  window.addEventListener('resize', onResize);

  resize();
  setModeUI();
  applyHighlight(selectedParcelId);
  updatePlayerPawnObject({ root, playerPawn, playerRoute, queuedRouteGroup, roadNav }, payload.playerPawn, buildingMap);
  const frame = requestAnimationFrame(animate);
  mounted.set(root, { root, renderer, scene, onResize, onWheel, onPointerDown, onPointerMove, onPointerUp, onPointerLeave, onPointerCancel, onContextMenu, onKeyDown, onKeyUp, onDocumentMouseMove, applyLiveLighting, renderLoop, frame, playerPawn, playerRoute, queuedRouteGroup, buildingMap, roadNav, safehouseMarkers, center, scale });
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
    view.elevation = Math.PI / 2 - 0.01;
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

function updateTime(root, timePayload) {
  if (!root?._deskDonPayload) return;
  Object.assign(root._deskDonPayload, timePayload || {});
  withMounted(root, (entry) => {
    updatePlayerPawnObject(entry, root._deskDonPayload.playerPawn, entry.buildingMap);
    if (root._deskDonPayload.timeMoving) return;
    entry.applyLiveLighting?.(performance.now());
    entry.renderLoop?.();
  });
}

function updateFogOpacity(root, opacity) {
  const nextOpacity = Math.max(0.06, Math.min(0.6, Number(opacity ?? 0.24)));
  if (root?._deskDonPayload) root._deskDonPayload.fogBuildingOpacity = nextOpacity;
  withMounted(root, (entry) => {
    entry.scene.traverse((obj) => {
      if (!obj.userData?.fogBuilding || !obj.material) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat) => {
        mat.transparent = true;
        mat.opacity = nextOpacity;
        mat.userData.originalHoverOpacity = nextOpacity;
        mat.needsUpdate = true;
      });
    });
    entry.renderLoop?.();
  });
}

function updateRackets(root, racketPayload) {
  if (!root?._deskDonPayload) return;
  const payload = racketPayload || {};
  root._deskDonPayload.mafiaColor = payload.mafiaColor || root._deskDonPayload.mafiaColor || '#ff1d1d';
  root._deskDonPayload.protectedBusinesses = payload.protectedBusinesses || {};
  root._deskDonPayload.collectionRushActive = !!payload.collectionRushActive;
  withMounted(root, (entry) => {
    const protectedBusinesses = root._deskDonPayload.protectedBusinesses || {};
    entry.buildingMap.forEach((building, id) => {
      const starterRacket = root._deskDonPayload.collectionRushActive && building.parcel.mafiaProtected && building.parcel.racketWeeklyDue
        ? { color: building.parcel.protectionColor || root._deskDonPayload.mafiaColor || '#ff1d1d', weeklyDue: building.parcel.racketWeeklyDue, ready: true }
        : null;
      const racket = protectedBusinesses[id] || starterRacket;
      if (!racket) {
        if (building.group.userData.racketMoneyMarker) {
          building.group.userData.racketMoneyMarker.userData.racketInactive = true;
          building.group.userData.racketMoneyMarker.visible = false;
        }
        return;
      }
      const color = racket.color || root._deskDonPayload.mafiaColor || '#ff1d1d';
      building.parcel.mafiaProtected = true;
      building.parcel.protectionColor = color;
      building.parcel.racketWeeklyDue = racket.weeklyDue || building.parcel.racketWeeklyDue || 0;
      building.parcel.racketReady = !!racket.ready;
      if (!building.group.userData.protectionStripes) {
        building.group.userData.protectionStripes = addProtectionOverlay(building.group, building.footprint || null, entry.center || { x: 0, y: 0 }, entry.scale || WORLD_SCALE, building.center, building.width || 1, building.depth || 1, building.height || 1, color);
      } else {
        building.group.userData.protectionStripes.visible = true;
      }
      if (!building.group.userData.racketMoneyMarker) {
        building.group.userData.racketMoneyMarker = addMoneyIcon(building.group, building.center.x, (building.height || 1) + 1.05, building.center.y);
        entry.safehouseMarkers?.push(building.group.userData.racketMoneyMarker);
      }
      building.group.userData.racketMoneyMarker.userData.racketInactive = !racket.ready;
      building.group.userData.racketMoneyMarker.visible = !!racket.ready;
    });
    entry.renderLoop?.();
  });
}

window.DeskDon3D = { mount, cleanup, rotate, cameraView, resetCamera, updateTime, updateFogOpacity, updateRackets };
window.DeskDon3D.exportData = function exportData(root) {
  return root?._deskDonGenerated || null;
};
window.dispatchEvent(new Event('deskdon-three-ready'));
