import { Element, Component, Prop, Event, EventEmitter } from '@stencil/core';
import { defineImplementation } from '../../core/utils';
import { ButtonImpl } from './button-impl';

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
  @Element() element: HTMLElement;

  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";
  @Prop() disabled: boolean = false;
  @Prop() imagePosition: "above" | "before" | "after" | "below" | "behind" = "above";

  @Event() onClick: EventEmitter;
  // TODO: Implement touch devices events (Tap, DoubleTap, LongTap, SwipeX)
}

defineImplementation(Button, ButtonImpl);
