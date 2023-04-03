# GX Dynamic Menu

This is a dynamic menu of components for genexus.

### Node Modules

- Run `npm install gx-dynamic-menu --save`
- Then you can use the element anywhere in your template, JSX, html etc

### Example

```html
<dynamic-menu css-class="gx-dynamic-menu">
  <dynamic-menu-action popup-id="pop1" slot="menuitems">
    <div slot="data">Some content here...</div>
    <div slot="right">
      <button>Press me</button>
    </div>
  </dynamic-menu-action>

  <dynamic-menu-popup id="pop1" slot="menupopup">
    <div slot="data">Popup content here...</div>
  </dynamic-menu-popup>
</dynamic-menu>
```

<!-- Auto Generated Below -->

## Properties

| Property   | Attribute   | Description                                             | Type     | Default     |
| ---------- | ----------- | ------------------------------------------------------- | -------- | ----------- |
| `cssClass` | `css-class` | A CSS class to set as the `dynamic-menu` element class. | `string` | `undefined` |
| `openItem` | `open-item` | This attribute specifies which must be open by default. | `string` | `undefined` |

## Events

| Event                  | Description                                        | Type                                     |
| ---------------------- | -------------------------------------------------- | ---------------------------------------- |
| `dynamicMenuActivated` | Fired when the menu container is opened or closed. | `CustomEvent<DynamicMenuActivatedEvent>` |

## Slots

| Slot          | Description                           |
| ------------- | ------------------------------------- |
| `"menuitems"` | The slot where live the menu actions. |
| `"menupopup"` | The slot where live the menu popups.  |

## Shadow Parts

| Part             | Description                    |
| ---------------- | ------------------------------ |
| `"menu-content"` | The container of dynamic-menu. |

---

_Built with [StencilJS](https://stenciljs.com/)_
