import {
  Component,
  Host,
  h,
  Element,
  Prop,
  State,
  Listen,
  Watch
} from "@stencil/core";
import {
  ActionGroupItemKeyDownEvent,
  ActionGroupItemTargetEvent
} from "../action-group-item/action-group-item";

const ENTER_KEY_CODE = "Enter";
const ESCAPE_KEY_CODE = "Escape";
const SPACE_KEY_CODE = "Space";
const ARROWLEFT_KEY_CODE = "ArrowLeft";
const ARROWDOWN_KEY_CODE = "ArrowDown";
const ARROWRIGHT_KEY_CODE = "ArrowRight";
const HOME_KEY_CODE = "Home";
const END_KEY_CODE = "End";

/**
 * @part actions-container - The container where live the actions items.
 * @part more-action-btn - The button for show hidden actions items when property "itemsOverflowBehavior" is equal to 'Responsive Collapse'.
 *
 * @slot - The slot where you can put the actions items.
 */
@Component({
  tag: "gx-action-group",
  styleUrl: "action-group.scss",
  shadow: true
})
export class GxActionGroup {
  private resizeObserver: ResizeObserver = null;
  private container: HTMLElement = null;
  private btnMenuElement: HTMLElement = null;
  private firstLevelItems: HTMLGxActionGroupItemElement[] = [];
  private needForRAF = true; // To prevent redundant RAF (request animation frame) calls

  @Element() el: HTMLGxActionGroupElement;

  /**
   * The items inside the actions menu button.
   */
  @State() actionsButtonItems: HTMLGxActionGroupItemElement[] = [];

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
   *  When it's true and an action is activated close the actions menu.
   */
  @Prop() readonly closeOnActionActivated: boolean = true;

  /**
   * A CSS class to set as the `gx-action-group` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute determines how items behave when the content of the ActionGroup overflows horizontal. This property is needed
   * to make the control responsive to changes in the Width of the container of ActionGroup.
   *
   * | Value                 | Details                                                                                          |
   * | --------------------- | ------------------------------------------------------------------------------------------------ |
   * | `Add Scroll`          | The items of the ActionGroup that overflow horizontally are shown by means of a scroll.          |
   * | `Multiline`           | The ActionGroup items that overflow horizontally are shown in a second line of the control.      |
   * | `Responsive Collapse` | The Action Group items, when they start to overflow the control, are placed in the More Actions. |
   */
  @Prop() readonly itemsOverflowBehavior:
    | "Add Scroll"
    | "Multiline"
    | "Responsive Collapse" = "Responsive Collapse";

  /**
   * This attribute determines the position of the More Actions button in the Action Group.
   *
   * | Value   | Details                                                               |
   * | --------| --------------------------------------------------------------------- |
   * | `Start` | The More Actions Button is displayed to the left of the ActionGroup.  |
   * | `End`   | The More Actions Button is displayed to the right of the ActionGroup. |
   */
  @Prop() readonly moreActionsButtonPosition: "Start" | "End" = "Start";

  /**
   * The index of item action that is targeted.
   */
  @Prop({ mutable: true }) openIndex: number = null;

  /**
   *  When it's true and an action is hovered show the actions menu.
   */
  @Prop() readonly showActionsMenuOnHover: boolean = true;

  componentDidLoad() {
    const items: any = this.el.querySelectorAll("gx-action-group-item");
    items.forEach((it: HTMLGxActionGroupItemElement) => {
      it.showActionsMenuOnHover = this.showActionsMenuOnHover;
    });

    const firstLevelItems: any = this.el.querySelectorAll(
      ":scope > gx-action-group-item"
    );
    this.firstLevelItems = [...firstLevelItems];
    let itemHeight = 0;
    this.firstLevelItems.forEach(it => {
      it.disposedTop = true;
      it.addEventListener("actionGroupItemTargeted", this.handleActionTargeted);
      itemHeight = it.getBoundingClientRect().height;
    });
    if (this.itemsOverflowBehavior === "Responsive Collapse") {
      this.container.style.height = `${itemHeight}px`;
    }

    if (this.itemsOverflowBehavior === "Responsive Collapse") {
      this.btnMenuElement.parentElement.addEventListener(
        "keydown",
        this.btnMenuFocusByKey
      );
    }

    window.addEventListener("click", this.onBlur);
    this.containerChangedObserver();

    // Needed for perform the position of the menu inside items
    const actionsContainer: any =
      this.el.shadowRoot.querySelector(".actions-container");
    actionsContainer.addEventListener("scroll", () => {
      this.changeMenuItemsPositions(actionsContainer.scrollLeft);
    });

    this.changeMenuItemsPositions(this.el.clientWidth);
  }

  /**
   * Listen when an action item is activated.
   */
  @Listen("actionGroupItemSelected")
  handleActionGroupItemSelected() {
    if (this.closeOnActionActivated) {
      if (this.openIndex) {
        this.firstLevelItems[this.openIndex].deactivated = true;
      }
      this.closeOpenAction();
      this.openIndex = null;
    }
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
    const targetActionIndex = this.firstLevelItems.indexOf(event.detail.item);

    if (targetActionIndex >= 0) {
      // close on escape
      if (keyboardEvent.code === ESCAPE_KEY_CODE) {
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        this.firstLevelItems[targetActionIndex].deactivated = true;
        this.toggleExpand(this.openIndex, false);
      } else if (
        keyboardEvent.code === SPACE_KEY_CODE ||
        keyboardEvent.code === ENTER_KEY_CODE
      ) {
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        this.firstLevelItems[targetActionIndex].deactivated =
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

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  /**
   * Observer to listener the change of size of actions container.
   */
  private containerChangedObserver() {
    // Create instance of observer
    this.resizeObserver = new ResizeObserver(entries => {
      if (!entries[0] || !this.needForRAF) {
        return;
      }

      this.needForRAF = false; // No need to call RAF up until next frame

      requestAnimationFrame(() => {
        this.needForRAF = true; // RAF now consumes the movement instruction so a new one can come

        // Reload annotations
        this.containerSizeChanged();
      });
    });

    // Start the observation
    this.resizeObserver.observe(this.container);
  }

  private containerSizeChanged() {
    if (this.itemsOverflowBehavior === "Responsive Collapse") {
      const actionsContainerSeparator: any = this.el.shadowRoot.querySelector(
        ".actions-container .separator"
      );
      const firstItemTop =
        actionsContainerSeparator.getBoundingClientRect().top;
      const actionsButtonItems: HTMLGxActionGroupItemElement[] = [];
      this.firstLevelItems.forEach(it => {
        const itemTop = it.getBoundingClientRect().top;
        if (itemTop !== firstItemTop) {
          const itToClone: any = it;
          actionsButtonItems.push(itToClone.cloneNode(true));
          it.disabled = true;
          it.deactivated = true;
        } else {
          it.disabled = false;
        }
      });

      this.actionsButtonItems = actionsButtonItems;
      const menu = document.createElement("gx-action-group-menu");
      actionsButtonItems.forEach(it => {
        it.classList.remove("first-level-action");
        it.disposedTop = false;
        it.showActionsMenuOnHover = this.showActionsMenuOnHover;
        const itMenu = it.querySelector(
          ":scope > gx-action-group-menu"
        ) as HTMLGxActionGroupMenuElement;
        if (itMenu) {
          itMenu.removeAttribute("style");
        }
        menu.appendChild(it);
      });
      this.btnMenuElement.innerHTML = "";
      this.btnMenuElement.appendChild(menu);
    }

    this.changeMenuItemsPositions(this.el.clientWidth);
  }

  private handleActionTargeted = (
    event: CustomEvent<ActionGroupItemTargetEvent>
  ) => {
    const actionIndex = this.firstLevelItems.indexOf(event.detail.item);
    if (actionIndex > -1) {
      this.toggleExpand(actionIndex, event.detail.active);
    }
  };

  private onBlur = (event: PointerEvent) => {
    const itemContainsFocus = this.el.contains(event.target as HTMLElement);
    if (!itemContainsFocus) {
      this.closeOpenAction();
      if (this.openIndex !== null) {
        this.toggleExpand(this.openIndex, false);
      }
    }
  };

  private toggleExpand(index: number, expanded: boolean) {
    // close open menu of item, if applicable
    if (this.openIndex !== index) {
      this.closeOpenAction();
      this.toggleExpand(this.openIndex, false);
    }

    // handle item at called index
    if (
      this.firstLevelItems[index] !== null &&
      this.firstLevelItems[index] !== undefined
    ) {
      this.openIndex = expanded ? index : null;
    }
  }

  private handleMenuBtnClick = () => {
    const menu: any = this.btnMenuElement.querySelector(
      ":scope > gx-action-group-menu"
    );
    if (menu) {
      menu.closed = !menu.closed;
    }
  };

  private changeMenuItemsPositions = (value: number) => {
    setTimeout(() => {
      this.firstLevelItems.forEach(it => {
        const menu = it.querySelector(
          ":scope > gx-action-group-menu"
        ) as HTMLGxActionGroupMenuElement;
        if (menu) {
          menu.parentSize = value;
        }
      });
    }, 150);
  };

  private closeOpenAction() {
    if (this.openIndex !== null) {
      this.firstLevelItems[this.openIndex].deactivated = true;
    }
    if (this.btnMenuElement) {
      const menu: any = this.btnMenuElement.querySelector(
        ":scope > gx-action-group-menu"
      );
      if (menu) {
        menu.closed = true;
      }
    }
  }

  private controlFocusByKey(
    keyboardEvent: KeyboardEvent,
    currentIndex: number
  ) {
    switch (keyboardEvent.code) {
      case ARROWLEFT_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        const prevIndex = Math.max(0, currentIndex - 1);
        if (currentIndex > -1 && !this.firstLevelItems[prevIndex].disabled) {
          this.firstLevelItems[prevIndex].focus();
        }
        if (
          currentIndex === 0 &&
          this.itemsOverflowBehavior === "Responsive Collapse"
        ) {
          this.btnMenuElement.parentElement.focus();
        }
        break;
      case ARROWRIGHT_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        const nextIndex = Math.min(
          this.firstLevelItems.length - 1,
          currentIndex + 1
        );
        if (currentIndex > -1 && !this.firstLevelItems[nextIndex].disabled) {
          this.firstLevelItems[nextIndex].focus();
        }
        break;
      case ARROWDOWN_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        const menu = this.firstLevelItems[currentIndex].querySelector(
          ":scope > gx-action-group-menu"
        ) as HTMLGxActionGroupMenuElement;
        if (menu) {
          if (this.openIndex !== currentIndex) {
            this.firstLevelItems[currentIndex].deactivated =
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
        this.firstLevelItems[0].focus();
        break;
      case END_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        this.firstLevelItems[this.firstLevelItems.length - 1].focus();
        break;
    }
  }

  private btnMenuFocusByKey = (keyboardEvent: KeyboardEvent) => {
    const menu: any = this.btnMenuElement.querySelector(
      ":scope > gx-action-group-menu"
    );
    switch (keyboardEvent.code) {
      case ESCAPE_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        if (!menu.closed) {
          this.btnMenuElement.parentElement.click();
        }
        break;
      case ARROWRIGHT_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        if (!this.firstLevelItems[0].disabled) {
          this.firstLevelItems[0].focus();
        }
        break;
      case SPACE_KEY_CODE:
      case ENTER_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        this.btnMenuElement.parentElement.click();
        break;
      case ARROWDOWN_KEY_CODE:
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        if (menu.closed) {
          this.btnMenuElement.parentElement.click();
        }
        setTimeout(() => {
          if (menu.children[0]) {
            menu.children[0].focus();
          }
        }, 150);
    }
  };

  private stopPropagation = (e: UIEvent) => {
    e.stopPropagation();
  };

  render() {
    return (
      <Host
        role="menubar"
        aria-label={this.caption}
        class={{
          [this.cssClass]: !!this.cssClass,
          ["overflow-behavior-add-scroll"]:
            this.itemsOverflowBehavior === "Add Scroll",
          ["overflow-behavior-multiline"]:
            this.itemsOverflowBehavior === "Multiline",
          ["overflow-behavior-responsive-collapse"]:
            this.itemsOverflowBehavior === "Responsive Collapse",
          ["btn-actions-position-end"]: this.moreActionsButtonPosition === "End"
        }}
      >
        {this.itemsOverflowBehavior === "Responsive Collapse" ? (
          <div
            tabindex="0"
            class={{
              "more-action-btn": true,
              hide: this.actionsButtonItems.length === 0
            }}
            part="more-action-btn"
            onClick={this.handleMenuBtnClick}
          >
            <div class="more-action-btn-line"></div>
            <div class="more-action-btn-line"></div>
            <div class="more-action-btn-line"></div>
            <div
              class="more-action-btn-container"
              onClick={this.stopPropagation}
              ref={btnMenuElement =>
                (this.btnMenuElement = btnMenuElement as HTMLElement)
              }
            ></div>
          </div>
        ) : null}

        <div
          class="actions-container"
          part="actions-container"
          ref={containerElement =>
            (this.container = containerElement as HTMLElement)
          }
        >
          {this.itemsOverflowBehavior === "Responsive Collapse" ? (
            <div class="separator"></div>
          ) : null}
          <slot></slot>
        </div>
      </Host>
    );
  }
}
