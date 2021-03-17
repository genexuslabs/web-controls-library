import { Component, Element, Prop, h } from "@stencil/core";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

import { Component as GxComponent } from "../common/interfaces";

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

  componentDidLoad() {
    makeHighlightable(this);
  }

  render() {
    return (
      <fieldset class="form-group">
        <legend>
          <span class="content">{this.caption}</span>
        </legend>
        <slot />
      </fieldset>
    );
  }
}
