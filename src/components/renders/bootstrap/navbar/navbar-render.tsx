import { IRenderer } from "../../../common/interfaces";
import { NavBar } from "../../../navbar/navbar";

export class NavBarRender implements IRenderer {
  constructor(public component: NavBar) {}

  private navBarId: string;

  private expanded: boolean;
  private transitioning: boolean;

  private toggleCollapseHandler(event: UIEvent) {
    const button = event.currentTarget as HTMLButtonElement;
    const targetSelector = button.getAttribute("data-target");
    const targetElement = this.component.element.querySelector(
      targetSelector
    ) as HTMLElement;
    if (this.expanded) {
      this.collapse(targetElement);
    } else {
      this.expand(targetElement);
    }
  }

  private expand(target: HTMLElement) {
    if (this.transitioning) {
      return;
    }

    this.expanded = true;
    target.classList.remove("collapse");
    target.classList.add("collapsing");
    setTimeout(() => {
      this.transitioning = true;
      target.style.height = `${target.scrollHeight}px`;
    }, 10);
  }

  private collapse(target: HTMLElement) {
    if (this.transitioning) {
      return;
    }

    this.expanded = false;
    target.style.height = getComputedStyle(target).height;
    target.classList.add("collapsing");
    target.classList.remove("show");
    target.classList.remove("collapse");
    setTimeout(() => {
      this.transitioning = true;
      target.style.height = "";
    }, 10);
  }

  private handleTransitionEnd(event: UIEvent) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove("collapsing");
    target.classList.add("collapse");
    if (this.expanded) {
      target.style.height = "";
      target.classList.add("show");
    }
    this.transitioning = false;
  }

  render() {
    if (!this.navBarId) {
      this.navBarId = this.component.id
        ? `${this.component.id}__navbar`
        : `gx-navbar-auto-id-${autoNavBarId++}`;
    }

    const navBarNavId = `${this.navBarId}_navbarNav`;

    const header = this.component.element.querySelector(
      "[slot='header']"
    ) as HTMLImageElement;
    if (header) {
      header.classList.add("d-inline-block", "align-top");
      header.alt = header.alt || "";
    }

    return (
      <nav
        id={this.navBarId}
        class={{
          "bg-white": true,
          navbar: true,
          "navbar-expand-sm": true,
          "navbar-light": true,
          [this.component.cssClass]: !!this.component.cssClass
        }}
      >
        <a class="navbar-brand" tabindex="-1">
          <slot name="header" />
          {this.component.caption}
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-target={`#${navBarNavId}`}
          aria-controls={navBarNavId}
          aria-expanded={this.expanded}
          aria-label={this.component.toggleButtonLabel}
          onClick={this.toggleCollapseHandler.bind(this)}
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div
          class={{
            collapse: true,
            "navbar-collapse": true,
            show: this.expanded
          }}
          id={navBarNavId}
          ref={(el: HTMLElement) => {
            // Had to subscribe to the transitionend this way because onTransitionEnd attribute is not working
            el.addEventListener(
              "transitionend",
              this.handleTransitionEnd.bind(this)
            );
          }}
          // onTransitionEnd={this.handleTransitionEnd.bind(this)}
        >
          <div class="navbar-nav">
            <slot />
          </div>
        </div>
      </nav>
    );
  }
}

let autoNavBarId = 0;
