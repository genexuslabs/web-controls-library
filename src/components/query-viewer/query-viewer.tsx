import {
  Component,
  Element,
  Host,
  Listen,
  Prop,
  State,
  h,
} from "@stencil/core";

import { Component as GxComponent } from "../common/interfaces";

interface ParameterValue {
  Value: string;
  Name: string;
}

interface ElementValue {
  Name: string;
  Title: string;
  Visible: "Always" | "Yes" | "No" | "Never";
  Type: "Axis" | "Datum";
  Axis: "Rows" | "Columns" | "Pages";
  Aggregation: "Sum" | "Average" | "Count" | "Max" | "Min";
  DataField: string;
  AxisOrder?: {
    Type: "None" | "Ascending" | "Descending" | "Custom";
    Values?: string;
  };
  Filter?: {
    Type: "ShowAllValues" | "HideAllValues" | "ShowSomeValues";
    Values?: string;
  };
  ExpandCollapse?: {
    Type: "ExpandAllValues" | "CollapseAllValues" | "ExpandSomeValues";
    Values?: string;
  };
  Grouping?: Record<string, any>;
  Action?: {
    RaiseItemClick: boolean;
  };
  Format?: Format;
}

interface Format {
  Picture: string;
  Subtotals: "Yes" | "No" | "Hidden";
  CanDragToPages: boolean;
  Style: string;
  TargetValue: string;
  MaximumValue: string;
  ValuesStyle?: ValueStyle[];
  ConditionalStyles?: ConditionalStyle[];
}

interface ValueStyle {
  Value: string;
  ApplyToRowOrColumn: boolean;
  StyleOrClass: string;
}

interface ConditionalStyle {
  Value1: string;
  Value2: string;
  Operator: "EQ" | "LT" | "GT" | "LE" | "GE" | "NE" | "IN";
  StyleOrClass: string;
}

@Component({
  tag: "gx-query-viewer",
  styleUrl: "query-viewer.scss",
  shadow: false,
})
export class QueryViewer implements GxComponent {
  private mapServices = {
    net: "gxqueryviewerforsd.aspx",
    java: "qviewer.services.gxqueryviewerforsd",
  };
  private propsNotToPost = [
    "baseUrl",
    "env",
    "mapServices",
    "object",
    "objectCall",
    "propsNotToPost",
    "parameters",
    "elements",
    "dataVersionId",
  ];
  private objectCall: Array<string>;
  private configurationObserver = new MutationObserver(() => {
    this.configurationChangedHandler();
  });

  @Element() element: HTMLGxQueryViewerElement;

  @State() parameters: string;
  @State() elements: string;

  /**
   * Base URL of the server
   */
  @Prop() baseUrl: any;
  /**
   * Environmet of the project: JAVA. .Net, NetCore
   */
  @Prop() env: string;
  /**
   * Language of the QueryViewer
   */
  @Prop() language: string;
  /**
   * Object of QueryViewer
   */
  @Prop() object: string;
  /**
   * Name of the Query or Data provider assigned
   */
  @Prop() objectName: string;
  /**
   * Type of the QueryViewer: Table, PivotTable, Chart, Card
   */
  @Prop() type: "Card" | "Chart" | "PivotTable" | "Table" | "Default";
  /**
   * If type == Chart, this is the chart type: Bar, Pie, Timeline, etc...
   */
  @Prop() chartType:
    | "Column"
    | "Column3D"
    | "StackedColumn"
    | "StackedColumn3D"
    | "StackedColumn100"
    | "Bar"
    | "StackedBar"
    | "StackedBar100"
    | "Area"
    | "StackedArea"
    | "StackedArea100"
    | "SmoothArea"
    | "StepArea"
    | "Line"
    | "StackedLine"
    | "StackedLine100"
    | "SmoothLine"
    | "StepLine"
    | "Pie"
    | "Pie3D"
    | "Doughnut"
    | "Doughnut3D"
    | "LinearGauge"
    | "CircularGauge"
    | "Radar"
    | "FilledRadar"
    | "PolarArea"
    | "Funnel"
    | "Pyramid"
    | "ColumnLine"
    | "Column3DLine"
    | "Timeline"
    | "SmoothTimeline"
    | "StepTimeline"
    | "Sparkline";
  /**
   * If type == PivotTable or Table, if true there is paging, else everything in one table
   */
  @Prop() paging: boolean;
  /**
   * If paging true, number of items for a single page
   */
  @Prop() pageSize: number;
  /**
   * Ax to show data labels
   */
  @Prop() showDataLabelsIn: string;
  /**
   * Timeline
   */
  @Prop() plotSeries: "InTheSameChart" | "InSeparateCharts";
  /**
   * Labels for XAxis
   */
  @Prop() xAxisLabels:
    | "Horizontally"
    | "Rotated30"
    | "Rotated45"
    | "Rotated60"
    | "Vertically";
  /**
   * if true the x Axes intersect at zero
   */
  @Prop() xAxisIntersectionAtZero: boolean;
  /**
   * if true show values on the graph
   */
  @Prop() showValues: boolean;
  /**
   * X Axis title
   */
  @Prop() xAxisTitle: string;
  /**
   * Y Axis title
   */
  @Prop() yAxisTitle: string;
  /**
   * Type of data to show
   */
  @Prop() showDataAs: "Values" | "Percentages" | "ValuesAndPercentages";
  /**
   * If true includes trend on the graph
   */
  @Prop() includeTrend: boolean;
  /**
   * If includeTrend, defines the period of the trend
   */
  @Prop() trendPeriod:
    | "SinceTheBeginning"
    | "LastYear"
    | "LastSemester"
    | "LastQuarter"
    | "LastMonth"
    | "LastWeek"
    | "LastDay"
    | "LastHour"
    | "LastMinute"
    | "LastSecond";
  /**
   * For timeline for remembering layout
   */
  @Prop() rememberLayout: boolean;
  /**
   * Orientation of the graph
   */
  @Prop() orientation: "Horizontal" | "Vertical";
  /**
   * Include spark line
   */
  @Prop() includeSparkline: boolean;
  /**
   * Include max and min
   */
  @Prop() includeMaxMin: boolean;
  /**
   * Theme for showing the graph
   */
  @Prop() theme: string;
  /**
   * Object type -> Query or DataProvider
   */
  @Prop() objectType: string;
  /**
   * True if it is external query
   */
  @Prop() isExternalQuery: boolean;
  /**
   * Allowing elements order to change
   */
  @Prop() allowElementsOrderChange: boolean;
  /**
   * If type== PivotTable or Table, if true will shrink the table
   */
  @Prop() autoResize: boolean;
  /**
   * If autoResize, in here select the type, Width, height, or both
   */
  @Prop() autoResizeType: "Both" | "Vertical" | "Horizontal";
  /**
   * Type of font
   */
  @Prop() fontFamily: string;
  /**
   * Font size
   */
  @Prop() fontSize: number;
  /**
   * Font Color
   */
  @Prop() fontColor: string;
  /**
   * Auto refresh group
   */
  @Prop() autoRefreshGroup: string;
  /**
   * Allowing or not Comlumn sort
   */
  @Prop() disableColumnSort: boolean;
  /**
   * Allow selection
   */
  @Prop() allowSelection: boolean;
  /**
   * If type== PivotTable or Table allow to export to XML
   */
  @Prop() exportToXML: boolean;
  /**
   * If type== PivotTable or Table allow to export to HTML
   */
  @Prop() exportToHTML: boolean;
  /**
   * If type== PivotTable or Table allow to export to XLS
   */
  @Prop() exportToXLS: boolean;
  /**
   * If type== PivotTable or Table allow to export to XLSX
   */
  @Prop() exportToXLSX: boolean;
  /**
   * If type== PivotTable or Table allow to export to PDF
   */
  @Prop() exportToPDF: boolean;
  /**
   * Title of the QueryViewer
   */
  @Prop() queryTitle: string;
  /**
   * Version of data
   */
  @Prop() dataVersionId: number;

  @Listen("parameterValueChanged")
  parameterValueChangedHandler(eventInfo: CustomEvent) {
    eventInfo.stopPropagation();
    this.getParameters();
  }

  @Listen("elementChanged")
  elementChangedHandler(eventInfo: CustomEvent) {
    eventInfo.stopPropagation();
    this.getElements();
  }

  configurationChangedHandler() {
    this.getParameters();
    this.getElements();
  }

  componentWillLoad() {
    this.getParameters();
    this.getElements();
  }

  componentDidLoad() {
    this.configurationObserver.observe(this.element, {
      childList: true,
      subtree: true,
    });
  }

  componentDidRender() {
    const form = this.element.querySelector("form");
    form.submit();
  }

  disconnectedCallback() {
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (this.configurationObserver) {
      this.configurationObserver.disconnect();
      this.configurationObserver = undefined;
    }
  }

  private parseObjectToObjectcall() {
    try {
      this.objectCall = JSON.parse(this.object);
    } catch (e) {
      this.objectCall = null;
    }
  }

  private hasObjectCall() {
    return Array.isArray(this.objectCall) && this.objectCall.length >= 2;
  }

  private loadObjectNameFromObjectCall() {
    if (this.hasObjectCall()) {
      this.objectName = this.objectCall[1];
    }
  }

  private postData() {
    this.parseObjectToObjectcall();
    this.loadObjectNameFromObjectCall();

    return [
      ...Object.keys(QueryViewer.prototype)
        .filter((key) => !this.propsNotToPost.includes(key))
        // @ts-expect-error @todo TODO: Improve typing
        .map((key) => <input type="hidden" name={key} value={this[key]} />),

      <input type="hidden" name="Elements" value={this.elements} />,
      <input type="hidden" name="Parameters" value={this.parameters} />,
    ];
  }

  private getParameters() {
    const parametersValue: ParameterValue[] = [];

    if (this.hasObjectCall()) {
      this.objectCall.slice(2).forEach((value) => {
        const parameterObject: ParameterValue = {
          Value: encodeURIComponent(value),
          Name: "",
        };
        parametersValue.push(parameterObject);
      });
    } else {
      const parameters = Array.from(
        document.getElementsByTagName("gx-query-viewer-parameter")
      );
      parameters.forEach((parameter) => {
        const parameterObject: ParameterValue = {
          Value: encodeURIComponent(parameter.Value),
          Name: parameter.Name,
        };
        parametersValue.push(parameterObject);
      });
    }

    this.parameters = JSON.stringify(parametersValue);
  }

  private getElements() {
    const elementsValue: ElementValue[] = [];
    const elements = Array.from(
      document.getElementsByTagName("gx-query-viewer-element")
    );
    elements.forEach((ax) => {
      const elementObjectValue: ElementValue = {
        Name: ax.name,
        Title: ax.elementTitle,
        Visible: ax.visible,
        Type: ax.type,
        Axis: ax.axis,
        Aggregation: ax.aggregation,
        DataField: ax.dataField,
      };

      if (ax.axisOrderType) {
        elementObjectValue["AxisOrder"] = { Type: ax.axisOrderType };
        if (ax.axisOrderValues) {
          elementObjectValue["AxisOrder"]["Values"] = ax.axisOrderValues;
        }
      }
      if (ax.filterType) {
        elementObjectValue["Filter"] = { Type: ax.filterType };
        if (ax.axisOrderValues) {
          elementObjectValue["Filter"]["Values"] = ax.filterValues;
        }
      }
      if (ax.expandCollapseType) {
        elementObjectValue["ExpandCollapse"] = { Type: ax.expandCollapseType };
        if (ax.axisOrderValues) {
          elementObjectValue["ExpandCollapse"]["Values"] =
            ax.expandCollapseValues;
        }
      }

      const grouping = this.getGrouping(ax);
      if (Object.keys(grouping).length > 0) {
        elementObjectValue["Grouping"] = grouping;
      }
      if (ax.raiseItemClick) {
        const action = { RaiseItemClick: ax.raiseItemClick };
        elementObjectValue["Action"] = action;
      }

      const formats = Array.from(
        ax.getElementsByTagName("gx-query-viewer-element-format")
      );

      formats.forEach((format) => {
        const formatObject: Format = {
          Picture: format.picture,
          Subtotals: format.subtotals,
          CanDragToPages: format.canDragToPages,
          Style: format.formatStyle,
          TargetValue: format.targetValue,
          MaximumValue: format.maximumValue,
        };

        const styles = Array.from(
          ax.getElementsByTagName("gx-query-viewer-format-style")
        );

        const valuesStyles: ValueStyle[] = [];
        const conditionalStyles: ConditionalStyle[] = [];

        styles.forEach((style) => {
          if (style.type === "Values") {
            const valueStyle = {
              Value: style.value,
              ApplyToRowOrColumn: style.applyToRowOrColumn,
              StyleOrClass: style.styleOrClass,
            };
            valuesStyles.push(valueStyle);
          } else {
            const conditionalStyle = {
              Value1: style.value1,
              Value2: style.value2,
              Operator: style.operator,
              StyleOrClass: style.styleOrClass,
            };
            conditionalStyles.push(conditionalStyle);
          }
        });
        if (valuesStyles.length > 0) {
          formatObject["ValuesStyle"] = valuesStyles;
        }
        if (conditionalStyles.length > 0) {
          formatObject["ConditionalStyles"] = conditionalStyles;
        }

        elementObjectValue["Format"] = formatObject;
      });
      elementsValue.push(elementObjectValue);
    });

    this.elements = JSON.stringify(elementsValue);
  }

  private getGrouping(
    ax: HTMLGxQueryViewerElementElement
  ): Record<string, any> {
    const grouping = () => ({
      ...(ax.groupingGroupByYear && { GroupByYear: ax.groupingGroupByYear }),
      ...(ax.groupingYearTitle && {
        YearTitle: ax.groupingYearTitle,
      }),
      ...(ax.groupingGroupBySemester && {
        GroupBySemester: ax.groupingGroupBySemester,
      }),
      ...(ax.groupingSemesterTitle && {
        SemesterTitle: ax.groupingSemesterTitle,
      }),
      ...(ax.groupingGroupByQuarter && {
        GroupByQuarter: ax.groupingGroupByQuarter,
      }),
      ...(ax.groupingQuarterTitle && { QuarterTitle: ax.groupingQuarterTitle }),
      ...(ax.groupingGroupByMonth && { GroupByMonth: ax.groupingGroupByMonth }),
      ...(ax.groupingMonthTitle && { MonthTitle: ax.groupingMonthTitle }),
      ...(ax.groupingGroupByDayOfWeek && {
        GroupByDayOfWeek: ax.groupingGroupByDayOfWeek,
      }),
      ...(ax.groupingDayOfWeekTitle && {
        DayOfWeekTitle: ax.groupingDayOfWeekTitle,
      }),
      ...(ax.groupingHideValue && { HideValue: ax.groupingHideValue }),
    });
    return grouping;
  }

  render() {
    return (
      <Host>
        <iframe
          name="query_viewer"
          data-version-id={this.dataVersionId}
        ></iframe>
        <form
          hidden
          target="query_viewer"
          // @ts-expect-error @todo TODO: Improve typing
          action={this.baseUrl + this.mapServices[this.env]}
          method="POST"
        >
          {this.postData()}
        </form>
      </Host>
    );
  }
}
