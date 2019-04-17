import { Component, ComponentInterface, Element, Prop } from "@stencil/core";
import {
  IVisibilityComponent,
  IDisableableComponent
} from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "grid-fs.scss",
  tag: "gx-grid-fs"
})
export class GridFreeStyle
  implements ComponentInterface, IDisableableComponent, IVisibilityComponent {
  @Element() el!: HTMLElement;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() disabled = false;

  render() {    
    return (
      <div>
        <slot name="grid-content" />
        <div class='grid-empty-placeholder'>
          <slot name="grid-content-empty" />
        </div>
        <slot/>
      </div>
    );
  }

  hostData() {
    let emptyGridData = !this.el
      .querySelector("[slot='grid-content']")
      .hasChildNodes();
      //let emptyGridData = false;
    return {
      class: {
        'gx-empty-grid': emptyGridData
      }
    }

  }
}
