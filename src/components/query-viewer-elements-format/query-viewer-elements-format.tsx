import { Component, Prop } from '@stencil/core';
// import { Component as GxComponent } from "../common/interfaces";


@Component({
  tag: 'gx-query-viewer-element-format',
  shadow: false,
})
export class QueryViewerElementFormat {//implements GxComponent {

    //<gx-query-viewer-elements-format picture='' subtotals='' style=''>
    @Prop() picture: string;
    @Prop() subtotals: string;
    @Prop() canDragToPages: boolean;
    @Prop() formatStyle: string;
    @Prop() targetValue: string;
    @Prop() maximumValue: string;
}