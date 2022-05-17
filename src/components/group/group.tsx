import { Component, Element, Prop, h } from "@stencil/core";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

import { Component as GxComponent } from "../common/interfaces";

// Class transforms
import {
  getClasses,
  tGroupCaption
} from "../common/css-transforms/css-transforms";

@Component({
  shadow: false,
  styleUrl: "group.scss",
  tag: "gx-group"
})
export class Group implements GxComponent, HighlightableComponent {
  @Element() element: HTMLGxGroupElement;

  /**
   * Attribute that provides the caption to the <legend> tag
   */
  @Prop() readonly caption: string;

  /**
   * A CSS class to set as the `gx-group` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute defines if the control size will grow automatically,
   * to adjust to its content size.
   * If set to `false`, it won't grow automatically and it will show scrollbars
   * if the content overflows.
   */
  @Prop() readonly autoGrow: boolean;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = false;

  private fieldsetElement: HTMLFieldSetElement;

  componentDidLoad() {
    makeHighlightable(this, this.fieldsetElement);
  }

  render() {
    // Styling for gx-group control.
    const classes = getClasses(this.cssClass, -1);
    const captionClass = !!this.cssClass ? tGroupCaption(this.cssClass) : "";

    return (
      <fieldset
        class={{
          [this.cssClass]: !!this.cssClass,
          [classes.vars]: true
        }}
        data-has-action={this.highlightable ? "" : undefined}
        ref={el => (this.fieldsetElement = el as HTMLFieldSetElement)}
      >
        <legend>
          <span class={{ "gx-group-caption": true, [captionClass]: true }}>
            {this.caption}
          </span>
        </legend>
        <slot />
      </fieldset>
    );
  }
}
