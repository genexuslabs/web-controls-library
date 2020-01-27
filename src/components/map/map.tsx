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
  @Prop() mapProvider =
    "http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png";

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
    tileLayer(this.mapProvider, {}).addTo(this.map);
    this.gxMapDidLoad.emit(this);
    this.fitBounds();
    this.map.addEventListener("click", ev => {
      this.mapClick.emit(ev.latlng);
    });
  }

  componentDidUpdate() {
    const centerCoords = parseCoords(this.center);
    const zoom = parseInt("" + this.zoom, 10) || 0;
    const maxZoom = parseInt("" + this.maxZoom, 10) || 20;
    if (centerCoords !== null) {
      this.map.setView(centerCoords, zoom);
    } else {
      console.warn(
        "GX warning: Can not read 'center' attribute, default center set (gx-map)",
        this.element
      );
      this.map.setView([0, 0], zoom);
    }
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
