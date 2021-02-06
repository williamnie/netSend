
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/renderer"),
      components: path.resolve(__dirname, "src/renderer/components/"),
      acore: path.resolve(__dirname, "src/renderer/acore/"),
      pages: `${__dirname}/src/renderer/pages`,
      models: `${__dirname}/src/renderer/models`,
      services: `${__dirname}/src/renderer/services`,
      plugin: `${__dirname}/src/renderer/plugin`,
      utils: `${__dirname}/src/renderer/utils`,
    }
  }
};
