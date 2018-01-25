import { Component, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'gx-textblock',
  styleUrl: 'textblock.scss',
  shadow: false
})
export class TextBlock {

  @Prop() href: string = "";
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";
  @Prop() disabled: boolean = false;

  @Event() onClick: EventEmitter;
  // TODO: Implement touch devices events (Tap, DoubleTap, LongTap, SwipeX)

  handleClick(event: UIEvent) {
    if (this.disabled)
      return;

    this.onClick.emit(event);
  }

  render() {
    const body = (
      <div onClick={this.handleClick.bind(this)}>
        <slot />
      </div>
    );

    if (this.href) {
      return <a href={this.href}>{body}</a>;
    }

    return body;
  }
}
