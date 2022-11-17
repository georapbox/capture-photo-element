const template = document.createElement('template');

const html = String.raw;

template.innerHTML = html`
  <style>
    :host {
      all: initial;
      display: block;
      box-sizing: border-box;
    }
    :host *,
    :host *::before,
    :host *::after {
      box-sizing: inherit;
    }
    :host video {
      display: block;
    }
    :host #output:empty {
      display: none;
    }
    [hidden] {
      display: none !important;
    }
  </style>
  <video part="video" playsinline></video>
  <canvas hidden></canvas>
  <div part="actions-container">
    <slot name="capture-button">
      <button part="capture-button" type="button"><slot name="capture-button-content">Capture photo</slot></button>
    </slot>
    <slot name="facing-mode-button"><button part="facing-mode-button" type="button"><slot name="facing-mode-button-content">Toggle facing mode</slot></button></slot>
  </div>
  <div part="output-container" id="output"></div>
`;

const clamp = (value, lower, upper) => {
  if (Number.isNaN(lower)) {
    lower = 0;
  }

  if (Number.isNaN(upper)) {
    upper = 0;
  }

  return Math.min(Math.max(value, Math.min(lower, upper)), Math.max(lower, upper));
};

class CapturePhoto extends HTMLElement {
  #connected;
  #supportedConstraints;
  #stream;
  #canvasElement;
  #outputElement;
  #videoElement;
  #captureButtonSlot;
  #captureButton;
  #facingModeButtonSlot;
  #facingModeButton;

  constructor() {
    super();

    this.#connected = false;
    this.#supportedConstraints = CapturePhoto.isSupported() ? navigator.mediaDevices.getSupportedConstraints() : {};

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  connectedCallback() {
    this.#connected = true;
    this.#canvasElement = this.shadowRoot.querySelector('canvas');
    this.#outputElement = this.shadowRoot.getElementById('output');
    this.#videoElement = this.shadowRoot.querySelector('video');
    this.#videoElement && this.#videoElement.addEventListener('loadedmetadata', this.#onVideoLoadedMetaData);
    this.#captureButtonSlot = this.shadowRoot.querySelector('slot[name="capture-button"]');
    this.#captureButtonSlot && this.#captureButtonSlot.addEventListener('slotchange', this.#onCaptureButtonSlotChange);
    this.#captureButton = this.#getCaptureButton();
    this.#captureButton && this.#captureButton.addEventListener('click', this.#onCapturePhotoButtonClick);
    this.#facingModeButtonSlot = this.shadowRoot.querySelector('slot[name="facing-mode-button"]');
    this.#facingModeButtonSlot && this.#facingModeButtonSlot.addEventListener('slotchange', this.#onFacingModeButtonSlotChange);
    this.#facingModeButton = this.#getFacingModeButton();

    if (this.#facingModeButton) {
      if (this.#supportedConstraints.facingMode) {
        this.#facingModeButton.addEventListener('click', this.#onFacingModeButtonClick);
      } else {
        this.#facingModeButton.hidden = true;
      }
    }

    this.#upgradeProperty('outputDisabled');
    this.#upgradeProperty('facingMode');
    this.#upgradeProperty('cameraResolution');
    this.#upgradeProperty('zoom');

    if (!CapturePhoto.isSupported()) {
      return this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        composed: true,
        detail: {
          error: {
            name: 'NotSupportedError',
            message: 'Not supported'
          }
        }
      }));
    }

    this.#requestGetUserMedia();
  }

  disconnectedCallback() {
    this.#stopVideoStreaming();
    this.#facingModeButton && this.#facingModeButton.removeEventListener('click', this.#onFacingModeButtonClick);
    this.#captureButton && this.#captureButton.removeEventListener('click', this.#onCapturePhotoButtonClick);
    this.#videoElement && this.#videoElement.removeEventListener('canplay', this.#onVideoLoadedMetaData);
    this.#captureButtonSlot && this.#captureButtonSlot.removeEventListener('slotchange', this.#onCaptureButtonSlotChange);
    this.#facingModeButtonSlot && this.#facingModeButtonSlot.removeEventListener('slotchange', this.#onFacingModeButtonSlotChange);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.#connected) {
      return;
    }

    if (name === 'output-disabled') {
      this.#emptyOutputElement();
    }

    if (name === 'facing-mode' && this.#supportedConstraints.facingMode && oldValue !== newValue) {
      this.#stopVideoStreaming();
      this.#requestGetUserMedia();
      this.dispatchEvent(new CustomEvent('capture-photo:facing-mode-change', {
        bubbles: true,
        composed: true,
        detail: { facingMode: newValue }
      }));
    }

    if (name === 'camera-resolution' && oldValue !== newValue) {
      this.#stopVideoStreaming();
      this.#requestGetUserMedia();
      this.dispatchEvent(new CustomEvent('capture-photo:camera-resolution-change', {
        bubbles: true,
        composed: true,
        detail: { cameraResolution: newValue }
      }));
    }

    if (name === 'zoom' && oldValue !== newValue) {
      this.#applyZoom(this.zoom);
      this.dispatchEvent(new CustomEvent('capture-photo:zoom-change', {
        bubbles: true,
        composed: true,
        detail: { zoom: this.zoom }
      }));
    }
  }

  static get observedAttributes() {
    return ['output-disabled', 'facing-mode', 'camera-resolution', 'zoom'];
  }

  get outputDisabled() {
    return this.hasAttribute('output-disabled');
  }

  set outputDisabled(value) {
    if (value) {
      this.setAttribute('output-disabled', '');
    } else {
      this.removeAttribute('output-disabled');
    }
  }

  get facingMode() {
    return this.getAttribute('facing-mode');
  }

  set facingMode(value) {
    this.setAttribute('facing-mode', value);
  }

  get cameraResolution() {
    return this.getAttribute('camera-resolution');
  }

  set cameraResolution(value) {
    this.setAttribute('camera-resolution', value);
  }

  get zoom() {
    return Number(this.getAttribute('zoom')) || null;
  }

  set zoom(value) {
    const numValue = Number(value) || 0;
    this.setAttribute('zoom', numValue > 0 ? Math.floor(numValue) : 0);
  }

  get loading() {
    return this.hasAttribute('loading');
  }

  #stopVideoStreaming() {
    if (!this.#videoElement || !this.#stream) {
      return;
    }

    const [track] = this.#stream.getVideoTracks();
    track && track.stop();
    this.#videoElement.srcObject = null;
    this.#stream = null;
  }

  #requestGetUserMedia() {
    if (!CapturePhoto.isSupported()) {
      return;
    }

    this.setAttribute('loading', '');

    const constraints = {
      video: {
        facingMode: {
          ideal: this.facingMode || 'user'
        }
      },
      audio: false
    };

    if (typeof this.cameraResolution === 'string') {
      const [width, height] = this.cameraResolution.split('x');
      constraints.video.width = width;
      constraints.video.height = height;
    }

    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      this.#videoElement.srcObject = stream;
      this.#stream = stream;
      this.#applyZoom(this.zoom);
    }).catch(error => {
      this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        composed: true,
        detail: { error }
      }));
    }).finally(() => {
      this.removeAttribute('loading');
    });
  }

  capture() {
    if (this.loading) {
      return;
    }

    try {
      const ctx = this.#canvasElement.getContext('2d');
      const width = this.#videoElement.videoWidth;
      const height = this.#videoElement.videoHeight;
      this.#canvasElement.width = width;
      this.#canvasElement.height = height;
      ctx.drawImage(this.#videoElement, 0, 0, width, height);
      const dataURI = this.#canvasElement.toDataURL('image/png');

      if (typeof dataURI === 'string' && dataURI.includes('data:image')) {
        if (!this.outputDisabled) {
          const image = new Image();
          image.src = dataURI;
          image.width = width;
          image.height = height;
          image.part = 'output-image';
          this.#emptyOutputElement();
          this.#outputElement && this.#outputElement.appendChild(image);
        }

        this.dispatchEvent(new CustomEvent('capture-photo:success', {
          bubbles: true,
          composed: true,
          detail: { dataURI, width, height }
        }));
      }
    } catch (error) {
      this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        composed: true,
        detail: { error }
      }));
    }
  }

  #onFacingModeButtonClick = evt => {
    evt.preventDefault();

    if (this.loading) {
      return;
    }

    this.facingMode = this.facingMode === 'user' || !this.facingMode ? 'environment' : 'user';
  };

  #onCapturePhotoButtonClick = evt => {
    evt.preventDefault();
    this.capture();
  };

  #onVideoLoadedMetaData = evt => {
    const video = evt.target;

    video.play().then(() => {
      this.dispatchEvent(new CustomEvent('capture-photo:video-play', {
        bubbles: true,
        composed: true,
        detail: { video }
      }));
    }).catch(error => {
      this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        composed: true,
        detail: { error }
      }));
    }).finally(() => {
      this.removeAttribute('loading');
    });
  };

  #emptyOutputElement() {
    if (!this.#outputElement) {
      return;
    }

    Array.from(this.#outputElement.childNodes).forEach(node => node.remove());
  }

  #applyZoom(zoom) {
    if (!this.#stream || !zoom) {
      return;
    }

    const [track] = this.#stream.getVideoTracks();

    if (typeof track.getCapabilities !== 'function' || typeof track.getSettings !== 'function') {
      return;
    }

    const capabilities = track.getCapabilities();
    const settings = track.getSettings();

    if ('zoom' in settings) {
      track.applyConstraints({
        advanced: [{
          zoom: clamp(Number(zoom), capabilities.zoom.min, capabilities.zoom.max)
        }]
      });
    }
  }

  #onCaptureButtonSlotChange = evt => {
    if (evt.target && evt.target.name === 'capture-button') {
      this.#captureButton && this.#captureButton.removeEventListener('click', this.#onCapturePhotoButtonClick);
      this.#captureButton = this.#getCaptureButton();

      if (this.#captureButton) {
        this.#captureButton.addEventListener('click', this.#onCapturePhotoButtonClick);

        if (this.#captureButton.nodeName !== 'BUTTON' && !this.#captureButton.hasAttribute('role')) {
          this.#captureButton.setAttribute('role', 'button');
        }
      }
    }
  };

  #onFacingModeButtonSlotChange = evt => {
    if (evt.target && evt.target.name === 'facing-mode-button') {
      this.#facingModeButton && this.#facingModeButton.removeEventListener('click', this.#onFacingModeButtonClick);
      this.#facingModeButton = this.#getFacingModeButton();

      if (this.#facingModeButton) {
        this.#facingModeButton.addEventListener('click', this.#onFacingModeButtonClick);

        if (this.#facingModeButton.nodeName !== 'BUTTON' && !this.#facingModeButton.hasAttribute('role')) {
          this.#facingModeButton.setAttribute('role', 'button');
        }
      }
    }
  };

  #getFacingModeButton() {
    if (!this.#facingModeButtonSlot) {
      return null;
    }

    return this.#facingModeButtonSlot.assignedElements({ flatten: true }).find(el => {
      return el.nodeName === 'BUTTON' || el.getAttribute('slot') === 'facing-mode-button';
    });
  }

  #getCaptureButton() {
    if (!this.#captureButtonSlot) {
      return null;
    }

    return this.#captureButtonSlot.assignedElements({ flatten: true }).find(el => {
      return el.nodeName === 'BUTTON' || el.getAttribute('slot') === 'capture-button';
    });
  }

  /**
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   * This is to safe guard against cases where, for instance, a framework may have added the element to the page and
   * set a value on one of its properties, but lazy loaded its definition. Without this guard, the upgraded element would
   * miss that property and the instance property would prevent the class property setter from ever being called.
   */
  #upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  static isSupported() {
    return Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  static defineCustomElement(elementName = 'capture-photo') {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, CapturePhoto);
    }
  }
}

export { CapturePhoto };
