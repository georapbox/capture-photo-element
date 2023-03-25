const isLocalhost = window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/capture-photo.js' : '../lib/capture-photo.js';
const capturePhotoEl = document.querySelector('capture-photo');
const form = document.getElementById('form');
const codePreviewEl = document.getElementById('codePreview');

const escapeHTML = subjectString => {
  if (typeof subjectString !== 'string') {
    throw new TypeError('Expected a string for first argument');
  }

  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;' // eslint-disable-line quotes
  };

  const regexUnescapedHtml = /[&<>"'`]/g;
  const regexHasUnescapedHtml = RegExp(regexUnescapedHtml.source);

  return regexHasUnescapedHtml.test(subjectString)
    ? subjectString.replace(regexUnescapedHtml, tag => htmlEscapes[tag] || tag)
    : subjectString;
};

import(componentUrl).then(res => {
  const { CapturePhoto } = res;

  document.addEventListener('capture-photo:error', evt => {
    console.log('capture-photo:error ->', evt.detail);
  });

  document.addEventListener('capture-photo:success', evt => {
    console.log('capture-photo:success ->', evt.detail);
  });

  CapturePhoto.defineCustomElement();

  form.addEventListener('submit', evt => {
    evt.preventDefault();

    const facingMode = form['facing-mode'];
    const zoom = form['zoom'];
    const pan = form['pan'];
    const tilt = form['tilt'];
    const width = form['width'];
    const height = form['height'];
    const calculateFileSize = form['calculate-file-size'];
    const noImage = form['no-image'];

    if (facingMode.value && !facingMode.disabled) {
      capturePhotoEl.setAttribute('facing-mode', facingMode.value);
    } else {
      capturePhotoEl.removeAttribute('facing-mode');
    }

    if (zoom.value && !zoom.disabled) {
      capturePhotoEl.setAttribute('zoom', zoom.value);
    } else {
      capturePhotoEl.removeAttribute('zoom');
    }

    if (pan.value && !pan.disabled) {
      capturePhotoEl.setAttribute('pan', pan.value);
    } else {
      capturePhotoEl.removeAttribute('pan');
    }

    if (tilt.value && !tilt.disabled) {
      capturePhotoEl.setAttribute('tilt', tilt.value);
    } else {
      capturePhotoEl.removeAttribute('tilt');
    }

    if (width.value && !width.disabled && height.value && !height.disabled) {
      capturePhotoEl.setAttribute('camera-resolution', `${width.value}x${height.value}`);
    } else {
      capturePhotoEl.removeAttribute('camera-resolution');
    }

    capturePhotoEl.toggleAttribute('calculate-file-size', calculateFileSize.checked);
    capturePhotoEl.toggleAttribute('no-image', noImage.checked);

    codePreviewEl.innerHTML = escapeHTML(capturePhotoEl.outerHTML.replace(new RegExp(`(\\s)?loading=""`, 'g'), '').replace(/=""/g, ''));
  });

  capturePhotoEl.addEventListener('capture-photo:video-play', () => {
    const settings = capturePhotoEl.getTrackSettings();
    const capabilities = capturePhotoEl.getTrackCapabilities();
    const facingModeInput = form.querySelector('select[name="facing-mode"]');
    const zoomInput = form.querySelector('input[name="zoom"]');
    const panInput = form.querySelector('input[name="pan"]');
    const tiltInput = form.querySelector('input[name="tilt"]');
    const widthInput = form.querySelector('input[name="width"]');
    const heightInput = form.querySelector('input[name="height"]');

    if ('facingMode' in settings) {
      facingModeInput.value = settings.facingMode;
    } else {
      facingModeInput.disabled = true;
    }

    if ('zoom' in settings) {
      zoomInput.min = capabilities.zoom.min;
      zoomInput.max = capabilities.zoom.max;
      zoomInput.step = capabilities.zoom.step || 1;
      zoomInput.value = settings.zoom;
    } else {
      zoomInput.disabled = true;
      zoomInput.value = 0;
    }

    if ('pan' in settings) {
      panInput.min = capabilities.pan.min;
      panInput.max = capabilities.pan.max;
      panInput.step = capabilities.pan.step || 1;
      panInput.value = settings.pan;
    } else {
      panInput.disabled = true;
      panInput.value = 0;
    }

    if ('tilt' in settings) {
      tiltInput.min = capabilities.tilt.min;
      tiltInput.max = capabilities.tilt.max;
      tiltInput.step = capabilities.tilt.step || 1;
      tiltInput.value = settings.tilt;
    } else {
      tiltInput.disabled = true;
      tiltInput.value = 0;
    }

    if ('width' in settings) {
      widthInput.min = capabilities.width.min;
      widthInput.max = capabilities.width.max;
    } else {
      widthInput.disabled = true;
    }

    if ('height' in settings) {
      heightInput.min = capabilities.height.min;
      heightInput.max = capabilities.height.max;
    } else {
      heightInput.disabled = true;
    }

    form.querySelector('fieldset').disabled = false;
  }, {
    once: true
  });

  capturePhotoEl.addEventListener('capture-photo:error', evt => {
    const errorEl = document.createElement('p');
    errorEl.className = 'alert alert-danger';
    errorEl.innerHTML = evt.detail.error?.message || 'Unknown error';
    document.getElementById('errorPlaceholder').appendChild(errorEl);
  });
}).catch(err => {
  console.error(err);
});
