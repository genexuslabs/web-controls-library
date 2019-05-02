import { Component, ComponentInterface, Element, Prop } from "@stencil/core";
import { GridBaseHelper, IGridBase } from "../grid-base/grid-base";
import { IVisibilityComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "../grid-base/grid-base.scss",
  tag: "gx-grid-fs"
})
export class GridFreeStyle
  implements
    IGridBase,
    ComponentInterface,
    IVisibilityComponent {
  @Element() el!: HTMLElement;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * Grid loading State. It's purpose is to know rather the Grid Loading animation or the Grid Empty placeholder should be shown.
   *
   * | Value        | Details                                                                                        |
   * | ------------ | ---------------------------------------------------------------------------------------------- |
   * | `loading` | The grid is waiting the server for the grid data. Grid loading mask will be shown.                |
   * | `loaded`   | The grid data has been loaded. If the grid has no records, the empty place holder will be shown. |
   */

  @Prop() loadingState: "loading" | "loaded";

  /**
   * Grid current row count. This property is used in order to be able to re-render the Grid every time the Grid data changes.
   * If not specified, then grid empty and loading placeholders will not work correctly.
   */
  @Prop() recordCount: number;

  render() {
    return GridBaseHelper.render(this);
  }

  hostData() {
    return GridBaseHelper.hostData(this);
  }
}
