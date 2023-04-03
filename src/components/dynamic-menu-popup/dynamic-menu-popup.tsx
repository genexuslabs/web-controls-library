import { Component, Host, h, Prop } from "@stencil/core";

/**
 * @slot data - The slot where you can put the main data of the popup.
 */
@Component({
  tag: "gx-dynamic-menu-popup",
  styleUrl: "dynamic-menu-popup.scss",
  shadow: true
})
export class DynamicMenuPopup {
  /**
   * A CSS class to set as the `gx-dynamic-menu-popup` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the menu popup is opened
   */
  @Prop() readonly opened: boolean = false;

  render() {
    return (
      <Host
        tabindex="0"
        class={{
          [this.cssClass]: !!this.cssClass,
          hidden: !this.opened
        }}
      >
        <slot name="data"></slot>
      </Host>
    );
  }
}
