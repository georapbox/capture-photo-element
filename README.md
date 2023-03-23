[![npm version](https://img.shields.io/npm/v/@georapbox/capture-photo-element.svg)](https://www.npmjs.com/package/@georapbox/capture-photo-element)
[![npm license](https://img.shields.io/npm/l/@georapbox/capture-photo-element.svg)](https://www.npmjs.com/package/@georapbox/capture-photo-element)

[demo]: https://georapbox.github.io/capture-photo-element/
[getUserMedia]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
[MediaDevices]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
[constraints]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#parameters
[license]: https://georapbox.mit-license.org/@2022
[changelog]: https://github.com/georapbox/capture-photo-element/blob/main/CHANGELOG.md

# &lt;capture-photo&gt;

A custom element that implements the [MediaDevices.getUserMedia()][getUserMedia] method of the [MediaDevices][MediaDevices] interface to capture a photo in the browser.

[API documentation](#api) &bull; [Demo][demo]

## Install

```sh
$ npm install --save @georapbox/capture-photo-element
```

## Usage

### Script

```js
import { CapturePhoto } from './node_modules/@georapbox/capture-photo-element/dist/capture-photo.js';

// Manually define the element.
CapturePhoto.defineCustomElement();
```

Alternatively, you can import the automatically defined custom element.

```js
import './node_modules/@georapbox/capture-photo-element/dist/capture-photo-defined.js';
```

### Markup

```html
<capture-photo facing-mode="environment" camera-resolution="320x240"></capture-photo>
```

### Style

By default, the component is style-free to remain as less opinionated as possible. However, you can style the various elements of the component using the `::part()` CSS pseudo-elements provided for this purpose. Below are demonstrated all available parts for styling.

```css
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

capture-photo::part(output-container) {
  /* Output container - where the final output photo is placed */  
}

capture-photo::part(output-image) {
  /* The generated photo */
}
```

## API

### Properties
| Name | Reflects | Type | Required | Default | Description |
| ---- | -------- | ---- | -------- | ------- | ----------- |
| `noImage`<br>*`no-image`* | ✓ | Boolean | - | `false` | Defines if the generated image is added in DOM. Use it if you don't need to display the generated image or if you need to display it somewhere else in DOM. |
| `facingMode`<br>*`facing-mode`*<sup>1</sup> | ✓ | String | - | `null` | The preferred camera to be used if the camera hardware supports more than one (mostly for mobile devices). Available values: "user" and "environment" for the front and the rear camera respectively. |
| `cameraResolution`<br>*`camera-resolution`*<sup>1</sup> | ✓ | String | - | `null` | Defines the ideal camera resolution constraint. It must be of the format `[width]x[height]`, eg `640x480`. The browser will try to honour this, but may return other resolutions if an exact match is not available. You can access the min & max supported values for width and height, using `getTrackCapabilities().width` and `getTrackCapabilities().height` respectively. |
| `pan`<sup>1</sup> | ✓ | Number | - | `null` | Defines the camera's pan level if supported by the camera hardware. You can access the min & max supported values for pan level, using `getTrackCapabilities().pan`. |
| `tilt`<sup>1</sup> | ✓ | Number | - | `null` | Defines the camera's tilt level if supported by the camera hardware. You can access the min & max supported values for tilt level, using `getTrackCapabilities().tilt`. |
| `zoom`<sup>1</sup> | ✓ | Number | - | `null` | Defines the camera's zoom level if supported by the camera hardware. You can access the min & max supported values for zoom level, using `getTrackCapabilities().zoom`. |
| `loading` | ✓ | Boolean | - | `false` | **Readonly**. Indicates if the component is ready for interaction. It is used internally but is also exposed as a readonly property for purposes such as styling, etc. |
| `calculateFileSize`<br>*`calculate-file-size`* | ✓ | Boolean | - | `false` | Indicates if the component should calculate the file size of the generated image. If set to `true` the file size (in bytes) will be included in the event detail object when the `capture-photo:success` event is fired. The reason for not calculating the file size by default is that it might be an "expensive" operation, especially for large images, therefore it is recommended to set this property to `true` only if you need the file size. |

<sup>1</sup> Changing any of these properties/attributes may not always guarantee the desired result, because they all depend on the camera hardware support. For example, `zoom=3` might not result to the camera to zoom if the camera hardware does not support zooming. Using `getTrackCapabilities()` and `getTrackSettings()` can prove helpful to check the campera hardware support.

### Slots

| Name | Description |
| ---- | ----------- |
| `capture-button` | Override the default capture photo button with your own. |
| `capture-button-content` | Override the default content of the capture photo button with your own content. |
| `facing-mode-button` | Override the default facing mode button with your own. If `facingMode` is not supported in constrainable properties for the current `MediaStreamTrack`, the slot is hidden. |
| `facing-mode-button-content` | Override the default content of the facing mode button with your own content. |
| `actions` | Slot to add content inside the actions container element. |
| (default) | Un-named slot to add content inside the component. |

#### Slots usage examples

##### Override the default buttons with your own elements

```html
<capture-photo>
  <button slot="capture-button" type="button">
    Take picture
  </button>
  
  <a slot="facing-mode-button" href="#" role="button">
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
| `facing-mode-button` | The facing mode button. |
| `output-container` | The output container element. |
| `output-image` | The output image element. |

### Methods

| Name | Type | Description | Arguments |
| ---- | ---- | ----------- | --------- |
| `defineCustomElement` | Static | Defines/registers the custom element with the name provided. If no name is provided, the default name is used. The method checks if the element is already defined, hence will skip trying to redefine it. | `elementName='capture-photo'` |
| `isSupported` | Static | Returns `true` if `MediaDevices.getUserMedia()` is supported by the platform, otherwise returns `false`. | - |
| `capture`<sup>1</sup> | Prototype | Captures a photo using the element's properties. | - |
| `getSupportedConstraints`<sup>1</sup> | Prototype | Returns an object based on the `MediaTrackSupportedConstraints` dictionary, whose member fields each specify one of the constrainable properties the user agent understands. [Read more...](https://developer.mozilla.org/docs/Web/API/MediaDevices/getSupportedConstraints) | - |
| `getTrackCapabilities`<sup>1</sup> | Prototype | Returns a `MediaTrackCapabilities` object which specifies the values or range of values which each constrainable property, based upon the platform and user agent. [Read more...](https://developer.mozilla.org/docs/Web/API/MediaStreamTrack/getCapabilities) | - |
| `getTrackSettings`<sup>1</sup> | Prototype | Returns a `MediaTrackSettings` object containing the current values of each of the constrainable properties for the current MediaStreamTrack. [Read more...](https://developer.mozilla.org/docs/Web/API/MediaStreamTrack/getSettings) | - |
| `startVideoStream`<sup>1</sup> | Prototype | Starts the video stream. Use this method if you want to start the video stream manually, if you have previously stopped it using `stopVideoStream()`. | - |
| `stopVideoStream`<sup>1</sup> | Prototype | Stops the video stream and releases the camera. Use this method if you want to stop the video stream manually. | - |

<sup>1</sup> These methods are only available after the component has been defined. To ensure the component is defined, you can use `whenDefined` method of the `CustomElementRegistry` interface, eg `customElements.whenDefined('capture-photo').then(() => { /* call methods here */ });`

### Events

| Name | Description | Event Detail |
| ---- | ----------- | ------------ |
| `capture-photo:video-play` | Emitted when camera's video stream starts playing. It is triggered during initial load, or when facing mode or camera resolution mode change are requested. | `{ video: HTMLVideoElement }` |
| `capture-photo:success` | Emitted when a photo is captured successfully. | `{ dataURI: string, width: number, height: number, size?: number }` |
| `capture-photo:error` | Emitted when an error occurs. An error might occur because camera permission is denied, a photo cannot be captured for any reason, the video stream cannot start for any reason, etc. | `{ error: DOMException }` |

## Changelog

For API updates and breaking changes, check the [CHANGELOG][changelog].

## License

[The MIT License (MIT)][license]
