import { BaseComponent } from "../common/base-component";
import { Component, Prop } from "@stencil/core";
@Component({
  shadow: false,
  styleUrl: "group.scss",
  tag: "gx-group"
})
export class Group extends BaseComponent {
  /**
   * Attribute that provides the caption to the <legend> tag
   */
  @Prop() caption: string;
  /**
   * This attribute defines if the control size will grow automatically,
   * to adjust to its content size.
   * If set to `false`, it won't grow automatically and it will show scrollbars
   * if the content overflows.
   */
  @Prop() autoGrow: boolean;
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
