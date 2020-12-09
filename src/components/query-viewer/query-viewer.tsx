import { Component, Prop, h, Element } from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  tag: "gx-query-viewer",
  styleUrl: "query-viewer.css",
  shadow: false
})
export class QueryViewer implements GxComponent {
  private mapServices = {
    net: "gxqueryviewerforsd.aspx",
    java: "qviewer.services.gxqueryviewerforsd"
  };
  private propsNotToPost = ["baseUrl", "env", "mapServices", "propsNotToPost"];

  @Element() element: HTMLGxQueryViewerElement;

  componentDidRender() {
    this.generateForm();
  }

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

  private generateForm() {
    const form = document.createElement("form");
    form.action = this.baseUrl + this.mapServices[this.env];
    form.method = "POST";
    form.target = "query_viewer";
    form.innerHTML = this.postData();

    document.body.append(form);
    form.submit();
  }

  private postData(): string {
    let postBody = "";
    for (const key in Object(this)) {
      if (
        Object(this)[key] != undefined &&
        !this.propsNotToPost.includes(key)
      ) {
        postBody +=
          '<input type="hidden" name="' +
          key +
          '" value="' +
          Object(this)[key] +
          '" />';
      }
    }
    postBody +=
      '<input type="hidden" name="Width" value="' + this.getWidth() + '" />';
    postBody +=
      '<input type="hidden" name="Height" value="' + this.getHeight() + '" />';
    postBody +=
      '<input type="hidden" name="Elements" value="' +
      this.getElements() +
      '" />';
    postBody +=
      '<input type="hidden" name="Parameters" value="' +
      this.getParameters() +
      '" />';
    return postBody;
  }

  private getParameters(): string {
    let parametersValue = "";
    const parameters = Array.from(
      document.getElementsByTagName("gx-query-viewer-parameter")
    );
    parameters.forEach(parameter => {
      parametersValue += parametersValue != "" ? "," : "";
      parametersValue +=
        "{Value:" +
        encodeURIComponent(parameter.Value) +
        ",Name:" +
        parameter.Name +
        "}";
    });
    parametersValue = "[" + parametersValue + "]";

    return parametersValue;
  }

  private getElements(): string {
    let elementsValue = "";
    const elements = Array.from(
      document.getElementsByTagName("gx-query-viewer-element")
    );
    elements.forEach(ax => {
      let elementValue = "{";
      elementValue += ' "Name": "' + ax.name + '"';
      elementValue += ' ,"Title": "' + ax.elementTitle + '"';
      elementValue += ' ,"Visible": "' + ax.visible + '"';
      elementValue += ' ,"Type": ' + ax.type + '"';
      elementValue += ' ,"Axis": "' + ax.axis + '"';
      elementValue += ' ,"Aggregation": "' + ax.aggregation + '"';
      elementValue += ' ,"DataField": ' + ax.dataField + '"';
      if (ax.axisOrderType) {
        elementValue += ', "AxisOrder": { "Type": "' + ax.axisOrderType + '"';
        elementValue +=
          ax.axisOrderValues != null
            ? ', "Values": [' + ax.axisOrderValues + "]"
            : "";
        elementValue += "}";
      }
      if (ax.filterType) {
        elementValue += ', "Filter": { "Type": ' + ax.filterType + '"';
        elementValue +=
          ax.filterValues != null
            ? ', "Values": [' + ax.filterValues + "]"
            : "";
        elementValue += "}";
      }
      if (ax.expandCollapseType) {
        elementValue +=
          ', "ExpandCollapse": { "Type": "' + ax.expandCollapseType + '"';
        elementValue +=
          ax.expandCollapseValues != null
            ? ' "Values": [' + ax.expandCollapseValues + "]"
            : "";

        elementValue += "}";
      }
      //TODO add grouping values
      const formats = Array.from(
        ax.getElementsByTagName("gx-query-viewer-element-format")
      );

      formats.forEach(format => {
        elementValue += ' ,"Format":  {';
        elementValue += ' "Picture": "' + format.picture + '"';
        elementValue += ' ,"Subtotals": "' + format.subtotals + '"';
        elementValue += ' ,"CanDragToPages": "' + format.canDragToPages + '"';
        elementValue += ' ,"Style": "' + format.formatStyle + '"';
        elementValue += ' ,"TargetValue": "' + format.targetValue + '"';
        elementValue += ' ,"MaximumValue": "' + format.maximumValue + '"';
        elementValue += " }";
        //TODO add fromat styles
      });
      elementValue += "}";
      elementsValue += elementsValue != "" ? "," : "";
      elementsValue += elementValue;
    });
    elementsValue = "[" + elementsValue + "]";
    return elementsValue;
  }

  private getWidth(): string {
    const computedStyle = getComputedStyle(this.element);
    return computedStyle.width;
  }

  private getHeight(): string {
    const computedStyle = getComputedStyle(this.element);
    return computedStyle.height;
  }

  render() {
    return (
      <div>
        <iframe
          name="query_viewer"
          width={this.getWidth()}
          height={this.getHeight()}
        ></iframe>
      </div>
    );
  }
}
