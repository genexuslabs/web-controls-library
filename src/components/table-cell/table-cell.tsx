import { Component, Element, Prop, h } from "@stencil/core";
import { IComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "table-cell.scss",
  tag: "gx-table-cell"
})
export class TableCell implements IComponent {
  @Element() element: HTMLElement;

  /**
   * Like the `grid-area` CSS property, this attribute gives a name to the item,
   * so it can be used from the [areas-template attributes](../table/readme.md#areas-template)
   * of the gx-table element.
   */
  @Prop() area: string;

  /**
   * Defines the horizontal aligmnent of the content of the cell.
   */
  @Prop() align: "left" | "right" | "center" = "left";

  /**
   * This attribute defines how the control behaves when the content overflows.
   *
   * | Value    | Details                                                     |
   * | -------- | ----------------------------------------------------------- |
   * | `scroll` | The overflowin content is hidden, but scrollbars are shown  |
   * | `clip`   | The overflowing content is hidden, without scrollbars       |
   *
   */
  @Prop() overflowMode: "scroll" | "clip";

  /**
   * This attribute defines the maximum height of the cell.
   *
   */
  @Prop() maxHeight: string;

  /**
   * This attribute defines the minimum height of the cell when its contents are visible.
   * Ignored if its content has `invisible-mode` = `collapse` and is hidden.
   *
   */
  @Prop() minHeight: string;

  /**
   * Defines the vertical aligmnent of the content of the cell.
   */
  @Prop() valign: "top" | "bottom" | "medium" = "top";

  private observer: MutationObserver;

  componentDidRender() {
    this.setMinHeight(this.element.firstElementChild);
    this.setMaxHeight();
  }

  componentDidLoad() {
    this.setupObserver(this.element.firstElementChild);
  }

  private setupObserver(childElement: any) {
    if (childElement.invisibleMode === "collapse") {
      this.observer = new MutationObserver(
        (mutationsList: MutationRecord[]) => {
          for (const mutation of mutationsList) {
            if (
              mutation.type === "attributes" &&
              mutation.attributeName === "hidden"
            ) {
              this.setMinHeight(childElement);
            }
          }
        }
      );

      this.observer.observe(childElement, {
        attributes: true,
        childList: false,
        subtree: false
      });
    }
  }

  private setMinHeight(childElement: any) {
    this.element.style.minHeight =
      childElement.invisibleMode === "collapse" && childElement.hidden
        ? "0"
        : this.minHeight;
  }

  private setMaxHeight() {
    this.element.style.maxHeight = this.maxHeight;
  }

  componentDidUnload() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  render() {
    if (this.element) {
      if (this.area) {
        // tslint:disable-next-line
        this.element.style["gridArea"] = this.area;
      }
    }

    return [<slot />];
  }
}
