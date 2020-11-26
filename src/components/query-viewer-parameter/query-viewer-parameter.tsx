import { Component, Prop, h, Element, State } from '@stencil/core';
// import { Component as GxComponent } from "../common/interfaces";


@Component({
  tag: 'gx-query-viewer-parameter',
  shadow: false,
})
export class QueryViewerParameter {//implements GxComponent {

    @Prop() Name: string;
    @Prop() Value: string;
}