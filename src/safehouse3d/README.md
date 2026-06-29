# `src/safehouse3d`

This folder contains helper modules for the safehouse/apartment 3D renderer.

`../safehouse3d.js` is still the entry point because `index.html` loads it as a module and the browser game expects `window.DeskDonSafehouse3D`.

Modules:

- `core/radio.js` — safehouse radio audio lifecycle, volume, and playback state.

Future safehouse extractions should move room layout, furniture interactions, lighting rigs, and camera spring behavior into focused files.
