import {
  Component,
  Host,
  h,
  Prop,
  Element,
  Listen,
  Watch,
  Event,
  EventEmitter,
} from "@stencil/core";
import { MenuActionActiveEvent } from "../dynamic-menu-action/dynamic-menu-action";

const ENTER_KEY_CODE = "Enter";
const ESCAPE_KEY_CODE = "Escape";
const SPACE_KEY_CODE = "Space";
const ARROWUP_KEY_CODE = "ArrowUp";
const ARROWLEFT_KEY_CODE = "ArrowLeft";
const ARROWDOWN_KEY_CODE = "ArrowDown";
const ARROWRIGHT_KEY_CODE = "ArrowRight";
const HOME_KEY_CODE = "Home";
const END_KEY_CODE = "End";

/**
 * @part menu-content - The container of dynamic-menu.
 *
 * @slot menuitems - The slot where live the menu actions.
 * @slot menupopup - The slot where live the menu popups.
 */
@Component({
  tag: "gx-dynamic-menu",
  styleUrl: "dynamic-menu.scss",
  shadow: true,
})
export class DynamicMenu {
  private menuActions: HTMLDynamicMenuActionElement[] = [];
  private menuPopups: HTMLDynamicMenuPopupElement[] = [];
  private openIndex: number = null;

  @Element() el: HTMLDynamicMenuElement;

  /**
   * A CSS class to set as the `dynamic-menu` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute specifies which must be open by default.
   */
  @Prop({ mutable: true }) openItem: string;

  @Watch("openItem")
  watchPropOpenItemHandler(newValue: string) {
    let targetActionIndex: number = null;
    this.menuActions.forEach(
      (action: HTMLDynamicMenuActionElement, ind: number) => {
        if (targetActionIndex === null && action.actionId === newValue)
          targetActionIndex = ind;
      }
    );
    if (targetActionIndex !== null) {
      // Close the action open
      this.closeOpenAction(false);
      this.toggleExpand(this.openIndex, false);

      this.openIndex = targetActionIndex;
      this.menuActions[targetActionIndex].deactivated = false;
      this.toggleExpand(targetActionIndex, true);
      this.menuActions[targetActionIndex].focus();
    }
  }

  /**
   * Fired when the menu container is opened or closed.
   */
  @Event({
    eventName: "dynamicMenuActivated",
    bubbles: true,
  })
  dynamicMenuActivated: EventEmitter<DynamicMenuActivatedEvent>;

  componentWillLoad() {
    const actions: any = this.el.querySelectorAll("dynamic-menu-action");
    this.menuActions = [...actions];
    window.addEventListener("click", this.onBlur);
  }

  componentDidLoad() {
    this.menuActions.forEach((action) => {
      // handle action + popup
      if (action.hasAttribute("aria-controls")) {
        const popup: HTMLDynamicMenuPopupElement = this.el.querySelector(
          `dynamic-menu-popup#${action.getAttribute("aria-controls")}`
        );
        if (popup !== null && popup !== undefined) {
          // save ref controlled popup
          this.menuPopups.push(popup);

          // collapse popup
          this.activateMenuPopup(popup, false);
        }
      }
    });
  }

  @Listen("menuActionActivated")
  handleActionActivated(event: CustomEvent<MenuActionActiveEvent>) {
    const actionIndex = this.menuActions.indexOf(event.detail.item);
    this.toggleExpand(actionIndex, event.detail.active);
    this.menuActions[actionIndex].deactivated = !event.detail.active;
  }

  /**
   * Listen when a KeyboardEvent is captured for some menu action, and manage what doing for some keys.
   * Space, Enter: Activates the menu action.
   * Esc: deactivated menu action if is active and close the popup open if correspond.
   * ArrowUp, ArrowDown, ArrowLeft, ArrowRight: Navigate for the menu actions, putting them focused.
   * Home, End: Navigate to the first or last menu action.
   */
  @Listen("menuActionKeyDown")
  handleActionKeyDown(event: CustomEvent<KeyboardEvent>) {
    const keyboardEvent = event.detail;
    const targetActionIndex = this.menuActions.indexOf(
      document.activeElement as HTMLDynamicMenuActionElement
    );

    // close on escape
    if (keyboardEvent.code === ESCAPE_KEY_CODE) {
      keyboardEvent.preventDefault();
      this.menuActions[targetActionIndex].deactivated = true;
      this.toggleExpand(this.openIndex, false);
    } else if (
      keyboardEvent.code === SPACE_KEY_CODE ||
      keyboardEvent.code === ENTER_KEY_CODE
    ) {
      keyboardEvent.preventDefault();
      this.menuActions[targetActionIndex].deactivated =
        this.openIndex === targetActionIndex;
      this.toggleExpand(
        targetActionIndex,
        this.openIndex !== targetActionIndex
      );
    } else {
      this.controlFocusByKey(keyboardEvent, targetActionIndex);
    }
  }

  private onBlur = (event: PointerEvent) => {
    const menuContainsFocus = this.el.contains(
      event.relatedTarget as HTMLElement
    );
    if (!menuContainsFocus && this.openIndex !== null) {
      this.closeOpenAction();
      this.toggleExpand(this.openIndex, false);
    }
  };

  toggleExpand(index: number, expanded: boolean) {
    // close open menu, if applicable
    if (this.openIndex !== index) {
      this.closeOpenAction();
      this.toggleExpand(this.openIndex, false);
    }

    // handle menu at called index
    if (
      this.menuActions[index] !== null &&
      this.menuActions[index] !== undefined
    ) {
      this.openIndex = expanded ? index : null;
      this.activateMenuPopup(this.menuPopups[index], expanded);
      this.dynamicMenuActivated.emit({
        item: this.menuActions[index].actionId,
        active: expanded,
      });
    }
  }

  closeOpenAction(setItem = true) {
    if (this.openIndex !== null)
      this.menuActions[this.openIndex].deactivated = true;
    if (setItem) this.openItem = null;
  }

  activateMenuPopup(popupItem: HTMLDynamicMenuPopupElement, open: boolean) {
    if (popupItem !== null && popupItem !== undefined) {
      popupItem.opened = open;
    }
  }

  controlFocusByKey(keyboardEvent: KeyboardEvent, currentIndex: number) {
    switch (keyboardEvent.code) {
      case ARROWUP_KEY_CODE:
      case ARROWLEFT_KEY_CODE:
        keyboardEvent.preventDefault();
        if (currentIndex > -1) {
          const prevIndex = Math.max(0, currentIndex - 1);
          this.menuActions[prevIndex].focus();
        }
        break;
      case ARROWDOWN_KEY_CODE:
      case ARROWRIGHT_KEY_CODE:
        keyboardEvent.preventDefault();
        if (currentIndex > -1) {
          const nextIndex = Math.min(
            this.menuActions.length - 1,
            currentIndex + 1
          );
          this.menuActions[nextIndex].focus();
        }
        break;
      case HOME_KEY_CODE:
        keyboardEvent.preventDefault();
        this.menuActions[0].focus();
        break;
      case END_KEY_CODE:
        keyboardEvent.preventDefault();
        this.menuActions[this.menuActions.length - 1].focus();
        break;
    }
  }

  private stopPropagation = (e: UIEvent) => {
    e.stopPropagation();
  };

  render() {
    return (
      <Host
        class={{
          [this.cssClass]: !!this.cssClass,
        }}
      >
        <div class="menu-content" part="menu-content">
          <slot name="menuitems"></slot>
          <div class="menu-popup" onClick={this.stopPropagation}>
            <slot name="menupopup"></slot>
          </div>
        </div>
      </Host>
    );
  }
}

export interface DynamicMenuActivatedEvent {
  item: string;
  active: boolean;
}
