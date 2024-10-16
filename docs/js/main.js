import { escapeHTML } from './utils.js';

const url = window.location.href;
const isLocalhost = url.includes('127.0.0.1') || url.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/capture-photo.js' : '../lib/capture-photo.js';
const capturePhotoEl = document.querySelector('capture-photo');
const form = document.getElementById('form');
const codePreviewEl = document.getElementById('codePreview');
const cameraSelect = document.getElementById('cameraSelect');

try {
  const { CapturePhoto } = await import(componentUrl);

  function handleCapturePhotoError(evt) {
    console.log('capture-photo:error ->', evt.detail);

    const errorEl = document.createElement('p');
    errorEl.className = 'alert alert-danger';
    errorEl.innerHTML = evt.detail.error?.message || 'Unknown error';

    const errorPlaceholder = document.getElementById('errorPlaceholder');
    errorPlaceholder.replaceChildren();
    errorPlaceholder.appendChild(errorEl);
  }

  function handleCapturePhotoSuccess(evt) {
    console.log('capture-photo:success ->', evt.detail);
  }

  function capturePhotoVideoPlay() {
    const settings = capturePhotoEl.getTrackSettings();
    const capabilities = capturePhotoEl.getTrackCapabilities();
    const facingModeInput = form.querySelector('select[name="facing-mode"]');
    const zoomInput = form.querySelector('input[name="zoom"]');
    const panInput = form.querySelector('input[name="pan"]');
    const tiltInput = form.querySelector('input[name="tilt"]');

    if ('facingMode' in settings) {
      facingModeInput.value = settings.facingMode;
    }

    if ('zoom' in settings) {
      if (capabilities?.zoom) {
        zoomInput.min = capabilities.zoom?.min || 0;
        zoomInput.max = capabilities.zoom?.max;
        zoomInput.step = capabilities.zoom?.step || 0.1;
      }
      zoomInput.value = settings.zoom;
    } else {
      zoomInput.value = 0;
    }

    if ('pan' in settings) {
      if (capabilities?.pan) {
        panInput.min = capabilities.pan?.min || 0;
        panInput.max = capabilities.pan?.max;
        panInput.step = capabilities.pan?.step || 0.1;
      }
      panInput.value = settings.pan;
    } else {
      panInput.value = 0;
    }

    if ('tilt' in settings) {
      if (capabilities?.tilt) {
        tiltInput.min = capabilities.tilt?.min || 0;
        tiltInput.max = capabilities.tilt?.max;
        tiltInput.step = capabilities.tilt?.step || 0.1;
      }
      tiltInput.value = settings.tilt;
    } else {
      tiltInput.value = 0;
    }

    CapturePhoto.getVideoInputDevices().then(devices => {
      console.log('devices ->', devices);

      devices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${index + 1}`;
        cameraSelect.appendChild(option);
      });

      if (devices.length >= 1) {
        cameraSelect.disabled = false;
      }
    });

    form.querySelector('fieldset').disabled = false;
  }

  function createCodePreview() {
    let attrs = '';

    for (const { name, value } of capturePhotoEl.attributes) {
      if (name === 'loading') {
        continue;
      }

      attrs += value ? ` ${name}="${value}"` : ` ${name}`;
    }

    const codePreview = `<capture-photo${attrs}></capture-photo>`;
    codePreviewEl.innerHTML = escapeHTML(codePreview);

    window.hljs.highlightElement(codePreviewEl);
  }

  function handleCameraSelectChange(evt) {
    capturePhotoEl.restartVideoStream(evt.target.value);
  }

  function handleFormChange(evt) {
    const el = evt.target;

    if (el.nodeName === 'FIELDSET') {
      return;
    }

    if (el.name === 'facing-mode' || el.name === 'camera-resolution') {
      capturePhotoEl.setAttribute(el.name, el.value);
      capturePhotoEl.restartVideoStream(cameraSelect.value || undefined);
    } else {
      if (el.type === 'checkbox') {
        capturePhotoEl.toggleAttribute(el.name, el.checked);
      } else {
        if (el.value && el.value !== '0') {
          capturePhotoEl.setAttribute(el.name, el.value);
        } else {
          capturePhotoEl.removeAttribute(el.name);
        }
      }
    }

    createCodePreview();
  }

  function handleDocumentVisibilityChange() {
    if (
      capturePhotoEl === null ||
      typeof capturePhotoEl.stopVideoStream !== 'function' ||
      typeof capturePhotoEl.startVideoStream !== 'function'
    ) {
      return;
    }

    document.visibilityState === 'hidden' ? capturePhotoEl.stopVideoStream() : capturePhotoEl.startVideoStream();
  }

  document.addEventListener('capture-photo:error', handleCapturePhotoError);
  document.addEventListener('capture-photo:success', handleCapturePhotoSuccess);
  document.addEventListener('capture-photo:video-play', capturePhotoVideoPlay, { once: true });
  document.addEventListener('visibilitychange', handleDocumentVisibilityChange);
  cameraSelect.addEventListener('change', handleCameraSelectChange);
  form.addEventListener('change', handleFormChange);

  CapturePhoto.defineCustomElement();
} catch (err) {
  console.error(err);
}
