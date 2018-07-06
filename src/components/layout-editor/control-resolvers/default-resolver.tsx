export default function defaultResolver(control) {
  return (
    <div data-control-obj={JSON.stringify(control)}>
      Unable to render control: Missing render
    </div>
  );
}
