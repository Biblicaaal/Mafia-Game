import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

const checks = [];
const warnings = [];

function assert(name, condition, detail) {
  if (!condition) checks.push({ name, detail });
}

function warn(name, condition, detail) {
  if (!condition) warnings.push({ name, detail });
}

const index = read('index.html');
const scriptOrder = [
  '/src/district3d.js',
  '/src/safehouse3d.js',
  '/desk-don/providence-starter-pack-v01.js',
  '/desk-don/building-names.js',
  '/desk-don/game-state.js',
  '/desk-don/app.js',
  '/desk-don/street-prologue.js',
  '/desk-don/world-population.js',
  '/desk-don/alcohol-delivery.js',
];

let lastIndex = -1;
scriptOrder.forEach((script) => {
  const current = index.indexOf(script);
  assert(`script present: ${script}`, current >= 0, `${script} is missing from index.html`);
  assert(`script order: ${script}`, current > lastIndex, `${script} must load after the previous runtime dependency`);
  lastIndex = current;
});

assert('active DOM root is #app', index.includes('<div id="app"></div>'), 'The current browser app mounts into #app.');
assert('React prototype is not active runtime', !index.includes('/src/main.tsx'), 'Do not load src/main.tsx unless the app is intentionally migrated back to React.');

assert('district renderer module exists', exists('src/district3d.js'), 'src/district3d.js is the district 3D renderer entry.');
assert('district renderer core modules exist', exists('src/district3d/core/geometry.js') && exists('src/district3d/core/lighting.js') && exists('src/district3d/core/disposal.js') && exists('src/district3d/core/building-profiles.js'), 'Renderer helpers should stay in src/district3d/core/.');
assert('safehouse renderer radio module exists', exists('src/safehouse3d/core/radio.js'), 'Safehouse audio/radio code should stay outside the apartment geometry file.');
assert('GameState bridge exists', exists('public/desk-don/game-state.js'), 'GameState must load before public/desk-don/app.js.');
assert('population module exists', exists('public/desk-don/world-population.js'), 'Persistent people must remain in their dedicated population module.');

const gameState = read('public/desk-don/game-state.js');
assert('GameState exposes public API', gameState.includes('root.DeskDonGameState'), 'public/desk-don/game-state.js must expose window.DeskDonGameState.');
assert('GameState has legacy aliases', gameState.includes('collectionEnvelopes') && gameState.includes('safehouseNeeds') && gameState.includes('playerLocation'), 'Legacy bridges protect the current playable loop.');
assert('GameState owns persistent population', gameState.includes("population:['world','population']"), 'Population must remain under game.world.population with a legacy state.population alias.');

const population = read('public/desk-don/world-population.js');
assert('population exposes public API', population.includes('window.DeskDonPopulation'), 'Population consumers require window.DeskDonPopulation.');
assert('population owns household and building indexes', population.includes('households:[]') && population.includes('buildingOwners:{}') && population.includes('buildingResidents:{}') && population.includes('buildingEmployees:{}'), 'Persistent people need canonical household, ownership, resident, and employee indexes.');
assert('population renderer payloads are scheduled', population.includes("populationPayload('walk')") && population.includes("populationPayload('car')"), 'The renderer should consume scheduled population payloads instead of inventing pedestrians.');
assert('population uses fixed travel speeds', population.includes('WALK_SPEED=1.1') && population.includes('CAR_SPEED=1.65') && population.includes('parcelTripMinutes'), 'Resident travel must remain distance-based and share fixed walking/driving speed bands.');
assert('People Index search stays local', population.includes('refreshPeopleSearch') && !population.includes('setTimeout(render,120)'), 'Search must update the People Index list without rerendering the entire app or dropping input focus.');
assert('traffic signals remain removed', !population.includes('trafficSignals:true'), 'Traffic signals are intentionally disabled until a dedicated traffic simulation owns them.');

const district3d = read('src/district3d.js');
assert('district renderer exports global API', district3d.includes('window.DeskDon3D'), 'The legacy browser app expects window.DeskDon3D.');
assert('district renderer imports core geometry', district3d.includes('./district3d/core/geometry.js'), 'Keep shared renderer geometry outside the main renderer file.');
assert('district renderer imports core lighting', district3d.includes('./district3d/core/lighting.js'), 'Keep day/night lighting outside the main renderer file.');
assert('district renderer imports building profiles', district3d.includes('./district3d/core/building-profiles.js'), 'Keep static building profile data outside the main renderer file.');
assert('population movement is frame-interpolated', !district3d.includes('predictionCap') && district3d.includes('entry.distance / 1.1') && district3d.includes('entry.distance / 1.65'), 'Pedestrians and cars must advance every rendered frame at their fixed route speed.');
assert('paused population never reconciles backward', !district3d.includes('else desired += (entry.logicalProgress - desired)') && !district3d.includes('else entry.visualProgress += (entry.logicalProgress - entry.visualProgress)'), 'Pausing must freeze pedestrians and cars at their rendered position.');
assert('population routes load incrementally', district3d.includes('pendingAgents') && district3d.includes('pendingVehicles') && district3d.includes('processPending'), 'Visible population routes must be assigned over several frames instead of blocking one frame.');
assert('district renderer imports street atmosphere', district3d.includes('./district3d/core/street-lighting.js'), 'Keep decorative street illumination outside the main renderer file.');
const streetLighting = read('src/district3d/core/street-lighting.js');
assert('street lamps use batched contamination and building facades', district3d.includes('One lamp marks each true intersection') && district3d.includes('const curbOffset = segment.widthWorld * 0.5 + 0.028') && district3d.includes('if (!pointInPoly(source, cityPolygon))') && district3d.includes('createStreetAtmosphere') && streetLighting.includes('streetLampDecals') && streetLighting.includes('streetContamination') && streetLighting.includes('streetBuildingWindows') && streetLighting.includes('streetLitWindows') && streetLighting.includes('streetBuildingDoors') && streetLighting.includes('streetDoorFrames') && streetLighting.includes('garageDoorCount') && streetLighting.includes('overnightWindowCount') && streetLighting.includes('scheduledWindowMaterial') && streetLighting.includes('lightOnMinute') && streetLighting.includes('lightNightSeed') && streetLighting.includes('lightBrightness') && streetLighting.includes('facadeLayout') && !streetLighting.includes('setNight(night)') && !streetLighting.includes('streetFacadeContamination') && !district3d.includes('new THREE.PointLight') && !district3d.includes('shadowMap.enabled') && !district3d.includes('castShadow = true') && !district3d.includes('streetLightField') && !district3d.includes('createStreetPopulationShadowRig') && !district3d.includes('setViewerPosition'), 'Street lamps and facade details must stay batched: subtype-aware facade variants, entry-aligned doors, industrial garage doors, per-pane brightness and rolling 1-4% overnight GPU schedules, and density-weighted streets without realtime lights or flood washes.');
assert('close camera obstruction preserves translucent building silhouettes', district3d.includes('function updateCameraOcclusion()') && district3d.includes("root.dataset.cameraOccluderCount") && district3d.includes('material.opacity = Math.min(0.2') && district3d.includes('material.depthWrite = false') && district3d.includes('restoreCameraOcclusion()'), 'Close or low isometric cameras must dim only ray-blocking building meshes and restore their original material state when the view clears.');

const safehouse3d = read('src/safehouse3d.js');
assert('safehouse renderer exports global API', safehouse3d.includes('window.DeskDonSafehouse3D'), 'The legacy browser app expects window.DeskDonSafehouse3D.');
assert('safehouse renderer imports radio module', safehouse3d.includes('./safehouse3d/core/radio.js'), 'Radio/audio state should remain isolated from safehouse geometry.');

const appSize = fs.statSync(path.join(root, 'public/desk-don/app.js')).size;
const districtSize = fs.statSync(path.join(root, 'src/district3d.js')).size;
warn('legacy app.js is still a monolith', appSize < 350_000, `public/desk-don/app.js is ${(appSize / 1024).toFixed(1)} KB; split future features into dedicated modules instead of appending overrides.`);
warn('district renderer remains large', districtSize < 180_000, `src/district3d.js is ${(districtSize / 1024).toFixed(1)} KB; continue extracting focused renderer modules.`);

if (warnings.length) {
  console.warn('\nArchitecture warnings:');
  warnings.forEach((item) => console.warn(`- ${item.name}: ${item.detail}`));
}

if (checks.length) {
  console.error('\nArchitecture check failed:');
  checks.forEach((item) => console.error(`- ${item.name}: ${item.detail}`));
  process.exit(1);
}

console.log('Architecture guard checks passed.');
