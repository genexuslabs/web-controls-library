import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  Watch,
  h,
  Host
} from "@stencil/core";
import {
  Component as GxComponent,
  DisableableComponent
} from "../common/interfaces";
import {
  imagePositionRender,
  imagePositionClass,
  hideMainImageWhenDisabledClass
} from "../common/image-position";

let autoTabId = 0;

@Component({
  shadow: false,
  styleUrl: "tab-caption.scss",
  tag: "gx-tab-caption"
})
export class TabCaption implements GxComponent, DisableableComponent {
  constructor() {
    this.clickHandler = this.clickHandler.bind(this);
  }

  private hasDisabledImage = false;

  @Element() element: HTMLGxTabCaptionElement;

  /**
   * This attribute lets you specify if the tab page is disabled
   *
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
  @Prop() readonly imagePosition:
    | "above"
    | "before"
    | "after"
    | "below"
    | "behind" = "above";

  /**
   * This attribute lets you specify if the tab page corresponding to this caption is selected
   *
   */
  @Prop() selected = false;

  @Watch("selected")
  selectedHandler() {
    if (this.selected) {
      this.tabSelect.emit(event);
    }
  }

  /**
   * Fired when the tab caption is selected
   *
   */
  @Event() tabSelect: EventEmitter;

  componentWillLoad() {
    if (!this.element.id) {
      this.element.id = `gx-tab-caption-auto-id-${autoTabId++}`;
    }
    this.hasDisabledImage =
      this.element.querySelector("[slot='disabled-image']") !== null;
  }

  render() {
    this.element.setAttribute("aria-selected", (!!this.selected).toString());

    return (
      <Host
        role="tab"
        class={{
          "gx-tab-caption--unselected": !this.selected,
          [imagePositionClass(this.imagePosition)]: true,
          [hideMainImageWhenDisabledClass]:
            !this.selected && this.hasDisabledImage
        }}
      >
        <a
          class={{
            active: this.selected,
            disabled: this.disabled,
            "nav-link": true
          }}
          href="#"
          onClick={!this.disabled ? this.clickHandler : null}
        >
          {imagePositionRender({
            default: <slot />,
            disabledImage: <slot name="disabled-image" />,
            mainImage: <slot name="main-image" />
          })}
        </a>
      </Host>
    );
  }

  private clickHandler(event: UIEvent) {
    event.preventDefault();
    this.selected = true;
  }
}
