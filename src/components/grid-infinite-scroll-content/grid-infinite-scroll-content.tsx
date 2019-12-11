import { Component, ComponentInterface, Element, h, Host } from "@stencil/core";

@Component({
  shadow: false,
  styleUrl: "grid-infinite-scroll-content.scss",
  tag: "gx-grid-infinite-scroll-content"
})
export class InfiniteScrollContent implements ComponentInterface {
  @Element() el!: HTMLGxGridInfiniteScrollContentElement;

  render() {
    return (
      <Host class="infinite-scroll-content">
        <slot />
      </Host>
    );
  }
}
