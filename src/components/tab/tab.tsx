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
  HighlightableComponent,
  makeHighlightable
} from "../common/highlightable";
import { Component as GxComponent } from "../common/interfaces";

import {
  AccessibleNameByComponent,
  AccessibleNameComponent
} from "../../common/interfaces";

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
  implements
    GxComponent,
    AccessibleNameByComponent,
    AccessibleNameComponent,
    HighlightableComponent
{
  /**
   * `true` if the `componentDidLoad()` method was called
   */
  private didLoad = false;

  /**
   *  - Input: Caption Id
   *  - Output: Corresponding tabPage element
   */
  private captionToPage = new Map<string, HTMLGxTabPageElement>();

  // Refs
  private lastSelectedTabCaption: HTMLGxTabCaptionElement;
  private lastSelectedTabPage: HTMLGxTabPageElement;

  @Element() element: HTMLGxTabElement;

  /**
   * Specifies the accessible name property value by providing the ID of the
   * HTMLElement that has the accessible name text.
   */
  @Prop() readonly accessibleNameBy: string;

  /**
   * Specifies a short string, typically 1 to 3 words, that authors associate
   * with an element to provide users of assistive technologies with a label
   * for the element.
   */
  @Prop() readonly accessibleName: string;

  /**
   * A CSS class to set as the `gx-tab` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * True to highlight control when an action is fired.
   */
  @Prop() readonly highlightable: boolean = false;

  /**
   * Defines how the tabs will be distributed in the Strip.
   *
   * | Value        | Details                                                                            |
   * | ------------ | ---------------------------------------------------------------------------------- |
   * | `scroll`     | Allows scrolling the tab control when the number of tabs exceeds the screen width. |
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
      tabCaptionElement === this.lastSelectedTabCaption
    ) {
      return;
    }
    this.setSelectedTab(tabCaptionElement);

    this.tabChange.emit(event);
  }

  private setSelectedTab(selectedTabCaption: HTMLGxTabCaptionElement) {
    // Unselect last tabCaption and tabPage elements
    this.lastSelectedTabCaption.selected = false;
    this.lastSelectedTabPage.selected = false;

    // Update last tabCaption and tabPage elements
    this.lastSelectedTabCaption = selectedTabCaption;
    this.lastSelectedTabPage = this.captionToPage.get(selectedTabCaption.id);

    // Select new tabCaption and tabPage elements
    this.lastSelectedTabCaption.selected = true;
    this.lastSelectedTabPage.selected = true;
  }

  private linkCaptionsWithTabPages = () => {
    if (!this.didLoad) {
      return;
    }

    const captionSlots = this.getCaptionSlots();
    const pageSlots = this.getPageSlots();

    if (captionSlots.length !== pageSlots.length) {
      return;
    }

    captionSlots.forEach((captionElement, i) => {
      const pageElement = pageSlots[i];

      captionElement.setAttribute("aria-controls", pageElement.id);
      pageElement.setAttribute("aria-labelledby", captionElement.id);

      this.captionToPage.set(captionElement.id, pageElement);

      // Determine which tab page is selected
      if (captionElement.selected) {
        this.lastSelectedTabCaption = captionElement;
        this.lastSelectedTabPage = pageElement;

        this.lastSelectedTabPage.selected = true;
      }
    });
  };

  private getCaptionSlots(): HTMLGxTabCaptionElement[] {
    return Array.from(
      this.element.querySelectorAll(":scope > [slot='caption']")
    );
  }

  private getPageSlots(): HTMLGxTabPageElement[] {
    return Array.from(this.element.querySelectorAll(":scope > [slot='page']"));
  }

  componentDidLoad() {
    this.didLoad = true;

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
        aria-label={this.accessibleName}
        aria-labelledby={this.accessibleNameBy}
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
          <slot name="page" onSlotchange={this.linkCaptionsWithTabPages} />
        </div>
      </Host>
    );
  }
}
