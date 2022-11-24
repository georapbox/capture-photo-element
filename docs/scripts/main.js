const isLocalhost = window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/capture-photo.js' : 'https://unpkg.com/@georapbox/capture-photo-element';

import(componentUrl).then(res => {
  const { CapturePhoto } = res;

  const $console = document.getElementById('console');

  document.addEventListener('capture-photo:video-play', evt => {
    console.log('capture-photo:video-play ->', evt.detail);
    $console.innerHTML += `<div>$ capture-photo:video-play</div>`;
  });

  document.addEventListener('capture-photo:facing-mode-change', evt => {
    console.log('capture-photo:facing-mode-change ->', evt.detail);
    $console.innerHTML += `<div>$ capture-photo:facing-mode-change -> ${JSON.stringify(evt.detail)}</div>`;
  });

  document.addEventListener('capture-photo:error', evt => {
    console.log('capture-photo:error ->', evt.detail);
    $console.innerHTML += `<div>$ capture-photo:error -> ${evt.detail.error.name}: ${evt.detail.error.message}</div>`;
  });

  document.addEventListener('capture-photo:success', evt => {
    console.log('capture-photo:success ->', evt.detail);
    $console.innerHTML += `<div>$ capture-photo:success -> {"dataURI":"data:image/png;base64,...", "width":${evt.detail.width}, "height":${evt.detail.height}}</div>`;
  });

  document.addEventListener('capture-photo:camera-resolution-change', evt => {
    console.log('capture-photo:camera-resolution-change ->', evt.detail);
    $console.innerHTML += `<div>$ capture-photo:camera-resolution-change -> ${JSON.stringify(evt.detail)}</div>`;
  });

  document.addEventListener('capture-photo:pan-change', evt => {
    console.log('capture-photo:pan-change ->', evt.detail);
    $console.innerHTML += `<div>$ capture-photo:pan-change -> ${JSON.stringify(evt.detail)}</div>`;
  });

  document.addEventListener('capture-photo:tilt-change', evt => {
    console.log('capture-photo:tilt-change ->', evt.detail);
    $console.innerHTML += `<div>$ capture-photo:tilt-change -> ${JSON.stringify(evt.detail)}</div>`;
  });

  document.addEventListener('capture-photo:zoom-change', evt => {
    console.log('capture-photo:zoom-change ->', evt.detail);
    $console.innerHTML += `<div>$ capture-photo:zoom-change -> ${JSON.stringify(evt.detail)}</div>`;
  });

  CapturePhoto.defineCustomElement();
}).catch(err => {
  console.error(err);
});
