const sass = require("@stencil/sass");

exports.config = {
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
