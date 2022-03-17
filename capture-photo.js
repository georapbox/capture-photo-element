/**
 * A custom element to capture a photo in the browser.
 *
 * @slot capture-button - The capture photo button.
 * @slot capture-button-content - The capture photo button's content.
 * @slot facing-mode-button - The facing mode button.
 * @slot facing-mode-button-content - The facing mode button's content.
 *
 * @csspart video - The video element.
 * @csspart actions-container - The action buttons container element.
 * @csspart capture-button - The capture photo button.
 * @csspart capture-button--disabled - The capture photo button when is disabled.
 * @csspart facing-mode-button - The facing mode button.
 * @csspart facing-mode-button--disabled - The facing mode button when is disabled.
 * @csspart output-container - The output container element.
 * @csspart output-image - The output image element.
 *
 * @event capture-photo:facing-mode-change - Emitted when the camera's facing mode changes.
 * @event capture-photo:camera-resolution-change - Emitted when the camera's resolution changes.
 * @event capture-photo:zoom-change - Emitted when the camera's zoom level changes.
 * @event capture-photo:success - Emitted when a photo is captured successfully.
 * @event capture-photo:error - Emitted when an error occurs. An error might occur because camera permission is denied, a photo cannot be captured for any reason, the video stream cannot start for any reason, etc.
 *
 * @example
 *
 * <capture-photo facing-mode="environment" camera-resolution="320x240">
 *   <button slot="capture-button" behavior="button" type="button">Take picture</button>
 *   <a slot="facing-mode-button" behavior="button" href="#" role="button">Change camera</a>
 * </capture-photo>
 */

function clamp(value, lower, upper) {
  if (Number.isNaN(lower)) {
    lower = 0;
  }

  if (Number.isNaN(upper)) {
    upper = 0;
  }

  return Math.min(Math.max(value, Math.min(lower, upper)), Math.max(lower, upper));
}

const template = document.createElement('template');

template.innerHTML = /*template*/`
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
    <slot name="capture-button"><button part="capture-button" type="button" behavior="button"><slot name="capture-button-content">Capture photo</slot></button></slot>
    <slot name="facing-mode-button"><button part="facing-mode-button" type="button" behavior="button"><slot name="facing-mode-button-content">Toggle facing mode</slot></button></slot>
  </div>

  <div part="output-container" id="output"></div>
`;

export class CapturePhoto extends HTMLElement {
  constructor() {
    super();

    this._supportedConstraints = navigator.mediaDevices.getSupportedConstraints();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.appendChild(template.content.cloneNode(true));

    this._onFacingModeButtonClick = this._onFacingModeButtonClick.bind(this);
    this._onCapturePhotoButtonClick = this._onCapturePhotoButtonClick.bind(this);
    this._onVideoCanPlay = this._onVideoCanPlay.bind(this);
    this._onCaptureButtonSlotChange = this._onCaptureButtonSlotChange.bind(this);
    this._onFacingModeButtonSlotChange = this._onFacingModeButtonSlotChange.bind(this);
  }

  connectedCallback() {
    if (!this.facingMode) {
      this.facingMode = 'user';
    }

    this.$canvasElement = this.shadowRoot.querySelector('canvas');
    this.$outputElement = this.shadowRoot.getElementById('output');
    this.$videoElement = this.shadowRoot.querySelector('video');
    this.$videoElement && this.$videoElement.addEventListener('canplay', this._onVideoCanPlay);
    this._captureButtonSlot = this.shadowRoot.querySelector('slot[name="capture-button"]');
    this._captureButtonSlot.addEventListener('slotchange', this._onCaptureButtonSlotChange);
    this.$captureButton = this._captureButtonSlot.assignedNodes({ flatten: true }).find(el => el.getAttribute('behavior') === 'button');
    this.$captureButton && this.$captureButton.addEventListener('click', this._onCapturePhotoButtonClick);
    this._facingModeButtonSlot = this.shadowRoot.querySelector('slot[name="facing-mode-button"]');
    this._facingModeButtonSlot.addEventListener('slotchange', this._onFacingModeButtonSlotChange);
    this.$facingModeButton = this._facingModeButtonSlot.assignedNodes({ flatten: true }).find(el => el.getAttribute('behavior') === 'button');

    if (this.$facingModeButton) {
      if (this._supportedConstraints.facingMode) {
        this.$facingModeButton.addEventListener('click', this._onFacingModeButtonClick);
      } else {
        this.$facingModeButton.hidden = true;
      }
    }

    this._upgradeProperty('outputDisabled');
    this._upgradeProperty('actionsDisabled');
    this._upgradeProperty('facingMode');
    this._upgradeProperty('cameraResolution');
    this._upgradeProperty('zoom');

    this.actionsDisabled = true;
    this._requestGetUserMedia();
  }

  disconnectedCallback() {
    this._stopVideoStreaming();
    this.$facingModeButton && this.$facingModeButton.removeEventListener('click', this._onFacingModeButtonClick);
    this.$captureButton && this.$captureButton.removeEventListener('click', this._onCapturePhotoButtonClick);
    this.$videoElement && this.$videoElement.removeEventListener('canplay', this._onVideoCanPlay);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'actions-disabled') {
      const isDisabled = newValue !== null;

      if (this.$captureButton) {
        this.$captureButton.disabled = isDisabled;
        this.$captureButton.part.toggle('capture-button--disabled', isDisabled);
      }

      if (this.$facingModeButton) {
        this.$facingModeButton.disabled = isDisabled;
        this.$facingModeButton.part.toggle('facing-mode-button--disabled', isDisabled);
      }
    }

    if (name === 'output-disabled') {
      this._emptyOutputElement();
    }

    if (name === 'facing-mode' && this._supportedConstraints.facingMode) {
      this._stopVideoStreaming();
      this._requestGetUserMedia();
      this.dispatchEvent(new CustomEvent('capture-photo:facing-mode-change', {
        bubbles: true,
        detail: { facingMode: newValue }
      }));
    }

    if (name === 'camera-resolution') {
      this._stopVideoStreaming();
      this._requestGetUserMedia();
      this.dispatchEvent(new CustomEvent('capture-photo:camera-resolution-change', {
        bubbles: true,
        detail: { cameraResolution: newValue }
      }));
    }

    if (name === 'zoom') {
      this._applyZoom(this.zoom);
      this.dispatchEvent(new CustomEvent('capture-photo:zoom-change', {
        bubbles: true,
        detail: { zoom: this.zoom }
      }));
    }
  }

  static get observedAttributes() {
    return ['actions-disabled', 'output-disabled', 'facing-mode', 'camera-resolution', 'zoom'];
  }

  get actionsDisabled() {
    return this.hasAttribute('actions-disabled');
  }

  set actionsDisabled(value) {
    if (value) {
      this.setAttribute('actions-disabled', '');
    } else {
      this.removeAttribute('actions-disabled');
    }
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
    const allowed = ['user', 'environment'];

    if (typeof value !== 'string' || !allowed.includes(value)) {
      return;
    }

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

  _stopVideoStreaming() {
    if (!this.$videoElement || !this._stream) {
      return;
    }

    const [track] = this._stream.getVideoTracks();
    track && track.stop();
    this.$videoElement.srcObject = null;
    this._stream = null;
    this.actionsDisabled = true;
  }

  _requestGetUserMedia() {
    const constraints = {
      video: {
        facingMode: {
          ideal: this.facingMode
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
      this.$videoElement.srcObject = stream;
      this._stream = stream;
      this._applyZoom(this.zoom);
    }).catch(error => {
      this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        detail: { error }
      }));
    });
  }

  takePicture() {
    try {
      const ctx = this.$canvasElement.getContext('2d');
      const width = this.$videoElement.videoWidth;
      const height = this.$videoElement.videoHeight;
      this.$canvasElement.width = width;
      this.$canvasElement.height = height;
      ctx.drawImage(this.$videoElement, 0, 0, width, height);
      const dataURI = this.$canvasElement.toDataURL('image/png');

      if (typeof dataURI === 'string' && dataURI.includes('data:image')) {
        if (!this.outputDisabled) {
          const image = new Image();
          image.src = dataURI;
          image.width = width;
          image.height = height;
          image.part = 'output-image';
          this._emptyOutputElement();
          this.$outputElement.appendChild(image);
        }

        this.dispatchEvent(new CustomEvent('capture-photo:success', {
          bubbles: true,
          detail: { dataURI, width, height }
        }));
      }
    } catch (error) {
      this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        detail: { error }
      }));
    }
  }

  _onFacingModeButtonClick(evt) {
    evt.preventDefault();
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
  }

  _onCapturePhotoButtonClick(evt) {
    evt.preventDefault();
    this.takePicture();
  }

  _onVideoCanPlay(evt) {
    this.actionsDisabled = false;
    evt.target.play().catch(error => {
      this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        detail: { error }
      }));
    });
  }

  _emptyOutputElement() {
    if (!this.$outputElement) {
      return;
    }

    Array.from(this.$outputElement.childNodes).forEach(node => node.remove());
  }

  _applyZoom(zoom) {
    if (!this._stream || !zoom) {
      return;
    }

    const [track] = this._stream.getVideoTracks();

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

  _onCaptureButtonSlotChange(evt) {
    if (evt.target && evt.target.name === 'capture-button') {
      this.$captureButton && this.$captureButton.removeEventListener('click', this._onCapturePhotoButtonClick);
      this.$captureButton = this._captureButtonSlot.assignedNodes({ flatten: true }).find(el => el.getAttribute('behavior') === 'button');
      this.$captureButton && this.$captureButton.addEventListener('click', this._onCapturePhotoButtonClick);
    }
  }

  _onFacingModeButtonSlotChange(evt) {
    if (evt.target && evt.target.name === 'facing-mode-button') {
      this.$facingModeButton && this.$facingModeButton.removeEventListener('click', this._onFacingModeButtonClick);
      this.$facingModeButton = this._facingModeButtonSlot.assignedNodes({ flatten: true }).find(el => el.getAttribute('behavior') === 'button');
      this.$facingModeButton && this.$facingModeButton.addEventListener('click', this._onFacingModeButtonClick);
    }
  }

  /**
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   * This is to safe guard against cases where, for instance, a framework
   * may have added the element to the page and set a value on one of its
   * properties, but lazy loaded its definition. Without this guard, the
   * upgraded element would miss that property and the instance property
   * would prevent the class property setter from ever being called.
   */
  _upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  static defineCustomElement(elementName = 'capture-photo') {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, CapturePhoto);
    }
  }
}
