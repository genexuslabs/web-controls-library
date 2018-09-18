export default function defaultResolver(control) {
  return (
    <div
      data-gx-le-control-obj={JSON.stringify(control)}
      data-gx-le-default-render=""
    >
      {"<"}
      {control.controlType}: {control[control.childControlType]["@controlName"]}
      {">"}
    </div>
  );
}
