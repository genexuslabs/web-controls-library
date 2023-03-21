import { Component, Element, Prop, h, Listen } from "@stencil/core";
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
import { DISABLED_CLASS } from "../../common/reserved-names";

const targetMap = {
  "current-tab": "_self",
  "new-tab": "_blank"
};

/**
 * @slot - The default slot that is placed inside the `a` tag.
 */
@Component({
  shadow: false,
  styleUrl: "anchor.scss",
  tag: "gx-anchor"
})
export class Anchor
  implements
    GxComponent,
    CustomizableComponent,
    DisableableComponent,
    HighlightableComponent,
    VisibilityComponent {
  // Refs
  private linkElement: HTMLAnchorElement;

  @Element() element: HTMLGxAnchorElement;

  /**
   * A CSS class to set as the `gx-anchor` element class.
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
   * This attribute lets you specify if the element is disabled. If disabled,
   * it will not fire any user interaction related event (for example, click
   * event).
   */
  @Prop() readonly disabled = false;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = true;

  /**
   * This attribute lets you specify an URL.
   */
  @Prop() readonly href: string = "";

  /**
   * This attribute lets you specify where to display the linked URL.
   */
  @Prop() readonly target: "current-tab" | "new-tab" = "current-tab";

  /**
   * Stops event bubbling when the anchor is disabled
   * @param event The UI Event
   */
  @Listen("click", {})
  handleClick(event: UIEvent) {
    if (this.disabled) {
      event.stopPropagation();
    }

    // @todo: TODO Use a custom vdom event "gxClick"
  }

  componentDidLoad() {
    makeHighlightable(this, this.linkElement);
  }

  render() {
    return (
      <a
        class={{
          "gx-link": true,
          [this.cssClass]: !!this.cssClass,
          [DISABLED_CLASS]: this.disabled
        }}
        href={this.href}
        target={targetMap[this.target] || "_self"}
        data-has-action={!this.disabled ? "" : undefined} // Mouse pointer to indicate action
        ref={el => (this.linkElement = el)}
      >
        <slot />
      </a>
    );
  }
}
