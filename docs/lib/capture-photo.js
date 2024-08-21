/*!
 * @georapbox/capture-photo-element
 * A custom element that implements the MediaDevices.getUserMedia() method of the MediaDevices interface to capture a photo in the browser.
 *
 * @version 4.1.0
 * @homepage https://github.com/georapbox/capture-photo-element#readme
 * @author George Raptis <georapbox@gmail.com>
 * @license MIT
 */
var l=(r,t,i)=>(Number.isNaN(t)&&(t=0),Number.isNaN(i)&&(i=0),Math.min(Math.max(r,Math.min(t,i)),Math.max(t,i)));var a="capture-photo",g=`
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
`,d=document.createElement("template");d.innerHTML=`
  <style>${g}</style>

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
`;var u=class r extends HTMLElement{#r={};#t=null;#h=null;#l=null;#e=null;#c=null;#i=null;#n=null;#s=null;constructor(){super(),this.#r=this.getSupportedConstraints(),this.shadowRoot||this.attachShadow({mode:"open"}).appendChild(d.content.cloneNode(!0))}static get observedAttributes(){return["no-image","facing-mode","camera-resolution","pan","tilt","zoom","torch"]}attributeChangedCallback(t,i,s){if(!this.isConnected)return;let e=this.getTrackCapabilities(),n=this.getTrackSettings();if(t==="no-image"&&i!==s&&this.#g(),t==="facing-mode"&&i!==s&&"facingMode"in this.#r){let o=["user","environment"].includes(this.facingMode||"");"facingMode"in n&&o&&this.#y()}if(t==="camera-resolution"&&i!==s&&typeof this.cameraResolution=="string"&&this.cameraResolution.trim().length>0){let[o=0,c=0]=this.cameraResolution.split("x").map(h=>Number(h));if(o>0&&c>0&&"width"in e&&"height"in e){let h=e.width?.min&&e.width?.max?o>=e?.width?.min&&o<=e?.width?.max:!1,m=e.height?.min&&e.height?.max?c>=e?.height?.min&&c<=e?.height?.max:!1;"width"in n&&"height"in n&&h&&m&&this.#y()}}if(t==="pan"&&i!==s&&"pan"in this.#r){let o="pan"in e&&e.pan?.min&&e.pan?.max?this.pan>=e.pan.min&&this.pan<=e.pan.max:!1;typeof this.pan=="number"&&o&&this.#a("pan",this.pan)}if(t==="tilt"&&i!==s&&"tilt"in this.#r){let o="tilt"in e&&e.tilt?.min&&e.tilt?.max?this.tilt>=e.tilt.min&&this.tilt<=e.tilt.max:!1;typeof this.tilt=="number"&&o&&this.#a("tilt",this.tilt)}if(t==="zoom"&&i!==s&&"zoom"in this.#r){let o="zoom"in e&&e.zoom?.min&&e.zoom?.max?this.zoom>=e.zoom.min&&this.zoom<=e.zoom.max:!1;typeof this.zoom=="number"&&o&&this.#a("zoom",this.zoom)}t==="torch"&&i!==s&&"torch"in this.#r&&this.#a("torch",this.torch)}connectedCallback(){if(this.#o("autpoPlay"),this.#o("noImage"),this.#o("facingMode"),this.#o("cameraResolution"),this.#o("pan"),this.#o("tilt"),this.#o("zoom"),this.#o("torch"),this.#o("calculateFileSize"),this.#h=this.shadowRoot?.querySelector("canvas")||null,this.#l=this.shadowRoot?.getElementById("output")||null,this.#e=this.shadowRoot?.querySelector("video")||null,this.#c=this.shadowRoot?.querySelector('slot[name="capture-button"]')||null,this.#i=this.#v(),this.#n=this.shadowRoot?.querySelector('slot[name="facing-mode-button"]')||null,this.#s=this.#b(),this.#e?.addEventListener("loadedmetadata",this.#m),this.#c?.addEventListener("slotchange",this.#p),this.#i?.addEventListener("click",this.#d),this.#n?.addEventListener("slotchange",this.#f),this.#s?.addEventListener("click",this.#u),!r.isSupported())return this.dispatchEvent(new CustomEvent(`${a}:error`,{bubbles:!0,composed:!0,detail:{error:{name:"NotSupportedError",message:"Not supported"}}}));this.autoPlay&&this.startVideoStream()}disconnectedCallback(){this.stopVideoStream(),this.#s?.removeEventListener("click",this.#u),this.#i?.removeEventListener("click",this.#d),this.#e?.removeEventListener("canplay",this.#m),this.#c?.removeEventListener("slotchange",this.#p),this.#n?.removeEventListener("slotchange",this.#f)}get autoPlay(){return this.hasAttribute("auto-play")}set autoPlay(t){this.toggleAttribute("auto-play",!!t)}get noImage(){return this.hasAttribute("no-image")}set noImage(t){this.toggleAttribute("no-image",!!t)}get facingMode(){return this.getAttribute("facing-mode")||"user"}set facingMode(t){this.setAttribute("facing-mode",t)}get cameraResolution(){return this.getAttribute("camera-resolution")||""}set cameraResolution(t){this.setAttribute("camera-resolution",t)}get pan(){return Number(this.getAttribute("pan"))||0}set pan(t){this.setAttribute("pan",t!=null?t.toString():t)}get tilt(){return Number(this.getAttribute("tilt"))||0}set tilt(t){this.setAttribute("tilt",t!=null?t.toString():t)}get zoom(){return Number(this.getAttribute("zoom"))||1}set zoom(t){this.setAttribute("zoom",t!=null?t.toString():t)}get torch(){return this.hasAttribute("torch")}set torch(t){this.toggleAttribute("torch",!!t)}get loading(){return this.hasAttribute("loading")}get calculateFileSize(){return this.hasAttribute("calculate-file-size")}set calculateFileSize(t){this.toggleAttribute("calculate-file-size",!!t)}#u=t=>{t.preventDefault(),!this.loading&&(this.facingMode=this.facingMode==="user"||!this.facingMode?"environment":"user")};#d=t=>{t.preventDefault(),this.capture()};#m=t=>{let i=t.target;i.play().then(()=>{this.dispatchEvent(new CustomEvent(`${a}:video-play`,{bubbles:!0,composed:!0,detail:{video:i}}))}).catch(s=>{this.dispatchEvent(new CustomEvent(`${a}:error`,{bubbles:!0,composed:!0,detail:{error:s}}))}).finally(()=>{this.removeAttribute("loading")})};#g(){this.#l&&Array.from(this.#l.childNodes).forEach(t=>t.remove())}#a(t,i){if(!this.#t)return;let[s]=this.#t.getVideoTracks(),e=this.getTrackCapabilities(),n=this.getTrackSettings(),o=t==="pan"||t==="tilt"||t==="zoom"?l(Number(i),e[t]?.min||1,e[t]?.max||1):i;t in n&&s.applyConstraints({advanced:[{[t]:o}]}).catch(()=>{})}#p=t=>{t.target?.name==="capture-button"&&(this.#i?.removeEventListener("click",this.#d),this.#i=this.#v(),this.#i&&(this.#i.addEventListener("click",this.#d),this.#i.nodeName!=="BUTTON"&&!this.#i.hasAttribute("role")&&this.#i.setAttribute("role","button")))};#f=t=>{t.target?.name==="facing-mode-button"&&(this.#s?.removeEventListener("click",this.#u),this.#s=this.#b(),this.#s&&(this.#s.addEventListener("click",this.#u),this.#s.nodeName!=="BUTTON"&&!this.#s.hasAttribute("role")&&this.#s.setAttribute("role","button")))};#b(){return this.#n&&this.#n.assignedElements({flatten:!0}).find(t=>t.nodeName==="BUTTON"||t.getAttribute("slot")==="facing-mode-button")||null}#v(){return this.#c&&this.#c.assignedElements({flatten:!0}).find(t=>t.nodeName==="BUTTON"||t.getAttribute("slot")==="capture-button")||null}#y(){this.stopVideoStream(),this.startVideoStream()}#o(t){let i=this;if(Object.prototype.hasOwnProperty.call(i,t)){let s=i[t];delete i[t],i[t]=s}}async startVideoStream(){if(!r.isSupported()||this.#t)return;this.setAttribute("loading","");let t={video:{facingMode:{ideal:this.facingMode||"user"},pan:!0,tilt:!0,zoom:!0,torch:this.torch},audio:!1};if(typeof this.cameraResolution=="string"&&this.cameraResolution.trim().length>0){let[i=0,s=0]=this.cameraResolution.split("x").map(e=>Number(e));i>0&&s>0&&(t.video.width=i,t.video.height=s)}try{this.#t=await navigator.mediaDevices.getUserMedia(t),this.#e&&(this.#e.srcObject=this.#t),this.#a("pan",this.pan),this.#a("tilt",this.tilt),this.#a("zoom",this.zoom),"facingMode"in this.getTrackSettings()&&this.#n&&(this.#n.hidden=!1)}catch(i){this.dispatchEvent(new CustomEvent(`${a}:error`,{bubbles:!0,composed:!0,detail:{error:i}}))}finally{this.removeAttribute("loading")}}stopVideoStream(){if(!this.#e||!this.#t)return;let[t]=this.#t.getVideoTracks();t?.stop(),this.#e.srcObject=null,this.#t=null}async capture(){if(!(this.loading||!this.#h||!this.#e))try{let t=this.#h.getContext("2d"),i=this.#e.videoWidth,s=this.#e.videoHeight;this.#h.width=i,this.#h.height=s,t?.drawImage(this.#e,0,0,i,s);let e=this.#h.toDataURL("image/png");if(typeof e=="string"&&e.includes("data:image")){if(!this.noImage){let o=new Image;o.src=e,o.width=i,o.height=s,o.alt="Captured photo",o.setAttribute("part","output-image"),this.#g(),this.#l?.appendChild(o)}let n={dataURI:e,width:i,height:s};if(this.calculateFileSize)try{let h=(await(await fetch(e)).blob()).size;h&&(n.size=h)}catch{}this.dispatchEvent(new CustomEvent(`${a}:success`,{bubbles:!0,composed:!0,detail:n}))}}catch(t){this.dispatchEvent(new CustomEvent(`${a}:error`,{bubbles:!0,composed:!0,detail:{error:t}}))}}getSupportedConstraints(){return r.isSupported()?navigator.mediaDevices.getSupportedConstraints()||{}:{}}getTrackCapabilities(){if(!this.#t)return{};let[t]=this.#t.getVideoTracks();return t&&typeof t.getCapabilities=="function"?t.getCapabilities()||{}:{}}getTrackSettings(){if(!this.#t)return{};let[t]=this.#t.getVideoTracks();return t&&typeof t.getSettings=="function"?t.getSettings()||{}:{}}static isSupported(){return!!navigator.mediaDevices?.getUserMedia}static defineCustomElement(t=a){typeof window<"u"&&!window.customElements.get(t)&&window.customElements.define(t,r)}};export{u as CapturePhoto};
