import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  State,
  Watch,
  h
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";
import { TimerState } from "./chronometer-timer-state";

@Component({
  shadow: false,
  styleUrl: "chronometer.scss",
  tag: "gx-chronometer"
})
export class Chronometer implements GxComponent {
  private eventTimer: number;
  private startedTime = 0;
  private started = false;
  private timer: number;

  @Element() element: HTMLGxChronometerElement;

  @State() elapsedTime = 0;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() readonly invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * When the chronometer reaches this value,
   * MaxValueText will be shown instead of the Chronometer value.
   */
  @Prop() readonly maxValue = 0;

  /**
   * Text to be displayed when chronometer value reaches maxValue.
   */
  @Prop() readonly maxValueText: string;

  /**
   * Time unit: (s) seconds or (ms) milliseconds for every time control Property.
   */
  @Prop() readonly unit: "s" | "ms" = "s";

  /**
   * Defines the interval that the function onTick will be called.
   */
  @Prop() readonly interval = 1;

  /**
   * State of the Chronometer.
   */
  @Prop() readonly state: TimerState = TimerState.Stopped;

  /**
   * The value of the control.
   */
  @Prop({ mutable: true }) value = 0;

  /**
   * The `input` event is emitted every time the chronometer changes (every 1 second)
   */
  @Event() input: EventEmitter;

  /**
   * The `change` event is emitted every time the chronometer changes
   */
  @Event() change: EventEmitter;

  /**
   * Event to emit after max time is consumed.
   */
  @Event() end: EventEmitter;

  /**
   * Event to emit After elapsed time (tickInterval).
   */
  @Event() tick: EventEmitter;

  /**
   * Returns the id of the inner `input` element (if set).
   */
  @Method()
  async getNativeInputId() {
    return this.element;
  }

  componentWillLoad() {
    this.elapsedTime = this.value * this.getUnit();
  }

  componentDidUnload() {
    this.stop();
  }

  /**
   * Starts the Chronometer
   */
  @Method()
  async start() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.startedTime = Date.now() - this.elapsedTime;
    this.updateElapsedTime();

    this.timer = window.setInterval(() => {
      this.updateElapsedTime();
      if (
        this.maxValue > 0 &&
        this.elapsedTime >= this.maxValue * this.getUnit()
      ) {
        this.end.emit();
        this.stop();
      }
    }, 1000);

    if (this.interval > 0) {
      this.eventTimer = window.setInterval(() => {
        this.tickHandler();
      }, this.interval * this.getUnit());
    }
  }

  /**
   * Stops the Chronometer
   */
  @Method()
  async stop() {
    window.clearInterval(this.eventTimer);
    window.clearInterval(this.timer);
    this.started = false;
    this.startedTime = 0;
  }

  /**
   * Stops and set to 0 the Chronometer.
   */
  @Method()
  async reset() {
    this.stop();
    this.value = 0;
    this.startedTime = 0;
    this.elapsedTime = 0;
  }

  @Watch("value")
  handleChange() {
    this.input.emit();
    this.change.emit();
  }

  private tickHandler() {
    this.tick.emit();
  }

  @Watch("state")
  stateChanged(newState: TimerState, oldState: TimerState) {
    if (oldState === newState) {
      return;
    }
    switch (newState) {
      case TimerState.Running:
        this.start();
        break;
      case TimerState.Stopped:
        this.stop();
        break;
      case TimerState.Reset:
        this.reset();
        break;
      default:
        break;
    }
  }

  private getUnit() {
    return this.unit === "s" ? 1000 : 1;
  }

  private updateElapsedTime() {
    this.elapsedTime = Date.now() - this.startedTime;
    this.value = Math.floor(this.elapsedTime / this.getUnit());
  }

  render() {
    const time = Math.floor(this.elapsedTime / 1000);
    const maxVal = this.maxValue * this.getUnit();
    const maxValueReached = this.elapsedTime > maxVal && maxVal !== 0;

    return <span>{maxValueReached ? this.maxValueText : time}</span>;
  }
}
