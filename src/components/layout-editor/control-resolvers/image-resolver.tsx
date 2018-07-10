export default function imageResolver({ image }) {
  return (
    <gx-image
      alt={image["@controlName"]}
      data-gx-le-control-id={image["@controlName"]}
      src={image["@image"]}
      css-class={image["@class"]}
    />
  );
}
