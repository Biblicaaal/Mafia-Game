# `public/desk-don`

This folder contains the active browser-game shell. It is loaded directly by `index.html` after the 3D renderer modules.

Use this folder for gameplay systems that coordinate state, UI tabs, save/load, and district actions.

Current owners:

- `app.js` — legacy main game shell. Keep behavior stable; avoid adding new large systems here.
- `game-state.js` — canonical playable-loop state and legacy property aliases.
- `street-prologue.js` — integrated street-criminal campaign layer.
- `building-names.js` — building and street naming.
- CSS files — UI presentation for the browser shell and feature overlays.

Before moving behavior out of `app.js`, identify the old public function name and leave a wrapper so existing event handlers continue to work.
