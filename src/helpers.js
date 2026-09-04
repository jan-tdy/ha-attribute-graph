import { KNOWN_ATTRIBUTE_SCALES } from "./const.js";

/** Resolve the effective scaling (factor/offset/unit) for a series config. */
export function resolveScale(series) {
  if (series.raw) {
    return { factor: 1, offset: 0, unit: series.unit || "", decimals: series.decimals };
  }
  if (series.scale) {
    return {
      factor: series.scale.factor ?? 1,
      offset: series.scale.offset ?? 0,
      unit: series.unit ?? series.scale.unit ?? "",
      decimals: series.decimals ?? series.scale.decimals,
    };
  }
  const known = series.attribute ? KNOWN_ATTRIBUTE_SCALES[series.attribute] : undefined;
  if (known) {
    return {
      factor: known.factor,
      offset: known.offset,
      unit: series.unit ?? known.unit,
      decimals: series.decimals ?? known.decimals,
    };
  }
  return { factor: 1, offset: 0, unit: series.unit || "", decimals: series.decimals };
}

/** Extract a numeric raw value for one series from a recorder state row. */
export function extractRawValue(stateRow, series) {
  let raw;
  if (series.attribute) {
    raw = stateRow.attributes ? stateRow.attributes[series.attribute] : undefined;
  } else {
    raw = stateRow.state;
  }
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw === "boolean") return raw ? 1 : 0;
  if (typeof raw === "string") {
    if (raw === "on" || raw === "home" || raw === "open" || raw === "unlocked") return 1;
    if (raw === "off" || raw === "not_home" || raw === "closed" || raw === "locked") return 0;
    if (raw === "unknown" || raw === "unavailable" || raw === "") return undefined;
  }
  const num = Number(raw);
  return Number.isNaN(num) ? undefined : num;
}

/** Apply the resolved scale to a raw numeric value. */
export function applyScale(rawValue, scale) {
  return rawValue * scale.factor + scale.offset;
}

export function formatValue(value, decimals) {
  if (value === undefined || value === null || Number.isNaN(value)) return "";
  if (decimals === undefined || decimals === null) {
    return Math.round(value * 100) / 100 + "";
  }
  return value.toFixed(decimals);
}

export function seriesLabel(series, hass) {
  if (series.name) return series.name;
  const stateObj = hass && hass.states[series.entity];
  const friendly = (stateObj && stateObj.attributes.friendly_name) || series.entity;
  return series.attribute ? `${friendly} · ${series.attribute}` : friendly;
}
