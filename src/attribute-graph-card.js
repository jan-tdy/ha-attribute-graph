import { LitElement, html, svg, css } from "lit";
import "./attribute-graph-card-editor.js";
import { CARD_VERSION, DEFAULT_HOURS_TO_SHOW, DEFAULT_COLORS } from "./const.js";
import { resolveScale, extractRawValue, applyScale, formatValue, seriesLabel } from "./helpers.js";

console.info(
  `%c ATTRIBUTE-GRAPH-CARD %c v${CARD_VERSION} `,
  "color: #fff; background: #039be5; font-weight: 700; border-radius: 3px 0 0 3px;",
  "color: #039be5; background: #fff; font-weight: 700; border-radius: 0 3px 3px 0;"
);

const PAD_TOP = 12;
const PAD_BOTTOM = 24;
const PAD_LEFT = 42;
const PAD_RIGHT_AXIS = 42;
const PAD_RIGHT_NOAXIS = 14;

function nearestPoint(points, t) {
  if (!points.length) return undefined;
  let lo = 0;
  let hi = points.length - 1;
  if (t <= points[0].t) return points[0];
  if (t >= points[hi].t) return points[hi];
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (points[mid].t < t) lo = mid + 1;
    else hi = mid;
  }
  const after = points[lo];
  const before = points[Math.max(0, lo - 1)];
  return Math.abs(after.t - t) < Math.abs(t - before.t) ? after : before;
}

class AttributeGraphCard extends LitElement {
  constructor() {
    super();
    this._series = [];
    this._width = 600;
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
  }

  static getConfigElement() {
    return document.createElement("attribute-graph-card-editor");
  }

  static getStubConfig(hass) {
    const lightEntity =
      hass && Object.keys(hass.states).find((e) => e.startsWith("light."));
    return {
      type: "custom:attribute-graph-card",
      title: "Attribute Graph",
      hours_to_show: 24,
      entities: [
        {
          entity: lightEntity || "light.living_room",
          attribute: "brightness",
          name: "Brightness",
        },
      ],
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    const rawEntities = config.entities || config.entity ? config.entities || [config.entity] : [];
    if (!Array.isArray(rawEntities) || rawEntities.length === 0) {
      throw new Error("attribute-graph-card: you must define at least one entry in 'entities'");
    }
    const entities = rawEntities.map((e, i) => {
      const entry = typeof e === "string" ? { entity: e } : { ...e };
      if (!entry.entity) {
        throw new Error(`attribute-graph-card: entities[${i}] is missing 'entity'`);
      }
      return entry;
    });

    this._config = {
      hours_to_show: DEFAULT_HOURS_TO_SHOW,
      refresh_interval: 60,
      show_legend: true,
      chart_height: 200,
      ...config,
      entities,
    };
    this._series = [];
    this._error = undefined;
    this._scheduleFetch(0);
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;
    if (!this._config) return;
    let dirty = !oldHass;
    for (const s of this._config.entities) {
      const oldStateObj = oldHass && oldHass.states[s.entity];
      const newStateObj = hass.states[s.entity];
      if (Boolean(oldStateObj) !== Boolean(newStateObj)) {
        dirty = true;
        break;
      }
      if (
        oldStateObj &&
        newStateObj &&
        oldStateObj.last_updated !== newStateObj.last_updated
      ) {
        dirty = true;
        break;
      }
    }
    if (dirty) {
      this._scheduleFetch();
    }
    this.requestUpdate();
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    super.connectedCallback();
    const interval = this._config && this._config.refresh_interval;
    if (interval) {
      this._refreshTimer = window.setInterval(() => this._fetchHistory(), interval * 1000);
    }
    if (this._resizeObserver) {
      this._resizeObserver.observe(this);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._refreshTimer) {
      window.clearInterval(this._refreshTimer);
      this._refreshTimer = undefined;
    }
    if (this._fetchDebounce) {
      window.clearTimeout(this._fetchDebounce);
      this._fetchDebounce = undefined;
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  firstUpdated() {
    this._resizeObserver = new ResizeObserver(() => this._onResize());
    this._resizeObserver.observe(this);
    this._onResize();
  }

  _onResize() {
    const rect = this.getBoundingClientRect();
    const w = Math.max(Math.round(rect.width), 100);
    if (w !== this._width) {
      this._width = w;
      this.requestUpdate();
    }
  }

  _scheduleFetch(delay = 400) {
    if (this._fetchDebounce) {
      window.clearTimeout(this._fetchDebounce);
    }
    this._fetchDebounce = window.setTimeout(() => this._fetchHistory(), delay);
  }

  async _fetchHistory() {
    if (!this._hass || !this._config) return;
    const entityIds = [...new Set(this._config.entities.map((e) => e.entity))];
    if (entityIds.length === 0) return;

    const hours = this._config.hours_to_show || DEFAULT_HOURS_TO_SHOW;
    const end = new Date();
    const start = new Date(end.getTime() - hours * 60 * 60 * 1000);
    const params = new URLSearchParams({
      filter_entity_id: entityIds.join(","),
      significant_changes_only: "0",
      minimal_response: "0",
      no_attributes: "0",
      end_time: end.toISOString(),
    });

    let response;
    try {
      response = await this._hass.callApi(
        "GET",
        `history/period/${start.toISOString()}?${params.toString()}`
      );
    } catch (err) {
      this._error = `Could not load history: ${err && err.message ? err.message : err}`;
      this.requestUpdate();
      return;
    }

    this._error = undefined;
    const byEntity = {};
    (response || []).forEach((rows) => {
      if (rows && rows.length) {
        byEntity[rows[0].entity_id] = rows;
      }
    });

    this._rangeStart = start;
    this._rangeEnd = end;
    this._series = this._config.entities.map((seriesConfig) => {
      const rows = byEntity[seriesConfig.entity] || [];
      const scale = resolveScale(seriesConfig);
      const points = [];
      for (const row of rows) {
        const raw = extractRawValue(row, seriesConfig);
        if (raw === undefined) continue;
        const t = new Date(row.last_changed).getTime();
        points.push({ t, v: applyScale(raw, scale) });
      }
      return { config: seriesConfig, scale, points };
    });
    this.requestUpdate();
  }

  getCardSize() {
    const rows = Math.ceil((this._config?.chart_height || 200) / 50);
    return rows + (this._config?.show_legend !== false ? 1 : 0) + (this._config?.title ? 1 : 0);
  }

  _hasSecondaryAxis() {
    return (this._config.entities || []).some((e) => e.y_axis === "secondary");
  }

  _axisDomain(axisId) {
    const axisCfg = (this._config.y_axis && this._config.y_axis[axisId]) || {};
    let min = Infinity;
    let max = -Infinity;
    for (const s of this._series) {
      const axis = s.config.y_axis === "secondary" ? "secondary" : "primary";
      if (axis !== axisId) continue;
      for (const p of s.points) {
        if (p.v < min) min = p.v;
        if (p.v > max) max = p.v;
      }
    }
    if (min === Infinity) {
      min = 0;
      max = 1;
    }
    if (axisCfg.min !== undefined) min = axisCfg.min;
    if (axisCfg.max !== undefined) max = axisCfg.max;
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const pad = axisCfg.min !== undefined && axisCfg.max !== undefined ? 0 : (max - min) * 0.08;
    return [min - pad, max + pad];
  }

  _onPointerMove(ev) {
    if (!this._rangeStart || !this._series.length) return;
    const svgEl = ev.currentTarget;
    const rect = svgEl.getBoundingClientRect();
    if (!rect.width) return;
    const width = this._width;
    const padRight = this._hasSecondaryAxis() ? PAD_RIGHT_AXIS : PAD_RIGHT_NOAXIS;
    const relX = ((ev.clientX - rect.left) / rect.width) * width;
    const ratio = (relX - PAD_LEFT) / (width - PAD_LEFT - padRight);
    const clamped = Math.min(1, Math.max(0, ratio));
    const t =
      this._rangeStart.getTime() +
      clamped * (this._rangeEnd.getTime() - this._rangeStart.getTime());

    this._hoverX = PAD_LEFT + clamped * (width - PAD_LEFT - padRight);
    this._hoverPoints = this._series.map((s) => ({
      series: s,
      point: nearestPoint(s.points, t),
    }));
    this._hoverTime = t;
    this._hoverClientY = ev.clientY - rect.top;
    this.requestUpdate();
  }

  _onPointerLeave() {
    this._hoverX = undefined;
    this._hoverPoints = undefined;
    this.requestUpdate();
  }

  _formatTimeTick(t) {
    const date = new Date(t);
    const hours = this._config.hours_to_show || DEFAULT_HOURS_TO_SHOW;
    if (hours > 30) {
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  render() {
    if (!this._config) return html``;
    const height = this._config.chart_height || 200;
    return html`
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          ${this._error
            ? html`<div class="error">${this._error}</div>`
            : this._renderChart(this._width, height)}
          ${this._config.show_legend !== false && this._series.length
            ? this._renderLegend()
            : ""}
        </div>
      </ha-card>
    `;
  }

  _renderChart(width, height) {
    if (!this._rangeStart) {
      return html`<div class="loading">Loading…</div>`;
    }
    const hasSecondary = this._hasSecondaryAxis();
    const padRight = hasSecondary ? PAD_RIGHT_AXIS : PAD_RIGHT_NOAXIS;
    const plotW = Math.max(width - PAD_LEFT - padRight, 10);
    const plotH = Math.max(height - PAD_TOP - PAD_BOTTOM, 10);

    const domains = {
      primary: this._axisDomain("primary"),
      secondary: hasSecondary ? this._axisDomain("secondary") : undefined,
    };

    const xScale = (t) =>
      PAD_LEFT +
      ((t - this._rangeStart.getTime()) /
        (this._rangeEnd.getTime() - this._rangeStart.getTime() || 1)) *
        plotW;
    const yScale = (v, axis) => {
      const [min, max] = domains[axis] || domains.primary;
      return PAD_TOP + (1 - (v - min) / (max - min || 1)) * plotH;
    };

    const gridLines = 4;
    const gridTicks = Array.from({ length: gridLines + 1 }, (_, i) => i / gridLines);

    return html`
      <div class="chart-wrap">
        <svg
          viewBox="0 0 ${width} ${height}"
          width="100%"
          height="${height}"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          ${svg`
            <g class="grid">
              ${gridTicks.map((f) => {
                const y = PAD_TOP + f * plotH;
                const [min, max] = domains.primary;
                const value = max - f * (max - min);
                return svg`
                  <line x1="${PAD_LEFT}" y1="${y}" x2="${PAD_LEFT + plotW}" y2="${y}" class="grid-line" />
                  <text x="${PAD_LEFT - 6}" y="${y}" class="axis-label axis-label-primary">${formatValue(value, 0)}</text>
                  ${
                    domains.secondary
                      ? (() => {
                          const [smin, smax] = domains.secondary;
                          const svalue = smax - f * (smax - smin);
                          return svg`<text x="${PAD_LEFT + plotW + 6}" y="${y}" class="axis-label axis-label-secondary">${formatValue(svalue, 0)}</text>`;
                        })()
                      : ""
                  }
                `;
              })}
            </g>
            <g class="x-axis">
              ${[0, 0.25, 0.5, 0.75, 1].map((f) => {
                const t = this._rangeStart.getTime() + f * (this._rangeEnd.getTime() - this._rangeStart.getTime());
                const x = PAD_LEFT + f * plotW;
                return svg`<text x="${x}" y="${height - 6}" class="axis-label x-label">${this._formatTimeTick(t)}</text>`;
              })}
            </g>
            <g class="series">
              ${this._series.map((s, i) => this._renderSeries(s, i, xScale, yScale))}
            </g>
            ${
              this._hoverX !== undefined
                ? svg`<line x1="${this._hoverX}" y1="${PAD_TOP}" x2="${this._hoverX}" y2="${PAD_TOP + plotH}" class="crosshair" />`
                : ""
            }
          `}
        </svg>
        ${this._hoverPoints ? this._renderTooltip() : ""}
      </div>
    `;
  }

  _renderSeries(s, i, xScale, yScale) {
    const color = s.config.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
    const axis = s.config.y_axis === "secondary" ? "secondary" : "primary";
    const stepped = s.config.line_type === "step";
    if (!s.points.length) return svg``;
    let d = "";
    s.points.forEach((p, idx) => {
      const x = xScale(p.t);
      const y = yScale(p.v, axis);
      if (idx === 0) {
        d += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      } else if (stepped) {
        const prevY = yScale(s.points[idx - 1].v, axis);
        d += ` L ${x.toFixed(1)} ${prevY.toFixed(1)} L ${x.toFixed(1)} ${y.toFixed(1)}`;
      } else {
        d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
    });
    return svg`<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />`;
  }

  _renderTooltip() {
    if (!this._hoverPoints || !this._hoverPoints.length) return "";
    const time = new Date(this._hoverTime).toLocaleString();
    return html`
      <div class="tooltip">
        <div class="tooltip-time">${time}</div>
        ${this._hoverPoints.map(({ series, point }, i) => {
          if (!point) return "";
          const color = series.config.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const val = formatValue(point.v, series.scale.decimals) + (series.scale.unit ? ` ${series.scale.unit}` : "");
          return html`
            <div class="tooltip-row">
              <span class="marker" style="background:${color}"></span>
              <span class="tooltip-name">${seriesLabel(series.config, this._hass)}</span>
              <span class="tooltip-value">${val}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  _renderLegend() {
    return html`
      <div class="legend">
        ${this._series.map((s, i) => {
          const color = s.config.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const last = s.points.length ? s.points[s.points.length - 1] : undefined;
          const val = last
            ? formatValue(last.v, s.scale.decimals) + (s.scale.unit ? ` ${s.scale.unit}` : "")
            : "–";
          return html`
            <div class="legend-item">
              <span class="marker" style="background:${color}"></span>
              <span class="legend-name">${seriesLabel(s.config, this._hass)}</span>
              <span class="legend-value">${val}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: var(
          --ha-font-family-body,
          var(--paper-font-body1_-_font-family, "Roboto", "Noto Sans", sans-serif)
        );
        color: var(--primary-text-color);
      }
      .card-content {
        padding: 0 16px 16px;
      }
      .loading,
      .error {
        padding: 16px 0;
        color: var(--secondary-text-color);
      }
      .error {
        color: var(--error-color, #db4437);
      }
      .chart-wrap {
        position: relative;
        width: 100%;
      }
      svg {
        display: block;
        overflow: visible;
        touch-action: pan-y;
      }
      .grid-line {
        stroke: var(--divider-color, rgba(127, 127, 127, 0.2));
        stroke-width: 1;
        shape-rendering: crispEdges;
      }
      .axis-label {
        fill: var(--secondary-text-color);
        font-size: 10px;
        font-family: var(
          --ha-font-family-body,
          var(--paper-font-body1_-_font-family, "Roboto", "Noto Sans", sans-serif)
        );
        dominant-baseline: middle;
      }
      .axis-label-primary {
        text-anchor: end;
      }
      .axis-label-secondary {
        text-anchor: start;
      }
      .x-label {
        text-anchor: middle;
        dominant-baseline: auto;
      }
      .crosshair {
        stroke: var(--secondary-text-color);
        stroke-width: 1;
        stroke-dasharray: 3 3;
        pointer-events: none;
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 16px;
        margin-top: 12px;
        font-size: 13px;
        color: var(--primary-text-color);
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .legend-value {
        color: var(--secondary-text-color);
      }
      .marker {
        width: 12px;
        height: 3px;
        border-radius: 1.5px;
        flex: none;
      }
      .tooltip {
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 12px;
        box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0, 0, 0, 0.2));
        pointer-events: none;
        max-width: 220px;
      }
      .tooltip-time {
        font-weight: 500;
        margin-bottom: 4px;
        color: var(--primary-text-color);
      }
      .tooltip-row {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--primary-text-color);
      }
      .tooltip-name {
        flex: 1;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `;
  }
}

customElements.define("attribute-graph-card", AttributeGraphCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "attribute-graph-card",
  name: "Attribute Graph Card",
  description:
    "Graph any entity attribute (brightness, lux, …) over time, styled like the native history card.",
  preview: true,
  documentationURL: "https://github.com/jan-tdy/ha-attribute-graph",
});
