export default function textblockResolver({ textblock }) {
  return (
    <gx-textblock data-internal-id={textblock["@id"]}>
      {textblock["@caption"]}
    </gx-textblock>
  );
}
