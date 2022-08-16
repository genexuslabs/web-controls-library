import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  h,
  Prop
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import { LatLngTuple, Polygon, polygon } from "leaflet";
import { parseCoords } from "../common/coordsValidate";

const DEFAULT_COORDS: LatLngTuple = [0, 0];

@Component({
  shadow: true,
  tag: "gx-map-polygon"
})
export class MapPolygon implements GxComponent {
  @Element() element: HTMLGxMapPolygonElement;
  private polygonInstance: Polygon;

  /**
   * The coordinates where the polygon will appear in the map.
   */
  @Prop({ mutable: true }) coords = "0, 0";

  /**
   * Emitted when the element is added to a `<gx-map>`.
   */
  @Event() gxMapPolygonDidLoad: EventEmitter;

  /**
   * Emitted when the element is deleted from a `<gx-map>`.
   */
  @Event() gxMapPolygonDeleted: EventEmitter;

  private setupPolygon(coords) {
    this.polygonInstance = polygon(coords, {
      color: "#e4364f", // Same default color as Web
      weight: 3
    });
  }

  componentDidLoad() {
    const coords = parseCoords(this.coords);
    if (coords !== null) {
      this.setupPolygon(coords);
    } else {
      this.setupPolygon(DEFAULT_COORDS);
    }

    this.gxMapPolygonDidLoad.emit(this.polygonInstance);
  }

  disconnectedCallback() {
    this.gxMapPolygonDeleted.emit(this.polygonInstance);
  }

  render() {
    return (
      <Host aria-hidden="true">
        <slot />
      </Host>
    );
  }
}
