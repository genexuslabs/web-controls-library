import { Component, Element } from "@stencil/core";

@Component({
  shadow: false,
  styleUrl: "layout-editor-placeholder.scss",
  tag: "gx-layout-editor-placeholder"
})
export class LayoutEditorPlaceholder {
  @Element() element: HTMLElement;

  render() {
    return <slot />;
  }
}
