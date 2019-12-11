import { h } from "@stencil/core";
import { Renderer } from "../../../common/interfaces";
import { NavBar } from "../../../navbar/navbar";

let autoNavBarId = 0;

export class NavBarRender implements Renderer {
  constructor(private component: NavBar) {
    this.toggleCollapseHandler = this.toggleCollapseHandler.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

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
    requestAnimationFrame(() => {
      this.transitioning = true;
      target.style.height = `${target.scrollHeight}px`;
      if (!this.hasTransition(target)) {
        this.finishExpandCollapse(target);
      } else {
        this.ensureFinishExpandCollapse(target);
      }
    });
  }

  private collapse(target: HTMLElement, animate = true) {
    if (this.transitioning) {
      return;
    }

    this.expanded = false;
    if (animate) {
      target.style.height = getComputedStyle(target).height;
      target.classList.add("collapsing");
    }
    target.classList.remove("show");
    target.classList.remove("collapse");
    if (animate) {
      requestAnimationFrame(() => {
        this.transitioning = true;
        target.style.height = "";
        if (!this.hasTransition(target)) {
          this.finishExpandCollapse(target);
        } else {
          this.ensureFinishExpandCollapse(target);
        }
      });
    } else {
      this.finishExpandCollapse(target);
    }
  }

  private ensureFinishExpandCollapse(target: HTMLElement) {
    setTimeout(() => {
      if (this.transitioning) {
        this.finishExpandCollapse(target);
      }
    }, 500);
  }

  private hasTransition(el: HTMLElement) {
    return (
      getComputedStyle(el).getPropertyValue("transition") !== "none 0s ease 0s"
    );
  }

  private handleTransitionEnd(event: UIEvent) {
    this.finishExpandCollapse(event.currentTarget as HTMLElement);
  }

  private finishExpandCollapse(target: HTMLElement) {
    target.classList.remove("collapsing");
    target.classList.add("collapse");
    if (this.expanded) {
      target.style.height = "";
      target.classList.add("show");
    }
    this.transitioning = false;
  }

  handleItemClick(event: UIEvent) {
    const targetElement = event.target as HTMLEmbedElement;
    if (targetElement.matches("gx-navbar-link a")) {
      const collapseElement = this.component.element.querySelector(
        ".navbar-collapse"
      ) as HTMLElement;
      this.collapse(collapseElement, false);
    }
  }

  render(slots: { default; header }) {
    const navbar = this.component;
    if (!this.navBarId) {
      this.navBarId = navbar.element.id
        ? `${navbar.element.id}__navbar`
        : `gx-navbar-auto-id-${autoNavBarId++}`;
    }

    const navBarNavId = `${this.navBarId}_navbarNav`;

    const header = navbar.element.querySelector(
      "[slot='header']"
    ) as HTMLImageElement;
    if (header !== null) {
      header.classList.add("d-inline-block", "align-top");
      header.alt = header.alt || "";
    }

    return [
      <gx-bootstrap />,
      <nav
        id={this.navBarId}
        class={{
          "bg-white": true,
          navbar: true,
          "navbar-expand-sm": true,
          "navbar-light": true,
          [navbar.cssClass]: !!navbar.cssClass
        }}
        onClick={this.handleItemClick}
      >
        <a class="navbar-brand" tabindex="-1">
          {slots.header}
          {navbar.caption}
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-target={`#${navBarNavId}`}
          aria-controls={navBarNavId}
          aria-expanded={this.expanded}
          aria-label={navbar.toggleButtonLabel}
          onClick={this.toggleCollapseHandler}
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
            el.addEventListener("transitionend", this.handleTransitionEnd);
          }}
          // onTransitionEnd={this.handleTransitionEnd}
        >
          <div class="navbar-nav">{slots.default}</div>
        </div>
      </nav>
    ];
  }
}
