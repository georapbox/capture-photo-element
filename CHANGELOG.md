# CHANGELOG

## v4.1.0 (2024-08-21)

- Add support for `torch` property to turn on/off the fill light if supported by the camera hardware.
- Replace parcel with esbuild for bundling.
- Update ESLint to use flat configuration.
- Use Prettier for code formatting.
- Update dev dependencies.

## v4.0.1 (2023-12-27)

- Fix bug that set the camera resolution to the lowest value when `camera-resolution` attribute was not provided. This was a regression introduced in `v4.0.0`.

## v4.0.0 (2023-12-27)

## Breaking Changes

- As of `v4.0.0`, the video stream will not start automatically when the component is connected to the DOM. If you want to start the video stream automatically, you can use the `auto-play` attribute.
- Change the default value of property `facingMode` from `null` to `"user"`.
- Change the default value of property `cameraResolution` from `null` to `""`.
- Change the default value of property `pan` from `null` to `0`.
- Change the default value of property `tilt` from `null` to `0`.
- Change the default value of property `zoom` from `null` to `1`.

## Other Changes

- Add types declarations.
- Update dev dependencies.

## v3.2.1 (2023-03-25)

- Fix throwing Uncaught TypeError when totally removing attribute `camera-resolution`.

## v3.2.0 (2023-03-23)

- Add public methods `startVideoStream()` and `stopVideoStream()` to start and stop the video stream respectively.
- Add `calculate-file-size` attribute to optionally calculate the file size of the generated image and add it to the `capture-photo:success` event detail object.
- Update `devDependencies`.

## v3.1.0 (2022-12-01)

- Add a default un-named slot to add content inside the component.
- Add `actions` slot to add content inside the actions container element.

## v3.0.0 (2022-11-25)

### Breaking Changes

- Remove the following events: `capture-photo:facing-mode-change`, `capture-photo:camera-resolution-change` and `capture-photo:zoom-change`. The reason for removing them is because they would be emitted every time a relevant property/attribute would change but there was no guarantee that the value updated, was supported by the camera hardware.

### Other Changes

- Add `pan` and `tilt` properties to support panning and tilting respectively if supported by the camera harware.
- Add public methods `getSupportedConstraints()`, `getTrackCapabilities()` and `getTrackSettings()`.
- Hide `facing-mode-slot` by default and display it only if `facingMode` is supported by device.

## v2.0.0 (2022-11-18)

### Breaking Changes

- Rename property `outputDisabled` and attribute `output-disabled` to `noImage` and `no-image` accordingly.
- Only minified production builds will be included in the `dist` folder from now on.

### Other Changes

- Refactor to use private class fields.
- Replace rollup.js with parcel.js for bundling.
- Update dev dependencies.

## v1.3.1 (2022-10-20)

- Fix issue [#2](https://github.com/georapbox/capture-photo-element/issues/2)
- Ensure that when changing `facing-mode`, `camera-resolution` and `zoom` attributes, any side effect won't be triggered if the old value is the same as the new value passed.

## v1.3.0 (2022-10-17)

- Remove `loading` attribute if `mediaDevices.getUserMedia()` fails.
- Dispatch `capture-photo:video-play` when video starts playing.
- Update dev dependencies.

## v1.2.4 (2022-07-26)

- Update Events section in documentation.
- Update tests for dispatched events in order to also test `event.detail` values.
- Update dev dependencies.

## v1.2.3 (2022-06-27)

- Use `composed: true` for all dispatched events, to make them propagate across the shadow DOM boundary into the standard DOM.

## v1.2.2 (2022-06-07)

- Use `HTMLSlotElement.assignedElements()` method instead of `HTMLSlotElement.assignedNodes()` to get the elements assigned to slots.
- Minor updates to documentation.
- Update dev dependencies.


## v1.2.1 (2022-04-12)

- Check if Declarative Shadow DOM is present before imperatively attaching to host element.

## v1.2.0 (2022-04-07)

- Export the defined custom element as `capture-photo-defined.js` in case you don't want to manualy define it.
- Do not require `behavior="button"` attribute on the elements with `slot="capture-button"` and `slot="facing-mode-button"`.

## v1.1.0 (2022-03-28)

- Add readonly `loading` property to indicate if the component is ready for interaction.

## v1.0.0 (2022-03-22)

- Initial release
