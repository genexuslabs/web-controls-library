import {
  Component,
  Host,
  h,
  Element,
  Prop,
  Watch,
  Listen
} from "@stencil/core";
import {
  ActionGroupItemKeyDownEvent,
  ActionGroupItemTargetEvent
} from "../action-group-item/action-group-item";

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
 * @slot - The slot where you can put the actions items.
 */
@Component({
  tag: "gx-action-group-menu",
  styleUrl: "action-group-menu.scss",
  shadow: true
})
export class GxActionGroupMenu {
  private items: HTMLGxActionGroupItemElement[] = [];

  @Element() el: HTMLGxActionGroupMenuElement;

  /**
   * The aria label for the accessibility of the component.
   */
  @Prop() readonly caption = "";

  /**
   * If the menu is opened or closed.
   */
  @Prop() readonly closed: boolean = true;

  @Watch("closed")
  watchPropOpenItemHandler(newValue: boolean) {
    if (newValue) {
      this.closeOpenAction();
    }
  }

  /**
   * A CSS class to set as the `gx-action-group-menu` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * Visual disposition of the menu.
   */
  @Prop() readonly disposedTop: boolean = false;

  /**
   * The index of item action that is targeted.
   */
  @Prop({ mutable: true }) openIndex: number = null;

  /**
   * Used when the gx-action-group scroll changed, then update the position of menu.
   */
  @Prop() readonly parentScroll: number = 0;

  @Watch("parentScroll")
  watchPropParentScrollHandler() {
    this.calculateMenuPosition();
  }

  /**
   * Used when the gx-action-group scroll changed, then update the position of menu.
   */
  @Prop() readonly parentSize: number = 0;

  @Watch("parentSize")
  watchPropParentSizeHandler() {
    this.calculateMenuPosition();
  }

  componentDidLoad() {
    const items: any = this.el.querySelectorAll(
      ":scope > gx-action-group-item"
    );
    this.items = [...items];
    this.items.forEach(it =>
      it.addEventListener("actionGroupItemTargeted", this.handleActionTargeted)
    );
  }

  /**
   * Listen when a KeyboardEvent is captured for some action item, and manage what doing for some keys.
   * Space, Enter: Activates the action item.
   * Esc: deactivated action item if is active and close the menu open if correspond.
   * ArrowUp, ArrowDown, ArrowLeft, ArrowRight: Navigate for the actions items, putting them focused.
   * Home, End: Navigate to the first or last action item.
   */
  @Listen("actionGroupItemKeyDown")
  handleActionGroupItemKeyDown(
    event: CustomEvent<ActionGroupItemKeyDownEvent>
  ) {
    const keyboardEvent = event.detail.event;
    const targetActionIndex = this.items.indexOf(event.detail.item);

    if (targetActionIndex >= 0) {
      // close on escape
      if (keyboardEvent.code === ESCAPE_KEY_CODE) {
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        if (this.items[targetActionIndex].deactivated) {
          this.escapeOnDeactivatedItem();
        } else {
          this.items[targetActionIndex].deactivated = true;
        }
        this.toggleExpand(this.openIndex, false);
      } else if (
        keyboardEvent.code === SPACE_KEY_CODE ||
        keyboardEvent.code === ENTER_KEY_CODE
      ) {
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        this.items[targetActionIndex].deactivated =
          this.openIndex === targetActionIndex;
        this.toggleExpand(
          targetActionIndex,
          this.openIndex !== targetActionIndex
        );
      } else {
        this.controlFocusByKey(keyboardEvent, targetActionIndex);
      }
    }
  }

  private escapeOnDeactivatedItem = () => {
    const parent = this.el.parentElement as HTMLGxActionGroupItemElement;
    if (parent.classList.contains("more-action-btn-container")) {
      parent.parentElement.click();
      parent.parentElement.focus();
    } else {
      parent.deactivated = true;
      parent.focus();
    }
  };

  private handleActionTargeted = (
    event: CustomEvent<ActionGroupItemTargetEvent>
  ) => {
    const actionIndex = this.items.indexOf(event.detail.item);
    if (actionIndex > -1) {
      this.toggleExpand(actionIndex, event.detail.active);
    }
  };

  private toggleExpand(index: number, expanded: boolean) {
    // close open menu of item, if applicable
    if (this.openIndex !== index) {
      this.closeOpenAction();
      this.toggleExpand(this.openIndex, false);
    }

    // handle item at called index
    if (this.items[index] !== null && this.items[index] !== undefined) {
      this.openIndex = expanded ? index : null;
    }
  }

  private closeOpenAction() {
    if (this.openIndex !== null) {
      this.items[this.openIndex].deactivated = true;
      this.openIndex = null;
    }
  }

  private calculateMenuPosition() {
    const parent = this.el.parentElement;
    const parentLeft = parent.getBoundingClientRect().left;
    const parentTop = parent.getBoundingClientRect().top;
    const parentHeight = parent.getBoundingClientRect().height;
    const ancestorLeft = parent.parentElement.getBoundingClientRect().left;
    const ancestorTop = parent.parentElement.getBoundingClientRect().top;
    this.el.style.left = `${parentLeft - ancestorLeft}px`;
    this.el.style.top = `${parentTop - ancestorTop + parentHeight}px`;
  }

  private controlFocusByKey(
    keyboardEvent: KeyboardEvent,
    currentIndex: number
  ) {
    switch (keyboardEvent.code) {
      case ARROWUP_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        if (currentIndex > -1) {
          const prevIndex = Math.max(0, currentIndex - 1);
          this.items[prevIndex].focus();
        }
        break;
      case ARROWDOWN_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        if (currentIndex > -1) {
          const nextIndex = Math.min(this.items.length - 1, currentIndex + 1);
          this.items[nextIndex].focus();
        }
        break;
      case ARROWLEFT_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        const menuParent = this.el
          .parentElement as HTMLGxActionGroupItemElement;
        if (menuParent) {
          menuParent.deactivated = true;
          const menuAncestor =
            menuParent.parentElement as HTMLGxActionGroupMenuElement;
          if (menuAncestor) {
            menuAncestor.openIndex = null;
          }
          setTimeout(() => {
            menuParent.focus();
          }, 150);
        }
        break;
      case ARROWRIGHT_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        const menu = this.items[currentIndex].querySelector(
          ":scope > gx-action-group-menu"
        ) as HTMLGxActionGroupMenuElement;
        if (menu) {
          if (this.openIndex !== currentIndex) {
            this.items[currentIndex].deactivated =
              this.openIndex === currentIndex;
            this.toggleExpand(currentIndex, true);
          }
          const firstMenuItem = menu.querySelector(
            ":scope > gx-action-group-item"
          ) as HTMLGxActionGroupItemElement;
          if (firstMenuItem) {
            setTimeout(() => {
              firstMenuItem.focus();
            }, 150);
          }
        }
        break;
      case HOME_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        this.items[0].focus();
        break;
      case END_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        this.items[this.items.length - 1].focus();
        break;
    }
  }

  render() {
    return (
      <Host
        role="menu"
        aria-label={this.caption}
        class={{
          [this.cssClass]: !!this.cssClass,
          open: !this.closed,
          "disposed-horizontal": !this.disposedTop,
          "disposed-vertical": this.disposedTop
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
