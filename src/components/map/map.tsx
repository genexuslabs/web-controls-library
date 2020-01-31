/* To do:
    - Research about the usertracking feature
*/

import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  h
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import {
  FeatureGroup,
  Marker,
  map as LFMap,
  tileLayer
} from "leaflet/dist/leaflet-src.esm";
import { parseCoords } from "../common/coordsValidate";

@Component({
  shadow: false,
  styleUrl: "map.scss",
  tag: "gx-map"
})
export class Map implements GxComponent {
  private map: any;
  private markersList = [];
  private mapProviderApplied: string;
  private mapTypesProviders = {
    hybrid:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    standar: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };
  @Element() element: HTMLGxMapElement;

  /**
   * The coord of initial center of the map.
   *
   */
  @Prop({ mutable: true }) center = "0, 0";

  /**
   * The map provider.
   *
   */
  @Prop() mapProvider: string;

  /**
   * Map type to be used instead a custom map provider.
   * _Note: If you set a map provider, the selected map type will be ignored._
   *
   */
  @Prop() mapType: "standar" | "satellite" | "hybrid" = "standar";

  /**
   * The max zoom level available in the map.
   *
   */
  @Prop() readonly maxZoom: number = 20;

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
    this.markersList.push(markerV);
    markerElement.addEventListener("gxMapMarkerDeleted", () => {
      let i = 0;
      this.onMapMarkerDeleted(markerV);
      while (
        i <= this.markersList.length &&
        this.markersList[i]._leaflet_id !== markerV._leaflet_id
      ) {
        i++;
      }
      if (i <= this.markersList.length) {
        this.markersList.splice(i, 1);
      } else {
        console.warn("There was an error in the markers list!");
      }
    });
  }

  private fitBounds() {
    const markersGroup = new FeatureGroup(this.markersList);
    this.map.fitBounds(markersGroup.getBounds());
  }

  private getZoom() {
    return this.zoom > 0 ? this.zoom : 20;
  }

  private onMapMarkerDeleted(markerV: Marker) {
    markerV.remove();
  }

  private setMapProvider() {
    function selectingTypes(mapType, thisComponent) {
      const tileLayerToApply = tileLayer(mapType, { maxZoom: 20 });
      tileLayerToApply.addTo(thisComponent.map);
      thisComponent.mapProviderApplied = tileLayerToApply;
    }

    if (this.mapProviderApplied) {
      this.map.removeLayer(this.mapProviderApplied);
    }
    if (this.mapProvider) {
      tileLayer(this.mapProvider, { maxZoom: 20 }).addTo(this.map);
      this.mapProviderApplied = tileLayer(this.mapProvider, { maxZoom: 20 });
    } else {
      if (!this.mapType || this.mapType === "standar") {
        selectingTypes(this.mapTypesProviders.standar, this);
      } else {
        if (this.mapType === "hybrid") {
          selectingTypes(this.mapTypesProviders.hybrid, this);
        } else if (this.mapType === "satellite") {
          selectingTypes(this.mapTypesProviders.satellite, this);
        }
      }
    }
  }

  componentDidLoad() {
    const elementVar = this.element.querySelector(".gxMap");
    const coords = parseCoords(this.center);
    if (coords !== null) {
      this.map = LFMap(elementVar).setView(
        coords,
        this.getZoom(),
        this.maxZoom
      );
    } else {
      console.warn(
        "GX warning: Can not read 'center' attribute, default center set (gx-map)",
        this.element
      );
      this.map = LFMap(elementVar).setView([0, 0], this.getZoom());
    }
    this.setMapProvider();
    this.gxMapDidLoad.emit(this);
    this.fitBounds();
    this.map.addEventListener("click", ev => {
      this.mapClick.emit(ev.latlng);
    });
  }

  componentDidUpdate() {
    const maxZoom = parseInt("" + this.maxZoom, 10) || 20;
    this.setMapProvider();
    this.map.setMaxZoom(maxZoom);
  }

  render() {
    return (
      <div class="gxMapContainer">
        <div class="gxMap" />
      </div>
    );
  }
}
