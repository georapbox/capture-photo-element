const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      all: initial;
      display: block;
    }
  </style>

  <div>
    Custom element markup goes here
  </div>
`;

export class CapturePhoto extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // TODO Setup component initialization
  }

  disconnectedCallback() {
    // TODO Clean up
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // TODO
  }

  static get observedAttributes() {
    // TODO
    return [];
  }

  static defineCustomElement(elementName = 'capture-photo') {
    try {
      if (!window.customElements.get(elementName)) {
        window.customElements.define(elementName, CapturePhoto);
      }
    } catch (err) {
      console.error(err);
    }
  }
}
