import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State,
  h,
  Host,
  Watch
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import {
  FeatureGroup,
  Marker,
  map as LFMap,
  polygon,
  polyline,
  tileLayer,
  circle
  // @ts-expect-error @todo TODO: Fix this import
} from "leaflet/dist/leaflet-src.esm";

import { parseCoords } from "../common/coordsValidate";
import { watchPosition } from "./geolocation";

const MIN_ZOOM = 1;
const RECOMMENDED_MAX_ZOOM = 20;

@Component({
  shadow: false,
  styleUrl: "map.scss",
  tag: "gx-map"
})
export class Map implements GxComponent {
  private centerCoords: string;
  private isSelectionLayerSlot = false;
  private map: LFMap;

  /**
   * @todo TODO: Use a different structure to improve operations on elements.
   * For example, `markersList = new Map<string, Marker>();`
   */
  // Map elements
  // @ts-expect-error @todo TODO: Improve typing
  private markersList = [];

  // @ts-expect-error @todo TODO: Improve typing
  private circleList = [];

  // @ts-expect-error @todo TODO: Improve typing
  private polygonsList = [];

  // @ts-expect-error @todo TODO: Improve typing
  private linesList = [];

  private mapProviderApplied: string;
  private mapTypesProviders = {
    hybrid:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };
  private tileLayerApplied: tileLayer;
  private showMyLocationId: number;

  // Refs
  private divMapView: HTMLDivElement;
  private selectionMarker: HTMLGxMapMarkerElement;

  @Element() element: HTMLGxMapElement;

  @State() userLocationCoords: string;

  /**
   * The coord of initial center of the map.
   */
  @Prop({ mutable: true }) center = "0, 0";

  /**
   * Enable the High Accuracy in user location.
   * _Note: This property applies when ```watchPosition = true```._
   */
  @Prop() readonly highAccuracyLocator = true;

  /**
   * The map provider.
   * _Note: Currently, this property is for setting a custom map provider using an URL._
   *
   */
  @Prop() readonly mapProvider: string;

  /**
   * Map type to be used.
   * _Note: If you set a map provider, the selected map type will be ignored._
   */
  @Prop() readonly mapType: "standard" | "satellite" | "hybrid" = "standard";

  /**
   * The max zoom level available in the map.
   * _Note: 20 is the best value to be used, only lower values are allowed. Is highly recommended to no change this value if you are not sure about the `maxZoom` supported by the map._
   */
  @Prop({ mutable: true }) maxZoom: number = RECOMMENDED_MAX_ZOOM;

  /**
   * A CSS class to set as the `showMyLocation` icon class.
   */
  @Prop() readonly pinImageCssClass: string;

  /**
   * This attribute lets you specify the srcset attribute for the
   * `showMyLocation` icon when the `pinShowMyLocationSrcset` property is not
   * specified.
   */
  @Prop() readonly pinImageSrcset: string;

  /**
   * This attribute lets you specify the srcset attribute for the
   * `showMyLocation` icon. If not set the `pinImageSrcset` property will be
   * used to specify the srcset attribute for the icon.
   * If none of the properties are specified, a default icon will be used
   * when `showMyLocation = true`
   */
  @Prop() readonly pinShowMyLocationSrcset: string;

  /**
   * Enables the possibility to navigate the map and select a location point using the map center.
   */
  @Prop() readonly selectionLayer = false;

  /**
   * Whether the map can be zoomed by using the mouse wheel.
   */
  @Prop() readonly scrollWheelZoom: boolean = true;

  /**
   * Indicates if the current location of the device is displayed on the map.
   */
  @Prop() readonly showMyLocation = false;

  /**
   * The initial zoom level in the map.
   */
  @Prop({ mutable: true }) zoom = 1;

  /**
   * Emmited when the map is loaded.
   */
  @Event() gxMapDidLoad: EventEmitter;

  /**
   * Emmited when the map is clicked and return click coords.
   */
  @Event() mapClick: EventEmitter;

  /**
   * Emmited when the map is being moved, if selection layer is active.
   */
  @Event() selectionInput: EventEmitter;

  /**
   * Emmited when the map stops from being moved, if selection layer is active.
   */
  @Event() selectionChange: EventEmitter;

  /**
   * Emmited when the user location coords change.
   */
  @Event() userLocationChange: EventEmitter;

  @Watch("selectionLayer")
  selectionLayerHandler() {
    this.registerSelectionLayerEvents();
  }

  @Watch("userLocationCoords")
  userLocationHandler() {
    this.userLocationChange.emit(this.userLocationCoords);
  }

  @Listen("gxMapMarkerDidLoad")
  onMapMarkerDidLoad(event: CustomEvent) {
    const markerElement = event.target;
    const markerV = event.detail;

    if (this.map) {
      markerV.addTo(this.map);
    } else {
      this.element.addEventListener("gxMapDidLoad", () => {
        markerV.addTo(this.map);
      });
    }

    if (this.selectionLayer) {
      const slot = this.getSelectionMarkerSlot();
      if (slot.exist) {
        this.selectionMarker = slot.elem;
      } else {
        this.selectionMarker = this.element.querySelector(
          "[type='selection-layer']"
        );
      }
      if (markerElement !== this.selectionMarker) {
        this.markersList.push(markerV);
      }
    } else {
      this.markersList.push(markerV);
    }

    markerElement.addEventListener("gxMapMarkerDeleted", () => {
      this.onMapMarkerDeleted(markerV);
    });
  }

  @Listen("gxMapCircleDidLoad")
  onMapCircleDidLoad(event: CustomEvent) {
    const circleElement = event.target;
    const circleV = event.detail;
    if (this.map) {
      circleV.addTo(this.map);
    } else {
      this.element.addEventListener("gxMapDidLoad", () => {
        circleV.addTo(this.map);
      });
    }
    this.circleList.push(circleV);
    circleElement.addEventListener("gxMapCircleDeleted", () => {
      this.onMapCircleDeleted(circleV);
    });
  }

  @Listen("gxMapPolygonDidLoad")
  onMapPolygonDidLoad(event: CustomEvent) {
    const polygonElement = event.target as HTMLGxMapPolygonElement;
    const polygonInstance = event.detail as polygon;

    // If the leaflet map has been created, add the polygon instance. Otherwise,
    // wait for the leaflet map to load
    if (this.map) {
      polygonInstance.addTo(this.map);
    } else {
      this.element.addEventListener("gxMapDidLoad", () => {
        polygonInstance.addTo(this.map);
      });
    }

    // When the polygon element is removed from the DOM, remove the polygon
    // instance in the gx-map
    polygonElement.addEventListener("gxMapPolygonDeleted", () => {
      this.onMapPolygonDeleted(polygonInstance);
    });
  }

  @Listen("gxMapLineDidLoad")
  onMapLineDidLoad(event: CustomEvent) {
    const lineElement = event.target;
    const lineV = event.detail;
    if (this.map) {
      lineV.addTo(this.map);
    } else {
      this.element.addEventListener("gxMapDidLoad", () => {
        lineV.addTo(this.map);
      });
    }

    lineElement.addEventListener("gxMapLineDeleted", () => {
      this.onMapLineDeleted(lineV);
    });
  }

  // @ts-expect-error @todo TODO: Improve typing
  private addMapListener(eventToListen, callbackFunction) {
    this.map.on(eventToListen, callbackFunction);
  }

  // @ts-expect-error @todo TODO: Improve typing
  private removeMapListener(eventToListen, callbackFunction) {
    this.map.off(eventToListen, callbackFunction);
  }

  private checkForMaxZoom() {
    return this.maxZoom < 20 ? this.maxZoom : RECOMMENDED_MAX_ZOOM;
  }

  private fitBounds() {
    if (this.markersList.length > 1) {
      const markersGroup = new FeatureGroup(this.markersList);
      this.map.fitBounds(markersGroup.getBounds());
    } else if (this.markersList.length === 1) {
      const [marker] = this.markersList;
      const markerCoords = [marker._latlng.lat, marker._latlng.lng];
      this.map.setView(markerCoords, this.zoom);
    }
  }

  private getZoom() {
    return this.zoom > 0
      ? this.zoom < RECOMMENDED_MAX_ZOOM
        ? this.zoom
        : RECOMMENDED_MAX_ZOOM - 1
      : MIN_ZOOM;
  }

  private getSelectionMarkerSlot(): {
    exist: boolean;
    elem: HTMLGxMapMarkerElement;
  } {
    const slot = this.element.querySelector<HTMLGxMapMarkerElement>(
      "[slot='selection-layer-marker']"
    );
    return { exist: slot !== null, elem: slot };
  }

  private onMapMarkerDeleted(markerInstance: Marker) {
    markerInstance.remove();

    this.searchAndRemoveMapElement(markerInstance, this.markersList);
  }

  private onMapCircleDeleted(circleInstance: circle) {
    circleInstance.remove();

    this.searchAndRemoveMapElement(circleInstance, this.circleList);
  }

  private onMapPolygonDeleted(polygonInstance: polygon) {
    polygonInstance.remove();

    this.searchAndRemoveMapElement(polygonInstance, this.polygonsList);
  }

  private onMapLineDeleted(lineInstance: polyline) {
    lineInstance.remove();

    this.searchAndRemoveMapElement(lineInstance, this.linesList);
  }

  private searchAndRemoveMapElement(
    mapElement: Marker | circle | polygon | polyline,
    listOfElements: any[]
  ) {
    let elementIndex = 0;

    // Try to find in the list the element id
    while (
      elementIndex <= listOfElements.length &&
      listOfElements[elementIndex]._leaflet_id !== mapElement._leaflet_id
    ) {
      elementIndex++;
    }

    // Remove element if found in list
    if (elementIndex <= listOfElements.length) {
      listOfElements.splice(elementIndex, 1);
    }
  }

  private updateSelectionMarkerPosition() {
    const centerCoords = this.map.getCenter();
    this.centerCoords = `${centerCoords.lat},${centerCoords.lng}`;
    this.selectionMarker.setAttribute("coords", this.centerCoords);
  }

  private registerSelectionLayerEvents() {
    if (this.selectionLayer) {
      const moveBehaivor = {
        eventTrigger: "move",
        callbackFunction: () => {
          this.updateSelectionMarkerPosition();
          this.selectionInput.emit(this.centerCoords);
        }
      };
      const moveEndBehaivor = {
        eventTrigger: "moveend",
        callbackFunction: () => {
          this.updateSelectionMarkerPosition();
          this.selectionChange.emit(this.centerCoords);
        }
      };
      if (this.selectionLayer) {
        this.addMapListener(
          moveBehaivor.eventTrigger,
          moveBehaivor.callbackFunction
        );
        this.addMapListener(
          moveEndBehaivor.eventTrigger,
          moveEndBehaivor.callbackFunction
        );
      } else {
        this.removeMapListener(
          moveBehaivor.eventTrigger,
          moveBehaivor.callbackFunction
        );
        this.removeMapListener(
          moveEndBehaivor.eventTrigger,
          moveEndBehaivor.callbackFunction
        );
      }
    }
  }

  // @ts-expect-error @todo TODO: Improve typing
  private selectingTypes(mapType) {
    const tileLayerToApply = tileLayer(mapType, {
      maxZoom: this.maxZoom
    });
    tileLayerToApply.addTo(this.map);
    this.mapProviderApplied = tileLayerToApply;
  }

  private setMapProvider() {
    if (this.mapProviderApplied && this.tileLayerApplied) {
      this.tileLayerApplied.removeFrom(this.map);
    }
    if (this.mapProvider) {
      const tileLayerToApply = tileLayer(this.mapProvider, {
        maxZoom: this.maxZoom
      });
      tileLayerToApply.addTo(this.map);
      this.mapProviderApplied = this.mapProvider;
      this.tileLayerApplied = tileLayerToApply;
    } else {
      /**
       * @todo TODO: Use the existing dictionary to refactor these conditions,
       * since the only variable in play is this.mapType.
       * For example:
       *   const mapTypeProvider = this.mapTypesProviders[this.mapType] || this.mapTypesProviders.standard;
       *   this.selectingTypes(mapTypeProvider);
       */
      if (!this.mapType || this.mapType === "standard") {
        this.selectingTypes(this.mapTypesProviders.standard);
      } else {
        if (this.mapType === "hybrid") {
          this.selectingTypes(this.mapTypesProviders.hybrid);
        } else if (this.mapType === "satellite") {
          this.selectingTypes(this.mapTypesProviders.satellite);
        }
      }
    }
  }

  // @ts-expect-error @todo TODO: Improve typing
  private setUserLocation({ coords }) {
    this.userLocationCoords = `${coords.latitude}, ${coords.longitude}`;
  }

  componentWillLoad() {
    if (this.showMyLocation) {
      this.showMyLocationId = watchPosition(
        this.setUserLocation.bind(this),
        err => console.error(err),
        {
          enableHighAccuracy: this.highAccuracyLocator
        }
      );
    }
    if (this.selectionLayer && this.getSelectionMarkerSlot().exist) {
      this.isSelectionLayerSlot = true;
    }
  }

  componentDidLoad() {
    const coords = parseCoords(this.center);

    this.maxZoom = this.checkForMaxZoom();
    this.zoom = this.getZoom();

    // Depending on the coordinates, set different view types
    if (coords !== null) {
      this.map = LFMap(this.divMapView, {
        scrollWheelZoom: this.scrollWheelZoom
      }).setView(coords, this.zoom, this.maxZoom);
    } else {
      this.map = LFMap(this.divMapView, {
        scrollWheelZoom: this.scrollWheelZoom
      }).setView([0, 0], this.getZoom());
    }

    this.setMapProvider();
    this.map.setMaxZoom(this.maxZoom);
    this.fitBounds();

    this.gxMapDidLoad.emit(this);

    if (this.selectionLayer) {
      this.updateSelectionMarkerPosition();
      this.registerSelectionLayerEvents();
    }

    // @ts-expect-error @todo TODO: Improve typing
    this.addMapListener("popupopen", function (e) {
      const px = this.project(e.target._popup._latlng);
      px.y -= e.target._popup._container.clientHeight / 2;
      this.panTo(this.unproject(px), { animate: true });
    });

    // @ts-expect-error @todo TODO: Improve typing
    this.addMapListener("click", ev => {
      this.mapClick.emit(ev.latlng);
    });
  }

  componentDidUpdate() {
    const maxZoom = this.checkForMaxZoom();
    this.setMapProvider();
    if (this.selectionLayer) {
      this.fitBounds();
    }
    this.map.setMaxZoom(maxZoom);
    this.userLocationChange.emit(this.userLocationCoords);
  }

  disconnectedCallback() {
    navigator.geolocation.clearWatch(this.showMyLocationId);
  }

  render() {
    return (
      <Host>
        {this.showMyLocation && (
          <gx-map-marker
            coords={this.userLocationCoords}
            css-class={this.pinImageCssClass}
            srcset={this.pinShowMyLocationSrcset || this.pinImageSrcset}
            type="user-location"
          ></gx-map-marker>
        )}

        {this.selectionLayer &&
          (this.isSelectionLayerSlot ? (
            <slot name="selection-layer-marker" />
          ) : (
            <gx-map-marker
              type="selection-layer"
              coords={this.centerCoords}
            ></gx-map-marker>
          ))}

        <div class="gxMapContainer">
          <div
            class="gxMap"
            ref={el => (this.divMapView = el as HTMLDivElement)}
          ></div>
        </div>
      </Host>
    );
  }
}
