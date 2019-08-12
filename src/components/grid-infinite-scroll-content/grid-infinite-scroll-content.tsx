import { Component, ComponentInterface, Element, h } from "@stencil/core";

@Component({
  shadow: false,
  styleUrl: "grid-infinite-scroll-content.scss",
  tag: "gx-grid-infinite-scroll-content"
})
export class InfiniteScrollContent implements ComponentInterface {
  @Element() el!: HTMLElement;

  render() {
    return <slot />;
  }

  hostData() {
    return {
      class: {
        "infinite-scroll-content": true
      }
    };
  }
}
