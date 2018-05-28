export default function imageResolver({ image }) {
  return (
    <gx-image
      data-internal-id={image["@id"]}
      src={image["@image"]}
      css-class={image["@class"]}
    />
  );
}
