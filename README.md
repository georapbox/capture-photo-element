[demo]: https://georapbox.github.io/capture-photo-element/
[getUserMedia]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
[MediaDevices]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
[constraints]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#parameters
[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements
[license]: https://georapbox.mit-license.org/@2022

# &lt;capture-photo&gt; element

A custom element that implements the [MediaDevices.getUserMedia()][getUserMedia] method of the [MediaDevices][MediaDevices] interface to capture a photo in the browser.

[API documentation](#api) &bull; [Demo][demo]

## Usage

### Script

```js
import { CapturePhoto } from '<YOUR_PATH>/capture-photo.js';

// By default, the element is not automatically defined to offer more flexibility.
CapturePhoto.defineCustomElement();
```

### Markup

```html
<capture-photo facing-mode="environment" camera-resolution="320x240"></capture-photo>
```

### Style

By default, the component is style-free to remain as less opinionated as possible. However, you can style the various elements of the component using the `::part()` CSS pseudo-elements provided for this purpose. Below are demonstrated all available parts for styling.

```css
capture-photo:not(:defined) {
  /* Host element - not defined state */
}

capture-photo {
  /* Host element */
}

capture-photo::part(video) {
  /* The video element */
}

capture-photo::part(actions-container) {
  /* Actions container element - where actions buttons are placed */
}

capture-photo::part(capture-button) {
  /* The button responsible to take picture */
}

capture-photo::part(facing-mode-button) {
  /* The button responsible to change camera's facing mode */
}

capture-photo::part(capture-button capture-button--disabled),
capture-photo::part(facing-mode-button facing-mode-button--disabled) {
  /* Disabled state for actions buttons */
}

capture-photo::part(output-container) {
  /* Output container - where the final output photo is placed */  
}

capture-photo::part(output-image) {
  /* The generated photo */
}
```

## API

### Properties/Attributes
| Property | Attribute | Type | Default | Description |
| -------- | --------- | ---- | ------- | ----------- |
| `outputDisabled` | `output-disabled` | Boolean | `false` | Optional. Defines if the generated image is added in DOM. Use it if you don't need to display the generated image or if you need to display it somewhere else in DOM. |
| `actionsDisabled` | `actions-disabled` | Boolean | `false` | Optional. Defines if the actions buttons are disabled or not. You won't probably need to use this. It's mostly used internally to temporarily disble actions buttons when video stream is not ready, to avoid unnecessary errors. |
| `facingMode` | `facing-mode` | String | `'user'`| Optional. The preferred camera to be used if the device supports more than one (mostly for mobile devices). Available values: "user" and "environment" for the front and the rear camera accordingly. |
| `cameraResolution` | `camera-resolution` | String | `null` | Optional. Defines the ideal camera resolution constraint. It must be of the format `[width]x[height]`, eg `640x480`. The browser will try to honour this, but may return other resolutions if an exact match is not available. Please refer to [constraints documentation][constraints] for more details of how constraints work. |
| `zoom` | `zoom` | Number | `null` | Optional. Defines the camera's zoom level if supported by the device. |

All properties reflect their values as HTML attributes to keep the element's DOM representation in sync with its JavaScript state.

### Slots

| Name | Description |
| ---- | ----------- |
| `capture-button` | Override the default capture photo button with your own. It is important to note that you will need to provide the `behavior="button"` attribute to your element, to tell the browser that this is the element you want to use as the new capture button. |
| `capture-button-content` | Override the default content of the capture photo button with your own content. |
| `facing-mode-button` | Override the default facing mode button with your own. It is important to note that you will need to provide the `behavior="button"` attribute to your element, to tell the browser that this is the element you want to use as the new facing mode button. |
| `facing-mode-button-content` | Override the default content of the facing mode button with your own content. |

#### Slots usage examples

##### Override the default buttons with your own elements

```html
<capture-photo>
  <button slot="capture-button" behavior="button" type="button">
    Take picture
  </button>
  
  <a slot="facing-mode-button" behavior="button" href="#" role="button">
    Change camera
  </a>
</capture-photo>
```

##### Override just the content of the default buttons

```html
<capture-photo>
  <span slot="capture-button-content">Take picture</span>
  
  <span slot="facing-mode-button-content">Change camera</span>
</capture-photo>
```

### CSS Parts

| Name | Description |
| ---- | ----------- |
| `video` | The video element. |
| `actions-container` | The action buttons container element. |
| `capture-button` | The capture photo button. |
| `capture-button--disabled` | The capture photo button when is disabled. |
| `facing-mode-button` | The facing mode button. |
| `facing-mode-button--disabled` | The facing mode button when is disabled. |
| `output-container` | The output container element. |
| `output-image` | The output image element. |

### Methods

| Name | Type | Description | Arguments |
| ---- | ---- | ----------- | --------- |
| `defineCustomElement` | Static | Defines/registers the custom element with the name provided. If no name is provided, the default name is used. The method checks if the element is already defined, hence will skip trying to redefine it. | `elementName='capture-photo'` |
| `takePicture` | Prototype | Captures a photo using the element's properties. | - |

### Events

`capture-photo:facing-mode-change` - Emitted when the camera's facing mode changes.

```js
document.addEventListener('capture-photo:facing-mode-change', evt => {
  console.log(evt.detail); // => { facingMode: 'environment' }
});
```

`capture-photo:camera-resolution-change` - Emitted when the camera's resolution changes.

```js
document.addEventListener('capture-photo:camera-resolution-change', evt => {
  console.log(evt.detail); // => { cameraResolution: '640x480' }
});
```

`capture-photo:zoom-change` - Emitted when the camera's zoom level changes.

```js
document.addEventListener('capture-photo:zoom-change', evt => {
  console.log(evt.detail); // => { zoom: 2 }
});
```

`capture-photo:success` - Emitted when a photo is captured successfully.

```js
document.addEventListener('capture-photo:success', evt => {
  console.log(evt.detail); // => { dataURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAA...', width: 640, height: 480 }
});
```

`capture-photo:error` - Emitted when an error occurs. An error might occur because camera permission is denied, a photo cannot be captured for any reason, the video stream cannot start for any reason, etc.

```js
document.addEventListener('capture-photo:error', evt => {
  console.log(evt.detail); // => { error: DOMException: Permission denied }
});
```

## Example

Below is a full usage example, with custom configuration and styling. Check the [demo page][demo] for a demonstration.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>capture-photo-element demo</title>
  <style>
    capture-photo:not(:defined) {
      display: none;
    }

    capture-photo {
      overflow: hidden;
    }

    capture-photo::part(video) {
      width: 100%;
      padding: 1rem 1rem 0 1rem;
      background-color: #000000;
    }

    capture-photo::part(actions-container) {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      padding: 1rem 0;
      margin-bottom: 1rem;
      background-color: #000000;
    }

    capture-photo::part(capture-button) {
      margin-left: calc(40px + 2rem); /* facing mode button width + actions buttons gap */
      min-width: 60px;
      width: 60px;
      height: 60px;
      background-color: #cccccc;
      border: 5px solid #383838;
      color: #000000;
      border-radius: 50%;
      font-size: 1rem;
      cursor: pointer;
      text-indent: -9999px;
      overflow: hidden;
      -webkit-appearance: none;
      -moz-appearance: none;
    }

    capture-photo::part(facing-mode-button) {
      min-width: 40px;
      width: 40px;
      height: 40px;
      background-color: #ffffff;
      border: 0;
      line-height: 1;
      border-radius: 50%;
      cursor: pointer;
      -webkit-appearance: none;
      -moz-appearance: none;
    }

    capture-photo::part(capture-button capture-button--disabled),
    capture-photo::part(facing-mode-button facing-mode-button--disabled) {
      opacity: 0.5;
      cursor: not-allowed;
    }

    capture-photo::part(output-container) {
      overflow-x: auto;
    }

    capture-photo::part(output-image) {
      max-width: 300px;
      height: auto;
      border: 5px solid #000;
    }
  </style>
</head>
<body>
  <capture-photo>
    <span slot="facing-mode-button-content">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
        <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
      </svg>
    </span>
  </capture-photo>

  <script type="module">
    import { CapturePhoto } from './capture-photo.js';

    CapturePhoto.defineCustomElement();
  </script>
</body>
</html>
```

## Browser support

Browsers without native [custom element support][support] require a [polyfill][polyfill].

- Firefox
- Chrome
- Microsoft Edge
- Safari

## License

[The MIT License (MIT)][license]
