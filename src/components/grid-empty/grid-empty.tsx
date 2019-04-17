import { Component, ComponentInterface } from "@stencil/core";

@Component({
  shadow: false,
  styleUrl: "grid-empty.scss",
  tag: "gx-grid-empty"
})
export class GridEmptyPlaceholder implements ComponentInterface {
  render() {    
    return (
      <div>
        <slot name="image-placeholder" />
        <slot name="text-placeholder" />
        <slot />
      </div>
    );
  }
}
