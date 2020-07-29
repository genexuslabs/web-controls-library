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

@Component({
  shadow: true,
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

  /**
   * Fired when the toggle button is clicked
   */
  @Event() toggleButtonClick: EventEmitter;

  private handleToggleButtonClick = (e: MouseEvent) => {
    this.toggleButtonClick.emit(e);
  };

  private handleActionToggleButtonClick = () => {
    this.showLowActions = !this.showLowActions;
  };

  private handleBodyClick = (e: MouseEvent) => {
    if (this.showLowActions) {
      const navbarToggleBtn = this.element.shadowRoot.querySelector(
        ".navbar-actions-toggle"
      );
      if (e.composedPath().find(el => el === navbarToggleBtn) === undefined) {
        this.showLowActions = false;
      }
    }
  };

  componentDidLoad() {
    document.body.addEventListener("click", this.handleBodyClick);
  }

  disconnectedCallback() {
    document.body.removeEventListener("click", this.handleBodyClick);
  }

  render() {
    return (
      <Host
        class={{
          "navbar-single-line": this.singleLine
        }}
      >
        <nav class="navbar">
          <div class="navbar-line navbar-line-1">
            {this.showToggleButton && (
              <button
                type="button"
                class="navbar-target-toggle navbar-icon-button"
                aria-label={this.toggleButtonLabel}
                onClick={this.handleToggleButtonClick}
              >
                <gx-icon type="burger"></gx-icon>
              </button>
            )}
            <a class="navbar-header" tabindex="-1">
              <slot name="header" />
              {this.caption}
            </a>
            <div class="navbar-links">
              <slot />
            </div>
            {this.singleLine && this.renderActions()}
          </div>
          {!this.singleLine && (
            <div class="navbar-line navbar-line-2">
              {this.showBackButton && (
                <button type="button" class="navbar-back-button">
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
    const hasHighPriorityActions = this.hasActionsByType("high");
    const hasLowPriorityActions = this.hasActionsByType("low");

    return [
      <div class="navbar-actions">
        <div class="navbar-actions-high">
          <slot name="high-priority-action" />
        </div>
        <div
          class={{
            "navbar-actions-normal": true,
            "navbar-actions-normal--separator": hasHighPriorityActions
          }}
        >
          <slot name="normal-priority-action" />
        </div>
        <div
          class={{
            "navbar-actions-low": true,
            "navbar-actions-low--active": this.showLowActions
          }}
        >
          <slot name="low-priority-action" />
        </div>
      </div>,
      hasLowPriorityActions && (
        <button
          type="button"
          aria-label={this.actionToggleButtonLabel}
          class={{
            "navbar-icon-button": true,
            "navbar-actions-toggle": true,
            "navbar-actions-toggle--active": this.showLowActions
          }}
          onClick={this.handleActionToggleButtonClick}
        >
          <gx-icon type="show-more"></gx-icon>
        </button>
      )
    ];
  }

  private hasActionsByType(type: string): boolean {
    return (
      this.element.querySelector(`[slot='${type}-priority-action']`) !== null
    );
  }
}
