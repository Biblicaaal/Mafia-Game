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

const gameState = read('public/desk-don/game-state.js');
assert('GameState exposes public API', gameState.includes('root.DeskDonGameState'), 'public/desk-don/game-state.js must expose window.DeskDonGameState.');
assert('GameState has legacy aliases', gameState.includes('collectionEnvelopes') && gameState.includes('safehouseNeeds') && gameState.includes('playerLocation'), 'Legacy bridges protect the current playable loop.');

const district3d = read('src/district3d.js');
assert('district renderer exports global API', district3d.includes('window.DeskDon3D'), 'The legacy browser app expects window.DeskDon3D.');
assert('district renderer imports core geometry', district3d.includes('./district3d/core/geometry.js'), 'Keep shared renderer geometry outside the main renderer file.');
assert('district renderer imports core lighting', district3d.includes('./district3d/core/lighting.js'), 'Keep day/night lighting outside the main renderer file.');
assert('district renderer imports building profiles', district3d.includes('./district3d/core/building-profiles.js'), 'Keep static building profile data outside the main renderer file.');

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
