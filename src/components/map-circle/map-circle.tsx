import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop
} from "@stencil/core";
import { Component as GxComponent, GridMapElement } from "../common/interfaces";
import { circle, Circle } from "leaflet";
import { parseCoords } from "../common/coordsValidate";
let autoCircleId = 0;
@Component({
  shadow: false,
  tag: "gx-map-circle"
})
export class GridMapCircle implements GxComponent {
  @Element() element: HTMLGxMapCircleElement;
  private circleId: string;
  private circleInstance: Circle;

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
  @Event() gxMapCircleDidLoad: EventEmitter<GridMapElement>;

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

  componentWillLoad() {
    // Sets IDs
    if (!this.circleId) {
      this.circleId =
        this.element.id || `gx-map-circle-auto-id-${autoCircleId++}`;
    }
  }

  componentDidLoad() {
    const coords = parseCoords(this.coords);

    if (coords !== null) {
      this.setupCircle(coords);
    } else {
      this.setupCircle([0, 0]);
    }

    this.gxMapCircleDidLoad.emit({
      id: this.circleId,
      instance: this.circleInstance
    });
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
