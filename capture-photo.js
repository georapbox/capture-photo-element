const template = document.createElement('template');

template.innerHTML = /*template*/`
  <style>
    :host {
      all: initial;
      display: block;
    }

    :host video {
      width: 100%;
    }
  </style>

  <div>
    <video part="video" playsinline></video>

    <canvas hidden></canvas>

    <div class="output" id="output"></div>

    <div part="actions" class="actions">
      <button part="facing-mode-button" type="button" id="facingModeButton">
        Toggle facing mode
      </button>

      <button part="capture-photo-button" type="button" id="captureUserMediaButton">
        Capture photo
      </button>
    </div>
  </div>
`;

export class CapturePhoto extends HTMLElement {
  constructor() {
    super();

    this.facingMode = 'user';
    this.videoEl = null;
    this.canvasEl = null;
    this.ctx = null;

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.appendChild(template.content.cloneNode(true));

    this.onFacingModeChange = this.onFacingModeChange.bind(this);
    this.handleCaptureMedia = this.handleCaptureMedia.bind(this);
    // this.onImageLoaded = this.onImageLoaded.bind(this);
  }

  startVideoStreaming(videoEl, stream) {
    videoEl.srcObject = stream;
    videoEl.play().catch(err => console.error(err));

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

  stopVideoStreaming(videoEl) {
    const stream = videoEl.srcObject;
    const tracks = stream != null ? stream.getVideoTracks() : [];
    tracks.forEach(track => track.stop());
    videoEl.srcObject = null;
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
      // toggleModal(videoModal, true);
      this.startVideoStreaming(this.videoEl, stream);
    }).catch(err => {
      console.error(err);
    });
  }

  handleCaptureMedia() {
    this.canvasEl.width = this.videoEl.videoWidth;
    this.canvasEl.height = this.videoEl.videoHeight;
    this.ctx.drawImage(this.videoEl, 0, 0, this.canvasEl.width, this.canvasEl.height);

    const image = new Image();
    // image.addEventListener('load', this.onImageLoaded);
    const data = this.canvasEl.toDataURL('image/png');
    console.log(data);
    image.src = data;

    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.ctx.drawImage(image, 0, 0, this.canvasEl.width, this.canvasEl.height);

    // this.stopVideoStreaming(this.videoEl);

    // this.videoEl.remove();
    const outputEl = this.shadowRoot.getElementById('output');
    outputEl.innerHTML = '';
    outputEl.appendChild(image);
  }

  // onImageLoaded(evt) {
  //   const img = evt.target;
  //   this.canvasEl.width = img.width;
  //   this.canvasEl.height = img.height;
  //   this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
  //   this.ctx.drawImage(img, 0, 0, this.canvasEl.width, this.canvasEl.height);
  // }

  onFacingModeChange() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.stopVideoStreaming(this.videoEl);
    this.requestGetUserMedia();
  }

  connectedCallback() {
    this.canvasEl = this.shadowRoot.querySelector('canvas');
    this.ctx = this.canvasEl.getContext('2d');
    this.videoEl = this.shadowRoot.querySelector('video');
    this.facingModeButton = this.shadowRoot.getElementById('facingModeButton');
    this.captureUserMediaButton = this.shadowRoot.getElementById('captureUserMediaButton');

    this.requestGetUserMedia();

    this.facingModeButton.addEventListener('click', this.onFacingModeChange);
    this.captureUserMediaButton.addEventListener('click', this.handleCaptureMedia);
  }

  disconnectedCallback() {
    // TODO Clean up
    this.canvasEl.hidden = true;
    this.stopVideoStreaming();
    this.facingModeButton.removeEventListener('click', this.onFacingModeChange);
    this.captureUserMediaButton.removeEventListener('click', this.handleCaptureMedia);
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
