import {
  Component,
  Element,
  // Event,
  // EventEmitter,
  // Host,
  // Listen,
  Prop
  // State,
  // h
} from "@stencil/core";

import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false, // Ver para que es esto
  styleUrl: "image-upload.scss",
  tag: "gx-image-upload"
})
export class ImageUpload implements GxComponent {
  @Element() element: HTMLGxImageUploadElement;

  /**
   * This attribute lets you specify the alternative text.
   */
  @Prop() readonly alt = "";

  /**
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * This attribute lets you specify the SRC.
   */
  @Prop() readonly src = "";

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = false;

  //  @Listen("click", { capture: true })
  //  handleClick(event: UIEvent) {
  //    if (this.disabled) {
  //      event.stopPropagation();
  //      return;
  //    }
  //  }

  render() {
    return undefined;
  }
}
