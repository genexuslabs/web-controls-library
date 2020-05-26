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
  tileLayer
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
  private markersList = [];
  private mapProviderApplied: string;
  private mapTypesProviders = {
    hybrid:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };
  private selectionMarker: Element;
  private tileLayerApplied: tileLayer;
  private watchPositionId: number;

  @Element() element: HTMLGxMapElement;

  @State() userLocationCoords: string;

  @Watch("userLocationCoords")
  userLocationHandler() {
    this.userLocationChange.emit(this.userLocationCoords);
  }

  /**
   * The coord of initial center of the map.
   *
   */
  @Prop({ mutable: true }) center = "0, 0";

  /**
   * Enable the High Accuracy in user location.
   * _Note: This property applies when ```watchPosition = true```._
   */
  @Prop() highAccuracyLocator = true;

  /**
   * The map provider.
   * _Note: Currently, this property is for setting a custom map provider using an URL._
   *
   */
  @Prop() mapProvider: string;

  /**
   * Map type to be used.
   * _Note: If you set a map provider, the selected map type will be ignored._
   *
   */
  @Prop() mapType: "standard" | "satellite" | "hybrid" = "standard";

  /**
   * The max zoom level available in the map.
   * _Note: 20 is the best value to be used, only lower values are allowed. Is highly recommended to no change this value if you are not sure about the `maxZoom` supported by the map._
   */
  @Prop({ mutable: true }) maxZoom: number = RECOMMENDED_MAX_ZOOM;

  /**
   * Enables the possibility to navigate the map and select a location point using the map center.
   */
  @Prop() selectionLayer = false;

  /**
   * Indicates if the current location of the device is displayed on the map.
   */
  @Prop() watchPosition = false;

  @Watch("selectionLayer")
  selectionLayerHandler() {
    this.selectionLayerEvents();
  }

  /**
   * The initial zoom level in the map.
   *
   */
  @Prop({ mutable: true }) zoom = 1;

  /**
   * Emmits when the map is loaded.
   *
   */
  @Event() gxMapDidLoad: EventEmitter;

  /**
   * Emmits when the map is clicked and return click coords.
   *
   */
  @Event() mapClick: EventEmitter;

  /**
   * Emmits when the map is being moving while selection layer is active.
   *
   */
  @Event() selectionInput: EventEmitter;

  /**
   * Emmits when the map stoped from being moving while selection layer is active.
   *
   */
  @Event() selectionChange: EventEmitter;

  /**
   * Emmits when user location coords have been changed.
   *
   */
  @Event() userLocationChange: EventEmitter;

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
      const slot = this.isSelectionMarkerSlot();
      if (slot.exist) {
        this.selectionMarker = slot.elem;
      } else {
        this.selectionMarker = this.element.querySelector(
          "[marker-class='gx-default-selection-layer-icon']"
        );
      }
      if (markerElement !== this.selectionMarker) {
        this.markersList.push(markerV);
      }
    }

    markerElement.addEventListener("gxMapMarkerDeleted", () => {
      this.onMapMarkerDeleted(markerV);
    });
  }

  private addMapListener(eventToListen, callbackFunction) {
    this.map.on(eventToListen, callbackFunction);
  }

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

  private isSelectionMarkerSlot(): { exist: boolean; elem: Element } {
    const slot = this.element.querySelector("[slot='selection-layer-marker']");
    if (slot !== null) {
      return { exist: true, elem: slot };
    } else {
      return { exist: false, elem: null };
    }
  }

  private onMapMarkerDeleted(marker: Marker) {
    let i = 0;
    marker.remove();
    while (
      i <= this.markersList.length &&
      this.markersList[i]._leaflet_id !== marker._leaflet_id
    ) {
      i++;
    }
    if (i <= this.markersList.length) {
      this.markersList.splice(i, 1);
    } else {
      console.warn("There was an error in the markers list!");
    }
  }

  private updateSelectionMarkerPosition() {
    const centerCoords = this.map.getCenter();
    this.centerCoords = `${centerCoords.lat},${centerCoords.lng}`;
    this.selectionMarker.setAttribute("coords", this.centerCoords);
  }

  private selectionLayerEvents() {
    if (this.selectionLayer) {
      const moveBehaivor = {
        eventTrigger: "move",
        callbackFunction: () => {
          this.updateSelectionMarkerPosition();
          this.selectionInput.emit(this.centerCoords);
        }
      };
      const moveEndBehaivor = {
        eventTrigger: "move",
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

  private setUserLocation({ coords }) {
    this.userLocationCoords = `${coords.latitude}, ${coords.longitude}`;
  }

  componentWillLoad() {
    if (this.watchPosition) {
      this.watchPositionId = watchPosition(
        this.setUserLocation.bind(this),
        err => console.error(err),
        {
          enableHighAccuracy: this.highAccuracyLocator
        }
      );
    }
    if (this.selectionLayer && this.isSelectionMarkerSlot().exist) {
      this.isSelectionLayerSlot = true;
    }
  }

  componentDidLoad() {
    const elementVar = this.element.querySelector(".gxMap");
    const coords = parseCoords(this.center);

    this.maxZoom = this.checkForMaxZoom();
    this.zoom = this.getZoom();
    if (coords !== null) {
      this.map = LFMap(elementVar).setView(coords, this.zoom, this.maxZoom);
    } else {
      console.warn(
        "GX warning: Can not read 'center' attribute, default center set (gx-map)",
        this.element
      );
      this.map = LFMap(elementVar).setView([0, 0], this.getZoom());
    }
    this.setMapProvider();
    this.map.setMaxZoom(this.maxZoom);
    this.fitBounds();
    this.gxMapDidLoad.emit(this);

    this.updateSelectionMarkerPosition();
    this.selectionLayerEvents();

    this.addMapListener("popupopen", function(e) {
      const px = this.project(e.target._popup._latlng);
      px.y -= e.target._popup._container.clientHeight / 2;
      this.panTo(this.unproject(px), { animate: true });
    });

    this.addMapListener("click", ev => {
      this.mapClick.emit(ev.latlng);
    });
  }

  componentDidUpdate() {
    const maxZoom = this.checkForMaxZoom();
    this.setMapProvider();
    this.fitBounds();
    this.map.setMaxZoom(maxZoom);
    this.userLocationChange.emit(this.userLocationCoords);
  }

  componentDidUnload() {
    navigator.geolocation.clearWatch(this.watchPositionId);
  }

  render() {
    return (
      <Host>
        {this.watchPosition && (
          <gx-map-marker
            marker-class="gx-default-user-location-icon"
            icon-width="15"
            icon-height="15"
            coords={this.userLocationCoords}
          ></gx-map-marker>
        )}
        {this.selectionLayer && this.isSelectionLayerSlot ? (
          <slot name="selection-layer-marker" />
        ) : (
          <gx-map-marker
            marker-class="gx-default-selection-layer-icon"
            icon-width="30"
            icon-height="30"
            coords={this.centerCoords}
          ></gx-map-marker>
        )}
        <div class="gxMapContainer">
          <div class="gxMap"></div>
        </div>
      </Host>
    );
  }
}
