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
import { Component as GxComponent } from "../common/interfaces";
import { watchForItems } from "../common/watch-items";

@Component({
  shadow: false,
  styleUrl: "navbar.scss",
  tag: "gx-navbar"
})
export class NavBar implements GxComponent {
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
   * This attribute lets you specify if one or two lines will be used to render the navigation bar.
   * Useful when there are links and also actions, to have links in the first line, and actions in the second
   */
  @Prop() readonly singleLine = true;

  /**
   * True to show the back button
   */
  @Prop() readonly showBackButton: false;

  @State() showLowActions = false;

  /**
   * True to show the left target toggle button (a burger icon)
   */
  @Prop() readonly showToggleButton: false;

  /**
   * This attribute lets you specify the label for the left target toggle button. Important for accessibility.
   */
  @Prop() readonly toggleButtonLabel: string;

  @State() hasHighPriorityActions = false;

  @State() hasNormalPriorityActions = false;

  @State() hasLowPriorityActions = false;

  /**
   * Fired when the toggle button is clicked
   */
  @Event() toggleButtonClick: EventEmitter;

  /**
   * Fired when the back button is clicked
   */
  @Event() backButtonClick: EventEmitter;

  private watchForItemsObserver: MutationObserver;

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
      const navbarToggleBtn = this.element.querySelector(
        ".gx-navbar-actions-toggle"
      );
      if (e.composedPath().find(el => el === navbarToggleBtn) === undefined) {
        this.showLowActions = false;
      }
    }
  };

  componentDidLoad() {
    document.body.addEventListener("click", this.handleBodyClick);
    this.watchForItemsObserver = watchForItems(
      this.element,
      "gx-navbar-item",
      () => this.checkChildActions()
    );
  }

  disconnectedCallback() {
    document.body.removeEventListener("click", this.handleBodyClick);
    if (this.watchForItemsObserver !== undefined) {
      this.watchForItemsObserver.disconnect();
      this.watchForItemsObserver = undefined;
    }
  }

  private checkChildActions() {
    this.hasHighPriorityActions = this.hasActionsByType("high");
    this.hasNormalPriorityActions = this.hasActionsByType("normal");
    this.hasLowPriorityActions = this.hasActionsByType("low");
  }

  render() {
    const navOnly = !this.showToggleButton && !this.hasActions();
    console.log(
      this.hasHighPriorityActions,
      this.hasNormalPriorityActions,
      this.hasLowPriorityActions
    );
    return (
      <Host
        class={{
          "navbar-single-line": this.singleLine,
          "navbar-nav-only": navOnly
        }}
      >
        <nav class="gx-navbar">
          <div class="gx-navbar-line gx-navbar-line-1">
            {this.showBackButton && this.singleLine && (
              <button
                type="button"
                class="gx-navbar-back-button gx-navbar-icon-button"
                aria-label={this.backButtonLabel}
                onClick={this.handleBackButtonClick}
              >
                <gx-icon type="arrow-left"></gx-icon>
              </button>
            )}
            {this.showToggleButton && (
              <button
                type="button"
                class="gx-navbar-target-toggle gx-navbar-icon-button"
                aria-label={this.toggleButtonLabel}
                onClick={this.handleToggleButtonClick}
              >
                <gx-icon type="burger"></gx-icon>
              </button>
            )}
            <a class="gx-navbar-header" tabindex="-1">
              <slot name="header" />
              {this.caption}
            </a>
            <div class="gx-navbar-links">
              <slot name="navigation" />
            </div>
            {this.singleLine && this.renderActions()}
          </div>
          {!this.singleLine && (
            <div class="gx-navbar-line gx-navbar-line-2">
              {this.showBackButton && (
                <button
                  type="button"
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
    return [
      <div class="gx-navbar-actions">
        <div class="gx-navbar-actions-high">
          <slot name="high-priority-action" />
        </div>
        <div
          class={{
            "gx-navbar-actions-normal": true,
            "gx-navbar-actions-normal--separator":
              this.hasHighPriorityActions && this.hasNormalPriorityActions
          }}
        >
          <slot name="normal-priority-action" />
        </div>
        <div
          class={{
            "gx-navbar-actions-low": true,
            "gx-navbar-actions-low--active": this.showLowActions
          }}
        >
          <slot name="low-priority-action" />
        </div>
      </div>,
      this.hasLowPriorityActions && (
        <button
          type="button"
          aria-label={this.actionToggleButtonLabel}
          class={{
            "gx-navbar-icon-button": true,
            "gx-navbar-actions-toggle": true,
            "gx-navbar-actions-toggle--active": this.showLowActions
          }}
          onClick={this.handleActionToggleButtonClick}
        >
          <gx-icon type="show-more"></gx-icon>
        </button>
      )
    ];
  }

  private hasActionsByType(type: string): boolean {
    console.log(this.element.querySelector(`[slot='${type}-priority-action']`));
    return (
      this.element.querySelector(`[slot='${type}-priority-action']`) !== null
    );
  }

  private hasActions(): boolean {
    return (
      this.hasHighPriorityActions ||
      this.hasNormalPriorityActions ||
      this.hasLowPriorityActions
    );
  }
}
