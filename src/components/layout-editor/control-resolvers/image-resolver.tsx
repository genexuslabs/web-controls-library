import defaultResolver from "./default-resolver";

export default function imageResolver(control) {
  const { image } = control;
  if (image.imgSrc) {
    return (
      <gx-image
        alt={image["@controlName"]}
        data-gx-le-control-id={image["@id"]}
        src={image.imgSrc}
        css-class={image["@class"]}
      />
    );
  } else {
    return defaultResolver(control);
  }
}
