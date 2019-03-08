import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  State
} from "@stencil/core";
import { IComponent } from "../common/interfaces";

@Component({
  shadow: false,
  styleUrl: "chronometer.scss",
  tag: "gx-chronometer"
})
export class Chronometer implements IComponent {
  @Element() element;

  timer: number;
  eventTimer: number;
  startedTime = 0;
  started = false;

  @State() elapsedTime = 0;

  /**
   * Defines the initial Chronometer value (in milliseconds)
   */
  @Prop({ mutable: true })
  value = 0;

  /**
   * Defines the interval (in milliseconds) that the function onTick will be called.
   */
  @Prop() tickInterval = 1000;

  /**
   * When the chronometer reaches maxValue (in milliseconds),
   * MaxValueText will be shown instead of the Chronometer.
   */
  @Prop() maxValue = 0;

  /**
   * Text to be displayed when chronometer value reaches maxValue.
   */
  @Prop() maxValueText: string;

  /**
   * Event to emit After elapsed time (tickInterval).
   */
  @Event() tick: EventEmitter;

  tickHandler() {
    this.tick.emit();
  }

  componentDidUnload() {
    this.stop();
  }

  componentWillLoad() {
    this.elapsedTime = this.value;
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
    }, 1000);

    if (this.tickInterval > 0) {
      this.eventTimer = window.setInterval(() => {
        this.tickHandler();
      }, this.tickInterval);
    }
  }

  updateElapsedTime() {
    this.elapsedTime = Date.now() - this.startedTime;
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
    this.startedTime = 0;
    this.elapsedTime = 0;
    this.value = 0;
    this.stop();
  }

  render() {
    const time = Math.floor(this.elapsedTime / 1000);
    const maxValueReached =
      this.elapsedTime > this.maxValue && this.maxValue !== 0;

    return <span>{maxValueReached ? this.maxValueText : time}</span>;
  }
}
