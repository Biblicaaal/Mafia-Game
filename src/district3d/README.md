# `src/district3d`

This folder contains helper modules for the district/city 3D renderer.

`../district3d.js` is still the entry point because the browser game expects `window.DeskDon3D`.

Modules:

- `core/geometry.js` - reusable polygon, clipping, transform, seeded-random, and road-helper math.
- `core/building-profiles.js` - building category colors and parcel profile selection.
- `core/lighting.js` - district day/night lighting interpolation.
- `core/disposal.js` - Three.js cleanup helpers.
- `overlays/territory-overlay.js` - reusable block-based territory overlay rendering. This owns block merging, road/sidewalk connector fills, zoomed-out family color tinting, and depth-aware perimeter lines.

Future renderer extractions should continue here. Good candidates are camera controls, pawn movement, route visuals, mission highlights, and population pedestrians.
