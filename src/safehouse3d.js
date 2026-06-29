import * as THREE from '/node_modules/three/build/three.module.js';
import { getRadioVolume, isRadioPlaying, primeRadio, setRadioVolume, startJazz, stopJazz, toggleRadio } from './safehouse3d/core/radio.js';

let active = null;

function disposeObject(root) {
  root?.traverse((object) => {
    object.geometry?.dispose?.();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.filter(Boolean).forEach((item) => item.dispose?.());
  });
}

function cleanup(root) {
  const entry = active;
  if (!entry || (root && entry.root !== root)) return;
  cancelAnimationFrame(entry.springFrame);
  cancelAnimationFrame(entry.fpsFrame);
  clearInterval(entry.fpsTimer);
  window.removeEventListener('resize', entry.resize);
  entry.root.removeEventListener('wheel', entry.wheel);
  entry.root.removeEventListener('pointerdown', entry.pointerDown);
  entry.root.removeEventListener('pointermove', entry.pointerMove);
  entry.root.removeEventListener('pointerup', entry.pointerUp);
  entry.root.removeEventListener('pointercancel', entry.pointerUp);
  entry.root.removeEventListener('pointerleave', entry.pointerLeave);
  entry.root.removeEventListener('contextmenu', entry.contextMenu);
  disposeObject(entry.scene);
  entry.renderer.dispose();
  stopJazz();
  active = null;
}

function material(color, roughness = 0.82, metalness = 0.04) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, flatShading: true });
}

function box(parent, size, position, mat, rotationY = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), mat);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.y = rotationY;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent, radius, height, position, mat, rotation = null) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 12), mat);
  mesh.position.set(position[0], position[1], position[2]);
  if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function wallPanel(parent, size, position, mat, fadeAxis = '', fadeSign = 0) {
  const panelMaterial = mat.clone();
  panelMaterial.transparent = true;
  const panel = box(parent, size, position, panelMaterial);
  panel.userData.wallFade = fadeAxis ? { axis: fadeAxis, sign: fadeSign } : null;
  return panel;
}

function addFloorLamp(scene, position, lightingRig, height = 2.45) {
  const brass = material(0x8b7140, 0.34, 0.42);
  const shade = material(0xc9aa6b, 0.72);
  cylinder(scene, 0.34, 0.12, [position[0], 0.18, position[2]], brass);
  cylinder(scene, 0.055, height - 0.3, [position[0], height / 2, position[2]], brass);
  const shadeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.55, 0.58, 12, 1, true), shade);
  shadeMesh.position.set(position[0], height, position[2]);
  shadeMesh.castShadow = false;
  scene.add(shadeMesh);
  const bulb = new THREE.PointLight(0xffbd72, 0, 9, 1.8);
  bulb.position.set(position[0], height - 0.18, position[2]);
  bulb.castShadow = false;
  scene.add(bulb);
  lightingRig.lamps.push({ light: bulb, shade: shadeMesh, scale: 1 });
}

function addWallLamp(scene, position, axis, lightingRig) {
  const brass = material(0x8b7140, 0.34, 0.42);
  const shade = material(0xd0ad70, 0.76);
  const plaqueSize = axis === 'z' ? [0.46, 0.64, 0.12] : [0.12, 0.64, 0.46];
  box(scene, plaqueSize, position, brass);
  const inward = axis === 'z' ? new THREE.Vector3(0, 0, 0.42) : new THREE.Vector3(-0.42, 0, 0);
  cylinder(scene, 0.045, 0.52, [position[0] + inward.x / 2, position[1], position[2] + inward.z / 2], brass, axis === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, Math.PI / 2]);
  const shadeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.36, 0.34, 10, 1, true), shade);
  shadeMesh.position.copy(new THREE.Vector3(position[0], position[1] - 0.12, position[2]).add(inward));
  shadeMesh.rotation.z = axis === 'x' ? Math.PI / 2 : 0;
  shadeMesh.castShadow = false;
  scene.add(shadeMesh);
  const bulb = new THREE.PointLight(0xffbf74, 0, 6.5, 1.9);
  bulb.position.copy(shadeMesh.position);
  bulb.castShadow = false;
  scene.add(bulb);
  lightingRig.lamps.push({ light: bulb, shade: shadeMesh, scale: 0.72 });
}

function addWindow(scene, config, lightingRig) {
  const frame = material(0x3b2a1e);
  const paneMaterial = new THREE.MeshStandardMaterial({
    color: 0x6f8192,
    emissive: 0x6f8192,
    emissiveIntensity: 0.3,
    roughness: 0.24,
    metalness: 0.04,
  });
  const pane = box(scene, config.size, config.position, paneMaterial);
  pane.castShadow = false;
  pane.receiveShadow = false;
  const horizontal = config.axis === 'z';
  if (horizontal) {
    box(scene, [config.size[0] + 0.22, 0.12, 0.12], [config.position[0], config.position[1] + config.size[1] / 2 + 0.06, config.position[2]], frame);
    box(scene, [config.size[0] + 0.22, 0.12, 0.12], [config.position[0], config.position[1] - config.size[1] / 2 - 0.06, config.position[2]], frame);
    box(scene, [0.12, config.size[1] + 0.22, 0.12], [config.position[0] - config.size[0] / 2 - 0.06, config.position[1], config.position[2]], frame);
    box(scene, [0.12, config.size[1] + 0.22, 0.12], [config.position[0] + config.size[0] / 2 + 0.06, config.position[1], config.position[2]], frame);
  } else {
    box(scene, [0.12, 0.12, config.size[2] + 0.22], [config.position[0], config.position[1] + config.size[1] / 2 + 0.06, config.position[2]], frame);
    box(scene, [0.12, 0.12, config.size[2] + 0.22], [config.position[0], config.position[1] - config.size[1] / 2 - 0.06, config.position[2]], frame);
    box(scene, [0.12, config.size[1] + 0.22, 0.12], [config.position[0], config.position[1], config.position[2] - config.size[2] / 2 - 0.06], frame);
    box(scene, [0.12, config.size[1] + 0.22, 0.12], [config.position[0], config.position[1], config.position[2] + config.size[2] / 2 + 0.06], frame);
  }
  const curtain = material(0x683d35, 0.9);
  if (horizontal) {
    box(scene, [0.38, config.size[1] + 0.3, 0.14], [config.position[0] - config.size[0] / 2 - 0.28, config.position[1] - 0.04, config.position[2] + 0.08], curtain);
    box(scene, [0.38, config.size[1] + 0.3, 0.14], [config.position[0] + config.size[0] / 2 + 0.28, config.position[1] - 0.04, config.position[2] + 0.08], curtain);
    cylinder(scene, 0.045, config.size[0] + 1.05, [config.position[0], config.position[1] + config.size[1] / 2 + 0.23, config.position[2] + 0.12], frame, [0, 0, Math.PI / 2]);
  } else {
    box(scene, [0.14, config.size[1] + 0.3, 0.38], [config.position[0] - 0.08, config.position[1] - 0.04, config.position[2] - config.size[2] / 2 - 0.28], curtain);
    box(scene, [0.14, config.size[1] + 0.3, 0.38], [config.position[0] - 0.08, config.position[1] - 0.04, config.position[2] + config.size[2] / 2 + 0.28], curtain);
    cylinder(scene, 0.045, config.size[2] + 1.05, [config.position[0] - 0.12, config.position[1] + config.size[1] / 2 + 0.23, config.position[2]], frame, [Math.PI / 2, 0, 0]);
  }
  const sunlight = new THREE.SpotLight(0xffd39a, 0, 26, 0.66, 0.48, 1.25);
  const outside = horizontal
    ? new THREE.Vector3(config.position[0], config.position[1] + 1.2, config.position[2] - 1.8)
    : new THREE.Vector3(config.position[0] + 1.8, config.position[1] + 1.2, config.position[2]);
  sunlight.position.copy(outside);
  sunlight.target.position.copy(config.target);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(512, 512);
  sunlight.shadow.bias = -0.0015;
  sunlight.shadow.normalBias = 0.02;
  scene.add(sunlight, sunlight.target);
  lightingRig.windows.push({ pane, paneMaterial, light: sunlight, target: sunlight.target, axis: config.axis, position: config.position.slice() });
}

function addChair(scene, position, rotationY, wood, upholstery) {
  const chair = new THREE.Group();
  chair.position.set(position[0], 0, position[2]);
  chair.rotation.y = rotationY;
  scene.add(chair);
  box(chair, [0.78, 0.16, 0.72], [0, 0.72, 0], upholstery);
  box(chair, [0.78, 0.92, 0.14], [0, 1.12, 0.3], wood);
  [[-0.3, -0.26], [0.3, -0.26], [-0.3, 0.26], [0.3, 0.26]].forEach(([x, z]) => box(chair, [0.1, 0.68, 0.1], [x, 0.36, z], wood));
}

function addPlant(scene, position) {
  const pot = material(0x74452f, 0.9);
  const leaf = material(0x3f6442, 0.86);
  const planter = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.42, 0.55, 10), pot);
  planter.position.set(position[0], 0.42, position[2]);
  planter.castShadow = true;
  scene.add(planter);
  [[0, 1.08, 0], [-0.22, 0.9, 0.08], [0.22, 1.0, -0.06], [-0.1, 1.32, -0.12], [0.12, 1.28, 0.12]].forEach(([x, y, z], index) => {
    const foliage = new THREE.Mesh(new THREE.IcosahedronGeometry(index ? 0.34 : 0.42, 0), leaf);
    foliage.scale.set(0.72, 1.25, 0.72);
    foliage.position.set(position[0] + x, y, position[2] + z);
    foliage.castShadow = true;
    scene.add(foliage);
  });
}

function smoothstep(min, max, value) {
  const t = THREE.MathUtils.clamp((value - min) / Math.max(0.0001, max - min), 0, 1);
  return t * t * (3 - 2 * t);
}

function minuteForPayload(payload) {
  if (Number.isFinite(Number(payload?.timeMinuteOfDay))) return ((Number(payload.timeMinuteOfDay) % 1440) + 1440) % 1440;
  const periods = { Morning: 360, Afternoon: 720, Evening: 1080, Night: 1320 };
  return periods[payload?.timePeriod] ?? 360;
}

function lightingAtMinute(minute) {
  const hour = minute / 60;
  const sunrise = smoothstep(5.2, 7.4, hour);
  const sunset = 1 - smoothstep(17.2, 20.2, hour);
  const daylight = sunrise * sunset;
  const dawnWarmth = 1 - smoothstep(7.2, 10.5, hour);
  const duskWarmth = smoothstep(16.2, 19.2, hour);
  const warmth = Math.max(dawnWarmth * sunrise, duskWarmth * sunset);
  const lamp = THREE.MathUtils.clamp(1.18 - daylight * 1.45, 0, 1);
  const sunColor = new THREE.Color(0xd8e7ff).lerp(new THREE.Color(0xffb267), warmth * 0.78);
  const ambientColor = new THREE.Color(0x506078).lerp(new THREE.Color(0xd8c9a8), daylight);
  const sunProgress = THREE.MathUtils.clamp((hour - 5.2) / 14.8, 0, 1);
  const sunHeight = Math.sin(sunProgress * Math.PI);
  return { daylight, lamp, sunColor, ambientColor, sunProgress, sunHeight };
}

function interactive(scene, targets, info, build) {
  const group = new THREE.Group();
  group.userData.safehouseObject = info;
  scene.add(group);
  build(group);
  const meshes = [];
  group.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });
  const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xffca42, transparent: true, opacity: 0.98, depthTest: true, depthWrite: false });
  const outlines = meshes.map((mesh) => {
    mesh.userData.safehouseObject = info;
    const outline = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 18), outlineMaterial);
    outline.renderOrder = 20;
    outline.scale.setScalar(1.006);
    outline.visible = false;
    mesh.add(outline);
    return outline;
  });
  targets.push({ info, group, outlines });
  return group;
}

function furnish(scene, lightingRig) {
  const targets = [];
  const floor = material(0x584838);
  const kitchenFloor = material(0x716b5b);
  const bathFloor = material(0x77766d);
  const wall = material(0xa89a80);
  const wood = material(0x54351f);
  const darkWood = material(0x291a12);
  const cloth = material(0x485c4c);
  const blueCloth = material(0x455d68);
  const cream = material(0xd3c8ad);
  const metal = material(0x92989a, 0.38, 0.22);
  const porcelain = material(0xd7d6ca, 0.3);
  const black = material(0x171614, 0.55);
  const rug = material(0x57362c);

  // Complete apartment shell. Camera-facing panels fade only when they obstruct the rooms.
  box(scene, [14, 0.24, 10], [0, 0, 0], floor);
  box(scene, [7.5, 0.035, 3.4], [-3.15, 0.14, -3.15], kitchenFloor);
  box(scene, [3.75, 0.04, 3.25], [4.85, 0.15, -3.28], bathFloor);
  // Rear wall is built around a real kitchen window opening.
  wallPanel(scene, [1.375, 3.35, 0.24], [-6.3125, 1.6, -5], wall, 'z', -1);
  wallPanel(scene, [10.475, 3.35, 0.24], [1.7625, 1.6, -5], wall, 'z', -1);
  wallPanel(scene, [2.15, 1.51, 0.24], [-4.55, 0.755, -5], wall, 'z', -1);
  wallPanel(scene, [2.15, 0.485, 0.24], [-4.55, 3.0325, -5], wall, 'z', -1);
  wallPanel(scene, [0.24, 3.35, 10], [-7, 1.6, 0], wall, 'x', -1);
  // Right wall is likewise segmented around the bedroom window.
  wallPanel(scene, [0.24, 3.35, 6.725], [7, 1.6, -1.6375], wall, 'x', 1);
  wallPanel(scene, [0.24, 3.35, 1.225], [7, 1.6, 4.3875], wall, 'x', 1);
  wallPanel(scene, [0.24, 1.5, 2.05], [7, 0.75, 2.75], wall, 'x', 1);
  wallPanel(scene, [0.24, 0.455, 2.05], [7, 3.0475, 2.75], wall, 'x', 1);
  wallPanel(scene, [6.35, 3.35, 0.24], [-3.825, 1.6, 5], wall, 'z', 1);
  wallPanel(scene, [6.05, 3.35, 0.24], [3.975, 1.6, 5], wall, 'z', 1);

  // Bedroom wall with a generous doorway around z=1.4.
  wallPanel(scene, [0.22, 3.05, 2.8], [2.75, 1.5, 3.6], wall, 'x', 1);
  wallPanel(scene, [0.22, 3.05, 2.15], [2.75, 1.5, -0.475], wall, 'x', 1);

  // Bathroom across the rear-right. Its door now opens from the living/kitchen side.
  wallPanel(scene, [4.25, 3.05, 0.22], [4.875, 1.5, -1.55], wall, 'z', 1);
  wallPanel(scene, [0.22, 3.05, 1.6], [2.75, 1.5, -4.2], wall, 'x', 1);
  wallPanel(scene, [0.22, 3.05, 0.7], [2.75, 1.5, -1.9], wall, 'x', 1);

  addWindow(scene, {
    axis: 'z',
    size: [2.15, 1.28, 0.08],
    position: [-4.55, 2.15, -4.84],
    lightPosition: new THREE.Vector3(-4.55, 2.15, -4.52),
    target: new THREE.Vector3(-2.8, 0.35, -1.1),
  }, lightingRig);
  addWindow(scene, {
    axis: 'x',
    size: [0.08, 1.32, 2.05],
    position: [6.84, 2.16, 2.75],
    lightPosition: new THREE.Vector3(6.52, 2.16, 2.75),
    target: new THREE.Vector3(4.1, 0.35, 2.25),
  }, lightingRig);
  addWallLamp(scene, [-6.28, 2.42, -4.76], 'z', lightingRig);
  addWallLamp(scene, [1.38, 2.44, -4.76], 'z', lightingRig);
  addWallLamp(scene, [5.15, 2.42, -4.76], 'z', lightingRig);

  const bedroomDoor = new THREE.Group();
  scene.add(bedroomDoor);
  box(bedroomDoor, [1.4, 2.65, 0.16], [2.48, 1.34, 1.65], darkWood, -0.72);
  cylinder(bedroomDoor, 0.07, 0.1, [1.98, 1.36, 1.21], metal, [Math.PI / 2, 0, 0]);

  const bathroomDoor = new THREE.Group();
  scene.add(bathroomDoor);
  box(bathroomDoor, [0.16, 2.62, 1.45], [2.75, 1.34, -2.78], darkWood, 0.62);
  cylinder(bathroomDoor, 0.07, 0.1, [2.52, 1.36, -2.3], metal, [0, 0, Math.PI / 2]);
  interactive(scene, targets, { id: 'bathtub', label: 'Bathtub', action: 'bathe' }, (group) => {
    box(group, [2.05, 0.7, 1.05], [5.6, 0.48, -3.85], porcelain);
    box(group, [1.55, 0.08, 0.66], [5.6, 0.84, -3.85], metal);
    cylinder(group, 0.06, 0.4, [4.92, 1.05, -4.18], metal);
    cylinder(group, 0.08, 0.09, [4.72, 1.0, -4.18], metal, [0, 0, Math.PI / 2]);
  });
  interactive(scene, targets, { id: 'toilet', label: 'Toilet', action: 'toilet' }, (group) => {
    box(group, [0.75, 0.68, 0.72], [3.55, 0.46, -3.9], porcelain);
    cylinder(group, 0.28, 0.45, [3.55, 0.73, -3.92], porcelain);
    box(group, [0.72, 0.72, 0.3], [3.55, 1.16, -4.28], porcelain);
    box(group, [0.58, 0.08, 0.5], [3.55, 0.98, -3.9], porcelain);
  });
  interactive(scene, targets, { id: 'bathroomSink', label: 'Bathroom sink', action: 'groom' }, (group) => {
    box(group, [1.1, 0.18, 0.62], [4.05, 0.88, -1.93], porcelain);
    box(group, [0.72, 0.08, 0.38], [4.05, 0.96, -1.93], metal);
    cylinder(group, 0.12, 0.75, [4.05, 0.48, -1.93], porcelain);
    cylinder(group, 0.045, 0.3, [4.05, 1.17, -1.72], metal);
    cylinder(group, 0.055, 0.08, [3.82, 1.06, -1.72], metal);
    cylinder(group, 0.055, 0.08, [4.28, 1.06, -1.72], metal);
    box(group, [0.82, 0.78, 0.05], [4.05, 1.72, -1.59], metal);
  });

  // Bedroom: framed by walls, but the bed remains visible through its open door.
  interactive(scene, targets, { id: 'bed', label: 'Bed', action: 'sleep' }, (group) => {
    box(group, [2.15, 0.42, 3.25], [4.78, 0.43, 3.22], wood);
    box(group, [1.94, 0.35, 2.95], [4.78, 0.77, 3.09], blueCloth);
    box(group, [2.15, 1.3, 0.18], [4.78, 1.08, 4.81], darkWood);
    box(group, [0.78, 0.2, 0.72], [4.35, 1.02, 4.2], cream);
    box(group, [0.78, 0.2, 0.72], [5.2, 1.02, 4.2], cream);
    box(group, [1.92, 0.08, 1.25], [4.78, 1.0, 2.62], cream);
  });
  box(scene, [0.82, 0.76, 0.72], [6.28, 0.5, 4.16], darkWood);
  box(scene, [1.15, 1.75, 0.42], [6.3, 1.05, -0.72], darkWood);
  addFloorLamp(scene, [6.35, 0, 0.25], lightingRig, 2.18);

  // Kitchen across the rear wall.
  interactive(scene, targets, { id: 'sink', label: 'Kitchen sink', action: 'wash' }, (group) => {
    box(group, [2.0, 1.0, 1.05], [-5.7, 0.62, -4.25], wood);
    box(group, [1.28, 0.13, 0.75], [-5.7, 1.18, -4.18], metal);
    box(group, [0.12, 0.45, 0.12], [-5.7, 1.43, -4.45], metal);
    box(group, [0.82, 0.78, 0.06], [-6.16, 0.61, -3.7], darkWood);
    box(group, [0.82, 0.78, 0.06], [-5.24, 0.61, -3.7], darkWood);
    cylinder(group, 0.045, 0.12, [-5.78, 0.64, -3.64], metal, [Math.PI / 2, 0, 0]);
    cylinder(group, 0.045, 0.12, [-5.62, 0.64, -3.64], metal, [Math.PI / 2, 0, 0]);
  });
  interactive(scene, targets, { id: 'stove', label: 'Stove', action: 'cook' }, (group) => {
    box(group, [1.45, 1.12, 1.12], [-3.7, 0.68, -4.22], black);
    box(group, [1.42, 0.48, 0.16], [-3.7, 1.43, -4.68], black);
    [-4.05, -3.38].forEach((x) => [-4.48, -4.05].forEach((z) => cylinder(group, 0.2, 0.05, [x, 1.27, z], metal)));
    box(group, [1.02, 0.58, 0.06], [-3.7, 0.62, -3.63], metal);
    box(group, [0.86, 0.4, 0.04], [-3.7, 0.62, -3.58], black);
    [-4.12, -3.84, -3.56, -3.28].forEach((x) => cylinder(group, 0.065, 0.08, [x, 1.05, -3.59], metal, [Math.PI / 2, 0, 0]));
    box(group, [0.62, 0.06, 0.08], [-3.7, 0.91, -3.55], metal);
    [[-4.22, -4.62], [-3.18, -4.62], [-4.22, -3.82], [-3.18, -3.82]].forEach(([x, z]) => box(group, [0.12, 0.34, 0.12], [x, 0.18, z], darkWood));
    box(group, [1.18, 0.08, 0.08], [-3.7, 1.52, -4.57], metal);
  });
  interactive(scene, targets, { id: 'fridge', label: 'Fridge', action: 'snack' }, (group) => {
    box(group, [1.45, 2.45, 1.18], [-1.75, 1.31, -4.2], cream);
    box(group, [1.52, 0.12, 1.24], [-1.75, 2.56, -4.2], metal);
    box(group, [0.09, 0.52, 0.1], [-2.3, 1.32, -3.58], darkWood);
    box(group, [1.2, 0.045, 0.045], [-1.75, 1.62, -3.59], darkWood);
    box(group, [0.08, 0.42, 0.08], [-1.18, 1.96, -3.58], darkWood);
    box(group, [0.1, 0.3, 0.12], [-1.16, 1.26, -3.57], metal);
    cylinder(group, 0.07, 0.18, [-1.16, 1.12, -3.5], metal, [Math.PI / 2, 0, 0]);
    cylinder(group, 0.055, 0.1, [-2.39, 2.16, -4.2], darkWood, [0, 0, Math.PI / 2]);
    [[-2.28, -4.58], [-1.22, -4.58], [-2.28, -3.82], [-1.22, -3.82]].forEach(([x, z]) => box(group, [0.12, 0.28, 0.12], [x, 0.14, z], darkWood));
  });
  // A period-appropriate Hoosier cabinet fills the wall neatly to the right of the icebox.
  box(scene, [1.7, 1.02, 1.0], [0.1, 0.63, -4.24], wood);
  box(scene, [1.82, 0.12, 1.08], [0.1, 1.18, -4.24], metal);
  box(scene, [1.62, 1.16, 0.78], [0.1, 1.88, -4.34], cream);
  box(scene, [0.72, 0.9, 0.06], [-0.32, 1.9, -3.92], darkWood);
  box(scene, [0.72, 0.9, 0.06], [0.52, 1.9, -3.92], darkWood);
  [-0.08, 0.28].forEach((x) => cylinder(scene, 0.045, 0.1, [x, 1.9, -3.86], metal, [Math.PI / 2, 0, 0]));
  [0.38, 0.66, 0.94].forEach((y) => box(scene, [1.42, 0.18, 0.06], [0.1, y, -3.71], darkWood));
  interactive(scene, targets, { id: 'table', label: 'Kitchen table', action: 'eat' }, (group) => {
    box(group, [2.35, 0.18, 1.35], [-3.82, 1.08, -1.58], wood);
    [[-4.7, -2.02], [-2.94, -2.02], [-4.7, -1.14], [-2.94, -1.14]].forEach(([x, z]) => box(group, [0.16, 1.0, 0.16], [x, 0.58, z], darkWood));
  });
  addChair(scene, [-3.72, 0, -2.72], Math.PI + 0.08, darkWood, cloth);
  addChair(scene, [-3.92, 0, -0.42], -0.07, darkWood, cloth);
  cylinder(scene, 0.22, 0.045, [-4.35, 1.21, -1.58], porcelain);
  cylinder(scene, 0.22, 0.045, [-3.28, 1.21, -1.58], porcelain);
  cylinder(scene, 0.07, 0.16, [-4.05, 1.29, -1.48], metal);

  // Living room sits closest to the camera and is the visual focus.
  box(scene, [4.8, 0.04, 3.4], [-2.1, 0.15, 1.78], rug);
  interactive(scene, targets, { id: 'couch', label: 'Couch', action: 'rest' }, (group) => {
    box(group, [1.35, 0.56, 3.35], [-6.16, 0.48, 1.55], cloth);
    box(group, [0.35, 1.12, 3.35], [-6.66, 1.0, 1.55], cloth);
    box(group, [1.4, 0.82, 0.32], [-6.16, 0.72, -0.18], darkWood);
    box(group, [1.4, 0.82, 0.32], [-6.16, 0.72, 3.28], darkWood);
    box(group, [0.78, 0.22, 1.3], [-5.77, 0.82, 0.75], cream);
    box(group, [0.78, 0.22, 1.3], [-5.77, 0.82, 2.28], cream);
  });
  box(scene, [2.45, 0.28, 1.2], [-2.75, 0.82, 1.58], wood);
  [[-3.65, 1.15], [-1.85, 1.15], [-3.65, 2.01], [-1.85, 2.01]].forEach(([x, z]) => box(scene, [0.15, 0.7, 0.15], [x, 0.42, z], darkWood));
  box(scene, [2.15, 0.1, 0.92], [-2.75, 0.42, 1.58], darkWood);
  interactive(scene, targets, { id: 'radio', label: 'Radio cabinet', action: 'radioToggle', secondaryAction: 'relax' }, (group) => {
    group.position.set(2.27, 0, -0.26);
    group.rotation.y = -Math.PI / 2;
    box(group, [1.65, 1.18, 0.72], [0, 0.72, 0], darkWood);
    box(group, [0.72, 0.58, 0.07], [-0.27, 0.88, 0.38], cream);
    [-0.49, -0.37, -0.25, -0.13, -0.01].forEach((x) => box(group, [0.035, 0.48, 0.035], [x, 0.88, 0.43], darkWood));
    box(group, [0.48, 0.16, 0.07], [0.31, 0.99, 0.38], metal);
    box(group, [0.38, 0.035, 0.035], [0.31, 0.99, 0.43], black);
    cylinder(group, 0.1, 0.08, [0.17, 0.58, 0.42], metal, [Math.PI / 2, 0, 0]);
    cylinder(group, 0.1, 0.08, [0.47, 0.58, 0.42], metal, [Math.PI / 2, 0, 0]);
  });

  interactive(scene, targets, { id: 'frontDoor', label: 'Front door', action: 'leave' }, (group) => {
    box(group, [1.55, 2.68, 0.18], [0.15, 1.36, 4.62], darkWood, -0.22);
    cylinder(group, 0.07, 0.1, [0.68, 1.36, 4.43], metal, [Math.PI / 2, 0, 0]);
  });

  addFloorLamp(scene, [-6.28, 0, 4.02], lightingRig, 2.48);
  addPlant(scene, [1.82, 0, 3.78]);
  // Small non-interactive details make the home feel occupied without duplicating need actions.
  box(scene, [0.72, 0.08, 0.5], [-2.8, 1.0, 1.52], cream, 0.18);
  cylinder(scene, 0.12, 0.16, [-2.35, 1.02, 1.62], porcelain);

  return targets;
}

function mount(root, payload = {}) {
  cleanup();
  root.innerHTML = '';
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.domElement.className = 'district-three-canvas safehouse-three-canvas';
  root.appendChild(renderer.domElement);
  const fpsLabel = document.createElement('div');
  fpsLabel.className = 'safehouse-fps';
  fpsLabel.textContent = 'FPS -- · cap 180';
  root.appendChild(fpsLabel);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const ambient = new THREE.HemisphereLight(0xe9dab6, 0x302921, 1.2);
  scene.add(ambient);
  const lightingRig = { ambient, lamps: [], windows: [] };
  const actionTargets = furnish(scene, lightingRig);

  const camera = new THREE.OrthographicCamera(-8, 8, 5.5, -5.5, 0.1, 100);
  const target = new THREE.Vector3(0, 0.72, -0.08);
  const limits = { azMin: -0.86, azMax: 0.86, elMin: 0.16, elMax: 1.24 };
  let azimuth = -0.04;
  let elevation = 0.66;
  let zoom = 0.94;
  let dragging = false;
  let last = { x: 0, y: 0 };
  let hovered = null;
  let springFrame = 0;
  let fpsFrame = 0;
  let fpsTimer = 0;
  let renderCost = 0;
  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  root._deskDonSafehousePayload = payload;

  function applyLighting() {
    const lighting = lightingAtMinute(minuteForPayload(root._deskDonSafehousePayload));
    scene.background.set(0x000000);
    ambient.color.copy(lighting.ambientColor);
    ambient.groundColor.set(lighting.daylight > 0.2 ? 0x473d30 : 0x1b2230);
    ambient.intensity = 0.34 + lighting.daylight * 0.62 + lighting.lamp * 0.1;
    lightingRig.windows.forEach((windowLight) => {
      windowLight.paneMaterial.color.copy(lighting.sunColor).multiplyScalar(0.68);
      windowLight.paneMaterial.emissive.copy(lighting.sunColor);
      windowLight.paneMaterial.emissiveIntensity = 0.08 + lighting.daylight * 0.82;
      windowLight.light.color.copy(lighting.sunColor);
      if (windowLight.axis === 'z') {
        windowLight.light.position.set(
          windowLight.position[0] + THREE.MathUtils.lerp(-0.7, 0.7, lighting.sunProgress),
          windowLight.position[1] + 0.2 + lighting.sunHeight * 0.7,
          windowLight.position[2] - 1.75,
        );
        windowLight.target.position.set(
          THREE.MathUtils.lerp(-5.4, 0.8, lighting.sunProgress),
          0.12,
          THREE.MathUtils.lerp(-2.6, 3.8, lighting.sunProgress),
        );
        windowLight.light.intensity = lighting.daylight * THREE.MathUtils.lerp(4.6, 0.65, lighting.sunProgress);
      } else {
        windowLight.light.position.set(
          windowLight.position[0] + 1.75,
          windowLight.position[1] + 0.2 + lighting.sunHeight * 0.7,
          windowLight.position[2] + THREE.MathUtils.lerp(-0.7, 0.7, lighting.sunProgress),
        );
        windowLight.target.position.set(
          THREE.MathUtils.lerp(5.3, -0.5, lighting.sunProgress),
          0.12,
          THREE.MathUtils.lerp(-0.4, 4.1, lighting.sunProgress),
        );
        windowLight.light.intensity = lighting.daylight * THREE.MathUtils.lerp(0.55, 4.8, lighting.sunProgress);
      }
      windowLight.target.updateMatrixWorld();
    });
    lightingRig.lamps.forEach((lamp, index) => {
      lamp.light.color.set(index === 0 ? 0xffb86b : 0xffc77d);
      lamp.light.intensity = lighting.lamp * (index === 0 ? 2.05 : 2.35) * (lamp.scale || 1);
      lamp.shade.material.emissive = new THREE.Color(0xff8f42);
      lamp.shade.material.emissiveIntensity = lighting.lamp * 0.72;
    });
    if (lightingRig.sleeping) {
      ambient.intensity = 0.045;
      lightingRig.windows.forEach((windowLight) => { windowLight.light.intensity = 0; windowLight.paneMaterial.emissiveIntensity = 0.015; });
      lightingRig.lamps.forEach((lamp) => { lamp.light.intensity = 0; lamp.shade.material.emissiveIntensity = 0; });
    }
    renderer.shadowMap.needsUpdate = true;
  }

  function updateWallVisibility() {
    scene.traverse((object) => {
      const fade = object.userData?.wallFade;
      if (!fade || !object.material) return;
      const cameraCoordinate = fade.axis === 'x' ? camera.position.x : camera.position.z;
      const obstruction = THREE.MathUtils.clamp((cameraCoordinate * fade.sign - 0.8) / 5.5, 0, 1);
      object.material.opacity = 1 - obstruction * 0.9;
      object.material.depthWrite = object.material.opacity > 0.42;
    });
  }

  function updateCamera() {
    const radius = 18.5;
    camera.position.set(Math.sin(azimuth) * radius, 4.0 + Math.sin(elevation) * 7.2, Math.cos(azimuth) * radius);
    camera.lookAt(target);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
    updateWallVisibility();
  }
  function render() {
    updateCamera();
    const started = performance.now();
    renderer.render(scene, camera);
    const cost = Math.max(0.05, performance.now() - started);
    renderCost = renderCost ? renderCost * 0.72 + cost * 0.28 : cost;
  }
  function resize() {
    const rect = root.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(320, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.left = -6.75 * aspect;
    camera.right = 6.75 * aspect;
    camera.top = 6.95;
    camera.bottom = -5.7;
    render();
  }
  function elasticMove(value, delta, min, max, maximumOvershoot) {
    const proposed = value + delta;
    if (proposed < min) {
      const overshoot = min - proposed;
      const resistance = 0.82 / (1 + overshoot * 0.9);
      return Math.max(min - maximumOvershoot, value + delta * resistance);
    }
    if (proposed > max) {
      const overshoot = proposed - max;
      const resistance = 0.82 / (1 + overshoot * 0.9);
      return Math.min(max + maximumOvershoot, value + delta * resistance);
    }
    return proposed;
  }
  function setHover(next) {
    if (next === hovered) return;
    if (hovered) hovered.outlines.forEach((outline) => { outline.visible = false; });
    hovered = next;
    if (hovered) hovered.outlines.forEach((outline) => { outline.visible = true; });
    root.style.cursor = hovered ? 'pointer' : 'grab';
    render();
  }
  function targetAt(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(scene.children, true).find((item) => item.object.userData?.safehouseObject);
    if (!hit) return null;
    const info = hit.object.userData.safehouseObject;
    return actionTargets.find((entry) => entry.info.id === info.id) || null;
  }
  function stopSpring() {
    cancelAnimationFrame(springFrame);
    springFrame = 0;
    if (active?.root === root) active.springFrame = 0;
  }
  function springBack() {
    stopSpring();
    const targetAzimuth = THREE.MathUtils.clamp(azimuth, limits.azMin, limits.azMax);
    const targetElevation = THREE.MathUtils.clamp(elevation, limits.elMin, limits.elMax);
    if (targetAzimuth === azimuth && targetElevation === elevation) return;
    let azVelocity = 0;
    let elVelocity = 0;
    function step() {
      azVelocity = (azVelocity + (targetAzimuth - azimuth) * 0.11) * 0.76;
      elVelocity = (elVelocity + (targetElevation - elevation) * 0.11) * 0.76;
      azimuth += azVelocity;
      elevation += elVelocity;
      render();
      if (Math.abs(targetAzimuth - azimuth) < 0.00035 && Math.abs(targetElevation - elevation) < 0.00035 && Math.abs(azVelocity) < 0.00035 && Math.abs(elVelocity) < 0.00035) {
        azimuth = targetAzimuth;
        elevation = targetElevation;
        springFrame = 0;
        if (active?.root === root) active.springFrame = 0;
        render();
        return;
      }
      springFrame = requestAnimationFrame(step);
      if (active?.root === root) active.springFrame = springFrame;
    }
    springFrame = requestAnimationFrame(step);
    if (active?.root === root) active.springFrame = springFrame;
  }
  function pointerDown(event) {
    if (event.button !== 0) return;
    stopSpring();
    setHover(null);
    dragging = true;
    last = { x: event.clientX, y: event.clientY };
    root.style.cursor = 'grabbing';
    root.setPointerCapture?.(event.pointerId);
  }
  function pointerMove(event) {
    if (!dragging) {
      setHover(targetAt(event));
      return;
    }
    const dx = event.clientX - last.x;
    const dy = event.clientY - last.y;
    last = { x: event.clientX, y: event.clientY };
    // Dragging right now turns the room right; this corrects the old inverted feel.
    azimuth = elasticMove(azimuth, -dx * 0.0037, limits.azMin, limits.azMax, 0.92);
    elevation = elasticMove(elevation, dy * 0.003, limits.elMin, limits.elMax, 0.58);
    render();
  }
  function pointerUp(event) {
    if (!dragging) return;
    dragging = false;
    try { root.releasePointerCapture?.(event.pointerId); } catch {}
    root.style.cursor = 'grab';
    springBack();
  }
  function pointerLeave(event) {
    setHover(null);
    pointerUp(event);
  }
  function wheel(event) {
    event.preventDefault();
    zoom = Math.max(0.76, Math.min(1.34, zoom * Math.exp(-event.deltaY * 0.001)));
    render();
  }
  function contextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    const selected = targetAt(event);
    if (!selected) return;
    root.dispatchEvent(new CustomEvent('deskdon-safehouse-object-context', {
      detail: { object: selected.info, x: event.clientX, y: event.clientY },
      bubbles: true,
    }));
  }

  root.addEventListener('wheel', wheel, { passive: false });
  root.addEventListener('pointerdown', pointerDown);
  root.addEventListener('pointermove', pointerMove);
  root.addEventListener('pointerup', pointerUp);
  root.addEventListener('pointercancel', pointerUp);
  root.addEventListener('pointerleave', pointerLeave);
  root.addEventListener('contextmenu', contextMenu);
  window.addEventListener('resize', resize);
  active = { root, renderer, scene, lightingRig, resize, wheel, pointerDown, pointerMove, pointerUp, pointerLeave, contextMenu, springFrame, fpsFrame, fpsTimer, render, applyLighting };
  applyLighting();
  resize();
  fpsTimer = window.setInterval(() => {
    if (!active || active.root !== root) return;
    render();
    if (renderCost > 0) {
      const capacity = Math.min(999, Math.round(1000 / renderCost));
      fpsLabel.textContent = `${Math.min(180, capacity)} FPS capacity · cap 180`;
      fpsLabel.classList.toggle('below-target', capacity < 144);
    }
  }, 700);
  active.fpsTimer = fpsTimer;
}

function updateTime(root, timePayload) {
  if (!root?._deskDonSafehousePayload) return;
  Object.assign(root._deskDonSafehousePayload, timePayload || {});
  if (!active || active.root !== root) return;
  active.applyLighting();
  active.render();
}

function setSleepMode(sleeping) {
  if (!active) return;
  active.lightingRig.sleeping = !!sleeping;
  active.applyLighting();
  active.render();
}

window.DeskDonSafehouse3D = { mount, cleanup, updateTime, setSleepMode, primeRadio, startRadio: startJazz, toggleRadio, isRadioPlaying, setRadioVolume, getRadioVolume };
window.dispatchEvent(new Event('deskdon-safehouse-three-ready'));
