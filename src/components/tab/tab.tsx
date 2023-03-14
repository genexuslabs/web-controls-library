import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Prop,
  h
} from "@stencil/core";
import {
  Component as GxComponent,
  VisibilityComponent
} from "../common/interfaces";
import {
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";

/**
 * @part nav-tabs - The main parent of the container of the tab captions.
 * @part nav-tabs-table - The main parent container of the tab captions.
 * @part nav-tabs-table-filler - The tab strip filler when the `tabs-distribution="scroll"`.
 * @part tab-content - The main parent container of the tab pages.
 *
 * @slot caption - The slot for the tab captions.
 * @slot page - The slot for the tab pages.
 */
@Component({
  shadow: true,
  styleUrl: "tab.scss",
  tag: "gx-tab"
})
export class Tab
  implements GxComponent, VisibilityComponent, HighlightableComponent {
  /**
   *  - Input: Caption Id
   *  - Output: Corresponding tabPage Id
   */
  private tabCaptionIdToTabPageId = new Map<string, string>();

  // Refs
  private lastSelectedTabCaption: HTMLGxTabCaptionElement;
  private lastSelectedTabPage: HTMLGxTabPageElement;

  @Element() element: HTMLGxTabElement;

  /**
   * A CSS class to set as the `gx-tab` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable = false;

  /**
   * Defines how the tabs will be distributed in the Strip.
   *
   * | Value        | Details                                                                            |
   * | ------------ | ---------------------------------------------------------------------------------- |
   * | `scoll`      | Allows scrolling the tab control when the number of tabs exceeds the screen width. |
   * | `fixed-size` | Tabs are fixed size. Used with any amount of tabs.                                 |
   */
  @Prop() readonly tabsDistribution: "scroll" | "fixed-size" = "scroll";

  /**
   * Fired when the active tab is changed
   */
  @Event() tabChange: EventEmitter;

  @Listen("tabSelect")
  tabClickHandler(event: CustomEvent) {
    const tabCaptionElement = event.target as HTMLGxTabCaptionElement;

    if (
      tabCaptionElement.closest("gx-tab") !== this.element ||
      tabCaptionElement == this.lastSelectedTabCaption
    ) {
      return;
    }
    this.setSelectedTab(tabCaptionElement);

    this.tabChange.emit(event);
  }

  private setSelectedTab(tabCaptionElement: HTMLGxTabCaptionElement) {
    // Unselect last tabCaption and tabPage elements
    this.lastSelectedTabCaption.selected = false;
    this.lastSelectedTabPage.selected = false;

    // Update last tabCaption and tabPage elements
    const tabPageId = this.tabCaptionIdToTabPageId.get(tabCaptionElement.id);
    this.lastSelectedTabCaption = tabCaptionElement;
    this.lastSelectedTabPage = this.element.querySelector(`#${tabPageId}`);

    // Select new tabCaption and tabPage elements
    this.lastSelectedTabCaption.selected = true;
    this.lastSelectedTabPage.selected = true;
  }

  private linkCaptionsWithTabPages() {
    const captionSlots = this.getCaptionSlots();
    const pageSlots = this.getPageSlots();

    if (captionSlots.length !== pageSlots.length) {
      return;
    }

    captionSlots.forEach((captionElement, i) => {
      const pageElement = pageSlots[i];

      captionElement.setAttribute("aria-controls", pageElement.id);
      pageElement.setAttribute("aria-labelledby", captionElement.id);

      this.tabCaptionIdToTabPageId.set(captionElement.id, pageElement.id);

      // Determine which tab page is selected
      if (captionElement.selected) {
        this.lastSelectedTabCaption = captionElement;
        this.lastSelectedTabPage = pageElement;

        this.lastSelectedTabPage.selected = true;
      }
    });
  }

  private getCaptionSlots(): HTMLGxTabCaptionElement[] {
    return Array.from(
      this.element.querySelectorAll(":scope > [slot='caption']")
    );
  }

  private getPageSlots(): HTMLGxTabPageElement[] {
    return Array.from(this.element.querySelectorAll(":scope > [slot='page']"));
  }

  componentDidLoad() {
    makeHighlightable(this);
    this.linkCaptionsWithTabPages();
  }

  disconnectedCallback() {
    this.lastSelectedTabCaption = null;
  }

  render() {
    // Styling for gx-tab-caption control.
    const classes = getClasses(this.cssClass);

    return (
      <Host
        role="tablist"
        class={{
          [this.cssClass]: !!this.cssClass,
          [classes.vars]: true
        }}
      >
        <div class="gx-nav-tabs" part="nav-tabs">
          <div
            class={{
              "gx-nav-tabs-table": true,
              "gx-fixed-tabs": this.tabsDistribution === "fixed-size"
            }}
            part="nav-tabs-table"
          >
            <slot name="caption" />
            {this.tabsDistribution === "scroll" && (
              <div
                aria-hidden="true"
                class="gx-nav-tabs-table-filler"
                part="nav-tabs-table-filler"
              ></div>
            )}
          </div>
        </div>
        <div class="gx-tab-content" part="tab-content">
          <slot name="page" />
        </div>
      </Host>
    );
  }
}
