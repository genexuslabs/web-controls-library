import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import { polygon } from "leaflet/dist/leaflet-src.esm";
import { parseCoords } from "../common/coordsValidate";

@Component({
  shadow: false,
  tag: "gx-map-polygon"
})
export class MapPolygon implements GxComponent {
  @Element() element: HTMLGxMapPolygonElement;
  private polygonInstance: any;

  /**
   * The coordinates where the polygon will appear in the map.
   *
   */
  @Prop({ mutable: true }) coords = "0, 0";

  /**
   * Emmits when the element is added to a `<gx-map>`.
   *
   */
  @Event() gxMapPolygonDidLoad: EventEmitter;

  /**
   * Emmits when the element is deleted from a `<gx-map>`.
   *
   */
  @Event() gxMapPolygonDeleted: EventEmitter;

  private setupPolygon(coords) {
    this.polygonInstance = polygon(coords, {
      color: "blue",
      weight: 3
    });
  }

  componentDidLoad() {
    const coords = parseCoords(this.coords);
    if (coords !== null) {
      this.setupPolygon(coords);
    } else {
      console.warn(
        "GX warning: Cannot read 'coords' attribute, default coords set (gx-map-polygon)",
        this.element
      );
      this.setupPolygon([0, 0]);
    }

    this.gxMapPolygonDidLoad.emit(this.polygonInstance);
  }

  componentDidUnload() {
    this.gxMapPolygonDeleted.emit(this.polygonInstance);
  }

  render() {
    return (
      <div>
        <slot />
      </div>
    );
  }
}
