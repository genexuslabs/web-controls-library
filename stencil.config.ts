import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";

export const config: Config = {
  bundles: [
    {
      components: [
        "gx-bootstrap",
        "gx-layout",
        "gx-icon",
        "gx-navbar",
        "gx-navbar-item",
        "gx-message",
        "gx-progress-bar",
        "gx-modal",
        "gx-button",
        "gx-card",
        "gx-table",
        "gx-table-cell",
        "gx-image",
        "gx-textblock"
      ]
    },
    {
      components: ["gx-tab", "gx-tab-caption", "gx-tab-page"]
    },
    {
      components: ["gx-canvas", "gx-canvas-cell"]
    },
    {
      components: ["gx-map", "gx-map-marker"]
    },
    {
      components: ["gx-form-field", "gx-edit"]
    },
    {
      components: [
        "gx-grid-fs",
        "gx-grid-smart",
        "gx-grid-smart-flex",
        "gx-grid-infinite-scroll",
        "gx-grid-infinite-scroll-content",
        "gx-grid-empty-indicator"
      ]
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
