type Constructor<T> = new (...args: any[]) => T;
export function ProgressBarRender<T extends Constructor<{}>>(Base: T) {
  return class extends Base {
    value: number;
    render() {
      return (
        <div class="progress">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated bg-primary"
            style={{ width: this.value + "%" }}
            aria-valuenow={this.value}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <slot />
          </div>
        </div>
      );
    }
  };
}
