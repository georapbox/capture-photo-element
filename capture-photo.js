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
    }

    :host * {
      box-sizing: border-box;
    }

    :host video {
      display: block;
    }

    :host #output:empty {
      display: none;
    }
  </style>

  <video part="video" playsinline></video>

  <canvas hidden></canvas>

  <div part="actions-container">
    <button part="capture-photo-button" type="button" id="captureUserMediaButton">
      <slot name="capture-photo-button">Capture photo</slot>
    </button>

    <button part="facing-mode-button" type="button" id="facingModeButton">
      <slot name="facing-mode-button">Toggle facing mode</slot>
    </button>
  </div>

  <div part="output-container" id="output"></div>
`;

export class CapturePhoto extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.appendChild(template.content.cloneNode(true));

    this._onFacingModeButtonClick = this._onFacingModeButtonClick.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this._onVideoCanPlay = this._onVideoCanPlay.bind(this);
  }

  connectedCallback() {
    this.canvasElement = this.shadowRoot.querySelector('canvas');
    this.videoElement = this.shadowRoot.querySelector('video');
    this.outputElement = this.shadowRoot.getElementById('output');
    this.facingModeButton = this.shadowRoot.getElementById('facingModeButton');
    this.captureUserMediaButton = this.shadowRoot.getElementById('captureUserMediaButton');
    this.actionsDisabled = true;
    this._requestGetUserMedia();
    this.facingModeButton.addEventListener('click', this._onFacingModeButtonClick);
    this.captureUserMediaButton.addEventListener('click', this.takePicture);
    this.videoElement.addEventListener('canplay', this._onVideoCanPlay);
  }

  disconnectedCallback() {
    this._stopVideoStreaming();
    this.facingModeButton.removeEventListener('click', this._onFacingModeButtonClick);
    this.captureUserMediaButton.removeEventListener('click', this.takePicture);
    this.videoElement.removeEventListener('canplay', this._onVideoCanPlay);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'actions-disabled') {
      const isDisabled = newValue !== null;

      if (this.captureUserMediaButton || this.facingModeButton) {
        this.captureUserMediaButton.disabled = isDisabled;
        this.captureUserMediaButton.part = isDisabled ? 'capture-photo-button disabled' : 'capture-photo-button';
        this.facingModeButton.disabled = isDisabled;
        this.facingModeButton.part = isDisabled ? 'facing-mode-button disabled' : 'facing-mode-button';
      }
    }

    if (name === 'output-disabled') {
      this._emptyOutputElement();
    }

    if (name === 'facing-mode') {
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
        detail: { zoom: newValue }
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
    return this.getAttribute('facing-mode') || 'user';
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
    return this.getAttribute('zoom');
  }

  set zoom(value) {
    this.setAttribute('zoom', value);
  }

  _stopVideoStreaming() {
    if (!this.videoElement || !this._stream) {
      return;
    }

    const [track] = this._stream.getVideoTracks();
    track && track.stop();
    this.videoElement.srcObject = null;
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
      this.videoElement.srcObject = stream;
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
      const ctx = this.canvasElement.getContext('2d');
      const width = this.videoElement.videoWidth;
      const height = this.videoElement.videoHeight;
      this.canvasElement.width = width;
      this.canvasElement.height = height;
      ctx.drawImage(this.videoElement, 0, 0, width, height);
      const dataURI = this.canvasElement.toDataURL('image/png');

      if (typeof dataURI === 'string' && dataURI.includes('data:image')) {
        if (!this.outputDisabled) {
          const image = new Image();
          image.src = dataURI;
          image.width = width;
          image.height = height;
          image.part = 'output-image';
          this._emptyOutputElement();
          this.outputElement.appendChild(image);
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

  _onFacingModeButtonClick() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
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
    if (!this.outputElement) {
      return;
    }

    Array.from(this.outputElement.childNodes).forEach(node => node.remove());
  }

  _applyZoom(zoom) {
    if (!this._stream || !zoom) {
      return;
    }

    const [track] = this._stream.getVideoTracks();
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

  static defineCustomElement(elementName = 'capture-photo') {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, CapturePhoto);
    }
  }
}
