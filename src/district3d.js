import * as THREE from '/node_modules/three/build/three.module.js';
import { mergeGeometries } from '/node_modules/three/examples/jsm/utils/BufferGeometryUtils.js';
import { FontLoader } from '/node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '/node_modules/three/examples/jsm/geometries/TextGeometry.js';
import helvetikerBold from '/node_modules/three/examples/fonts/helvetiker_bold.typeface.json';
import { disposeObject } from './district3d/core/disposal.js';
import { buildingProfilesFor, colorByCategory, profileForSubtype, typeForCategory } from './district3d/core/building-profiles.js';
import { lightingAtPhase, lightingForPayload, lightingForPeriod, periodIndex } from './district3d/core/lighting.js';
import { createStreetAtmosphere } from './district3d/core/street-lighting.js';
import {
  buildMergedMafiaTerritoryOverlay,
  controlledTerritoryBlockIds,
  updateTerritoryOverlayForZoom,
} from './district3d/overlays/territory-overlay.js';
import {
  cleanWorldPoly,
  clipPolyHalfPlane,
  clipPolygonToPolygon,
  clipPolygonToRect,
  hashNumber,
  makeCuts,
  pointInPoly,
  rectPoly,
  rotateForGenerationPoint,
  seeded3d,
  sourcePoint,
  transformBlock,
  transformBlockAffine,
  transformPolygon,
  transformPolyAffine,
  transformRoad,
  transformRoadAffine,
  unrotateGeneratedPoint,
  worldPoint,
} from './district3d/core/geometry.js';

const mounted = new Map();
const savedViews = new Map();
const RENDERER_VERSION = 'Pre-Alpha version 0.34';
const WORLD_SCALE = 0.1;
const FLOOR_HEIGHT = 2.35;
const HEIGHT_SCALE = 0.33;
const INFO_AREA_SCALE = 13;
const ICON_FONT = new FontLoader().parse(helvetikerBold);
const GRID_ROAD_COLOR = 0x0d0c0a;
const GRID_SIDEWALK_COLOR = 0x454942;
const emptyDebug = {
  boundary: true,
  parcelOutlines: true,
  roadClipPoints: false,
  selectedParcelId: true,
  cameraTarget: false,
  windows: false,
  exactExtrusion: true,
};

function cleanup(root) {
  const entry = mounted.get(root);
  if (!entry) return;
  window.removeEventListener('resize', entry.onResize);
  root.removeEventListener('wheel', entry.onWheel);
  if (entry.wheelPanel) entry.wheelPanel.removeEventListener('wheel', entry.onWheel);
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

function sanitizeSceneParcel(parcel) {
  if (!parcel) return parcel;
  if (parcel.category === 'Criminal') {
    parcel.category = 'Commercial';
    parcel.subtype = /Safehouse|Drug House|Gambling Den|Crew HQ|Major Syndicate HQ|Underground Casino/i.test(String(parcel.subtype || '')) ? 'Bar' : (parcel.subtype || 'Bar');
    parcel.kind = parcel.subtype;
    parcel.sector = parcel.sector === 'Command' || parcel.sector === 'Street Distribution' || parcel.sector === 'Gambling Operations' || parcel.sector === 'Operational Support' ? 'Nightlife' : (parcel.sector || 'Commercial');
    parcel.legality = parcel.legality === 'Illegal' || parcel.legality === 'Hidden Illegal' ? 'Gray' : (parcel.legality || 'Gray');
    parcel.ownershipType = parcel.ownershipType === 'Independent Criminal' ? 'Private Business' : (parcel.ownershipType || 'Private Business');
    parcel.defaultFactionControl = parcel.defaultFactionControl === 'independent_criminal' ? 'neutral' : (parcel.defaultFactionControl || 'neutral');
    parcel.occupiedBy = parcel.occupiedBy === 'independent_criminal' ? 'neutral' : (parcel.occupiedBy || 'neutral');
    parcel.isSafehouse = false;
    parcel.hasHiddenOperation = false;
    parcel.hiddenOperationType = '';
    if (!parcel.displayName || /Safehouse|Drug House|Gambling Den|Crew HQ|Major Syndicate HQ|Underground Casino/i.test(String(parcel.displayName))) parcel.displayName = parcel.businessName || parcel.locationName || parcel.subtype;
    if (!parcel.label || /Safehouse|Drug House|Gambling Den|Crew HQ|Major Syndicate HQ|Underground Casino/i.test(String(parcel.label))) parcel.label = parcel.displayName;
  }
  return parcel;
}

function applyPayloadParcelIdentities(blocks, payload, rotateVertical, pivot) {
  const sourceParcels = (payload.blocks || [])
    .flatMap((block) => block.parcels || [])
    .filter((parcel) => parcel?.id && parcel.polygon?.length)
    .map((parcel) => {
      const polygon = rotateVertical ? transformPolygon(parcel.polygon || [], rotateForGenerationPoint, pivot) : cleanWorldPoly(parcel.polygon || []);
      return { parcel, polygon, center: centroid(polygon), used: false };
    });
  if (!sourceParcels.length) return;
  const generatedParcels = blocks.flatMap((block) => (block.parcels || []).map((parcel) => ({ block, parcel, center: centroid(parcel.polygon || []) })));
  generatedParcels.forEach((entry) => {
    let best = null;
    sourceParcels.forEach((source) => {
      if (source.used) return;
      const categoryPenalty = String(source.parcel.category || '') === String(entry.parcel.category || '') ? 0 : 160;
      const subtypePenalty = String(source.parcel.subtype || '') === String(entry.parcel.subtype || '') ? 0 : 30;
      const score = Math.hypot(entry.center.x - source.center.x, entry.center.y - source.center.y) + categoryPenalty + subtypePenalty;
      if (!best || score < best.score) best = { source, score };
    });
    if (!best?.source || best.score > 260) return;
    best.source.used = true;
    const source = best.source.parcel;
    const generatedPolygon = entry.parcel.polygon;
    const generatedBuildingPolygon = entry.parcel.buildingPolygon;
    Object.assign(entry.parcel, source, {
      id: source.id,
      blockId: entry.block.id,
      polygon: generatedPolygon,
      buildingPolygon: generatedBuildingPolygon || generatedPolygon,
      displayName: source.mainBuildingName || source.displayName || source.businessName || source.locationName || source.label || entry.parcel.displayName,
      label: source.mainBuildingName || source.displayName || source.businessName || source.locationName || source.label || entry.parcel.label,
      mainBuildingName: source.mainBuildingName || source.displayName || source.businessName || source.locationName || source.label || entry.parcel.displayName,
    });
  });
}

function normalizeOperationalState(value) {
  value = String(value?.state || value || 'Active').toLowerCase();
  return value === 'inactive' ? 'Inactive' : 'Active';
}

function applyPayloadBuildingState(parcel, payload) {
  if (!parcel) return parcel;
  const record = (payload?.buildingStates || {})[parcel.id];
  const state = normalizeOperationalState(record || parcel.operationalState || parcel.status);
  parcel.operationalState = state;
  parcel.isActive = state === 'Active';
  parcel.isInactive = !parcel.isActive;
  const protectedRecord = (payload?.protectedBusinesses || {})[parcel.id];
  if (protectedRecord) {
    parcel.mafiaProtected = true;
    parcel.mafiaControlled = !!protectedRecord.controlled;
    parcel.protectionFamily = protectedRecord.family || 'player';
    parcel.protectionColor = protectedRecord.color || payload.mafiaColor || '#ff1d1d';
    parcel.racketWeeklyDue = protectedRecord.weeklyDue || parcel.racketWeeklyDue || 0;
    parcel.racketReady = !!protectedRecord.ready;
  }
  return parcel;
}

function applyPayloadBuildingStatesToBlocks(blocks, payload) {
  (blocks || []).forEach((block) => (block.parcels || []).forEach((parcel) => applyPayloadBuildingState(parcel, payload)));
  return blocks;
}

function generatePayloadGridDistrict(payload) {
  const outputPoly = cleanWorldPoly(payload.outerPolygon || []);
  const outputRoads = (payload.roads || [])
    .filter((road) => road?.a && road?.b)
    .map((road, index) => ({
      ...road,
      id: road.id || `metro-road-${index}`,
      a: { x: Number(road.a.x) || 0, y: Number(road.a.y) || 0 },
      b: { x: Number(road.b.x) || 0, y: Number(road.b.y) || 0 },
      width: Number(road.width) || 10,
      kind: road.kind || 'minor',
    }));
  const outputBlocks = (payload.blocks || [])
    .map((block, blockIndex) => {
      const blockPoly = cleanWorldPoly(block.polygon || []);
      return {
        ...block,
        id: block.id || `metro-block-${blockIndex}`,
        label: block.label || `Block ${blockIndex + 1}`,
        districtId: block.districtId || payload.district?.id || 'district',
        polygon: blockPoly,
        parcels: (block.parcels || [])
          .map((parcel, parcelIndex) => {
            const next = sanitizeSceneParcel({
              ...parcel,
              id: parcel.id || `${block.id || `metro-block-${blockIndex}`}_p${parcelIndex}`,
              blockId: parcel.blockId || block.id || `metro-block-${blockIndex}`,
              districtId: parcel.districtId || block.districtId || payload.district?.id || 'district',
              polygon: cleanWorldPoly(parcel.polygon || []),
            });
            if (next.isBuildable !== false) next.isBuildable = true;
            if (next.isBuildable && (!next.buildingPolygon || next.buildingPolygon.length < 3)) next.buildingPolygon = next.polygon;
            return applyPayloadBuildingState(next, payload);
          })
          .filter((parcel) => parcel.polygon && parcel.polygon.length >= 3),
      };
    })
    .filter((block) => block.polygon && block.polygon.length >= 3);
  return {
    version: RENDERER_VERSION,
    style: payload.gridLabel || 'METRO_GRID_12X12',
    outerPolygon: outputPoly,
    contextDistricts: [],
    roads: outputRoads,
    blocks: outputBlocks,
    generationTransform: 'payload-metro-grid',
    validation: validateGeneratedDistrict(outputPoly, outputRoads, outputBlocks),
  };
}

function generate3dDistrict(payload) {
  const sourcePoly = cleanWorldPoly(payload.outerPolygon || []);
  if (payload.gridCityView && payload.blocks?.length) return generatePayloadGridDistrict(payload);
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
      block.parcels = splitBlockIntoRoadFacingParcels(block, category === 'Criminal' ? 'Commercial' : category, districtPoly, roads, cfg, style, payload.district, rand).map(sanitizeSceneParcel);
      if (block.parcels.length) blocks.push(block);
    }
  }
  const payloadEstate = (payload.blocks || []).flatMap((block) => block.parcels || []).find((parcel) => parcel?.isFamilyEstate);
  if (payloadEstate) {
    blocks.forEach((block) => (block.parcels || []).forEach((parcel) => {
      parcel.isFamilyEstate = false;
      if (parcel.subtype === 'Family Estate') parcel.subtype = 'Residence';
      if (parcel.label === 'Family Estate' || parcel.displayName === 'Family Estate') {
        parcel.label = parcel.businessName || parcel.locationName || 'Residence';
        parcel.displayName = parcel.label;
      }
    }));
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
  if (payload.playerSafehouse?.parcelId) {
    let foundSafehouse = null;
    blocks.forEach((block) => (block.parcels || []).forEach((parcel) => {
      parcel.isPlayerSafehouse = false;
      if (parcel.label === 'Starting Safehouse' || parcel.displayName === 'Starting Safehouse') {
        parcel.label = parcel.businessName || parcel.locationName || parcel.subtype || 'Residence';
        parcel.displayName = parcel.label;
      }
      const sameDistrict = !payload.playerSafehouse.districtId || parcel.districtId === payload.playerSafehouse.districtId || block.districtId === payload.playerSafehouse.districtId;
      if (!foundSafehouse && sameDistrict && parcel.id === payload.playerSafehouse.parcelId) foundSafehouse = { block, parcel };
    }));
    if (foundSafehouse?.parcel) {
      Object.assign(foundSafehouse.parcel, {
        id: payload.playerSafehouse.parcelId,
        blockId: foundSafehouse.block.id,
        label: 'Starting Safehouse',
        displayName: 'Starting Safehouse',
        isPlayerSafehouse: true,
        isSafehouse: true,
        defaultFactionControl: 'player_family',
        occupiedBy: 'player_family',
        familyId: 'player',
        description: 'The family starting house: small, quiet, and useful as the first private place to hide, plan, and recover.',
        security: Math.max(foundSafehouse.parcel.security || 0, 48),
        strategicValue: Math.max(foundSafehouse.parcel.strategicValue || 0, 70),
      });
    }
  } else {
    blocks.forEach((block) => (block.parcels || []).forEach((parcel) => {
      parcel.isPlayerSafehouse = false;
      if (parcel.label === 'Starting Safehouse' || parcel.displayName === 'Starting Safehouse') {
        parcel.label = parcel.businessName || parcel.locationName || parcel.subtype || 'Residence';
        parcel.displayName = parcel.label;
      }
    }));
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
        parcel.mafiaControlled = !!protectedState[id].controlled;
        parcel.protectionFamily = protectedState[id].family || 'player';
        parcel.protectionColor = protectedState[id].color || payload.mafiaColor || '#6fb35e';
        parcel.racketWeeklyDue = protectedState[id].weeklyDue || 0;
        parcel.racketReady = !!protectedState[id].ready;
      }
    });
  }
  applyPayloadParcelIdentities(blocks, payload, rotateVertical, pivot);
  applyPayloadBuildingStatesToBlocks(blocks, payload);
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

function addBlockSidewalkBand(scene, poly, center, scale, options = {}) {
  if (!poly || poly.length < 2) return null;
  const width = options.width ?? 7.5;
  const y = options.y ?? 0.029;
  const color = options.color ?? 0x363936;
  const material = new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide });
  const group = new THREE.Group();
  for (let i = 0; i < poly.length; i += 1) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < 3) continue;
    const px = (-dy / len) * width * 0.5;
    const py = (dx / len) * width * 0.5;
    const strip = [
      { x: a.x + px, y: a.y + py },
      { x: b.x + px, y: b.y + py },
      { x: b.x - px, y: b.y - py },
      { x: a.x - px, y: a.y - py },
    ];
    const geo = new THREE.ShapeGeometry(shapeFromPoly(strip, center, scale));
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = y;
    group.add(mesh);
  }
  if (!group.children.length) return null;
  scene.add(group);
  return group;
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

function gridRoadSideClearance(width) {
  return Math.max(12, Math.round((width || 12) * 0.5 + 7));
}

function roadMesh(road, center, scale, aPoint, bPoint, outerPolygon, options = {}) {
  const sourceA = aPoint || road.a;
  const sourceB = bPoint || road.b;
  const dxSource = sourceB.x - sourceA.x;
  const dySource = sourceB.y - sourceA.y;
  const lenSource = Math.max(0.001, Math.hypot(dxSource, dySource));
  const halfWidth = (road.width || 12) * 0.5;
  const cap = halfWidth * (options.capScale ?? 0.65);
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
  const roadColor = options.color ?? (roadColors[road.kind] || 0x30343b);
  const mat = options.basic
    ? new THREE.MeshBasicMaterial({ color: roadColor, side: THREE.DoubleSide })
    : new THREE.MeshLambertMaterial({ color: roadColor, side: THREE.DoubleSide });
  const roadY = options.y ?? (road.kind === 'highway' ? 0.038 : road.kind === 'arterial' ? 0.036 : road.kind === 'collector' ? 0.034 : 0.032);
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

function sidewalkMeshForRoad(road, center, scale, aPoint, bPoint, outerPolygon, options = {}) {
  const sourceA = aPoint || road.a;
  const sourceB = bPoint || road.b;
  const dxSource = sourceB.x - sourceA.x;
  const dySource = sourceB.y - sourceA.y;
  const lenSource = Math.max(0.001, Math.hypot(dxSource, dySource));
  const halfWidth = (road.width || 12) * 0.5;
  const outerOffset = options.outerOffset ?? gridRoadSideClearance(road.width || 12);
  const cap = halfWidth * (options.capScale ?? 0.65);
  const ux = dxSource / lenSource;
  const uy = dySource / lenSource;
  const nx = -uy;
  const ny = ux;
  const a = { x: sourceA.x - ux * cap, y: sourceA.y - uy * cap };
  const b = { x: sourceB.x + ux * cap, y: sourceB.y + uy * cap };
  const mat = new THREE.MeshLambertMaterial({ color: options.color ?? GRID_SIDEWALK_COLOR, side: THREE.DoubleSide, depthWrite: true });
  const group = new THREE.Group();
  [-1, 1].forEach((side) => {
    const inner = halfWidth;
    const outer = Math.max(inner + 1, outerOffset);
    const strip = [
      { x: a.x + nx * inner * side, y: a.y + ny * inner * side },
      { x: b.x + nx * inner * side, y: b.y + ny * inner * side },
      { x: b.x + nx * outer * side, y: b.y + ny * outer * side },
      { x: a.x + nx * outer * side, y: a.y + ny * outer * side },
    ];
    const clippedPolys = outerPolygon ? roadPolysClippedToDistrict(strip, outerPolygon) : [strip];
    clippedPolys
      .filter((poly) => poly.length >= 3 && Math.abs(areaFromPoly(poly)) > 0.5)
      .forEach((poly) => {
        const geo = new THREE.ShapeGeometry(shapeFromPoly(poly, center, scale));
        geo.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = options.y ?? 0.031;
        group.add(mesh);
      });
  });
  return group.children.length ? group : null;
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

function addGridRoadIntersectionPatches(scene, roads, outerPolygon, center, scale) {
  const entries = (roads || [])
    .map((road) => ({ road, span: roadAxisSpanThroughPolygon(road, outerPolygon) }))
    .filter((entry) => entry.span)
    .map((entry) => {
      const dx = entry.span.b.x - entry.span.a.x;
      const dy = entry.span.b.y - entry.span.a.y;
      return { ...entry, vertical: Math.abs(dy) >= Math.abs(dx) };
    });
  const vertical = entries.filter((entry) => entry.vertical);
  const horizontal = entries.filter((entry) => !entry.vertical);
  const mat = new THREE.MeshLambertMaterial({ color: GRID_ROAD_COLOR, side: THREE.DoubleSide });
  const group = new THREE.Group();
  vertical.forEach((v) => {
    const x = (v.span.a.x + v.span.b.x) * 0.5;
    const minY = Math.min(v.span.a.y, v.span.b.y) - 0.1;
    const maxY = Math.max(v.span.a.y, v.span.b.y) + 0.1;
    horizontal.forEach((h) => {
      const y = (h.span.a.y + h.span.b.y) * 0.5;
      const minX = Math.min(h.span.a.x, h.span.b.x) - 0.1;
      const maxX = Math.max(h.span.a.x, h.span.b.x) + 0.1;
      if (x < minX || x > maxX || y < minY || y > maxY) return;
      const halfW = Math.max(1, (v.road.width || 12) * 0.5);
      const halfH = Math.max(1, (h.road.width || 12) * 0.5);
      const patch = [
        { x: x - halfW, y: y - halfH },
        { x: x + halfW, y: y - halfH },
        { x: x + halfW, y: y + halfH },
        { x: x - halfW, y: y + halfH },
      ];
      const clipped = outerPolygon ? roadPolysClippedToDistrict(patch, outerPolygon) : [patch];
      clipped
        .filter((poly) => poly.length >= 3 && Math.abs(areaFromPoly(poly)) > 0.5)
        .forEach((poly) => {
          const geo = new THREE.ShapeGeometry(shapeFromPoly(poly, center, scale));
          geo.rotateX(-Math.PI / 2);
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.y = 0.041;
          group.add(mesh);
        });
    });
  });
  if (group.children.length) scene.add(group);
}

function clippedRoadMeshes(scene, road, outerPolygon, center, scale, debugGroup, buildingFootprints = [], options = {}) {
  const span = roadAxisSpanThroughPolygon(road, outerPolygon);
  if (!span) return;
  if (!options.ignoreBuildingFootprints && !road.seam && !road.perimeter && roadSpanBlockedByBuildings(span, buildingFootprints, road.width || 12)) return;
  const mesh = roadMesh(road, center, scale, span.a, span.b, outerPolygon, options);
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

function addRoadNameLabels(scene, roads, outerPolygon, center, scale) {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: 0xe9d187,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    depthTest: true,
  });
  const placedRects = [];
  const labelEntries = (roads || []).map((road) => {
    if (!(road?.streetName || road?.name) || !road.a || !road.b) return;
    const span = roadAxisSpanThroughPolygon(road, outerPolygon);
    if (!span) return;
    const dx = span.b.x - span.a.x;
    const dy = span.b.y - span.a.y;
    const sourceLength = Math.hypot(dx, dy);
    const worldLength = sourceLength * scale;
    if (worldLength < 8) return;
    const label = String(road.streetName || road.name).trim().toUpperCase();
    if (!label) return;
    return { road, span, dx, dy, worldLength, label, priority: (road.width || 10) * (road.kind === 'avenue' ? 1.45 : road.kind === 'collector' ? 1.18 : 1) };
  }).filter(Boolean).sort((a, b) => b.priority - a.priority || b.worldLength - a.worldLength);
  const rectsOverlap = (a, b) => !(a.maxX < b.minX || a.minX > b.maxX || a.maxZ < b.minZ || a.minZ > b.maxZ);
  const overlapArea = (a, b) => Math.max(0, Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX)) * Math.max(0, Math.min(a.maxZ, b.maxZ) - Math.max(a.minZ, b.minZ));
  labelEntries.forEach((entry) => {
    const { road, span, dx, dy, worldLength, label } = entry;
    const roadWidth = Number(road.width || 10);
    const widthFactor = Math.max(0, Math.min(1, (roadWidth - 8) / 24));
    const kindBoost = road.kind === 'avenue' ? 0.18 : road.kind === 'collector' ? 0.07 : 0;
    const size = 0.42 + widthFactor * 0.32 + kindBoost;
    const geometry = new TextGeometry(label, {
      font: ICON_FONT,
      size,
      depth: 0.006,
      curveSegments: 1,
      bevelEnabled: false,
    });
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const width = Math.max(0.001, box.max.x - box.min.x);
    const height = Math.max(0.001, box.max.y - box.min.y);
    const fit = Math.min(1, (worldLength * 0.68) / width);
    if (fit < 0.42) {
      geometry.dispose();
      return;
    }
    geometry.translate(-box.min.x - width * 0.5, -box.min.y - height * 0.5, 0);
    geometry.rotateX(-Math.PI / 2);
    let angle = Math.atan2(dy, dx);
    if (angle > Math.PI / 2 || angle < -Math.PI / 2) angle += Math.PI;
    const labelWidth = width * fit;
    const labelHeight = height * fit;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rectAt = (wp) => {
      const pad = 0.36;
      const halfX = (Math.abs(cos) * labelWidth + Math.abs(sin) * labelHeight) * 0.5 + pad;
      const halfZ = (Math.abs(sin) * labelWidth + Math.abs(cos) * labelHeight) * 0.5 + pad;
      return { minX: wp.x - halfX, maxX: wp.x + halfX, minZ: wp.y - halfZ, maxZ: wp.y + halfZ };
    };
    const labelLaneOffset = roadWidth * 0.18;
    const sourceLength = Math.max(0.001, Math.hypot(dx, dy));
    const laneX = (-dy / sourceLength) * labelLaneOffset;
    const laneY = (dx / sourceLength) * labelLaneOffset;
    const candidates = [0.5, 0.32, 0.68, 0.22, 0.78, 0.14, 0.86].map((t) => ({ t, side: 0 }))
      .concat([0.28, 0.72, 0.18, 0.82].flatMap((t) => [{ t, side: 1 }, { t, side: -1 }]));
    let chosen = null;
    candidates.forEach((candidate) => {
      if (chosen && chosen.score === 0) return;
      const p = {
        x: span.a.x + dx * candidate.t + laneX * candidate.side,
        y: span.a.y + dy * candidate.t + laneY * candidate.side,
      };
      const wp = worldPoint(p, center, scale);
      const rect = rectAt(wp);
      const score = placedRects.reduce((sum, other) => sum + overlapArea(rect, other), 0);
      if (!chosen || score < chosen.score) chosen = { wp, rect, score };
    });
    if (!chosen) {
      geometry.dispose();
      return;
    }
    const wp = chosen.wp;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(fit);
    mesh.rotation.y = -angle;
    mesh.position.set(wp.x, 0.064, wp.y);
    mesh.renderOrder = 9;
    placedRects.push(chosen.rect);
    group.add(mesh);
  });
  if (group.children.length) scene.add(group);
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

function refreshMergedMafiaTerritoryOverlay(entry) {
  if (!entry?.scene || !entry?.buildingMap) return;
  if (entry.territoryGroup) {
    updateTerritoryOverlayForZoom(entry.territoryGroup, 1);
    entry.scene.remove(entry.territoryGroup);
    entry.territoryGroup.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((mat) => mat.dispose?.());
        else obj.material.dispose?.();
      }
    });
    entry.territoryGroup = null;
  }
  const generated = entry.generated || entry.root?._deskDonGenerated || {};
  entry.territoryGroup = buildMergedMafiaTerritoryOverlay(
    generated.blocks || [],
    entry.root?._deskDonPayload?.mafiaTerritoryBlocks || [],
    entry.root?._deskDonPayload?.mafiaColor || '#ff1d1d',
    entry.center || { x: 0, y: 0 },
    entry.scale || WORLD_SCALE,
    entry.buildingMap
  );
  if (entry.territoryGroup) entry.scene.add(entry.territoryGroup);
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
  const suit = new THREE.MeshStandardMaterial({ color: pawn?.suit || 0x292d31, roughness: 0.9 });
  const skin = new THREE.MeshStandardMaterial({ color: pawn?.skin || 0xb98261, roughness: 1 });
  const dark = new THREE.MeshStandardMaterial({ color: pawn?.hair || 0x211a15, roughness: 1 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.14, 0.1, 10), suit);
  base.position.y = 0.065;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.105, 0.2, 10), suit);
  body.position.y = 0.205;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.062, 8, 7), skin);
  head.position.y = 0.38;
  const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.073, 0.09, 0.045, 8), dark);
  hat.position.y = 0.445;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.19, 24), new THREE.MeshBasicMaterial({ color: 0xe7d36e, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.035;
  const marker = new THREE.Sprite(new THREE.SpriteMaterial({ map: playerPawnTexture(pawn || {}), transparent: true, depthTest: false }));
  marker.scale.set(0.38, 0.38, 0.38);
  marker.position.y = 0.68;
  marker.renderOrder = 41;
  group.add(base, body, head, hat, ring, marker);
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
  const gridMode = (blocks || []).some((block) => block?.grid);
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
  let segments;
  if (gridMode) {
    const roadSegments = (roads || []).filter((road) => road?.a && road?.b).map((road) => {
      const aWorld = worldPoint(road.a, center, scale);
      const bWorld = worldPoint(road.b, center, scale);
      const a = { x: aWorld.x, z: aWorld.y };
      const b = { x: bWorld.x, z: bWorld.y };
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len = Math.max(0.001, Math.hypot(dx, dz));
      const nx = -dz / len;
      const nz = dx / len;
      const offset = ((road.width || 12) * 0.5 + gridRoadSideClearance(road.width || 12)) * 0.5 * scale;
      return { road, a, b, nx, nz, offset, length: len };
    }).filter((seg) => seg.length > 0.2);
    const sidewalkSegments = [];
    roadSegments.forEach((seg) => {
      [-1, 1].forEach((side) => {
        sidewalkSegments.push({
          id: `sidewalk-${seg.road.id}-${side}`,
          a: { x: seg.a.x + seg.nx * seg.offset * side, z: seg.a.z + seg.nz * seg.offset * side },
          b: { x: seg.b.x + seg.nx * seg.offset * side, z: seg.b.z + seg.nz * seg.offset * side },
          cuts: [],
          costFactor: 1,
          sidewalk: true,
        });
      });
    });
    const crosswalks = [];
    const crossKeys = new Set();
    function addCrosswalk(a, b, id) {
      if (Math.hypot(b.x - a.x, b.z - a.z) < 0.08) return;
      const key = `${Math.round(a.x * 100) / 100},${Math.round(a.z * 100) / 100}:${Math.round(b.x * 100) / 100},${Math.round(b.z * 100) / 100}`;
      const reverse = `${key.split(':')[1]}:${key.split(':')[0]}`;
      if (crossKeys.has(key) || crossKeys.has(reverse)) return;
      crossKeys.add(key);
      crosswalks.push({ id, a, b, cuts: [], costFactor: 1.18, crosswalk: true });
    }
    for (let i = 0; i < roadSegments.length; i += 1) {
      for (let j = i + 1; j < roadSegments.length; j += 1) {
        const hit = lineIntersection2d(roadSegments[i].a, roadSegments[i].b, roadSegments[j].a, roadSegments[j].b);
        if (!hit) continue;
        const p = { x: hit.x, z: hit.z };
        [roadSegments[i], roadSegments[j]].forEach((seg) => {
          addCrosswalk(
            { x: p.x + seg.nx * seg.offset, z: p.z + seg.nz * seg.offset },
            { x: p.x - seg.nx * seg.offset, z: p.z - seg.nz * seg.offset },
            `crosswalk-${seg.road.id}-${Math.round(p.x * 10)}-${Math.round(p.z * 10)}`,
          );
        });
      }
    }
    segments = sidewalkSegments.concat(crosswalks);
  } else {
    const roadSegments = (roads || []).filter((road) => road?.a && road?.b).map((road) => {
      const a = worldPoint(road.a, center, scale);
      const b = worldPoint(road.b, center, scale);
      const samples = [0.2, 0.4, 0.6, 0.8];
      const hidden = samples.some((t) => blockWorldPolys.some((poly) => pointInPoly({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }, poly)));
      return { id: road.id, a: { x: a.x, z: a.y }, b: { x: b.x, z: b.y }, cuts: [], costFactor: hidden ? 30 : 1.15 };
    }).filter((seg) => Math.hypot(seg.b.x - seg.a.x, seg.b.z - seg.a.z) > 0.2);
    // Perimeters provide the visible sidewalk network; raw roads keep irregular
    // districts connected, but buried portions receive a prohibitive route cost.
    segments = perimeterSegments.length ? perimeterSegments.concat(roadSegments) : roadSegments;
  }
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
  return { segments, nodes, edges, blockPolys: blockWorldPolys, routeCache: new Map(), streetGrid: null, sidewalkOnly: gridMode };
}

// Vehicles use road centerlines, never the sidewalk graph. Minor streets can
// be directed while avenues and collectors remain two-way thoroughfares.
function buildVehicleRoadNav(roads, center, scale) {
  const segments = (roads || []).filter((road) => road?.a && road?.b).map((road) => {
    const aw = worldPoint(road.a, center, scale);
    const bw = worldPoint(road.b, center, scale);
    return {
      id: `vehicle-${road.id}`,
      road,
      a: { x: aw.x, z: aw.y },
      b: { x: bw.x, z: bw.y },
      oneWay: !!road.oneWay,
      direction: road.trafficDirection || (road.oneWay ? 'forward' : 'both'),
      widthWorld: Math.max(0.12, (Number(road.width) || 12) * scale),
      cuts: [],
    };
  }).filter((segment) => Math.hypot(segment.b.x - segment.a.x, segment.b.z - segment.a.z) > 0.15);
  const nodes = [];
  const nodeKeys = new Map();
  const edges = [];
  function nodeFor(point) {
    const key = `${Math.round(point.x * 100) / 100},${Math.round(point.z * 100) / 100}`;
    if (nodeKeys.has(key)) return nodeKeys.get(key);
    const id = nodes.length;
    nodeKeys.set(key, id);
    nodes.push({ id, x: point.x, z: point.z, edges: [] });
    return id;
  }
  segments.forEach((segment) => segment.cuts.push({ t: 0, point: segment.a }, { t: 1, point: segment.b }));
  for (let i = 0; i < segments.length; i += 1) {
    for (let j = i + 1; j < segments.length; j += 1) {
      const hit = lineIntersection2d(segments[i].a, segments[i].b, segments[j].a, segments[j].b);
      if (!hit) continue;
      segments[i].cuts.push({ t: hit.t, point: { x: hit.x, z: hit.z } });
      segments[j].cuts.push({ t: hit.u, point: { x: hit.x, z: hit.z } });
    }
  }
  segments.forEach((segment) => {
    segment.cuts = segment.cuts.sort((a, b) => a.t - b.t).filter((cut, index, all) => index === 0 || Math.hypot(cut.point.x - all[index - 1].point.x, cut.point.z - all[index - 1].point.z) > 0.04);
    segment.cuts.forEach((cut) => { cut.nodeId = nodeFor(cut.point); });
    for (let i = 0; i < segment.cuts.length - 1; i += 1) {
      const first = segment.cuts[i];
      const second = segment.cuts[i + 1];
      const length = Math.hypot(second.point.x - first.point.x, second.point.z - first.point.z);
      if (length < 0.04) continue;
      let from = first.nodeId;
      let to = second.nodeId;
      if (segment.oneWay && segment.direction === 'reverse') [from, to] = [to, from];
      const id = edges.length;
      edges.push({ from, to, length, directed: segment.oneWay, segmentId: segment.id });
      nodes[from].edges.push(id);
      if (!segment.oneWay) nodes[to].edges.push(id);
    }
  });
  return { segments, nodes, edges, routeCache: new Map() };
}

function shortestVehicleRoadPath(nav, start, end) {
  if (!nav?.segments?.length || !nav.nodes.length) return [start, end];
  const cacheKey = `${start.x.toFixed(2)},${start.z.toFixed(2)}:${end.x.toFixed(2)},${end.z.toFixed(2)}`;
  if (nav.routeCache.has(cacheKey)) return nav.routeCache.get(cacheKey);
  function anchor(point, mode) {
    let best = null;
    nav.segments.forEach((segment) => {
      const near = nearestPointOnRoad2d(point, segment.a, segment.b);
      if (!best || near.distance < best.near.distance) best = { segment, near };
    });
    if (!best) return { point, connections: [], segment: null, t: 0 };
    const segment = best.segment;
    let validCuts = segment.cuts;
    if (segment.oneWay && mode === 'start') validCuts = validCuts.filter((cut) => segment.direction === 'reverse' ? cut.t <= best.near.t + 0.001 : cut.t >= best.near.t - 0.001);
    if (segment.oneWay && mode === 'end') validCuts = validCuts.filter((cut) => segment.direction === 'reverse' ? cut.t >= best.near.t - 0.001 : cut.t <= best.near.t + 0.001);
    const connections = validCuts.map((cut) => ({ id: cut.nodeId, length: Math.hypot(cut.point.x - best.near.point.x, cut.point.z - best.near.point.z) })).sort((a, b) => a.length - b.length).slice(0, segment.oneWay ? 1 : 2);
    return { point: best.near.point, connections, segment, t: best.near.t };
  }
  const source = anchor(start, 'start');
  const target = anchor(end, 'end');
  if (source.segment && source.segment === target.segment) {
    const allowed = !source.segment.oneWay || (source.segment.direction === 'reverse' ? target.t <= source.t : target.t >= source.t);
    if (allowed) {
      const direct = [source.point, target.point];
      nav.routeCache.set(cacheKey, direct);
      return direct;
    }
  }
  const distance = new Array(nav.nodes.length).fill(Infinity);
  const previous = new Array(nav.nodes.length).fill(null);
  const queue = [];
  source.connections.forEach((connection) => { distance[connection.id] = connection.length; queue.push(connection.id); });
  while (queue.length) {
    queue.sort((a, b) => distance[a] - distance[b]);
    const nodeId = queue.shift();
    nav.nodes[nodeId].edges.forEach((edgeId) => {
      const edge = nav.edges[edgeId];
      if (edge.directed && edge.from !== nodeId) return;
      const next = edge.from === nodeId ? edge.to : edge.from;
      const cost = distance[nodeId] + edge.length;
      if (cost >= distance[next]) return;
      distance[next] = cost;
      previous[next] = nodeId;
      if (!queue.includes(next)) queue.push(next);
    });
  }
  let endNode = null;
  let bestCost = Infinity;
  target.connections.forEach((connection) => {
    const cost = distance[connection.id] + connection.length;
    if (cost < bestCost) { bestCost = cost; endNode = connection.id; }
  });
  if (endNode === null || !Number.isFinite(bestCost)) return [source.point, target.point];
  const nodePath = [];
  for (let current = endNode; current !== null; current = previous[current]) nodePath.push(current);
  nodePath.reverse();
  const path = [source.point].concat(nodePath.map((id) => ({ x: nav.nodes[id].x, z: nav.nodes[id].z })), [target.point]).filter((point, index, all) => index === 0 || Math.hypot(point.x - all[index - 1].x, point.z - all[index - 1].z) > 0.035);
  nav.routeCache.set(cacheKey, path);
  return path;
}

function vehicleRoadPointForBuilding(building, vehicleNav, pedestrianNav) {
  if (!building) return null;
  const entry = routePointForBuilding(building, pedestrianNav) || building.center;
  if (!entry) return null;
  const point = { x: entry.x, z: Number.isFinite(entry.z) ? entry.z : entry.y };
  let best = null;
  (vehicleNav?.segments || []).forEach((segment) => {
    const near = nearestPointOnRoad2d(point, segment.a, segment.b);
    if (!best || near.distance < best.distance) best = { x: near.point.x, z: near.point.z, distance: near.distance };
  });
  return best || point;
}

function vehicleLanePath(nav, centerlinePath) {
  if (!centerlinePath || centerlinePath.length < 2) return centerlinePath || [];
  return centerlinePath.map((point, index) => {
    const previous = centerlinePath[Math.max(0, index - 1)];
    const next = centerlinePath[Math.min(centerlinePath.length - 1, index + 1)];
    const dx = next.x - previous.x;
    const dz = next.z - previous.z;
    const length = Math.max(0.001, Math.hypot(dx, dz));
    let nearest = null;
    (nav?.segments || []).forEach((segment) => {
      const hit = nearestPointOnRoad2d(point, segment.a, segment.b);
      if (!nearest || hit.distance < nearest.distance) nearest = { segment, distance: hit.distance };
    });
    if (!nearest || nearest.segment.oneWay) return point;
    const offset = Math.max(0.08, Math.min(0.22, nearest.segment.widthWorld * 0.24));
    // New York uses right-hand traffic: reversing direction automatically
    // moves the vehicle onto the opposite lane of the same two-way road.
    return { x: point.x + (dz / length) * offset, z: point.z - (dx / length) * offset };
  });
}

function vehicleMovementPath(entry, fromBuilding, targetBuilding) {
  const fromCenter = buildingCenterXZ(fromBuilding);
  const targetCenter = buildingCenterXZ(targetBuilding);
  const fromEntryRaw = routePointForBuilding(fromBuilding, entry.roadNav);
  const targetEntryRaw = routePointForBuilding(targetBuilding, entry.roadNav);
  const fromEntry = fromEntryRaw ? { x: fromEntryRaw.x, z: fromEntryRaw.y } : fromCenter;
  const targetEntry = targetEntryRaw ? { x: targetEntryRaw.x, z: targetEntryRaw.y } : targetCenter;
  const fromRoad = vehicleRoadPointForBuilding(fromBuilding, entry.vehicleNav, entry.roadNav);
  const targetRoad = vehicleRoadPointForBuilding(targetBuilding, entry.vehicleNav, entry.roadNav);
  const path = [];
  [fromCenter, fromEntry, fromRoad].forEach((point) => appendDistinctPathPoint(path, point));
  const roadStart = fromRoad || fromEntry;
  const roadEnd = targetRoad || targetEntry;
  if (roadStart && roadEnd) vehicleLanePath(entry.vehicleNav, shortestVehicleRoadPath(entry.vehicleNav, roadStart, roadEnd)).forEach((point) => appendDistinctPathPoint(path, point));
  [targetRoad, targetEntry, targetCenter].forEach((point) => appendDistinctPathPoint(path, point));
  return path;
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
  if (!nav.sidewalkOnly) {
    const streetPath = streetGridPath(nav, start, end);
    if (streetPath?.length > 1) {
      nav.routeCache.set(cacheKey, streetPath);
      return streetPath;
    }
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

function partialPathUntil(path, t) {
  if (!path || path.length < 2) return path ? path.slice(0, 1) : [];
  const clamped = Math.max(0, Math.min(1, t));
  if (clamped <= 0.001) return [path[0]];
  const lengths = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i += 1) {
    const len = Math.hypot(path[i + 1].x - path[i].x, path[i + 1].z - path[i].z);
    lengths.push(len);
    total += len;
  }
  let remaining = total * clamped;
  const out = [path[0]];
  for (let i = 0; i < lengths.length; i += 1) {
    const a = path[i];
    const b = path[i + 1];
    if (remaining >= lengths[i]) {
      out.push(b);
      remaining -= lengths[i];
      continue;
    }
    const local = lengths[i] ? remaining / lengths[i] : 0;
    out.push({ x: a.x + (b.x - a.x) * local, z: a.z + (b.z - a.z) * local });
    break;
  }
  return out.filter((p, index, arr) => index === 0 || Math.hypot(p.x - arr[index - 1].x, p.z - arr[index - 1].z) > 0.035);
}

function routePointForBuilding(building, nav) {
  if (!building) return null;
  if (building.entryPoint) return building.entryPoint;
  const world = building.worldFootprint || [];
  if (!world.length) return building.center || null;
  const candidates = [];
  world.forEach((p, index) => {
    const next = world[(index + 1) % world.length];
    candidates.push({ x: (p.x + next.x) / 2, y: (p.y + next.y) / 2, edgeIndex: index });
  });
  if (!candidates.length) return building.center || null;
  let best = candidates[0];
  let bestDistance = Infinity;
  const segments = nav?.segments || [];
  const nodes = nav?.nodes || [];
  candidates.forEach((candidate) => {
    let distance = Infinity;
    segments.forEach((seg) => {
      const near = nearestPointOnRoad2d({ x: candidate.x, z: candidate.y }, seg.a, seg.b);
      distance = Math.min(distance, near.distance);
    });
    if (!segments.length) nodes.forEach((node) => { distance = Math.min(distance, Math.hypot(candidate.x - node.x, candidate.y - node.z)); });
    if (!nodes.length && building.center) distance = Math.hypot(candidate.x - building.center.x, candidate.y - building.center.y);
    if (distance < bestDistance) { best = candidate; bestDistance = distance; }
  });
  building.entryPoint = { x: best.x, y: best.y };
  building.exitPoint = building.entryPoint;
  building.entryEdgeIndex = best.edgeIndex;
  return building.entryPoint;
}

function ensureBuildingEntryPoints(buildingMap, nav) {
  if (!buildingMap?.forEach) return;
  buildingMap.forEach((building) => {
    if (!building?.entryPoint) routePointForBuilding(building, nav);
  });
}

function buildingCenterXZ(building) {
  if (!building?.center) return null;
  const z = Number.isFinite(building.center.z) ? building.center.z : building.center.y;
  if (!Number.isFinite(building.center.x) || !Number.isFinite(z)) return null;
  return { x: building.center.x, z };
}

function appendDistinctPathPoint(path, point) {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.z)) return path;
  const last = path[path.length - 1];
  if (!last || Math.hypot(point.x - last.x, point.z - last.z) > 0.045) path.push(point);
  return path;
}

function movementPathForBuildings(nav, fromBuilding, targetBuilding, fallbackStart, fallbackEnd) {
  if (!targetBuilding || !fromBuilding) return fallbackStart ? [fallbackStart] : [];
  const fromEntry = routePointForBuilding(fromBuilding, nav);
  const targetEntry = routePointForBuilding(targetBuilding, nav);
  const fromCenter = buildingCenterXZ(fromBuilding);
  const targetCenter = buildingCenterXZ(targetBuilding);
  const path = [];
  const insideStart = fallbackStart || fromCenter;
  const sidewalkStart = fromEntry ? { x: fromEntry.x, z: fromEntry.y } : insideStart;
  const sidewalkEnd = targetEntry ? { x: targetEntry.x, z: targetEntry.y } : (fallbackEnd || targetCenter);
  if (insideStart) appendDistinctPathPoint(path, insideStart);
  if (fromEntry) appendDistinctPathPoint(path, { x: fromEntry.x, z: fromEntry.y });
  const sidewalk = sidewalkStart && sidewalkEnd ? shortestPawnRoadPath(nav, sidewalkStart, sidewalkEnd) : [];
  sidewalk.forEach((point) => appendDistinctPathPoint(path, point));
  if (targetEntry) appendDistinctPathPoint(path, { x: targetEntry.x, z: targetEntry.y });
  if (targetCenter) appendDistinctPathPoint(path, targetCenter);
  return path.length ? path : [fallbackStart || fallbackEnd || { x: 0, z: 0 }];
}

function movementPathFromPointToBuilding(nav, startPoint, targetBuilding, fallbackEnd) {
  if (!startPoint || !targetBuilding) return fallbackEnd ? [fallbackEnd] : [];
  const targetEntry = routePointForBuilding(targetBuilding, nav);
  const targetCenter = buildingCenterXZ(targetBuilding);
  const sidewalkEnd = targetEntry ? { x: targetEntry.x, z: targetEntry.y } : (fallbackEnd || targetCenter);
  const path = [];
  appendDistinctPathPoint(path, startPoint);
  const sidewalk = sidewalkEnd ? shortestPawnRoadPath(nav, startPoint, sidewalkEnd) : [];
  sidewalk.forEach((point) => appendDistinctPathPoint(path, point));
  if (targetEntry) appendDistinctPathPoint(path, { x: targetEntry.x, z: targetEntry.y });
  if (targetCenter) appendDistinctPathPoint(path, targetCenter);
  return path.length ? path : [startPoint];
}

function sidewalkPath(path, side = 1, amount = 0.23) {
  if (!path || path.length < 2) return path || [];
  return path.map((point, index) => {
    const prev = path[Math.max(0, index - 1)];
    const next = path[Math.min(path.length - 1, index + 1)];
    const dx = next.x - prev.x;
    const dz = next.z - prev.z;
    const len = Math.max(0.001, Math.hypot(dx, dz));
    return { x: point.x + (-dz / len) * amount * side, z: point.z + (dx / len) * amount * side };
  });
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
  let startPoint = routePointForBuilding(startBuilding, entry.roadNav);
  let start = startPoint ? { x: startPoint.x, z: startPoint.y } : null;
  stops.forEach((stop, index) => {
    const destination = buildingMap.get(stop.parcelId);
    const destinationPoint = routePointForBuilding(destination, entry.roadNav);
    if (!start || !destinationPoint) return;
    const end = { x: destinationPoint.x, z: destinationPoint.y };
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
  const hasLastPosition = !!entry.playerPawn.userData.hasPosition && Number.isFinite(entry.playerPawn.position.x) && Number.isFinite(entry.playerPawn.position.z);
  const spawnFallback = target && entry.roadSpawn ? { center: { x: entry.roadSpawn.x, y: entry.roadSpawn.y } } : null;
  const base = from || (target && hasLastPosition ? { center: { x: entry.playerPawn.position.x, y: entry.playerPawn.position.z } } : spawnFallback || target);
  if (!base) {
    entry.playerPawn.visible = false;
    if (entry.playerRoute) entry.playerRoute.visible = false;
    if (entry.queuedRouteGroup) entry.queuedRouteGroup.visible = false;
    return false;
  }
  entry.playerPawn.visible = true;
  if (entry.queuedRouteGroup) entry.queuedRouteGroup.visible = true;
  const fallbackFrom = target && hasLastPosition ? { center: { x: entry.playerPawn.position.x, y: entry.playerPawn.position.z } } : spawnFallback;
  const routeFrom = from || fallbackFrom;
  const routeFromPoint = routePointForBuilding(routeFrom, entry.roadNav) || routeFrom?.center;
  const targetPoint = routePointForBuilding(target, entry.roadNav) || target?.center || routeFromPoint;
  const routeFromCenter = buildingCenterXZ(routeFrom);
  const targetCenter = buildingCenterXZ(target);
  const a = routeFromPoint || targetPoint;
  const b = targetPoint || a;
  const logicalRouteKey = target && routeFrom ? `${pawn.parcelId || 'visual'}:${pawn.targetParcelId || ''}:${pawn.routeId || ''}` : '';
  if (logicalRouteKey && entry.playerPawn.userData.logicalRouteKey !== logicalRouteKey) {
    const previousRouteKey = entry.playerPawn.userData.logicalRouteKey || '';
    const reroutingFromLivePosition = !!(previousRouteKey && hasLastPosition && target);
    entry.playerPawn.userData.logicalRouteKey = logicalRouteKey;
    entry.playerPawn.userData.routeStart = reroutingFromLivePosition ? { x: entry.playerPawn.position.x, z: entry.playerPawn.position.z } : (routeFromCenter || { x: a.x, z: a.y });
    entry.playerPawn.userData.routeStartIsLive = reroutingFromLivePosition;
    entry.playerPawn.userData.visualProgress = reroutingFromLivePosition ? 0 : Math.max(0, Math.min(1, Number(pawn.progress ?? 0)));
    entry.playerPawn.userData.progressUpdatedAt = performance.now();
  } else if (!logicalRouteKey) {
    entry.playerPawn.userData.logicalRouteKey = '';
    entry.playerPawn.userData.routeStart = null;
    entry.playerPawn.userData.routeStartIsLive = false;
    entry.playerPawn.userData.visualProgress = null;
  }
  const logicalProgress = Math.max(0, Math.min(1, Number(pawn.progress ?? 1)));
  let t = logicalProgress;
  if (target && routeFrom && pawn.timeMoving) {
    const duration = Math.max(1, Number(pawn.moveDurationMinutes || 1));
    const stepMinutes = Math.max(0, Number(pawn.moveStepMinutes || 0));
    const periodMs = Math.max(1, Number(pawn.timePeriodMs || 60000));
    const now = performance.now();
    const dt = Math.min(0.08, Math.max(0, (now - Number(entry.playerPawn.userData.progressUpdatedAt || now)) / 1000));
    entry.playerPawn.userData.progressUpdatedAt = now;
    const minutesPerSecond = (1000 / periodMs) * stepMinutes;
    t = Number.isFinite(entry.playerPawn.userData.visualProgress) ? entry.playerPawn.userData.visualProgress : logicalProgress;
    t += (minutesPerSecond * dt) / duration;
    if (t < logicalProgress) t += (logicalProgress - t) * Math.min(1, dt * 8);
    t = Math.max(0, Math.min(1, t));
    entry.playerPawn.userData.visualProgress = t;
  } else if (target && routeFrom) {
    t = Number.isFinite(entry.playerPawn.userData.visualProgress) ? entry.playerPawn.userData.visualProgress : logicalProgress;
    entry.playerPawn.userData.progressUpdatedAt = performance.now();
  }
  const startPoint = target && routeFrom && entry.playerPawn.userData.routeStart ? entry.playerPawn.userData.routeStart : (routeFromCenter || { x: a.x, z: a.y });
  const path = target && routeFrom
    ? (entry.playerPawn.userData.routeStartIsLive
      ? movementPathFromPointToBuilding(entry.roadNav, startPoint, target, targetCenter || { x: b.x, z: b.y })
      : movementPathForBuildings(entry.roadNav, routeFrom, target, startPoint, targetCenter || { x: b.x, z: b.y }))
    : [routeFromCenter || { x: a.x, z: a.y }];
  if (logicalRouteKey && entry.playerPawn.userData.reportedRouteKey !== logicalRouteKey) {
    let routeDistance = 0;
    for (let i = 0; i < path.length - 1; i += 1) routeDistance += Math.hypot(path[i + 1].x - path[i].x, path[i + 1].z - path[i].z);
    entry.playerPawn.userData.reportedRouteKey = logicalRouteKey;
    entry.root?.dispatchEvent(new CustomEvent('deskdon-player-route-distance', { detail: { routeId: pawn.routeId, worldDistance: routeDistance }, bubbles: true }));
  }
  const pos = pointAlongPath(path, t);
  entry.playerPawn.position.set(pos.x, 0.08, pos.z);
  entry.playerPawn.userData.hasPosition = true;
  if (logicalRouteKey && (!entry.playerPawn.userData.lastProgressReport || performance.now() - entry.playerPawn.userData.lastProgressReport > 120)) {
    entry.playerPawn.userData.lastProgressReport = performance.now();
    entry.root?.dispatchEvent(new CustomEvent('deskdon-player-route-progress', { detail: { routeId: pawn.routeId, progress: t }, bubbles: true }));
  }
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
    entry.playerRoute.visible = !!target && !!routeFrom && t < 1;
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
  const estateWorldFootprint = footprint.map((source) => worldPoint(source, center, scale));
  const estateEntryPoint = { x: driveCenter.x - driveWorld.width / 2, y: driveCenter.y };
  buildingMap.set(parcel.id, { group, mesh: mansion, roofMesh: roof, parcel, width: innerMetrics.width, depth: innerMetrics.depth, height: mansionHeight, exact: true, center: innerCenter, footprint, worldFootprint: estateWorldFootprint, entryPoint: estateEntryPoint });
  return group;
}

function protectedColorForParcel(parcel, fallback) {
  return fallback;
}

function isInactiveParcel(parcel) {
  return normalizeOperationalState(parcel?.operationalState || parcel?.status) === 'Inactive' || parcel?.isActive === false || parcel?.isInactive === true;
}

function inactiveColor(hex, fallback = 0x2f2b24) {
  if (hex === undefined || hex === null) return fallback;
  const c = new THREE.Color(hex);
  c.multiplyScalar(0.34);
  return c.getHex();
}

function applyBuildingOperationalVisual(building, record) {
  if (!building) return;
  const state = normalizeOperationalState(record || building.parcel?.operationalState || building.parcel?.status);
  const inactive = state === 'Inactive';
  if (building.parcel) {
    building.parcel.operationalState = state;
    building.parcel.isActive = !inactive;
    building.parcel.isInactive = inactive;
  }
  const wallActive = building.mesh?.userData?.activeColor ?? building.mesh?.userData?.originalColor ?? 0x888888;
  const roofActive = building.roofMesh?.userData?.activeColor ?? building.roofMesh?.userData?.originalColor ?? wallActive;
  [
    { mesh: building.mesh, active: wallActive },
    { mesh: building.roofMesh, active: roofActive },
  ].forEach((item) => {
    if (!item.mesh?.material) return;
    const next = inactive ? inactiveColor(item.active) : item.active;
    item.mesh.userData.originalColor = next;
    const mats = Array.isArray(item.mesh.material) ? item.mesh.material : [item.mesh.material];
    mats.forEach((mat) => {
      if (mat.color) mat.color.setHex(next);
      if (mat.emissive) mat.emissive.setHex(inactive ? 0x000000 : (building.parcel?.isPlayerSafehouse ? 0x071406 : 0x000000));
      mat.needsUpdate = true;
    });
  });
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
    const inactive = isInactiveParcel(parcel);
    const wall = new THREE.MeshPhongMaterial({ color: safehouseColor, emissive: parcel.isPlayerSafehouse ? 0x071406 : 0x000000, shininess: 10, flatShading: true, side: THREE.DoubleSide });
    if (inactive) wall.color.setHex(inactiveColor(safehouseColor));
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
    mesh.userData.activeColor = safehouseColor;
    mesh.userData.originalColor = inactive ? inactiveColor(safehouseColor) : safehouseColor;
    const group = new THREE.Group();
    group.add(mesh);
    if (debug.gridCityView) {
      const topPoints = footprint.map((source) => {
        const p = worldPoint(source, center, scale);
        return new THREE.Vector3(p.x, height + mesh.position.y + 0.006, p.y);
      });
      if (topPoints.length >= 2) {
        topPoints.push(topPoints[0].clone());
        const topEdge = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(topPoints),
          new THREE.LineBasicMaterial({ color: 0xf2d68a, transparent: true, opacity: 0.62 }),
        );
        topEdge.userData.detailLine = true;
        group.add(topEdge);
      }
    } else {
      const edge = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: debug.exactExtrusion ? 0xf2d68a : 0x2a2419, transparent: true, opacity: debug.exactExtrusion ? 0.78 : 0.35 }),
      );
      edge.position.copy(mesh.position);
      edge.userData.detailLine = true;
      group.add(edge);
    }
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
    const worldFootprint = footprint.map((source) => worldPoint(source, center, scale));
    buildingMap.set(parcel.id, { group, mesh, roofMesh: mesh, parcel, width: metrics.width, depth: metrics.depth, height, exact: true, center: wp, footprint, worldFootprint });
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
  const inactive = isInactiveParcel(parcel);
  const wall = new THREE.MeshPhongMaterial({ color: safehouseColor, emissive: parcel.isPlayerSafehouse ? 0x071406 : 0x000000, shininess: 18, side: THREE.DoubleSide });
  const roof = new THREE.MeshLambertMaterial({ color: safehouseRoof });
  if (inactive) {
    wall.color.setHex(inactiveColor(safehouseColor));
    roof.color.setHex(inactiveColor(safehouseRoof));
  }
  const geo = new THREE.BoxGeometry(width, height, depth);
  const mesh = new THREE.Mesh(geo, wall);
  mesh.position.set(wp.x, height / 2 + 0.05, wp.y);
  mesh.castShadow = false;
  mesh.userData.parcel = parcel;
  mesh.userData.activeColor = safehouseColor;
  mesh.userData.originalColor = inactive ? inactiveColor(safehouseColor) : safehouseColor;
  const group = new THREE.Group();
  group.add(mesh);
  const roofGeo = new THREE.BoxGeometry(width * 1.03, 0.04, depth * 1.03);
  const roofMesh = new THREE.Mesh(roofGeo, roof);
  roofMesh.position.set(wp.x, height + 0.09, wp.y);
  roofMesh.userData.parcel = parcel;
  roofMesh.userData.activeColor = safehouseRoof;
  roofMesh.userData.originalColor = inactive ? inactiveColor(safehouseRoof) : safehouseRoof;
  group.add(roofMesh);
  const shadowGeo = new THREE.PlaneGeometry(width * 1.08, depth * 1.08);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadow = new THREE.Mesh(shadowGeo, materials.shadow);
  shadow.position.set(wp.x + 0.06, 0.045, wp.y + 0.08);
  if (!debug.gridCityView) group.add(shadow);
  if (parcel.isPlayerSafehouse && !debug.contextOnly) group.userData.safehouseMarker = addSafehouseIcon(group, wp.x, height + 0.92, wp.y);
  if (parcel.mafiaProtected && !debug.contextOnly) group.userData.protectionStripes = addProtectionOverlay(group, null, center, scale, wp, width, depth, height, parcel.protectionColor || '#ff1d1d');
  if (parcel.racketReady && !debug.contextOnly) {
    group.userData.racketMoneyMarker = addMoneyIcon(group, wp.x, height + 1.05, wp.y);
    group.userData.safehouseMarker = group.userData.racketMoneyMarker;
  }
  if (debug.windows) addFacadeOpenings(group, wp, width, depth, height, visualProfile, materials);
  rayTargets.push(mesh, roofMesh);
  const worldFootprint = [
    { x: wp.x - width / 2, y: wp.y - depth / 2 },
    { x: wp.x + width / 2, y: wp.y - depth / 2 },
    { x: wp.x + width / 2, y: wp.y + depth / 2 },
    { x: wp.x - width / 2, y: wp.y + depth / 2 },
  ];
  buildingMap.set(parcel.id, { group, mesh, roofMesh, parcel, width, depth, height, center: wp, worldFootprint });
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

function renderContextDistrict(scene, context, basePayload, center, scale, materials, districtTargets, rayTargets, buildingMap) {
  if (!context?.polygon || context.polygon.length < 3) return { buildings: 0 };
  const islandView = !!basePayload.islandView;
  const fogOpacity = Math.max(0.06, Math.min(0.6, Number(basePayload.fogBuildingOpacity ?? 0.24)));
  const siblingDistricts = [{ id: basePayload.district?.id, polygon: basePayload.outerPolygon }]
    .concat(basePayload.contextDistricts || [])
    .filter((district) => district?.id !== context.id && district?.polygon?.length >= 3);
  const generated = islandView
    ? generate3dDistrict({
      district: context,
      outerPolygon: context.polygon,
      inheritedRoads: context.inheritedRoads || [],
      contextDistricts: siblingDistricts,
      seed: `${basePayload.seed || 0}-${context.id || context.name || 'context'}`,
      blocks: context.blocks || [],
      playerSafehouse: basePayload.playerSafehouse,
      protectedBusinesses: basePayload.protectedBusinesses || {},
      collectionRushActive: basePayload.collectionRushActive,
      startingProtectionDistrictId: basePayload.startingProtectionDistrictId,
      mafiaColor: basePayload.mafiaColor,
    })
    : context.selfOuterPolygon?.length && context.selfToFocus
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
  context.renderedRoads = generated.roads || [];
  context.renderedBlocks = generated.blocks || [];
  context.renderedOuterPolygon = generated.outerPolygon || context.polygon || [];
  const group = new THREE.Group();
  const hoverObjects = [];
  addFlatShape(group, generated.outerPolygon, center, scale, islandView ? 0x969a91 : 0x5f6661, -0.012, islandView ? 0.86 : 0.36);
  const hoverFill = addFlatShape(group, generated.outerPolygon, center, scale, 0xe4b84a, 0.034, 0.18);
  const hoverLine = addLineLoop(group, generated.outerPolygon, center, scale, 0xffd86a, 0.075);
  if (hoverFill) hoverFill.visible = false;
  if (hoverLine) {
    hoverLine.visible = false;
    hoverLine.material.opacity = 0.95;
  }
  const navSurface = islandView ? null : addFlatShape(group, generated.outerPolygon, center, scale, 0x000000, 0.028, 0);
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
    if (islandView) {
      mesh.position.y = 0.01;
    } else {
      muteObjectMaterials(mesh, 0x24282b, 0.32);
    }
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
    addFlatShape(group, block.polygon, center, scale, islandView ? 0x8e9289 : 0x737b72, 0.006, islandView ? 0.72 : 0.24);
    if (islandView) addLineLoop(group, block.polygon, center, scale, 0x42483f, 0.09);
    (block.parcels || []).forEach((parcel) => {
      if (buildings > (islandView ? 900 : 220)) return;
      if (islandView) {
        const outline = addLineLoop(group, parcel.polygon, center, scale, 0xffe08a, 0.11);
        if (outline) group.add(outline);
        const sceneParcel = parcel.isBuildable && parcel.buildingPolygon
          ? parcel
          : Object.assign({}, parcel, {
            isBuildable: parcel.isBuildable !== false,
            buildingPolygon: parcel.buildingPolygon || centeredFootprint(parcel.polygon, 0.72),
          });
        const building = buildingForParcel(sceneParcel, center, scale, materials, rayTargets || dummyTargets, buildingMap || dummyMap, Object.assign({}, basePayload.debug || {}, { exactExtrusion: true }));
        if (building) {
          group.add(building);
          buildings += 1;
        } else {
          addLotSurface(parcel, center, scale, group, 'park');
        }
        return;
      }
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
    group.position.set(wp.x, 0.16, wp.y);
    const baseGeo = new THREE.CylinderGeometry(0.78, 0.96, 0.18, 8);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x2f3433, emissive: 0x090806, flatShading: true });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);
    const postGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.9, 8);
    const post = new THREE.Mesh(postGeo, new THREE.MeshLambertMaterial({ color: 0x1d2220, emissive: 0x050504, flatShading: true }));
    post.position.y = 0.48;
    group.add(post);
    const capGeo = new THREE.CylinderGeometry(0.42, 0.54, 0.14, 8);
    const capMat = new THREE.MeshLambertMaterial({ color: 0xd0a850, emissive: 0x2a1b05, flatShading: true });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.96;
    group.add(cap);
    const ringGeo = new THREE.RingGeometry(1.04, 1.24, 8);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xe8c36b, transparent: true, opacity: 0.54, side: THREE.DoubleSide, depthWrite: false }));
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
  if (payload?.islandView && Array.isArray(payload.contextDistricts) && payload.contextDistricts.length) {
    const points = []
      .concat(payload.outerPolygon || [])
      .concat(...payload.contextDistricts.map((district) => district?.polygon || []));
    if (points.length >= 3) return bounds(points);
  }
  return bounds(payload.outerPolygon || []);
}

function missionTargetTexture(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 360;
  canvas.height = 110;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(16,5,5,.92)';
  ctx.fillRect(2, 2, 356, 106);
  ctx.strokeStyle = '#e25a4f';
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 352, 102);
  ctx.fillStyle = '#ffd8d2';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(name || 'TARGET', 180, 48);
  ctx.font = 'bold 20px Inter, Arial';
  ctx.fillStyle = '#ff776a';
  ctx.fillText('FOLLOW', 180, 82);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createMissionTargetRig(scene) {
  const group = new THREE.Group();
  group.visible = false;
  group.renderOrder = 38;
  const coatMat = new THREE.MeshStandardMaterial({ color: 0x5d3430, roughness: 0.92, depthTest: true, depthWrite: true });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xb9835e, roughness: 1, depthTest: true, depthWrite: true });
  const hatMat = new THREE.MeshStandardMaterial({ color: 0x251f19, roughness: 1, depthTest: true, depthWrite: true });
  const coat = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.17, 2, 5), coatMat);
  coat.position.y = 0.27;
  coat.renderOrder = 42;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.066, 6, 5), skinMat);
  head.position.y = 0.48;
  head.renderOrder = 43;
  const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.04, 8), hatMat);
  hat.position.y = 0.58;
  hat.renderOrder = 44;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.25, 28), new THREE.MeshBasicMaterial({ color: 0xff5a4b, transparent: true, opacity: 0.95, side: THREE.DoubleSide, depthTest: true, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.04;
  ring.renderOrder = 41;
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: missionTargetTexture('TARGET'), transparent: true, depthTest: false }));
  label.scale.set(1.7, 0.52, 1);
  label.position.y = 0.95;
  label.renderOrder = 46;
  const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.2, 3.7, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xff4b3f, transparent: true, opacity: 0.32, depthTest: false, depthWrite: false, side: THREE.DoubleSide }));
  beacon.position.y = 2.05;
  beacon.renderOrder = 40;
  const trail = new THREE.Group();
  trail.frustumCulled = false;
  trail.renderOrder = 39;
  group.add(coat, head, hat, ring, label, beacon);
  group.userData.label = label;
  group.userData.beacon = beacon;
  group.userData.trail = trail;
  group.userData.trailPoints = [];
  scene.add(group);
  scene.add(trail);
  return group;
}

function createMissionHighlightRig(scene) {
  const group = new THREE.Group();
  group.visible = false;
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 8.8, 18, 1, true), new THREE.MeshBasicMaterial({ color: 0xffcc42, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }));
  beam.position.y = 4.4;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.34, 0.48, 30), new THREE.MeshBasicMaterial({ color: 0xffd34f, transparent: true, opacity: 0.95, side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.1;
  const footprint = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: 0xffc928, transparent: true, opacity: 0.24, side: THREE.DoubleSide, depthWrite: false }));
  const footprintLine = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffdf62, transparent: true, opacity: 0.98, depthWrite: false }));
  const footprintGlow = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffd45a, transparent: true, opacity: 0.66, depthWrite: false }));
  group.add(beam, ring, footprint, footprintLine, footprintGlow);
  group.userData.beam = beam;
  group.userData.ring = ring;
  group.userData.footprint = footprint;
  group.userData.footprintLine = footprintLine;
  group.userData.footprintGlow = footprintGlow;
  scene.add(group);
  return group;
}

// Reusable street vehicle used by hauling missions. It deliberately stays
// separate from player and pedestrian rigs so future deliveries can share it.
function createMissionTruckRig(scene) {
  const group = new THREE.Group();
  group.visible = false;
  group.userData.missionVehicle = true;
  const paint = new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.88, metalness: 0.05 });
  const darkPaint = new THREE.MeshStandardMaterial({ color: 0x231a13, roughness: 0.95 });
  const cargoPaint = new THREE.MeshStandardMaterial({ color: 0x6a4a2b, roughness: 0.92 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x78909a, roughness: 0.35, metalness: 0.05 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x10100f, roughness: 1 });
  const lamp = new THREE.MeshStandardMaterial({ color: 0xe6c874, emissive: 0x6f4c15, emissiveIntensity: 0.45, roughness: 0.45 });
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.08, 0.38), darkPaint);
  chassis.position.y = 0.16;
  const cargo = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.38, 0.36), cargoPaint);
  cargo.position.set(-0.2, 0.39, 0);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.34, 0.35), paint);
  cab.position.set(0.27, 0.35, 0);
  const hood = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.17, 0.34), paint);
  hood.position.set(0.51, 0.25, 0);
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.14, 0.25), glass);
  windshield.position.set(0.427, 0.42, 0);
  const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.07, 0.4), darkPaint);
  bumper.position.set(0.64, 0.14, 0);
  group.add(chassis, cargo, cab, hood, windshield, bumper);
  [-0.3, 0.37].forEach((x) => [-0.22, 0.22].forEach((z) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.055, 10), rubber);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(x, 0.13, z);
    group.add(wheel);
  }));
  [-0.12, 0.12].forEach((z) => {
    const headlight = new THREE.Mesh(new THREE.SphereGeometry(0.035, 7, 5), lamp);
    headlight.position.set(0.665, 0.26, z);
    group.add(headlight);
  });
  const crates = new THREE.Group();
  [[-0.32, 0.62, -0.09], [-0.32, 0.62, 0.09], [-0.12, 0.62, 0]].forEach((position) => {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.15, 0.15), cargoPaint);
    crate.position.set(...position);
    crates.add(crate);
  });
  group.add(crates);
  group.userData.crates = crates;
  group.scale.setScalar(0.82);
  scene.add(group);
  return group;
}

function updateMissionTruckObject(entry, vehicle, buildingMap) {
  const truck = entry?.missionTruck;
  if (!truck) return false;
  if (!vehicle?.active) {
    truck.visible = false;
    return false;
  }
  let point = null;
  if (vehicle.moving) {
    const from = buildingMap?.get(vehicle.parcelId);
    const target = buildingMap?.get(vehicle.targetParcelId);
    const routeKey = `${vehicle.routeId || ''}:${vehicle.parcelId || ''}:${vehicle.targetParcelId || ''}`;
    if (routeKey !== truck.userData.routeKey) {
      truck.userData.routeKey = routeKey;
      truck.userData.routePath = from && target ? vehicleMovementPath(entry, from, target) : [];
      truck.userData.visualProgress = Math.max(0, Math.min(1, Number(vehicle.progress)||0));
      truck.userData.progressUpdatedAt = performance.now();
    }
    const logicalProgress = Math.max(0, Math.min(1, Number(vehicle.progress)||0));
    let visualProgress = Number.isFinite(truck.userData.visualProgress) ? truck.userData.visualProgress : logicalProgress;
    const now = performance.now();
    if (vehicle.timeMoving) {
      const dt = Math.min(0.08, Math.max(0, (now - Number(truck.userData.progressUpdatedAt || now)) / 1000));
      const duration = Math.max(1, Number(vehicle.moveDurationMinutes)||1);
      const minutesPerSecond = (1000 / Math.max(1, Number(vehicle.timePeriodMs)||60000)) * Math.max(0, Number(vehicle.moveStepMinutes)||0);
      visualProgress += (minutesPerSecond * dt) / duration;
      if (visualProgress < logicalProgress) visualProgress += (logicalProgress - visualProgress) * Math.min(1, dt * 8);
      visualProgress = Math.max(0, Math.min(1, visualProgress));
    }
    truck.userData.visualProgress = visualProgress;
    truck.userData.progressUpdatedAt = now;
    const routePosition = pointAlongPath(truck.userData.routePath || [], visualProgress);
    point = routePosition ? { x: routePosition.x, y: routePosition.z } : null;
  } else {
    const parkedAt = buildingMap?.get(vehicle.parcelId);
    point = routePointForBuilding(parkedAt, entry.roadNav) || parkedAt?.center || null;
    truck.userData.routeKey = '';
    truck.userData.routePath = [];
  }
  if (!point) {
    truck.visible = false;
    return false;
  }
  const previous = truck.userData.lastPosition;
  if (previous) {
    const dx = point.x - previous.x;
    const dz = point.y - previous.z;
    if (Math.hypot(dx, dz) > 0.002) truck.rotation.y = Math.atan2(-dz, dx);
  }
  truck.position.set(point.x, 0.025, point.y);
  truck.userData.lastPosition = { x: point.x, z: point.y };
  truck.visible = true;
  if (entry.playerRoute) entry.playerRoute.visible = false;
  const loadRatio = Math.max(0, Math.min(1, Number(vehicle.loadedVolume || 0) / Math.max(0.01, Number(vehicle.capacity || 1))));
  truck.userData.crates?.children.forEach((crate, index) => { crate.visible = loadRatio > index / 3; });
  return !!vehicle.moving;
}

function createCitizenVehicleRig(scene, buildingMap, roadNav, vehicleNav) {
  const slotCount = 18;
  const bodyGeometry = new THREE.BoxGeometry(0.52, 0.12, 0.24);
  const roofGeometry = new THREE.BoxGeometry(0.27, 0.12, 0.21);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, metalness: 0.04 });
  const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72, metalness: 0.04 });
  const bodies = new THREE.InstancedMesh(bodyGeometry, bodyMaterial, slotCount);
  const roofs = new THREE.InstancedMesh(roofGeometry, roofMaterial, slotCount);
  bodies.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  roofs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const entries = Array.from({ length: slotCount }, () => ({ active: false, visualProgress: 0, logicalProgress: 0, path: [], lastPosition: null }));
  const matrix = new THREE.Matrix4();
  const hiddenScale = new THREE.Vector3(0, 0, 0);
  const visibleScale = new THREE.Vector3(1, 1, 1);
  const rotation = new THREE.Quaternion();
  const color = new THREE.Color();
  const routeContext = { roadNav, vehicleNav };
  let pendingVehicles = [];
  function assignVehicle(entry, vehicle, index) {
      const from = buildingMap.get(vehicle.fromParcelId);
      const to = buildingMap.get(vehicle.toParcelId);
      const routeKey = `${vehicle.routeId || ''}:${vehicle.fromParcelId || ''}:${vehicle.toParcelId || ''}`;
      if (entry.personId !== vehicle.id || entry.routeKey !== routeKey) {
        entry.personId = vehicle.id;
        entry.routeKey = routeKey;
        entry.path = from && to ? vehicleMovementPath(routeContext, from, to) : [];
        entry.distance = 0;
        for (let i = 0; i < entry.path.length - 1; i += 1) {
          entry.distance += Math.hypot(entry.path[i + 1].x - entry.path[i].x, entry.path[i + 1].z - entry.path[i].z);
        }
        entry.visualProgress = Math.max(0, Math.min(1, Number(vehicle.progress || 0)));
        entry.lastPosition = null;
      }
      entry.logicalProgress = Math.max(0, Math.min(1, Number(vehicle.progress || 0)));
      // Cars use route distance, not trip duration supplied by the schedule. This keeps
      // every car at the same speed regardless of how near or far its destination is.
      entry.durationMinutes = Math.max(1, entry.distance / 1.65);
      entry.active = !!vehicle.moving && entry.path.length > 1;
      color.set(['#32281e', '#3b3d36', '#4b3024', '#26343b', '#4a4540', '#25221d'][index % 6]);
      bodies.setColorAt(index, color);
      roofs.setColorAt(index, color.clone().multiplyScalar(0.78));
  }
  function sync(vehicles) {
    const next = Array.isArray(vehicles) ? vehicles.slice(0, slotCount) : [];
    const byId = new Map(next.map((vehicle) => [vehicle.id, vehicle]));
    const assigned = new Set();
    entries.forEach((entry, index) => {
      const vehicle = entry.personId && byId.get(entry.personId);
      if (!vehicle) { entry.active = false; entry.personId = ''; entry.path = []; return; }
      assignVehicle(entry, vehicle, index);
      assigned.add(vehicle.id);
    });
    pendingVehicles = next.filter((vehicle) => !assigned.has(vehicle.id));
  }
  function processPending(limit = 3) {
    let populated = false;
    while (limit > 0 && pendingVehicles.length) {
      const vehicle = pendingVehicles.shift();
      const index = entries.findIndex((entry) => !entry.personId);
      if (index < 0) break;
      assignVehicle(entries[index], vehicle, index);
      populated = true;
      limit -= 1;
    }
    if (populated && bodies.instanceColor) bodies.instanceColor.needsUpdate = true;
    if (populated && roofs.instanceColor) roofs.instanceColor.needsUpdate = true;
    return populated;
  }
  let lastUpdate = performance.now();
  function update(now, moving, timing = {}, visible = true) {
    const populated = processPending(3);
    const dt = Math.min(0.1, Math.max(0, (now - lastUpdate) / 1000));
    lastUpdate = now;
    const periodMs = Math.max(16, Number(timing.timePeriodMs || 250));
    const stepMinutes = Math.max(1, Number(timing.timeStepMinutes || 1));
    const simulatedMinutesPerSecond = (1000 / periodMs) * stepMinutes;
    entries.forEach((entry, index) => {
      if (!visible || !entry.active) {
        entry.renderVisible = false;
        matrix.compose(new THREE.Vector3(0, -20, 0), rotation.identity(), hiddenScale);
        bodies.setMatrixAt(index, matrix);
        roofs.setMatrixAt(index, matrix);
        return;
      }
      entry.renderVisible = true;
      let desired = entry.visualProgress;
      if (moving) {
        const projected = desired + (simulatedMinutesPerSecond * dt) / entry.durationMinutes;
        const catchUp = Math.max(0, entry.logicalProgress - projected) * Math.min(1, dt * 7);
        desired = Math.min(1, projected + catchUp);
      }
      entry.visualProgress = desired;
      const point = pointAlongPath(entry.path, desired);
      const previous = entry.lastPosition || pointAlongPath(entry.path, Math.max(0, entry.visualProgress - 0.006));
      const dx = point.x - previous.x;
      const dz = point.z - previous.z;
      const yaw = Math.hypot(dx, dz) > 0.001 ? Math.atan2(-dz, dx) : (entry.yaw || 0);
      entry.yaw = yaw;
      rotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      matrix.compose(new THREE.Vector3(point.x, 0.105, point.z), rotation, visibleScale);
      bodies.setMatrixAt(index, matrix);
      matrix.compose(new THREE.Vector3(point.x - Math.cos(yaw) * 0.03, 0.225, point.z + Math.sin(yaw) * 0.03), rotation, visibleScale);
      roofs.setMatrixAt(index, matrix);
      entry.lastPosition = { x: point.x, z: point.z };
    });
    bodies.instanceMatrix.needsUpdate = true;
    roofs.instanceMatrix.needsUpdate = true;
    return populated || pendingVehicles.length > 0;
  }
  scene.add(bodies, roofs);
  sync([]);
  update(performance.now(), false);
  return { bodies, roofs, entries, sync, update };
}

function createStreetInfrastructure(scene, pedestrianNav, vehicleNav, options = {}) {
  if (!options?.lamps) return null;
  const group = new THREE.Group();
  group.userData.streetInfrastructure = true;
  const cityPolygon = cleanWorldPoly(options.cityPolygon || []);
  const points = [];
  const pointKeys = new Set();
  let boundaryRejected = 0;
  const addPoint = (x, z) => {
    if (cityPolygon.length >= 3) {
      const source = { x, y: z };
      if (!pointInPoly(source, cityPolygon)) {
        boundaryRejected += 1;
        return;
      }
      let edgeDistance = Infinity;
      for (let edgeIndex = 0; edgeIndex < cityPolygon.length; edgeIndex += 1) {
        const a = cityPolygon[edgeIndex];
        const b = cityPolygon[(edgeIndex + 1) % cityPolygon.length];
        edgeDistance = Math.min(edgeDistance, nearestPointOnRoad2d(
          { x, z },
          { x: a.x, z: a.y },
          { x: b.x, z: b.y },
        ).distance);
      }
      if (edgeDistance < 0.055) {
        boundaryRejected += 1;
        return;
      }
    }
    const key = `${Math.round(x * 20)},${Math.round(z * 20)}`;
    if (pointKeys.has(key)) return;
    pointKeys.add(key);
    points.push({ x, z });
  };
  const vehicleSegments = vehicleNav?.segments || [];
  const incidentByNode = new Map();
  vehicleSegments.forEach((segment) => {
    (segment.cuts || []).forEach((cut) => {
      if (!Number.isInteger(cut.nodeId)) return;
      if (!incidentByNode.has(cut.nodeId)) incidentByNode.set(cut.nodeId, []);
      const incident = incidentByNode.get(cut.nodeId);
      if (!incident.includes(segment)) incident.push(segment);
    });
  });
  // One lamp marks each true intersection. A deterministic corner choice keeps
  // the layout varied while avoiding the four-lamps-per-crossroad visual noise.
  (vehicleNav?.nodes || []).forEach((node) => {
    const incident = incidentByNode.get(node.id) || [];
    const horizontal = incident.filter((segment) => Math.abs(segment.b.x - segment.a.x) >= Math.abs(segment.b.z - segment.a.z));
    const vertical = incident.filter((segment) => Math.abs(segment.b.z - segment.a.z) > Math.abs(segment.b.x - segment.a.x));
    if (!horizontal.length || !vertical.length) return;
    const random = seeded3d(`street-intersection-lamp-${node.id}`);
    const xSide = random() < 0.5 ? -1 : 1;
    const zSide = random() < 0.5 ? -1 : 1;
    const xCurb = Math.max(...vertical.map((segment) => segment.widthWorld * 0.5)) + 0.028;
    const zCurb = Math.max(...horizontal.map((segment) => segment.widthWorld * 0.5)) + 0.028;
    addPoint(node.x + xCurb * xSide, node.z + zCurb * zSide);
  });
  // Between intersections, use only one lamp on a normal block frontage and
  // two on an unusually long frontage. Poles sit just outside the road edge,
  // on the curb instead of in the middle of the sidewalk.
  vehicleSegments.forEach((segment) => {
    const dx = segment.b.x - segment.a.x;
    const dz = segment.b.z - segment.a.z;
    const length = Math.hypot(dx, dz);
    if (length < 0.45) return;
    const ux = dx / length;
    const uz = dz / length;
    const nx = -dz / length;
    const nz = dx / length;
    const curbOffset = segment.widthWorld * 0.5 + 0.028;
    const cuts = (segment.cuts?.length ? segment.cuts : [{ point: segment.a }, { point: segment.b }])
      .map((cut) => cut.point)
      .filter(Boolean);
    for (let cutIndex = 0; cutIndex < cuts.length - 1; cutIndex += 1) {
      const start = cuts[cutIndex];
      const end = cuts[cutIndex + 1];
      const sectionLength = Math.hypot(end.x - start.x, end.z - start.z);
      if (sectionLength < 0.5) continue;
      const random = seeded3d(`street-frontage-lamps-${segment.id}-${cutIndex}`);
      const lampCount = sectionLength > 3.35 ? 2 : 1;
      const placements = lampCount === 2
        ? [0.25 + random() * 0.12, 0.63 + random() * 0.12]
        : [0.35 + random() * 0.3];
      placements.forEach((t, index) => {
        const side = random() < 0.5 ? -1 : 1;
        const distance = sectionLength * t;
        const alternateSide = index && random() < 0.68 ? -side : side;
        addPoint(
          start.x + ux * distance + nx * curbOffset * alternateSide,
          start.z + uz * distance + nz * curbOffset * alternateSide,
        );
      });
    }
  });
  // Compatibility fallback for non-grid layouts that do not expose vehicle roads.
  if (!points.length) (pedestrianNav?.segments || []).filter((segment) => segment.sidewalk && !segment.crosswalk).forEach((segment, index) => {
    const dx = segment.b.x - segment.a.x;
    const dz = segment.b.z - segment.a.z;
    const length = Math.hypot(dx, dz);
    if (length < 0.45) return;
    const random = seeded3d(`fallback-street-lamps-${segment.id || index}`);
    let distance = Math.min(0.25, length * 0.2);
    while (distance < length) {
      const t = distance / length;
      addPoint(segment.a.x + dx * t, segment.a.z + dz * t);
      distance += 1.8 + random() * 1.6;
    }
  });
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x31302c, emissive: 0x000000, emissiveIntensity: 0, roughness: 0.88, metalness: 0.22 });
  const bulbMaterial = new THREE.MeshStandardMaterial({ color: 0xffd98a, emissive: 0xffb43b, emissiveIntensity: 0, roughness: 0.48 });
  const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.018, 0.026, 0.9, 5), poleMaterial, points.length);
  const bulbs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.055, 6, 5), bulbMaterial, points.length);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);
  points.forEach((point, index) => {
    matrix.compose(new THREE.Vector3(point.x, 0.45, point.z), quaternion, scale);
    poles.setMatrixAt(index, matrix);
    matrix.compose(new THREE.Vector3(point.x, 0.92, point.z), quaternion, scale);
    bulbs.setMatrixAt(index, matrix);
  });
  group.add(poles, bulbs);
  scene.add(group);
  // Street lighting is intentionally camera-independent and contains no
  // realtime lights or shadow maps. One instanced decal marks each bulb while
  // batched road ribbons and emissive building windows provide the nighttime detail.
  const atmosphere = createStreetAtmosphere({
    points,
    segments: vehicleSegments,
    buildingMap: options.buildingMap,
  });
  group.add(atmosphere.group);
  group.userData.lampCount = points.length;
  group.userData.dynamicLightCount = 0;
  group.userData.shadowLightCount = 0;
  group.userData.activeDynamicLightCount = 0;
  group.userData.boundaryRejected = boundaryRejected;
  group.userData.decalCount = atmosphere.stats.decalCount;
  group.userData.contaminatedStreetCount = atmosphere.stats.contaminatedStreetCount;
  group.userData.buildingWindowCount = atmosphere.stats.windowCount;
  group.userData.litWindowCount = atmosphere.stats.litWindowCount;
  group.userData.overnightWindowCount = atmosphere.stats.overnightWindowCount;
  group.userData.storefrontCount = atmosphere.stats.storefrontCount;
  group.userData.buildingDoorCount = atmosphere.stats.doorCount;
  group.userData.doubleDoorCount = atmosphere.stats.doubleDoorCount;
  group.userData.garageDoorCount = atmosphere.stats.garageDoorCount;
  group.userData.maxLampsPerStreet = atmosphere.stats.maxLampsPerStreet;
  group.userData.night = false;

    // nearby façades elsewhere in view stay unlit.
  let lastLampNight = null;
  function setPhase(timePhase) {
    const darkness = atmosphere.setPhase(timePhase);
    const night = darkness > 0.005;
    if (night !== lastLampNight) {
      lastLampNight = night;
      group.userData.night = night;
      bulbMaterial.color.set(night ? 0xffd48a : 0x4d493e);
      poleMaterial.emissive.setHex(night ? 0x38250f : 0x000000);
    }
    bulbMaterial.emissiveIntensity = 2.25 * darkness;
    poleMaterial.emissiveIntensity = 0.12 * darkness;
    group.userData.activeWindowCount = atmosphere.group.userData.activeWindowCount || 0;
    group.userData.lightingMinute = atmosphere.group.userData.minute || 0;
  }
  setPhase(0.25);
  return { group, bulbs, setPhase, atmosphere };
}

function updateMissionHighlightObject(entry, highlight) {
  const rig = entry?.missionHighlight;
  let destination = highlight?.active && entry?.buildingMap?.get(highlight.parcelId);
  const requestedPoint = highlight?.active && highlight.point ? worldPoint(highlight.point, entry.center, entry.scale) : null;
  if (!destination && requestedPoint) entry.buildingMap?.forEach((candidate) => {
    const distance = Math.hypot(candidate.center.x - requestedPoint.x, candidate.center.y - requestedPoint.y);
    if (!destination || distance < destination._missionDistance) destination = Object.assign({ _missionDistance: distance }, candidate);
  });
  const point = destination?.center || requestedPoint;
  if (!rig || !point) { if (rig) rig.visible = false; return false; }
  entry.root.dataset.missionHighlightParcelId = destination?.parcel?.id || '';
  rig.position.set(point.x, 0.05, point.y);
  const world = destination?.worldFootprint || (destination?.footprint ? destination.footprint.map((source) => worldPoint(source, entry.center, entry.scale)) : highlight.polygon?.map((source) => worldPoint(source, entry.center, entry.scale))) || [];
  const footprintKey = world.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join('|');
  if (footprintKey && rig.userData.footprintKey !== footprintKey) {
    rig.userData.footprintKey = footprintKey;
    const shape = new THREE.Shape();
    world.forEach((p, index) => { const x = p.x - point.x, z = p.y - point.y; if (!index) shape.moveTo(x, -z); else shape.lineTo(x, -z); });
    shape.closePath();
    const fillGeometry = new THREE.ShapeGeometry(shape);
    fillGeometry.rotateX(-Math.PI / 2);
    rig.userData.footprint.geometry.dispose();
    rig.userData.footprint.geometry = fillGeometry;
    rig.userData.footprint.position.y = 0.035;
    const outlineGeometry = new THREE.BufferGeometry().setFromPoints(world.map((p) => new THREE.Vector3(p.x - point.x, 0.055, p.y - point.y)));
    rig.userData.footprintLine.geometry.dispose();
    rig.userData.footprintLine.geometry = outlineGeometry;
    const glowPoints = [];
    world.forEach((p, index) => {
      const next = world[(index + 1) % world.length];
      const x = p.x - point.x;
      const z = p.y - point.y;
      const nx = next.x - point.x;
      const nz = next.y - point.y;
      glowPoints.push(new THREE.Vector3(x, 0.08, z), new THREE.Vector3(x, 8.4, z));
      glowPoints.push(new THREE.Vector3(x, 0.12, z), new THREE.Vector3(nx, 0.12, nz));
      glowPoints.push(new THREE.Vector3(x, 8.4, z), new THREE.Vector3(nx, 8.4, nz));
    });
    rig.userData.footprintGlow.geometry.dispose();
    rig.userData.footprintGlow.geometry = new THREE.BufferGeometry().setFromPoints(glowPoints);
  }
  if (destination?.radius) {
    const scale = Math.max(1.15, Math.min(4.2, destination.radius * 1.45));
    rig.userData.beam.scale.set(scale, 1, scale);
    rig.userData.ring.scale.setScalar(Math.max(1.1, Math.min(3.2, destination.radius * 1.25)));
  }
  if (destination?.parcel?.id && rig.userData.lastResolvedParcelId !== destination.parcel.id) {
    rig.userData.lastResolvedParcelId = destination.parcel.id;
    entry.root.dispatchEvent(new CustomEvent('deskdon-mission-highlight-state', {
      detail: {
        resolvedParcelId: destination.parcel.id,
        name: destination.parcel.mainBuildingName || destination.parcel.displayName || destination.parcel.businessName || destination.parcel.locationName || destination.parcel.label || '',
      },
      bubbles: true,
    }));
  }
  rig.visible = true;
  return true;
}

function updateMissionTargetObject(entry, target, buildingMap) {
  const rig = entry?.missionTarget;
  if (!rig) return false;
  if (!target?.active) { rig.visible = false; if (rig.userData.trail) rig.userData.trail.visible = false; return false; }
  const requestedFromCenter = target.fromPoint ? worldPoint(target.fromPoint, entry.center, entry.scale) : null;
  const requestedToCenter = target.toPoint ? worldPoint(target.toPoint, entry.center, entry.scale) : null;
  const nearestBuilding = (point) => {
    if (!point) return null;
    let nearest = null;
    buildingMap.forEach((candidate) => {
      const distance = Math.hypot(candidate.center.x - point.x, candidate.center.y - point.y);
      if (!nearest || distance < nearest.distance) nearest = { building: candidate, distance };
    });
    return nearest?.building || null;
  };
  const from = buildingMap.get(target.fromParcelId) || nearestBuilding(requestedFromCenter);
  const to = buildingMap.get(target.targetParcelId) || nearestBuilding(requestedToCenter);
  const fromCenter = buildingCenterXZ(from) || (from?.center ? { x: from.center.x, z: from.center.y } : null) || (requestedFromCenter ? { x: requestedFromCenter.x, z: requestedFromCenter.y } : null);
  const toCenter = buildingCenterXZ(to) || (to?.center ? { x: to.center.x, z: to.center.y } : null) || (requestedToCenter ? { x: requestedToCenter.x, z: requestedToCenter.y } : null);
  if (!fromCenter || !toCenter) { rig.visible = false; return false; }
  const routeKey = `${target.missionId || target.id}:${target.fromParcelId}:${target.targetParcelId}`;
  if (rig.userData.routeKey !== routeKey) {
    rig.userData.routeKey = routeKey;
    rig.userData.path = from && to
      ? movementPathForBuildings(entry.roadNav, from, to, fromCenter, toCenter)
      : shortestPawnRoadPath(entry.roadNav, fromCenter, toCenter) || [fromCenter, toCenter];
    clearRouteVisual(rig.userData.trail);
    rig.userData.trailProgressKey = '';
    let routeDistance = 0;
    for (let i = 0; i < rig.userData.path.length - 1; i += 1) routeDistance += Math.hypot(rig.userData.path[i + 1].x - rig.userData.path[i].x, rig.userData.path[i + 1].z - rig.userData.path[i].z);
    rig.userData.routeMinutes = Math.max(2, Math.ceil(routeDistance / 1.1));
    rig.userData.visualProgress = Math.max(0, Math.min(1, Number(target.progress || 0)));
    rig.userData.progressUpdatedAt = performance.now();
    const oldMap = rig.userData.label?.material?.map;
    if (rig.userData.label) rig.userData.label.material.map = missionTargetTexture(target.name);
    oldMap?.dispose?.();
  }
  const now = performance.now();
  const logicalProgress = Math.max(0, Math.min(1, Number(target.progress || 0)));
  const visualDt = Math.min(0.08, Math.max(0, (now - Number(rig.userData.progressUpdatedAt || now)) / 1000));
  rig.userData.progressUpdatedAt = now;
  let progress = Number.isFinite(rig.userData.visualProgress) ? rig.userData.visualProgress : logicalProgress;
  if (entry.root?._deskDonPayload?.timeMoving) {
    const period = Math.max(1, Number(entry.root._deskDonPayload.timePeriodMs || 120));
    const stepMinutes = Math.max(1, Number(entry.root._deskDonPayload.timeStepMinutes || 1));
    const minutesPerSecond = (1000 / period) * stepMinutes;
    progress += (minutesPerSecond * visualDt) / Math.max(1, Number(rig.userData.routeMinutes || target.legMinutes || 35));
  }
  rig.userData.visualProgress = Math.max(0, Math.min(1, progress));
  progress = rig.userData.visualProgress;
  const point = pointAlongPath(rig.userData.path || [], Math.max(0, Math.min(1, progress)));
  rig.position.set(point.x, 0.06, point.z);
  rig.visible = true;
  const trailPath = partialPathUntil(rig.userData.path || [], Math.max(0, progress - 0.002));
  const trailProgressKey = `${rig.userData.routeKey}:${Math.round(progress * 180)}`;
  if (rig.userData.trailProgressKey !== trailProgressKey) {
    rig.userData.trailProgressKey = trailProgressKey;
    buildRouteVisual(rig.userData.trail, trailPath, { color: 0xd34a3e });
  }
  rig.userData.trail.visible = trailPath.length > 1;
  if (!rig.userData.lastReport || performance.now() - rig.userData.lastReport > 160) {
    rig.userData.lastReport = performance.now();
    entry.root.dispatchEvent(new CustomEvent('deskdon-mission-npc-state', { detail: { id: target.id, distance: entry.playerPawn?.visible ? rig.position.distanceTo(entry.playerPawn.position) : null, progress, routeMinutes: rig.userData.routeMinutes || 0, resolvedFromParcelId: from?.parcel?.id || '', resolvedTargetParcelId: to?.parcel?.id || '' }, bubbles: true }));
  }
  return true;
}

function pedestrianDensityForPayload(payload = {}) {
  const speed = Number(payload.timeSpeed || 1);
  if (speed >= 40) return 0;
  const period = String(payload.timePeriod || '').toLowerCase();
  let density = speed >= 20 ? 0.36 : 1;
  if (period === 'night') density = Math.min(density, 0.05);
  return density;
}

function createPopulationRig(scene, agents, blocks, center, scale, roads = [], buildingMap = null) {
  const slotCount = 50;
  const destinations = [];
  const destinationByParcel = new Map();
  const roadNav = buildPawnRoadNav(roads || [], center, scale, blocks || []);
  const rememberDestination = (destination) => {
    destinations.push(destination);
    if (destination.parcelId) destinationByParcel.set(destination.parcelId, destination);
  };
  if (buildingMap?.size) buildingMap.forEach((building) => {
    const parcel = building.parcel || {};
    if (!parcel.isBuildable || parcel.plannedPark || parcel.isFamilyEstate || parcel.subtype === 'Family Estate') return;
    const door = routePointForBuilding(building, roadNav);
    const inside = buildingCenterXZ(building);
    if (door && inside) rememberDestination({ x: door.x, z: door.y, door: { x: door.x, z: door.y }, inside, parcelId: parcel.id, building });
  });
  if (!destinations.length) (blocks || []).forEach((block) => (block.parcels || []).forEach((parcel) => {
    if (!parcel?.isBuildable || parcel.plannedPark || parcel.isFamilyEstate) return;
    const wp = worldPoint(centroid(parcel.polygon || []), center, scale);
    rememberDestination({ x: wp.x, z: wp.y, door: { x: wp.x, z: wp.y }, inside: { x: wp.x, z: wp.y }, parcelId: parcel.id });
  }));
  if (destinations.length < 2) return null;
  const bodyGeometry = new THREE.CapsuleGeometry(0.075, 0.17, 2, 5);
  const headGeometry = new THREE.SphereGeometry(0.066, 6, 5);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0 });
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0 });
  const bodies = new THREE.InstancedMesh(bodyGeometry, bodyMaterial, slotCount);
  const heads = new THREE.InstancedMesh(headGeometry, headMaterial, slotCount);
  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();
  const hiddenScale = new THREE.Vector3(0, 0, 0);
  const visibleScale = new THREE.Vector3(1, 1, 1);
  const quat = new THREE.Quaternion();
  const pickDestination = (seed, avoid) => {
    let index = Math.floor(seed * 1000003) % destinations.length;
    if (destinations[index] === avoid && destinations.length > 1) index = (index + 1 + Math.floor(seed * 97)) % destinations.length;
    return destinations[index];
  };
  const routeLength = (path) => {
    let length = 0;
    for (let i = 0; i < path.length - 1; i += 1) length += Math.hypot(path[i + 1].x - path[i].x, path[i + 1].z - path[i].z);
    return Math.max(0.4, length);
  };
  const pedestrianPath = (from, to, seed = 0.5) => {
    if (!from || !to) return [];
    if (from.building && to.building) return movementPathForBuildings(roadNav, from.building, to.building, from.inside, to.inside);
    const start = from.door || { x: from.x, z: from.z };
    const end = to.door || { x: to.x, z: to.z };
    const raw = shortestPawnRoadPath(roadNav, start, end) || [start, end];
    const path = [];
    appendDistinctPathPoint(path, from.inside || start);
    raw.forEach((point) => appendDistinctPathPoint(path, point));
    appendDistinctPathPoint(path, to.inside || end);
    return roadNav.sidewalkOnly ? path : sidewalkPath(path, seed > 0.5 ? 1 : -1, 0.24);
  };
  const entries = Array.from({ length: slotCount }, () => ({ active: false, path: [], phase: 0, visualProgress: 0, logicalProgress: 0, inside: true, renderVisible: false, lastPosition: null }));
  let pendingAgents = [];
  function assignPerson(entry, person, index) {
    if (!person) { entry.active = false; entry.personId = ''; entry.path = []; return; }
    const seed = Number(person.seed || 0) || 0.31;
    const from = destinationByParcel.get(person.fromParcelId) || pickDestination(seed + index * 0.017, null);
    const to = destinationByParcel.get(person.toParcelId) || pickDestination(seed * 1.77 + index * 0.113, from);
    const routeKey = `${person.routeId || ''}:${from?.parcelId || ''}:${to?.parcelId || ''}`;
    if (entry.personId !== person.id || entry.routeKey !== routeKey) {
      entry.personId = person.id;
      entry.routeKey = routeKey;
      entry.path = pedestrianPath(from, to, seed);
      entry.distance = routeLength(entry.path);
      entry.visualProgress = Math.max(0, Math.min(1, Number(person.progress || 0)));
    }
    entry.active = !!person.moving && !person.inside && entry.path.length > 1;
    entry.logicalProgress = Math.max(0, Math.min(1, Number(person.progress || 0)));
    // Match the player pawn's 1.1 world-units-per-simulated-minute pace.
    entry.durationMinutes = Math.max(1, entry.distance / 1.1);
    entry.speed = 1.1;
    entry.seed = seed;
    color.set(person.mission ? 0xd7a83f : ['#55463c', '#38434a', '#4d3e35', '#28332f', '#5b5150'][Number(person.color ?? index) % 5]);
    bodies.setColorAt(index, color);
    heads.setColorAt(index, new THREE.Color(index % 4 === 0 ? 0x8d6448 : index % 3 === 0 ? 0xb98765 : 0xc89b79));
  }
  function sync(nextAgents) {
    const next = Array.isArray(nextAgents) ? nextAgents.slice(0, slotCount) : [];
    const byId = new Map(next.map((person) => [person.id, person]));
    const assigned = new Set();
    entries.forEach((entry, index) => {
      const person = entry.personId && byId.get(entry.personId);
      if (!person) { assignPerson(entry, null, index); return; }
      assignPerson(entry, person, index);
      assigned.add(person.id);
    });
    pendingAgents = next.filter((person) => !assigned.has(person.id));
  }
  function processPending(limit = 4) {
    let populated = false;
    while (limit > 0 && pendingAgents.length) {
      const person = pendingAgents.shift();
      const index = entries.findIndex((entry) => !entry.personId);
      if (index < 0) break;
      assignPerson(entries[index], person, index);
      populated = true;
      limit -= 1;
    }
    if (populated && bodies.instanceColor) bodies.instanceColor.needsUpdate = true;
    if (populated && heads.instanceColor) heads.instanceColor.needsUpdate = true;
    return populated;
  }
  let lastUpdate = performance.now();
  function update(now, moving, timing = {}, density = 1) {
    const populated = processPending(4);
    const seconds = now * 0.001;
    const dt = Math.min(0.1, Math.max(0, (now - lastUpdate) / 1000));
    lastUpdate = now;
    const periodMs = Math.max(16, Number(timing.timePeriodMs || 250));
    const stepMinutes = Math.max(1, Number(timing.timeStepMinutes || 1));
    const simulatedMinutesPerSecond = (1000 / periodMs) * stepMinutes;
    const visibleLimit = Math.max(0, Math.min(entries.length, Math.ceil(entries.length * Math.max(0, Math.min(1, density)))));
    entries.forEach((entry, index) => {
      if (index >= visibleLimit || !entry.active) {
        entry.renderVisible = false;
        matrix.compose(new THREE.Vector3(0, -20, 0), quat, hiddenScale);
        bodies.setMatrixAt(index, matrix);
        heads.setMatrixAt(index, matrix);
        return;
      }
      entry.renderVisible = true;
      if (moving) {
        const projected = entry.visualProgress + (simulatedMinutesPerSecond * dt) / Math.max(1, entry.durationMinutes || 35);
        const catchUp = Math.max(0, entry.logicalProgress - projected) * Math.min(1, dt * 7);
        entry.visualProgress = Math.min(1, projected + catchUp);
      }
      entry.phase = Math.max(0, Math.min(1, entry.visualProgress));
      const pos = pointAlongPath(entry.path || [], entry.phase);
      const bob = moving ? Math.sin(seconds * 7 + index) * 0.009 : 0;
      matrix.compose(new THREE.Vector3(pos.x, 0.27 + bob, pos.z), quat, visibleScale);
      bodies.setMatrixAt(index, matrix);
      matrix.compose(new THREE.Vector3(pos.x, 0.48 + bob, pos.z), quat, visibleScale);
      heads.setMatrixAt(index, matrix);
      entry.lastPosition = { x: pos.x, z: pos.z };
    });
    bodies.instanceMatrix.needsUpdate = true;
    heads.instanceMatrix.needsUpdate = true;
    return populated || pendingAgents.length > 0;
  }
  bodies.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  heads.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(bodies, heads);
  sync(agents);
  update(performance.now(), false, {}, 1);
  return { bodies, heads, entries, update, sync, count: slotCount };
}

function buildScene(payload) {
  const scene = new THREE.Scene();
  const lighting = lightingForPayload(payload);
  scene.background = lighting.bg.clone();
  const debug = Object.assign({}, emptyDebug, payload.debug || {});
  const generated = generate3dDistrict(payload);
  const sceneData = Object.assign({}, payload, generated);
  debug.gridCityView = !!sceneData.gridCityView;
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
  const maxMainBuildings = sceneData.gridCityView ? 760 : Infinity;
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
    const result = renderContextDistrict(scene, district, payload, center, scale, materials, districtTargets, rayTargets, buildingMap);
    contextBuildingCount += result.buildings || 0;
  });

  if (!sceneData.gridCityView) addFlatShape(scene, sceneData.outerPolygon, center, scale, 0x969a91, 0, 1);
  addBridgeLandingMarkers(scene, sceneData.bridgeLandings, center, scale);
  const boundary = addLineLoop(scene, sceneData.outerPolygon, center, scale, 0xdfe8d4, 0.08);
  if (boundary) boundary.visible = !!debug.boundary;

  (sceneData.blocks || []).forEach((block) => {
    if (!sceneData.gridCityView) addFlatShape(scene, block.polygon, center, scale, 0x8e9289, 0.022, 0.72);
    addLineLoop(scene, block.polygon, center, scale, 0x42483f, 0.09);
    const blockArea = Math.max(1, areaFromPoly(block.polygon) * scale * scale);
    let coveredArea = 0;
    const cap = blockArea * (0.65 + hashNumber(`${block.id}-density-cap`) * 0.15);
    (block.parcels || []).forEach((parcel) => {
      if (!sceneData.gridCityView) {
        const outline = addLineLoop(scene, parcel.polygon, center, scale, debug.exactExtrusion ? 0xffe08a : 0x222222, 0.11);
        if (outline) outlineGroup.add(outline);
      }
      if (renderedBuildingCount >= maxMainBuildings && !parcel.isFamilyEstate && !parcel.isPlayerSafehouse) {
        if (!sceneData.gridCityView) addLotSurface(parcel, center, scale, scene, 'empty');
        return;
      }
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
        if (!sceneData.gridCityView) addLotSurface(parcel, center, scale, scene, 'park');
      }
    });
  });

  debugRoadClipGroup.visible = !!debug.roadClipPoints;
  if (sceneData.gridCityView) {
    (sceneData.roads || []).forEach((road) => {
      const span = roadAxisSpanThroughPolygon(road, sceneData.outerPolygon);
      if (!span) return;
      const sidewalks = sidewalkMeshForRoad(road, center, scale, span.a, span.b, sceneData.outerPolygon, { capScale: 0, color: GRID_SIDEWALK_COLOR, y: 0.031 });
      if (sidewalks) scene.add(sidewalks);
    });
  }
  (sceneData.roads || []).forEach((road) => clippedRoadMeshes(
    scene,
    road,
    sceneData.outerPolygon,
    center,
    scale,
    debug.roadClipPoints ? debugRoadClipGroup : null,
    sceneData.gridCityView ? [] : buildingFootprints,
    sceneData.gridCityView ? { capScale: 0, color: GRID_ROAD_COLOR, y: 0.038, ignoreBuildingFootprints: true } : {},
  ));
  if (sceneData.gridCityView) addGridRoadIntersectionPatches(scene, sceneData.roads || [], sceneData.outerPolygon, center, scale);
  if (sceneData.gridCityView) addRoadNameLabels(scene, sceneData.roads || [], sceneData.outerPolygon, center, scale);
  // Street lighting is represented by the scene illumination; omit the old floating bulb dots.
  scene.add(debugRoadClipGroup);
  buildingQueue.forEach((building) => {
    scene.add(building);
    if (building.userData.safehouseMarker) safehouseMarkers.push(building.userData.safehouseMarker);
  });
  const territoryGroup = buildMergedMafiaTerritoryOverlay(sceneData.blocks || [], payload.mafiaTerritoryBlocks || [], payload.mafiaColor || '#ff1d1d', center, scale, buildingMap);
  if (territoryGroup) scene.add(territoryGroup);
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
  const allRenderedParcels = (sceneData.blocks || []).reduce((out, block) => out.concat(block.parcels || []), []);
  const countBy = (items, getter) => items.reduce((map, item) => {
    const key = getter(item) || 'Unknown';
    map[key] = (map[key] || 0) + 1;
    return map;
  }, {});
  const topCounts = (map, limit = 5) => Object.keys(map)
    .sort((a, b) => map[b] - map[a] || a.localeCompare(b))
    .slice(0, limit)
    .map((key) => `${key} ${map[key]}`);
  sceneData.renderStats = {
    buildings: renderedBuildingCount,
    contextBuildings: contextBuildingCount,
    parcels: allRenderedParcels.length,
    blocks: (sceneData.blocks || []).length,
    roads: (sceneData.roads || []).length,
    categories: topCounts(countBy(allRenderedParcels, (parcel) => parcel.category), 5),
    subtypes: topCounts(countBy(allRenderedParcels, (parcel) => parcel.subtype || parcel.kind), 5),
    sizes: topCounts(countBy(allRenderedParcels, (parcel) => parcel.sizeClass || (parcel.size ? `Size ${parcel.size}` : 'Unknown')), 5),
  };
  const populationRig = createPopulationRig(scene, payload.populationAgents, sceneData.blocks, center, scale, sceneData.roads || [], buildingMap);
  return { scene, rayTargets, districtTargets, safehouseMarkers, center, scale, bounds: b, buildingMap, debugRoadClipGroup, debugCameraGroup, outlineGroup, territoryGroup, boundary, roadSpawn, generated: sceneData, ambient, sun, populationRig };
}

function mount(root, payload, onSelect) {
  const mountStarted = performance.now();
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

  const sceneStarted = performance.now();
  const { scene, rayTargets, districtTargets, safehouseMarkers, buildingMap, debugCameraGroup, outlineGroup, territoryGroup, center, scale, roadSpawn, generated, ambient, sun, populationRig } = buildScene(payload);
  const sceneBuiltAt = performance.now();
  const islandNavDistricts = generated.contextDistricts || [];
  const navRoads = (generated.roads || [])
    .concat(generated.inheritedRoads || [])
    .concat(...islandNavDistricts.map((district) => (district.renderedRoads || district.roads || []).concat(district.inheritedRoads || [])));
  const navBlocks = (generated.blocks || []).concat(...islandNavDistricts.map((district) => district.renderedBlocks || district.blocks || []));
  const roadNav = buildPawnRoadNav(navRoads, center, scale, navBlocks);
  const vehicleNav = buildVehicleRoadNav(navRoads, center, scale);
  ensureBuildingEntryPoints(buildingMap, roadNav);
  const populationVehicleRig = createCitizenVehicleRig(scene, buildingMap, roadNav, vehicleNav);
  const streetCityPolygon = cleanWorldPoly(generated.outerPolygon || []).map((point) => {
    const world = worldPoint(point, center, scale);
    return { x: world.x, y: world.y };
  });
  const streetInfrastructure = createStreetInfrastructure(scene, roadNav, vehicleNav, {
    ...(payload.streetInfrastructure || {}),
    cityPolygon: streetCityPolygon,
    buildingMap,
  });
  root.dataset.streetLampCount = String(streetInfrastructure?.group?.userData?.lampCount || 0);
  root.dataset.streetLocalLightCount = String(streetInfrastructure?.group?.userData?.dynamicLightCount || 0);
  root.dataset.streetPermanentLightCount = String(streetInfrastructure?.group?.userData?.lampCount || 0);
  root.dataset.streetDynamicLightCount = String(streetInfrastructure?.group?.userData?.dynamicLightCount || 0);
  root.dataset.streetShadowLightCount = String(streetInfrastructure?.group?.userData?.shadowLightCount || 0);
  root.dataset.streetLampBoundaryRejected = String(streetInfrastructure?.group?.userData?.boundaryRejected || 0);
  root.dataset.streetLampDecalCount = String(streetInfrastructure?.group?.userData?.decalCount || 0);
  root.dataset.streetContaminatedStreetCount = String(streetInfrastructure?.group?.userData?.contaminatedStreetCount || 0);
  root.dataset.streetBuildingWindowCount = String(streetInfrastructure?.group?.userData?.buildingWindowCount || 0);
  root.dataset.streetLitWindowCount = String(streetInfrastructure?.group?.userData?.litWindowCount || 0);
  root.dataset.streetOvernightWindowCount = String(streetInfrastructure?.group?.userData?.overnightWindowCount || 0);
  root.dataset.streetStorefrontCount = String(streetInfrastructure?.group?.userData?.storefrontCount || 0);
  root.dataset.streetBuildingDoorCount = String(streetInfrastructure?.group?.userData?.buildingDoorCount || 0);
  root.dataset.streetDoubleDoorCount = String(streetInfrastructure?.group?.userData?.doubleDoorCount || 0);
  root.dataset.streetGarageDoorCount = String(streetInfrastructure?.group?.userData?.garageDoorCount || 0);
  root.dataset.streetMaxLampsPerStreet = String(streetInfrastructure?.group?.userData?.maxLampsPerStreet || 0);
  root.dataset.streetLightMappedMaterials = '0';
  const playerPawn = createPlayerPawn(payload.playerPawn || {});
  const missionTarget = createMissionTargetRig(scene);
  const missionHighlight = createMissionHighlightRig(scene);
  const missionTruck = createMissionTruckRig(scene);
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
  const viewKey = (payload.islandView ? `island:${payload.islandId || payload.islandName || payload.district?.id || 'district'}` : (payload.district?.id || 'district')) + (estateFocus ? ':estate' : '');
  const saved = savedViews.get(viewKey) || {};
  let zoom = saved.zoom || (payload.gridCityView ? 0.46 : payload.islandView ? 0.74 : 1);
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
  let lastDragEndedAt = 0;
  let districtNavAnimating = false;
  let hoveredDistrictNav = null;
  let dragMode = 'pan';
  let last = { x: 0, y: 0 };
  let start = { x: 0, y: 0 };
  const raycaster = new THREE.Raycaster();
  const occlusionRaycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const keyState = new Set();
  const occlusionDirection = new THREE.Vector3();
  const occlusionTarget = new THREE.Vector3();
  const occludedMaterials = new Map();
  const occludedObjects = new Map();
  let lastOcclusionKey = '';
  function setGlobal3dPointerActive(active) {
    if (active) {
      document.body.dataset.deskdon3dPointer = '1';
      return;
    }
    window.setTimeout(() => {
      if (document.body.dataset.deskdon3dPointer === '1') delete document.body.dataset.deskdon3dPointer;
    }, 220);
  }
  const selectedLabel = document.createElement('div');
  selectedLabel.className = 'district-three-debug-label';
  root.appendChild(selectedLabel);
  const versionLabel = document.createElement('div');
  versionLabel.className = 'district-three-version-label';
  const stats = generated.renderStats || { buildings: 0, parcels: 0 };
  const validationText = generated.validation.ok ? 'valid' : `${generated.validation.issues.length} issues`;
  versionLabel.innerHTML = [
    `<strong>3D renderer</strong><span>${RENDERER_VERSION} &middot; ${generated.style} &middot; ${validationText}</span>`,
    `<span>${stats.buildings || 0} buildings &middot; ${stats.parcels || 0} parcels &middot; ${stats.blocks || 0} blocks &middot; ${stats.roads || 0} roads</span>`,
    `<span>Uses: ${(stats.categories || []).join(', ') || 'none'}</span>`,
    `<span>Types: ${(stats.subtypes || []).join(', ') || 'none'}</span>`,
    `<span>Sizes: ${(stats.sizes || []).join(', ') || 'none'}</span>`,
  ].join('');
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
    selectedLabel.textContent = payload.debug?.selectedParcelId && parcelId ? `Selected: ${parcelId}` : '';
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
    updateTerritoryOverlayForZoom(mounted.get(root)?.territoryGroup || territoryGroup, zoom);
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

  function restoreCameraOcclusion() {
    occludedMaterials.forEach((saved, material) => {
      material.transparent = saved.transparent;
      material.opacity = saved.opacity;
      material.depthWrite = saved.depthWrite;
      material.needsUpdate = true;
    });
    occludedObjects.forEach((renderOrder, object) => {
      object.renderOrder = renderOrder;
      object.userData.cameraOccluded = false;
    });
    occludedMaterials.clear();
    occludedObjects.clear();
  }

  function updateCameraOcclusion() {
    const enabled = cameraMode === 'iso' && (zoom >= 1.05 || elevation < 0.62);
    occlusionTarget.set(isoTarget.x, 0.34, isoTarget.z);
    const key = enabled
      ? `${camera.position.x.toFixed(3)}:${camera.position.y.toFixed(3)}:${camera.position.z.toFixed(3)}:${occlusionTarget.x.toFixed(3)}:${occlusionTarget.z.toFixed(3)}`
      : 'disabled';
    if (key === lastOcclusionKey) return;
    lastOcclusionKey = key;
    if (!enabled) {
      restoreCameraOcclusion();
      root.dataset.cameraOccluderCount = '0';
      return;
    }
    const targetDistance = camera.position.distanceTo(occlusionTarget);
    if (targetDistance < 0.5) {
      restoreCameraOcclusion();
      root.dataset.cameraOccluderCount = '0';
      return;
    }
    let focusEntry = null;
    const focusPoint = { x: isoTarget.x, y: isoTarget.z };
    buildingMap.forEach((entry) => {
      if (!focusEntry && entry.worldFootprint?.length >= 3 && pointInPoly(focusPoint, entry.worldFootprint)) focusEntry = entry;
    });
    const cameraPoint = { x: camera.position.x, y: camera.position.z };
    const cameraInsideFocus = !!(focusEntry
      && pointInPoly(cameraPoint, focusEntry.worldFootprint)
      && camera.position.y <= Number(focusEntry.height || 0) + 0.3);
    occlusionDirection.copy(occlusionTarget).sub(camera.position).normalize();
    occlusionRaycaster.set(camera.position, occlusionDirection);
    occlusionRaycaster.near = 0;
    occlusionRaycaster.far = Math.max(0.1, targetDistance - 0.18);
    const blockers = new Set();
    occlusionRaycaster.intersectObjects(rayTargets, false).forEach((hit) => {
      const parcelId = hit.object?.userData?.parcel?.id;
      if (!parcelId) return;
      const focusMainStructure = focusEntry?.parcel?.id === parcelId
        && (hit.object === focusEntry.mesh || hit.object === focusEntry.roofMesh);
      if (focusMainStructure && !cameraInsideFocus) return;
      blockers.add(hit.object);
    });
    root.dataset.cameraOccluderCount = String(blockers.size);
    const nextMaterials = new Set();
    blockers.forEach((object) => {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.filter(Boolean).forEach((material) => nextMaterials.add(material));
    });
    occludedMaterials.forEach((saved, material) => {
      if (nextMaterials.has(material)) return;
      material.transparent = saved.transparent;
      material.opacity = saved.opacity;
      material.depthWrite = saved.depthWrite;
      material.needsUpdate = true;
      occludedMaterials.delete(material);
    });
    occludedObjects.forEach((renderOrder, object) => {
      if (blockers.has(object)) return;
      object.renderOrder = renderOrder;
      object.userData.cameraOccluded = false;
      occludedObjects.delete(object);
    });
    blockers.forEach((object) => {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.filter(Boolean).forEach((material) => {
        if (occludedMaterials.has(material)) return;
        occludedMaterials.set(material, {
          transparent: material.transparent,
          opacity: material.opacity,
          depthWrite: material.depthWrite,
        });
        material.transparent = true;
        material.opacity = Math.min(0.2, Number(material.opacity ?? 1));
        material.depthWrite = false;
        material.needsUpdate = true;
      });
      if (occludedObjects.has(object)) return;
      occludedObjects.set(object, object.renderOrder);
      object.renderOrder = 17;
      object.userData.cameraOccluded = true;
    });
  }

  function resize() {
    if (root._deskDonSuspended) return;
    applyPerformanceLevel();
    const rect = root.getBoundingClientRect();
    if (rect.width < 40 || rect.height < 40) return;
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
    updateCameraOcclusion();
    const activeCamera = cameraMode === 'street' ? streetCamera : camera;
    renderer.render(scene, activeCamera);
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
    updateCameraOcclusion();
    const activeCamera = cameraMode === 'street' ? streetCamera : camera;
    renderer.render(scene, activeCamera);
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
    const phase = currentTimePhase(now);
    const lighting = lightingAtPhase(phase);
    scene.background.copy(lighting.bg);
    ambient.color.copy(lighting.ambientColor);
    ambient.intensity = lighting.ambient;
    sun.color.copy(lighting.sunColor);
    sun.intensity = lighting.sun;
    sun.position.set(lighting.sunPos[0], lighting.sunPos[1], lighting.sunPos[2]);
    streetInfrastructure?.setPhase?.(phase);
    root.dataset.streetActiveWindowCount = String(streetInfrastructure?.group?.userData?.activeWindowCount || 0);
    root.dataset.streetLightingMinute = String(Math.round(streetInfrastructure?.group?.userData?.lightingMinute || 0));
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
    const currentEntry = mounted.get(root);
    if (root._deskDonSuspended) {
      if (currentEntry) currentEntry.frame = 0;
      return;
    }
    const dt = Math.min(0.05, Math.max(0.001, (now - lastFrame) / 1000));
    lastFrame = now;
    const livePayload = root._deskDonPayload || payload;
    const populationDensity = pedestrianDensityForPayload(livePayload);
    const populationSuppressed = Number(livePayload.timeSpeed || 1) >= 40;
    const populationLoading = !!populationRig?.update?.(now, !!livePayload.timeMoving, livePayload, populationDensity);
    const vehiclePopulationLoading = !!populationVehicleRig?.update?.(now, !!livePayload.timeMoving, livePayload, !populationSuppressed);
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
        const timeSpinMultiplier = livePayload.timeMoving ? Math.max(1, Number(livePayload.timeVisualSpeed || livePayload.timeSpeed || 1)) : 1;
      activeMarkers.forEach((marker, i) => {
        marker.rotation.y += dt * (1.1 + i * 0.08) * timeSpinMultiplier;
        const markerScale = zoom < 0.58 ? Math.min(1.9, 1 + (0.58 - zoom) * 1.8) : 1;
        marker.scale.setScalar(markerScale);
        marker.position.y = (marker.userData.baseY || marker.position.y) + Math.sin(now * 0.002 * timeSpinMultiplier + i) * 0.08;
      });
    }
    const pawnRouteLive = !!livePayload.playerPawn?.targetParcelId;
    const pawnAnimating = !!(livePayload.timeMoving && pawnRouteLive);
    const liveEntry = mounted.get(root);
    const missionRouteLive = !!livePayload.missionTarget?.active;
    const missionAnimating = !!(missionRouteLive && liveEntry && updateMissionTargetObject(liveEntry, livePayload.missionTarget, buildingMap));
    if (missionAnimating && missionTarget.visible) {
      missionTarget.userData.beacon.material.opacity = 0.24 + Math.sin(now * 0.004) * 0.1;
      missionTarget.userData.ring.scale.setScalar(1 + Math.sin(now * 0.005) * 0.13);
    }
    const highlightAnimating = !!(livePayload.missionHighlight?.active && liveEntry && updateMissionHighlightObject(liveEntry, livePayload.missionHighlight));
    if (highlightAnimating && missionHighlight.visible) {
      missionHighlight.userData.ring.scale.setScalar(1 + Math.sin(now * 0.0045) * 0.18);
      missionHighlight.userData.beam.material.opacity = 0.24 + Math.sin(now * 0.0035) * 0.1;
      missionHighlight.position.y = 0.05 + Math.sin(now * 0.0028) * 0.08;
    }
    if (pawnAnimating && liveEntry) {
      [liveEntry.playerRoute, liveEntry.queuedRouteGroup].forEach((routeGroup) => routeGroup?.traverse((object) => {
        if (object.userData?.routeDash && object.material) object.material.dashOffset -= dt * 0.9;
        if (object.userData?.stopOrder) {
          const pulse = 1 + Math.sin(now * 0.004 + object.userData.stopOrder) * 0.08;
          object.scale.setScalar(pulse);
        }
      }));
    }
    const feedbackAnimating = !!(livePayload.playerPawn?.action?.active || liveEntry?.actionProgress?.visible || liveEntry?.cashFloat || (livePayload.playerPawn?.cashFloat?.amount && now - Number(livePayload.playerPawn.cashFloat.startedAt || 0) < 1800));
    const vehicleWasVisible = !!liveEntry?.missionTruck?.visible;
    if ((pawnRouteLive || feedbackAnimating || livePayload.missionVehicle?.active || vehicleWasVisible) && liveEntry) updatePlayerPawnObject(liveEntry, livePayload.playerPawn, buildingMap);
    const truckAnimating = !!(liveEntry && updateMissionTruckObject(liveEntry, livePayload.missionVehicle, buildingMap));
    if (livePayload.missionVehicle?.active && playerPawn) playerPawn.visible = false;
    if (playerPawn?.visible) {
      playerPawn.scale.setScalar(1);
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
    const needsContinuousRender = livePayload.timeMoving || pawnRouteLive || missionRouteLive || missionAnimating || highlightAnimating || truckAnimating || feedbackAnimating || animateSafehouseMarkers || zoomAnimating || streetMoved || populationLoading || vehiclePopulationLoading || cameraMode === 'street';
    if (livePayload.timeMoving && (pawnRouteLive || missionRouteLive) && nextRenderAt > now + 1000 / 180) nextRenderAt = now;
    if (needsContinuousRender && now >= nextRenderAt) {
      if (livePayload.timeMoving) applyLiveLighting(now);
      renderLoop();
      nextRenderAt = now + 1000 / 180;
      if (nextRenderAt < now - 1000 / 180) nextRenderAt = now + 1000 / 180;
    }
    const entry = mounted.get(root);
    if (entry) entry.frame = requestAnimationFrame(animate);
  }

  function onWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    targetZoom = Math.max(0.2, Math.min(3.2, targetZoom * Math.exp(-e.deltaY * 0.0015)));
  }

  function onPointerDown(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.button === 1) {
      selectedParcelId = null;
      applyHighlight(null);
      saveView();
      root.dispatchEvent(new CustomEvent('deskdon-building-deselected', { detail: { reason: 'middle-button' }, bubbles: true }));
      renderLoop();
      return;
    }
    setGlobal3dPointerActive(true);
    setDistrictHover(hoveredDistrictNav, false);
    hoveredDistrictNav = null;
    root.style.cursor = 'grabbing';
    if (cameraMode === 'street' && document.pointerLockElement !== root) {
      root.requestPointerLock?.();
    }
    if (e.button === 0 || e.button === 2) {
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
        if (typeof onSelect === 'function') onSelect({ districtNavId: nav.id, name: nav.name, entering: true });
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
    if (wasMoved) lastDragEndedAt = performance.now();
    setGlobal3dPointerActive(false);
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
    if (selectedParcel && selectedParcel.id === selectedParcelId) {
      selectedParcelId = null;
      applyHighlight(null);
      saveView();
      root.dispatchEvent(new CustomEvent('deskdon-building-deselected', { detail: { reason: 'same-building' }, bubbles: true }));
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
      return;
    }
    selectedParcelId = null;
    applyHighlight(null);
    saveView();
    root.dispatchEvent(new CustomEvent('deskdon-building-deselected', { detail: { reason: 'ground' }, bubbles: true }));
    renderLoop();
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
    lastDragEndedAt = performance.now();
    setGlobal3dPointerActive(false);
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
    if (dragging || moved || performance.now() - lastDragEndedAt < 280) return;
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
  const wheelPanel = root.parentElement || null;
  if (wheelPanel) wheelPanel.addEventListener('wheel', onWheel, { passive: false });
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
  updatePlayerPawnObject({ root, playerPawn, playerRoute, queuedRouteGroup, roadNav, roadSpawn }, payload.playerPawn, buildingMap);
  const frame = requestAnimationFrame(animate);
  function focusParcel(parcelId, sourceLocation) { const destination = buildingMap.get(parcelId), point = destination?.center || (sourceLocation ? worldPoint(sourceLocation, center, scale) : null); if (!point) return false; panX = point.x; panZ = point.y; targetZoom = Math.max(1.35, targetZoom); cameraMode = 'iso'; saveView(); renderLoop(); return true; }
  const mountedEntry = { root, renderer, scene, onResize, onWheel, wheelPanel, onPointerDown, onPointerMove, onPointerUp, onPointerLeave, onPointerCancel, onContextMenu, onKeyDown, onKeyUp, onDocumentMouseMove, applyLiveLighting, renderLoop, focusParcel, animate, frame, playerPawn, missionTarget, missionHighlight, missionTruck, playerRoute, queuedRouteGroup, buildingMap, roadNav, vehicleNav, roadSpawn, safehouseMarkers, center, scale, territoryGroup, generated, populationRig, populationVehicleRig, streetInfrastructure };
  mounted.set(root, mountedEntry);
  root.dataset.rendererSceneMs = String(Math.round(sceneBuiltAt - sceneStarted));
  root.dataset.rendererMountMs = String(Math.round(performance.now() - mountStarted));
  refreshMergedMafiaTerritoryOverlay(mountedEntry);
  updateMissionTargetObject(mountedEntry, payload.missionTarget, buildingMap);
  updateMissionHighlightObject(mountedEntry, payload.missionHighlight);
  updateMissionTruckObject(mountedEntry, payload.missionVehicle, buildingMap);
  if (payload.missionVehicle?.active) playerPawn.visible = false;
  populationRig?.update(performance.now(), false, payload, pedestrianDensityForPayload(payload));
  populationVehicleRig?.update?.(performance.now(), false, payload, true);
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
    updateMissionTargetObject(entry, root._deskDonPayload.missionTarget, entry.buildingMap);
    updateMissionHighlightObject(entry, root._deskDonPayload.missionHighlight);
    updateMissionTruckObject(entry, root._deskDonPayload.missionVehicle, entry.buildingMap);
    if (root._deskDonPayload.missionVehicle?.active && entry.playerPawn) entry.playerPawn.visible = false;
    const populationSuppressed = Number(root._deskDonPayload.timeSpeed || 1) >= 40;
    if (!populationSuppressed) entry.populationRig?.sync?.(root._deskDonPayload.populationAgents);
    entry.populationRig?.update(performance.now(), !!root._deskDonPayload.timeMoving, root._deskDonPayload, pedestrianDensityForPayload(root._deskDonPayload));
    if (!populationSuppressed) entry.populationVehicleRig?.sync?.(root._deskDonPayload.populationVehicles);
    entry.populationVehicleRig?.update?.(performance.now(), !!root._deskDonPayload.timeMoving, root._deskDonPayload, !populationSuppressed);
    if (root._deskDonPayload.timeMoving) {
      if (root._deskDonPayload.playerPawn?.targetParcelId || root._deskDonPayload.missionTarget?.active || root._deskDonPayload.missionVehicle?.moving) entry.renderLoop?.();
      return;
    }
    entry.applyLiveLighting?.(performance.now());
    entry.renderLoop?.();
  });
}

function setSuspended(root, suspended) {
  const entry = mounted.get(root);
  if (!entry) return;
  root._deskDonSuspended = !!suspended;
  if (!root._deskDonSuspended) {
    requestAnimationFrame(() => {
      entry.onResize?.();
      entry.renderLoop?.();
      if (!entry.frame) entry.frame = requestAnimationFrame(entry.animate);
    });
  }
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
  root._deskDonPayload.mafiaTerritoryBlocks = payload.mafiaTerritoryBlocks || root._deskDonPayload.mafiaTerritoryBlocks || [];
  root._deskDonPayload.buildingStates = payload.buildingStates || root._deskDonPayload.buildingStates || {};
  root._deskDonPayload.collectionRushActive = !!payload.collectionRushActive;
  withMounted(root, (entry) => {
    const protectedBusinesses = root._deskDonPayload.protectedBusinesses || {};
    entry.buildingMap.forEach((building, id) => {
      applyBuildingOperationalVisual(building, root._deskDonPayload.buildingStates[id]);
      const starterRacket = root._deskDonPayload.collectionRushActive && building.parcel.mafiaProtected && building.parcel.racketWeeklyDue
        ? { color: building.parcel.protectionColor || root._deskDonPayload.mafiaColor || '#ff1d1d', weeklyDue: building.parcel.racketWeeklyDue, ready: true }
        : null;
      const racket = protectedBusinesses[id] || starterRacket;
      if (!racket) {
        if (building.group.userData.racketMoneyMarker) {
          building.group.userData.racketMoneyMarker.userData.racketInactive = true;
          building.group.userData.racketMoneyMarker.visible = false;
        }
        building.parcel.mafiaControlled = !!(building.parcel.isFamilyEstate || building.parcel.subtype === 'Family Estate');
        return;
      }
      const color = racket.color || root._deskDonPayload.mafiaColor || '#ff1d1d';
      building.parcel.mafiaProtected = true;
      building.parcel.mafiaControlled = !!racket.controlled;
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
    refreshMergedMafiaTerritoryOverlay(entry);
    entry.renderLoop?.();
  });
}

function updateBuildingStates(root, buildingStates) {
  if (!root?._deskDonPayload) return;
  root._deskDonPayload.buildingStates = buildingStates || {};
  withMounted(root, (entry) => {
    entry.buildingMap.forEach((building, id) => {
      applyBuildingOperationalVisual(building, root._deskDonPayload.buildingStates[id]);
    });
    entry.renderLoop?.();
  });
}

function focusParcel(root, parcelId, sourceLocation) { let focused = false; withMounted(root, (entry) => { focused = !!entry.focusParcel?.(parcelId, sourceLocation); }); return focused; }
window.DeskDon3D = { mount, cleanup, rotate, cameraView, resetCamera, focusParcel, updateTime, updateFogOpacity, updateRackets, updateBuildingStates, setSuspended };
window.DeskDon3D.exportData = function exportData(root) {
  return root?._deskDonGenerated || null;
};
window.DeskDon3D.exportTerritoryDebug = function exportTerritoryDebug(root) {
  const entry = mounted.get(root);
  if (!entry) return null;
  const generated = entry.generated || root?._deskDonGenerated || {};
  const blocks = generated.blocks || [];
  const controlled = Array.from(controlledTerritoryBlockIds(blocks, root?._deskDonPayload?.mafiaTerritoryBlocks || [], entry.buildingMap, entry.center || { x: 0, y: 0 }, entry.scale || WORLD_SCALE));
  const estateBuildings = [];
  entry.buildingMap?.forEach((building) => {
    const parcel = building.parcel || {};
    if (parcel.isFamilyEstate || String(parcel.subtype || '').toLowerCase() === 'family estate') {
      estateBuildings.push({ parcelId: parcel.id, blockId: parcel.blockId, center: { x: building.center?.x || 0, y: building.center?.y || 0 } });
    }
  });
  return { payloadBlocks: root?._deskDonPayload?.mafiaTerritoryBlocks || [], controlled, estateBuildings, territoryMeshes: entry.territoryGroup?.children?.length || 0 };
};
window.dispatchEvent(new Event('deskdon-three-ready'));
