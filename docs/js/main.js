const isLocalhost = window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/capture-photo.js' : '../lib/capture-photo.js';

import(componentUrl).then(res => {
  const { CapturePhoto } = res;

  document.addEventListener('capture-photo:error', evt => {
    console.log('capture-photo:error ->', evt.detail);
  });

  document.addEventListener('capture-photo:success', evt => {
    console.log('capture-photo:success ->', evt.detail);
  });

  CapturePhoto.defineCustomElement();
}).catch(err => {
  console.error(err);
});
