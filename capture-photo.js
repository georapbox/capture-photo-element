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

  <div part="container">
    <video part="video" playsinline></video>

    <canvas hidden></canvas>

    <div part="actions">
      <button part="capture-photo-button" type="button" id="captureUserMediaButton">
        <slot name="capture-photo-button">Capture photo</slot>
      </button>

      <button part="facing-mode-button" type="button" id="facingModeButton">
        <slot name="facing-mode-button">Toggle facing mode</slot>
      </button>
    </div>

    <div part="output-container" id="output"></div>
  </div>
`;

export class CapturePhoto extends HTMLElement {
  constructor() {
    super();

    this.facingMode = 'user';

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.appendChild(template.content.cloneNode(true));

    this.onFacingModeChange = this.onFacingModeChange.bind(this);
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

    this.requestGetUserMedia().then(stream => {
      this.startVideoStreaming(this.videoElement, stream);
    }).catch(error => {
      this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        detail: { error }
      }));
    });

    this.facingModeButton.addEventListener('click', this.onFacingModeChange);
    this.captureUserMediaButton.addEventListener('click', this.handleCaptureMedia);
    this.videoElement.addEventListener('canplay', this.onVideoCanPlay);
  }

  disconnectedCallback() {
    this.stopVideoStreaming(this.videoElement);
    this.facingModeButton.removeEventListener('click', this.onFacingModeChange);
    this.captureUserMediaButton.removeEventListener('click', this.handleCaptureMedia);
    this.videoElement.removeEventListener('canplay', this.onVideoCanPlay);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'actions-disabled') {
      this.captureUserMediaButton.disabled = newValue !== null;
      this.facingModeButton.disabled = newValue !== null;
    }

    if (name === 'output-disabled') {
      this.emptyOutputElement();
    }
  }

  static get observedAttributes() {
    return ['actions-disabled', 'output-disabled'];
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

  startVideoStreaming(video, stream) {
    video.srcObject = stream;

    video.play().catch(error => {
      this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        detail: { error }
      }));
    });

    const tracks = stream != null ? stream.getVideoTracks() : [];

    tracks.forEach(track => {
      track.applyConstraints({
        video: {
          facingMode: {
            ideal: this.facingMode
          }
        },
        audio: false
      });
    });
  }

  stopVideoStreaming(video) {
    const stream = video.srcObject;
    const tracks = stream != null ? stream.getVideoTracks() : [];

    tracks.forEach(track => track.stop());
    video.srcObject = null;
    this.actionsDisabled = true;
  }

  requestGetUserMedia() {
    if (!navigator.mediaDevices) {
      return Promise.reject('MediaDevices.getUserMedia() is not supported.');
    }

    return navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          ideal: this.facingMode
        }
      },
      audio: false
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

      if (typeof dataURI === 'string' || dataURI.includes('data:image')) {
        if (!this.outputDisabled) {
          const image = new Image();
          image.src = dataURI;
          image.part = 'output-image';
          this.emptyOutputElement();
          this.outputElement.appendChild(image);
        }

        this.dispatchEvent(new CustomEvent('capture-photo:success', {
          bubbles: true,
          detail: { dataURI }
        }));
      }
    } catch (error) {
      this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        detail: { error }
      }));
    }
  }

  onFacingModeChange() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.stopVideoStreaming(this.videoElement);

    this.requestGetUserMedia().then(stream => {
      this.startVideoStreaming(this.videoElement, stream);
    }).catch(error => {
      this.dispatchEvent(new CustomEvent('capture-photo:error', {
        bubbles: true,
        detail: { error }
      }));
    });

    this.dispatchEvent(new CustomEvent('capture-photo:facingmodechange', {
      bubbles: true,
      detail: {
        facingMode: this.facingMode
      }
    }));
  }

  onVideoCanPlay() {
    this.actionsDisabled = false;
  }

  emptyOutputElement() {
    Array.from(this.outputElement.childNodes).forEach(node => node.remove());
  }

  static defineCustomElement(elementName = 'capture-photo') {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, CapturePhoto);
    }
  }
}
