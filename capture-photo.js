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

    <div part="output" id="output"></div>
  </div>
`;

export class CapturePhoto extends HTMLElement {
  constructor() {
    super();

    this.facingMode = 'user';
    this.videoElement = null;
    this.canvasElement = null;
    this.outputElement = null;

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.appendChild(template.content.cloneNode(true));

    this.onFacingModeChange = this.onFacingModeChange.bind(this);
    this.handleCaptureMedia = this.handleCaptureMedia.bind(this);
  }

  startVideoStreaming(video, stream) {
    video.srcObject = stream;
    video.play().catch(err => console.error(err));

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
  }

  requestGetUserMedia() {
    if (!navigator.mediaDevices) {
      console.error('The operation is not supported.');
    }

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: {
          ideal: this.facingMode
        }
      },
      audio: false
    }).then(stream => {
      this.startVideoStreaming(this.videoElement, stream);
    }).catch(err => {
      console.error(err);
    });
  }

  handleCaptureMedia() {
    const ctx = this.canvasElement.getContext('2d');
    const width = this.videoElement.videoWidth;
    const height = this.videoElement.videoHeight;

    this.canvasElement.width = width;
    this.canvasElement.height = height;
    ctx.drawImage(this.videoElement, 0, 0, width, height);

    const image = new Image();
    const data = this.canvasElement.toDataURL('image/png');

    image.src = data;

    this.outputElement.innerHTML = '';
    this.outputElement.appendChild(image);
  }

  onFacingModeChange() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.stopVideoStreaming(this.videoElement);
    this.requestGetUserMedia();

    this.dispatchEvent(new CustomEvent('capture-photo:facingmodechange', {
      bubbles: true,
      detail: {
        facingMode: this.facingMode
      }
    }));
  }

  connectedCallback() {
    this.canvasElement = this.shadowRoot.querySelector('canvas');
    this.videoElement = this.shadowRoot.querySelector('video');
    this.outputElement = this.shadowRoot.getElementById('output');
    this.facingModeButton = this.shadowRoot.getElementById('facingModeButton');
    this.captureUserMediaButton = this.shadowRoot.getElementById('captureUserMediaButton');

    this.requestGetUserMedia();

    this.facingModeButton.addEventListener('click', this.onFacingModeChange);
    this.captureUserMediaButton.addEventListener('click', this.handleCaptureMedia);
  }

  disconnectedCallback() {
    this.stopVideoStreaming(this.videoElement);
    this.facingModeButton.removeEventListener('click', this.onFacingModeChange);
    this.captureUserMediaButton.removeEventListener('click', this.handleCaptureMedia);
  }

  // attributeChangedCallback(name, oldValue, newValue) {}

  // static get observedAttributes() {
  //   return [];
  // }

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
