const cfg = require ("cypress");

module.exports = cfg.defineConfig({
  component: {
    devServer: {
      framework: "svelte",
      bundler: "vite",
    },
  },
});
