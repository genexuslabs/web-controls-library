/*
<gx-query-viewer-elements-format-style type="conditional" value='' styleOrClass='' applyToRowOrColumn='' />
      <gx-query-viewer-elements-format-style type="conditional" value='' styleOrClass='' applyToRowOrColumn='' />
      
      <gx-query-viewer-elements-format-style type="format" operator='' value1='' value2='' styleOrClass='' />
      <gx-query-viewer-elements-format-style type="format" operator='' value1='' value2='' styleOrClass='' />
*/
import { Component, Prop } from '@stencil/core';
// import { Component as GxComponent } from "../common/interfaces";


@Component({
  tag: 'gx-query-viewer-element-format-style',
  shadow: false,
})
export class QueryViewerElementFormatStyle {//implements GxComponent {

    @Prop() type: string;
    
    @Prop() value: string;
    @Prop() applyToRowOrColumn: boolean;

    @Prop() styleOrClass: string;

    @Prop() operator: string;
    @Prop() value1: string;
    @Prop() value2: string;
    
}

