import {
  Component,
  Element,
  Host,
  Prop,
  h,
  Event,
  EventEmitter
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  shadow: true,
  styleUrl: "navbar-item.scss",
  tag: "gx-navbar-item"
})
export class NavBarItem implements GxComponent {
  @Element() element: HTMLGxNavbarItemElement;

  /**
   * Indicates if the navbar item is the active one (for example, when the item represents the current page)
   */
  @Prop() readonly active = false;

  /**
   * This attribute lets you specify the URL of the navbar item.
   */
  @Prop() readonly href = "";

  /**
   * This attribute lets you specify the alternate text for the image specified in iconSrc.
   */
  @Prop() readonly iconAltText = "";

  /**
   * This attribute lets you specify the URL of an icon for the navbar item.
   */
  @Prop() readonly iconSrc = "";

  /**
   * Fired after the component has been rendered in the page for the first time
   */
  @Event() navBarItemLoaded: EventEmitter;

  /**
   * Fired after the component has been removed from the page
   */
  @Event() navBarItemUnloaded: EventEmitter;

  componentDidLoad() {
    this.navBarItemLoaded.emit(this.element);
  }

  disconnectedCallback() {
    this.navBarItemUnloaded.emit(this.element);
  }

  render() {
    const TagName = this.href ? "a" : "button";
    const attris = this.href
      ? {
          href: this.href
        }
      : {
          type: "button"
        };

    return (
      <Host>
        <TagName
          class={{
            item: true,
            "item-with-icon": !!this.iconSrc,
            "item--active": this.active
          }}
          {...attris}
        >
          {this.iconSrc && (
            <img class="item-icon" src={this.iconSrc} alt={this.iconAltText} />
          )}
          <slot />
        </TagName>
      </Host>
    );
  }
}
