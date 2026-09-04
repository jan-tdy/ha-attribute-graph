export const CARD_VERSION = "1.0.0b1";

export const DEFAULT_HOURS_TO_SHOW = 24;

// Same rotating palette style used across HA history / logbook charts.
export const DEFAULT_COLORS = [
  "#03a9f4",
  "#ff9800",
  "#4caf50",
  "#e91e63",
  "#9c27b0",
  "#795548",
  "#607d8b",
  "#cddc39",
  "#00bcd4",
  "#f44336",
];

// Known attributes whose raw value is not directly human readable.
// Used to auto-scale onto a readable range (e.g. brightness 0-255 -> 0-100%)
// unless the user overrides via `raw: true` or an explicit `scale`.
export const KNOWN_ATTRIBUTE_SCALES = {
  brightness: { factor: 100 / 255, offset: 0, unit: "%", decimals: 0 },
  color_temp_kelvin: { factor: 1, offset: 0, unit: "K", decimals: 0 },
  battery_level: { factor: 1, offset: 0, unit: "%", decimals: 0 },
  humidity: { factor: 1, offset: 0, unit: "%", decimals: 0 },
  current_temperature: { factor: 1, offset: 0, unit: "°", decimals: 1 },
};
