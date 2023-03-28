import { Component, Event, EventEmitter, Prop } from "@stencil/core";

@Component({
  tag: "gx-query-viewer-element",
  shadow: false
})
export class QueryViewerElement {
  // eslint-disable-next-line @stencil-community/required-jsdoc
  @Event() elementChanged: EventEmitter;

  /**
   * Name of the element
   */
  @Prop() readonly name: string;
  /**
   * Title to show
   */
  @Prop() readonly elementTitle: string;
  /**
   * How to show it
   */
  @Prop() readonly visible: "Always" | "Yes" | "No" | "Never";
  /**
   * Type of the element
   */
  @Prop() readonly type: "Axis" | "Datum";
  /**
   * Which axis, row or column
   */
  @Prop() readonly axis: "Rows" | "Columns" | "Pages";
  /**
   * Aggregation fucntion
   */
  @Prop() readonly aggregation: "Sum" | "Average" | "Count" | "Max" | "Min";
  /**
   * Data field
   */
  @Prop() readonly dataField: string;
  /**
   * Type of the filter
   */
  @Prop() readonly filterType:
    | "ShowAllValues"
    | "HideAllValues"
    | "ShowSomeValues";
  /**
   * Filter values comma separated
   */
  @Prop() readonly filterValues: string;
  /**
   * Expand collapse type
   */
  @Prop() readonly expandCollapseType:
    | "ExpandAllValues"
    | "CollapseAllValues"
    | "ExpandSomeValues";
  /**
   * Expand collapse values comma separated
   */
  @Prop() readonly expandCollapseValues: string;
  /**
   * Axis Order type
   */
  @Prop() readonly axisOrderType:
    | "None"
    | "Ascending"
    | "Descending"
    | "Custom";
  /**
   * Axis order values comma separated
   */
  @Prop() readonly axisOrderValues: string;
  /**
   * Grouping by year
   */
  @Prop() readonly groupingGroupByYear: boolean;
  /**
   * Gouping by Year title
   */
  @Prop() readonly groupingYearTitle: string;
  /**
   * Grouping by semester
   */
  @Prop() readonly groupingGroupBySemester: boolean;
  /**
   * Grouping by Semster title
   */
  @Prop() readonly groupingSemesterTitle: string;
  /**
   * Grouping by Quarter
   */
  @Prop() readonly groupingGroupByQuarter: boolean;
  /**
   * Grouping by Quarter title
   */
  @Prop() readonly groupingQuarterTitle: string;
  /**
   * Grouping by month
   */
  @Prop() readonly groupingGroupByMonth: boolean;
  /**
   * Grouping by month title
   */
  @Prop() readonly groupingMonthTitle: string;
  /**
   * Grouping by day of week
   */
  @Prop() readonly groupingGroupByDayOfWeek: boolean;
  /**
   * Grouping by day of week title
   */
  @Prop() readonly groupingDayOfWeekTitle: string;
  /**
   * Grouping hide vale
   */
  @Prop() readonly groupingHideValue: boolean;
  /**
   * Raise item click
   */
  @Prop() readonly raiseItemClick: boolean;

  componentDidUpdate() {
    this.elementChanged.emit();
  }
}
