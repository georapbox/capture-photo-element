# &lt;capture-photo&gt; element

A custom element that enables to capture a photo in the browser.

Demo page: https://georapbox.github.io/capture-photo-element/

## Usage

### Script
```js
import { CapturePhoto } from '<YOUR_PATH>/capture-photo.js';

CapturePhoto.defineCustomElement();

// Alternatively, you can use the `CustomElementRegistry.define()` method to define the element,
// which is what the `CapturePhoto.defineCustomElement()` static method uses under the hood.
window.customElements.define('capture-photo', CapturePhoto);
```

### Markup
```html
<!-- Usage with defaults -->
<capture-photo></capture-photo>

TODO: Customize with attributes
```

### Style
```css
/* Custom styling */

TODO: Add custom styles
```

## Properties
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |

TODO: Add properties documentation

All properties reflect their values as HTML attributes to keep the element's DOM representation in sync with its JavaScript state.

## Static methods

### CapturePhoto.defineCustomElement(elementName='capture-photo')

Defines/registers the custom element with the name provided. If no name is provided, the default name is used. The method checks if the element is already defined, hence will skip trying to redefine it.

| Param | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| elementName | `string` | `capture-photo` | Name for the new custom element |

## Events

TODO: Add Events documentation

## Browser support

Browsers without native [custom element support][support] require a [polyfill][polyfill].

- Firefox
- Chrome
- Microsoft Edge
- Safari

[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements

## License

[The MIT License (MIT)](https://georapbox.mit-license.org/@2022)
