import { escapeHTML } from './utils.js';

const url = window.location.href;
const isLocalhost = url.includes('127.0.0.1') || url.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/capture-photo.js' : '../lib/capture-photo.js';
const capturePhotoEl = document.querySelector('capture-photo');
const form = document.getElementById('form');
const codePreviewEl = document.getElementById('codePreview');
const cameraSelect = document.getElementById('cameraSelect');

import(componentUrl)
  .then(res => {
    const { CapturePhoto } = res;

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

    document.addEventListener('capture-photo:error', handleCapturePhotoError);
    document.addEventListener('capture-photo:success', handleCapturePhotoSuccess);
    document.addEventListener('capture-photo:video-play', capturePhotoVideoPlay, { once: true });

    CapturePhoto.defineCustomElement();

    CapturePhoto.getVideoDevices().then(devices => {
      console.log('devices ->', devices);

      devices.forEach((device, index) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${index + 1}`;
        cameraSelect.appendChild(option);
      });

      if (devices.length > 1) {
        cameraSelect.disabled = false;
      }
    });

    cameraSelect.addEventListener('change', evt => {
      evt.preventDefault();

      const deviceId = cameraSelect.value;
      capturePhotoEl.setAttribute('camera-id', deviceId);
    });

    Array.from(form.elements)
      .filter(el => el.nodeName !== 'FIELDSET')
      .forEach(el => {
        el.addEventListener('change', evt => {
          evt.preventDefault();

          switch (el.type) {
            case 'checkbox':
              capturePhotoEl.toggleAttribute(el.name, el.checked);
              break;
            default:
              if (el.value) {
                capturePhotoEl.setAttribute(el.name, el.value);
              } else {
                capturePhotoEl.removeAttribute(el.name);
              }
              break;
          }

          createCodePreview();
        });
      });
  })
  .catch(err => {
    console.error(err);
  });
