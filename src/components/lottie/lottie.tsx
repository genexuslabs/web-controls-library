import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  Watch,
  h
} from "@stencil/core";
import bodymovin from "lottie-web/build/player/lottie_light";
import {
  ClickableComponent,
  Component as GxComponent,
  DisableableComponent,
  VisibilityComponent
} from "../common/interfaces";

@Component({
  shadow: true,
  styleUrl: "lottie.scss",
  tag: "gx-lottie"
})
export class Lottie
  implements
    GxComponent,
    ClickableComponent,
    VisibilityComponent,
    DisableableComponent {
  private animation: any;
  private animationTotalFrames: number;

  @Element() element: HTMLGxLottieElement;

  /**
   * This attribute lets you specify a Lottie animation object
   *
   */
  @Prop() readonly animationData: any;

  /**
   * This attribute lets you specify if the animation will start playing as soon as it is ready
   *
   */
  @Prop() readonly autoPlay: boolean = true;

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
   * This attribute lets you specify if the element is disabled.
   * If disabled, it will not fire any user interaction related event
   * (for example, click event).
   */
  @Prop() readonly disabled = false;

  /**
   * This attribute lets you specify if the animation will loop
   */
  @Prop() readonly loop: boolean = true;

  /**
   * This attribute lets you specify  the relative path to the animation object. (`animationData` and `path` are mutually exclusive)
   */
  @Prop() readonly path: string;

  /**
   * Emitted when the element is clicked.
   */
  @Event() gxClick: EventEmitter;

  /**
   * Emitted when the animation is loaded in the DOM.
   */
  @Event() animationLoad: EventEmitter;

  @Watch("animationData")
  animationDataChanged() {
    this.animation.destroy();
    this.animation = null;
  }

  @Watch("path")
  pathChanged() {
    this.animation.destroy();
    this.animation = null;
  }

  /**
   * Pause the animation
   */
  @Method()
  async pause() {
    this.animation.pause();
  }

  /**
   * Start playing the animation
   */
  @Method()
  async play(from = 0, to = 0) {
    if (!this.animation) {
      return;
    }

    if (from !== 0 || to !== 0) {
      if (to !== 0) {
        to = from;
        from = 0;
      }
      const fromFrame = this.durationToFrames(from);
      const toFrame = this.durationToFrames(to);
      this.animation.playSegments([fromFrame, toFrame]);
    } else {
      this.animation.play();
    }
  }

  /**
   * Set the progress of the animation to any point
   * @param progress: Value from 0 to 1 indicating the percentage of progress where the animation will start.
   */
  @Method()
  async setProgress(progress: number) {
    if (!this.animation) {
      return;
    }

    const progressInFrames = this.durationToFrames(progress);
    this.animation.goToAndPlay(progressInFrames, true);
  }

  /**
   * Stop the animation
   */
  @Method()
  async stop() {
    if (!this.animation) {
      return;
    }

    this.animation.stop();
  }

  private durationToFrames(duration) {
    return Math.trunc(this.animationTotalFrames * duration);
  }

  componentDidLoad() {
    this.setAnimation();
  }

  componentDidUpdate() {
    this.setAnimation();
  }

  disconnectedCallback() {
    this.animation.destroy();
  }

  private setAnimation() {
    if (this.animation) {
      this.animation.loop = this.loop;
      return;
    }

    this.animation = bodymovin.loadAnimation({
      animationData: this.animationData,
      autoplay: this.autoPlay,
      container: this.element.shadowRoot.querySelector(":scope > div"),
      loop: this.loop,
      path: this.path,
      renderer: "svg"
    });

    this.animation.addEventListener(
      "DOMLoaded",
      this.animationDomLoadedHandler.bind(this)
    );
  }

  private animationDomLoadedHandler(event: UIEvent) {
    this.animationTotalFrames = this.animation.getDuration(true);
    this.animationLoad.emit(event);
  }

  render() {
    return <div />;
  }
}
