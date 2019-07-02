import Popper from "popper.js";
import { IRenderer } from "../../../common/interfaces";
import { Card } from "../../../card/card";

export class CardRender implements IRenderer {
  constructor(public component: Card) {}

  private bodyClickHandler;

  private popper;

  private handleDropDownToggleClick(evt) {
    const dropDownMenu = this.component.element.querySelector(".dropdown-menu");
    dropDownMenu.classList.toggle("show");
    const toggleButton = evt.target;

    if (this.popper) {
      this.popper.destroy();
    }
    this.popper = new Popper(toggleButton, dropDownMenu, {
      placement: "bottom-start"
    });

    this.bodyClickHandler = bodyClickEvt => {
      const target: HTMLElement = bodyClickEvt.target as HTMLElement;

      if (target === toggleButton) {
        return;
      }

      dropDownMenu.classList.remove("show");
    };

    setTimeout(() => {
      document.body.addEventListener("click", this.bodyClickHandler, {
        once: true
      });
    }, 10);
  }

  componentDidUnload() {
    if (this.bodyClickHandler) {
      document.body.removeEventListener("click", this.bodyClickHandler);
    }
    if (this.popper) {
      this.popper.destroy();
    }
  }

  componentDidLoad() {
    this.toggleHeaderFooterVisibility();
  }

  componentDidUpdate() {
    this.toggleHeaderFooterVisibility();
  }

  private toggleHeaderFooterVisibility() {
    const card = this.component;

    const cardHeader = card.element.querySelector(
      ":scope > .card > .card-header"
    ) as HTMLElement;
    const cardFooter = card.element.querySelector(
      ":scope > .card > .card-footer"
    ) as HTMLElement;

    const lowPriorityActions = cardFooter
      ? Array.from(cardFooter.querySelectorAll("[slot='low-priority-action']"))
      : [];

    const highPriorityActions = cardHeader
      ? Array.from(cardHeader.querySelectorAll("[slot='high-priority-action']"))
      : [];

    const normalPriorityActions = cardFooter
      ? Array.from(
          cardFooter.querySelectorAll("[slot='normal-priority-action']")
        )
      : [];

    const buttonActions = [...highPriorityActions, ...normalPriorityActions];
    buttonActions.forEach((btn: any) => (btn.size = "small"));

    lowPriorityActions.forEach((action: any) => {
      if (action.cssClass && action.cssClass.indexOf("dropdown-item") >= 0) {
        return;
      }

      action.cssClass = (action.cssClass || "") + " dropdown-item";
    });

    const hasLowPriorityActions = lowPriorityActions.length > 0;

    const hasFooterActions =
      hasLowPriorityActions || normalPriorityActions.length > 0;

    const hasHeaderActions = highPriorityActions.length > 0;

    const renderHeader =
      hasHeaderActions ||
      (cardHeader && !!cardHeader.querySelector("[slot='header']"));

    const renderFooter =
      hasFooterActions ||
      (cardFooter && !!cardFooter.querySelector("[slot='footer']"));

    if (cardHeader) {
      cardHeader.hidden = !(renderHeader && this.component.showHeader);
    }
    if (cardFooter) {
      cardFooter.hidden = !(renderFooter && this.component.showFooter);
    }
  }

  render() {
    const card = this.component;

    const lowPriorityActions = Array.from(
      card.element.querySelectorAll("[slot='low-priority-action']")
    );

    const highPriorityActions = Array.from(
      card.element.querySelectorAll("[slot='high-priority-action']")
    );

    const normalPriorityActions = Array.from(
      card.element.querySelectorAll("[slot='normal-priority-action']")
    );

    const buttonActions = [...highPriorityActions, ...normalPriorityActions];
    buttonActions.forEach((btn: any) => (btn.size = "small"));

    lowPriorityActions.forEach((action: any) => {
      if (action.cssClass && action.cssClass.indexOf("dropdown-item") >= 0) {
        return;
      }

      action.cssClass = (action.cssClass || "") + " dropdown-item";
    });

    const hasLowPriorityActions = lowPriorityActions.length > 0;

    const hasFooterActions = hasLowPriorityActions || !!normalPriorityActions;

    const renderFooter =
      hasFooterActions || !!card.element.querySelector("[slot='footer']");

    return [
      <gx-bootstrap />,
      <div class="card">
        <div class="card-header">
          <slot name="header" />
          <div class="float-right">
            <slot name="high-priority-action" />
          </div>
        </div>
        <slot name="body" />
        <slot />
        {renderFooter && (
          <div class="card-footer">
            <slot name="footer" />
            {hasFooterActions && (
              <div class="float-right">
                <slot name="normal-priority-action" />
                {hasLowPriorityActions && (
                  <button
                    class="btn btn-sm gx-dropdown-toggle"
                    type="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    aria-label="More actions"
                    onClick={this.handleDropDownToggleClick.bind(this)}
                  />
                )}
                {hasLowPriorityActions && (
                  <div class="dropdown-menu">
                    <slot name="low-priority-action" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    ];
  }
}
