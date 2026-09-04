import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const dev = process.env.ROLLUP_WATCH;

export default {
  input: "src/attribute-graph-card.js",
  output: {
    file: "attribute-graph-card.js",
    format: "es",
    sourcemap: dev ? true : false,
  },
  plugins: [resolve(), !dev && terser()],
};
