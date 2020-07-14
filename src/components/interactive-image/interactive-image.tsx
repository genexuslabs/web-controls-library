import { Component, Element, Prop, h, State } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "interactive-image.scss",
  tag: "gx-interactive-image"
})
export class InteractiveImage implements GxComponent {
  @Element() element: HTMLGxInteractiveImageElement;

  /**
   * True/False. If this property is true, the user can zoom in/out on the image.
   */
  @Prop() enableZoom = false;

  /**
   * Indicates how much you can enlarge an image. (Percentage) _Note: 100% = Normal size_.
   */
  @Prop() zoom = 100;

  /**
   * Lets you specify the image URL. *Requiered*
   */
  @Prop() readonly src = "";

  @State() mouseOver = false;

  @State() zoomedPositionX: number;

  @State() zoomedPositionY: number;

  private addEvent(
    element: HTMLElement,
    eventToListen: string,
    callbackFunction,
    passive: boolean
  ) {
    element.addEventListener(eventToListen, callbackFunction),
      passive && { passive: true };
  }

  private calculateZoomedPosition(overPosition: number, elementSize: number) {
    const SCALE = this.zoom / 100;
    const HALF_SIZE_PERCENTAGE = 50;
    const HALF_SIZE_PIXELS = (elementSize * HALF_SIZE_PERCENTAGE) / 100;
    return -(overPosition - HALF_SIZE_PIXELS) * (SCALE - 1);
  }

  private calculateZoomTouch(preCalculateValue: number, zoom: number) {
    const SCALE = zoom / 100;
    return preCalculateValue / SCALE;
  }

  private checkZoomFeature() {
    if (this.enableZoom) {
      const img = this.element.querySelector("img");
      this.addEvent(img, "mousemove", this.handlerMouseMove, true);
      this.addEvent(img, "touchmove", this.handlerTouchMove, true);
      this.addEvent(img, "mouseout", this.zoomingOut, true);
      this.addEvent(img, "touchend", this.zoomingOut, true);
    } else {
      const img = this.element.querySelector("img");
      this.removeEvent(img, "mousemove", this.handlerMouseMove);
      this.removeEvent(img, "touchmove", this.handlerTouchMove);
      this.removeEvent(img, "mouseout", this.zoomingOut);
      this.removeEvent(img, "touchend", this.zoomingOut);
    }
  }

  private fixZoomValue() {
    if (this.zoom < 100) {
      console.warn("Zoom value cannot be lower than 100");
      this.zoom = 100;
    }
  }
  private handlerMouseMove = ev => {
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
  };

  private handlerTouchMove = ev => {
    ev.preventDefault();
    this.mouseOver = true;

    const imgSize = {
      height: ev.target.offsetHeight,
      width: ev.target.offsetWidth
    };

    const touch = {
      X: ev.changedTouches[0].clientX - ev.target.x,
      Y:
        ev.changedTouches[0].clientY -
        ev.target.parentNode.getBoundingClientRect().top
    };

    if (touch.X <= 0) {
      touch.X = 0;
    } else if (touch.X >= imgSize.width) {
      touch.X = imgSize.width;
    }
    if (touch.Y <= 0) {
      touch.Y = 0;
    } else if (touch.Y >= imgSize.height) {
      touch.Y = imgSize.height;
    }

    const moveImgPostion = {
      X: this.calculateZoomTouch(
        this.calculateZoomedPosition(touch.X, ev.target.offsetWidth),
        this.zoom
      ),
      Y: this.calculateZoomTouch(
        this.calculateZoomedPosition(touch.Y, imgSize.height),
        this.zoom
      )
    };
    this.zoomedPositionX = moveImgPostion.X;
    this.zoomedPositionY = moveImgPostion.Y;
  };

  private zoomingOut = () => {
    this.mouseOver = false;
  };

  private removeEvent(
    element: HTMLElement,
    eventToListen: string,
    callbackFunction
  ) {
    element.removeEventListener(eventToListen, callbackFunction);
  }

  componentWillLoad() {
    this.fixZoomValue();
  }

  componentDidLoad() {
    this.checkZoomFeature();
  }

  componentDidUpdate() {
    this.checkZoomFeature();
  }

  render() {
    this.fixZoomValue();
    return (
      <img
        style={
          this.mouseOver
            ? {
                "object-position": `${this.zoomedPositionX}px ${this.zoomedPositionY}px`,
                transform: `scale(${this.zoom / 100})`
              }
            : {}
        }
        src={this.src}
      />
    );
  }
}
