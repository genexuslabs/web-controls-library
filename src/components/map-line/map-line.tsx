import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import { polyline } from "leaflet/dist/leaflet-src.esm";
import { parseCoords } from "../common/coordsValidate";

@Component({
  shadow: false,
  tag: "gx-map-line"
})
export class MapLine implements GxComponent {
  @Element() element: HTMLGxMapLineElement;
  private lineInstance: any;

  /**
   * The coordinates where the line/polyline will appear in the map.
   *
   */
  @Prop({ mutable: true }) coords = "0, 0";

  /**
   * Emmits when the element is added to a `<gx-map>`.
   *
   */
  @Event() gxMapLineDidLoad: EventEmitter;

  /**
   * Emmits when the element is deleted from a `<gx-map>`.
   *
   */
  @Event() gxMapLineDeleted: EventEmitter;

  private setupLine(coords) {
    this.lineInstance = polyline(coords, {
      color: "red",
      weight: 3
    });
  }

  componentDidLoad() {
    const coords = parseCoords(this.coords);
    if (coords !== null) {
      this.setupLine(coords);
    } else {
      console.warn(
        "GX warning: Cannot read 'coords' attribute, default coords set (gx-map-line)",
        this.element
      );
      this.setupLine([0, 0]);
    }
    this.gxMapLineDidLoad.emit(this.lineInstance);
  }

  disconnectedCallback() {
    this.gxMapLineDeleted.emit(this.lineInstance);
  }

  render() {
    return (
      <div>
        <slot />
      </div>
    );
  }
}
