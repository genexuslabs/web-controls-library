import { h } from "@stencil/core";

export function imagePositionRender(slots: {
  default;
  disabledImage;
  mainImage;
}) {
  return [slots.mainImage, slots.disabledImage, <span>{slots.default}</span>];
}

const DEFAULT_IMAGE_POSITION = "above";
export function imagePositionClass(
  imagePosition: "above" | "before" | "after" | "below" | "behind"
) {
  return `gx-image-position--${imagePosition || DEFAULT_IMAGE_POSITION}`;
}

export const hideMainImageWhenDisabledClass = "gx-image-position--hide-main";
