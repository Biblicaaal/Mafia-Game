# Desk Don architecture map

This project currently runs as a Vite-served legacy browser app. The active runtime is loaded from `index.html` into `<div id="app"></div>`. The React files under `src/App.tsx` and `src/main.tsx` are historical prototype code and are not loaded by the current preview.

The important rule: gameplay changes should use the active browser-app path unless the project is intentionally migrated back to React.

## Active runtime load order

`index.html` loads the game in this order:

1. `src/district3d.js` — district 3D renderer, exposed as `window.DeskDon3D`.
2. `src/safehouse3d.js` — apartment/safehouse 3D renderer, exposed as `window.DeskDonSafehouse3D`.
3. `public/desk-don/providence-starter-pack-v01.js` — event data pack.
4. `public/desk-don/building-names.js` — generated building/street naming.
5. `public/desk-don/game-state.js` — canonical playable-loop state bridge.
6. `public/desk-don/app.js` — main legacy browser game.
7. `public/desk-don/street-prologue.js` — February-September street-criminal campaign integration.
8. `public/desk-don/world-population.js` — persistent residents, households, ownership, careers, schedules, and life simulation.
9. `public/desk-don/alcohol-delivery.js` — alcohol procurement orders, inventory, and delivery-truck integration.

Do not reorder these scripts unless the dependency is deliberately removed.

## Current module ownership

### `public/desk-don/`

Owns the browser-app gameplay shell, city generation, tabs, save/load, family tree, event creator, campaign overlays, and CSS.

- `app.js` is still the main legacy monolith. Treat it as the current behavior source of truth, but do not append new large systems here when a feature-specific module can own them.
- `game-state.js` owns the canonical playable-loop state bridge and legacy aliases.
- `street-prologue.js` owns the integrated street-criminal prologue/follow-order overlay layer.
- `world-population.js` is the authority for people. It owns residents, households, building ownership, employment, careers, schedules, life events, the People Index, and links into the Blood and Mafia trees. Other systems should store a `personId` and query `window.DeskDonPopulation`; they should not create a second population list.
- `alcohol-delivery.js` owns alcohol procurement orders and vehicle-delivery gameplay.
- `building-names.js` owns naming data and assignment helpers.
- `providence-starter-pack-v01.js` is data, not gameplay logic.

### `src/district3d/`

Owns reusable district-renderer helpers.

- `core/geometry.js` — polygon/road/transform utilities.
- `core/building-profiles.js` — district building categories, colors, and profile selection.
- `core/lighting.js` — district day/night lighting model.
- `core/disposal.js` — Three.js object cleanup helpers.

`src/district3d.js` remains the renderer entry point and the only file that should expose `window.DeskDon3D`.

The renderer consumes scheduled `populationAgents` and `populationVehicles` from the population module. It may pool meshes for performance, but must not invent identities, homes, destinations, or schedules.

Population movement uses route distance as its timing authority: pedestrians share the player's 1.1 world-units-per-simulated-minute walking speed, while civilian cars use 1.65. The population module owns schedules and fixed speed bands; the renderer owns per-frame interpolation. Do not restore tick-capped movement or random trip-duration speed.

Street infrastructure is intentionally signal-free for now. The renderer generates instanced sidewalk lamps across every sidewalk segment, with emissive ground pools and a small fixed dynamic-light budget at night.

### `src/safehouse3d/`

Owns reusable safehouse-renderer helpers.

- `core/radio.js` — radio audio state, playback, volume, and toggle behavior.

`src/safehouse3d.js` remains the renderer entry point and the only file that should expose `window.DeskDonSafehouse3D`.

## Refactor rules

- Preserve the current playable loop unless a task explicitly asks to change gameplay.
- Prefer extracting pure helpers first: geometry, formatting, payload builders, renderer rigs, validators, and state bridges.
- When extracting active gameplay behavior from `app.js`, move one feature at a time and leave a compatibility wrapper with the old function name.
- Keep globals explicit. If a module must write to `window`, document the public API in this file.
- Use `window.DeskDonPopulation` for people lookups, owners, schedules, pedestrians, and vehicles. Family-tree records link back through `populationPersonId`.
- Avoid “latest definition wins” overrides for new features. Use one owner function, then call small helpers from it.
- Run `npm run architecture:check` and `npm run build` after architecture changes.

## Guardrails

`npm run architecture:check` verifies the active script order, required global APIs, GameState bridge, and extracted renderer modules. It also warns when large legacy files remain too large, which is expected today but should trend down over time.

## Remaining legacy debt

- `public/desk-don/app.js` still mixes city generation, UI, family/social simulation, movement, safehouse, extortion, and renderer payload assembly.
- `public/desk-don/street-prologue.js` still wraps several `app.js` globals to integrate follow orders.
- `public/desk-don/world-population.js` currently coordinates both simulation and People Index presentation; split its UI and data registries once those systems grow further.
- `src/district3d.js` still owns too many renderer responsibilities: scene assembly, road navigation, player pawn, population mesh pools, citizen vehicles, street infrastructure, mission target, context menu hit targets, and camera controls.
- `src/App.tsx` / `src/main.tsx` are not active runtime files. They should either be archived into a clearly marked prototype folder later or removed after confirmation.

## Recommended next extraction order

1. `public/desk-don/app.js` safehouse/rent/needs helpers into `public/desk-don/systems/safehouse.js`.
2. `public/desk-don/app.js` movement and action queue helpers into `public/desk-don/systems/movement.js`.
3. `public/desk-don/app.js` extortion/envelope/protection loop into `public/desk-don/systems/rackets.js`.
4. `public/desk-don/street-prologue.js` follow-order logic into campaign files: orders, inbox, HUD, report modal, mission payloads.
5. `src/district3d.js` pawn route visuals, population pedestrians/vehicles, street infrastructure, and mission target rigs into renderer modules.
