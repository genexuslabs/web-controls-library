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
import { Component as GxComponent, GridMapElement } from "../common/interfaces";
import {
  Circle,
  Control,
  FeatureGroup,
  LatLngTuple,
  map as leafletMap,
  Map as LFMap,
  Marker,
  Polygon,
  Polyline,
  polyline,
  tileLayer,
  TileLayer
} from "leaflet";

// @ts-expect-error Todo: Improve typing
import { MarkerClusterGroup } from "leaflet.markercluster";
import { watchPosition } from "./geolocation";
import "leaflet-draw";

const MIN_ZOOM_LEVEL = 1;
const MAX_ZOOM_LEVEL = 23;

const SELECTION_LAYER_MOVE_EVENT_NAME = "move";
const SELECTION_LAYER_MOVE_END_EVENT_NAME = "moveend";

const MAP_MARKER_DELETED_EVENT_NAME = "gxMapMarkerDeleted";
const MAP_CIRCLE_DELETED_EVENT_NAME = "gxMapCircleDeleted";
const MAP_POLYGON_DELETED_EVENT_NAME = "gxMapPolygonDeleted";
const MAP_LINE_DELETED_EVENT_NAME = "gxMapLineDeleted";

type GridMapElementInstance = Marker | Circle | Polygon | Polyline;
@Component({
  shadow: false,
  styleUrl: "map.scss",
  tag: "gx-map"
})
export class GridMap implements GxComponent {
  private map: LFMap;

  private didLoad = false;
  private needForRAF = true; // To prevent redundant RAF (request animation frame) calls

  // References to map controls
  private markersList = new Map<string, Marker>();
  private circleList = new Map<string, Circle>();
  private polygonsList = new Map<string, Polygon>();
  private linesList = new Map<string, Polyline>();

  private mapTypesProviders = {
    hybrid:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };
  private tileLayerApplied: TileLayer;
  private showMyLocationId: number;
  private resizeObserver: ResizeObserver = null;

  // Refs
  private divMapView: HTMLDivElement;

  @Element() element: HTMLGxMapElement;

  @State() userLocationCoords: string;
  @State() centerCoords: string;

  /**
   * The coord of initial center of the map.
   */
  @Prop({ mutable: true }) center = "0,0";

  /**
   * This attribute determines whether map markers should be grouped. When true,
   * the markers will be grouped depending on their proximity.
   */
  @Prop() clusteringPoints = true;

  /**
   * Enables the possibility to draw the route between two points on the map.
   */
  @Prop() directionLayer = false;

  /**
   * WKT format string containing the response of Google Maps Directions API call
   */
  @Prop() directionLayerWKTString: string;

  /**
   * Enable the High Accuracy in user location.
   * _Note: This property applies when ```watchPosition = true```._
   */
  @Prop() highAccuracyLocator = true;

  /**
   * Indicates how the map will be displayed at startup.
   *
   * | Value           | Details                                                                                                                                       |
   * | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
   * | `showAll`       | (Default value) the map is adjusted to display all the loaded points (and the current device location if Show My Location is set to True).    |
   * | `nearestPoint`  | The map is adjusted to display the current device location and shows my location and the nearest point.                                       |
   * | `radius`        | The map is adjusted to display a fixed radius, from the specified center. The radius value is specified using the initialZoomRadius property. |
   * | `noInitialZoom` | No specific action is taken regarding the initial zoom.                                                                                       |
   */
  @Prop() initialZoom: "showAll" | "nearestPoint" | "radius" | "noInitialZoom" =
    "showAll";

  /**
   * The radius value if `initialZoom` = `"radius"`.
   */
  @Prop() initialZoomRadius = 1;

  /**
   * The map provider.
   * _Note: Currently, this property is for setting a custom map provider using an URL._
   */
  @Prop() mapProvider: string;

  /**
   * Map type to be used.
   * _Note: If you set a map provider, the selected map type will be ignored._
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `standard` | Shows streets.         |
   * | `satellite`   | Shows satellite images of the Earth. |
   * | `hybrid`   | Shows streets over the satellite images. |
   */
  @Prop() mapType: "standard" | "satellite" | "hybrid" = "standard";

  /**
   * A CSS class to set as the `showMyLocation` icon class.
   */
  @Prop() pinImageCssClass: string;

  /**
   * This attribute lets you specify the srcset attribute for the
   * `showMyLocation` icon when the `pinShowMyLocationSrcset` property is not
   * specified.
   */
  @Prop() pinImageSrcset: string;

  /**
   * This attribute lets you specify the srcset attribute for the
   * `showMyLocation` icon. If not set the `pinImageSrcset` property will be
   * used to specify the srcset attribute for the icon.
   * If none of the properties are specified, a default icon will be used
   * when `showMyLocation = true`
   */
  @Prop() pinShowMyLocationSrcset: string;

  /**
   * Enables the possibility to navigate the map and select a location point
   * using the map center.
   */
  @Prop() selectionLayer = false;

  /**
   * A CSS class to set as the `selectionLayer` icon class.
   */
  @Prop() selectionTargetImageCssClass: string;

  /**
   * This attribute lets you specify the srcset attribute for the
   * `selectionLayer` icon. If not set the `pinImageSrcset` property will be
   * used to specify the srcset attribute for the icon.
   * If none of the properties are specified, a default icon will be used
   * when `selectionLayer = true`
   */
  @Prop() selectionTargetImageSrcset: string;

  /**
   * Whether the map can be zoomed by using the mouse wheel.
   */
  @Prop() scrollWheelZoom = true;

  /**
   * Indicates if the current location of the device is displayed on the map.
   */
  @Prop() showMyLocation = false;

  /**
   * The initial zoom level in the map.
   */
  @Prop({ mutable: true }) zoom = 1;

  /**
   * Emitted when the map is loaded.
   */
  @Event() gxMapDidLoad: EventEmitter;

  /**
   * Emitted when the map is clicked and return click coords.
   */
  @Event() mapClick: EventEmitter;

  /**
   * Emitted when the map is being moved, if selection layer is active.
   */
  @Event() selectionInput: EventEmitter;

  /**
   * Emitted when the map stops from being moved, if selection layer is active.
   */
  @Event() selectionChange: EventEmitter;

  /**
   * Emitted when the user location coords change.
   */
  @Event() userLocationChange: EventEmitter;

  @Watch("mapType")
  mapTypeChange() {
    this.setMapProvider();
  }

  @Watch("selectionLayer")
  electionLayerHandler(newValue: boolean) {
    this.registerSelectionLayerEvents(newValue);
  }

  @Listen("gxMapMarkerDidLoad")
  onMapMarkerDidLoad(event: CustomEvent<GridMapElement>) {
    const markerHTMLElement = event.target as HTMLGxMapMarkerElement;
    const { id, instance } = event.detail;

    this.renderMapElementWhenTheMapDidLoad(
      id,
      instance,
      this.markersList,
      markerHTMLElement,
      MAP_MARKER_DELETED_EVENT_NAME
    );

    if (!this.selectionLayer || markerHTMLElement.type != "selection-layer") {
      this.markersList.set(id, instance);
    }
    event.stopPropagation();
  }

  @Listen("gxMapCircleDidLoad")
  onMapCircleDidLoad(event: CustomEvent<GridMapElement>) {
    const circleHTMLElement = event.target as HTMLGxMapCircleElement;
    const { id, instance } = event.detail;

    this.renderMapElementWhenTheMapDidLoad(
      id,
      instance,
      this.circleList,
      circleHTMLElement,
      MAP_CIRCLE_DELETED_EVENT_NAME
    );

    this.circleList.set(id, instance);
    event.stopPropagation();
  }

  @Listen("gxMapPolygonDidLoad")
  onMapPolygonDidLoad(event: CustomEvent<GridMapElement>) {
    const polygonHTMLElement = event.target as HTMLGxMapCircleElement;
    const { id, instance } = event.detail;

    this.renderMapElementWhenTheMapDidLoad(
      id,
      instance,
      this.polygonsList,
      polygonHTMLElement,
      MAP_POLYGON_DELETED_EVENT_NAME
    );

    this.polygonsList.set(id, instance);
    event.stopPropagation();
  }

  @Listen("gxMapLineDidLoad")
  onMapLineDidLoad(event: CustomEvent<GridMapElement>) {
    const lineHTMLElement = event.target as HTMLGxMapCircleElement;
    const { id, instance } = event.detail;

    this.renderMapElementWhenTheMapDidLoad(
      id,
      instance,
      this.linesList,
      lineHTMLElement,
      MAP_LINE_DELETED_EVENT_NAME
    );

    this.linesList.set(id, instance);
    event.stopPropagation();
  }

  private connectResizeObserver() {
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (this.resizeObserver) {
      return;
    }
    this.resizeObserver = new ResizeObserver(this.resizeObserverCallback);
    this.resizeObserver.observe(this.element);
  }

  private resizeObserverCallback = () => {
    const height = this.element.clientHeight;
    const width = this.element.clientWidth;

    this.element.style.setProperty("--gx-map-width", `${width}px`);
    this.element.style.setProperty("--gx-map-height", `${height}px`);
  };

  private disconnectResizeObserver() {
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  // @ts-expect-error @todo TODO: Improve typing
  private addMapListener(eventToListen, callbackFunction) {
    this.map.on(eventToListen, callbackFunction);
  }

  // @ts-expect-error @todo TODO: Improve typing
  private removeMapListener(eventToListen, callbackFunction) {
    this.map.off(eventToListen, callbackFunction);
  }

  /**
   * Allow to draw geometries on the map when `editableGeographies` = `true`.
   */
  private activateDrawOnMap() {
    const drawnItems = new FeatureGroup();
    this.map.addLayer(drawnItems);
    //TODO: How to import the Draw function without using import * as L from "leaflet"
    // Normally the way to use it is L.Control.Draw
    // @ts-expect-error Todo: Improve typing
    const drawControl = new Control.Draw({
      edit: {
        featureGroup: drawnItems
      }
    });
    this.map.addControl(drawControl);

    this.map.on("draw:created", function(e) {
      console.log("created", e);
    });
  }

  /**
   * Sets the map initial view depending of the `initialZoom`` property
   */
  private fitBounds() {
    // Set the maximum zoom level possible to fit all of the map elements when
    // initialZoom property is set to "showAll"
    if (this.initialZoom == "showAll" && this.markersList.size > 1) {
      const markersGroup = new FeatureGroup(
        Array.from(this.markersList.values())
      );

      this.map.fitBounds(markersGroup.getBounds());
    }
    // The map zoom is adjusted to display the current device location and the
    // nearest point when initialZoom property is set to "nearestPoint"
    else if (
      this.initialZoom == "nearestPoint" &&
      this.userLocationCoords &&
      this.markersList.size > 1
    ) {
      this.map.setView(
        this.fromStringToLatLngTuple(this.userLocationCoords),
        this.zoom
      );
    }

    // The map zoom is adjusted to display a fixed radius specified on
    // initialZoomRadius property when initialZoom property is set to "radius"
    else if (this.initialZoom == "radius" && this.markersList.size > 1) {
      this.map.setView(
        this.fromStringToLatLngTuple(this.userLocationCoords),
        this.initialZoomRadius
      );
    }
    // Use default zoom otherwise
    else {
      if (this.center) {
        this.map.setView(this.fromStringToLatLngTuple(this.center), this.zoom);
      }
    }
  }

  private fromStringToLatLngTuple(value: string): LatLngTuple {
    return value.split(",").map(Number) as LatLngTuple;
  }

  private getZoomLevel = () =>
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    !!this.zoom
      ? Math.min(Math.max(this.zoom, MIN_ZOOM_LEVEL), MAX_ZOOM_LEVEL)
      : MIN_ZOOM_LEVEL;

  private removeMapElement(
    mapElementId: string,
    mapElementInstance: GridMapElementInstance,
    mapOfMapElements: Map<string, GridMapElementInstance>
  ) {
    mapElementInstance.remove();
    mapOfMapElements.delete(mapElementId);
  }

  private updateSelectionMarkerPosition() {
    if (!this.needForRAF) {
      return;
    }
    // No need to call RAF up until next frame
    this.needForRAF = false;

    requestAnimationFrame(() => {
      this.needForRAF = true; // RAF now consumes the movement instruction so a new one can come
      const centerCoords = this.map.getCenter();
      this.centerCoords = `${centerCoords.lat},${centerCoords.lng}`;

      this.selectionInput.emit(this.centerCoords);
    });
  }

  /**
   * Sets or removes the event handlers for the selection layer property.
   * @param upcomingSelectionLayerValue Determine the `selectionLayer` value. Useful when the selectionLayer will be modified in the next render
   */
  private registerSelectionLayerEvents(upcomingSelectionLayerValue: boolean) {
    // Add handlers
    if (upcomingSelectionLayerValue) {
      this.addMapListener(SELECTION_LAYER_MOVE_EVENT_NAME, () => {
        this.updateSelectionMarkerPosition();
      });
      this.addMapListener(SELECTION_LAYER_MOVE_END_EVENT_NAME, () => {
        this.updateSelectionMarkerPosition();
      });

      // Remove handlers
    } else {
      this.removeMapListener(SELECTION_LAYER_MOVE_EVENT_NAME, () => {
        this.updateSelectionMarkerPosition();
      });
      this.removeMapListener(SELECTION_LAYER_MOVE_END_EVENT_NAME, () => {
        this.updateSelectionMarkerPosition();
      });
    }
  }

  /**
   * Allow to group markers depending of proximity when
   * `clusteringPoints` = `true`.
   */
  private activateCLusteringPoints() {
    const markers = new MarkerClusterGroup();
    const markersArray = Array.from(this.markersList.values());
    const fg = new FeatureGroup(markersArray);

    markers.addLayer(fg);
    this.map.setMaxZoom(MAX_ZOOM_LEVEL);
    this.map.addLayer(markers);
  }

  private setMapProvider() {
    this.removeTileLayer();
    const mapProviderToRender =
      this.mapProvider ||
      this.mapTypesProviders[this.mapType] ||
      this.mapTypesProviders.standard;

    const tileLayerToApply = tileLayer(mapProviderToRender, {
      maxZoom: MAX_ZOOM_LEVEL
    });
    tileLayerToApply.addTo(this.map);
    this.tileLayerApplied = tileLayerToApply;
  }

  private removeTileLayer() {
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (this.didLoad && this.tileLayerApplied) {
      this.tileLayerApplied.removeFrom(this.map);
    }
  }

  private renderMapElementWhenTheMapDidLoad(
    mapElementId: string,
    mapElementInstance: GridMapElementInstance,
    mapOfMapElements: Map<string, GridMapElementInstance>,
    mapHTMLElement:
      | HTMLGxMapCircleElement
      | HTMLGxMapLineElement
      | HTMLGxMapMarkerElement
      | HTMLGxMapPolygonElement,
    mapHTMLElementDisconnectedEvent: string
  ) {
    // If the map did render
    if (this.didLoad) {
      mapElementInstance.addTo(this.map);

      // Otherwise, wait until the first render
    } else {
      this.element.addEventListener("gxMapDidLoad", () => {
        mapElementInstance.addTo(this.map);
      });
    }

    mapHTMLElement.addEventListener(mapHTMLElementDisconnectedEvent, () => {
      this.removeMapElement(mapElementId, mapElementInstance, mapOfMapElements);
    });
  }

  /**
   * Used to avoid opening the marker's popup when clicking on the map. This
   * function is necessary as this behavior is a bug in the leaflet implementation.
   */
  private preventPopupDisplayWhenClickingOnTheMap() {
    this.divMapView.addEventListener(
      "click",
      (event: UIEvent) => {
        if (event.target == this.divMapView) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      { capture: true }
    );
  }

  /**
   * Set visibility of the kmlLayers loaded with LoadKMLLayer
   */
  /* private toggleVisibilityKmlLayer() {
    this.kmlLayerVisible
      ? (this.map.getPane("fromKML").style.display = "none")
      : (this.map.getPane("fromKML").style.display = "block");
  } */

  // @ts-expect-error Todo: Improve typing
  private setUserLocation = ({ coords }) => {
    this.userLocationCoords = `${coords.latitude}, ${coords.longitude}`;
    this.userLocationChange.emit(this.userLocationCoords);
  };

  componentWillLoad() {
    this.zoom = this.getZoomLevel();
    if (this.showMyLocation) {
      this.showMyLocationId = watchPosition(
        this.setUserLocation,
        err => console.error(err),
        {
          enableHighAccuracy: this.highAccuracyLocator
        }
      );
    }
  }

  /**
   * Transform a WKT format string to Polyline latLang array.
   * @param lineString WKT format string. Example: LINESTRING (-56.18565 -34.90555, -56.1859 -34.90558, -56.18645 -34.90561)
   * @returns Array of latLong coordinates. Example: [[-56.18565, -34.90555],[-56.1859, -34.90558],[-56.18645, -34.90561]]
   */
  private wktToPolyline(lineString: string) {
    const wktString = lineString
      .split("(")
      .pop()
      .slice(0, -1);
    const wktArray = wktString.split(",");

    // @ts-expect-error: Todo: Improve typing
    const polyline = [];

    wktArray.forEach(element => {
      element = element.trim();
      const latLng = element.split(" ");
      polyline.push([parseFloat(latLng[0]), parseFloat(latLng[1])]);
    });

    // @ts-expect-error: Todo: Improve typing
    return polyline;
  }

  componentDidLoad() {
    this.connectResizeObserver();

    // Depending on the coordinates, set different view types
    if (this.center != undefined) {
      this.map = leafletMap(this.divMapView, {
        scrollWheelZoom: this.scrollWheelZoom
      }).setView(this.fromStringToLatLngTuple(this.center), this.zoom);
    } else {
      this.map = leafletMap(this.divMapView, {
        scrollWheelZoom: this.scrollWheelZoom
      }).setView([0, 0], this.getZoomLevel());
    }

    this.activateDrawOnMap();
    this.preventPopupDisplayWhenClickingOnTheMap();
    this.map.createPane("fromKML");

    /// Set the leaflet default marker icon
    /* const markerIcon = new Icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
    }); */

    if (this.clusteringPoints) {
      this.activateCLusteringPoints();
    }

    // zoom the map to the polyline

    this.setMapProvider();
    this.map.setMaxZoom(MAX_ZOOM_LEVEL);
    this.fitBounds();
    this.gxMapDidLoad.emit(this);

    if (this.selectionLayer) {
      this.updateSelectionMarkerPosition();
      this.registerSelectionLayerEvents(true);
    }
    if (this.directionLayer) {
      const latLangs = this.wktToPolyline(this.directionLayerWKTString);
      polyline(latLangs, { color: "red" }).addTo(this.map);
    }

    // @ts-expect-error @todo TODO: Improve typing
    this.addMapListener("popupopen", function(e) {
      const px = this.project(e.target._popup._latlng);
      px.y -= e.target._popup._container.clientHeight / 2;
      this.panTo(this.unproject(px), { animate: true });
    });
    this.didLoad = true;
  }

  disconnectedCallback() {
    navigator.geolocation.clearWatch(this.showMyLocationId);
    this.disconnectResizeObserver();
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
        {this.selectionLayer && (
          <gx-map-marker
            coords={this.centerCoords}
            css-class={this.selectionTargetImageCssClass}
            srcset={this.selectionTargetImageSrcset || this.pinImageSrcset}
            type="selection-layer"
          ></gx-map-marker>
        )}

        <div
          class="gxMap"
          ref={el => (this.divMapView = el as HTMLDivElement)}
        ></div>
      </Host>
    );
  }
}
