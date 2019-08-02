import { Component, h } from "@stencil/core";

@Component({
  shadow: false,
  styleUrl: "bootstrap.scss",
  tag: "gx-bootstrap"
})
export class Bootstrap {
  hostData() {
    return {
      "aria-hidden": "true"
    };
  }
  render() {
    return <slot />;
  }
}
