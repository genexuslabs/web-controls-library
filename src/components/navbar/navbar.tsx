import {
  Component,
  Element,
  Prop,
  h,
  Host,
  Event,
  EventEmitter,
  State
} from "@stencil/core";
import { Component as GxComponent, LayoutSize } from "../common/interfaces";
import { watchForItems } from "../common/watch-items";

// Class transforms
import { getClasses } from "../common/css-transforms/css-transforms";
import {
  attachHorizontalScrollWithDragHandler,
  attachHorizontalScrollWithWheelHandler
} from "../common/utils";

/**
 * @part back-button - The back button displayed on the left side of the control.
 * @part default-button - The toggle button displayed on the left side of the control.
 * @part low-actions-dropdown - The dropdown displayed on the right side of the control when clicking the "show more" button ("low-actions-toggle" part).
 * @part low-actions-toggle - The "show more" button displayed on the right side of the control when the navbar has low priority actions.
 */
@Component({
  shadow: true,
  styleUrl: "navbar.scss",
  tag: "gx-navbar"
})
export class NavBar implements GxComponent {
  // Observers
  private watchForItemsObserver: MutationObserver;

  private isTopPosition: boolean;

  // Refs
  private navbarLinks: HTMLDivElement;
  private navbarActionsHigh: HTMLDivElement;
  private navbarActionsNormal: HTMLDivElement;

  @Element() element: HTMLGxNavbarElement;

  /**
   * This attribute lets you specify the label for the low priority actions toggle button. Important for accessibility.
   */
  @Prop() readonly actionToggleButtonLabel: string;

  /**
   * This attribute lets you specify the label for the back button.
   */
  @Prop() readonly backButtonLabel: string;

  /**
   * This attribute lets you specify an optional title for the navigation bar
   */
  @Prop() readonly caption: string;

  /**
   * A CSS class to set as the `gx-navbar` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the header row pattern is enabled.
   * If enabled, the control will switch between the `cssClass` and
   * `headerRowPatternCssClass` classes depending on the value of the
   * `showHeaderRowPatternClass` property.
   * This property only works when `position="top"`.
   */
  @Prop() readonly enableHeaderRowPattern: boolean = false;

  /**
   * A CSS class to set as the `gx-navbar` element class when using the header row pattern.
   */
  @Prop() readonly headerRowPatternCssClass: string;

  /**
   * This attribute lets you specify the layout size of the application.
   * Each layout size will set different behaviors in the gx-layout control.
   */
  @Prop() readonly layoutSize: LayoutSize = "large";

  /**
   * `true` if the left target of the gx-layout is visible in the application.
   */
  @Prop() readonly leftTargetVisible: boolean = false;

  /**
   * This attribute lets you specify the position of the navbar in the
   * viewport.
   * If `position = "top"` the navbar will be placed normally at the top of the
   * viewport.
   * If `position = "bottom"` the navbar will be placed at the bottom of the
   * viewport. This position of navbar is used to show navigation links.
   */
  @Prop() readonly position: "top" | "bottom" = "top";

  /**
   * `true` if the right target of the gx-layout is visible in the application.
   */
  @Prop() readonly rightTargetVisible: boolean = false;

  /**
   * True to show the back button
   */
  @Prop() readonly showBackButton: boolean = false;

  /**
   * True to use the `headerRowPatternCssClass` property as the `gx-navbar`
   * element class. False to use the `cssClass` property instead.
   */
  @Prop() readonly showHeaderRowPatternClass: boolean = false;

  /**
   * True to show the left target toggle button (a burger icon)
   */
  @Prop() readonly showToggleButton: false;

  /**
   * This attribute lets you specify if one or two lines will be used to render the navigation bar.
   * Useful when there are links and also actions, to have links in the first line, and actions in the second
   */
  @Prop() readonly singleLine = true;

  /**
   * This attribute lets you specify the label for the left target toggle button. Important for accessibility.
   */
  @Prop() readonly toggleButtonLabel: string;

  @State() hasHighPriorityActions = false;

  @State() hasNormalPriorityActions = false;

  @State() hasLowPriorityActions = false;

  @State() showLowActions = false;

  /**
   * Fired when the toggle button is clicked
   */
  @Event() toggleButtonClick: EventEmitter;

  /**
   * Fired when the back button is clicked
   */
  @Event() backButtonClick: EventEmitter;

  private handleToggleButtonClick = (e: MouseEvent) => {
    this.toggleButtonClick.emit(e);
  };

  private handleBackButtonClick = (e: MouseEvent) => {
    this.backButtonClick.emit(e);
  };

  private handleActionToggleButtonClick = () => {
    this.showLowActions = !this.showLowActions;
  };

  private handleBodyClick = (e: MouseEvent) => {
    if (this.showLowActions) {
      const navbarToggleBtn = this.element.shadowRoot.querySelector(
        ".gx-navbar-actions-low-toggle"
      );
      if (e.composedPath().find(el => el === navbarToggleBtn) === undefined) {
        this.showLowActions = false;
      }
    }
  };

  /*  Before the first render, we store some results that will not change at
      runtime.
  */
  componentWillLoad() {
    this.isTopPosition = this.position === "top";
  }

  componentDidLoad() {
    document.body.addEventListener("click", this.handleBodyClick);

    // - - - - - - - - - -   Observers   - - - - - - - - - -
    this.watchForItemsObserver = watchForItems(
      this.element,
      "gx-navbar-item",
      () => this.checkChildActions()
    );

    // - - - - - - - - - -   HANDLERS   - - - - - - - - - -
    attachHorizontalScrollWithDragHandler(this.navbarLinks);
    attachHorizontalScrollWithWheelHandler(this.navbarLinks);

    if (this.isTopPosition) {
      attachHorizontalScrollWithDragHandler(this.navbarActionsHigh);
      attachHorizontalScrollWithDragHandler(this.navbarActionsNormal);

      attachHorizontalScrollWithWheelHandler(this.navbarActionsHigh);
      attachHorizontalScrollWithWheelHandler(this.navbarActionsNormal);
    }
  }

  disconnectedCallback() {
    document.body.removeEventListener("click", this.handleBodyClick);

    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (this.watchForItemsObserver) {
      this.watchForItemsObserver.disconnect();
      this.watchForItemsObserver = undefined;
    }

    this.navbarLinks = null;
    this.navbarActionsHigh = null;
    this.navbarActionsNormal = null;
  }

  private checkChildActions() {
    this.hasHighPriorityActions = this.hasActionsByType("high");
    this.hasNormalPriorityActions = this.hasActionsByType("normal");
    this.hasLowPriorityActions = this.hasActionsByType("low");
  }

  render() {
    const isHeaderRowPatternEnabled =
      this.isTopPosition && this.enableHeaderRowPattern;

    //  Styling for gx-navbar control.
    const currentClass =
      isHeaderRowPatternEnabled && this.showHeaderRowPatternClass
        ? this.headerRowPatternCssClass
        : this.cssClass;
    const classes = getClasses(currentClass);

    let amountOfActionTypes = 0;

    if (this.hasHighPriorityActions) {
      amountOfActionTypes++;
    }
    if (this.hasNormalPriorityActions) {
      amountOfActionTypes++;
    }

    // Layout size variables to add classes
    const leftTargetVisible =
      isHeaderRowPatternEnabled &&
      this.leftTargetVisible &&
      this.layoutSize === "large";

    const rightTargetVisible =
      isHeaderRowPatternEnabled &&
      this.rightTargetVisible &&
      this.layoutSize === "large";

    const smallLayoutSize = this.isTopPosition && this.layoutSize === "small";
    const notSmallLayoutSize =
      this.isTopPosition && this.layoutSize !== "small";

    return (
      <Host
        class={{
          [currentClass]: !!currentClass,
          [classes.vars]: true,
          "gx-navbar-actions-active": this.showLowActions,
          "gx-navbar-header-row-pattern": isHeaderRowPatternEnabled,

          // Adjust gx-navbar's position when HRP is on, the layout size is
          // "large" and gx-layout vertical targets are visible
          "left-target-visible": leftTargetVisible,
          "right-target-visible": rightTargetVisible,

          "not-small-layout-size": notSmallLayoutSize,
          "small-layout-size": smallLayoutSize
        }}
      >
        <nav class="gx-navbar">
          <div
            class={{
              "gx-navbar-line": true,
              "gx-navbar-line-1": true,
              [`gx-navbar-${amountOfActionTypes}-action-types-low-action`]:
                this.isTopPosition && this.hasLowPriorityActions,
              [`gx-navbar-${amountOfActionTypes}-action-types`]:
                this.isTopPosition && !this.hasLowPriorityActions
            }}
          >
            {this.isTopPosition && (
              <div class="gx-navbar-left-side-container">
                {this.showBackButton && this.singleLine && (
                  <button
                    key="back-button"
                    type="button"
                    part="back-button"
                    class="gx-navbar-back-button"
                    aria-label={this.backButtonLabel}
                    onClick={this.handleBackButtonClick}
                  >
                    <gx-icon type="arrow-left"></gx-icon>
                  </button>
                )}
                {this.showToggleButton && (
                  <button
                    key="toggle-button"
                    type="button"
                    part="default-button"
                    class="gx-navbar-toggle-button"
                    aria-label={this.toggleButtonLabel}
                    onClick={this.handleToggleButtonClick}
                  >
                    <gx-icon type="burger"></gx-icon>
                  </button>
                )}
                <a class="gx-navbar-caption" tabindex="-1">
                  <slot name="header" />
                  {this.caption}
                </a>
              </div>
            )}

            <div
              class="gx-navbar-links"
              ref={el => (this.navbarLinks = el as HTMLDivElement)}
            >
              <slot name="navigation" />
            </div>

            {this.isTopPosition && this.singleLine && this.renderActions()}
          </div>

          {this.isTopPosition && !this.singleLine && (
            <div class="gx-navbar-line gx-navbar-line-2">
              {this.showBackButton && (
                <button
                  type="button"
                  part="back-button"
                  class="gx-navbar-back-button"
                  onClick={this.handleBackButtonClick}
                >
                  <gx-icon type="arrow-left"></gx-icon>
                  {this.backButtonLabel}
                </button>
              )}
              {this.renderActions()}
            </div>
          )}
        </nav>
      </Host>
    );
  }

  private renderActions() {
    const shouldDisplayActionsSeparator =
      this.hasHighPriorityActions && this.hasNormalPriorityActions;

    return [
      <div class="gx-navbar-actions">
        <div
          class="gx-navbar-actions-high"
          ref={el => (this.navbarActionsHigh = el as HTMLDivElement)}
        >
          <slot name="high-priority-action" />
        </div>

        {shouldDisplayActionsSeparator && (
          <span class="gx-navbar-actions--separator" />
        )}

        <div
          class="gx-navbar-actions-normal"
          ref={el => (this.navbarActionsNormal = el as HTMLDivElement)}
        >
          <slot name="normal-priority-action" />
        </div>
      </div>,

      this.hasLowPriorityActions && (
        <div class="gx-navbar-actions-low">
          <div
            part="low-actions-dropdown"
            class={{
              "gx-navbar-actions-low-popup": true,
              "gx-navbar-actions-low-popup--active": this.showLowActions
            }}
          >
            <slot name="low-priority-action" />
          </div>
          <button
            type="button"
            aria-label={this.actionToggleButtonLabel}
            part="low-actions-toggle"
            class={{
              "gx-navbar-actions-low-toggle": true,
              "gx-navbar-actions-low-toggle--active": this.showLowActions
            }}
            onClick={this.handleActionToggleButtonClick}
          >
            <gx-icon type="show-more"></gx-icon>
          </button>
        </div>
      )
    ];
  }

  private hasActionsByType(type: string): boolean {
    return (
      this.element.querySelector(`[slot='${type}-priority-action']`) !== null
    );
  }
}
