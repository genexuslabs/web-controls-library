/* To do:
    - Add popup feature
        . Use <slot> to accept incoming HTML
        . Ask for size of popup (90% wide up to a maximum of 300px as an example)
*/

import { Component, Element, Event, EventEmitter, Prop } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import { divIcon, marker } from "leaflet/dist/leaflet-src.esm";
import { parseCoords } from "../common/coordsValidate";

@Component({
  shadow: false,
  styleUrl: "map-marker.scss",
  tag: "gx-map-marker"
})
export class MapMarker implements GxComponent {
  @Element() element: HTMLGxMapMarkerElement;
  // private defaultIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=";
  private markerInstance: any;

  /**
   * The coordinates where the marker will appear in the map.
   *
   */
  @Prop({ mutable: true }) coords = "0, 0";

  /**
   * The class that the marker will have.
   *
   * _Tip: Set the background-image to use it as icon of the marker._
   *
   * _Note: The default class is defined in map style._
   *
   */
  @Prop() markerClass = "defaultIcon";

  /**
   * The marker image height.
   *
   */
  @Prop() iconSizeHeight = 30;

  /**
   * The marker image width.
   *
   */
  @Prop() iconSizeWidth = 30;

  /**
   * The URL of the marker image.
   *
   */
  // @Prop() iconSrc: string = "defaultIcon";

  /**
   * The tooltip caption of the marker.
   *
   */
  @Prop() readonly tooltipCaption: string;

  /**
   * Emmits when the element is added to a `<gx-map>`.
   *
   */
  @Event() gxMapMarkerDidLoad: EventEmitter;

  /**
   * Emmits when the element update its data.
   *
   */
  @Event() gxMapMarkerUpdate: EventEmitter;

  /**
   * Emmits when the element is deleted from a `<gx-map>`.
   *
   */
  @Event() gxMapMarkerDeleted: EventEmitter;

  //   private setIconSrc(){
  //     this.iconSrc = (this.iconSrc === "defaultIcon")?(this.defaultIcon):(this.iconSrc);
  //   }

  //   private getImgSize(imgSrc) {
  //     var newImg = new Image();
  //     let sizes = {
  //         height: 0,
  //         width: 0
  //     }
  //     function sizesValue(returnValue){
  //         let x: any;
  //         function onLoadHandle(){
  //             sizes.width = newImg.naturalWidth;
  //             sizes.height = newImg.naturalHeight;
  //             returnValue(x, sizes)
  //         };
  //         newImg.onload = ()=>{
  //             onLoadHandle();
  //             console.log("x", x);
  //         };
  //         newImg.onerror = ()=>{
  //             //
  //         }
  //     }
  //     newImg.src = imgSrc;
  //     return sizesValue(
  //         function(paramHelper, paramToReturn:any){
  //             paramHelper = paramToReturn
  //             return paramHelper
  //         }
  //     )
  // }

  componentDidLoad() {
    // this.setIconSrc();
    // let imgSize = this.getImgSize(this.iconSrc);
    const halfIconWidth = this.iconSizeWidth / 2;
    const coords = parseCoords(this.coords);
    // console.log(this.iconSrc, `${imgSize.width},${imgSize.height}`)
    if (coords !== null) {
      this.markerInstance = marker(coords, {
        icon: divIcon({
          className: this.markerClass,
          // html: "hola",
          iconAnchor: [halfIconWidth, this.iconSizeHeight],
          iconSize: [this.iconSizeWidth, this.iconSizeHeight],
          // iconUrl: this.iconSrc,
          tooltipAnchor: [0, -28]
        })
      });
    } else {
      console.warn(
        "GX warning: Can not read 'coords' attribute, default coords set (gx-map-marker)",
        this.element
      );
      this.markerInstance = marker([0, 0], {
        icon: divIcon({
          iconAnchor: [halfIconWidth, this.iconSizeHeight],
          iconSize: [this.iconSizeWidth, this.iconSizeHeight],
          // iconUrl: this.iconSrc,
          tooltipAnchor: [0, -28]
        })
      });
    }
    if (this.tooltipCaption) {
      this.markerInstance.bindTooltip(this.tooltipCaption);
    }
    this.gxMapMarkerDidLoad.emit(this.markerInstance);
  }

  componentDidUpdate() {
    const halfIconWidth = this.iconSizeWidth / 2;
    const coords = parseCoords(this.coords);
    if (coords !== null) {
      this.markerInstance.setLatLng(coords);
    } else {
      console.warn(
        "GX warning: Can not read 'coords' attribute, default coords set (gx-map-marker)",
        this.element
      );
      this.markerInstance.setLatLng([0, 0]);
    }
    // this.setIconSrc();
    this.markerInstance.setIcon(
      divIcon({
        iconAnchor: [halfIconWidth, this.iconSizeHeight],
        iconSize: [this.iconSizeWidth, this.iconSizeHeight],
        // iconUrl: this.iconSrc || this.defaultIcon,
        tooltipAnchor: [0, -28]
      })
    );
  }

  componentDidUnload() {
    this.gxMapMarkerDeleted.emit(this.markerInstance);
  }

  render() {
    return "";
  }
}
