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
import {
  LatLngTuple,
  LineCapShape,
  LineJoinShape,
  PathOptions,
  Polygon,
  polygon
} from "leaflet";
import { parseCoords } from "../common/coordsValidate";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

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
   * A CSS class to set as the `gx-map-polygon` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * Emitted when the element is added to a `<gx-map>`.
   */
  @Event() gxMapPolygonDidLoad: EventEmitter;

  /**
   * Emitted when the element is deleted from a `<gx-map>`.
   */
  @Event() gxMapPolygonDeleted: EventEmitter;

  // @ts-expect-error @todo TODO: Improve typing
  private setupPolygon(coords) {
    const options = this.getMapPolygonStyle();

    // Create the polygon instance
    this.polygonInstance = polygon(coords, options);
  }

  private getMapPolygonStyle(): PathOptions {
    // The values of the custom properties are retrieved from the computed
    // style of the host
    const computed = getComputedStyle(this.element);

    // Default colors are taken from Web
    const options: PathOptions = { fillOpacity: 1 };

    options["fillColor"] =
      computed.getPropertyValue("--gx-fill-color") || "#e4364f33";

    options["color"] =
      computed.getPropertyValue("--gx-stroke-color") || "#e4364f";

    options["weight"] = Number(
      computed.getPropertyValue("--gx-line-width") || 3
    );

    options["lineJoin"] = (computed.getPropertyValue("--gx-line-join") ||
      "round") as LineJoinShape;

    options["lineCap"] = (computed.getPropertyValue("--gx-line-cap") ||
      "round") as LineCapShape;

    if (!!this.cssClass) {
      options["className"] = this.cssClass;
    }

    return options;
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

  componentDidUpdate() {
    const options = this.getMapPolygonStyle();

    // Update the polygon instance
    this.polygonInstance.setStyle(options);
  }

  disconnectedCallback() {
    this.gxMapPolygonDeleted.emit(this.polygonInstance);
  }

  render() {
    // Styling for gx-map-polygon control.
    const classes = getClasses(this.cssClass);

    return (
      <Host aria-hidden="true" class={classes.vars}>
        <slot />
      </Host>
    );
  }
}
