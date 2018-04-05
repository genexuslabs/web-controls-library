import { BaseComponent } from "../common/base-component";
import { ButtonRender } from "../renders";
import { Component, Element, Event, EventEmitter, Prop } from "@stencil/core";

@Component({
  shadow: false,
  styleUrl: "button.scss",
  tag: "gx-button"
})
export class Button extends ButtonRender(BaseComponent) {
  @Element() element: HTMLElement;

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
   * (for example, click event). If a disabled image has been specified,
   * it will be shown, hiding the base image (if specified).
   */
  @Prop() disabled = false;

  /**
   * This attribute lets you specify the relative location of the image to the text.
   *
   * | Value    | Details                                                 |
   * | -------- | ------------------------------------------------------- |
   * | `above`  | The image is located above the text.                    |
   * | `before` | The image is located before the text, in the same line. |
   * | `after`  | The image is located after the text, in the same line.  |
   * | `below`  | The image is located below the text.                    |
   * | `behind` | The image is located behind the text.                   |
   */
  @Prop()
  imagePosition: "above" | "before" | "after" | "below" | "behind" = "above";

  /**
   * This attribute lets you specify the size of the button.
   *
   * | Value    | Details                                                 |
   * | -------- | ------------------------------------------------------- |
   * | `large`  | Large sized button.                                     |
   * | `normal` | Standard sized button.                                  |
   * | `small`  | Small sized button.                                     |
   */
  @Prop() size: "large" | "normal" | "small" = "normal";

  /**
   * Emitted when the element is clicked.
   */
  @Event() onClick: EventEmitter;

  hostData() {
    return {
      role: "button"
    };
  }
}
