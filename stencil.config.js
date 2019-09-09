const { sass } = require("@stencil/sass");

exports.config = {
  bundles: [
    {
      components: [
        "gx-bootstrap",
        "gx-navbar",
        "gx-navbar-link",
        "gx-message",
        "gx-progress-bar",
        "gx-modal",
        "gx-button",
        "gx-card",
        "gx-table",
        "gx-table-cell"
      ]
    }
  ],
  copy: [
    {
      src: "../node_modules/font-awesome/fonts",
      dest: "bootstrap/font-awesome/fonts"
    }
  ],
  namespace: "gx-web-controls",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader"
    },
    {
      type: "docs-readme"
    },
    {
      type: "www",
      serviceWorker: null
    }
  ],
  plugins: [sass()]
};
