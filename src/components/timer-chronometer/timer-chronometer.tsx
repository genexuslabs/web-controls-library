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
  styleUrl: "timer-chronometer.scss",
  tag: "gx-chronometer"
})
export class TimerChronometer implements IComponent {
  @Element() element;

  timer: number;
  eventTimer: number;
  startedTime: number;
  started: boolean;

  @State() currentTime: number;

  /**
   * Defines the initial Chronometer value in milliseconds
   */
  @Prop() initialMilliseconds = 0;

  /**
   * Defines the interval in milliseconds that the function onTick will be called.
   */
  @Prop() tickInterval = 1000;

  /**
   * When the chronnometer reach the maxValue (in milliseconds),
   * MaxValueText will be shown instead of the Chronometer.
   */
  @Prop() maxValue = 0;
  @Prop() maxValueText: string;

  /**
   * After elapsed time (tickInterval), the following function will be called.
   */
  @Event() tick: EventEmitter;

  tickHandler() {
    if (this.tick) {
      this.tick.emit();
    }
  }

  componentDidUnload() {
    this.stop();
  }

  /**
   * Starts the Chronometer
   */
  @Method()
  start() {
    this.stop();
    this.started = true;
    this.currentTime = Date.now();
    this.startedTime = this.currentTime - this.initialMilliseconds;

    this.timer = window.setInterval(() => {
      this.currentTime = Date.now();
    }, 1000);

    this.eventTimer = window.setInterval(() => {
      this.tickHandler();
    }, this.tickInterval);
  }
  /**
   * Stops the Chronometer
   */
  @Method()
  stop() {
    window.clearInterval(this.eventTimer);
    window.clearInterval(this.timer);
    this.started = false;
  }

  /**
   * Stops and restarts the Chronometer.
   */
  @Method()
  reset() {
    this.start();
  }

  render() {
    if (!this.started) {
      return;
    }

    const timeMS = this.currentTime - this.startedTime;
    const time = Math.floor(timeMS / 1000);
    if (timeMS < this.maxValue || this.maxValue === 0) {
      return <span>{time}</span>;
    } else {
      return <span>{this.maxValueText}</span>;
    }
  }
}
