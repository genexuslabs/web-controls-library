import { Component, Element, Prop, h, State, Watch } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "interactive-image.scss",
  tag: "gx-interactive-image"
})
export class InteractiveImage implements GxComponent {
  @Element() element: HTMLGxInteractiveImageElement;

  /**
   * If this property is true, the user can copy the image to the clipboard (Only for iOS, see image below).
   */
  @Prop() enableCopyToClipboard: false;

  /**
   * True/False. If this property is true, the user can zoom in/out on the image.
   */
  @Prop() enableZoom = false;

  /**
   * Indicates how much you can enlarge an image. (Percentage) _Note: 100% = Normal size_.
   */
  @Prop() zoom = 100;

  /**
   * Indicates how much you can enlarge an image with reference to the original size of it or the size of the controller. (Percentage)
   */
  @Prop() maxZoomRelativeTo: number;

  /**
   * Lets you specify the "src" of the img.
   */
  @Prop() readonly src = "";

  @State() mouseOver = false;

  @Watch("mouseOver")
  mouseOverHandler() {
    this.editingOverClass();
  }

  private editingOverClass() {
    if (this.mouseOver) {
      this.element.classList.add("mouse-over");
    } else {
      this.element.classList.remove("mouse-over");
    }
  }

  private addEvent(
    element: HTMLElement,
    eventToListen: string,
    callbackFunction
  ) {
    element.addEventListener(eventToListen, callbackFunction);
  }

  componentDidLoad() {
    console.log("didLoad!");

    const mouseOverEvent = {
      eventWithMouse: "mousemove",
      eventWithTouch: "touchmove",
      behaivor: ev => {
        this.mouseOver = true;
        console.log("over!");
        this.element.style.backgroundPosition = `-${(ev.offsetX *
          (this.zoom - 100)) /
          100}px -${(ev.offsetY * (this.zoom - 100)) / 100}px`;
      }
    };

    const mouseOutEvent = {
      eventWithMouse: "mouseout",
      eventWithTouch: "touchend",
      behaivor: () => {
        this.mouseOver = false;
        console.log("out!");
        this.element.setAttribute("class", "hydrated");
        this.element.style.backgroundPosition = `0 0`;
      }
    };

    this.addEvent(
      this.element,
      mouseOverEvent.eventWithMouse,
      mouseOverEvent.behaivor
    );

    this.addEvent(
      this.element,
      mouseOutEvent.eventWithMouse,
      mouseOutEvent.behaivor
    );

    this.addEvent(
      this.element,
      mouseOverEvent.eventWithTouch,
      mouseOverEvent.behaivor
    );

    this.addEvent(
      this.element,
      mouseOutEvent.eventWithTouch,
      mouseOutEvent.behaivor
    );
  }

  render() {
    this.editingOverClass();
    console.log("rendering!");
    this.element.style.backgroundImage = `url(${this.src})`;
    this.element.style.backgroundSize = `${this.zoom}%`;
    return <img class={"gx-default-interactive-image"} src={this.src}></img>;
  }
}
