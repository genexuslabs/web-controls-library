import { h } from "@stencil/core";
import { IRenderer } from "../../../common/interfaces";
import { Message } from "../../../message/message";

const TYPE_TO_CLASS_MAPPING = {
  error: "alert-danger",
  info: "alert-info",
  warning: "alert-warning"
};

const DEFAULT_SHOW_WAIT = 100;

export class MessageRender implements IRenderer {
  constructor(public component: Message) {}

  private dismissing = false;

  private wrapperClass() {
    const typeClass =
      TYPE_TO_CLASS_MAPPING[this.component.type] || "alert-info";
    return {
      alert: true,
      [`${typeClass}`]: true,
      "alert-dismissible": true,
      fade: true
    };
  }

  private dismiss() {
    if (!this.dismissing) {
      this.dismissing = true;
      this.component.element.querySelector(".alert").classList.remove("show");
    }
  }

  private transitionEnd() {
    if (this.dismissing) {
      const message = this.component;
      if (message.element) {
        message.element.parentNode.removeChild(message.element);
      }
    }
  }

  componentDidLoad() {
    const message = this.component;
    const anchors = message.element.querySelectorAll("a");
    Array.from(anchors).forEach(a => a.classList.add("alert-link"));

    setTimeout(() => {
      message.element.querySelector(".alert").classList.add("show");

      if (message.duration) {
        setTimeout(() => {
          this.dismiss();
        }, message.duration);
      }
    }, DEFAULT_SHOW_WAIT);
  }

  render(slots) {
    const message = this.component;

    return [
      <gx-bootstrap />,
      <div
        class={this.wrapperClass()}
        role="alert"
        onTransitionEnd={this.transitionEnd.bind(this)}
      >
        {slots.default}
        {message.showCloseButton ? (
          <button
            type="button"
            class="close"
            aria-label={message.closeButtonText}
            onClick={this.dismiss.bind(this)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        ) : null}
      </div>
    ];
  }
}
