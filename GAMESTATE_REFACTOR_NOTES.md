# GameState Refactor Notes

This is a compatibility refactor only. Gameplay rules, timings, payouts, UI, and the playable loop are unchanged.

## Files changed

- `public/desk-don/game-state.js` — centralized state schema, normalization, and legacy property bridges.
- `public/desk-don/app.js` — attaches the existing state to GameState, synchronizes safehouse ownership metadata, and normalizes saves/loads.
- `index.html` — loads GameState before the existing game scripts.
- `GAMESTATE_REFACTOR_NOTES.md` — migration record and regression checklist.

## Centralized fields

The canonical object is `state.gameState`:

- `player.money.clean`, `player.money.dirty`
- `player.location`
- `economy.heldEnvelopes`
- `economy.mafia.coffers`, `economy.mafia.ledger`
- `world.protectedBuildings`
- `world.scouting`
- `world.pressure.heat`, `world.pressure.police`
- `selection.districtId`, `selection.buildingId`, `selection.renderedBuilding`, `selection.contextBuilding`
- `clock.day`, `clock.period`, `clock.minuteOfDay`
- `safehouse.assignment`, `safehouse.rent`, `safehouse.ownership`, `safehouse.needs`, `safehouse.utilities`
- `progression` (rank, level, XP, next-rank target)
- `communications.messages`, `communications.logs`

Existing names such as `state.dirty`, `state.collectionEnvelopes`, and `state.playerLocation` are non-serialized compatibility accessors into the canonical object. This avoids a risky full rewrite while eliminating duplicate persisted copies of active-loop fields. Old saves with top-level fields are accepted through the same accessors.

## Remaining legacy state

- Movement, queued actions, active encounters, extortion timing, and follow-order runtime state remain top-level because they are tightly coupled to live rendering and timers.
- Parcel geometry and parcel-owned metadata remain in generated district layouts. Safehouse ownership is mirrored as summary metadata, while the parcel remains authoritative for building presentation.
- Family, Providence, population, campaign, and social simulation state remain in their existing modules because they are outside this playable-loop refactor.
- UI-only state (tabs, camera, overlays, filters, selected family profiles) remains top-level.

## Manual test checklist

1. Start a new game and confirm the character begins at the assigned safehouse.
2. Enter the safehouse and perform food, sleep, hygiene, toilet, and health actions; verify needs and utilities update immediately.
3. Exit to the district, select a commercial building, and scout it; verify scouting progress persists.
4. Extort a commercial building successfully and verify it becomes protected.
5. Advance to Sunday and collect from the protected building.
6. Verify 20% is added to player dirty cash and 80% is held as an envelope.
7. Travel to the Estate and deliver the envelope; verify held envelopes clear and Mafia coffers increase.
8. Save, change money/location/needs, then load; verify the saved values return.
9. Reload the page and load an older save if available; verify top-level legacy fields migrate into `state.gameState`.
10. Confirm inbox messages, heat/police pressure, rank, and XP still display and update normally.
