import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  State,
  Watch
} from "@stencil/core";
import { IComponent /*, IFormComponent */ } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "chronometer.scss",
  tag: "gx-chronometer"
})
export class Chronometer implements IComponent, IFormComponent {
  disabled: boolean;
  eventTimer: number;
  startedTime = 0;
  started = false;
  timer: number;

  @Element() element;

  @State() elapsedTime = 0;

  /**
   * The identifier of the control. Must be unique.
   */
  @Prop() id: string;

  /**
   * This attribute lets you specify how this element will behave when hidden.
   *
   * | Value        | Details                                                                     |
   * | ------------ | --------------------------------------------------------------------------- |
   * | `keep-space` | The element remains in the document flow, and it does occupy space.         |
   * | `collapse`   | The element is removed form the document flow, and it doesn't occupy space. |
   */
  @Prop() invisibleMode: "collapse" | "keep-space" = "collapse";

  /**
   * When the chronometer reaches this value,
   * MaxValueText will be shown instead of the Chronometer value.
   */
  @Prop() maxValue = 0;

  /**
   * Text to be displayed when chronometer value reaches maxValue.
   */
  @Prop() maxValueText: string;

  /**
   * Time unit: 1000 as seconds, 1 as miliseconds for every control Prop.
   */
  @Prop() unit = 1000;

  /**
   * Defines the interval that the function onTick will be called.
   */
  @Prop() interval = 1;

  /**
   * State of the Chronometer.
   */
  @Prop() state = TimerState.Stopped;

  /**
   * The value of the control.
   */
  @Prop({ mutable: true })
  value = 0;

  /**
   * The `input` event is emitted every time the chronometer changes (every 1 second)
   */

  @Event() input: EventEmitter;

  @Event() change: EventEmitter;

  /**
   * Event to emit after max time is consumed.
   */
  @Event() onEnd: EventEmitter;

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
    this.elapsedTime = this.value * this.unit;
  }

  componentDidUnload() {
    this.stop();
  }

  /**
   * Starts the Chronometer
   */
  @Method()
  start() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.startedTime = Date.now() - this.elapsedTime;
    this.updateElapsedTime();

    this.timer = window.setInterval(() => {
      this.updateElapsedTime();
      this.handleChange();
      if (this.maxValue > 0 && this.elapsedTime >= this.maxValue * this.unit) {
        this.onEnd.emit();
        this.stop();
      }
    }, 1000);

    if (this.interval > 0) {
      this.eventTimer = window.setInterval(() => {
        this.tickHandler();
      }, this.interval * this.unit);
    }
  }

  /**
   * Stops the Chronometer
   */
  @Method()
  stop() {
    window.clearInterval(this.eventTimer);
    window.clearInterval(this.timer);
    this.started = false;
    this.startedTime = 0;
  }

  /**
   * Stops and set to 0 the Chronometer.
   */
  @Method()
  reset() {
    this.stop();
    this.value = 0;
    this.startedTime = 0;
    this.elapsedTime = 0;
    this.handleChange();
  }

  handleChange() {
    this.input.emit();
    this.change.emit();
  }

  tickHandler() {
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
  updateElapsedTime() {
    this.elapsedTime = Date.now() - this.startedTime;
    this.value = Math.floor(this.elapsedTime / this.unit);
  }

  render() {
    const time = Math.floor(this.elapsedTime / 1000);
    const maxVal = this.maxValue * this.unit;
    const maxValueReached = this.elapsedTime > maxVal && maxVal !== 0;

    return <span>{maxValueReached ? this.maxValueText : time}</span>;
  }
}

export enum TimerState {
  Running = "running",
  Stopped = "stopped",
  Reset = "reset"
}
