const { sass } = require("@stencil/sass");

exports.config = {
  copy: [
    {
      src: "../node_modules/font-awesome/fonts",
      dest: "bootstrap/font-awesome/fonts"
    }
  ],
  namespace: "gx-web-controls",
  outputTargets: [
    {
      type: "dist"
    },
    {
      type: "www",
      serviceWorker: false
    }
  ],
  plugins: [sass()]
};
