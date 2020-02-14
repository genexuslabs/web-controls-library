import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop
} from "@stencil/core";
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
   * Set the `background-image` property to use it as icon of the marker.
   *
   */
  @Prop() markerClass = "gx-default-icon";

  /**
   * The marker image height.
   *
   */
  @Prop() iconHeight = 30;

  /**
   * The marker image width.
   *
   */
  @Prop() iconWidth = 30;

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

  private setPopup() {
    const popupHtml = this.element.querySelector("[class='popupHtml']");
    if (popupHtml.innerHTML) {
      const marginProportion = 83 / 100;
      const maxPopupSize = {
        height:
          document.querySelector(".gxMap").clientHeight * marginProportion,
        width: document.querySelector(".gxMap").clientWidth * marginProportion
      };
      this.markerInstance.bindPopup(popupHtml, {
        keepInView: true,
        maxHeight: maxPopupSize.height,
        maxWidth: maxPopupSize.width,
        minWidth: 100
      });
    }
  }

  componentDidLoad() {
    const halfIconSizes = {
      height: this.iconHeight / 2,
      width: this.iconWidth / 2
    };
    const coords = parseCoords(this.coords);
    if (coords !== null) {
      this.markerInstance = marker(coords, {
        icon: divIcon({
          className: this.markerClass,
          iconAnchor: [halfIconSizes.width, this.iconHeight],
          popupAnchor: [0, -halfIconSizes.height],
          iconSize: [this.iconWidth, this.iconHeight],
          tooltipAnchor: [0, -halfIconSizes.height]
        })
      });
    } else {
      console.warn(
        "GX warning: Can not read 'coords' attribute, default coords set (gx-map-marker)",
        this.element
      );
      this.markerInstance = marker([0, 0], {
        icon: divIcon({
          className: this.markerClass,
          iconAnchor: [halfIconSizes.width, this.iconHeight],
          popupAnchor: [0, -halfIconSizes.height],
          iconSize: [this.iconWidth, this.iconHeight],
          tooltipAnchor: [0, -halfIconSizes.height]
        })
      });
    }
    this.setPopup();
    if (this.tooltipCaption) {
      this.markerInstance.bindTooltip(this.tooltipCaption, {
        direction: "top"
      });
    }
    this.gxMapMarkerDidLoad.emit(this.markerInstance);
  }

  componentDidUpdate() {
    const halfIconSizes = {
      height: this.iconHeight / 2,
      width: this.iconWidth / 2
    };
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
    // this.setIconSrc();
    this.markerInstance.setIcon(
      divIcon({
        className: this.markerClass,
        iconAnchor: [halfIconSizes.width, this.iconHeight],
        popupAnchor: [0, -halfIconSizes.height],
        iconSize: [this.iconWidth, this.iconHeight],
        tooltipAnchor: [0, -halfIconSizes.height]
      })
    );
    this.setPopup();
  }

  // eslint-disable-next-line @stencil/own-methods-must-be-private
  componentDidUnload() {
    this.gxMapMarkerDeleted.emit(this.markerInstance);
  }

  render() {
    return (
      <div class="popupHtml">
        <slot />
      </div>
    );
  }
}
