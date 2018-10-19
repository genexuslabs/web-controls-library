import { Component, Element, Event, EventEmitter, Prop } from "@stencil/core";
import { IComponent } from "../common/interfaces";
import {
  icon,
  marker
  // tslint:disable-next-line:no-submodule-imports
} from "leaflet/dist/leaflet-src.esm";

@Component({
  shadow: false,
  styleUrl: "map-marker.scss",
  tag: "gx-map-marker"
})
export class MapMarker implements IComponent {
  @Element() element: HTMLElement;

  private markerInstance: any;

  /**
   * The coordinates where the marker will appear in the map.
   *
   */
  @Prop({ mutable: true })
  coords = "0, 0";

  /**
   * The src of marker img. It can be an URL or a file path.
   *
   */
  @Prop({ mutable: true })
  iconSrc = "https://unpkg.com/leaflet@1.3.4/dist/images/marker-icon.png";

  /**
   * The size that the marker img will have.
   *
   */
  @Prop({ mutable: true })
  iconSize = "25, 41";

  /**
   * The position where the marker will be centered.
   *
   */
  @Prop({ mutable: true })
  iconAnchor = "12.5, 41";

  /**
   * The position in the marker where tooltip will appear.
   *
   */
  @Prop({ mutable: true })
  tooltipAnchor = "0, -30";

  /**
   * The tooltip caption of the marker.
   *
   */
  @Prop({ mutable: true })
  tooltipCaption: string;

  /**
   * Emmits when gx-map-marker is added inner gx-map and it loads.
   *
   */
  @Event() gxMapMarkerDidLoad: EventEmitter;

  /**
   * Emmits when gx-map-marker is deleted from gx-map.
   *
   */
  @Event() gxMapMarkerDeleted: EventEmitter;

  componentDidLoad() {
    if (!this.element.getAttribute("coords")) {
      // tslint:disable-next-line:no-console
      console.warn(
        "GX warning: No coords especified, default coords setted (gx-map-marker)"
      );
    }
    this.markerInstance = marker(this.coords.split(", "), {
      icon: icon({
        iconAnchor: [
          -(-this.iconAnchor.split(", ")[0]),
          -(-this.iconAnchor.split(", ")[1])
        ],
        iconSize: [
          -(-this.iconSize.split(", ")[0]),
          -(-this.iconSize.split(", ")[1])
        ],
        iconUrl: this.iconSrc,
        tooltipAnchor: [
          -(-this.tooltipAnchor.split(", ")[0]),
          -(-this.tooltipAnchor.split(", ")[1])
        ]
      })
    });
    if (!!this.tooltipCaption) {
      this.markerInstance.bindTooltip(this.tooltipCaption);
    }
    this.gxMapMarkerDidLoad.emit(this.markerInstance);
  }
  componentDidUnload() {
    this.gxMapMarkerDeleted.emit(this.markerInstance);
  }
  /*componentDidUpdate() {
		this.emmitEv();
		console.log('Component did update');
	}
	emmitEv() {
		this.gxMarkerDeleted.emit();
		console.log("");
		console.log("emmitEv");
	}*/

  render() {
    return "";
  }
}
