import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";

export const config: Config = {
  bundles: [
    {
      components: [
        "gx-bootstrap",
        "gx-layout",
        "gx-navbar",
        "gx-navbar-item",
        "gx-message",
        "gx-progress-bar",
        "gx-modal",
        "gx-button",
        "gx-card",
        "gx-table",
        "gx-table-cell"
      ]
    },
    {
      components: ["gx-tab", "gx-tab-caption", "gx-tab-page"]
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
