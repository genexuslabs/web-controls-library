import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  h,
  Host
} from "@stencil/core";
import {
  Component as GxComponent,
  CustomizableComponent,
  DisableableComponent,
  VisibilityComponent
} from "../common/interfaces";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

import { imagePositionClass } from "../common/image-position";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

const ENTER_KEY_CODE = "Enter";
const SPACE_KEY_CODE = "Space";

/**
 * @part caption - The caption displayed at the center of the control.
 *
 * @slot - The slot for the caption displayed.
 * @slot main-image - The slot for the main `img`.
 * @slot disabled-image - The slot for the disabled `img`.
 */
@Component({
  shadow: true,
  styleUrl: "button.scss",
  tag: "gx-button"
})
export class Button
  implements
    GxComponent,
    CustomizableComponent,
    DisableableComponent,
    HighlightableComponent,
    VisibilityComponent
{
  /**
   * `true` if the button has disabled image.
   */
  private hasDisabledImage = false;

  /**
   * `true` if the button has main image.
   */
  private hasMainImage = false;

  @Element() element: HTMLGxButtonElement;

  /**
   * A CSS class to set as the `gx-button` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event). If a disabled image has been specified,
   * it will be shown, hiding the base image (if specified).
   */
  @Prop() readonly disabled = false;

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
  @Prop() readonly imagePosition:
    | "above"
    | "before"
    | "after"
    | "below"
    | "behind" = "above";

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = true;

  /**
   * This attribute lets you specify the width.
   */
  @Prop() readonly width: string = "";

  /**
   * This attribute lets you specify the height.
   */
  @Prop() readonly height: string = "";

  /**
   * Emitted when the element is clicked, the enter key is pressed or the space key is pressed and released.
   */
  @Event() click: EventEmitter;

  private handleKeyDown = (event: KeyboardEvent) => {
    // The action button is activated by space on the keyup event, but the
    // default action for space is already triggered on keydown. It needs to be
    // prevented to stop scrolling the page before activating the button.
    if (event.code === SPACE_KEY_CODE) {
      event.preventDefault();
    }

    // If enter is pressed, activate the button
    if (event.code === ENTER_KEY_CODE) {
      event.preventDefault();
      this.handleButtonAction();
    }
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === SPACE_KEY_CODE) {
      event.preventDefault();
      this.handleButtonAction();
    }
  };

  private handleButtonAction = () => {
    // In some cases, the button could be disabled between the keydown and keyup
    if (this.disabled) {
      return;
    }
    this.click.emit();
  };

  componentWillLoad() {
    const mainImage = this.element.querySelector(
      ":scope > [slot='main-image']"
    );
    const disabledImage = this.element.querySelector(
      ":scope > [slot='disabled-image']"
    );

    this.hasMainImage = mainImage !== null;
    this.hasDisabledImage = disabledImage !== null;
  }

  componentDidLoad() {
    makeHighlightable(this);
  }

  render() {
    // Styling for gx-button control.
    const classes = getClasses(this.cssClass);

    /** True if the button does not have any text */
    const isEmptyCaption = this.element.textContent.trim() === "";

    return (
      <Host
        role="button"
        aria-disabled={this.disabled ? "true" : undefined}
        class={{
          [this.cssClass]: !!this.cssClass,
          [classes.vars]: true,
          disabled: this.disabled,

          // Strings with only white spaces are taken as null captions
          "empty-caption": isEmptyCaption,

          [imagePositionClass(this.imagePosition)]:
            this.hasMainImage || this.hasDisabledImage
        }}
        style={{
          "--width": !!this.width ? this.width : null,
          "--height": !!this.height ? this.height : null
        }}
        data-has-action={!this.disabled ? "" : undefined} // Mouse pointer to indicate action
        tabindex={this.highlightable && !this.disabled ? "0" : undefined} // Add focus to the control through sequential keyboard navigation and visually clicking
        // Implement button events
        onKeyDown={!this.disabled ? this.handleKeyDown : undefined}
        onKeyUp={!this.disabled ? this.handleKeyUp : undefined}
      >
        {!isEmptyCaption && (
          <span class="caption" part="caption">
            <slot />
          </span>
        )}

        {
          // Main image
          this.hasMainImage && (!this.disabled || !this.hasDisabledImage) && (
            <slot name="main-image" aria-hidden="true" />
          )
        }

        {
          // Disabled image
          this.hasDisabledImage && this.disabled && (
            <slot name="disabled-image" aria-hidden="true" />
          )
        }
      </Host>
    );
  }
}
