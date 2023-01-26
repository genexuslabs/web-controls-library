import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
// @ts-expect-error @todo TODO: Fix this import
import { circle } from "leaflet/dist/leaflet-src.esm";
import { parseCoords } from "../common/coordsValidate";

@Component({
  shadow: false,
  tag: "gx-map-circle"
})
export class MapCircle implements GxComponent {
  @Element() element: HTMLGxMapCircleElement;
  private circleInstance: any;

  /**
   * The coordinates where the circle will appear in the map.
   */
  @Prop({ mutable: true }) coords = "0, 0";

  /**
   * The radius that the circle will have in the map. It's expressed in meters.
   */
  @Prop({ mutable: true }) radius = 1000;

  /**
   * Emmits when the element is added to a `<gx-map>`.
   */
  @Event() gxMapCircleDidLoad: EventEmitter;

  /**
   * Emmits when the element is deleted from a `<gx-map>`.
   */
  @Event() gxMapCircleDeleted: EventEmitter;

  private setupCircle(coords: any) {
    this.circleInstance = circle(coords, this.radius, {
      color: "red",
      weight: 3
    });
  }

  componentDidLoad() {
    const coords = parseCoords(this.coords);

    if (coords !== null) {
      this.setupCircle(coords);
    } else {
      this.setupCircle([0, 0]);
    }

    this.gxMapCircleDidLoad.emit(this.circleInstance);
  }

  disconnectedCallback() {
    this.gxMapCircleDeleted.emit(this.circleInstance);
  }

  render() {
    return (
      <div>
        <slot />
      </div>
    );
  }
}
