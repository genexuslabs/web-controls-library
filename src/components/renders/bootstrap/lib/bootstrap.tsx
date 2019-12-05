import { Component, h } from "@stencil/core";

@Component({
  shadow: false,
  styleUrl: "bootstrap.scss",
  tag: "gx-bootstrap"
})
export class Bootstrap {
  render() {
    return (
      <Host aria-hidden="true" hidden={true}>
        <slot />
      </Host>
    );
  }
}
