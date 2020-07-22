import { Component, Element, Prop, h, Host } from "@stencil/core";
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
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
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

  /**
   * True to show the left target toggle button (a burger icon)
   */
  @Prop() readonly showToggleButton: false;

  /**
   * This attribute lets you specify the label for the left target toggle button. Important for accessibility.
   */
  @Prop() readonly toggleButtonLabel: string;

  render() {
    const hasLowPriorityActions =
      document.querySelector("[slot='low-priority-action']") !== null;

    return (
      <Host>
        <nav class="nav">
          <div class="navbar-line navbar-line-1">
            {this.showToggleButton && (
              <button
                type="button"
                class="navbar-target-toggle"
                aria-label={this.toggleButtonLabel}
              >
                <gx-icon type="burger" color="white"></gx-icon>
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
            {hasLowPriorityActions && (
              <button
                type="button"
                aria-label={this.actionToggleButtonLabel}
                class="navbar-actions-toggle"
              ></button>
            )}
          </div>
          {!this.singleLine && (
            <div class="navbar-line navbar-line-2">
              {this.showBackButton && (
                <button type="button" class="navbar-back-button">
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
      <div class="navbar-actions-high">
        <slot name="high-priority-action" />
      </div>,
      <div class="navbar-actions-normal">
        <slot name="normal-priority-action" />
      </div>,
      <div class="navbar-actions-low">
        <slot name="low-priority-action" />
      </div>
    ];
  }
}
