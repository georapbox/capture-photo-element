# CHANGELOG

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
