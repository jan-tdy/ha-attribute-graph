# CLAUDE.md

Guidance for Claude Code (or any agent) working in this repository.

## What this is

A Home Assistant HACS **plugin card** (Lovelace custom card), `attribute-graph-card`.
It graphs entity **attributes** over time (e.g. a light's `brightness`, a climate
entity's `current_temperature`), not just an entity's main state — with no template
sensors required. Visually it deliberately mimics HA's built-in history card
(`ha-card`, theme CSS variables) rather than introducing its own design language.

There is no backend/integration component here — this is frontend-only JavaScript
distributed as a single bundled `.js` file via HACS.

## Layout

```
src/attribute-graph-card.js         the card (LitElement custom element)
src/attribute-graph-card-editor.js  the GUI card editor (LitElement custom element)
src/const.js                        version string, default colors, known-attribute scales
src/helpers.js                      value extraction / scaling / formatting helpers (framework-free, easy to unit test)
rollup.config.js                    bundles src/attribute-graph-card.js (which imports the editor)
                                     + lit into the single root-level attribute-graph-card.js
attribute-graph-card.js             BUILD OUTPUT, committed to the repo root — this is
                                     the file HACS/Lovelace actually loads (see hacs.json,
                                     "content_in_root": true). Never hand-edit it; run
                                     `npm run build` after changing anything in src/.
hacs.json                           HACS plugin manifest
.github/workflows/validate.yml      CI: hacs/action plugin validation + `npm run build`
```

## Build

```bash
npm install
npm run build     # -> attribute-graph-card.js (minified, committed)
npm run watch      # rollup --watch, unminified with sourcemaps, for local iteration
```

`attribute-graph-card.js` at the repo root **must** be rebuilt and committed together
with any `src/` change — HACS installs straight from the repo, there is no build step
on the user's end.

## Versioning

The project intentionally uses a Python-style pre-release version string
(`1.0.0b0`, not semver's `1.0.0-beta.0`) — keep `package.json`'s `version` and
`src/const.js`'s `CARD_VERSION` in sync, and match any git tag the same way
(`v1.0.0b0`).

**Every PR must bump the version** (e.g. `1.0.0b0` → `1.0.0b1`), in both
`package.json` and `src/const.js`. This is enforced by the `version-bump` job in
`.github/workflows/validate.yml`, which fails the PR if `package.json`'s version
matches the base branch's, or if `package.json` and `src/const.js` disagree.

## Card architecture

- `attribute-graph-card.js` (the card) owns: config validation/normalization
  (`setConfig`), the `hass` setter (which diffs `last_updated` per watched entity to
  decide when to refetch history, debounced), fetching history via
  `hass.callApi('GET', 'history/period/...')` with `significant_changes_only=0` and
  `no_attributes=0` (required — the defaults would drop attribute-only changes / strip
  attributes), and rendering an SVG chart (grid, axes, per-series `<path>`, legend,
  hover tooltip/crosshair) by hand — there is no charting library dependency.
- SVG is sized in real pixels (`viewBox="0 0 <measuredWidthPx> <heightPx>"`, no
  `preserveAspectRatio` stretching) via a `ResizeObserver`, specifically to avoid
  distorted `<text>` glyphs that non-uniform SVG scaling would otherwise cause.
- Dynamic SVG fragments **must** use lit's `svg` tag function, not `html` — a
  fragment built with `html` and later inserted as a child of an `<svg>` element
  parses outside the SVG namespace and silently fails to render (paths, text, etc.
  become invisible `HTMLUnknownElement`s). This has already caused confusion once;
  don't reintroduce `html`-tagged fragments inside the chart.
- `attribute-graph-card-editor.js` is a separate custom element
  (`attribute-graph-card-editor`), imported from the top of `attribute-graph-card.js`
  so it ends up in the same bundle. It fires standard `config-changed` events; it does
  **not** validate/throw the way the card's `setConfig` does — the editor should stay
  tolerant of incomplete config (e.g. no entities yet) since the user builds it up
  interactively.
- `src/helpers.js` (`resolveScale`, `extractRawValue`, `applyScale`, `formatValue`,
  `seriesLabel`) contains the only genuinely testable logic (pure functions, no DOM/
  lit). If adding real tests later, start there.

## Config shape (see README.md for the user-facing table)

```yaml
type: custom:attribute-graph-card
title: optional string
hours_to_show: 24
refresh_interval: 60   # seconds; 0 disables the timer (entity-change updates still work)
chart_height: 200
show_legend: true
y_axis:
  primary: { min: 0, max: 100 }    # YAML-only for now, not exposed in the GUI editor
  secondary: { min: ..., max: ... }
entities:
  - entity: light.living_room
    attribute: brightness   # omit to graph the entity's main state
    name: Brightness
    color: "#ff9800"
    unit: "%"
    y_axis: primary | secondary
    line_type: linear | step
    raw: false               # true disables auto-scaling (e.g. keep brightness 0-255)
    scale: { factor: 1, offset: 0, unit: "", decimals: 0 }
```

Known-attribute auto-scaling lives in `KNOWN_ATTRIBUTE_SCALES` in `src/const.js`
(currently just `brightness` 0-255 → %). Add new entries there rather than special-
casing attribute names elsewhere.

## Testing

There's no HA instance available in this environment to click through the card. When
changing rendering/editor behavior:
- Run `npm run build` and confirm it completes without warnings.
- Reason carefully about the lit `html` vs `svg` tagging rule above — it's the most
  likely source of a silent (no error, nothing renders) regression in this codebase.
- Call out in the PR description that manual verification inside a real Home
  Assistant instance is still needed, rather than claiming the UI was tested.
