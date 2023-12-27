let t=(t,e,i)=>(Number.isNaN(e)&&(e=0),Number.isNaN(i)&&(i=0),Math.min(Math.max(t,Math.min(e,i)),Math.max(e,i))),e="capture-photo",i=`
  :host {
    display: block;
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  :host([hidden]),
  [hidden],
  ::slotted([hidden]) {
    display: none;
  }

  video {
    display: block;
  }

  #output:empty {
    display: none;
  }
`,o=document.createElement("template");o.innerHTML=`
  <style>${i}</style>

  <video part="video" playsinline></video>

  <canvas hidden></canvas>

  <div part="actions-container">
    <slot name="capture-button">
      <button part="capture-button" type="button">
        <slot name="capture-button-content">Capture photo</slot>
      </button>
    </slot>

    <slot name="facing-mode-button" hidden>
      <button part="facing-mode-button" type="button">
        <slot name="facing-mode-button-content">Toggle facing mode</slot>
      </button>
    </slot>

    <slot name="actions"></slot>
  </div>

  <slot></slot>

  <div part="output-container" id="output"></div>
`;class n extends HTMLElement{#t={};#e=null;#i=null;#o=null;#n=null;#a=null;#s=null;#r=null;#l=null;constructor(){super(),this.#t=this.getSupportedConstraints(),this.shadowRoot||this.attachShadow({mode:"open"}).appendChild(o.content.cloneNode(!0))}static get observedAttributes(){return["no-image","facing-mode","camera-resolution","pan","tilt","zoom"]}attributeChangedCallback(t,e,i){if(!this.isConnected)return;let o=this.getTrackCapabilities(),n=this.getTrackSettings();if("no-image"===t&&e!==i&&this.#u(),"facing-mode"===t&&e!==i&&"facingMode"in this.#t){let t=["user","environment"].includes(this.facingMode||"");"facingMode"in n&&t&&(this.stopVideoStream(),this.startVideoStream())}if("camera-resolution"===t&&e!==i&&"string"==typeof this.cameraResolution){let[t,e]=this.cameraResolution.split("x").map(t=>Number(t));if("width"in o&&"height"in o){let i=!!(o.width?.min&&o.width?.max)&&t>=o?.width?.min&&t<=o?.width?.max,a=!!(o.height?.min&&o.height?.max)&&e>=o?.height?.min&&e<=o?.height?.max;"width"in n&&"height"in n&&i&&a&&(this.stopVideoStream(),this.startVideoStream())}}if("pan"===t&&e!==i&&"pan"in this.#t){let t=!!("pan"in o&&o.pan?.min&&o.pan?.max)&&this.pan>=o.pan.min&&this.pan<=o.pan.max;"pan"in n&&"number"==typeof this.pan&&t&&this.#h("pan",this.pan)}if("tilt"===t&&e!==i&&"tilt"in this.#t){let t=!!("tilt"in o&&o.tilt?.min&&o.tilt?.max)&&this.tilt>=o.tilt.min&&this.tilt<=o.tilt.max;"tilt"in n&&"number"==typeof this.tilt&&t&&this.#h("tilt",this.tilt)}if("zoom"===t&&e!==i&&"zoom"in this.#t){let t=!!("zoom"in o&&o.zoom?.min&&o.zoom?.max)&&this.zoom>=o.zoom.min&&this.zoom<=o.zoom.max;"zoom"in n&&"number"==typeof this.zoom&&t&&this.#h("zoom",this.zoom)}}connectedCallback(){if(this.#d("autpoPlay"),this.#d("noImage"),this.#d("facingMode"),this.#d("cameraResolution"),this.#d("pan"),this.#d("tilt"),this.#d("zoom"),this.#d("calculateFileSize"),this.#i=this.shadowRoot?.querySelector("canvas")||null,this.#o=this.shadowRoot?.getElementById("output")||null,this.#n=this.shadowRoot?.querySelector("video")||null,this.#a=this.shadowRoot?.querySelector('slot[name="capture-button"]')||null,this.#s=this.#c(),this.#r=this.shadowRoot?.querySelector('slot[name="facing-mode-button"]')||null,this.#l=this.#m(),this.#n?.addEventListener("loadedmetadata",this.#p),this.#a?.addEventListener("slotchange",this.#g),this.#s?.addEventListener("click",this.#b),this.#r?.addEventListener("slotchange",this.#f),this.#l?.addEventListener("click",this.#v),!n.isSupported())return this.dispatchEvent(new CustomEvent(`${e}:error`,{bubbles:!0,composed:!0,detail:{error:{name:"NotSupportedError",message:"Not supported"}}}));this.autoPlay&&this.startVideoStream()}disconnectedCallback(){this.stopVideoStream(),this.#l?.removeEventListener("click",this.#v),this.#s?.removeEventListener("click",this.#b),this.#n?.removeEventListener("canplay",this.#p),this.#a?.removeEventListener("slotchange",this.#g),this.#r?.removeEventListener("slotchange",this.#f)}get autoPlay(){return this.hasAttribute("auto-play")}set autoPlay(t){this.toggleAttribute("auto-play",!!t)}get noImage(){return this.hasAttribute("no-image")}set noImage(t){this.toggleAttribute("no-image",!!t)}get facingMode(){return this.getAttribute("facing-mode")||"user"}set facingMode(t){this.setAttribute("facing-mode",t)}get cameraResolution(){return this.getAttribute("camera-resolution")||""}set cameraResolution(t){this.setAttribute("camera-resolution",t)}get pan(){return Number(this.getAttribute("pan"))||0}set pan(t){this.setAttribute("pan",null!=t?t.toString():t)}get tilt(){return Number(this.getAttribute("tilt"))||0}set tilt(t){this.setAttribute("tilt",null!=t?t.toString():t)}get zoom(){return Number(this.getAttribute("zoom"))||1}set zoom(t){this.setAttribute("zoom",null!=t?t.toString():t)}get loading(){return this.hasAttribute("loading")}get calculateFileSize(){return this.hasAttribute("calculate-file-size")}set calculateFileSize(t){this.toggleAttribute("calculate-file-size",!!t)}#v=t=>{t.preventDefault(),this.loading||(this.facingMode="user"!==this.facingMode&&this.facingMode?"user":"environment")};#b=t=>{t.preventDefault(),this.capture()};#p=t=>{let i=t.target;i.play().then(()=>{this.dispatchEvent(new CustomEvent(`${e}:video-play`,{bubbles:!0,composed:!0,detail:{video:i}}))}).catch(t=>{this.dispatchEvent(new CustomEvent(`${e}:error`,{bubbles:!0,composed:!0,detail:{error:t}}))}).finally(()=>{this.removeAttribute("loading")})};#u(){this.#o&&Array.from(this.#o.childNodes).forEach(t=>t.remove())}#h(e,i){if(!this.#e||!e||!i)return;let[o]=this.#e.getVideoTracks(),n=this.getTrackCapabilities();e in this.getTrackSettings()&&o.applyConstraints({advanced:[{[e]:t(Number(i),n[e]?.min||1,n[e]?.max||1)}]})}#g=t=>{t.target?.name==="capture-button"&&(this.#s?.removeEventListener("click",this.#b),this.#s=this.#c(),this.#s&&(this.#s.addEventListener("click",this.#b),"BUTTON"===this.#s.nodeName||this.#s.hasAttribute("role")||this.#s.setAttribute("role","button")))};#f=t=>{t.target?.name==="facing-mode-button"&&(this.#l?.removeEventListener("click",this.#v),this.#l=this.#m(),this.#l&&(this.#l.addEventListener("click",this.#v),"BUTTON"===this.#l.nodeName||this.#l.hasAttribute("role")||this.#l.setAttribute("role","button")))};#m(){return this.#r&&this.#r.assignedElements({flatten:!0}).find(t=>"BUTTON"===t.nodeName||"facing-mode-button"===t.getAttribute("slot"))||null}#c(){return this.#a&&this.#a.assignedElements({flatten:!0}).find(t=>"BUTTON"===t.nodeName||"capture-button"===t.getAttribute("slot"))||null}#d(t){if(Object.prototype.hasOwnProperty.call(this,t)){let e=this[t];delete this[t],this[t]=e}}async startVideoStream(){if(!n.isSupported()||this.#e)return;this.setAttribute("loading","");let t={video:{facingMode:{ideal:this.facingMode||"user"},pan:!0,tilt:!0,zoom:!0},audio:!1};if("string"==typeof this.cameraResolution){let[e,i]=this.cameraResolution.split("x").map(t=>Number(t));t.video.width=e,t.video.height=i}try{this.#e=await navigator.mediaDevices.getUserMedia(t),this.#n&&(this.#n.srcObject=this.#e),this.#h("pan",this.pan),this.#h("tilt",this.tilt),this.#h("zoom",this.zoom);let e=this.getTrackSettings();"facingMode"in e&&this.#r&&(this.#r.hidden=!1)}catch(t){this.dispatchEvent(new CustomEvent(`${e}:error`,{bubbles:!0,composed:!0,detail:{error:t}}))}finally{this.removeAttribute("loading")}}stopVideoStream(){if(!this.#n||!this.#e)return;let[t]=this.#e.getVideoTracks();t?.stop(),this.#n.srcObject=null,this.#e=null}async capture(){if(!this.loading&&this.#i&&this.#n)try{let t=this.#i.getContext("2d"),i=this.#n.videoWidth,o=this.#n.videoHeight;this.#i.width=i,this.#i.height=o,t?.drawImage(this.#n,0,0,i,o);let n=this.#i.toDataURL("image/png");if("string"==typeof n&&n.includes("data:image")){if(!this.noImage){let t=new Image;t.src=n,t.width=i,t.height=o,t.setAttribute("part","output-image"),this.#u(),this.#o?.appendChild(t)}let t={dataURI:n,width:i,height:o};if(this.calculateFileSize)try{let e=await fetch(n),i=(await e.blob()).size;i&&(t.size=i)}catch(t){}this.dispatchEvent(new CustomEvent(`${e}:success`,{bubbles:!0,composed:!0,detail:t}))}}catch(t){this.dispatchEvent(new CustomEvent(`${e}:error`,{bubbles:!0,composed:!0,detail:{error:t}}))}}getSupportedConstraints(){return n.isSupported()&&navigator.mediaDevices.getSupportedConstraints()||{}}getTrackCapabilities(){if(!this.#e)return{};let[t]=this.#e.getVideoTracks();return t&&"function"==typeof t.getCapabilities&&t.getCapabilities()||{}}getTrackSettings(){if(!this.#e)return{};let[t]=this.#e.getVideoTracks();return t&&"function"==typeof t.getSettings&&t.getSettings()||{}}static isSupported(){return!!navigator.mediaDevices?.getUserMedia}static defineCustomElement(t=e){"undefined"==typeof window||window.customElements.get(t)||window.customElements.define(t,n)}}export{n as CapturePhoto};
