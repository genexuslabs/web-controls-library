import { Component, Element, Prop, h, Host } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "table-cell.scss",
  tag: "gx-table-cell"
})
export class TableCell implements GxComponent {
  @Element() element: HTMLGxTableCellElement;

  /**
   * Like the `grid-area` CSS property, this attribute gives a name to the item,
   * so it can be used from the [areas-template attributes](../table/readme.md#areas-template)
   * of the gx-table element.
   */
  @Prop() readonly area: string;

  /**
   * Defines the horizontal aligmnent of the content of the cell.
   */
  @Prop({ reflect: true }) readonly align: "left" | "right" | "center" = "left";

  /**
   * This attribute defines how the control behaves when the content overflows.
   *
   * | Value    | Details                                                     |
   * | -------- | ----------------------------------------------------------- |
   * | `scroll` | The overflowin content is hidden, but scrollbars are shown  |
   * | `clip`   | The overflowing content is hidden, without scrollbars       |
   *
   */
  @Prop() readonly overflowMode: "scroll" | "clip";

  /**
   * This attribute defines the maximum height of the cell.
   *
   */
  @Prop() readonly maxHeight: string;

  /**
   * This attribute defines the minimum height of the cell when its contents are visible.
   * Ignored if its content has `invisible-mode` = `collapse` and is hidden.
   *
   */
  @Prop() readonly minHeight: string;

  /**
   * True to add a fading overlay on the right and bottom area of the cell to signify
   * that the content is longer than the space allows.
   */
  @Prop() readonly showContentFade = false;

  /**
   * Defines the vertical aligmnent of the content of the cell.
   */
  @Prop({ reflect: true }) readonly valign: "top" | "bottom" | "medium" = "top";

  private observer: MutationObserver;

  componentDidRender() {
    this.setMinHeight(this.element.firstElementChild);
    this.setMaxHeight();
  }

  componentDidLoad() {
    this.setupObserver(this.element.firstElementChild);
  }

  private setupObserver(childElement: any) {
    if (childElement && childElement.invisibleMode === "collapse") {
      this.observer = new MutationObserver(() => {
        this.setMinHeight(childElement);
      });

      this.observer.observe(childElement, {
        attributes: true,
        attributeFilter: ["hidden"],
        childList: false,
        subtree: false
      });
    }
  }

  private setMinHeight(childElement: any) {
    if (childElement) {
      this.element.style.minHeight =
        childElement.invisibleMode === "collapse" && childElement.hidden
          ? "0"
          : this.minHeight;
    }
  }

  private setMaxHeight() {
    this.element.style.maxHeight = this.maxHeight;
  }

  disconnectedCallback() {
    if (this.observer !== undefined) {
      this.observer.disconnect();
    }
  }

  render() {
    if (this.area) {
      this.element.style["gridArea"] = this.area;
    }

    return (
      <Host
        class={{
          "gx-long-content-fade": this.showContentFade
        }}
      >
        <slot />
      </Host>
    );
  }
}
