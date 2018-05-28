const imagePositionMap = {
  "Above Text": "above",
  "After Text": "after",
  "Before Text": "before",
  "Behind Text": "behind",
  "Below Text": "below"
};

export default function actionResolver({ action }) {
  return (
    <gx-button
      css-class={action["@class"]}
      data-internal-id={action["@id"]}
      disabled={action["@enabled"] === "False"}
      image-position={imagePositionMap[action["@imagePosition"]]}
    >
      {action["@image"] && <img slot="main-image" src={action["@image"]} />}
      {action["@disabledImage"] && (
        <img slot="disabled-image" src={action["@disabledImage"]} />
      )}
      {action["@caption"]}
    </gx-button>
  );
}
