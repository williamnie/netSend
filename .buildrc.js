
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/renderer"),
      components: path.resolve(__dirname, "src/renderer/components/"),
      pages: `${__dirname}/src/renderer/pages`,
      models: `${__dirname}/src/renderer/models`,
      utils: `${__dirname}/src/renderer/utils`,
    }
  }
};
