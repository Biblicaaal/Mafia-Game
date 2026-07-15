import * as THREE from '/node_modules/three/build/three.module.js';

function nearestPointOnSegment(point, segment) {
  const dx = segment.b.x - segment.a.x;
  const dz = segment.b.z - segment.a.z;
  const lengthSquared = dx * dx + dz * dz;
  const t = lengthSquared
    ? Math.max(0, Math.min(1, ((point.x - segment.a.x) * dx + (point.z - segment.a.z) * dz) / lengthSquared))
    : 0;
  const x = segment.a.x + dx * t;
  const z = segment.a.z + dz * t;
  return { x, z, distance: Math.hypot(point.x - x, point.z - z) };
}

function smoothstep(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function darknessAtMinute(minute) {
  if (minute >= 19 * 60 + 15 || minute < 5 * 60 + 30) return 1;
  if (minute >= 17 * 60 + 15) return smoothstep((minute - (17 * 60 + 15)) / (2 * 60));
  if (minute < 6 * 60 + 30) return 1 - smoothstep((minute - (5 * 60 + 30)) / 60);
  return 0;
}

function textureFromCanvas(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  if ('colorSpace' in texture && THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function lampDecalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 250);
  gradient.addColorStop(0, 'rgba(255, 221, 152, 0.46)');
  gradient.addColorStop(0.2, 'rgba(255, 187, 84, 0.31)');
  gradient.addColorStop(0.52, 'rgba(242, 137, 42, 0.13)');
  gradient.addColorStop(0.82, 'rgba(198, 83, 22, 0.03)');
  gradient.addColorStop(1, 'rgba(140, 46, 10, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 512);
  return textureFromCanvas(canvas);
}

function streetContaminationTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  const image = context.createImageData(canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += 1) {
    const across = 1 - Math.abs(((y + 0.5) / canvas.height) * 2 - 1);
    const acrossAlpha = 0.16 + Math.pow(across, 0.72) * 0.84;
    for (let x = 0; x < canvas.width; x += 1) {
      const along = Math.min((x + 0.5) / (canvas.width * 0.12), (canvas.width - x - 0.5) / (canvas.width * 0.12), 1);
      const alpha = smoothstep(along) * acrossAlpha;
      const index = (y * canvas.width + x) * 4;
      image.data[index] = 255;
      image.data[index + 1] = 159;
      image.data[index + 2] = 62;
      image.data[index + 3] = Math.round(alpha * 255);
    }
  }
  context.putImageData(image, 0, 0);
  return textureFromCanvas(canvas);
}

function segmentLighting(points, segments) {
  const counts = Array.from({ length: segments.length }, () => 0);
  points.forEach((point) => {
    let bestIndex = -1;
    let bestDistance = Infinity;
    segments.forEach((segment, index) => {
      const hit = nearestPointOnSegment(point, segment);
      if (hit.distance < bestDistance) {
        bestDistance = hit.distance;
        bestIndex = index;
      }
    });
    if (bestIndex >= 0) counts[bestIndex] += 1;
  });
  const scores = segments.map((segment, index) => {
    const length = Math.max(0.25, Math.hypot(segment.b.x - segment.a.x, segment.b.z - segment.a.z));
    return counts[index] + (counts[index] / length) * 0.65;
  });
  const maximum = Math.max(1, ...scores);
  return {
    counts,
    brightness: scores.map((score) => score > 0 ? 0.42 + Math.sqrt(score / maximum) * 0.58 : 0),
  };
}

function createLampDecals(points) {
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({
    map: lampDecalTexture(),
    color: 0xffffff,
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const decals = new THREE.InstancedMesh(geometry, material, points.length);
  const matrix = new THREE.Matrix4();
  const rotation = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  points.forEach((point, index) => {
    const variation = 0.9 + ((index * 37) % 17) / 100;
    scale.set(0.82 * variation, 1, 0.72 * variation);
    matrix.compose(new THREE.Vector3(point.x, 0.048, point.z), rotation, scale);
    decals.setMatrixAt(index, matrix);
  });
  decals.instanceMatrix.needsUpdate = true;
  decals.computeBoundingSphere?.();
  decals.renderOrder = 2;
  decals.userData.streetLampDecals = true;
  return decals;
}

function createStreetRibbons(segments, lighting) {
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({
    map: streetContaminationTexture(),
    color: 0xffffff,
    vertexColors: true,
    transparent: true,
    opacity: 0.34,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const ribbons = new THREE.InstancedMesh(geometry, material, segments.length);
  const matrix = new THREE.Matrix4();
  const rotation = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const color = new THREE.Color();
  segments.forEach((segment, index) => {
    const dx = segment.b.x - segment.a.x;
    const dz = segment.b.z - segment.a.z;
    const length = Math.max(0.001, Math.hypot(dx, dz));
    const intensity = lighting.brightness[index] || 0;
    rotation.setFromAxisAngle(up, -Math.atan2(dz, dx));
    scale.set(length + 0.18, 1, intensity ? Math.max(0.42, Number(segment.widthWorld || 0.22) + 0.54) : 0);
    matrix.compose(new THREE.Vector3((segment.a.x + segment.b.x) / 2, 0.045, (segment.a.z + segment.b.z) / 2), rotation, scale);
    ribbons.setMatrixAt(index, matrix);
    color.setRGB(1 * intensity, 0.47 * intensity, 0.16 * intensity);
    ribbons.setColorAt(index, color);
  });
  ribbons.instanceMatrix.needsUpdate = true;
  if (ribbons.instanceColor) ribbons.instanceColor.needsUpdate = true;
  ribbons.computeBoundingSphere?.();
  ribbons.renderOrder = 1;
  ribbons.userData.streetContamination = true;
  return ribbons;
}

function stableHash(value) {
  let hash = 2166136261;
  const text = String(value || '');
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function facadeLayout(id) {
  const variant = Math.floor(stableHash(id + ':facade-layout') * 6);
  return [
    { name: 'regular', widthScale: 1, heightScale: 1, gapScale: 1, groupSize: 0 },
    { name: 'tall', widthScale: 0.76, heightScale: 1.18, gapScale: 0.92, groupSize: 0 },
    { name: 'broad', widthScale: 1.32, heightScale: 0.82, gapScale: 1.12, groupSize: 0 },
    { name: 'paired', widthScale: 0.9, heightScale: 1.08, gapScale: 0.88, groupSize: 2 },
    { name: 'triple-bay', widthScale: 0.82, heightScale: 1.13, gapScale: 0.82, groupSize: 3 },
    { name: 'horizontal-band', widthScale: 1.48, heightScale: 0.74, gapScale: 0.96, groupSize: 0 },
  ][variant];
}

function organizedColumnPositions(columns, groupSize) {
  if (!groupSize || columns < groupSize + 1) {
    return Array.from({ length: columns }, (_, index) => (index + 1) / (columns + 1));
  }
  // Vary spacing between orderly pairs/triples rather than deleting random
  // panes. Every floor retains the same architectural rhythm.
  const intervals = [1.1];
  for (let index = 1; index < columns; index += 1) {
    intervals.push(index % groupSize === 0 ? 1.85 : 0.68);
  }
  intervals.push(1.1);
  const total = intervals.reduce((sum, value) => sum + value, 0);
  let cursor = intervals[0];
  return Array.from({ length: columns }, (_, index) => {
    const position = cursor / total;
    cursor += intervals[index + 1];
    return position;
  });
}

function openingStyle(building) {
  const parcel = building.parcel || {};
  const category = String(parcel.category || '').toLowerCase();
  const subtype = String(parcel.subtype || parcel.kind || '').toLowerCase();
  const identity = [
    parcel.businessName,
    parcel.mainBuildingName,
    parcel.displayName,
    parcel.locationName,
    subtype,
  ].filter(Boolean).join(' ').toLowerCase();
  if (category === 'industrial' || /warehouse|factory|heavy industry|workshop/.test(subtype)) {
    return { industrial: true };
  }

  let style = {
    paneWidth: 0.13,
    paneHeight: 0.1,
    gap: 0.1,
    litChance: 0.24,
    storefront: false,
    storefrontLitChance: 0,
    floorFill: 0.5,
    widthFill: 0.72,
  };
  if (category === 'residential') {
    if (/apartment|condo|hotel/.test(subtype)) {
      style = { ...style, paneWidth: 0.14, paneHeight: 0.24, gap: 0.06, litChance: /hotel/.test(subtype) ? 0.43 : 0.34, floorFill: 0.64, widthFill: 0.84 };
    } else {
      style = { ...style, paneWidth: 0.19, paneHeight: 0.12, gap: 0.11, litChance: 0.38, floorFill: 0.52, widthFill: 0.82 };
    }
  } else if (category === 'commercial') {
    if (/hotel/.test(subtype)) {
      style = { ...style, paneWidth: 0.14, paneHeight: 0.24, gap: 0.06, litChance: 0.43, storefront: true, storefrontLitChance: 0.78, floorFill: 0.64, widthFill: 0.84 };
    } else if (/office/.test(subtype)) {
      style = { ...style, paneWidth: 0.15, paneHeight: 0.26, gap: 0.055, litChance: 0.11, storefront: true, storefrontLitChance: 0.18, floorFill: 0.68, widthFill: 0.86 };
    } else {
      const bar = /bar|club/.test(identity);
      const restaurant = /restaurant|diner|cafe/.test(identity);
      style = {
        ...style,
        paneWidth: 0.18,
        paneHeight: 0.11,
        gap: 0.11,
        litChance: bar ? 0.42 : restaurant ? 0.31 : 0.2,
        storefront: true,
        storefrontLitChance: bar ? 0.88 : restaurant ? 0.74 : /shopping/.test(subtype) ? 0.56 : 0.4,
      };
    }
  } else if (category === 'civic') {
    const alwaysStaffed = /hospital|clinic|police/.test(subtype);
    style = {
      ...style,
      paneWidth: 0.17,
      paneHeight: 0.11,
      gap: 0.09,
      litChance: /hospital/.test(subtype) ? 0.52 : /clinic/.test(subtype) ? 0.42 : /police/.test(subtype) ? 0.62 : /bank/.test(subtype) ? 0.09 : /school/.test(subtype) ? 0.035 : 0.08,
      storefront: alwaysStaffed,
      storefrontLitChance: alwaysStaffed ? 0.64 : 0,
      floorFill: /hospital|police/.test(subtype) ? 0.6 : 0.5,
      widthFill: 0.78,
    };
  }
  if (/bakery|pharmacy|drugstore|theater|cinema/.test(identity)) {
    style.storefront = true;
    style.storefrontLitChance = Math.max(style.storefrontLitChance, 0.9);
  }
  const inactive = parcel.isActive === false
    || parcel.isInactive === true
    || String(parcel.operationalState || parcel.status || '').toLowerCase() === 'inactive';
  if (inactive) {
    style.litChance = 0;
    style.storefrontLitChance = 0;
  }
  return style;
}

function streetFacingEdge(footprint, segments) {
  let nearest = null;
  for (let edgeIndex = 0; edgeIndex < footprint.length; edgeIndex += 1) {
    const a = footprint[edgeIndex];
    const b = footprint[(edgeIndex + 1) % footprint.length];
    const midpoint = { x: (a.x + b.x) / 2, z: (a.y + b.y) / 2 };
    segments.forEach((segment) => {
      const hit = nearestPointOnSegment(midpoint, segment);
      if (!nearest || hit.distance < nearest.distance) nearest = { edgeIndex, distance: hit.distance };
    });
  }
  return nearest?.edgeIndex ?? 0;
}

function pushFacadeQuad(positions, building, a, b, along, width, yCenter, height, offset = 0.012, expansion = 0) {
  const dx = b.x - a.x;
  const dz = b.y - a.y;
  const edgeLength = Math.max(0.001, Math.hypot(dx, dz));
  const ux = dx / edgeLength;
  const uz = dz / edgeLength;
  const centerX = a.x + dx * along;
  const centerZ = a.y + dz * along;
  let nx = centerX - Number(building.center?.x || 0);
  let nz = centerZ - Number(building.center?.y || 0);
  const normalLength = Math.max(0.001, Math.hypot(nx, nz));
  nx /= normalLength;
  nz /= normalLength;
  const halfWidth = width * 0.5 + expansion;
  const halfHeight = height * 0.5 + expansion;
  const leftX = centerX - ux * halfWidth + nx * offset;
  const leftZ = centerZ - uz * halfWidth + nz * offset;
  const rightX = centerX + ux * halfWidth + nx * offset;
  const rightZ = centerZ + uz * halfWidth + nz * offset;
  const bottom = Math.max(0.058, yCenter - halfHeight);
  const top = yCenter + halfHeight;
  positions.push(
    leftX, bottom, leftZ, rightX, bottom, rightZ, rightX, top, rightZ,
    leftX, bottom, leftZ, rightX, top, rightZ, leftX, top, leftZ,
  );
}

function pushColoredFacadeQuad(positions, colors, color, building, a, b, along, width, yCenter, height, offset = 0.012, expansion = 0) {
  pushFacadeQuad(positions, building, a, b, along, width, yCenter, height, offset, expansion);
  for (let vertex = 0; vertex < 6; vertex += 1) colors.push(color.r, color.g, color.b);
}

function buildingFacadeColors(building) {
  const material = Array.isArray(building.mesh?.material) ? building.mesh.material[0] : building.mesh?.material;
  const source = building.mesh?.userData?.originalColor
    ?? building.mesh?.userData?.activeColor
    ?? material?.color?.getHex?.()
    ?? 0x7b7669;
  const wall = new THREE.Color(source);
  return {
    frame: wall.clone().multiplyScalar(0.1).lerp(new THREE.Color(0x0e0c0a), 0.68),
    pane: wall.clone().multiplyScalar(0.62).lerp(new THREE.Color(0x27333b), 0.28),
    storefront: wall.clone().multiplyScalar(0.7).lerp(new THREE.Color(0x32434c), 0.34),
    door: wall.clone().multiplyScalar(0.54).lerp(new THREE.Color(0x3a2d20), 0.22),
    garage: wall.clone().multiplyScalar(0.68).lerp(new THREE.Color(0x45484a), 0.22),
  };
}

function entryPlacement(building, footprint, fallbackEdgeIndex) {
  const edgeIndex = Number.isInteger(building.entryEdgeIndex)
    ? Math.max(0, Math.min(footprint.length - 1, building.entryEdgeIndex))
    : fallbackEdgeIndex;
  const a = footprint[edgeIndex];
  const b = footprint[(edgeIndex + 1) % footprint.length];
  const dx = b.x - a.x;
  const dz = b.y - a.y;
  const lengthSquared = Math.max(0.001, dx * dx + dz * dz);
  const point = building.entryPoint || { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const along = Math.max(0.08, Math.min(0.92, ((point.x - a.x) * dx + (point.y - a.y) * dz) / lengthSquared));
  return { edgeIndex, a, b, along, edgeLength: Math.sqrt(lengthSquared) };
}

function meshFromPositions(positions, material, marker, renderOrder, colors = null) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  if (colors?.length) geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = renderOrder;
  mesh.userData[marker] = true;
  return mesh;
}

function scheduledWindowMaterial(color, opacity, additive = false) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      minuteOfDay: { value: 720 },
      lightColor: { value: new THREE.Color(color) },
      lightOpacity: { value: opacity },
    },
    vertexShader: `
      attribute float lightOnMinute;
      attribute float lightOffMinute;
      attribute float lightOvernight;
      attribute float lightNightSeed;
      attribute float lightBrightness;
      varying float vLightOnMinute;
      varying float vLightOffMinute;
      varying float vLightOvernight;
      varying float vLightNightSeed;
      varying float vLightBrightness;
      void main() {
        vLightOnMinute = lightOnMinute;
        vLightOffMinute = lightOffMinute;
        vLightOvernight = lightOvernight;
        vLightNightSeed = lightNightSeed;
        vLightBrightness = lightBrightness;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float minuteOfDay;
      uniform vec3 lightColor;
      uniform float lightOpacity;
      varying float vLightOnMinute;
      varying float vLightOffMinute;
      varying float vLightOvernight;
      varying float vLightNightSeed;
      varying float vLightBrightness;
      void main() {
        float evening = step(vLightOnMinute, minuteOfDay) * (1.0 - step(vLightOffMinute, minuteOfDay));
        float nightTimeline = minuteOfDay < 420.0 ? minuteOfDay + 1440.0 : minuteOfDay;
        float nightStart = 1380.0 + vLightNightSeed * 60.0;
        float nightEnd = 1800.0 + vLightNightSeed * 30.0;
        float lateProgress = clamp((nightTimeline - 1440.0) / 360.0, 0.0, 1.0);
        float targetShare = mix(0.04, 0.01, lateProgress) / 0.14;
        float rollingSlot = floor((nightTimeline + vLightNightSeed * 24.0) / 24.0);
        float rollingRandom = fract(sin(vLightNightSeed * 127.1 + rollingSlot * 311.7) * 43758.5453);
        float overnight = vLightOvernight
          * step(nightStart, nightTimeline)
          * (1.0 - step(nightEnd, nightTimeline))
          * step(rollingRandom, targetShare);
        if (max(evening, overnight) < 0.5) discard;
        gl_FragColor = vec4(lightColor * vLightBrightness, lightOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    toneMapped: false,
  });
  material.userData.scheduledWindowMaterial = true;
  return material;
}

function attachWindowScheduleAttributes(geometry, schedule) {
  geometry.setAttribute('lightOnMinute', new THREE.Float32BufferAttribute(schedule.on, 1));
  geometry.setAttribute('lightOffMinute', new THREE.Float32BufferAttribute(schedule.off, 1));
  geometry.setAttribute('lightOvernight', new THREE.Float32BufferAttribute(schedule.overnight, 1));
  geometry.setAttribute('lightNightSeed', new THREE.Float32BufferAttribute(schedule.nightSeed, 1));
  geometry.setAttribute('lightBrightness', new THREE.Float32BufferAttribute(schedule.brightness, 1));
}

function createBuildingWindows(buildingMap, segments) {
  const group = new THREE.Group();
  group.userData.streetBuildingWindows = true;
  const framePositions = [];
  const frameColors = [];
  const panePositions = [];
  const paneColors = [];
  const doorFramePositions = [];
  const doorFrameColors = [];
  const doorPositions = [];
  const doorColors = [];
  const litPositions = [];
  const glowPositions = [];
  const litSchedule = { on: [], off: [], overnight: [], nightSeed: [], brightness: [] };
  const glowSchedule = { on: [], off: [], overnight: [], nightSeed: [], brightness: [] };
  const activeCountEvents = new Int32Array(1442);
  let windowCount = 0;
  let litWindowCount = 0;
  let overnightCandidateCount = 0;
  let storefrontCount = 0;
  let doorCount = 0;
  let doubleDoorCount = 0;
  let garageDoorCount = 0;

  const addScheduledLight = (building, a, b, along, width, yCenter, height, key, chance, bias = 'interior') => {
    const overnight = stableHash(key + ':overnight-candidate') < 0.14;
    const evening = stableHash(key + ':evening-lit') < chance;
    if (!evening && !overnight) return;
    const onRange = bias === 'late'
      ? [18 * 60 + 35, 20 * 60 + 15]
      : bias === 'storefront'
        ? [17 * 60 + 10, 19 * 60 + 20]
        : [17 * 60 + 35, 19 * 60 + 45];
    const offRange = bias === 'late'
      ? [22 * 60 + 30, 24 * 60]
      : bias === 'storefront'
        ? [21 * 60, 23 * 60 + 40]
        : [21 * 60 + 20, 23 * 60 + 55];
    const onMinute = evening
      ? onRange[0] + stableHash(key + ':on-minute') * (onRange[1] - onRange[0])
      : 2000;
    const offMinute = evening
      ? Math.max(onMinute + 45, offRange[0] + stableHash(key + ':off-minute') * (offRange[1] - offRange[0]))
      : 2001;
    const nightSeed = stableHash(key + ':night-seed');
    const brightness = 0.82 + stableHash(key + ':brightness') * 0.38;
    const appendSchedule = (target) => {
      for (let vertex = 0; vertex < 6; vertex += 1) {
        target.on.push(onMinute);
        target.off.push(offMinute);
        target.overnight.push(overnight ? 1 : 0);
        target.nightSeed.push(nightSeed);
        target.brightness.push(brightness);
      }
    };
    pushFacadeQuad(litPositions, building, a, b, along, width, yCenter, height, 0.017);
    pushFacadeQuad(glowPositions, building, a, b, along, width, yCenter, height, 0.019, 0.016);
    appendSchedule(litSchedule);
    appendSchedule(glowSchedule);
    if (evening) {
      activeCountEvents[Math.max(0, Math.min(1440, Math.ceil(onMinute)))] += 1;
      activeCountEvents[Math.max(0, Math.min(1441, Math.ceil(offMinute)))] -= 1;
    }
    if (overnight) {
      overnightCandidateCount += 1;
    }
    litWindowCount += 1;
  };

  buildingMap?.forEach((building) => {
    const footprint = building.worldFootprint || [];
    const parcel = building.parcel || {};
    const style = openingStyle(building);
    if (!style || footprint.length < 2 || !building.center || parcel.isFamilyEstate) return;
    const id = String(parcel.id || 'building');
    const facade = facadeLayout(id);
    const subtype = String(parcel.subtype || parcel.kind || '').toLowerCase();
    const category = String(parcel.category || '').toLowerCase();
    const facadeColors = buildingFacadeColors(building);
    const frontEdgeIndex = streetFacingEdge(footprint, segments);
    const entry = entryPlacement(building, footprint, frontEdgeIndex);

    const addDoor = (width, height, doubleDoor = false, along = entry.along, color = facadeColors.door) => {
      pushColoredFacadeQuad(doorFramePositions, doorFrameColors, facadeColors.frame, building, entry.a, entry.b, along, width, 0.06 + height * 0.5, height, 0.011, 0.018);
      pushColoredFacadeQuad(doorPositions, doorColors, color, building, entry.a, entry.b, along, width, 0.06 + height * 0.5, height, 0.014);
      if (doubleDoor) {
        pushColoredFacadeQuad(doorFramePositions, doorFrameColors, facadeColors.frame, building, entry.a, entry.b, along, 0.012, 0.06 + height * 0.5, height * 0.94, 0.017);
        doubleDoorCount += 1;
        doorCount += 2;
      } else {
        doorCount += 1;
      }
    };

    if (style.industrial) {
      const garageWidth = Math.max(0.34, Math.min(0.9, entry.edgeLength * (/heavy|factory|warehouse/.test(subtype) ? 0.42 : 0.34)));
      const garageHeight = Math.max(0.3, Math.min(0.52, Number(building.height || 0.7) * 0.48));
      addDoor(garageWidth, garageHeight, false, entry.along, facadeColors.garage);
      for (let panel = 1; panel <= 3; panel += 1) {
        pushColoredFacadeQuad(
          doorFramePositions,
          doorFrameColors,
          facadeColors.frame,
          building,
          entry.a,
          entry.b,
          entry.along,
          garageWidth * 0.92,
          0.06 + garageHeight * panel / 4,
          0.012,
          0.017,
        );
      }
      const serviceOffset = (garageWidth * 0.5 + 0.14) / Math.max(0.3, entry.edgeLength);
      const serviceAlong = Math.max(0.08, Math.min(0.92, entry.along + (entry.along < 0.56 ? serviceOffset : -serviceOffset)));
      addDoor(0.13, 0.28, false, serviceAlong, facadeColors.door);
      garageDoorCount += 1;
      return;
    }

    const identity = [parcel.businessName, parcel.mainBuildingName, parcel.displayName, subtype].filter(Boolean).join(' ').toLowerCase();
    const doubleDoor = /hotel|apartment|condo|office|hospital|clinic|police|bank|restaurant|bar|club|shopping/.test(identity)
      || stableHash(id + ':double-door') < 0.24;
    const doorWidth = doubleDoor ? 0.24 : 0.13;
    const doorHeight = /hotel|office|hospital|police|bank/.test(identity) ? 0.34 : 0.29;
    addDoor(doorWidth, doorHeight, doubleDoor);

    const addStorePane = (along, width, height, yCenter, key) => {
      pushColoredFacadeQuad(framePositions, frameColors, facadeColors.frame, building, entry.a, entry.b, along, width, yCenter, height, 0.011, 0.018);
      pushColoredFacadeQuad(panePositions, paneColors, facadeColors.storefront, building, entry.a, entry.b, along, width, yCenter, height, 0.014);
      addScheduledLight(
        building,
        entry.a,
        entry.b,
        along,
        width,
        yCenter,
        height,
        key,
        style.storefrontLitChance,
        /bar|club|restaurant/.test(identity) ? 'late' : 'storefront',
      );
      storefrontCount += 1;
      windowCount += 1;
    };

    if (style.storefront) {
      const margin = Math.min(0.08, 0.04 / Math.max(0.3, entry.edgeLength));
      const doorHalf = doorWidth * 0.5 / Math.max(0.3, entry.edgeLength);
      const leftStart = margin;
      const leftEnd = Math.max(leftStart, entry.along - doorHalf - margin);
      const rightStart = Math.min(1 - margin, entry.along + doorHalf + margin);
      const rightEnd = 1 - margin;
      const template = Math.floor(stableHash(id + ':storefront-template') * 4);
      const addSection = (start, end, count, height, yCenter, widthFill, keyPrefix) => {
        const span = Math.max(0, end - start);
        if (span * entry.edgeLength < 0.13) return;
        for (let index = 0; index < count; index += 1) {
          const along = start + span * ((index + 0.5) / count);
          const width = Math.max(0.1, Math.min(0.48, span * entry.edgeLength / count * widthFill));
          addStorePane(along, width, height, yCenter, id + ':' + keyPrefix + ':' + index);
        }
      };
      if (template === 0) {
        addSection(leftStart, leftEnd, 1, 0.3, 0.23, 0.86, 'store-left-wide');
        addSection(rightStart, rightEnd, 1, 0.3, 0.23, 0.86, 'store-right-wide');
      } else if (template === 1) {
        addSection(leftStart, leftEnd, 1, 0.18, 0.24, 0.9, 'store-left-long');
        addSection(rightStart, rightEnd, 2, 0.31, 0.235, 0.72, 'store-right-tall');
      } else if (template === 2) {
        addSection(leftStart, leftEnd, 2, 0.31, 0.235, 0.7, 'store-left-pair');
        addSection(rightStart, rightEnd, 2, 0.31, 0.235, 0.7, 'store-right-pair');
      } else {
        addSection(leftStart, leftEnd, 2, 0.24, 0.22, 0.74, 'store-left-medium');
        addSection(rightStart, rightEnd, 1, 0.28, 0.225, 0.88, 'store-right-bay');
      }
    }

    const requestedFloors = Number(parcel.visualProfile?.floors || Math.round(Number(building.height || 0.65) / 0.5));
    const floors = Math.max(1, Math.min(12, requestedFloors || 1));
    const buildingHeight = Math.max(0.42, Number(building.height || 0.65));
    const floorStep = Math.max(0.16, (buildingHeight - 0.1) / floors);

    footprint.forEach((a, edgeIndex) => {
      const b = footprint[(edgeIndex + 1) % footprint.length];
      const edgeLength = Math.hypot(b.x - a.x, b.y - a.y);
      if (edgeLength < 0.2) return;
      const hasStorefront = style.storefront && edgeIndex === entry.edgeIndex;
      // Storefront glass owns the entire ground-floor frontage, including on
      // one-storey shops. Regular windows start above it and cannot overlap.
      const firstFloor = hasStorefront ? 1 : 0;
      for (let floor = firstFloor; floor < floors; floor += 1) {
        const hierarchyScale = floors > 2 && facade.name === 'triple-bay' && floor === floors - 1
          ? 0.78
          : floors > 3 && facade.name === 'regular' && floor === 0
            ? 1.12
            : 1;
        const paneHeight = Math.max(0.065, Math.min(style.paneHeight * facade.heightScale * hierarchyScale, floorStep * style.floorFill));
        const available = Math.max(0, edgeLength - 0.12);
        // Columns scale with facade length. This keeps the same visual cadence
        // on large buildings instead of stretching a fixed handful of windows.
        const targetPaneWidth = style.paneWidth * facade.widthScale;
        const targetGap = style.gap * facade.gapScale;
        const columns = Math.max(1, Math.min(28, Math.floor(available / Math.max(0.13, targetPaneWidth + targetGap))));
        if (!columns || available < 0.08) continue;
        const columnPositions = organizedColumnPositions(columns, facade.groupSize);
        const closestColumnSpacing = columns > 1
          ? Math.min(...columnPositions.slice(1).map((position, index) => (position - columnPositions[index]) * edgeLength))
          : edgeLength * 0.72;
        for (let column = 0; column < columns; column += 1) {
          const key = id + ':' + edgeIndex + ':' + floor + ':' + column;
          const along = columnPositions[column];
          let width = Math.max(0.082, Math.min(targetPaneWidth, edgeLength / (columns + 1) * style.widthFill, closestColumnSpacing * 0.72));
          // Avoid accidental square panes: houses get broad windows while tall
          // commercial and apartment windows remain distinctly vertical.
          if (Math.abs(width - paneHeight) < 0.035) {
            width = Math.min(edgeLength / (columns + 1) * 0.9, width * 1.24);
          }
          if (floor === 0 && edgeIndex === entry.edgeIndex) {
            const clearance = doorWidth * 0.5 + width * 0.5 + 0.045;
            if (Math.abs(along - entry.along) * edgeLength < clearance) continue;
          }
          const yCenter = 0.08 + floorStep * (floor + 0.52);
          pushColoredFacadeQuad(framePositions, frameColors, facadeColors.frame, building, a, b, along, width, yCenter, paneHeight, 0.011, 0.012);
          pushColoredFacadeQuad(panePositions, paneColors, facadeColors.pane, building, a, b, along, width, yCenter, paneHeight, 0.014);
          addScheduledLight(
            building,
            a,
            b,
            along,
            width,
            yCenter,
            paneHeight,
            key,
            style.litChance,
            /hotel|bar|club/.test(identity) ? 'late' : 'interior',
          );
          windowCount += 1;
        }
      }
    });
  });

  const frame = meshFromPositions(framePositions, new THREE.MeshLambertMaterial({
    color: 0xffffff,
    vertexColors: true,
    side: THREE.DoubleSide,
    depthWrite: true,
  }), 'streetWindowFrames', 3, frameColors);
  const panes = meshFromPositions(panePositions, new THREE.MeshPhongMaterial({
    color: 0xffffff,
    vertexColors: true,
    emissive: 0x020507,
    emissiveIntensity: 0.16,
    shininess: 54,
    side: THREE.DoubleSide,
    depthWrite: true,
  }), 'streetBuildingWindows', 4, paneColors);
  const doorFrames = meshFromPositions(doorFramePositions, new THREE.MeshLambertMaterial({
    color: 0xffffff,
    vertexColors: true,
    side: THREE.DoubleSide,
    depthWrite: true,
  }), 'streetDoorFrames', 4, doorFrameColors);
  const doors = meshFromPositions(doorPositions, new THREE.MeshPhongMaterial({
    color: 0xffffff,
    vertexColors: true,
    shininess: 18,
    side: THREE.DoubleSide,
    depthWrite: true,
  }), 'streetBuildingDoors', 5, doorColors);
  const lit = meshFromPositions(litPositions, scheduledWindowMaterial(0xf0c86f, 0.9), 'streetLitWindows', 6);
  const glow = meshFromPositions(glowPositions, scheduledWindowMaterial(0xc78b3f, 0.14, true), 'streetWindowGlow', 5);
  attachWindowScheduleAttributes(lit.geometry, litSchedule);
  attachWindowScheduleAttributes(glow.geometry, glowSchedule);
  lit.name = 'street-lit-windows-scheduled';
  glow.name = 'street-window-glow-scheduled';
  const activeCounts = new Int32Array(1440);
  let activeCount = 0;
  for (let minute = 0; minute < activeCounts.length; minute += 1) {
    activeCount += activeCountEvents[minute];
    activeCounts[minute] = activeCount;
  }
  const overnightWindowCount = Math.round(windowCount * 0.04);
  group.add(glow, lit);
  group.add(frame, panes, doorFrames, doors);
  return {
    group,
    frame,
    panes,
    doorFrames,
    doors,
    lit,
    glow,
    activeCounts,
    stats: { windowCount, litWindowCount, overnightWindowCount, overnightCandidateCount, storefrontCount, doorCount, doubleDoorCount, garageDoorCount },
  };
}

export function createStreetAtmosphere({ points = [], segments = [], buildingMap = null } = {}) {
  const group = new THREE.Group();
  group.userData.streetAtmosphere = true;
  const lighting = segmentLighting(points, segments);
  const decals = createLampDecals(points);
  const ribbons = createStreetRibbons(segments, lighting);
  const windows = createBuildingWindows(buildingMap, segments);
  group.add(ribbons, decals, windows.group);
  decals.visible = false;
  ribbons.visible = false;
  const setPhase = (timePhase) => {
    const normalized = ((Number(timePhase || 0) % 1) + 1) % 1;
    const minute = normalized * 24 * 60;
    const darkness = darknessAtMinute(minute);
    decals.visible = darkness > 0.005;
    ribbons.visible = darkness > 0.005;
    decals.material.opacity = 0.78 * darkness;
    ribbons.material.opacity = 0.34 * darkness;
    windows.lit.material.uniforms.minuteOfDay.value = minute;
    windows.glow.material.uniforms.minuteOfDay.value = minute;
    const minuteIndex = Math.floor(minute) % 1440;
    const nightTimeline = minute < 420 ? minute + 1440 : minute;
    const nightStartShare = Math.max(0, Math.min(1, (nightTimeline - 1380) / 60));
    const nightEndShare = 1 - Math.max(0, Math.min(1, (nightTimeline - 1800) / 30));
    const lateProgress = Math.max(0, Math.min(1, (nightTimeline - 1440) / 360));
    const rollingNightCount = Math.round(windows.stats.windowCount * (0.04 - lateProgress * 0.03) * nightStartShare * nightEndShare);
    const activeWindowCount = (windows.activeCounts[minuteIndex] || 0) + rollingNightCount;
    group.userData.darkness = darkness;
    group.userData.activeWindowCount = activeWindowCount;
    group.userData.minute = minute;
    return darkness;
  };
  return {
    group,
    decals,
    ribbons,
    windows,
    setPhase,
    stats: {
      decalCount: points.length,
      contaminatedStreetCount: lighting.counts.filter((count) => count > 0).length,
      windowCount: windows.stats.windowCount,
      litWindowCount: windows.stats.litWindowCount,
      overnightWindowCount: windows.stats.overnightWindowCount,
      storefrontCount: windows.stats.storefrontCount,
      doorCount: windows.stats.doorCount,
      doubleDoorCount: windows.stats.doubleDoorCount,
      garageDoorCount: windows.stats.garageDoorCount,
      maxLampsPerStreet: Math.max(0, ...lighting.counts),
    },
  };
}
