import * as THREE from '/node_modules/three/build/three.module.js';
import { pointInPoly, sourcePoint, worldPoint } from '../core/geometry.js';

const DEFAULT_WORLD_SCALE = 0.1;

function bounds(poly) {
  return (poly || []).reduce((b, p) => ({
    minX: Math.min(b.minX, p.x),
    maxX: Math.max(b.maxX, p.x),
    minY: Math.min(b.minY, p.y),
    maxY: Math.max(b.maxY, p.y),
  }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
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

function addTerritoryEdgeBar(group, a, b, material, thickness, y, renderOrder, height = 0.018) {
  const dx = b.x - a.x;
  const dz = b.y - a.y;
  const len = Math.hypot(dx, dz);
  if (len < 0.02) return;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, height, thickness), material);
  mesh.position.set((a.x + b.x) / 2, y, (a.y + b.y) / 2);
  mesh.rotation.y = -Math.atan2(dz, dx);
  mesh.renderOrder = renderOrder;
  group.add(mesh);
}

function territoryFillOpacityForZoom(zoom) {
  // Territory fill is invisible in inspection view. It becomes a strategic-map
  // overlay only when the player zooms far out.
  const startZoom = 0.34;
  const fullZoom = 0.21;
  const t = Math.max(0, Math.min(1, (startZoom - Number(zoom || 1)) / (startZoom - fullZoom)));
  return t <= 0 ? 0 : 0.52 * t * t;
}

export function updateTerritoryOverlayForZoom(group, zoom) {
  if (!group?.userData?.mergedMafiaTerritory) return;
  const opacity = territoryFillOpacityForZoom(zoom);
  const opacityBucket = Math.round(opacity * 1000);
  if (group.userData.lastTerritoryOpacityBucket === opacityBucket) return;
  group.userData.lastTerritoryOpacityBucket = opacityBucket;

  const tintStrength = Math.max(0, Math.min(0.72, opacity * 1.38));
  const fillMaterial = group.userData.territoryFillMaterial;
  if (fillMaterial) {
    fillMaterial.opacity = opacity;
    fillMaterial.needsUpdate = true;
  }
  (group.userData.territoryFillMeshes || []).forEach((mesh) => {
    mesh.visible = opacity > 0.012;
  });

  const tintColor = group.userData.territoryTintColor || new THREE.Color(0xff1d1d);
  (group.userData.territoryTintTargets || []).forEach((target) => {
    const material = target?.material;
    if (!material?.color) return;
    if (tintStrength <= 0.006) {
      if (material.userData.territoryOriginalColor !== undefined) {
        material.color.setHex(material.userData.territoryOriginalColor);
        delete material.userData.territoryOriginalColor;
      }
      if (material.emissive && material.userData.territoryOriginalEmissive !== undefined) {
        material.emissive.setHex(material.userData.territoryOriginalEmissive);
        delete material.userData.territoryOriginalEmissive;
      }
      material.needsUpdate = true;
      return;
    }

    if (material.userData.territoryOriginalColor === undefined) {
      material.userData.territoryOriginalColor = material.color.getHex();
    }
    const baseColor = new THREE.Color(material.userData.territoryOriginalColor);
    material.color.copy(baseColor).lerp(tintColor, tintStrength);
    if (material.emissive) {
      if (material.userData.territoryOriginalEmissive === undefined) {
        material.userData.territoryOriginalEmissive = material.emissive.getHex();
      }
      const baseEmissive = new THREE.Color(material.userData.territoryOriginalEmissive);
      material.emissive.copy(baseEmissive).lerp(tintColor, tintStrength * 0.18);
    }
    material.needsUpdate = true;
  });
}

function territoryRectFromBlock(block) {
  if (!block?.polygon || block.polygon.length < 3) return null;
  const b = block.rect || bounds(block.polygon);
  const rect = {
    id: block.id,
    minX: Math.min(Number(b.minX), Number(b.maxX)),
    maxX: Math.max(Number(b.minX), Number(b.maxX)),
    minY: Math.min(Number(b.minY), Number(b.maxY)),
    maxY: Math.max(Number(b.minY), Number(b.maxY)),
    kind: 'block',
  };
  if (![rect.minX, rect.maxX, rect.minY, rect.maxY].every(Number.isFinite)) return null;
  if (rect.maxX - rect.minX < 0.5 || rect.maxY - rect.minY < 0.5) return null;
  return rect;
}

function territoryRectPoly(rect) {
  return [
    { x: rect.minX, y: rect.minY },
    { x: rect.maxX, y: rect.minY },
    { x: rect.maxX, y: rect.maxY },
    { x: rect.minX, y: rect.maxY },
  ];
}

function overlapRange(aMin, aMax, bMin, bMax, minSize = 4) {
  const min = Math.max(aMin, bMin);
  const max = Math.min(aMax, bMax);
  return max - min >= minSize ? { min, max } : null;
}

function territoryConnectorRects(rects) {
  // Controlled blocks separated by a normal road gap should read as one
  // territory. These connector rectangles fill those road/sidewalk gaps before
  // we calculate the outer perimeter.
  const connectors = [];
  const allRects = rects.slice();
  const seen = new Set();
  const maxGap = 74;
  const minOverlap = 4;
  const rectKey = (rect) => [
    Math.round(rect.minX * 10) / 10,
    Math.round(rect.maxX * 10) / 10,
    Math.round(rect.minY * 10) / 10,
    Math.round(rect.maxY * 10) / 10,
  ].join(':');
  const addConnector = (rect) => {
    if (rect.maxX - rect.minX < 0.5 || rect.maxY - rect.minY < 0.5) return;
    const key = rectKey(rect);
    if (seen.has(key)) return;
    seen.add(key);
    connectors.push(rect);
    allRects.push(rect);
  };

  for (let pass = 0; pass < 4; pass += 1) {
    const startCount = allRects.length;
    const passRects = allRects.slice();
    for (let i = 0; i < passRects.length; i += 1) {
      for (let j = i + 1; j < passRects.length; j += 1) {
        const a = passRects[i];
        const b = passRects[j];
        const yOverlap = overlapRange(a.minY, a.maxY, b.minY, b.maxY, minOverlap);
        const xOverlap = overlapRange(a.minX, a.maxX, b.minX, b.maxX, minOverlap);
        const horizontalGap = a.maxX <= b.minX ? b.minX - a.maxX : b.maxX <= a.minX ? a.minX - b.maxX : -1;
        if (yOverlap && horizontalGap >= 0 && horizontalGap <= maxGap) {
          const left = a.maxX <= b.minX ? a : b;
          const right = left === a ? b : a;
          addConnector({
            id: `connector-${left.id}-${right.id}`,
            minX: left.maxX,
            maxX: right.minX,
            minY: yOverlap.min,
            maxY: yOverlap.max,
            kind: 'connector',
          });
        }
        const verticalGap = a.maxY <= b.minY ? b.minY - a.maxY : b.maxY <= a.minY ? a.minY - b.maxY : -1;
        if (xOverlap && verticalGap >= 0 && verticalGap <= maxGap) {
          const top = a.maxY <= b.minY ? a : b;
          const bottom = top === a ? b : a;
          addConnector({
            id: `connector-${top.id}-${bottom.id}`,
            minX: xOverlap.min,
            maxX: xOverlap.max,
            minY: top.maxY,
            maxY: bottom.minY,
            kind: 'connector',
          });
        }
      }
    }
    if (allRects.length === startCount) break;
  }
  return connectors;
}

function territoryRectContains(rect, x, y) {
  return x > rect.minX + 0.001 && x < rect.maxX - 0.001 && y > rect.minY + 0.001 && y < rect.maxY - 0.001;
}

function uniqueCoords(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((value) => {
    const last = out[out.length - 1];
    if (!Number.isFinite(last) || Math.abs(value - last) > 0.08) out.push(value);
  });
  return out;
}

function mergeTerritoryUnionEdges(edges) {
  const eps = 0.08;
  const coordKey = (value) => String(Math.round(value * 10) / 10);
  const horizontal = new Map();
  const vertical = new Map();
  edges.forEach((edge) => {
    if (Math.abs(edge.a.y - edge.b.y) < eps) {
      const key = coordKey(edge.a.y);
      if (!horizontal.has(key)) horizontal.set(key, []);
      horizontal.get(key).push({ from: Math.min(edge.a.x, edge.b.x), to: Math.max(edge.a.x, edge.b.x), y: edge.a.y });
      return;
    }
    if (Math.abs(edge.a.x - edge.b.x) < eps) {
      const key = coordKey(edge.a.x);
      if (!vertical.has(key)) vertical.set(key, []);
      vertical.get(key).push({ from: Math.min(edge.a.y, edge.b.y), to: Math.max(edge.a.y, edge.b.y), x: edge.a.x });
    }
  });

  const merged = [];
  horizontal.forEach((items) => {
    items.sort((a, b) => a.from - b.from);
    let active = null;
    items.forEach((item) => {
      if (!active || item.from > active.to + eps) {
        if (active) merged.push({ a: { x: active.from, y: active.y }, b: { x: active.to, y: active.y } });
        active = { ...item };
      } else active.to = Math.max(active.to, item.to);
    });
    if (active) merged.push({ a: { x: active.from, y: active.y }, b: { x: active.to, y: active.y } });
  });
  vertical.forEach((items) => {
    items.sort((a, b) => a.from - b.from);
    let active = null;
    items.forEach((item) => {
      if (!active || item.from > active.to + eps) {
        if (active) merged.push({ a: { x: active.x, y: active.from }, b: { x: active.x, y: active.to } });
        active = { ...item };
      } else active.to = Math.max(active.to, item.to);
    });
    if (active) merged.push({ a: { x: active.x, y: active.from }, b: { x: active.x, y: active.to } });
  });
  return merged;
}

function territoryUnionEdges(rects) {
  if (!rects.length) return [];
  const xs = uniqueCoords(rects.flatMap((rect) => [rect.minX, rect.maxX]));
  const ys = uniqueCoords(rects.flatMap((rect) => [rect.minY, rect.maxY]));
  if (xs.length < 2 || ys.length < 2) return [];
  const cols = xs.length - 1;
  const rows = ys.length - 1;
  const cell = (x, y) => y * cols + x;
  const filled = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const cx = (xs[x] + xs[x + 1]) * 0.5;
      const cy = (ys[y] + ys[y + 1]) * 0.5;
      if (rects.some((rect) => territoryRectContains(rect, cx, cy))) filled[cell(x, y)] = 1;
    }
  }

  const isFilled = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows && filled[cell(x, y)];
  const edges = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!filled[cell(x, y)]) continue;
      if (!isFilled(x, y - 1)) edges.push({ a: { x: xs[x], y: ys[y] }, b: { x: xs[x + 1], y: ys[y] } });
      if (!isFilled(x + 1, y)) edges.push({ a: { x: xs[x + 1], y: ys[y] }, b: { x: xs[x + 1], y: ys[y + 1] } });
      if (!isFilled(x, y + 1)) edges.push({ a: { x: xs[x + 1], y: ys[y + 1] }, b: { x: xs[x], y: ys[y + 1] } });
      if (!isFilled(x - 1, y)) edges.push({ a: { x: xs[x], y: ys[y + 1] }, b: { x: xs[x], y: ys[y] } });
    }
  }
  return mergeTerritoryUnionEdges(edges);
}

function blockContainsTerritoryParcel(block) {
  return (block?.parcels || []).some((parcel) => !!(
    parcel?.mafiaControlled ||
    parcel?.mafiaProtected ||
    parcel?.isFamilyEstate ||
    String(parcel?.subtype || '').toLowerCase() === 'family estate'
  ));
}

function blockAtSourcePoint(blocks, point) {
  if (!point) return null;
  return (blocks || []).find((block) => pointInPoly(point, block.polygon || [])) || null;
}

export function controlledTerritoryBlockIds(blocks, suppliedIds, buildingMap = null, center = { x: 0, y: 0 }, scale = DEFAULT_WORLD_SCALE) {
  const ids = new Set((suppliedIds || []).filter(Boolean));
  const blockIds = new Set((blocks || []).map((block) => block.id));
  (blocks || []).forEach((block) => {
    if (ids.has(block.id)) return;
    if (blockContainsTerritoryParcel(block)) ids.add(block.id);
  });
  buildingMap?.forEach((building) => {
    const parcel = building?.parcel || {};
    const controlled = parcel.mafiaControlled || parcel.mafiaProtected || parcel.isFamilyEstate || String(parcel.subtype || '').toLowerCase() === 'family estate';
    if (!controlled) return;
    if (parcel.blockId && blockIds.has(parcel.blockId)) {
      ids.add(parcel.blockId);
      return;
    }
    const source = sourcePoint({ x: building.center?.x || 0, y: building.center?.y || 0 }, center, scale);
    const block = blockAtSourcePoint(blocks, source);
    if (block?.id) ids.add(block.id);
  });
  return ids;
}

function buildingBelongsToTerritory(building, controlled, blockRects, center, scale) {
  const parcel = building?.parcel || {};
  if (parcel.blockId && controlled.has(parcel.blockId)) return true;
  if (parcel.mafiaControlled || parcel.mafiaProtected || parcel.isFamilyEstate || String(parcel.subtype || '').toLowerCase() === 'family estate') return true;
  if (!building?.center) return false;
  const source = sourcePoint({ x: building.center.x || 0, y: building.center.y || 0 }, center, scale);
  return blockRects.some((rect) => territoryRectContains(rect, source.x, source.y));
}

function collectTerritoryTintTargets(building) {
  const targets = [];
  const parcel = building?.parcel;
  const seen = new Set();
  const addMaterial = (material) => {
    if (!material?.color || seen.has(material.uuid)) return;
    seen.add(material.uuid);
    targets.push({ material });
  };
  building?.group?.traverse?.((object) => {
    if (!object?.isMesh || object.userData?.parcel !== parcel) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach(addMaterial);
  });
  if (!targets.length) {
    [building?.mesh, building?.roofMesh].forEach((mesh) => {
      const materials = Array.isArray(mesh?.material) ? mesh.material : [mesh?.material];
      materials.forEach(addMaterial);
    });
  }
  return targets;
}

export function buildTerritoryOverlay({
  blocks,
  controlledBlockIds,
  color,
  center,
  scale,
  buildingMap = null,
} = {}) {
  const controlled = controlledTerritoryBlockIds(blocks, controlledBlockIds, buildingMap, center, scale);
  if (!controlled.size) return null;
  const blockRects = (blocks || [])
    .filter((block) => controlled.has(block.id))
    .map(territoryRectFromBlock)
    .filter(Boolean);
  if (!blockRects.length) return null;

  const connectorRects = territoryConnectorRects(blockRects);
  const territoryRects = blockRects.concat(connectorRects);
  const edges = territoryUnionEdges(territoryRects);
  if (!edges.length) return null;

  const outline = new THREE.Group();
  outline.userData.mergedMafiaTerritory = true;
  outline.renderOrder = 118;
  const base = new THREE.Color(color || '#ff1d1d');
  const wash = new THREE.MeshBasicMaterial({ color: base, transparent: true, opacity: 0, depthWrite: false, depthTest: true, side: THREE.DoubleSide });
  const ghost = new THREE.MeshBasicMaterial({ color: base, transparent: true, opacity: 0.13, depthWrite: false, depthTest: false });
  const glow = new THREE.MeshBasicMaterial({ color: base, transparent: true, opacity: 0.48, depthWrite: false, depthTest: true });
  const core = new THREE.MeshBasicMaterial({ color: base, transparent: true, opacity: 0.98, depthWrite: false, depthTest: true });
  outline.userData.territoryFillMaterial = wash;
  outline.userData.territoryFillMeshes = [];
  outline.userData.territoryTintColor = base;
  outline.userData.territoryTintTargets = [];

  territoryRects.forEach((rect) => {
    const fillGeometry = new THREE.ShapeGeometry(shapeFromPoly(territoryRectPoly(rect), center, scale));
    fillGeometry.rotateX(-Math.PI / 2);
    const fill = new THREE.Mesh(fillGeometry, wash);
    // Strategic ground wash paints roads/sidewalks/open lots. Buildings occlude
    // it and receive a separate material tint, so the overlay stays uniform.
    fill.position.y = 0.078;
    fill.renderOrder = 117;
    fill.visible = false;
    outline.userData.territoryFillMeshes.push(fill);
    outline.add(fill);
  });

  buildingMap?.forEach((building) => {
    if (!buildingBelongsToTerritory(building, controlled, blockRects, center, scale)) return;
    collectTerritoryTintTargets(building).forEach((target) => outline.userData.territoryTintTargets.push(target));
  });

  edges.forEach(({ a, b }) => {
    const aw = worldPoint(a, center, scale);
    const bw = worldPoint(b, center, scale);
    if (Math.hypot(bw.x - aw.x, bw.y - aw.y) < 0.05) return;
    // Covered line sections intentionally dim because the ghost layer remains
    // visible through geometry while the bright layers are depth-tested.
    addTerritoryEdgeBar(outline, { x: aw.x, y: aw.y }, { x: bw.x, y: bw.y }, ghost, 0.34, 0.57, 119, 0.18);
    addTerritoryEdgeBar(outline, { x: aw.x, y: aw.y }, { x: bw.x, y: bw.y }, glow, 0.46, 0.46, 120, 0.16);
    addTerritoryEdgeBar(outline, { x: aw.x, y: aw.y }, { x: bw.x, y: bw.y }, core, 0.14, 0.55, 121, 0.22);
  });

  return outline.children.length ? outline : null;
}

export function buildMergedMafiaTerritoryOverlay(blocks, controlledBlockIds, color, center, scale, buildingMap = null) {
  return buildTerritoryOverlay({ blocks, controlledBlockIds, color, center, scale, buildingMap });
}
