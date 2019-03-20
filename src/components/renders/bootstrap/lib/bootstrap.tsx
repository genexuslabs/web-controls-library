import { Component } from "@stencil/core";

@Component({
  shadow: false,
  styleUrl: "bootstrap.scss",
  tag: "gx-bootstrap"
})
export class Bootstrap {
  render() {
    return <slot />;
  }
}
