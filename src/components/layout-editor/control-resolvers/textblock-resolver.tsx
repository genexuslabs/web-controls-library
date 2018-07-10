export default function textblockResolver({ textblock }) {
  return (
    <gx-textblock data-gx-le-control-id={textblock["@controlName"]}>
      {textblock["@caption"]}
    </gx-textblock>
  );
}
