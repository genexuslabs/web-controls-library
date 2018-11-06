import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop
} from "@stencil/core";
import { IComponent } from "../common/interfaces";
import {
  Marker,
  map as LFMap,
  tileLayer
  // tslint:disable-next-line:no-submodule-imports
} from "leaflet/dist/leaflet-src.esm";

@Component({
  shadow: false,
  styleUrl: "map.scss",
  tag: "gx-map"
})
export class Map implements IComponent {
  map: any;
  @Element() element;

  /**
   * The coord of initial center of the map.
   *
   */
  @Prop({ mutable: true })
  center = "0, 0";

  /**
   * The max zoom level available in the map.
   *
   */
  @Prop() maxZoom = 20;

  /**
   * The initial zoom level in the map.
   *
   */
  @Prop({ mutable: true })
  zoom = 1;

  /**
   * Emmits when the map is loaded.
   *
   */
  @Event() gxMapDidLoad: EventEmitter;

  @Listen("gxMapMarkerDidLoad")
  onMapMarkerDidLoad(markerInstance) {
    const markerElement = markerInstance.target;
    const markerV = markerInstance.detail;

    if (this.map) {
      markerV.addTo(this.map);
    } else {
      this.element.addEventListener("gxMapDidLoad", () => {
        markerV.addTo(this.map);
      });
    }
    markerElement.addEventListener(
      "gxMapMarkerDeleted",
      this.onMapMarkerDeleted.bind(this, markerV)
    );
  }

  onMapMarkerDeleted(markerV: Marker) {
    markerV.remove();
  }

  componentDidLoad() {
    const regExp = /^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/;

    const elementVar = this.element.querySelector(".gxMap");
    if (regExp.test(this.center)) {
      this.map = LFMap(elementVar).setView(
        [this.center.split(",")[0].trim(), this.center.split(",")[1].trim()],
        this.zoom
      );
    } else {
      // tslint:disable-next-line:no-console
      console.warn(
        "GX warning: Can not read 'center' attribute, default center set (gx-map)",
        this.element
      );
      this.map = LFMap(elementVar).setView([0, 0], this.zoom);
    }
    tileLayer("http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png", {
      maxZoom: this.maxZoom
    }).addTo(this.map);
    this.map.addEventListener("move", () => {
      this.center = this.map.getCenter().lat + ", " + this.map.getCenter().lng;
    });
    this.map.addEventListener("zoom", () => {
      this.zoom = this.map.getZoom();
    });
    this.gxMapDidLoad.emit(this);
  }
  render() {
    return (
      <div>
        <div class="gxMap" />
      </div>
    );
  }
}
