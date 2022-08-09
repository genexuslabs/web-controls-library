import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import { parseCoords } from "../common/coordsValidate";
import { divIcon, marker, DivIcon, LatLngTuple } from "leaflet";

const DEFAULT_COORDS: LatLngTuple = [0, 0];
const MAX_POPUP_SIZE_FACTOR = 0.83;

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
   */
  @Prop() iconImageClass = "gx-default-icon";

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

  private getHalfSizes(): any {
    const halfIconSizes = {
      height: this.iconHeight / 2,
      width: this.iconWidth / 2
    };
    return halfIconSizes;
  }

  private setupMarker(coords) {
    this.markerInstance = marker(coords, {
      icon: this.getDivIcon()
    });
  }

  /**
   * Given the current state of the `gx-marker`'s properties it returns its `DivIcon`.
   * @returns The current `DivIcon` of the marker.
   */
  private getDivIcon(): DivIcon {
    return divIcon({
      className: this.iconImageClass,
      iconAnchor: [this.getHalfSizes().width, this.iconHeight],
      popupAnchor: [0, -this.getHalfSizes().height],
      iconSize: [this.iconWidth, this.iconHeight],
      tooltipAnchor: [0, -this.getHalfSizes().height]
    });
  }

  private setPopup() {
    const popupContainerEl = this.element.querySelector(
      "[class='popup-data-container']"
    );
    if (popupContainerEl.firstElementChild !== null) {
      const maxPopupSize = {
        height:
          document.querySelector(".gxMap").clientHeight * MAX_POPUP_SIZE_FACTOR,
        width:
          document.querySelector(".gxMap").clientWidth * MAX_POPUP_SIZE_FACTOR
      };
      this.markerInstance.bindPopup(popupContainerEl, {
        keepInView: true,
        maxHeight: maxPopupSize.height,
        maxWidth: maxPopupSize.width,
        minWidth: 100
      });
    }
  }

  componentDidLoad() {
    const coords = parseCoords(this.coords);
    if (coords !== null) {
      this.setupMarker(coords);
    } else {
      this.setupMarker(DEFAULT_COORDS);
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
    const coords = parseCoords(this.coords);
    if (coords !== null) {
      this.markerInstance.setLatLng(coords);
    } else {
      this.markerInstance.setLatLng(DEFAULT_COORDS);
    }

    this.markerInstance.setIcon(this.getDivIcon());
    this.setPopup();
  }

  disconnectedCallback() {
    this.gxMapMarkerDeleted.emit(this.markerInstance);
  }

  render() {
    return (
      <div class="popup-data-container">
        <slot />
      </div>
    );
  }
}
