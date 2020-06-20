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

  private zoomFeature = {
    over: {
      withMouse: "mousemove",
      withTouch: "touchmove",
      behaivor: ev => {
        this.mouseOver = true;
        console.log("over!");
        this.element.style.backgroundPosition = `-${(ev.offsetX *
          (this.zoom - 100)) /
          100}px -${(ev.offsetY * (this.zoom - 100)) / 100}px`;
      }
    },
    out: {
      withMouse: "mouseout",
      withTouch: "touchend",
      behaivor: () => {
        this.mouseOver = false;
        console.log("out!");
        this.element.setAttribute("class", "hydrated");
        this.element.style.backgroundPosition = `0 0`;
      }
    }
  };

  private addEvent(
    element: HTMLElement,
    eventToListen: string,
    callbackFunction
  ) {
    element.addEventListener(eventToListen, callbackFunction);
  }

  private removeEvent(
    element: HTMLElement,
    eventToListen: string,
    callbackFunction
  ) {
    element.removeEventListener(eventToListen, callbackFunction);
  }

  private editingOverClass() {
    if (this.enableZoom && this.mouseOver) {
      this.element.classList.add("mouse-over");
    } else {
      this.element.classList.remove("mouse-over");
    }
  }

  private checkZoomFeature() {
    this.editingOverClass();
    const zooming = this.zoomFeature;
    if (this.enableZoom) {
      this.addEvent(
        this.element,
        zooming.over.withMouse,
        zooming.over.behaivor
      );
      this.addEvent(
        this.element,
        zooming.over.withTouch,
        zooming.over.behaivor
      );
      this.addEvent(this.element, zooming.out.withMouse, zooming.out.behaivor);
      this.addEvent(this.element, zooming.out.withTouch, zooming.out.behaivor);
    } else {
      this.removeEvent(
        this.element,
        zooming.over.withMouse,
        zooming.over.behaivor
      );
      this.removeEvent(
        this.element,
        zooming.over.withTouch,
        zooming.over.behaivor
      );
      this.removeEvent(
        this.element,
        zooming.out.withMouse,
        zooming.out.behaivor
      );
      this.removeEvent(
        this.element,
        zooming.out.withTouch,
        zooming.out.behaivor
      );
    }
  }

  componentDidLoad() {
    console.log("didLoad!");
    this.checkZoomFeature();
  }

  componentDidUpdate() {
    this.checkZoomFeature();
  }

  render() {
    this.checkZoomFeature();
    console.log("rendering!");
    this.element.style.backgroundImage = `url(${this.src})`;
    this.element.style.backgroundSize = `${this.zoom}%`;
    return <img class={"gx-default-interactive-image"} src={this.src}></img>;
  }
}
