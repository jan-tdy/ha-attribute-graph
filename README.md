# Attribute Graph Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![version](https://img.shields.io/badge/version-1.0.0b0-blue.svg)](https://github.com/jan-tdy/ha-attribute-graph)

A Home Assistant Lovelace card that graphs entity **attributes** over time — not just
the main state. Point it at `light.living_room` and tell it to plot `brightness`, and
it will render a native-looking history graph of that attribute, no template sensors
or extra recorder configuration required.

It deliberately looks and feels like the built-in **History** card (`ha-card`, same
fonts/colors via the active theme, same kind of legend) — the difference is what it
can plot.

![screenshot placeholder](https://via.placeholder.com/700x260?text=Attribute+Graph+Card)

## Features

- **Zero template sensors** — reads attribute history straight from the recorder via
  `history/period`, so `brightness`, `current_temperature`, `color_temp_kelvin`, or any
  other numeric/boolean attribute can be graphed directly.
- **Native look & feel** — uses `ha-card` and the active theme's CSS variables, so it
  blends into the dashboard the same way the default history card does.
- **Multi-attribute layering** — overlay several entities/attributes on the same
  graph (e.g. a light's `brightness` next to a lux sensor's state) to see how
  automations are actually behaving.
- **Custom scaling** — known attributes such as `brightness` (0-255) are automatically
  converted to a readable range (0-100 %) on the Y-axis; any attribute can also get a
  manual scale, unit, or be plotted on a secondary (right-hand) Y-axis.
- **Fully UI-configurable** — a graphical card editor (entity picker, attribute
  dropdown per entity, color, axis, line style, scaling) is included, no YAML required
  (though YAML is of course still supported).

## Installation

### HACS (recommended)

1. HACS → Frontend → ⋮ → *Custom repositories*.
2. Add `https://github.com/jan-tdy/ha-attribute-graph` as category **Dashboard**.
3. Install **Attribute Graph Card** and reload the frontend (clear cache if needed).

### Manual

1. Download `attribute-graph-card.js` from the latest release (or repo root).
2. Copy it to `<config>/www/attribute-graph-card.js`.
3. Add it as a Lovelace resource:
   ```yaml
   url: /local/attribute-graph-card.js
   type: module
   ```

## Usage

Add the card via the dashboard UI editor ("Attribute Graph Card") and configure it
visually, or use YAML:

```yaml
type: custom:attribute-graph-card
title: Living room light
hours_to_show: 24
refresh_interval: 60
show_legend: true
chart_height: 200
entities:
  - entity: light.living_room
    attribute: brightness
    name: Brightness
    color: "#ff9800"
  - entity: sensor.living_room_illuminance
    name: Illuminance
    unit: lx
    y_axis: secondary
```

### Options

| Name               | Type    | Default | Description                                                             |
| ------------------ | ------- | ------- | ------------------------------------------------------------------------ |
| `title`             | string  | —       | Optional card header.                                                    |
| `entities`          | list    | —       | **Required.** List of entities/attributes to plot, see below.            |
| `hours_to_show`     | number  | `24`    | Size of the time window shown on the X-axis.                             |
| `refresh_interval`  | number  | `60`    | Seconds between automatic history refreshes (`0` disables the timer; the card still updates immediately whenever a watched entity changes). |
| `chart_height`      | number  | `200`   | Chart height in pixels (legend is extra).                                |
| `show_legend`       | boolean | `true`  | Show the legend with the latest value per series.                        |
| `y_axis.primary`    | object  | —       | `{ min, max }` to pin the left axis instead of auto-scaling.             |
| `y_axis.secondary`  | object  | —       | `{ min, max }` to pin the right axis instead of auto-scaling.            |

### Entity/series options

| Name        | Type    | Default              | Description                                                                 |
| ----------- | ------- | --------------------- | ---------------------------------------------------------------------------- |
| `entity`    | string  | —                     | **Required.** Entity ID.                                                     |
| `attribute` | string  | —                     | Attribute to graph. Omit to graph the entity's main state instead.           |
| `name`      | string  | friendly name         | Legend/tooltip label.                                                        |
| `color`     | string  | auto (rotating palette) | Any CSS color.                                                              |
| `unit`      | string  | auto-detected          | Overrides the unit shown next to values.                                     |
| `y_axis`    | string  | `primary`             | `primary` or `secondary`.                                                    |
| `line_type` | string  | `linear`               | `linear` or `step` (useful for on/off-like values).                          |
| `raw`       | boolean | `false`                | Disable automatic scaling (e.g. keep `brightness` as 0-255 instead of a %).  |
| `scale`     | object  | —                      | Manual scaling: `{ factor, offset, unit, decimals }`, applied as `value * factor + offset`. |

Attributes with a well-known non-obvious range (currently `brightness`) are
auto-scaled to a friendlier unit unless `raw: true` or an explicit `scale` is set.

## License

MIT
