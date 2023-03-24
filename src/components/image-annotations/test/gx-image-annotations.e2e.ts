import { newE2EPage } from '@stencil/core/testing';

describe('gx-image-annotations', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<gx-image-annotations></gx-image-annotations>');

    const element = await page.find('gx-image-annotations');
    expect(element).toHaveClass('hydrated');
  });
});
