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

  @State() zoomedPositionX: number;

  @State() zoomedPositionY: number;

  @Watch("mouseOver")
  mouseOverHandler() {
    this.editingOverClass();
  }

  private addEvent(
    element: HTMLElement,
    eventToListen: string,
    callbackFunction,
    passive: boolean
  ) {
    element.addEventListener(eventToListen, callbackFunction),
      passive && { passive: true };
  }

  private calculateZoomedPosition(overPosition, elementSize) {
    const SCALE = this.zoom / 100;
    const HALF_SIZE_PERCENTAGE = 50;
    const HALF_SIZE_PIXELS = (elementSize * HALF_SIZE_PERCENTAGE) / 100;
    return -(overPosition - HALF_SIZE_PIXELS) * (SCALE - 1);
  }

  private checkZoomFeature() {
    const zooming = this.zoomFeature;
    if (this.enableZoom) {
      const img = this.element.querySelector("img");
      this.addEvent(img, zooming.over.withMouse, zooming.over.behaivor, true);
      this.addEvent(img, zooming.over.withTouch, zooming.over.behaivor, true);
      this.addEvent(img, zooming.out.withMouse, zooming.out.behaivor, true);
      this.addEvent(img, zooming.out.withTouch, zooming.out.behaivor, true);
    } else {
      const img = this.element.querySelector("img");
      this.removeEvent(img, zooming.over.withMouse, zooming.over.behaivor);
      this.removeEvent(img, zooming.over.withTouch, zooming.over.behaivor);
      this.removeEvent(img, zooming.out.withMouse, zooming.out.behaivor);
      this.removeEvent(img, zooming.out.withTouch, zooming.out.behaivor);
    }
  }

  private correctZoomValue() {
    if (this.zoom < 100) {
      console.warn("Zoom value cannot be lower than 100");
      this.zoom = 100;
    }
  }

  private editingOverClass() {
    if (this.enableZoom && this.mouseOver) {
      this.element.classList.add("zoom-over");
    } else {
      this.element.classList.remove("zoom-over");
    }
  }

  private removeEvent(
    element: HTMLElement,
    eventToListen: string,
    callbackFunction
  ) {
    element.removeEventListener(eventToListen, callbackFunction);
  }

  private zoomFeature = {
    over: {
      withMouse: "mousemove",
      withTouch: "touchmove",
      behaivor: ev => {
        ev.preventDefault();
        this.mouseOver = true;
        this.zoomedPositionX = this.calculateZoomedPosition(
          ev.offsetX,
          ev.target.offsetWidth
        );
        this.zoomedPositionY = this.calculateZoomedPosition(
          ev.offsetY,
          ev.target.offsetHeight
        );
      }
    },
    out: {
      withMouse: "mouseout",
      withTouch: "touchend",
      behaivor: () => {
        this.mouseOver = false;
        this.element.setAttribute("class", "hydrated");
        this.element.style.backgroundPosition = `0 0`;
      }
    }
  };

  componentWillLoad() {
    this.correctZoomValue();
  }

  componentDidLoad() {
    this.checkZoomFeature();
  }

  componentDidUpdate() {
    this.checkZoomFeature();
  }

  render() {
    this.correctZoomValue();
    return (
      <img
        style={
          this.mouseOver
            ? {
                "object-position": this.mouseOver
                  ? `${this.zoomedPositionX}px ${this.zoomedPositionY}px`
                  : "0px 0px",
                transform: this.mouseOver
                  ? `scale(${this.zoom / 100})`
                  : `scale(1)`
              }
            : {}
        }
        class={"gx-default-interactive-image"}
        src={this.src}
      />
    );
  }
}
