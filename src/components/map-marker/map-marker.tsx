import { Component, Element, Event, EventEmitter, Prop } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import { divIcon, marker } from "leaflet/dist/leaflet-src.esm";
import { parseCoords } from "../common/coordsValidate";

@Component({
  shadow: false,
  styleUrl: "map-marker.scss",
  tag: "gx-map-marker"
})
export class MapMarker implements GxComponent {
  @Element() element: HTMLGxMapMarkerElement;
  private markerInstance: any;

  /**
   * The coordinates where the marker will appear in the map.
   *
   */
  @Prop({ mutable: true }) coords = "0, 0";

  /**
   * The class that the marker will have.
   *
   * _Tip: Set the background-image to use it as icon of the marker._
   *
   * _Note: The default class is defined in map style._
   *
   */
  @Prop() markerClass = "defaultIcon";

  /**
   * The marker image height.
   *
   */
  @Prop() iconSizeHeight = 30;

  /**
   * The marker image width.
   *
   */
  @Prop() iconSizeWidth = 30;

  /**
   * The tooltip caption of the marker.
   *
   */
  @Prop() readonly tooltipCaption: string;

  /**
   * Emmits when the element is added to a `<gx-map>`.
   *
   */
  @Event() gxMapMarkerDidLoad: EventEmitter;

  /**
   * Emmits when the element update its data.
   *
   */
  @Event() gxMapMarkerUpdate: EventEmitter;

  /**
   * Emmits when the element is deleted from a `<gx-map>`.
   *
   */
  @Event() gxMapMarkerDeleted: EventEmitter;

  componentDidLoad() {
    const halfIconWidth = this.iconSizeWidth / 2;
    const coords = parseCoords(this.coords);
    if (coords !== null) {
      this.markerInstance = marker(coords, {
        icon: divIcon({
          className: this.markerClass,
          iconAnchor: [halfIconWidth, this.iconSizeHeight],
          iconSize: [this.iconSizeWidth, this.iconSizeHeight],
          tooltipAnchor: [0, -28]
        })
      });
    } else {
      console.warn(
        "GX warning: Can not read 'coords' attribute, default coords set (gx-map-marker)",
        this.element
      );
      this.markerInstance = marker([0, 0], {
        icon: divIcon({
          iconAnchor: [halfIconWidth, this.iconSizeHeight],
          iconSize: [this.iconSizeWidth, this.iconSizeHeight],
          tooltipAnchor: [0, -28]
        })
      });
    }
    if (this.tooltipCaption) {
      this.markerInstance.bindTooltip(this.tooltipCaption);
    }
    this.gxMapMarkerDidLoad.emit(this.markerInstance);
  }

  componentDidUpdate() {
    const halfIconWidth = this.iconSizeWidth / 2;
    const coords = parseCoords(this.coords);
    if (coords !== null) {
      this.markerInstance.setLatLng(coords);
    } else {
      console.warn(
        "GX warning: Can not read 'coords' attribute, default coords set (gx-map-marker)",
        this.element
      );
      this.markerInstance.setLatLng([0, 0]);
    }
    this.markerInstance.setIcon(
      divIcon({
        iconAnchor: [halfIconWidth, this.iconSizeHeight],
        iconSize: [this.iconSizeWidth, this.iconSizeHeight],
        tooltipAnchor: [0, -28]
      })
    );
  }

  componentDidUnload() {
    this.gxMapMarkerDeleted.emit(this.markerInstance);
  }

  render() {
    return "";
  }
}
