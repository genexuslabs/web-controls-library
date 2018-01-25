import { flush, render } from '@stencil/core/testing';
import { Button } from './button';

describe('gx-textblock', () => {
  it('should build', () => {
    expect(new Button()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [Button],
        html: '<gx-button>Hello world!</gx-button>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent.trim()).toEqual('Hello world!');
    });
  });
});
