type Constructor<T> = new (...args: any[]) => T;

const TYPE_TO_CLASS_MAPPING = {
  error: "alert-danger",
  info: "alert-info",
  warning: "alert-warning"
};

const DEFAULT_SHOW_WAIT = 100;

export function MessageRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    element: HTMLElement;
    showCloseButton: boolean;
    closeButtonText: string;
    type: string;
    duration: number;

    private dismissing = false;

    private wrapperClass() {
      const typeClass = TYPE_TO_CLASS_MAPPING[this.type] || "alert-info";
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
        this.element.querySelector(".alert").classList.remove("show");
      }
    }

    private transitionEnd() {
      if (this.dismissing) {
        if (this.element) {
          this.element.parentNode.removeChild(this.element);
        }
      }
    }

    componentDidLoad() {
      const anchors = this.element.querySelectorAll("a");
      Array.from(anchors).forEach(a => a.classList.add("alert-link"));

      setTimeout(() => {
        this.element.querySelector(".alert").classList.add("show");

        if (this.duration) {
          setTimeout(() => {
            this.dismiss();
          }, this.duration);
        }
      }, DEFAULT_SHOW_WAIT);
    }

    render() {
      return (
        <div
          class={this.wrapperClass()}
          role="alert"
          onTransitionEnd={this.transitionEnd.bind(this)}
        >
          <slot />
          {this.showCloseButton ? (
            <button
              type="button"
              class="close"
              aria-label={this.closeButtonText}
              onClick={this.dismiss.bind(this)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          ) : null}
        </div>
      );
    }
  };
}
