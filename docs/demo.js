import { CapturePhoto } from '../src/index.js';

document.addEventListener('capture-photo:facing-mode-change', evt => {
  console.log('capture-photo:facing-mode-change ->', evt.detail);
});

document.addEventListener('capture-photo:error', evt => {
  console.error('capture-photo:error ->', evt.detail);
});

document.addEventListener('capture-photo:success', evt => {
  console.log('capture-photo:success ->', evt.detail);
});

document.addEventListener('capture-photo:camera-resolution-change', evt => {
  console.log('capture-photo:camera-resolution-change ->', evt.detail);
});

CapturePhoto.defineCustomElement();
