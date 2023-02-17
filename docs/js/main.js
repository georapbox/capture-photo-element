const isLocalhost = window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/capture-photo.js' : '../lib/capture-photo.js';

import(componentUrl).then(res => {
  const { CapturePhoto } = res;

  const $console = document.getElementById('console');

  document.addEventListener('capture-photo:error', evt => {
    console.log('capture-photo:error ->', evt.detail);
    $console.innerHTML += `<div>$ capture-photo:error -> ${evt.detail.error.name}: ${evt.detail.error.message}</div>`;
  });

  document.addEventListener('capture-photo:success', evt => {
    console.log('capture-photo:success ->', evt.detail);
    $console.innerHTML += `<div>$ capture-photo:success -> {"dataURI":"data:image/png;base64,...", "width":${evt.detail.width}, "height":${evt.detail.height}}</div>`;
  });

  CapturePhoto.defineCustomElement();
}).catch(err => {
  console.error(err);
});
