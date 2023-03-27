import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  h
} from "@stencil/core";
import { Component as GxComponent } from "../common/interfaces";

@Component({
  tag: "gx-header-row-pattern-marker",
  styleUrl: "header-row-pattern-marker.scss",
  shadow: true
})
export class HeaderRowPatternMarker implements GxComponent {
  @Element() element: HTMLGxHeaderRowPatternMarkerElement;

  /**
   * The `headerRowPatternBreakpoint` event is fired synchronously when the
   * control changes its visibility in the viewport.
   */
  @Event() headerRowPatternBreakpoint: EventEmitter<boolean>;

  private observer: IntersectionObserver;

  // Default is 60px if the custom var "--gx-navbar-main-height" is undefined
  private getNavBarHeight(): string {
    const navBarHeight =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--gx-navbar-main-height")
        .trim() || "60px";

    return navBarHeight;
  }

  componentDidLoad() {
    const options: IntersectionObserverInit = {
      root: document,
      rootMargin: `-${this.getNavBarHeight()}`
    };

    this.observer = new IntersectionObserver(entries => {
      const isVisibleInTheViewport = entries[0].isIntersecting;
      this.headerRowPatternBreakpoint.emit(isVisibleInTheViewport);
    }, options);

    this.observer.observe(this.element);
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  render() {
    return <Host></Host>;
  }
}
