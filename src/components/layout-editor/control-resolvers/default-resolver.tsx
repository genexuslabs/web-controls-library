export default function defaultResolver(control) {
  const childControl = control[control.childControlType];
  return (
    <div
      data-gx-le-control-id={childControl["@id"]}
      data-gx-le-control-obj={JSON.stringify(control)}
      data-gx-le-default-render=""
    >
      {`<${control.controlType}`}: {`${childControl["@controlName"]}>`}
    </div>
  );
}
