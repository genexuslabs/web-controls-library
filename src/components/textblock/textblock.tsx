import { Component, Prop, Event, EventEmitter } from "@stencil/core";
import { BaseComponent } from "../common/base-component";

@Component({
  tag: "gx-textblock",
  styleUrl: "textblock.scss",
  shadow: false
})
export class TextBlock extends BaseComponent {
  @Prop() href: string = "";
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";
  @Prop() disabled: boolean = false;

  @Event() onClick: EventEmitter;

  handleClick(event: UIEvent) {
    if (this.disabled) return;

    this.onClick.emit(event);
    event.preventDefault();
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
