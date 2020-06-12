import { Component, Element, Prop } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "advanced-image.scss",
  tag: "gx-advanced-image"
})
export class AdvancedImage implements GxComponent {
  @Element() element: HTMLGxAdvancedImageElement;

  /**
   * True/False. If this property is true, the user can zoom in/out on the image.
   */
  @Prop() enableZoom = false;

  /**
   * Indicates how much you can enlarge an image. (Percentage).
   */
  @Prop() maxZoom: number;

  /**
   * Indicates how much you can enlarge an image with reference to the original size of it or the size of the controller. (Percentage)
   */
  @Prop() maxZoomRelativeTo: number;

  /**
   * If this property is true, the user can copy the image to the clipboard (Only for iOS, see image below).
   */
  @Prop() enableCopyToClipboard: false;

  render() {
    return "AdvancedImage";
  }
}
