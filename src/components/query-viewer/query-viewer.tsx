import { Component, Prop, h, Element, State } from '@stencil/core';
// import { Component as GxComponent } from "../common/interfaces";


@Component({
  tag: 'gx-query-viewer',
  styleUrl: 'query-viewer.css',
  shadow: false,
})
export class QueryViewer {//implements GxComponent {

  private mapServices = {
    net:
    "gxqueryviewerforsd.aspx",
    java:
    "qviewer.services.gxqueryviewerforsd",
  };
  private propsNotToPost = ['baseUrl', 'env', 'mapServices', 'propsNotToPost']

  @Element() element: HTMLGxQueryViewerElement;
//getComputedStyle
//@Element element;
// const computedStyle = getComputedStyle(this.element);
// computedStyle.width

// Esto para el CSS
// query-viewer {
//   display: flex;
//   flex: 1;
// }



  componentDidRender() {
  
    this.generateForm()
  }
  
  @Prop() baseUrl: any;
  @Prop() env: string;


  @Prop() language: string;
  @Prop() object: string;
  @Prop() objectName: string;
  @Prop() type: string;
  @Prop() chartType: string;
  @Prop() paging: boolean;
  @Prop() pageSize: number;
  @Prop() showDataLabelsIn: string;
  @Prop() plotSeries: string;
  @Prop() xAxisLabels: string;
  @Prop() xAxisIntersectionAtZero: boolean;
  @Prop() showValues: boolean;
  @Prop() xAxisTitle: string;
  @Prop() yAxisTitle: string;
  @Prop() showDataAs: string;
  @Prop() includeTrend: boolean;
  @Prop() trendPeriod: string;
  @Prop() rememberLayout: boolean;
  @Prop() orientation: string;
  @Prop() includeSparkline: boolean;
  @Prop() includeMaxMin: boolean;
  @Prop() theme: string;
  @Prop() objectId: string;
  @Prop() objectType: string;
  @Prop() isExternalQuery: boolean;
  @Prop() allowElementsOrderChange: boolean;
  @Prop() autoResize: boolean;
  @Prop() autoResizeType: string;
  @Prop() fontFamily: string;
  @Prop() fontSize: number;
  @Prop() fontColor: string;
  @Prop() autoRefreshGroup: string;
  @Prop() disableColumnSort: boolean;
  @Prop() allowSelection: boolean;
  @Prop() exportToXML: boolean;
  @Prop() exportToHTML: boolean;
  @Prop() exportToXLS: boolean;
  @Prop() exportToXLSX: boolean;
  @Prop() exportToPDF: boolean;
  @Prop() queryTitle: string;

  

  private generateForm() {
    let form = document.createElement('form')
    form.action = this.baseUrl +  this.mapServices[this.env]
    form.method = 'POST'
    form.target = 'query_viewer'
    
    form.innerHTML = this.postData()

    document.body.append(form)
    form.submit()
  }

  private postData(): string {
    var postBody = ""
    for (const key in Object(this)) {
      if (Object(this)[key] != undefined && !this.propsNotToPost.includes(key)) {
        postBody += '<input type="hidden" name="' + key + '" value="' + Object(this)[key] + '" />'
      }
    }
    postBody += '<input type="hidden" name="Width" value="' + this.getWidth() + '" />'
    postBody += '<input type="hidden" name="Height" value="' + this.getHeight() + '" />'
    postBody += '<input type="hidden" name="Elements" value="' + this.getElements() + '" />'
    postBody += '<input type="hidden" name="Parameters" value="' + this.getParameters() + '" />'
    
    return postBody
  }

  private getParameters(): string {
    var parametersValue = ''
    let parameters = Array.from(document.getElementsByTagName('gx-query-viewer-parameter'))
    parameters.forEach(parameter => {
      parametersValue += (parametersValue != '' ? ',' : '')
      parametersValue += '{Value:' + encodeURIComponent(parameter.Value) + ',Name:' + parameter.Name + '}'
    });
    parametersValue ='[' + parametersValue + ']'

    return parametersValue
  }

  private getElements(): string {
    var elementsValue = ''
    let elements = Array.from(document.getElementsByTagName('gx-query-viewer-element'))
    elements.forEach(ax => {
      var elementValue = '{'
      elementValue += ' \"Name\": \"' + ax.name + '\"';
      elementValue += ' ,\"Title\": \"' + ax.title + '\"';
      elementValue += ' ,\"Visible\": \"' + ax.visible + '\"';
      elementValue += ' ,\"Type\": \"' + ax.type + '\"';
      elementValue += ' ,\"Axis\": \"' + ax.axis + '\"';
      elementValue += ' ,\"Aggregation\": \"' + ax.aggregation + '\"';
      elementValue += ' ,\"DataField\": \"' + ax.dataField + '\"';
      if(ax.axisOrderType) {
        elementValue += ', \"AxisOrder\": { \"Type\": \"' + ax.axisOrderType + '\"'
        elementValue += ax.axisOrderValues != null ? ', \"Values\": [' + ax.axisOrderValues + ']' : ''
        elementValue += '}'
      }
      if(ax.filterType) {
        elementValue += ', \"Filter\": { \"Type\": \"' + ax.filterType + '\"'
        elementValue += ax.filterValues != null ? ', \"Values\": [' + ax.filterValues + ']' : ''
        elementValue += '}'
      }
      if(ax.expandCollapseType) {
        elementValue += ', \"ExpandCollapse\": { \"Type\": \"' + ax.expandCollapseType + '\"'
        elementValue += ax.expandCollapseValues != null ? ' \"Values\": [' + ax.expandCollapseValues + ']' : ''
        elementValue += '}'
      }
      //TODO add grouping values
      let formats = Array.from(ax.getElementsByTagName('gx-query-viewer-element-format'))
      formats.forEach(format => {
        elementValue += ' ,\"Format\":  {'
        elementValue += ' \"Picture\": \"' + format.picture + '\"'
        elementValue += ' ,\"Subtotals\": \"' + format.subtotals + '\"'
        elementValue += ' ,\"CanDragToPages\": \"' + format.canDragToPages + '\"'
        elementValue += ' ,\"Style\": \"' + format.formatStyle + '\"'
        elementValue += ' ,\"TargetValue\": \"' + format.targetValue + '\"'
        elementValue += ' ,\"MaximumValue\": \"' + format.maximumValue + '\"'
        elementValue += ' }'
        //TODO add fromat styles
      })
      elementValue += '}'
      elementsValue += (elementsValue != '' ? ',' : '')
      elementsValue += elementValue
    })
    // elementsValue = '[' + elementsValue + ']'
    elementsValue = '{Name:CarModelName,Title:Model,Visible:,Type:,Axis:,Aggregation:,DataField:,Filter:{Type:ShowSomeValues,Values:[205,308,Gol,ParaTi,405,Cuore]}}'
    return elementsValue
  }

  private getWidth(): string {
    const computedStyle = getComputedStyle(this.element);
    return computedStyle.width
  }

  private getHeight(): string {
    const computedStyle = getComputedStyle(this.element);
    return '300'
    //return computedStyle.height
  }

  render() {
    return (
      <div>
        <iframe name="query_viewer" width={this.getWidth()} height={this.getHeight()}></iframe>   
      </div>
    )
  }
}
