import { ComponentImpl } from '../impl/component-impl';
import { Button } from './button';

export class ButtonImpl extends ComponentImpl<Button> {
  handleClick(event: UIEvent) {
    if (this.component.disabled)
      return;

    this.component.onClick.emit(event);
  }

  componentDidLoad() {
    // Main image and disabled image are set an empty alt as they are decorative images.
    const images = this.component.element.querySelectorAll('[slot="main-image"], [slot="disabled-image"]');
    Array.from(images).forEach(img => img.setAttribute('alt', ''));
  }

  render() {
    return (
      <button onClick={this.handleClick.bind(this)}>
        <slot name="main-image" />
        <slot name="disabled-image" />
        <span>
          <slot />
        </span>
      </button>
    )
  }
}
