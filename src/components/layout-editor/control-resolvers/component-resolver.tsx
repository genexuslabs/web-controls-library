export default function componentResolver({ component }) {
  return (
    <div data-gx-le-control-id={component["@controlName"]}>
      {component["@controlName"]}
      {component["@webObject"] ? ":" + component["@webObject"] : ""}
    </div>
  );
}
