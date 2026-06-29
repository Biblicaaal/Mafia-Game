# `src/district3d`

This folder contains helper modules for the district 3D renderer.

`../district3d.js` is still the entry point because `index.html` loads it as a module and the browser game expects `window.DeskDon3D`.

Modules:

- `core/geometry.js` — reusable polygon, clipping, transform, seeded-random, and road-helper math.
- `core/building-profiles.js` — building category colors and parcel profile selection.
- `core/lighting.js` — district day/night lighting interpolation.
- `core/disposal.js` — Three.js cleanup helpers.

Future renderer extractions should continue here. Good candidates are camera controls, pawn movement, route visuals, mission highlights, and population pedestrians.
