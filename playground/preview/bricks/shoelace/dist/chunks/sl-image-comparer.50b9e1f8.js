/*! For license information please see sl-image-comparer.50b9e1f8.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[154],{7108:(e,t,n)=>{n.r(t),n(8095),n(5517)},5517:(e,t,n)=>{n(2969),n(3467);var r=n(4124);function i(e){document.documentElement.classList["dark"===e||"dark-v2"===e?"add":"remove"]("sl-theme-dark")}n(1744),(0,r.t)(n.p),i(document.documentElement.dataset.theme),window.addEventListener("theme.change",(e=>{i(e.detail)}))},738:(e,t,n)=>{n.d(t,{Z:()=>a});var r=n(9601),i=n.n(r),o=n(2609),s=n.n(o)()(i());s.push([e.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const a=s},1744:(e,t,n)=>{var r=n(6062),i=n.n(r),o=n(4036),s=n.n(o),a=n(6793),l=n.n(a),d=n(7892),c=n.n(d),h=n(1173),u=n.n(h),g=n(2464),v=n.n(g),p=n(738),m={};m.styleTagTransform=v(),m.setAttributes=c(),m.insert=l().bind(null,"head"),m.domAPI=s(),m.insertStyleElement=u(),i()(p.Z,m),p.Z&&p.Z.locals&&p.Z.locals},6200:(e,t,n)=>{function r(e,t){function n(n){const r=e.getBoundingClientRect(),i=e.ownerDocument.defaultView,o=r.left+i.pageXOffset,s=r.top+i.pageYOffset,a=n.pageX-o,l=n.pageY-s;(null==t?void 0:t.onMove)&&t.onMove(a,l)}document.addEventListener("pointermove",n,{passive:!0}),document.addEventListener("pointerup",(function e(){document.removeEventListener("pointermove",n),document.removeEventListener("pointerup",e),(null==t?void 0:t.onStop)&&t.onStop()})),(null==t?void 0:t.initialEvent)instanceof PointerEvent&&n(t.initialEvent)}n.d(t,{o:()=>r})},9940:(e,t,n)=>{var r,i=n(9191),o=n(1939),s=n(5710),a=n(8424),l=n(453),d=Symbol(),c=Symbol(),h=new Map,u=class extends a.P{constructor(){super(...arguments),this.svg=null,this.label="",this.library="default"}static async resolveIcon(e){var t;let n;try{if(n=await fetch(e,{mode:"cors"}),!n.ok)return 410===n.status?d:c}catch(e){return c}try{const e=document.createElement("div");e.innerHTML=await n.text();const i=e.firstElementChild;if("svg"!==(null==(t=null==i?void 0:i.tagName)?void 0:t.toLowerCase()))return d;r||(r=new DOMParser);const o=r.parseFromString(i.outerHTML,"text/html").body.querySelector("svg");return o?(o.part.add("svg"),document.adoptNode(o)):d}catch(e){return d}}connectedCallback(){super.connectedCallback(),(0,i.E4)(this)}firstUpdated(){this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),(0,i.Sw)(this)}getUrl(){const e=(0,i.Tb)(this.library);return this.name&&e?e.resolver(this.name):this.src}handleLabelChange(){"string"==typeof this.label&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var e;const t=(0,i.Tb)(this.library),n=this.getUrl();if(!n)return void(this.svg=null);let r=h.get(n);r||(r=u.resolveIcon(n),h.set(n,r));const o=await r;if(o===c&&h.delete(n),n===this.getUrl())switch(o){case c:case d:this.svg=null,this.emit("sl-error");break;default:this.svg=o.cloneNode(!0),null==(e=null==t?void 0:t.mutator)||e.call(t,this.svg),this.emit("sl-load")}}render(){return this.svg}};u.styles=o.W,(0,l.u2)([(0,a.t)()],u.prototype,"svg",2),(0,l.u2)([(0,a.e2)({reflect:!0})],u.prototype,"name",2),(0,l.u2)([(0,a.e2)()],u.prototype,"src",2),(0,l.u2)([(0,a.e2)()],u.prototype,"label",2),(0,l.u2)([(0,a.e2)({reflect:!0})],u.prototype,"library",2),(0,l.u2)([(0,s.Y)("label")],u.prototype,"handleLabelChange",1),(0,l.u2)([(0,s.Y)(["name","src","library"])],u.prototype,"setIcon",1),u=(0,l.u2)([(0,a.e)("sl-icon")],u)},7282:(e,t,n)=>{n.d(t,{i:()=>o});var r=n(4370),i=n(5954),o=(0,r.e)(class extends r.i{constructor(e){var t;if(super(e),e.type!==r.t.ATTRIBUTE||"style"!==e.name||(null===(t=e.strings)||void 0===t?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce(((t,n)=>{const r=e[n];return null==r?t:t+`${n=n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`}),"")}update(e,[t]){const{style:n}=e.element;if(void 0===this.vt){this.vt=new Set;for(const e in t)this.vt.add(e);return this.render(t)}this.vt.forEach((e=>{null==t[e]&&(this.vt.delete(e),e.includes("-")?n.removeProperty(e):n[e]="")}));for(const e in t){const r=t[e];null!=r&&(this.vt.add(e),e.includes("-")?n.setProperty(e,r):n[e]=r)}return i.x}})},6281:(e,t,n)=>{n.d(t,{N:()=>r});var r=n(5954).i`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`},1939:(e,t,n)=>{n.d(t,{W:()=>i});var r=n(6281),i=n(5954).i`
  ${r.N}

  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`},1807:(e,t,n)=>{function r(e,t,n){return r=e<t?t:e>n?n:e,Object.is(r,-0)?0:r;var r}n.d(t,{u:()=>r})},2759:(e,t,n)=>{n.d(t,{J:()=>i});var r={caret:'\n    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n      <polyline points="6 9 12 15 18 9"></polyline>\n    </svg>\n  ',check:'\n    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">\n        <g stroke="currentColor" stroke-width="2">\n          <g transform="translate(3.428571, 3.428571)">\n            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>\n            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>\n          </g>\n        </g>\n      </g>\n    </svg>\n  ',"chevron-down":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',"chevron-left":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>\n    </svg>\n  ',"chevron-right":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',eye:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">\n      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>\n      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>\n    </svg>\n  ',"eye-slash":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">\n      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>\n      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>\n      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>\n    </svg>\n  ',eyedropper:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">\n      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>\n    </svg>\n  ',"grip-vertical":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">\n      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>\n    </svg>\n  ',indeterminate:'\n    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">\n        <g stroke="currentColor" stroke-width="2">\n          <g transform="translate(2.285714, 6.857143)">\n            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>\n          </g>\n        </g>\n      </g>\n    </svg>\n  ',"person-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">\n      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>\n    </svg>\n  ',"play-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">\n      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>\n    </svg>\n  ',"pause-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">\n      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>\n    </svg>\n  ',radio:'\n    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <g fill="currentColor">\n          <circle cx="8" cy="8" r="3.42857143"></circle>\n        </g>\n      </g>\n    </svg>\n  ',"star-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">\n      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>\n    </svg>\n  ',"x-lg":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">\n      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>\n    </svg>\n  ',"x-circle-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">\n      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>\n    </svg>\n  '},i={name:"system",resolver:e=>e in r?`data:image/svg+xml,${encodeURIComponent(r[e])}`:""}},1862:(e,t,n)=>{n.d(t,{P:()=>d,V:()=>h});var r,i=new Set,o=new MutationObserver(c),s=new Map,a=document.documentElement.dir||"ltr",l=document.documentElement.lang||navigator.language;function d(...e){e.map((e=>{const t=e.$code.toLowerCase();s.has(t)?s.set(t,Object.assign(Object.assign({},s.get(t)),e)):s.set(t,e),r||(r=e)})),c()}function c(){a=document.documentElement.dir||"ltr",l=document.documentElement.lang||navigator.language,[...i.keys()].map((e=>{"function"==typeof e.requestUpdate&&e.requestUpdate()}))}o.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]});var h=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){i.add(this.host)}hostDisconnected(){i.delete(this.host)}dir(){return`${this.host.dir||a}`.toLowerCase()}lang(){return`${this.host.lang||l}`.toLowerCase()}getTranslationData(e){var t,n;const r=new Intl.Locale(e),i=null==r?void 0:r.language.toLowerCase(),o=null!==(n=null===(t=null==r?void 0:r.region)||void 0===t?void 0:t.toLowerCase())&&void 0!==n?n:"";return{locale:r,language:i,region:o,primary:s.get(`${i}-${o}`),secondary:s.get(i)}}exists(e,t){var n;const{primary:i,secondary:o}=this.getTranslationData(null!==(n=t.lang)&&void 0!==n?n:this.lang());return t=Object.assign({includeFallback:!1},t),!!(i&&i[e]||o&&o[e]||t.includeFallback&&r&&r[e])}term(e,...t){const{primary:n,secondary:i}=this.getTranslationData(this.lang());let o;if(n&&n[e])o=n[e];else if(i&&i[e])o=i[e];else{if(!r||!r[e])return console.error(`No translation found for: ${String(e)}`),String(e);o=r[e]}return"function"==typeof o?o(...t):o}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,n){return new Intl.RelativeTimeFormat(this.lang(),n).format(e,t)}}},8379:(e,t,n)=>{n.d(t,{V:()=>i});var r=n(1862),i=class extends r.V{};(0,r.P)({$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copy:"Copy",currentValue:"Current value",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>0===e?"No options selected":1===e?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"})},5381:(e,t,n)=>{n.d(t,{o:()=>o});var r=n(4370),i=n(5954),o=(0,r.e)(class extends r.i{constructor(e){var t;if(super(e),e.type!==r.t.ATTRIBUTE||"class"!==e.name||(null===(t=e.strings)||void 0===t?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){var n,r;if(void 0===this.nt){this.nt=new Set,void 0!==e.strings&&(this.st=new Set(e.strings.join(" ").split(/\s/).filter((e=>""!==e))));for(const e in t)t[e]&&!(null===(n=this.st)||void 0===n?void 0:n.has(e))&&this.nt.add(e);return this.render(t)}const o=e.element.classList;this.nt.forEach((e=>{e in t||(o.remove(e),this.nt.delete(e))}));for(const e in t){const n=!!t[e];n===this.nt.has(e)||(null===(r=this.st)||void 0===r?void 0:r.has(e))||(n?(o.add(e),this.nt.add(e)):(o.remove(e),this.nt.delete(e)))}return i.x}})},836:(e,t,n)=>{n.d(t,{Z:()=>i});var r=n(9264),i={name:"default",resolver:e=>(0,r.b)(`assets/icons/${e}.svg`)}},4370:(e,t,n)=>{n.d(t,{e:()=>i,i:()=>o,t:()=>r});var r={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},i=e=>(...t)=>({_$litDirective$:e,values:t}),o=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}},9191:(e,t,n)=>{n.d(t,{E4:()=>a,Sw:()=>l,Tb:()=>d});var r=n(836),i=n(2759),o=[r.Z,i.J],s=[];function a(e){s.push(e)}function l(e){s=s.filter((t=>t!==e))}function d(e){return o.find((t=>t.name===e))}},5710:(e,t,n)=>{n.d(t,{Y:()=>i});var r=n(453);function i(e,t){const n=(0,r.ih)({waitUntilFirstUpdate:!1},t);return(t,r)=>{const{update:i}=t,o=Array.isArray(e)?e:[e];t.update=function(e){o.forEach((t=>{const i=t;if(e.has(i)){const t=e.get(i),o=this[i];t!==o&&(n.waitUntilFirstUpdate&&!this.hasUpdated||this[r](t,o))}})),i.call(this,e)}}}},8095:(e,t,n)=>{var r=n(6281),i=n(5954),o=i.i`
  ${r.N}

  :host {
    --divider-width: 2px;
    --handle-size: 2.5rem;

    display: inline-block;
    position: relative;
  }

  .image-comparer {
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  .image-comparer__before,
  .image-comparer__after {
    display: block;
    pointer-events: none;
  }

  .image-comparer__before::slotted(img),
  .image-comparer__after::slotted(img),
  .image-comparer__before::slotted(svg),
  .image-comparer__after::slotted(svg) {
    display: block;
    max-width: 100% !important;
    height: auto;
  }

  .image-comparer__after {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  .image-comparer__divider {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    width: var(--divider-width);
    height: 100%;
    background-color: var(--sl-color-neutral-0);
    translate: calc(var(--divider-width) / -2);
    cursor: ew-resize;
  }

  .image-comparer__handle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: calc(50% - (var(--handle-size) / 2));
    width: var(--handle-size);
    height: var(--handle-size);
    background-color: var(--sl-color-neutral-0);
    border-radius: var(--sl-border-radius-circle);
    font-size: calc(var(--handle-size) * 0.5);
    color: var(--sl-color-neutral-700);
    cursor: inherit;
    z-index: 10;
  }

  .image-comparer__handle:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }
`,s=n(6200),a=n(7282),l=n(1807),d=n(8379),c=n(5710),h=n(5381),u=n(8424),g=n(453),v=class extends u.P{constructor(){super(...arguments),this.localize=new d.V(this),this.position=50}handleDrag(e){const{width:t}=this.base.getBoundingClientRect(),n="rtl"===this.localize.dir();e.preventDefault(),(0,s.o)(this.base,{onMove:e=>{this.position=parseFloat((0,l.u)(e/t*100,0,100).toFixed(2)),n&&(this.position=100-this.position)},initialEvent:e})}handleKeyDown(e){const t="ltr"===this.localize.dir(),n="rtl"===this.localize.dir();if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){const r=e.shiftKey?10:1;let i=this.position;e.preventDefault(),(t&&"ArrowLeft"===e.key||n&&"ArrowRight"===e.key)&&(i-=r),(t&&"ArrowRight"===e.key||n&&"ArrowLeft"===e.key)&&(i+=r),"Home"===e.key&&(i=0),"End"===e.key&&(i=100),i=(0,l.u)(i,0,100),this.position=i}}handlePositionChange(){this.emit("sl-change")}render(){const e="rtl"===this.localize.dir();return i.y`
      <div
        part="base"
        id="image-comparer"
        class=${(0,h.o)({"image-comparer":!0,"image-comparer--rtl":e})}
        @keydown=${this.handleKeyDown}
      >
        <div class="image-comparer__image">
          <slot name="before" part="before" class="image-comparer__before"></slot>

          <slot
            name="after"
            part="after"
            class="image-comparer__after"
            style=${(0,a.i)({clipPath:e?`inset(0 0 0 ${100-this.position}%)`:`inset(0 ${100-this.position}% 0 0)`})}
          ></slot>
        </div>

        <div
          part="divider"
          class="image-comparer__divider"
          style=${(0,a.i)({left:e?100-this.position+"%":`${this.position}%`})}
          @mousedown=${this.handleDrag}
          @touchstart=${this.handleDrag}
        >
          <slot
            name="handle"
            part="handle"
            class="image-comparer__handle"
            role="scrollbar"
            aria-valuenow=${this.position}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-controls="image-comparer"
            tabindex="0"
          >
            <sl-icon library="system" name="grip-vertical"></sl-icon>
          </slot>
        </div>
      </div>
    `}};v.styles=o,(0,g.u2)([(0,u.i)(".image-comparer")],v.prototype,"base",2),(0,g.u2)([(0,u.i)(".image-comparer__handle")],v.prototype,"handle",2),(0,g.u2)([(0,u.e2)({type:Number,reflect:!0})],v.prototype,"position",2),(0,g.u2)([(0,c.Y)("position",{waitUntilFirstUpdate:!0})],v.prototype,"handlePositionChange",1),v=(0,g.u2)([(0,u.e)("sl-image-comparer")],v),n(1862),n(9940),n(9191),n(836),n(2759),n(1939),n(4370)}}]);
//# sourceMappingURL=sl-image-comparer.50b9e1f8.js.map