import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  h
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import { parseCoords } from "../common/coordsValidate";
import { divIcon, marker, DivIcon, LatLngTuple } from "leaflet";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

const DEFAULT_COORDS: LatLngTuple = [0, 0];
const MAX_POPUP_SIZE_FACTOR = 0.83;

// Icons
const DEFAULT_ICON_SIZE = 20; // 20px
const DEFAULT_ICON =
  '<path clip-rule="evenodd" d="M2 6V6.29266C2 7.72154 2.4863 9.10788 3.37892 10.2236L8 16L12.6211 10.2236C13.5137 9.10788 14 7.72154 14 6.29266V6C14 2.68629 11.3137 0 8 0C4.68629 0 2 2.68629 2 6ZM8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" fill="var(--gx-stroke-color)" fill-rule="evenodd"/><circle r="2.1" fill="var(--gx-fill-color)" cx="8" cy="6"/>';

const USER_LOCATION_ICON =
  '<circle r="8" fill="var(--gx-fill-color)" stroke="var(--gx-stroke-color)" stroke-width="var(--gx-stroke-width)" str cx="8" cy="8"/>';

const iconSVGWrapper = (
  body: string,
  cssClass: string,
  width: number,
  height: number
) =>
  `<svg aria-hidden="true" class="gx-map-marker-${cssClass}" style="overflow:visible" width="${width}px" height="${height}px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

const iconDictionary = {
  default: (width: number, height: number) =>
    iconSVGWrapper(DEFAULT_ICON, "default", width, height),

  "selection-layer": (width: number, height: number) =>
    iconSVGWrapper(DEFAULT_ICON, "default", width, height),

  "user-location": (width: number, height: number) =>
    iconSVGWrapper(USER_LOCATION_ICON, "user-location", width, height)
};

@Component({
  shadow: false,
  styleUrl: "map-marker.scss",
  tag: "gx-map-marker"
})
export class MapMarker implements GxComponent {
  private markerInstance: any;

  /**
   * The marker image width.
   */
  private iconWidth: number;

  /**
   * The marker image height.
   */
  private iconHeight: number;

  @Element() element: HTMLGxMapMarkerElement;

  /**
   * This attribute lets you specify the alternative text of the marker image.
   */
  @Prop() readonly alt: string;

  /**
   * The coordinates where the marker will appear in the map.
   */
  @Prop({ mutable: true }) coords = "0, 0";

  /**
   * The class that the marker will have.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify the src of the marker image.
   */
  @Prop() readonly src: string;

  /**
   * This attribute lets you specify the srcset of the marker image.
   */
  @Prop() readonly srcset: string;

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
   * Emitted when the element is added to a `<gx-map>`.
   */
  @Event() gxMapMarkerDidLoad: EventEmitter;

  /**
   * Emitted when the element update its data.
   */
  @Event() gxMapMarkerUpdate: EventEmitter;

  /**
   * Emitted when the element is deleted from a `<gx-map>`.
   */
  @Event() gxMapMarkerDeleted: EventEmitter;

  private getHalfSizes(): any {
    const halfIconSizes = {
      height: this.iconHeight / 2,
      width: this.iconWidth / 2
    };
    return halfIconSizes;
  }

  // @ts-expect-error @todo TODO: Improve typing
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
    this.setIconSize();

    const halfSizes = this.getHalfSizes();
    const shouldRenderSrcImage = this.srcset || this.src;

    const srcAttributes = this.getSrcAttributes();
    const altAttribute = this.alt || "";

    const htmlLocationIcon = shouldRenderSrcImage
      ? `<img alt="${altAttribute}" ${srcAttributes.src} ${srcAttributes.srcset} />`
      : iconDictionary[this.type](this.iconWidth, this.iconHeight);

    return divIcon({
      className: this.cssClass,
      iconAnchor: [halfSizes.width, this.iconHeight],
      popupAnchor: [0, -halfSizes.height],
      iconSize: [this.iconWidth, this.iconHeight],
      tooltipAnchor: [0, -halfSizes.height],
      html: htmlLocationIcon
    });
  }

  private getSrcAttributes(): { src: string; srcset: string } {
    return {
      src: this.src ? `src="${this.src}"` : "",
      srcset: this.srcset ? `srcset="${this.srcset}"` : ""
    };
  }

  /**
   * Given the current style of the gx-map-marker control, it gets the value of
   * the width and height custom vars.
   */
  private setIconSize() {
    // The values of the custom properties are retrieved from the computed
    // style of the host
    const computed = getComputedStyle(this.element);

    const width = computed.getPropertyValue("--width");
    const height = computed.getPropertyValue("--height");

    // Only supports size in pixels
    this.iconWidth =
      !width || width.includes("%")
        ? DEFAULT_ICON_SIZE
        : Number(width.replace("px", "").trim());

    this.iconHeight =
      !height || height.includes("%")
        ? DEFAULT_ICON_SIZE
        : Number(height.replace("px", "").trim());
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
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (this.element.firstElementChild) {
      const maxPopupSize = {
        height:
          document.querySelector(".gxMap").clientHeight * MAX_POPUP_SIZE_FACTOR,
        width:
          document.querySelector(".gxMap").clientWidth * MAX_POPUP_SIZE_FACTOR
      };

      this.markerInstance.bindPopup(this.element, {
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
    // Styling for gx-map-marker control.
    const classes = getClasses(this.cssClass);

    return (
      <Host class={!!this.cssClass ? classes.vars : undefined}>
        <slot />
      </Host>
    );
  }
}
