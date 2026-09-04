import { LitElement, html, css } from "lit";
import { DEFAULT_HOURS_TO_SHOW } from "./const.js";

const fireEvent = (node, type, detail = {}, options = {}) => {
  const event = new CustomEvent(type, {
    bubbles: options.bubbles !== undefined ? options.bubbles : true,
    cancelable: Boolean(options.cancelable),
    composed: options.composed !== undefined ? options.composed : true,
    detail,
  });
  node.dispatchEvent(event);
  return event;
};

class AttributeGraphCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: { state: true },
      _expanded: { state: true },
    };
  }

  constructor() {
    super();
    this._expanded = -1;
  }

  setConfig(config) {
    this._config = {
      entities: [],
      ...config,
    };
  }

  _entityAttributes(entityId) {
    if (!this.hass || !entityId || !this.hass.states[entityId]) return [];
    return Object.keys(this.hass.states[entityId].attributes).filter(
      (a) => typeof this.hass.states[entityId].attributes[a] !== "object"
    );
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const target = ev.target;
    const key = target.getAttribute("data-key");
    if (!key) return;
    let value = target.value;
    if (target.type === "checkbox") value = target.checked;
    if (target.type === "number") value = value === "" ? undefined : Number(value);
    const newConfig = { ...this._config, [key]: value };
    this._config = newConfig;
    fireEvent(this, "config-changed", { config: newConfig });
  }

  _entityChanged(index, ev) {
    const entities = [...this._config.entities];
    entities[index] = { ...entities[index], entity: ev.target.value };
    this._updateEntities(entities);
  }

  _seriesFieldChanged(index, key, ev) {
    const entities = [...this._config.entities];
    let value = ev.target.value;
    if (ev.target.type === "checkbox") value = ev.target.checked;
    if (["min", "max"].includes(key)) {
      value = value === "" ? undefined : Number(value);
    }
    const entry = { ...entities[index] };
    if (value === undefined || value === "") {
      delete entry[key];
    } else {
      entry[key] = value;
    }
    entities[index] = entry;
    this._updateEntities(entities);
  }

  _addEntity() {
    const entities = [...this._config.entities, { entity: "" }];
    this._expanded = entities.length - 1;
    this._updateEntities(entities);
  }

  _removeEntity(index) {
    const entities = [...this._config.entities];
    entities.splice(index, 1);
    this._updateEntities(entities);
  }

  _moveEntity(index, dir) {
    const entities = [...this._config.entities];
    const target = index + dir;
    if (target < 0 || target >= entities.length) return;
    [entities[index], entities[target]] = [entities[target], entities[index]];
    this._updateEntities(entities);
  }

  _toggleExpanded(index) {
    this._expanded = this._expanded === index ? -1 : index;
  }

  _updateEntities(entities) {
    const newConfig = { ...this._config, entities };
    this._config = newConfig;
    fireEvent(this, "config-changed", { config: newConfig });
  }

  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="card-config">
        <div class="row">
          <ha-textfield
            label="Title (optional)"
            data-key="title"
            .value=${this._config.title || ""}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row two-col">
          <ha-textfield
            label="Hours to show"
            type="number"
            min="1"
            data-key="hours_to_show"
            .value=${this._config.hours_to_show ?? DEFAULT_HOURS_TO_SHOW}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-textfield
            label="Refresh interval (s, 0 = off)"
            type="number"
            min="0"
            data-key="refresh_interval"
            .value=${this._config.refresh_interval ?? 60}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row two-col">
          <ha-textfield
            label="Chart height (px)"
            type="number"
            min="80"
            data-key="chart_height"
            .value=${this._config.chart_height ?? 200}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-formfield label="Show legend">
            <ha-switch
              data-key="show_legend"
              .checked=${this._config.show_legend !== false}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
        </div>

        <h3>Entities / attributes</h3>
        <div class="entities">
          ${(this._config.entities || []).map((entry, index) => this._renderEntityRow(entry, index))}
        </div>
        <ha-button @click=${this._addEntity}>+ Add entity</ha-button>
      </div>
    `;
  }

  _renderEntityRow(entry, index) {
    const attrs = this._entityAttributes(entry.entity);
    const expanded = this._expanded === index;
    return html`
      <div class="entity-row">
        <div class="entity-row-header" @click=${() => this._toggleExpanded(index)}>
          <span class="handle">${index + 1}.</span>
          <span class="summary">
            ${entry.entity || "(choose entity)"}${entry.attribute ? ` · ${entry.attribute}` : ""}
          </span>
          <span class="actions">
            <ha-icon-button @click=${(e) => { e.stopPropagation(); this._moveEntity(index, -1); }}>
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </ha-icon-button>
            <ha-icon-button @click=${(e) => { e.stopPropagation(); this._moveEntity(index, 1); }}>
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </ha-icon-button>
            <ha-icon-button @click=${(e) => { e.stopPropagation(); this._removeEntity(index); }}>
              <ha-icon icon="mdi:delete"></ha-icon>
            </ha-icon-button>
          </span>
        </div>
        ${expanded
          ? html`
              <div class="entity-row-body">
                <ha-entity-picker
                  .hass=${this.hass}
                  .value=${entry.entity || ""}
                  @value-changed=${(ev) => this._entityChanged(index, { target: { value: ev.detail.value } })}
                ></ha-entity-picker>

                <div class="row two-col">
                  <ha-select
                    label="Attribute (empty = main state)"
                    .value=${entry.attribute || ""}
                    @selected=${(ev) => this._seriesFieldChanged(index, "attribute", { target: { value: ev.target.value, type: "text" } })}
                    @closed=${(e) => e.stopPropagation()}
                  >
                    <mwc-list-item value="">(state)</mwc-list-item>
                    ${attrs.map((a) => html`<mwc-list-item .value=${a}>${a}</mwc-list-item>`)}
                  </ha-select>
                  <ha-textfield
                    label="Name (optional)"
                    .value=${entry.name || ""}
                    @input=${(ev) => this._seriesFieldChanged(index, "name", ev)}
                  ></ha-textfield>
                </div>

                <div class="row two-col">
                  <ha-textfield
                    label="Color (optional, e.g. #ff9800)"
                    .value=${entry.color || ""}
                    @input=${(ev) => this._seriesFieldChanged(index, "color", ev)}
                  ></ha-textfield>
                  <ha-textfield
                    label="Unit override (optional)"
                    .value=${entry.unit || ""}
                    @input=${(ev) => this._seriesFieldChanged(index, "unit", ev)}
                  ></ha-textfield>
                </div>

                <div class="row two-col">
                  <ha-select
                    label="Y axis"
                    .value=${entry.y_axis || "primary"}
                    @selected=${(ev) => this._seriesFieldChanged(index, "y_axis", { target: { value: ev.target.value, type: "text" } })}
                    @closed=${(e) => e.stopPropagation()}
                  >
                    <mwc-list-item value="primary">Primary (left)</mwc-list-item>
                    <mwc-list-item value="secondary">Secondary (right)</mwc-list-item>
                  </ha-select>
                  <ha-select
                    label="Line style"
                    .value=${entry.line_type || "linear"}
                    @selected=${(ev) => this._seriesFieldChanged(index, "line_type", { target: { value: ev.target.value, type: "text" } })}
                    @closed=${(e) => e.stopPropagation()}
                  >
                    <mwc-list-item value="linear">Linear</mwc-list-item>
                    <mwc-list-item value="step">Step</mwc-list-item>
                  </ha-select>
                </div>

                <ha-formfield
                  label="Show raw value (disable automatic scaling, e.g. keep brightness as 0-255)"
                >
                  <ha-switch
                    .checked=${Boolean(entry.raw)}
                    @change=${(ev) => this._seriesFieldChanged(index, "raw", ev)}
                  ></ha-switch>
                </ha-formfield>
              </div>
            `
          : ""}
      </div>
    `;
  }

  static get styles() {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .row {
        display: flex;
        gap: 12px;
      }
      .row > * {
        flex: 1;
      }
      h3 {
        margin: 8px 0 0;
        font-size: 14px;
        color: var(--secondary-text-color);
      }
      .entities {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .entity-row {
        border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
        border-radius: 8px;
        overflow: hidden;
      }
      .entity-row-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        cursor: pointer;
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
      }
      .handle {
        color: var(--secondary-text-color);
        font-size: 12px;
      }
      .summary {
        flex: 1;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .actions {
        display: flex;
      }
      .entity-row-body {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
      }
      ha-textfield,
      ha-select {
        width: 100%;
      }
    `;
  }
}

customElements.define("attribute-graph-card-editor", AttributeGraphCardEditor);
