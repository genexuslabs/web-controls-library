import { Component, Element, Prop, h, Host, State } from "@stencil/core";
import {
  Component as GxComponent,
  CustomizableComponent
} from "../common/interfaces";

const actionSelector = (priority: string) =>
  `:scope > [slot='${priority}-priority-action']`;

const CARD_DROPDOWN = "dropdown";

/**
 * @part list-of-actions - The container for the list of actions.
 * @part low-actions-dropdown - The dropdown displayed on the right side of the control when clicking the "show more" button (`"low-actions-toggle"` part).
 * @part low-actions-toggle - The "show more" button displayed on the right side of the control when the navbar has low priority actions.
 * @part nav - The `<nav>` container of the control. It contains the container for the list of actions (`"list-of-actions"` part).

 * @slot high-priority-action - This slot will be rendered as a high priority action of the card-header. High priority actions are rendered left aligned.
 * @slot low-priority-action - This slot will be rendered as a low priority action of the card-header. Low priority actions are rendered inside a right aligned drop down.
 * @slot normal-priority-action - This slot will be rendered as a normal priority action of the card-header. Normal priority actions are rendered right aligned.
 */
@Component({
  shadow: true,
  styleUrl: "card-header.scss",
  tag: "gx-card-header"
})
export class CardHeader implements GxComponent, CustomizableComponent {
  private hasHighPriorityActions: boolean;
  private hasNormalPriorityActions: boolean;
  private hasLowPriorityActions: boolean;

  // Refs
  private lowActionsToggleButton: HTMLButtonElement;

  @Element() element: HTMLGxCardHeaderElement;

  @State() showLowActions = false;

  /**
   * This attribute lets you specify the label for the low priority actions
   * toggle button. Important for accessibility.
   */
  @Prop() readonly actionToggleButtonLabel: string;

  /**
   * A CSS class to set for the header and footer element classes of the
   * `gx-card` control.
   */
  @Prop() readonly cssClass: string;

  componentWillLoad() {
    this.hasHighPriorityActions = this.checkIfTheCardHasActions(
      actionSelector("high")
    );

    this.hasNormalPriorityActions = this.checkIfTheCardHasActions(
      actionSelector("normal")
    );

    this.hasLowPriorityActions = this.checkIfTheCardHasActions(
      actionSelector("low")
    );
  }

  componentDidLoad() {
    if (this.hasLowPriorityActions) {
      document.body.addEventListener("click", this.handleBodyClick);
    }
  }

  disconnectedCallback() {
    if (this.hasLowPriorityActions) {
      document.body.removeEventListener("click", this.handleBodyClick);
    }
  }

  /**
   * Check if the card has actions.
   * @param actionsSelector A selector for card action elements.
   * @returns `true` if the card has at least one action in the selector `actionsSelector`.
   */
  private checkIfTheCardHasActions(actionsSelector: string): boolean {
    return this.element.querySelectorAll(actionsSelector).length > 0;
  }

  private handleBodyClick = (event: MouseEvent) => {
    if (!this.showLowActions) {
      return;
    }

    // If the click was not performed in the toggle button, close the dropdown
    if (
      event.composedPath().find(el => el === this.lowActionsToggleButton) ===
      undefined
    ) {
      this.showLowActions = false;
    }
  };

  private handleActionToggleButtonClick = () => {
    this.showLowActions = !this.showLowActions;
  };

  render() {
    return (
      <Host
        role="banner"
        class={{
          [this.cssClass]: !!this.cssClass,
          "gx-navbar-actions-active": this.showLowActions
        }}
      >
        <nav class="nav" part="nav">
          <ul class="list-of-actions" part="list-of-actions">
            {this.hasHighPriorityActions && (
              <slot name="high-priority-action" />
            )}

            {this.hasHighPriorityActions && this.hasNormalPriorityActions && (
              <hr class="actions-separator" aria-orientation="vertical" />
            )}

            {this.hasNormalPriorityActions && (
              <slot name="normal-priority-action" />
            )}

            {this.hasLowPriorityActions && (
              // The listitem role is a WA to avoid a browser bug when setting
              // "display: contents" on elements. Without the role, the element
              // would be removed from the accessibility tree
              <li role="listitem" class="low-actions-container">
                <button
                  aria-controls={CARD_DROPDOWN}
                  aria-expanded={this.showLowActions.toString()}
                  aria-label={this.actionToggleButtonLabel}
                  type="button"
                  class={{
                    "low-actions-toggle": true,
                    "low-actions-toggle--active": this.showLowActions
                  }}
                  part="low-actions-toggle"
                  onClick={this.handleActionToggleButtonClick}
                  ref={el =>
                    (this.lowActionsToggleButton = el as HTMLButtonElement)
                  }
                >
                  <gx-icon type="show-more" aria-hidden="true"></gx-icon>
                </button>

                <ul
                  id={CARD_DROPDOWN}
                  class="dropdown"
                  part="low-actions-dropdown"
                  hidden={!this.showLowActions}
                >
                  <slot name="low-priority-action" />
                </ul>
              </li>
            )}
          </ul>
        </nav>
      </Host>
    );
  }
}
