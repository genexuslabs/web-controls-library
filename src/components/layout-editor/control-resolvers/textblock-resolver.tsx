export default function textblockResolver({ textblock }) {
  return (
    <gx-textblock data-gx-le-control-id={textblock["@id"]}>
      {textblock["@caption"]}
    </gx-textblock>
  );
}
