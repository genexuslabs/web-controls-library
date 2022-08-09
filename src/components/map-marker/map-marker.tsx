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
  private markerInstance: any;

  // Refs
  private popupContainer: HTMLDivElement = null;

  @Element() element: HTMLGxMapMarkerElement;

  /**
   * The coordinates where the marker will appear in the map.
   */
  @Prop({ mutable: true }) coords = "0, 0";

  /**
   * The class that the marker will have.
   */
  @Prop() iconImageClass = "gx-default-icon";

  /**
   * The marker image height.
   */
  @Prop() iconHeight = 30;

  /**
   * The marker image width.
   */
  @Prop() iconWidth = 30;

  /**
   * The tooltip caption of the marker.
   */
  @Prop() readonly tooltipCaption: string;

  /**
   * Emmits when the element is added to a `<gx-map>`.
   */
  @Event() gxMapMarkerDidLoad: EventEmitter;

  /**
   * Emmits when the element update its data.
   */
  @Event() gxMapMarkerUpdate: EventEmitter;

  /**
   * Emmits when the element is deleted from a `<gx-map>`.
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

  /**
   * Given the current coords of the `gx-marker` it returns its parsed coords or the default value if they are null.
   * @returns The parsed coords of the marker.
   */
  private getParsedCoords(): string[] | LatLngTuple {
    const coords = parseCoords(this.coords);
    return coords !== null ? coords : DEFAULT_COORDS;
  }

  private setPopup() {
    if (this.popupContainer.firstElementChild !== null) {
      const maxPopupSize = {
        height:
          document.querySelector(".gxMap").clientHeight * MAX_POPUP_SIZE_FACTOR,
        width:
          document.querySelector(".gxMap").clientWidth * MAX_POPUP_SIZE_FACTOR
      };

      this.markerInstance.bindPopup(this.popupContainer, {
        keepInView: true,
        maxHeight: maxPopupSize.height,
        maxWidth: maxPopupSize.width,
        minWidth: 100
      });
    }
  }

  componentDidLoad() {
    this.setupMarker(this.getParsedCoords());

    this.setPopup();
    if (this.tooltipCaption) {
      this.markerInstance.bindTooltip(this.tooltipCaption, {
        direction: "top"
      });
    }
    this.gxMapMarkerDidLoad.emit(this.markerInstance);
  }

  componentDidUpdate() {
    this.markerInstance.setLatLng(this.getParsedCoords());

    this.markerInstance.setIcon(this.getDivIcon());
    this.setPopup();
  }

  disconnectedCallback() {
    this.gxMapMarkerDeleted.emit(this.markerInstance);
  }

  render() {
    return (
      <div
        class="popup-data-container"
        ref={el => (this.popupContainer = el as HTMLDivElement)}
      >
        <slot />
      </div>
    );
  }
}
