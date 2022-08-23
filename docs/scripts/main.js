const isLocalhost = window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost');
const componentUrl = isLocalhost ? '../../src/capture-photo.js' : 'https://unpkg.com/@georapbox/capture-photo-element/dist/capture-photo.min.js';

import(componentUrl).then(res => {
  const { CapturePhoto } = res;

  const $console = document.getElementById('console');

  document.addEventListener('capture-photo:facing-mode-change', evt => {
    console.log('capture-photo:facing-mode-change ->', evt.detail);
    $console.innerHTML += `<div>$ <span class="info">capture-photo:facing-mode-change</span> -> ${JSON.stringify(evt.detail)}</div>`;
  });

  document.addEventListener('capture-photo:error', evt => {
    console.log('capture-photo:error ->', evt.detail);
    $console.innerHTML += `<div>$ <span class="error">capture-photo:error</span> -> ${evt.detail.error.name}: ${evt.detail.error.message}</div>`;
  });

  document.addEventListener('capture-photo:success', evt => {
    console.log('capture-photo:success ->', evt.detail);
    $console.innerHTML += `<div>$ <span class="success">capture-photo:success</span> -> {"dataURI":"data:image/png;base64,...", "width":${evt.detail.width}, "height":${evt.detail.height}}</div>`;
  });

  document.addEventListener('capture-photo:camera-resolution-change', evt => {
    console.log('capture-photo:camera-resolution-change ->', evt.detail);
    $console.innerHTML += `<div>$ <span class="info">capture-photo:camera-resolution-change</span> -> ${JSON.stringify(evt.detail)}</div>`;
  });

  document.addEventListener('capture-photo:zoom-change', evt => {
    console.log('capture-photo:zoom-change ->', evt.detail);
    $console.innerHTML += `<div>$ <span class="info">capture-photo:zoom-change</span> -> ${JSON.stringify(evt.detail)}</div>`;
  });

  CapturePhoto.defineCustomElement();
}).catch(err => {
  console.error(err);
});
