import { flush, render } from '@stencil/core/testing';
import { TextBlock } from './textblock';

describe('gx-textblock', () => {
  it('should build', () => {
    expect(new TextBlock()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [TextBlock],
        html: '<gx-textblock>Hello world!</gx-textblock>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent.trim()).toEqual('Hello world!');
    });
  });
});
