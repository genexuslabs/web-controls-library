import { Component, Prop } from '@stencil/core';
// import { Component as GxComponent } from "../common/interfaces";


@Component({
  tag: 'gx-query-viewer-element',
  shadow: false,
})
export class QueryViewerElement {//implements GxComponent {

    @Prop() name: string;
    @Prop() title: string;
    @Prop() visible: string;
    @Prop() type: string;
    @Prop() axis: string;
    @Prop() aggregation: string;
    @Prop() dataField: string;
    @Prop() filterType: string;
    @Prop() filterValues: string;
    @Prop() expandCollapseType: string;
    @Prop() expandCollapseValues: string;
    @Prop() axisOrderType: string;
    @Prop() axisOrderValues: string;
    @Prop() groupingGroupByYear: boolean;
    @Prop() groupingYearTitle: string;
    @Prop() groupingGroupBySemester: boolean;
    @Prop() groupingSemesterTitle: string;
    @Prop() groupingGroupByQuarter: boolean;
    @Prop() groupingQuarterTitle: string;
    @Prop() groupingGroupByMonth: boolean;
    @Prop() groupingMonthTitle: string;
    @Prop() groupingGroupByDayOfWeek: boolean;
    @Prop() groupingDayOfWeekTitle: string;
    @Prop() groupingHideValue: boolean;
    @Prop() raiseItemClick: boolean;
}

/*
<gx-query-viewer language='es' charttype='pie'>
  <gx-query-viewer-elements
                            name='' 
                            title='' 
                            visible='' 
                            type='' 
                            axis='' 
                            aggregation='' 
                            datafield='' 
                            filter-type="" 
                            filter-values=""
                            expand-collapse-type=""
                            expand-collapse-values=""
                            axis-order-type=""
                            axis-order-values=""
                            grouping-by-year=""
                            grouping-year-title=""
                            grouping-by-semester=""
                            grouping-*
                            >
    <gx-query-viewer-elements-format picture='' subtotals='' style=''>
      <gx-query-viewer-elements-format-style type="conditional" value='' styleOrClass='' applyToRowOrColumn='' />
      <gx-query-viewer-elements-format-style type="conditional" value='' styleOrClass='' applyToRowOrColumn='' />
      
      <gx-query-viewer-elements-format-style type="format" operator='' value1='' value2='' styleOrClass='' />
      <gx-query-viewer-elements-format-style type="format" operator='' value1='' value2='' styleOrClass='' />
    </gx-query-viewer-elements-format>
      
  </gx-query-viewer-elements>
</gx-query-viewer>

*/