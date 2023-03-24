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
        "gx-button",
        "gx-card",
        "gx-icon",
        "gx-image",
        "gx-layout",
        "gx-loading",
        "gx-message",
        "gx-modal",
        "gx-progress-bar",
        "gx-table",
        "gx-table-cell",
        "gx-textblock"
      ]
    },
    {
      components: ["gx-canvas", "gx-canvas-cell"]
    },
    {
      components: ["gx-form-field", "gx-edit"]
    },
    {
      components: ["gx-gauge", "gx-gauge-range"]
    },
    {
      components: ["gx-grid-image-map", "gx-grid-image-map-item"]
    },
    {
      components: ["gx-grid-infinite-scroll", "gx-grid-infinite-scroll-content"]
    },
    {
      components: ["gx-grid-smart-cell", "gx-grid-empty-indicator"]
    },
    {
      components: ["gx-map", "gx-map-marker"]
    },
    {
      components: ["gx-navbar", "gx-navbar-item"]
    },
    {
      components: ["gx-radio-group", "gx-radio-option"]
    },
    {
      components: ["gx-select", "gx-select-option"]
    },
    {
      components: ["gx-tab", "gx-tab-caption", "gx-tab-page"]
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
