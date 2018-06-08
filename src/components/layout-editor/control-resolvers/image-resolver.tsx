export default function imageResolver({ image }) {
  return (
    <gx-image
      data-gx-le-control-id={image["@controlName"]}
      src={image["@image"]}
      css-class={image["@class"]}
    />
  );
}
