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
import { getFileNameWithoutExtension } from "../common/utils";
import { divIcon, marker, DivIcon, LatLngTuple } from "leaflet";

const DEFAULT_COORDS: LatLngTuple = [0, 0];
const MAX_POPUP_SIZE_FACTOR = 0.83;
const DefaultLocationIconSrc =
  "data:image/x-icon;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48dGl0bGU+bWFwLXBvaW50ZXItZ2x5cGg8L3RpdGxlPjxwYXRoIGQ9Ik0xNDcuNjcsMzc0LjI3YzExLDE1LjY2LDIyLjM3LDMxLDM0LDQ2LjIyLDEwLjI2LDEzLjQsMjAuNzEsMjYuNjgsMzEuMTYsMzkuODgsMTMuNjMsMTcuMjMsMjcuMywzNC4zOSw0MC42MSw1MS42M0gyNTljMTMuMTQtMTcuNDYsMjYuNzEtMzQuNzcsNDAuMzItNTIuMTIsMTAuNDQtMTMuMjcsMjAuODctMjYuNTgsMzEuMTUtNDAsMTEuNTctMTUuMDgsMjIuOTItMzAuMjksMzMuODItNDUuOCwzMi40Ni00Ni4xNSw2MC45NS05NC43OSw3OC43Mi0xNDkuMjhDNDcwLjI0LDExNi44LDM3Ni42NSw1LjYsMjY4LjYyLDBIMjQzQzEzMi42NSw1LjYsMzcuNDQsMTIyLjQsNzEuMDYsMjMxLjIsODkuMjMsMjgzLDExNi41OSwzMjkuODIsMTQ3LjY3LDM3NC4yN1pNMjU0Ljc4LDU2LjhjLjQxLDAsLjgxLDAsMS4yMSwwLDcwLjY4LjY2LDEyOCw1OC4zMywxMjgsMTI5LjE2UzMyNi42OCwzMTQuNTEsMjU2LDMxNS4xN2MtLjQxLDAtLjgsMC0xLjIxLDBBMTI5LjM0LDEyOS4zNCwwLDAsMSwxMjUuNTksMTg2QzEyNS41OSwxMTQuNzcsMTgzLjU0LDU2LjgsMjU0Ljc4LDU2LjhaIiBmaWxsPSIjNDM0MDQwIi8+PC9zdmc+";
let DefaultLocationIconName = "MarkerSvg";

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
   * This attribute lets you specify the marker type. Each marker type has
   * different images and sizes depending on its use.
   */
  @Prop() readonly type: "default" | "selection-layer" | "user-location" =
    "default";

  /**
   * The path of the icon, that the marker will have.
   */
  @Prop() iconSrc = null;

  /**
   * The name of the icon, that the marker will have.
   */
  @Prop() iconSrcName = null;

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
    const locationIconSrc = this.iconSrc || DefaultLocationIconSrc;
    if (this.iconSrc != null)
      DefaultLocationIconName = getFileNameWithoutExtension(this.iconSrc);
    const LocationIconName = this.iconSrcName || DefaultLocationIconName;
    console.log(LocationIconName);
    const HtmlLocationIcon = `<img alt="${LocationIconName}" src="${locationIconSrc}" />`;

    return divIcon({
      className: `gx-map-marker-${this.type}-icon`,
      iconAnchor: [this.getHalfSizes().width, this.iconHeight],
      popupAnchor: [0, -this.getHalfSizes().height],
      iconSize: [this.iconWidth, this.iconHeight],
      tooltipAnchor: [0, -this.getHalfSizes().height],
      html: HtmlLocationIcon
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
    // TODO: In which case does this condition occur?
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
    // Update lat and lng
    this.markerInstance.setLatLng(this.getParsedCoords());

    // Update icon
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
