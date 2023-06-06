import cfg from 'cypress'

export default cfg.defineConfig({
  component: {
    devServer: {
      framework: "svelte",
      bundler: "vite",
    },
  },
});
