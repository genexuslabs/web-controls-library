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
      img.addEventListener("mousemove", this.handleMouseMove);
      img.addEventListener("touchmove", this.handleTouchMove);
      img.addEventListener("mouseout", this.handleOverEnd);
      img.addEventListener("touchend", this.handleOverEnd);
    } else {
      const img = this.element.querySelector("img");
      img.removeEventListener("mousemove", this.handleMouseMove);
      img.removeEventListener("touchmove", this.handleTouchMove);
      img.removeEventListener("mouseout", this.handleOverEnd);
      img.removeEventListener("touchend", this.handleOverEnd);
    }
  }

  private fixZoomValue() {
    if (this.zoom < 100) {
      console.warn("Zoom value cannot be lower than 100");
      this.zoom = 100;
    }
  }
  private handleMouseMove = ev => {
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

  private handleTouchMove = ev => {
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

  private handleOverEnd = () => {
    this.mouseOver = false;
  };

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
