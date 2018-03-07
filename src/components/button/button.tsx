import { Element, Component, Prop, Event, EventEmitter } from "@stencil/core";
import { BaseComponent } from "../common/base-component";
import { ButtonRender } from "../renders";

@Component({
  tag: "gx-button",
  styleUrl: "button.scss",
  shadow: false,
  host: {
    role: "button",
    tabIndex: "0"
  }
})
export class Button extends ButtonRender(BaseComponent) {
  @Element() element: HTMLElement;

  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";
  @Prop() disabled: boolean = false;
  @Prop()
  imagePosition: "above" | "before" | "after" | "below" | "behind" = "above";

  @Event() onClick: EventEmitter;
  // TODO: Implement touch devices events (Tap, DoubleTap, LongTap, SwipeX)
}
