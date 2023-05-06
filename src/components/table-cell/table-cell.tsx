import { Component, Element, Prop, h, Host } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: true,
  tag: "gx-table-cell"
})
export class TableCell implements GxComponent {
  private observer: MutationObserver = null;

  @Element() element: HTMLGxTableCellElement;

  /**
   * Like the `grid-area` CSS property, this attribute gives a name to the item,
   * so it can be used from the [areas-template attributes](../table/readme.md#areas-template)
   * of the gx-table element.
   */
  @Prop() readonly area: string = null;

  /**
   * Defines the horizontal alignment of the content of the cell.
   */
  @Prop({ reflect: true }) readonly align: "left" | "right" | "center";

  /**
   * This attribute defines the maximum height of the cell.
   */
  @Prop() readonly maxHeight: string = null;

  /**
   * This attribute defines the minimum height of the cell when its contents are visible.
   * Ignored if its content has `invisible-mode="collapse"` and is hidden.
   */
  @Prop() readonly minHeight: string = null;

  /**
   * Defines the vertical alignment of the content of the cell.
   */
  @Prop({ reflect: true }) readonly valign: "top" | "bottom" | "middle";

  componentDidLoad() {
    const childElement: any = this.element.firstElementChild;

    if (childElement?.getAttribute("invisible-mode") !== "collapse") {
      return;
    }

    this.setVisibilityBasedOnChildElement(childElement);

    this.setupObserver(childElement);
  }

  /**
   * Based on the visibility of the child element, it sets the visibility of
   * the gx-table-cell control.
   * @param childElement The direct child element of the control.
   */
  private setVisibilityBasedOnChildElement(childElement: any) {
    // "null" will fallback to the default visibility, which is "flex"
    this.element.style.display = childElement.hidden ? "none" : null;
  }

  /**
   * Set a MutationObserver to watch for changes to the hidden attribute on the
   * direct child element.
   * @param childElement The direct child element of the control.
   */
  private setupObserver(childElement: any) {
    this.observer = new MutationObserver(() => {
      this.setVisibilityBasedOnChildElement(childElement);
    });

    this.observer.observe(childElement, {
      attributes: true,
      attributeFilter: ["hidden"],
      childList: false,
      subtree: false
    });
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  render() {
    return (
      <Host
        class="gx-cell"
        style={{
          "grid-area": this.area,
          "min-height": this.minHeight,
          "max-height": this.maxHeight
        }}
      >
        <slot />
      </Host>
    );
  }
}
