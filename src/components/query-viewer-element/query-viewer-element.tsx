import { Component, Prop } from "@stencil/core";

@Component({
  tag: "gx-query-viewer-element",
  shadow: false
})
export class QueryViewerElement {
  /**
   * Name of the element
   */
  @Prop() name: string;
  /**
   * Title to show
   */
  @Prop() elementTitle: string;
  /**
   * How to show it
   */
  @Prop() visible: string;
  /**
   * Type of the element
   */
  @Prop() type: string;
  /**
   * Which axis, row or column
   */
  @Prop() axis: string;
  /**
   * Aggregation fucntion
   */
  @Prop() aggregation: string;
  /**
   * Data field
   */
  @Prop() dataField: string;
  /**
   * Type of the filter
   */
  @Prop() filterType: string;
  /**
   * Filter values comma separated
   */
  @Prop() filterValues: string;
  /**
   * Expand collapse type
   */
  @Prop() expandCollapseType: string;
  /**
   * Expand collapse values comma separated
   */
  @Prop() expandCollapseValues: string;
  /**
   * Axis Order type
   */
  @Prop() axisOrderType: string;
  /**
   * Axis order values comma separated
   */
  @Prop() axisOrderValues: string;
  /**
   * Grouping by year
   */
  @Prop() groupingGroupByYear: boolean;
  /**
   * Gouping by Year title
   */
  @Prop() groupingYearTitle: string;
  /**
   * Grouping by semester
   */
  @Prop() groupingGroupBySemester: boolean;
  /**
   * Grouping by Semster title
   */
  @Prop() groupingSemesterTitle: string;
  /**
   * Grouping by Quarter
   */
  @Prop() groupingGroupByQuarter: boolean;
  /**
   * Grouping by Quarter title
   */
  @Prop() groupingQuarterTitle: string;
  /**
   * Grouping by month
   */
  @Prop() groupingGroupByMonth: boolean;
  /**
   * Grouping by month title
   */
  @Prop() groupingMonthTitle: string;
  /**
   * Grouping by day of week
   */
  @Prop() groupingGroupByDayOfWeek: boolean;
  /**
   * Grouping by day of week title
   */
  @Prop() groupingDayOfWeekTitle: string;
  /**
   * Grouping hide vale
   */
  @Prop() groupingHideValue: boolean;
  /**
   * Raise item click
   */
  @Prop() raiseItemClick: boolean;
}
