import { Element, Component, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'gx-button',
  styleUrl: 'button.scss',
  shadow: false,
  host: {
    role: 'button',
    tabIndex: '0'
  }
})
export class Button {
  @Element() buttonEl: HTMLElement;

  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";
  @Prop() disabled: boolean = false;
  @Prop() imagePosition: "above" | "before" | "after" | "below" | "behind" = "above";

  @Event() onClick: EventEmitter;
  // TODO: Implement touch devices events (Tap, DoubleTap, LongTap, SwipeX)

  handleClick(event: UIEvent) {
    if (this.disabled)
      return;

    this.onClick.emit(event);
  }

  componentDidLoad() {
    // Main image and disabled image are set an empty alt as they are decorative images.
    const images = this.buttonEl.querySelectorAll('[slot="main-image"], [slot="disabled-image"]');
    Array.from(images).forEach(img => img.setAttribute('alt', ''));
  }

  render() {
    return (
      <button onClick={this.handleClick.bind(this)}>
        <slot name="main-image" />
        <slot name="disabled-image" />
        <span>
          <slot />
        </span>
      </button>
    )
  }
}
