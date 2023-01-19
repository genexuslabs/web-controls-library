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
  geoJson
} from "leaflet/dist/leaflet-src.esm";
/* import * as L from "leaflet"; */
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { parseCoords } from "../common/coordsValidate";
import { watchPosition } from "./geolocation";
import togeojson from "togeojson";

const MIN_ZOOM_LEVEL = 1;
const MAX_ZOOM_LEVEL = 23;

@Component({
  shadow: false,
  styleUrl: "map.scss",
  tag: "gx-map"
})
export class Map implements GxComponent {
  private centerCoords: string;
  /* private isSelectionLayerSlot = false; */
  private map: LFMap;
  private markersList = [];
  private polygonsList = [];
  private linesList = [];
  private mapProviderApplied: string;
  private mapTypesProviders = {
    hybrid:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };
  private selectionMarker: HTMLGxMapMarkerElement;
  private tileLayerApplied: tileLayer;
  private showMyLocationId: number;
  private resizeObserver: ResizeObserver = null;
  private kmlLayerVisible = false;
  // Refs
  private divMapView: HTMLDivElement;

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
   */
  @Prop() mapType: "standard" | "satellite" | "hybrid" = "standard";

  /**
   * The max zoom level available in the map.
   * _Note: 20 is the best value to be used, only lower values are allowed. Is highly recommended to no change this value if you are not sure about the `maxZoom` supported by the map._
   */
  @Prop({ mutable: true }) maxZoom: number = MAX_ZOOM_LEVEL;

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
   * Enables the possibility to navigate the map and select a location point using the map center.
   */
  @Prop() selectionLayer = false;
  /**
   * Enables the possibility to draw the route between two points on the map.
   */
  @Prop() directionLayer = false;
  /**
   * WKT format string containing the response of Google Maps Directions API call
   */
  @Prop() directionLayerWKTString: string;
  /**
   * Whether the map can be zoomed by using the mouse wheel.
   */
  @Prop() scrollWheelZoom = true;

  /**
   * Indicates if the current location of the device is displayed on the map.
   */
  @Prop() showMyLocation = false;

  /**
   * 	Indicates how the map will be displayed at startup
   */
  @Prop() initialZoom: "showAll" | "nearestPoint" | "radius" | "noInitialZoom" =
    "noInitialZoom";
  /**
   * 	The radius value if initialZoom is set to "radius"
   */
  @Prop() initialZoomRadius = 1;

  /**
   * The initial zoom level in the map.
   *
   */
  @Prop({ mutable: true }) zoom = 1;

  /**
   * Image src set to selection layer
   *@default ""
   */
  @Prop() selectionTargetImageSrc: "";

  /**
   * A CSS class to set as the `selectionTargetImageClass` icon class.
   */
  @Prop() selectionTargetImageClass: "";

  /**
   * Emmited when the map is loaded.
   *
   */
  @Event() gxMapDidLoad: EventEmitter;

  /**
   * Emmited when the map is being moved, if selection layer is active.
   *
   */
  @Event() selectionInput: EventEmitter;

  /**
   * Emmited when the map stops from being moved, if selection layer is active.
   *
   */
  @Event() selectionChange: EventEmitter;

  /**
   * Emmited when the user location coords change.
   *
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

  private addMapListener(eventToListen, callbackFunction) {
    this.map.on(eventToListen, callbackFunction);
  }

  private removeMapListener(eventToListen, callbackFunction) {
    this.map.off(eventToListen, callbackFunction);
  }

  private checkForMaxZoom() {
    return this.maxZoom < 20 ? this.maxZoom : MAX_ZOOM_LEVEL;
  }

  /**
   *Sets the map initial view depending of the initialZoom property
   */
  private fitBounds() {
    if (this.markersList.length > 1 && this.initialZoom == "showAll") {
      const markersGroup = new FeatureGroup(this.markersList);
      this.map.fitBounds(markersGroup.getBounds());
    } else if (
      this.markersList.length > 1 &&
      this.initialZoom == "nearestPoint" &&
      this.userLocationCoords
    ) {
      this.map.setView(this.userLocationCoords.split(","), this.zoom);
    } else if (this.markersList.length > 1 && this.initialZoom == "radius") {
      this.map.setView(this.center.split(","), this.initialZoomRadius);
    } else {
      const [marker] = this.markersList;
      const markerCoords = [marker._latlng.lat, marker._latlng.lng];
      this.map.setView(markerCoords, this.zoom);
    }
  }

  private getZoomLevel = () =>
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    !!this.zoom
      ? Math.min(Math.max(this.zoom, MIN_ZOOM_LEVEL), MAX_ZOOM_LEVEL)
      : MIN_ZOOM_LEVEL;

  private getSelectionMarkerSlot(): {
    exist: boolean;
    elem: HTMLGxMapMarkerElement;
  } {
    const slot = this.element.querySelector<HTMLGxMapMarkerElement>(
      "[slot='selection-layer-marker']"
    );
    return { exist: slot !== null, elem: slot };
  }

  private onMapMarkerDeleted(marker: Marker) {
    let i = 0;
    marker.remove();
    while (
      i < this.markersList.length &&
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

  private onMapPolygonDeleted(polygonInstance: polygon) {
    polygonInstance.remove();

    this.searchAndRemoveMapElement(polygonInstance, this.polygonsList);
  }

  private onMapLineDeleted(lineInstance: polyline) {
    lineInstance.remove();

    this.searchAndRemoveMapElement(lineInstance, this.linesList);
  }

  private searchAndRemoveMapElement(
    mapElement: polygon | polyline,
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

  /**
   *Load a new Feature from a KML formatted string
   * @param kmlString KML string containing the Feature to Load
   *
   */
  private LoadKMLLayer(kmlString: string) {
    const kml = new DOMParser().parseFromString(kmlString, "text/html");

    const geoFromKML = togeojson.kml(kml);
    console.log("geoJson ", geoFromKML);

    geoJson(geoFromKML, { pane: "fromKML" }).addTo(this.map);
  }

  /**
   * Set visibility of the kmlLayers loaded with LoadKMLLayer
   */
  private toggleVisibilityKmlLayer() {
    this.kmlLayerVisible
      ? (this.map.getPane("fromKML").style.display = "none")
      : (this.map.getPane("fromKML").style.display = "block");
  }

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
    //TODO: Para qué se usa el slot?
    if (this.selectionLayer) {
      /*   this.isSelectionLayerSlot = true; */
    }
  }
  /**
   * Transform a WKT format string to Polyline latLang array
   * @param lineString WKT format string. Example: LINESTRING (-56.18565 -34.90555, -56.1859 -34.90558, -56.18645 -34.90561)
   * @returns Array of latLong coordinates. Example: [[-56.18565, -34.90555],[-56.1859, -34.90558],[-56.18645, -34.90561]]
   */
  private wktToPolyline(lineString: string) {
    const wktString = lineString
      .split("(")
      .pop()
      .slice(0, -1);
    const wktArray = wktString.split(",");
    const polyline = [];
    wktArray.forEach(element => {
      element = element.trim();
      const latLng = element.split(" ");
      polyline.push([parseFloat(latLng[0]), parseFloat(latLng[1])]);
    });
    return polyline;
  }

  componentDidLoad() {
    const coords = parseCoords(this.center);
    this.maxZoom = this.checkForMaxZoom();
    this.zoom = this.getZoomLevel();
    this.connectResizeObserver();
    // Depending on the coordinates, set different view types
    if (coords !== null) {
      this.map = LFMap(this.divMapView, {
        scrollWheelZoom: this.scrollWheelZoom
      }).setView(coords, this.zoom, this.maxZoom);
    } else {
      this.map = LFMap(this.divMapView, {
        scrollWheelZoom: this.scrollWheelZoom
      }).setView([0, 0], this.getZoomLevel());
    }
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
    this.map.createPane("fromKML");

    this.LoadKMLLayer(`<?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://earth.google.com/kml/2.1">
    <!-- Data derived from:
           Ed Knittel - || tastypopsicle.com
           Feel free to use this file for your own purposes.
           Just leave the comments and credits when doing so.
    -->
      <Document>
        <name>Chicago Transit Map</name>
        <description>Chicago Transit Authority train lines</description>
    
        <Style id="blueLine">
          <LineStyle>
            <color>ffff0000</color>
            <width>4</width>
          </LineStyle>
        </Style>
        <Style id="redLine">
          <LineStyle>
            <color>ff0000ff</color>
            <width>4</width>
          </LineStyle>
        </Style>
        <Style id="greenLine">
          <LineStyle>
            <color>ff009900</color>
            <width>4</width>
          </LineStyle>
        </Style>
        <Style id="orangeLine">
          <LineStyle>
            <color>ff00ccff</color>
            <width>4</width>
          </LineStyle>
        </Style>
        <Style id="pinkLine">
          <LineStyle>
            <color>ffff33ff</color>
            <width>4</width>
          </LineStyle>
        </Style>
        <Style id="brownLine">
          <LineStyle>
            <color>ff66a1cc</color>
            <width>4</width>
          </LineStyle>
        </Style>
        <Style id="purpleLine">
          <LineStyle>
            <color>ffcc00cc</color>
            <width>4</width>
          </LineStyle>
        </Style>
        <Style id="yellowLine">
          <LineStyle>
            <color>ff61f2f2</color>
            <width>4</width>
          </LineStyle>
        </Style>
    
        <Placemark>
          <name>Blue Line</name>
          <styleUrl>#blueLine</styleUrl>
          <LineString>
            <altitudeMode>relative</altitudeMode>
            <coordinates>
    -87.89289951324463,41.97881025520548,0
    -87.89184808731079,41.97788506340239,0
    -87.89150476455688,41.97762983571196,0
    -87.8912901878357,41.97750222148314,0
    -87.89090394973755,41.977326751500996,0
    -87.89047479629517,41.97719913666485,0
    -87.88987398147583,41.97707152157296,0
    -87.88912296295166,41.97702366584759,0
    -87.88856506347656,41.97708747347342,0
    -87.88757801055908,41.977326751500996,0
    -87.87487506866455,41.982574690129766,0
    -87.87399530410767,41.9828777493635,0
    -87.87305116653442,41.983101055244255,0
    -87.87238597869873,41.983196757524844,0
    -87.87172079086304,41.98327650931544,0
    -87.8705620765686,41.98346791320532,0
    -87.8670859336853,41.98394642041268,0
    -87.86622762680054,41.983994270935625,0
    -87.86554098129272,41.98401022110195,0
    -87.86120653152466,41.98367526677005,0
    -87.85824537277222,41.98353171437408,0
    -87.85753726959229,41.98354766465628,0
    -87.85320281982422,41.98372311749676,0
    -87.85275220870972,41.983739067731015,0
    -87.85230159759521,41.98380286862806,0
    -87.85122871398926,41.98383476905263,0
    -87.83650875091553,41.984281373318076,0
    -87.83138036727905,41.984504674276074,0
    -87.82994270324707,41.984520624314534,0
    -87.82902002334595,41.98447277418717,0
    -87.82820463180542,41.98447277418717,0
    -87.8272819519043,41.98444087408228,0
    -87.82620906829834,41.984345173671706,0
    -87.8248143196106,41.984201622786145,0
    -87.82307624816895,41.98401022110195,0
    -87.81835556030273,41.983356261006136,0
    -87.81533002853394,41.98265444269954,0
    -87.8138279914856,41.98235138240297,0
    -87.81303405761719,41.982271629453585,0
    -87.8121542930603,41.982255678851736,0
    -87.80685424804688,41.982271629453585,0
    -87.78539657592773,41.98239923412463,0
    -87.78486013412476,41.98235138240297,0
    -87.78436660766602,41.982255678851736,0
    -87.7838945388794,41.982144024526825,0
    -87.78310060501099,41.98185691250655,0
    -87.78181314468384,41.981186979424656,0
    -87.76951789855957,41.97426392485398,0
    -87.76625633239746,41.972445301840345,0
    -87.76541948318481,41.97203052089854,0
    -87.76466846466064,41.97175931651467,0
    -87.76419639587402,41.97159978398474,0
    -87.76344537734985,41.971392391098526,0
    -87.76207208633423,41.971057370394334,0
    -87.76097774505615,41.970674487431914,0
    -87.75140762329102,41.96520220027853,0
    -87.75017380714417,41.96442838413288,0
    -87.74977684020996,41.964197035212855,0
    -87.74924039840698,41.96394175267103,0
    -87.7481460571289,41.96354287165174,0
    -87.74613976478577,41.962904656826744,0
    -87.7448844909668,41.962338235815146,0
    -87.74352192878723,41.96138887099651,0
    -87.74210572242737,41.960232062813574,0
    -87.74102210998535,41.9595778585448,0
    -87.73595809936523,41.956721619774996,0
    -87.72894144058228,41.95283597213028,0
    -87.72202134132385,41.94890221074284,0
    -87.72173166275024,41.94876655946857,0
    -87.72151708602905,41.9486628259464,0
    -87.72124886512756,41.948551112733774,0
    -87.7208411693573,41.94840748117273,0
    -87.72015452384949,41.94812021707978,0
    -87.7197253704071,41.94788880895241,0
    -87.71940350532532,41.9476254814409,0
    -87.71909236907959,41.947378112181646,0
    -87.71864175796509,41.946875391052195,0
    -87.7183735370636,41.94643650428536,0
    -87.71816968917847,41.94613327166335,0
    -87.71771907806396,41.94533528418746,0
    -87.71742939949036,41.94480860698191,0
    -87.71689295768738,41.94391484176801,0
    -87.71654963493347,41.94341209332932,0
    -87.71623849868774,41.94308490570803,0
    -87.7159595489502,41.94280559787368,0
    -87.7154552936554,41.94242254513981,0
    -87.71505832672119,41.942159195050415,0
    -87.71460771560669,41.94191180458167,0
    -87.71215081214905,41.939062754848564,0
    -87.708549,41.929631,0
    -87.70646452903748,41.92837568914348,0
    -87.70588517189026,41.927944657144785,0
    -87.70554184913635,41.92757747944137,0
    -87.70499467849731,41.92709056661877,0
    -87.70466208457947,41.92682715321491,0
    -87.70442605018616,41.92663557914714,0
    -87.70417928695679,41.92645996907967,0
    -87.70337462425232,41.92593313597692,0
    -87.69702315330505,41.92209350879694,0
    -87.68695950508118,41.9159304640514,0
    -87.67834424972534,41.91032572790956,0
    -87.67821550369263,41.910213947539546,0
    -87.67807602882385,41.910110151306405,0
    -87.67772197723389,41.909894573975215,0
    -87.66998648643494,41.90494407940173,0
    -87.666705,41.903343,0
    -87.655618,41.896217,0
    -87.647833,41.891186,0
    -87.631714,41.885890,0
    -87.629300,41.882377,0
    -87.629507,41.880464,0
    -87.629390,41.877769,0
    -87.632246,41.875818,0
    -87.641113,41.876444,0
    -87.647296,41.876324,0
    -87.65696704387665,41.87587214296158,0
    -87.66885459423065,41.87576829090648,0
    -87.67344653606415,41.875664438682605,0
    -87.68649280071259,41.87554460898384,0
    -87.69629895687103,41.875440756396515,0
    -87.69729673862457,41.875440756396515,0
    -87.69806921482086,41.875424779060396,0
    -87.6985090970993,41.875416790390844,0
    -87.69898116588593,41.87537684702812,0
    -87.69945323467255,41.87535288099851,0
    -87.69987165927887,41.8753049489123,0
    -87.70080506801605,41.87519310723801,0
    -87.7020388841629,41.875009366919706,0
    -87.70577251911163,41.8744900979469,0
    -87.70651280879974,41.874338310834915,0
    -87.70694196224213,41.87429836679819,0
    -87.70734965801239,41.87425043392114,0
    -87.70830452442169,41.874154568059204,0
    -87.72555649280548,41.8738909361975,0
    -87.73264825344086,41.873819036410126,0
    -87.73310959339142,41.873795069796365,0
    -87.73347437381744,41.87374713654187,0
    -87.73379623889923,41.87369920325143,0
    -87.7341502904892,41.87362730324836,0
    -87.7344936132431,41.873539425357045,0
    -87.7349442243576,41.87341959167411,0
    -87.73527681827545,41.873299757766524,0
    -87.73559868335724,41.87315595678084,0
    -87.73592054843903,41.87302014444176,0
    -87.73619949817657,41.872900309785294,0
    -87.73654282093048,41.87273254088877,0
    -87.73684322834015,41.87258873862697,0
    -87.73708999156952,41.872460914122684,0
    -87.73748695850372,41.87230912219183,0
    -87.73775517940521,41.872197275275255,0
    -87.73808777332306,41.87209341724893,0
    -87.73845255374908,41.871981569954926,0
    -87.73880660533905,41.871901678910824,0
    -87.73906409740448,41.871837766003644,0
    -87.73932158946991,41.87178983128131,0
    -87.73961126804352,41.87174189652303,0
    -87.7399331331253,41.871709939997544,0
    -87.74024426937103,41.87170195086369,0
    -87.74512588977814,41.87160608117939,0
    -87.75847256183624,41.871486243871814,0
    -87.75879442691803,41.87149423303264,0
    -87.7590411901474,41.87147825471,0
    -87.75923430919647,41.87144629805271,0
    -87.75942742824554,41.87141434137945,0
    -87.75967419147491,41.87133444962639,0
    -87.76000678539276,41.87125455777348,0
    -87.76033937931061,41.87112673060111,0
    -87.7606612443924,41.870990913950415,0
    -87.76128351688385,41.87068732274654,0
    -87.76164829730988,41.870519548041614,0
    -87.76197016239166,41.87038373010081,0
    -87.76229202747345,41.870279869127835,0
    -87.76258170604706,41.8701919866343,0
    -87.76283919811249,41.870136061348234,0
    -87.76309669017792,41.87009611468537,0
    -87.76338636875153,41.87006415733709,0
    -87.76379406452179,41.87004018931541,0
    -87.76416957378387,41.87006415733709,0
    -87.76468455791473,41.87010410401993,0
    -87.7651995420456,41.87012807201764,0
    -87.76691615581512,41.870279869127835,0
    -87.76747405529022,41.87031981567587,0
    -87.7679032087326,41.87035177289634,0
    -87.76870787143707,41.870415687289324,0
    -87.77046740055084,41.870511558758956,0
    -87.77282774448395,41.87065536569383,0
    -87.77452290058136,41.870767215308405,0
    -87.77611076831818,41.8708471077704,0
    -87.77790248394012,41.870966946276205,0
    -87.77926504611969,41.87107879534559,0
    -87.78161466121674,41.87127053615203,0
    -87.78339564800262,41.871422330549265,0
    -87.78476893901825,41.871526189665985,0
    -87.78622806072235,41.8716540160395,0
    -87.78818070888519,41.87181379864696,0
    -87.79055178165436,41.871997548151754,0
    -87.79254734516144,41.87218129712835,0
    -87.79381334781647,41.8722771659499,0
    -87.80135571956635,41.87299617752844,0
    -87.80474603176117,41.873339702427344,0
    -87.8079754114151,41.87365126992505,0
    -87.80918776988983,41.873771103173596,0
    -87.81001389026642,41.873843003014905,0
    -87.81053960323334,41.87386696961068,0
    -87.81159102916718,41.87388294733622,0
    -87.8122991323471,41.87383501414763,0
    -87.81289994716644,41.873771103173596,0
    -87.81329691410065,41.87369121436618,0
    -87.81351149082184,41.87366724770451,0
    -87.81365096569061,41.87365925881527,0
    -87.81384408473969,41.87366724770451,0
    -87.814080119133,41.873731158782384,0
    -87.81429469585419,41.873819036410126,0
    -87.81459510326385,41.87393886934416,0
    -87.8148204088211,41.8740507132132,0
    -87.81505644321442,41.874122612739946,0
    -87.8154319524765,41.87417853453816,0
    -87.81619369983673,41.874218478649816,0
    -87.8154319524765,41.87417853453816,0
    -87.81505644321442,41.874122612739946,0
    -87.8148204088211,41.8740507132132,0
    -87.81459510326385,41.87393886934416,0
    -87.81429469585419,41.873819036410126,0
    -87.814080119133,41.873731158782384,0
    -87.81384408473969,41.87366724770451,0
    -87.81365096569061,41.87365925881527,0
    -87.81351149082184,41.87366724770451,0
    -87.81329691410065,41.87369121436618,0
    -87.81289994716644,41.873771103173596,0
    -87.8122991323471,41.87383501414763,0
    -87.81159102916718,41.87388294733622,0
    -87.81053960323334,41.87386696961068,0
    -87.81001389026642,41.873843003014905,0
    -87.80918776988983,41.873771103173596,0
    -87.8079754114151,41.87365126992505,0
    -87.80474603176117,41.873339702427344,0
    -87.80135571956635,41.87299617752844,0
    -87.79381334781647,41.8722771659499,0
    -87.79254734516144,41.87218129712835,0
    -87.79055178165436,41.871997548151754,0
    -87.78818070888519,41.87181379864696,0
    -87.78622806072235,41.8716540160395,0
    -87.78476893901825,41.871526189665985,0
    -87.78339564800262,41.871422330549265,0
    -87.78161466121674,41.87127053615203,0
    -87.77926504611969,41.87107879534559,0
    -87.77790248394012,41.870966946276205,0
    -87.77611076831818,41.8708471077704,0
    -87.77452290058136,41.870767215308405,0
    -87.77282774448395,41.87065536569383,0
    -87.77046740055084,41.870511558758956,0
    -87.76870787143707,41.870415687289324,0
    -87.7679032087326,41.87035177289634,0
    -87.76747405529022,41.87031981567587,0
    -87.76691615581512,41.870279869127835,0
    -87.7651995420456,41.87012807201764,0
    -87.76468455791473,41.87010410401993,0
    -87.76416957378387,41.87006415733709,0
    -87.76379406452179,41.87004018931541,0
    -87.76338636875153,41.87006415733709,0
    -87.76309669017792,41.87009611468537,0
    -87.76283919811249,41.870136061348234,0
    -87.76258170604706,41.8701919866343,0
    -87.76229202747345,41.870279869127835,0
    -87.76197016239166,41.87038373010081,0
    -87.76164829730988,41.870519548041614,0
    -87.76128351688385,41.87068732274654,0
    -87.7606612443924,41.870990913950415,0
    -87.76033937931061,41.87112673060111,0
    -87.76000678539276,41.87125455777348,0
    -87.75967419147491,41.87133444962639,0
    -87.75942742824554,41.87141434137945,0
    -87.75923430919647,41.87144629805271,0
    -87.7590411901474,41.87147825471,0
    -87.75879442691803,41.87149423303264,0
    -87.75847256183624,41.871486243871814,0
    -87.74512588977814,41.87160608117939,0
    -87.74024426937103,41.87170195086369,0
    -87.7399331331253,41.871709939997544,0
    -87.73961126804352,41.87174189652303,0
    -87.73932158946991,41.87178983128131,0
    -87.73906409740448,41.871837766003644,0
    -87.73880660533905,41.871901678910824,0
    -87.73845255374908,41.871981569954926,0
    -87.73808777332306,41.87209341724893,0
    -87.73775517940521,41.872197275275255,0
    -87.73748695850372,41.87230912219183,0
    -87.73708999156952,41.872460914122684,0
    -87.73684322834015,41.87258873862697,0
    -87.73654282093048,41.87273254088877,0
    -87.73619949817657,41.872900309785294,0
    -87.73592054843903,41.87302014444176,0
    -87.73559868335724,41.87315595678084,0
    -87.73527681827545,41.873299757766524,0
    -87.7349442243576,41.87341959167411,0
    -87.7344936132431,41.873539425357045,0
    -87.7341502904892,41.87362730324836,0
    -87.73379623889923,41.87369920325143,0
    -87.73347437381744,41.87374713654187,0
    -87.73310959339142,41.873795069796365,0
    -87.73264825344086,41.873819036410126,0
    -87.72555649280548,41.8738909361975,0
    -87.70830452442169,41.874154568059204,0
    -87.70734965801239,41.87425043392114,0
    -87.70694196224213,41.87429836679819,0
    -87.70651280879974,41.874338310834915,0
    -87.70577251911163,41.8744900979469,0
    -87.7020388841629,41.875009366919706,0
    -87.70080506801605,41.87519310723801,0
    -87.69987165927887,41.8753049489123,0
    -87.69945323467255,41.87535288099851,0
    -87.69898116588593,41.87537684702812,0
    -87.6985090970993,41.875416790390844,0
    -87.69806921482086,41.875424779060396,0
    -87.69729673862457,41.875440756396515,0
    -87.69629895687103,41.875440756396515,0
    -87.68649280071259,41.87554460898384,0
    -87.67344653606415,41.875664438682605,0
    -87.66885459423065,41.87576829090648,0
    -87.65696704387665,41.87587214296158,0
    -87.66885459423065,41.87576829090648,0
    -87.66909062862396,41.87571237049921,0
    -87.66931593418121,41.875632484118256,0
    -87.66943395137787,41.87553662032928,0
    -87.6695305109024,41.87540081304875,0
    -87.66960561275482,41.875225062022075,0
    -87.66968071460724,41.87512120891551,0
    -87.669511,41.871432,0
    -87.66912281513214,41.85537806555371,0
    -87.6691335439682,41.85523422425483,0
    -87.66915500164032,41.855138329875835,0
    -87.6691871881485,41.855066408997246,0
    -87.6692408323288,41.85499448803779,0
    -87.66931593418121,41.85491457576575,0
    -87.66939103603363,41.85484265463553,0
    -87.66945540904999,41.85478671592279,0
    -87.66957342624664,41.8547387684158,0
    -87.66973435878754,41.8546828296122,0
    -87.66989529132843,41.85463488202732,0
    -87.6700347661972,41.85462689075967,0
    -87.6701956987381,41.85461090822141,0
    -87.67051756381989,41.85460291695075,0
    -87.67803847789764,41.854491039056995,0
    -87.68537700176239,41.85440313486035,0
    -87.69493639469147,41.85429125661714,0
    -87.70554721355438,41.854131430215915,0
    -87.70873367786407,41.85406749954361,0
    -87.71495640277863,41.85398758611336,0
    -87.724684,41.853946,0
    -87.7322405576706,41.85377981072743,0
    -87.73435413837433,41.85374784522355,0
    -87.73464381694794,41.85374784522355,0
    -87.73485839366913,41.85373985384506,0
    -87.73501932621002,41.8537078883212,0
    -87.73518025875092,41.853683914167824,0
    -87.73528754711151,41.853635965834094,0
    -87.73548066616058,41.85358801746443,0
    -87.73559868335724,41.85351609484254,0
    -87.73573815822601,41.85344417213976,0
    -87.73587763309479,41.85334827507694,0
    -87.7360600233078,41.853180454871016,0
    -87.73666083812714,41.85254912729531,0
    -87.73677885532379,41.852461220429795,0
    -87.73689687252045,41.85236532189326,0
    -87.73705780506134,41.852285406336286,0
    -87.73721873760223,41.852197499108314,0
    -87.73737967014313,41.85214155808217,0
    -87.73756206035614,41.8521016001764,0
    -87.73778736591339,41.85206164224564,0
    -87.73803412914276,41.85206164224564,0
    -87.74552285671234,41.85189381866398,0
    -87.7565735578537,41.85182988575514,0
            </coordinates>
          </LineString>
        </Placemark>
    
        <Placemark>
          <name>Red Line</name>
          <styleUrl>#redLine</styleUrl>
          <LineString>
            <altitudeMode>relative</altitudeMode>
            <coordinates>
    -87.67283499240875,42.019110918045044,0
    -87.66907453536987,42.01585473134908,0
    -87.66744375228882,42.014483688722116,0
    -87.66716480255127,42.014228607763144,0
    -87.66695022583008,42.01400541108485,0
    -87.66682147979736,42.01379815632509,0
    -87.66662836074829,42.01357495813621,0
    -87.66645669937134,42.0133198735327,0
    -87.66634941101074,42.013080730787806,0
    -87.66611337661743,42.01263432859157,0
    -87.6660704612732,42.012283581810934,0
    -87.66602754592896,42.01188500357604,0
    -87.66602754592896,42.008010693009815,0
    -87.66592025756836,42.006639481296574,0
    -87.66589879989624,42.006288701459745,0
    -87.665855884552,42.0060176429884,0
    -87.6657485961914,42.00565091498307,0
    -87.66561985015869,42.00539579860219,0
    -87.6655125617981,42.00510879145083,0
    -87.66538381576538,42.004837727952406,0
    -87.66525506973267,42.004534773263956,0
    -87.66508340835571,42.00427965240744,0
    -87.66486883163452,42.00396074989817,0
    -87.66465425491333,42.00367373627319,0
    -87.66433238983154,42.00335483072693,0
    -87.66407489776611,42.00313159589348,0
    -87.6638388633728,42.002908360276805,0
    -87.66319513320923,42.00250972329895,0
    -87.66167163848877,42.001600821650676,0
    -87.66128540039062,42.00132974320697,0
    -87.660742,42.000799,0
    -87.66023397445679,42.00030920223769,0
    -87.65993356704712,41.99989460279358,0
    -87.65965461730957,41.99941621546295,0
    -87.65948295593262,41.99888998524543,0
    -87.65933275222778,41.99828401778616,0
    -87.65920400619507,41.994440774030785,0
    -87.65905380249023,41.99002314909262,0
    -87.65888214111328,41.9835157640879,0
    -87.65871047973633,41.97809243514769,0
    -87.6585602760315,41.97337057266951,0
    -87.65847444534302,41.968935531682405,0
    -87.65849590301514,41.96762729515043,0
    -87.65849590301514,41.96724439157094,0
    -87.65843152999878,41.966957212376,0
    -87.6582384109497,41.96625521333851,0
    -87.6580023765564,41.9658084826508,0
    -87.65753030776978,41.96371837960788,0
    -87.65748739242554,41.96335140787548,0
    -87.65738010406494,41.962968478596906,0
    -87.65729427337646,41.96266532461923,0
    -87.65716552734375,41.96226643560901,0
    -87.65707969665527,41.961963278291115,0
    -87.65703678131104,41.96138887099651,0
    -87.65675783157349,41.954447706886356,0
    -87.65662908554077,41.95420834291541,0
    -87.65641450881958,41.95401685109141,0
    -87.65615701675415,41.95392110496364,0
    -87.65583515167236,41.953873231845826,0
    -87.65459060668945,41.9539051472617,0
    -87.6540756225586,41.95384131641401,0
    -87.65383958816528,41.95369769677289,0
    -87.65368938446045,41.95347428779906,0
    -87.65366792678833,41.953330667330924,0
    -87.65362501144409,41.9527880981974,0
    -87.65364646911621,41.952421063517576,0
    -87.65366792678833,41.95202211038145,0
    -87.65368938446045,41.95173486257724,0
    -87.65368938446045,41.94725043734973,0
    -87.653413,41.940032,0
    -87.653300,41.936332,0
    -87.65315294265747,41.933507938953845,0
    -87.65286326408386,41.9253983161046,0
    -87.649290,41.910943,0
    -87.631570,41.904012,0
    -87.628338,41.896791,0
    -87.627934,41.891442,0
    -87.628023,41.883939,0
    -87.627911,41.881672,0
    -87.627829,41.879053,0
    -87.627721,41.874177,0
    -87.62665271759033,41.86731934547424,0
    -87.630681,41.853070,0
    -87.629683,41.831096,0
    -87.632806,41.809233,0
    -87.632108,41.794665,0
    -87.630964,41.780080,0
    -87.625528,41.769041,0
    -87.626058,41.750851,0
    -87.625870,41.736142,0
    -87.625259,41.721877,0
            </coordinates>
          </LineString>
        </Placemark>
    
        <Placemark>
          <name>Green Line</name>
          <styleUrl>#greenLine</styleUrl>
          <LineString>
            <altitudeMode>relative</altitudeMode>
            <coordinates>
    -87.8049498796463,41.8868887424469,0
    -87.79437124729156,41.88703894615173,0
    -87.78372824192047,41.88716769218445,0
    -87.77429759502411,41.88731789588928,0
    -87.76573598384857,41.88741445541382,0
    -87.75802195072174,41.887521743774414,0
    -87.75767862796783,41.887532472610474,0
    -87.75741040706635,41.887500286102295,0
    -87.7571851015091,41.887478828430176,0
    -87.75661647319794,41.88741445541382,0
    -87.75600492954254,41.88729643821716,0
    -87.75571525096893,41.887232065200806,0
    -87.75543630123138,41.88719987869263,0
    -87.75520026683807,41.88717842102051,0
    -87.75498569011688,41.88715696334839,0
    -87.75451362133026,41.88712477684021,0
    -87.7461451292038,41.88667416572571,0
    -87.74589836597443,41.88666343688965,0
    -87.74570524692535,41.88665270805359,0
    -87.74551212787628,41.88662052154541,0
    -87.74530827999115,41.88656687736511,0
    -87.7445787191391,41.886523962020874,0
    -87.725657,41.885483,0
    -87.71686613559723,41.884968280792236,0
    -87.706155,41.884332,0
    -87.70189940929413,41.88412070274353,0
    -87.70147025585175,41.88408851623535,0
    -87.70112693309784,41.88409924507141,0
    -87.70066559314728,41.88414216041565,0
    -87.696354,41.884232,0
    -87.666934,41.885396,0
    -87.64175355434418,41.88570857048035,0
    -87.63107299804688,41.885762214660645,0
    -87.628083,41.885843,0
    -87.6265561580658,41.885772943496704,0
    -87.62641668319702,41.885730028152466,0
    -87.62629866600037,41.88565492630005,0
    -87.62625575065613,41.885504722595215,0
    -87.626343,41.884609,0
    -87.626292,41.882163,0
    -87.626157,41.879559,0
    -87.62608408927917,41.8768572807312,0
    -87.62604117393494,41.87461495399475,0
    -87.62613773345947,41.874486207962036,0
    -87.62627720832825,41.87443256378174,0
    -87.62649178504944,41.87443256378174,0
    -87.62665271759033,41.8743896484375,0
    -87.62676000595093,41.874271631240845,0
    -87.6268458366394,41.87411069869995,0
    -87.62665271759033,41.86731934547424,0
    -87.625850,41.831033,0
    -87.62565493583679,41.82229042053223,0
    -87.6256012916565,41.822108030319214,0
    -87.62548327445984,41.82196855545044,0
    -87.62529015541077,41.821861267089844,0
    -87.62503266334534,41.821796894073486,0
    -87.62476444244385,41.82178616523743,0
    -87.621551156044,41.821850538253784,0
    -87.6198399066925,41.821850538253784,0
    -87.61965751647949,41.821829080581665,0
    -87.61948585510254,41.82174324989319,0
    -87.61931419372559,41.821603775024414,0
    -87.61922836303711,41.82144284248352,0
    -87.61921763420105,41.82119607925415,0
    -87.61906743049622,41.81662559509277,0
    -87.61889576911926,41.809319257736206,0
    -87.61878848075867,41.80673360824585,0
    -87.61874556541443,41.80654048919678,0
    -87.61868119239807,41.80626153945923,0
    -87.61865973472595,41.80602550506592,0
    -87.61857390403748,41.80204510688782,0
    -87.61838,41.794272,0
    -87.61819839477539,41.789363622665405,0
    -87.61801600456238,41.7805016040802,0
    -87.6179838180542,41.780362129211426,0
    -87.61791944503784,41.78027629852295,0
    -87.61780142784119,41.78022265434265,0
    -87.61762976646423,41.78019046783447,0
    -87.61593461036682,41.78025484085083,0
    -87.606048,41.780334,0
    -87.61593461036682,41.78025484085083,0
    -87.61762976646423,41.78019046783447,0
    -87.61780142784119,41.78022265434265,0
    -87.61791944503784,41.78027629852295,0
    -87.6179838180542,41.780362129211426,0
    -87.61801600456238,41.7805016040802,0
    -87.61819839477539,41.789363622665405,0
    -87.61838,41.794272,0
    -87.61819839477539,41.789363622665405,0
    -87.61818766593933,41.787400245666504,0
    -87.61824131011963,41.78729295730591,0
    -87.61829495429993,41.78718566894531,0
    -87.61840224266052,41.787099838256836,0
    -87.61852025985718,41.78702473640442,0
    -87.61868119239807,41.7870032787323,0
    -87.6188313961029,41.78699254989624,0
    -87.63068675994873,41.78682088851929,0
    -87.63105154037476,41.78682088851929,0
    -87.63129830360413,41.78679943084717,0
    -87.63153433799744,41.78675651550293,0
    -87.63169527053833,41.78667068481445,0
    -87.63181328773499,41.78656339645386,0
    -87.63190984725952,41.78647756576538,0
    -87.63200640678406,41.786370277404785,0
    -87.63207077980042,41.78619861602783,0
    -87.63208150863647,41.785898208618164,0
    -87.63207077980042,41.78076982498169,0
    -87.63207077980042,41.780608892440796,0
    -87.63207077980042,41.78049087524414,0
    -87.63211369514465,41.780383586883545,0
    -87.63215661048889,41.78029775619507,0
    -87.63222098350525,41.78021192550659,0
    -87.63312220573425,41.77951455116272,0
    -87.63318657875061,41.77945017814636,0
    -87.6333475112915,41.779385805130005,0
    -87.6335620880127,41.77932143211365,0
    -87.63384103775024,41.77931070327759,0
    -87.63548254966736,41.77921414375305,0
    -87.6449453830719,41.77903175354004,0
    -87.64538526535034,41.77905321121216,0
    -87.64556765556335,41.77908539772034,0
    -87.64607191085815,41.77918195724487,0
    -87.64630794525146,41.77923560142517,0
    -87.664416,41.778970,0
            </coordinates>
          </LineString>
        </Placemark>
    
        <Placemark>
          <name>Orange Line</name>
          <styleUrl>#orangeLine</styleUrl>
          <LineString>
            <altitudeMode>relative</altitudeMode>
            <coordinates>
    -87.73805022239685,41.78673505783081,0
    -87.73810386657715,41.79256081581116,0
    -87.73795366287231,41.79323673248291,0
    -87.73774981498718,41.79365515708923,0
    -87.73746013641357,41.7940628528595,0
    -87.73711681365967,41.79441690444946,0
    -87.73592591285706,41.79522156715393,0
    -87.72440314292908,41.79991006851196,0
    -87.71584153175354,41.80354714393616,0
    -87.71512269973755,41.80378317832947,0
    -87.7142322063446,41.80400848388672,0
    -87.71345973014832,41.804137229919434,0
    -87.71249413490295,41.80421233177185,0
    -87.703918,41.804233,0
    -87.684452,41.804533,0
    -87.68218517303467,41.80470585823059,0
    -87.68126249313354,41.80489897727966,0
    -87.68075823783875,41.805124282836914,0
    -87.68032908439636,41.80540323257446,0
    -87.67998576164246,41.80574655532837,0
    -87.67970681190491,41.80618643760681,0
    -87.67955660820007,41.80673360824585,0
    -87.6797604560852,41.81438326835632,0
    -87.67987847328186,41.81519865989685,0
    -87.68017888069153,41.816067695617676,0
    -87.68045783042908,41.81667923927307,0
    -87.68095135688782,41.81747317314148,0
    -87.68615484237671,41.8250048160553,0
    -87.68621921539307,41.82548761367798,0
    -87.68613338470459,41.82588458061218,0
    -87.68599390983582,41.82617425918579,0
    -87.68577933311462,41.82644248008728,0
    -87.68554329872131,41.82665705680847,0
    -87.68079042434692,41.82941436767578,0
    -87.6763379573822,41.83217167854309,0
    -87.66662836074829,41.83868408203125,0
    -87.66604900360107,41.83897376060486,0
    -87.66526579856873,41.83934926986694,0
    -87.64813184738159,41.84693455696106,0
    -87.64634013175964,41.847814321517944,0
    -87.64573931694031,41.848028898239136,0
    -87.64521360397339,41.84818983078003,0
    -87.6445484161377,41.848329305648804,0
    -87.64394760131836,41.8484902381897,0
    -87.64341115951538,41.84865117073059,0
    -87.64267086982727,41.8488872051239,0
    -87.64081478118896,41.849831342697144,0
    -87.64049291610718,41.850056648254395,0
    -87.6400637626648,41.8503999710083,0
    -87.63972043991089,41.850786209106445,0
    -87.63639450073242,41.854573488235474,0
    -87.63612627983093,41.85485243797302,0
    -87.63584733009338,41.85510993003845,0
    -87.63405561447144,41.856558322906494,0
    -87.63370156288147,41.856805086135864,0
    -87.63314366340637,41.85708403587341,0
    -87.63258576393127,41.85733079910278,0
    -87.63168454170227,41.857566833496094,0
    -87.63099789619446,41.85766339302063,0
    -87.62800455093384,41.85770630836487,0
    -87.62739300727844,41.857802867889404,0
    -87.62702822685242,41.85794234275818,0
    -87.62668490409851,41.858285665512085,0
    -87.6265561580658,41.858789920806885,0
    -87.62654542922974,41.859251260757446,0
    -87.62659907341003,41.86260938644409,0
    -87.62665271759033,41.86731934547424,0
    -87.6268458366394,41.87411069869995,0
    -87.62676000595093,41.874271631240845,0
    -87.62665271759033,41.8743896484375,0
    -87.62649178504944,41.87443256378174,0
    -87.62627720832825,41.87443256378174,0
    -87.62613773345947,41.874486207962036,0
    -87.62604117393494,41.87461495399475,0
    -87.62608408927917,41.8768572807312,0
    -87.62624502182007,41.876986026763916,0
    -87.628514,41.877028,0
    -87.631477,41.876985,0
    -87.63328313827515,41.87687873840332,0
    -87.63347625732422,41.87690019607544,0
    -87.63359427452087,41.87693238258362,0
    -87.63366937637329,41.876996755599976,0
    -87.63370156288147,41.87709331512451,0
    -87.633885,41.879289,0
    -87.633890,41.883259,0
    -87.63389468193054,41.88546180725098,0
    -87.63389468193054,41.88565492630005,0
    -87.63387322425842,41.885730028152466,0
    -87.63383030891418,41.885751485824585,0
    -87.63373374938965,41.88579440116882,0
    -87.63107299804688,41.885762214660645,0
    -87.628083,41.885843,0
    -87.6265561580658,41.885772943496704,0
    -87.62641668319702,41.885730028152466,0
    -87.62629866600037,41.88565492630005,0
    -87.62625575065613,41.885504722595215,0
    -87.626343,41.884609,0
    -87.626292,41.882163,0
    -87.626157,41.879559,0
    -87.62608408927917,41.8768572807312,0
    -87.62604117393494,41.87461495399475,0
    -87.62613773345947,41.874486207962036,0
    -87.62627720832825,41.87443256378174,0
    -87.62649178504944,41.87443256378174,0
    -87.62665271759033,41.8743896484375,0
    -87.62676000595093,41.874271631240845,0
    -87.6268458366394,41.87411069869995,0
    -87.62665271759033,41.86731934547424,0
            </coordinates>
          </LineString>
        </Placemark>
    
        <Placemark>
          <name>Pink Line</name>
          <styleUrl>#pinkLine</styleUrl>
          <LineString>
            <altitudeMode>relative</altitudeMode>
            <coordinates>
    -87.6339054107666,41.88586950302124,0
    -87.633890,41.883259,0
    -87.633885,41.879289,0
    -87.63370156288147,41.87709331512451,0
    -87.63366937637329,41.876996755599976,0
    -87.63359427452087,41.87693238258362,0
    -87.63347625732422,41.87690019607544,0
    -87.63328313827515,41.87687873840332,0
    -87.631477,41.876985,0
    -87.628514,41.877028,0
    -87.62633085250854,41.876975297927856,0
    -87.62622356414795,41.877018213272095,0
    -87.62613773345947,41.87708258628845,0
    -87.62609481811523,41.87712550163269,0
    -87.62607336044312,41.87721133232117,0
    -87.626157,41.879559,0
    -87.626292,41.882163,0
    -87.626343,41.884609,0
    -87.62625575065613,41.885504722595215,0
    -87.62629866600037,41.88565492630005,0
    -87.62641668319702,41.885730028152466,0
    -87.6265561580658,41.885772943496704,0
    -87.628083,41.885843,0
    -87.63107299804688,41.885762214660645,0
    -87.64175355434418,41.88570857048035,0
    -87.666934,41.885396,0
    -87.66962170600891,41.885266061520554,0
    -87.66990065574646,41.88515423727906,0
    -87.67002940177917,41.88502643790626,0
    -87.67011523246765,41.8848507133513,0
    -87.67013669013977,41.883380998148304,0
    -87.67020106315613,41.88269405444917,0
    -87.67002940177917,41.87841247144975,0
    -87.66985774040222,41.87807696215396,0
    -87.66979336738586,41.87788524176554,0
    -87.66966462135315,41.87633548084379,0
    -87.66975045204163,41.87599996064392,0
    -87.66968071460724,41.87512120891551,0
    -87.669511,41.871432,0
    -87.66912281513214,41.85537806555371,0
    -87.6691335439682,41.85523422425483,0
    -87.66915500164032,41.855138329875835,0
    -87.6691871881485,41.855066408997246,0
    -87.6692408323288,41.85499448803779,0
    -87.66931593418121,41.85491457576575,0
    -87.66939103603363,41.85484265463553,0
    -87.66945540904999,41.85478671592279,0
    -87.66957342624664,41.8547387684158,0
    -87.66973435878754,41.8546828296122,0
    -87.66989529132843,41.85463488202732,0
    -87.6700347661972,41.85462689075967,0
    -87.6701956987381,41.85461090822141,0
    -87.67051756381989,41.85460291695075,0
    -87.67803847789764,41.854491039056995,0
    -87.68537700176239,41.85440313486035,0
    -87.69493639469147,41.85429125661714,0
    -87.70554721355438,41.854131430215915,0
    -87.70873367786407,41.85406749954361,0
    -87.71495640277863,41.85398758611336,0
    -87.724684,41.853946,0
    -87.7322405576706,41.85377981072743,0
    -87.73435413837433,41.85374784522355,0
    -87.73464381694794,41.85374784522355,0
    -87.73485839366913,41.85373985384506,0
    -87.73501932621002,41.8537078883212,0
    -87.73518025875092,41.853683914167824,0
    -87.73528754711151,41.853635965834094,0
    -87.73548066616058,41.85358801746443,0
    -87.73559868335724,41.85351609484254,0
    -87.73573815822601,41.85344417213976,0
    -87.73587763309479,41.85334827507694,0
    -87.7360600233078,41.853180454871016,0
    -87.73666083812714,41.85254912729531,0
    -87.73677885532379,41.852461220429795,0
    -87.73689687252045,41.85236532189326,0
    -87.73705780506134,41.852285406336286,0
    -87.73721873760223,41.852197499108314,0
    -87.73737967014313,41.85214155808217,0
    -87.73756206035614,41.8521016001764,0
    -87.73778736591339,41.85206164224564,0
    -87.73803412914276,41.85206164224564,0
    -87.74552285671234,41.85189381866398,0
    -87.7565735578537,41.85182988575514,0
            </coordinates>
          </LineString>
        </Placemark>
    
        <Placemark>
          <name>Brown Line</name>
          <styleUrl>#brownLine</styleUrl>
          <LineString>
            <altitudeMode>relative</altitudeMode>
            <coordinates>
    -87.71307349205017,41.96800221934201,0
    -87.71303057670593,41.96639082739174,0
    -87.71301984786987,41.96627914525123,0
    -87.7129876613617,41.966175440231154,0
    -87.7129340171814,41.966087689697694,0
    -87.71283745765686,41.9660079163806,0
    -87.71275162696838,41.96597600702577,0
    -87.71260142326355,41.965928142963584,0
    -87.7123761177063,41.96594409765499,0
    -87.71220445632935,41.965952074999166,0
    -87.71196842193604,41.965960052342375,0
    -87.7109169960022,41.96605578038284,0
    -87.7084493637085,41.966103644349126,0
    -87.70111083984375,41.96616746291492,0
    -87.69872903823853,41.966159485597686,0
    -87.69761323928833,41.96620734948606,0
    -87.69376158714294,41.96619139486061,0
    -87.688956,41.966331,0
    -87.679156,41.966349,0
    -87.67764687538147,41.96639082739174,0
    -87.67690658569336,41.96637487281224,0
    -87.67671346664429,41.96633498634595,0
    -87.67648816108704,41.96627914525123,0
    -87.67632722854614,41.966247236032274,0
    -87.67617702484131,41.96616746291492,0
    -87.67600536346436,41.96605578038284,0
    -87.67582297325134,41.965952074999166,0
    -87.67567276954651,41.96581646001197,0
    -87.67556548118591,41.96572073161191,0
    -87.67545819282532,41.96560107090954,0
    -87.67537236213684,41.96545747777006,0
    -87.67531871795654,41.965361748830624,0
    -87.67526507377625,41.96521815515174,0
    -87.67520070075989,41.9650745611492,0
    -87.67518997192383,41.96493096682304,0
    -87.67516851425171,41.9615324733056,0
    -87.674989,41.954332,0
    -87.67469644546509,41.946939228875685,0
    -87.6747179031372,41.94597367496723,0
    -87.6747179031372,41.94559064126644,0
    -87.67465353012085,41.94515972560236,0
    -87.67458915710449,41.94485648690766,0
    -87.6744818687439,41.94452132667238,0
    -87.67428874969482,41.944265965310514,0
    -87.67398834228516,41.94407444361796,0
    -87.67368793487549,41.94389888156104,0
    -87.67334461212158,41.94380312023533,0
    -87.67304420471191,41.94373927927162,0
    -87.67261505126953,41.94370735876579,0
    -87.6720142364502,41.94370735876579,0
    -87.67128467559814,41.94370735876579,0
    -87.66392469406128,41.94379514011835,0
    -87.65528798103333,41.94394676216995,0
    -87.65506267547607,41.94391484176801,0
    -87.65489101409912,41.94389888156104,0
    -87.65473008155823,41.94385100091615,0
    -87.65453696250916,41.94379514011835,0
    -87.65437602996826,41.943723319020705,0
    -87.6542580127716,41.94363553756927,0
    -87.65413999557495,41.943547755996946,0
    -87.65406489372253,41.94345997430379,0
    -87.65397906303406,41.943364212318876,0
    -87.65387177467346,41.9432365294486,0
    -87.65378594398499,41.94313278692821,0
    -87.65374302864075,41.94303702445191,0
    -87.65367865562439,41.94294126183175,0
    -87.65361428260803,41.94280559787368,0
    -87.65358209609985,41.94270983490595,0
    -87.65350699424744,41.942534269091574,0
    -87.65347480773926,41.94239860426753,0
    -87.653413,41.940032,0
    -87.653300,41.936332,0
    -87.65315294265747,41.933507938953845,0
    -87.65286326408386,41.9253983161046,0
    -87.65264868736267,41.91815257072449,0
    -87.65248775482178,41.914000511169434,0
    -87.6524555683136,41.91386103630066,0
    -87.6524019241333,41.91376447677612,0
    -87.6522946357727,41.91361427307129,0
    -87.65213370323181,41.913474798202515,0
    -87.65186548233032,41.91328167915344,0
    -87.6497733592987,41.9117796421051,0
    -87.64961242675781,41.911693811416626,0
    -87.6494300365448,41.91161870956421,0
    -87.64924764633179,41.91157579421997,0
    -87.64900088310242,41.91153287887573,0
    -87.6479172706604,41.91154360771179,0
    -87.6477563381195,41.91152215003967,0
    -87.64764904975891,41.911468505859375,0
    -87.64754176139832,41.91137194633484,0
    -87.64745593070984,41.911253929138184,0
    -87.64742374420166,41.91108226776123,0
    -87.64740228652954,41.91076040267944,0
    -87.6473593711853,41.91065311431885,0
    -87.64727354049683,41.91053509712219,0
    -87.64711260795593,41.910438537597656,0
    -87.64687657356262,41.91038489341736,0
    -87.64655470848083,41.91038489341736,0
    -87.638653,41.910432,0
    -87.63813257217407,41.91041707992554,0
    -87.63784289360046,41.91036343574524,0
    -87.63764977455139,41.910256147384644,0
    -87.63745665550232,41.91007375717163,0
    -87.63736009597778,41.9098162651062,0
    -87.63705968856812,41.90329313278198,0
    -87.63699531555176,41.90311074256897,0
    -87.63689875602722,41.902949810028076,0
    -87.63664126396179,41.90261721611023,0
    -87.63655543327332,41.902467012405396,0
    -87.63651251792908,41.90227389335632,0
    -87.63654470443726,41.90207004547119,0
    -87.63673782348633,41.90142631530762,0
    -87.63675928115845,41.9013512134552,0
    -87.63674855232239,41.90117955207825,0
    -87.63660907745361,41.897467374801636,0
    -87.63659834861755,41.89738154411316,0
    -87.63656616210938,41.89727425575256,0
    -87.6364803314209,41.89717769622803,0
    -87.6359760761261,41.896748542785645,0
    -87.63585805892944,41.89666271209717,0
    -87.63578295707703,41.89655542373657,0
    -87.63574004173279,41.89640522003174,0
    -87.63574004173279,41.89628720283508,0
    -87.63556838035583,41.89040780067444,0
    -87.63548254966736,41.890246868133545,0
    -87.63537526130676,41.89015030860901,0
    -87.63523578643799,41.89006447792053,0
    -87.63503193855286,41.890000104904175,0
    -87.63447403907776,41.8898606300354,0
    -87.63432383537292,41.8898069858551,0
    -87.63422727584839,41.889731884002686,0
    -87.63413071632385,41.88961386680603,0
    -87.63410925865173,41.88944220542908,0
    -87.634110,41.888634,0
    -87.6339054107666,41.88586950302124,0
    -87.633890,41.883259,0
    -87.633885,41.879289,0
    -87.63370156288147,41.87709331512451,0
    -87.63366937637329,41.876996755599976,0
    -87.63359427452087,41.87693238258362,0
    -87.63347625732422,41.87690019607544,0
    -87.63328313827515,41.87687873840332,0
    -87.631477,41.876985,0
    -87.628514,41.877028,0
    -87.62633085250854,41.876975297927856,0
    -87.62622356414795,41.877018213272095,0
    -87.62613773345947,41.87708258628845,0
    -87.62609481811523,41.87712550163269,0
    -87.62607336044312,41.87721133232117,0
    -87.626157,41.879559,0
    -87.626292,41.882163,0
    -87.626343,41.884609,0
    -87.62625575065613,41.885504722595215,0
    -87.62629866600037,41.88565492630005,0
    -87.62641668319702,41.885730028152466,0
    -87.6265561580658,41.885772943496704,0
    -87.628083,41.885843,0
    -87.63107299804688,41.885762214660645,0
    -87.6339054107666,41.88586950302124,0
    -87.634110,41.888634,0
            </coordinates>
          </LineString>
        </Placemark>
    
        <Placemark>
          <name>Purple Line</name>
          <styleUrl>#purpleLine</styleUrl>
          <LineString>
            <altitudeMode>relative</altitudeMode>
            <coordinates>
    -87.69055902957916,42.072787284851074,0
    -87.68584907054901,42.06420421600342,0
    -87.68419682979584,42.06132888793945,0
    -87.68400371074677,42.06098556518555,0
    -87.68387496471405,42.060706615448,0
    -87.68377840518951,42.06039547920227,0
    -87.6837033033371,42.06010580062866,0
    -87.68360674381256,42.059783935546875,0
    -87.68356382846832,42.05949425697327,0
    -87.68349945545197,42.05911874771118,0
    -87.6834887266159,42.05848574638367,0
    -87.68349945545197,42.05718755722046,0
    -87.68353164196014,42.05689787864685,0
    -87.68356382846832,42.0566189289093,0
    -87.68366038799286,42.05593228340149,0
    -87.6836496591568,42.05574989318848,0
    -87.68369257450104,42.05390453338623,0
    -87.68368184566498,42.05287456512451,0
    -87.68363893032074,42.05249905586243,0
    -87.68361747264862,42.05219864845276,0
    -87.68372476100922,42.04787492752075,0
    -87.68372476100922,42.04720973968506,0
    -87.6837033033371,42.047048807144165,0
    -87.68363893032074,42.04686641693115,0
    -87.6835423707962,42.04667329788208,0
    -87.68278062343597,42.045053243637085,0
    -87.68265187740326,42.04474210739136,0
    -87.68254458904266,42.04443097114563,0
    -87.68216907978058,42.043272256851196,0
    -87.68177211284637,42.04164147377014,0
    -87.68008768558502,42.03427076339722,0
    -87.6800125837326,42.03410983085632,0
    -87.67994821071625,42.03399181365967,0
    -87.67987310886383,42.033841609954834,0
    -87.67983019351959,42.03375577926636,0
    -87.67976582050323,42.03362703323364,0
    -87.67971217632294,42.03340172767639,0
    -87.67959415912628,42.03288674354553,0
    -87.67874658107758,42.0291531085968,0
    -87.67861783504486,42.02841281890869,0
    -87.67854273319244,42.02796220779419,0
    -87.67843544483185,42.02741503715515,0
    -87.67743766307831,42.02279090881348,0
    -87.67739474773407,42.02261924743652,0
    -87.67734110355377,42.02247977256775,0
    -87.67724454402924,42.022318840026855,0
    -87.67712652683258,42.02219009399414,0
    -87.67697632312775,42.022061347961426,0
    -87.6768046617508,42.02193260192871,0
    -87.67626821994781,42.02163219451904,0
    -87.67598927021027,42.02146053314209,0
    -87.6756888628006,42.02126741409302,0
    -87.67536699771881,42.02098846435547,0
    -87.67454087734222,42.020301818847656,0
    -87.67430484294891,42.02019453048706,0
    -87.6740688085556,42.020065784454346,0
    -87.67390787601471,42.01996922492981,0
    -87.67374694347382,42.019840478897095,0
    -87.67283499240875,42.019110918045044,0
    -87.66907453536987,42.01585473134908,0
    -87.66744375228882,42.014483688722116,0
    -87.66716480255127,42.014228607763144,0
    -87.66695022583008,42.01400541108485,0
    -87.66682147979736,42.01379815632509,0
    -87.66662836074829,42.01357495813621,0
    -87.66645669937134,42.0133198735327,0
    -87.66634941101074,42.013080730787806,0
    -87.66611337661743,42.01263432859157,0
    -87.6660704612732,42.012283581810934,0
    -87.66602754592896,42.01188500357604,0
    -87.66602754592896,42.008010693009815,0
    -87.66592025756836,42.006639481296574,0
    -87.66589879989624,42.006288701459745,0
    -87.665855884552,42.0060176429884,0
    -87.6657485961914,42.00565091498307,0
    -87.66561985015869,42.00539579860219,0
    -87.6655125617981,42.00510879145083,0
    -87.66538381576538,42.004837727952406,0
    -87.66525506973267,42.004534773263956,0
    -87.66508340835571,42.00427965240744,0
    -87.66486883163452,42.00396074989817,0
    -87.66465425491333,42.00367373627319,0
    -87.66433238983154,42.00335483072693,0
    -87.66407489776611,42.00313159589348,0
    -87.6638388633728,42.002908360276805,0
    -87.66319513320923,42.00250972329895,0
    -87.66167163848877,42.001600821650676,0
    -87.66128540039062,42.00132974320697,0
    -87.660742,42.000799,0
    -87.66023397445679,42.00030920223769,0
    -87.65993356704712,41.99989460279358,0
    -87.65965461730957,41.99941621546295,0
    -87.65948295593262,41.99888998524543,0
    -87.65933275222778,41.99828401778616,0
    -87.65920400619507,41.994440774030785,0
    -87.65905380249023,41.99002314909262,0
    -87.65888214111328,41.9835157640879,0
    -87.65871047973633,41.97809243514769,0
    -87.6585602760315,41.97337057266951,0
    -87.65847444534302,41.968935531682405,0
    -87.65849590301514,41.96762729515043,0
    -87.65849590301514,41.96724439157094,0
    -87.65843152999878,41.966957212376,0
    -87.6582384109497,41.96625521333851,0
    -87.6580023765564,41.9658084826508,0
    -87.65753030776978,41.96371837960788,0
    -87.65748739242554,41.96335140787548,0
    -87.65738010406494,41.962968478596906,0
    -87.65729427337646,41.96266532461923,0
    -87.65716552734375,41.96226643560901,0
    -87.65707969665527,41.961963278291115,0
    -87.65703678131104,41.96138887099651,0
    -87.65675783157349,41.954447706886356,0
    -87.65662908554077,41.95420834291541,0
    -87.65641450881958,41.95401685109141,0
    -87.65615701675415,41.95392110496364,0
    -87.65583515167236,41.953873231845826,0
    -87.65459060668945,41.9539051472617,0
    -87.6540756225586,41.95384131641401,0
    -87.65383958816528,41.95369769677289,0
    -87.65368938446045,41.95347428779906,0
    -87.65366792678833,41.953330667330924,0
    -87.65362501144409,41.9527880981974,0
    -87.65364646911621,41.952421063517576,0
    -87.65366792678833,41.95202211038145,0
    -87.65368938446045,41.95173486257724,0
    -87.65368938446045,41.94725043734973,0
    -87.653413,41.940032,0
    -87.653300,41.936332,0
    -87.65315294265747,41.933507938953845,0
    -87.65286326408386,41.9253983161046,0
    -87.65264868736267,41.91815257072449,0
    -87.65248775482178,41.914000511169434,0
    -87.6524555683136,41.91386103630066,0
    -87.6524019241333,41.91376447677612,0
    -87.6522946357727,41.91361427307129,0
    -87.65213370323181,41.913474798202515,0
    -87.65186548233032,41.91328167915344,0
    -87.6497733592987,41.9117796421051,0
    -87.64961242675781,41.911693811416626,0
    -87.6494300365448,41.91161870956421,0
    -87.64924764633179,41.91157579421997,0
    -87.64900088310242,41.91153287887573,0
    -87.6479172706604,41.91154360771179,0
    -87.6477563381195,41.91152215003967,0
    -87.64764904975891,41.911468505859375,0
    -87.64754176139832,41.91137194633484,0
    -87.64745593070984,41.911253929138184,0
    -87.64742374420166,41.91108226776123,0
    -87.64740228652954,41.91076040267944,0
    -87.6473593711853,41.91065311431885,0
    -87.64727354049683,41.91053509712219,0
    -87.64711260795593,41.910438537597656,0
    -87.64687657356262,41.91038489341736,0
    -87.64655470848083,41.91038489341736,0
    -87.638653,41.910432,0
    -87.63813257217407,41.91041707992554,0
    -87.63784289360046,41.91036343574524,0
    -87.63764977455139,41.910256147384644,0
    -87.63745665550232,41.91007375717163,0
    -87.63736009597778,41.9098162651062,0
    -87.63705968856812,41.90329313278198,0
    -87.63699531555176,41.90311074256897,0
    -87.63689875602722,41.902949810028076,0
    -87.63664126396179,41.90261721611023,0
    -87.63655543327332,41.902467012405396,0
    -87.63651251792908,41.90227389335632,0
    -87.63654470443726,41.90207004547119,0
    -87.63673782348633,41.90142631530762,0
    -87.63675928115845,41.9013512134552,0
    -87.63674855232239,41.90117955207825,0
    -87.63660907745361,41.897467374801636,0
    -87.63659834861755,41.89738154411316,0
    -87.63656616210938,41.89727425575256,0
    -87.6364803314209,41.89717769622803,0
    -87.6359760761261,41.896748542785645,0
    -87.63585805892944,41.89666271209717,0
    -87.63578295707703,41.89655542373657,0
    -87.63574004173279,41.89640522003174,0
    -87.63574004173279,41.89628720283508,0
    -87.63556838035583,41.89040780067444,0
    -87.63548254966736,41.890246868133545,0
    -87.63537526130676,41.89015030860901,0
    -87.63523578643799,41.89006447792053,0
    -87.63503193855286,41.890000104904175,0
    -87.63447403907776,41.8898606300354,0
    -87.63432383537292,41.8898069858551,0
    -87.63422727584839,41.889731884002686,0
    -87.63413071632385,41.88961386680603,0
    -87.63410925865173,41.88944220542908,0
    -87.634110,41.888634,0
    -87.6339054107666,41.88586950302124,0
    -87.63107299804688,41.885762214660645,0
    -87.628083,41.885843,0
    -87.6265561580658,41.885772943496704,0
    -87.62641668319702,41.885730028152466,0
    -87.62629866600037,41.88565492630005,0
    -87.62625575065613,41.885504722595215,0
    -87.626343,41.884609,0
    -87.626292,41.882163,0
    -87.626157,41.879559,0
    -87.62607336044312,41.87721133232117,0
    -87.62609481811523,41.87712550163269,0
    -87.62613773345947,41.87708258628845,0
    -87.62622356414795,41.877018213272095,0
    -87.62633085250854,41.876975297927856,0
    -87.628514,41.877028,0
    -87.631477,41.876985,0
    -87.63328313827515,41.87687873840332,0
    -87.63347625732422,41.87690019607544,0
    -87.63359427452087,41.87693238258362,0
    -87.63366937637329,41.876996755599976,0
    -87.63370156288147,41.87709331512451,0
    -87.633885,41.879289,0
    -87.633890,41.883259,0
    -87.6339054107666,41.88586950302124,0
    -87.634110,41.888634,0
            </coordinates>
          </LineString>
        </Placemark>
    
        <Placemark>
          <name>Yellow Line</name>
          <styleUrl>#yellowLine</styleUrl>
          <LineString>
            <altitudeMode>relative</altitudeMode>
            <coordinates>
    -87.75250,42.04049,0
    -87.74726629257202,42.02620267868042,0
    -87.74621486663818,42.0246148109436,0
    -87.7447772026062,42.02352046966553,0
    -87.74299621582031,42.02279090881348,0
    -87.74123668670654,42.02244758605957,0
    -87.73864030838013,42.02244758605957,0
    -87.7224612236023,42.02253341674805,0
    -87.71857738494873,42.02274799346924,0
    -87.70164728164673,42.02274799346924,0
    -87.6994800567627,42.022597789764404,0
    -87.69748449325562,42.022318840026855,0
    -87.6934289932251,42.022361755371094,0
    -87.68842935562134,42.02191114425659,0
    -87.67958879470825,42.02188968658447,0
    -87.67855882644653,42.021803855895996,0
    -87.67757177352905,42.021610736846924,0
    -87.67619848251343,42.021117210388184,0
    -87.6747179031372,42.02038764953613,0
    -87.67283499240875,42.019110918045044,0
            </coordinates>
          </LineString>
        </Placemark>
    
      </Document>
    </kml>
    `);

    /*  const markers = new L.MarkerClusterGroup();
    const marker1 = new Marker([10, 20]);
    const marker2 = new Marker([11, 19]);
    const marker3 = new Marker([12, 21]);
    const fg = new FeatureGroup([marker1, marker2, marker3]);

    markers.addLayer(fg);
    this.map.setMaxZoom(10);
    this.map.addLayer(markers); */

    // zoom the map to the polyline

    this.setMapProvider();
    this.map.setMaxZoom(this.maxZoom);
    this.gxMapDidLoad.emit(this);

    if (this.selectionLayer) {
      this.updateSelectionMarkerPosition();
      this.registerSelectionLayerEvents();
    }
    if (this.directionLayer) {
      const latLangs = this.wktToPolyline(this.directionLayerWKTString);
      polyline(latLangs, { color: "red" }).addTo(this.map);
    }

    this.addMapListener("popupopen", function(e) {
      const px = this.project(e.target._popup._latlng);
      px.y -= e.target._popup._container.clientHeight / 2;
      this.panTo(this.unproject(px), { animate: true });
    });
  }

  componentDidUpdate() {
    const maxZoom = this.checkForMaxZoom();
    this.setMapProvider();
    this.fitBounds();
    this.map.setMaxZoom(maxZoom);
    this.userLocationChange.emit(this.userLocationCoords);
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
            css-class={
              this.selectionTargetImageClass ?? this.selectionTargetImageClass
            }
            srcset={
              this.selectionTargetImageSrc ?? this.selectionTargetImageSrc
            }
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
