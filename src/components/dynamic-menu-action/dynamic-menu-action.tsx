import { Component, Host, h, Prop, Event, Element } from "@stencil/core";
import { EventEmitter } from "@stencil/core/internal";

/**
 * @part title - The title of menu action.
 * @part subtitle - The subtitle of menu action.
 * @part item-right - The right part of menu action, where you can put other components.
 *
 * @slot data - The slot where you can put the main data of the action.
 * @slot right - The slot where you can put additional components aligned to the right of the menu action.
 */
@Component({
  tag: "gx-dynamic-menu-action",
  styleUrl: "dynamic-menu-action.scss",
  shadow: true
})
export class DynamicMenuAction {
  @Element() el: HTMLGxDynamicMenuActionElement;

  /**
   * This attribute specifies the id of the gx-dynamic-menu-action for manage from outside, will be an unique attribute.
   */
  @Prop() readonly actionId: string;

  /**
   * A CSS class to set as the `gx-dynamic-menu-action` element class when `inactivated = false`.
   */
  @Prop() readonly activeClass: string;

  /**
   * A CSS class to set as the `gx-dynamic-menu-action` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you specify if the menu action is activated or not.
   */
  @Prop({ mutable: true }) deactivated = true;

  /**
   * The subtitle of menu action.
   */
  @Prop() readonly itemSubtitle: string;

  /**
   * The title of menu action.
   */
  @Prop() readonly itemTitle: string;

  /**
   * This attribute specifies which popup of the gx-dynamic-menu must be open.
   */
  @Prop() readonly popupId: string;

  /**
   * Fired when the menu action is activated.
   */
  @Event() menuActionActivated: EventEmitter<MenuActionActiveEvent>;

  /**
   * Fired when a KeyboardEvent is captured for the menu action.
   */
  @Event() menuActionKeyDown: EventEmitter<KeyboardEvent>;

  componentWillLoad() {
    this.el.addEventListener("click", this.handleActionClick);
    this.el.addEventListener("keydown", this.handleActionKeyDown);
  }

  private handleActionClick = (event: PointerEvent) => {
    event.stopPropagation();
    const actionExpanded = this.el.getAttribute("aria-expanded") === "true";
    this.deactivated = actionExpanded;
    this.menuActionActivated.emit({
      active: !this.deactivated,
      item: this.el as HTMLGxDynamicMenuActionElement
    });
  };

  private handleActionKeyDown = (event: KeyboardEvent) => {
    this.menuActionKeyDown.emit(event);
  };

  render() {
    return (
      <Host
        role="button"
        tabindex="0"
        aria-expanded={(!this.deactivated).toString()}
        aria-controls={this.popupId}
        class={{
          [this.cssClass]: !!this.cssClass,
          [this.activeClass]: !!this.activeClass && !this.deactivated
        }}
      >
        <div class="item-data">
          <div class="title" part="title">
            {this.itemTitle}
          </div>
          <div class="subtitle" part="subtitle">
            {this.itemSubtitle}
          </div>
          <slot name="data"></slot>
        </div>
        <div class="item-right" part="item-right">
          <slot name="right"></slot>
        </div>
      </Host>
    );
  }
}

export interface MenuActionActiveEvent {
  active: boolean;
  item: HTMLGxDynamicMenuActionElement;
}
