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

    this.onFacingModeButtonClick = this.onFacingModeButtonClick.bind(this);
    this.handleCaptureMedia = this.handleCaptureMedia.bind(this);
    this.onVideoCanPlay = this.onVideoCanPlay.bind(this);
  }

  connectedCallback() {
    this.canvasElement = this.shadowRoot.querySelector('canvas');
    this.videoElement = this.shadowRoot.querySelector('video');
    this.outputElement = this.shadowRoot.getElementById('output');
    this.facingModeButton = this.shadowRoot.getElementById('facingModeButton');
    this.captureUserMediaButton = this.shadowRoot.getElementById('captureUserMediaButton');
    this.actionsDisabled = true;
    this.requestGetUserMedia();
    this.facingModeButton.addEventListener('click', this.onFacingModeButtonClick);
    this.captureUserMediaButton.addEventListener('click', this.handleCaptureMedia);
    this.videoElement.addEventListener('canplay', this.onVideoCanPlay);
  }

  disconnectedCallback() {
    this.stopVideoStreaming(this.videoElement);
    this.facingModeButton.removeEventListener('click', this.onFacingModeButtonClick);
    this.captureUserMediaButton.removeEventListener('click', this.handleCaptureMedia);
    this.videoElement.removeEventListener('canplay', this.onVideoCanPlay);
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
      this.emptyOutputElement();
    }

    if (name === 'facing-mode') {
      this.stopVideoStreaming(this.videoElement);
      this.requestGetUserMedia();
      this.dispatchEvent(new CustomEvent('capture-photo:facing-mode-change', {
        bubbles: true,
        detail: { facingMode: newValue }
      }));
    }

    if (name === 'camera-resolution') {
      this.stopVideoStreaming(this.videoElement);
      this.requestGetUserMedia();
      this.dispatchEvent(new CustomEvent('capture-photo:camera-resolution-change', {
        bubbles: true,
        detail: { cameraResolution: newValue }
      }));
    }
  }

  static get observedAttributes() {
    return ['actions-disabled', 'output-disabled', 'facing-mode', 'camera-resolution'];
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

  makeConstraints() {
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

    return constraints;
  }

  stopVideoStreaming(video) {
    if (!video) {
      return;
    }

    const stream = video.srcObject;
    const tracks = stream != null ? stream.getVideoTracks() : [];
    tracks.forEach(track => track.stop());
    video.srcObject = null;
    this.actionsDisabled = true;
  }

  requestGetUserMedia() {
    navigator.mediaDevices.getUserMedia(this.makeConstraints()).then(stream => {
      this.videoElement.srcObject = stream;
    }).catch(error => {
      this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        detail: { error }
      }));
    });
  }

  handleCaptureMedia() {
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
          this.emptyOutputElement();
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

  onFacingModeButtonClick() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
  }

  onVideoCanPlay(evt) {
    this.actionsDisabled = false;
    evt.target.play().catch(error => {
      this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        detail: { error }
      }));
    });
  }

  emptyOutputElement() {
    if (!this.outputElement) {
      return;
    }

    Array.from(this.outputElement.childNodes).forEach(node => node.remove());
  }

  static defineCustomElement(elementName = 'capture-photo') {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, CapturePhoto);
    }
  }
}
