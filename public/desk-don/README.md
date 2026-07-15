# `public/desk-don`

This folder contains the active browser-game shell. It is loaded directly by `index.html` after the 3D renderer modules.

Use this folder for gameplay systems that coordinate state, UI tabs, save/load, and district actions.

Current owners:

- `app.js` — legacy main game shell. Keep behavior stable; avoid adding new large systems here.
- `game-state.js` — canonical playable-loop state and legacy property aliases.
- `street-prologue.js` — integrated street-criminal campaign layer.
- `world-population.js` — persistent people, households, owners, jobs, schedules, life events, and People Index. This is the only authority for simulated people.
- `world-population.css` — People Index and building-people presentation.
- `alcohol-delivery.js` — alcohol procurement and delivery mission layer.
- `building-names.js` — building and street naming.
- CSS files — UI presentation for the browser shell and feature overlays.

Before moving behavior out of `app.js`, identify the old public function name and leave a wrapper so existing event handlers continue to work.

Population consumers should store stable person IDs and use `window.DeskDonPopulation`. Do not add independent decorative resident lists; the 3D renderer should only visualize scheduled residents supplied by the population module.

Population timing rules:

- pedestrians use the same fixed walking speed as the player;
- civilian cars use a single, slightly faster fixed speed;
- route distance determines duration, never destination distance divided by a random timer;
- high time speeds may hide local meshes, but residents continue their offscreen schedules;
- the People Index search updates its list in place and must not rerender the app per keystroke.
