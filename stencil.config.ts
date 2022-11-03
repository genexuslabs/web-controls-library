import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";
import { reactOutputTarget } from "@stencil/react-output-target";

export const config: Config = {
  bundles: [
    {
      components: ["gx-action-sheet", "gx-action-sheet-item"]
    },
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
      components: ["gx-gauge", "gx-gauge-range"]
    },
    {
      components: [
        "gx-grid-flex",
        "gx-grid-fs",
        "gx-grid-horizontal",
        "gx-grid-smart-css",
        "gx-grid-smart-cell",
        "gx-grid-infinite-scroll",
        "gx-grid-infinite-scroll-content",
        "gx-grid-empty-indicator"
      ]
    },
    {
      components: ["gx-grid-image-map", "gx-grid-image-map-item"]
    }
  ],
  namespace: "gx-web-controls",
  globalStyle: "src/global/common.scss",
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
    },
    reactOutputTarget({
      componentCorePackage: "@genexus/web-controls-library",
      proxiesFile: "../web-controls-library-react/src/components.ts"
    })
  ],
  plugins: [sass()]
};
