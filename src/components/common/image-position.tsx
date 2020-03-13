import { h } from "@stencil/core";

export function imagePositionRender(slots: {
  default;
  disabledImage;
  mainImage;
}) {
  return [slots.mainImage, slots.disabledImage, <span>{slots.default}</span>];
}

export function imagePositionClass(
  imagePosition: "above" | "before" | "after" | "below" | "behind" = "above"
) {
  return `gx-image-position--${imagePosition}`;
}

export const hideMainImageWhenDisabledClass = "gx-image-position--hide-main";
