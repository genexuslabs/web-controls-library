export default function componentResolver({ component }) {
  return (
    <div data-gx-le-control-id={component["@id"]}>
      {component["@controlName"]}
      {component["@webObject"] ? ":" + component["@webObject"] : ""}
    </div>
  );
}
