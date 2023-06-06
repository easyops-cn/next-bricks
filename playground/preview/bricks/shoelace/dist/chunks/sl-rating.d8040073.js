/*! For license information please see sl-rating.d8040073.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[9368],{6622:(e,t,s)=>{s.r(t),s(5734),s(5517)},5517:(e,t,s)=>{s(2969),s(3467);var i=s(4124);function r(e){document.documentElement.classList["dark"===e||"dark-v2"===e?"add":"remove"]("sl-theme-dark")}s(1744),(0,i.t)(s.p),r(document.documentElement.dataset.theme),window.addEventListener("theme.change",(e=>{r(e.detail)}))},738:(e,t,s)=>{s.d(t,{Z:()=>l});var i=s(9601),r=s.n(i),n=s(2609),o=s.n(n)()(r());o.push([e.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const l=o},1744:(e,t,s)=>{var i=s(6062),r=s.n(i),n=s(4036),o=s.n(n),l=s(6793),a=s.n(l),h=s(7892),d=s.n(h),c=s(1173),u=s.n(c),v=s(2464),g=s.n(v),p=s(738),m={};m.styleTagTransform=g(),m.setAttributes=d(),m.insert=a().bind(null,"head"),m.domAPI=o(),m.insertStyleElement=u(),r()(p.Z,m),p.Z&&p.Z.locals&&p.Z.locals},9940:(e,t,s)=>{var i,r=s(9191),n=s(1939),o=s(5710),l=s(8424),a=s(453),h=Symbol(),d=Symbol(),c=new Map,u=class extends l.P{constructor(){super(...arguments),this.svg=null,this.label="",this.library="default"}static async resolveIcon(e){var t;let s;try{if(s=await fetch(e,{mode:"cors"}),!s.ok)return 410===s.status?h:d}catch(e){return d}try{const e=document.createElement("div");e.innerHTML=await s.text();const r=e.firstElementChild;if("svg"!==(null==(t=null==r?void 0:r.tagName)?void 0:t.toLowerCase()))return h;i||(i=new DOMParser);const n=i.parseFromString(r.outerHTML,"text/html").body.querySelector("svg");return n?(n.part.add("svg"),document.adoptNode(n)):h}catch(e){return h}}connectedCallback(){super.connectedCallback(),(0,r.E4)(this)}firstUpdated(){this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),(0,r.Sw)(this)}getUrl(){const e=(0,r.Tb)(this.library);return this.name&&e?e.resolver(this.name):this.src}handleLabelChange(){"string"==typeof this.label&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var e;const t=(0,r.Tb)(this.library),s=this.getUrl();if(!s)return void(this.svg=null);let i=c.get(s);i||(i=u.resolveIcon(s),c.set(s,i));const n=await i;if(n===d&&c.delete(s),s===this.getUrl())switch(n){case d:case h:this.svg=null,this.emit("sl-error");break;default:this.svg=n.cloneNode(!0),null==(e=null==t?void 0:t.mutator)||e.call(t,this.svg),this.emit("sl-load")}}render(){return this.svg}};u.styles=n.W,(0,a.u2)([(0,l.t)()],u.prototype,"svg",2),(0,a.u2)([(0,l.e2)({reflect:!0})],u.prototype,"name",2),(0,a.u2)([(0,l.e2)()],u.prototype,"src",2),(0,a.u2)([(0,l.e2)()],u.prototype,"label",2),(0,a.u2)([(0,l.e2)({reflect:!0})],u.prototype,"library",2),(0,a.u2)([(0,o.Y)("label")],u.prototype,"handleLabelChange",1),(0,a.u2)([(0,o.Y)(["name","src","library"])],u.prototype,"setIcon",1),u=(0,a.u2)([(0,l.e)("sl-icon")],u)},7282:(e,t,s)=>{s.d(t,{i:()=>n});var i=s(4370),r=s(5954),n=(0,i.e)(class extends i.i{constructor(e){var t;if(super(e),e.type!==i.t.ATTRIBUTE||"style"!==e.name||(null===(t=e.strings)||void 0===t?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce(((t,s)=>{const i=e[s];return null==i?t:t+`${s=s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`}),"")}update(e,[t]){const{style:s}=e.element;if(void 0===this.vt){this.vt=new Set;for(const e in t)this.vt.add(e);return this.render(t)}this.vt.forEach((e=>{null==t[e]&&(this.vt.delete(e),e.includes("-")?s.removeProperty(e):s[e]="")}));for(const e in t){const i=t[e];null!=i&&(this.vt.add(e),e.includes("-")?s.setProperty(e,i):s[e]=i)}return r.x}})},6281:(e,t,s)=>{s.d(t,{N:()=>i});var i=s(5954).i`
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
`},1939:(e,t,s)=>{s.d(t,{W:()=>r});var i=s(6281),r=s(5954).i`
  ${i.N}

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
`},1807:(e,t,s)=>{function i(e,t,s){return i=e<t?t:e>s?s:e,Object.is(i,-0)?0:i;var i}s.d(t,{u:()=>i})},2759:(e,t,s)=>{s.d(t,{J:()=>r});var i={caret:'\n    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n      <polyline points="6 9 12 15 18 9"></polyline>\n    </svg>\n  ',check:'\n    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">\n        <g stroke="currentColor" stroke-width="2">\n          <g transform="translate(3.428571, 3.428571)">\n            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>\n            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>\n          </g>\n        </g>\n      </g>\n    </svg>\n  ',"chevron-down":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',"chevron-left":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>\n    </svg>\n  ',"chevron-right":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',eye:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">\n      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>\n      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>\n    </svg>\n  ',"eye-slash":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">\n      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>\n      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>\n      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>\n    </svg>\n  ',eyedropper:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">\n      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>\n    </svg>\n  ',"grip-vertical":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">\n      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>\n    </svg>\n  ',indeterminate:'\n    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">\n        <g stroke="currentColor" stroke-width="2">\n          <g transform="translate(2.285714, 6.857143)">\n            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>\n          </g>\n        </g>\n      </g>\n    </svg>\n  ',"person-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">\n      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>\n    </svg>\n  ',"play-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">\n      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>\n    </svg>\n  ',"pause-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">\n      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>\n    </svg>\n  ',radio:'\n    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <g fill="currentColor">\n          <circle cx="8" cy="8" r="3.42857143"></circle>\n        </g>\n      </g>\n    </svg>\n  ',"star-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">\n      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>\n    </svg>\n  ',"x-lg":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">\n      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>\n    </svg>\n  ',"x-circle-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">\n      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>\n    </svg>\n  '},r={name:"system",resolver:e=>e in i?`data:image/svg+xml,${encodeURIComponent(i[e])}`:""}},1862:(e,t,s)=>{s.d(t,{P:()=>h,V:()=>c});var i,r=new Set,n=new MutationObserver(d),o=new Map,l=document.documentElement.dir||"ltr",a=document.documentElement.lang||navigator.language;function h(...e){e.map((e=>{const t=e.$code.toLowerCase();o.has(t)?o.set(t,Object.assign(Object.assign({},o.get(t)),e)):o.set(t,e),i||(i=e)})),d()}function d(){l=document.documentElement.dir||"ltr",a=document.documentElement.lang||navigator.language,[...r.keys()].map((e=>{"function"==typeof e.requestUpdate&&e.requestUpdate()}))}n.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]});var c=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){r.add(this.host)}hostDisconnected(){r.delete(this.host)}dir(){return`${this.host.dir||l}`.toLowerCase()}lang(){return`${this.host.lang||a}`.toLowerCase()}getTranslationData(e){var t,s;const i=new Intl.Locale(e),r=null==i?void 0:i.language.toLowerCase(),n=null!==(s=null===(t=null==i?void 0:i.region)||void 0===t?void 0:t.toLowerCase())&&void 0!==s?s:"";return{locale:i,language:r,region:n,primary:o.get(`${r}-${n}`),secondary:o.get(r)}}exists(e,t){var s;const{primary:r,secondary:n}=this.getTranslationData(null!==(s=t.lang)&&void 0!==s?s:this.lang());return t=Object.assign({includeFallback:!1},t),!!(r&&r[e]||n&&n[e]||t.includeFallback&&i&&i[e])}term(e,...t){const{primary:s,secondary:r}=this.getTranslationData(this.lang());let n;if(s&&s[e])n=s[e];else if(r&&r[e])n=r[e];else{if(!i||!i[e])return console.error(`No translation found for: ${String(e)}`),String(e);n=i[e]}return"function"==typeof n?n(...t):n}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,s){return new Intl.RelativeTimeFormat(this.lang(),s).format(e,t)}}},8379:(e,t,s)=>{s.d(t,{V:()=>r});var i=s(1862),r=class extends i.V{};(0,i.P)({$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copy:"Copy",currentValue:"Current value",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>0===e?"No options selected":1===e?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"})},5381:(e,t,s)=>{s.d(t,{o:()=>n});var i=s(4370),r=s(5954),n=(0,i.e)(class extends i.i{constructor(e){var t;if(super(e),e.type!==i.t.ATTRIBUTE||"class"!==e.name||(null===(t=e.strings)||void 0===t?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){var s,i;if(void 0===this.nt){this.nt=new Set,void 0!==e.strings&&(this.st=new Set(e.strings.join(" ").split(/\s/).filter((e=>""!==e))));for(const e in t)t[e]&&!(null===(s=this.st)||void 0===s?void 0:s.has(e))&&this.nt.add(e);return this.render(t)}const n=e.element.classList;this.nt.forEach((e=>{e in t||(n.remove(e),this.nt.delete(e))}));for(const e in t){const s=!!t[e];s===this.nt.has(e)||(null===(i=this.st)||void 0===i?void 0:i.has(e))||(s?(n.add(e),this.nt.add(e)):(n.remove(e),this.nt.delete(e)))}return r.x}})},836:(e,t,s)=>{s.d(t,{Z:()=>r});var i=s(9264),r={name:"default",resolver:e=>(0,i.b)(`assets/icons/${e}.svg`)}},4370:(e,t,s)=>{s.d(t,{e:()=>r,i:()=>n,t:()=>i});var i={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},r=e=>(...t)=>({_$litDirective$:e,values:t}),n=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}},9191:(e,t,s)=>{s.d(t,{E4:()=>l,Sw:()=>a,Tb:()=>h});var i=s(836),r=s(2759),n=[i.Z,r.J],o=[];function l(e){o.push(e)}function a(e){o=o.filter((t=>t!==e))}function h(e){return n.find((t=>t.name===e))}},5710:(e,t,s)=>{s.d(t,{Y:()=>r});var i=s(453);function r(e,t){const s=(0,i.ih)({waitUntilFirstUpdate:!1},t);return(t,i)=>{const{update:r}=t,n=Array.isArray(e)?e:[e];t.update=function(e){n.forEach((t=>{const r=t;if(e.has(r)){const t=e.get(r),n=this[r];t!==n&&(s.waitUntilFirstUpdate&&!this.hasUpdated||this[i](t,n))}})),r.call(this,e)}}}},5734:(e,t,s)=>{var i=s(6281),r=s(5954),n=r.i`
  ${i.N}

  :host {
    --symbol-color: var(--sl-color-neutral-300);
    --symbol-color-active: var(--sl-color-amber-500);
    --symbol-size: 1.2rem;
    --symbol-spacing: var(--sl-spacing-3x-small);

    display: inline-flex;
  }

  .rating {
    position: relative;
    display: inline-flex;
    border-radius: var(--sl-border-radius-medium);
    vertical-align: middle;
  }

  .rating:focus {
    outline: none;
  }

  .rating:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .rating__symbols {
    display: inline-flex;
    position: relative;
    font-size: var(--symbol-size);
    line-height: 0;
    color: var(--symbol-color);
    white-space: nowrap;
    cursor: pointer;
  }

  .rating__symbols > * {
    padding: var(--symbol-spacing);
  }

  .rating__symbols--indicator {
    position: absolute;
    top: 0;
    left: 0;
    color: var(--symbol-color-active);
    pointer-events: none;
  }

  .rating__symbol {
    transition: var(--sl-transition-fast) scale;
  }

  .rating__symbol--hover {
    scale: 1.2;
  }

  .rating--disabled .rating__symbols,
  .rating--readonly .rating__symbols {
    cursor: default;
  }

  .rating--disabled .rating__symbol--hover,
  .rating--readonly .rating__symbol--hover {
    scale: none;
  }

  .rating--disabled {
    opacity: 0.5;
  }

  .rating--disabled .rating__symbols {
    cursor: not-allowed;
  }

  /* Forced colors mode */
  @media (forced-colors: active) {
    .rating__symbols--indicator {
      color: SelectedItem;
    }
  }
`,o=s(7282),l=s(1807),a=s(8379),h=s(5710),d=s(5381),c=s(4370),u=s(8424),v=s(453),g=class extends c.i{constructor(e){if(super(e),this.it=r.b,e.type!==c.t.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===r.b||null==e)return this._t=void 0,this.it=e;if(e===r.x)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};g.directiveName="unsafeHTML",g.resultType=1;var p=(0,c.e)(g),m=class extends u.P{constructor(){super(...arguments),this.localize=new a.V(this),this.hoverValue=0,this.isHovering=!1,this.label="",this.value=0,this.max=5,this.precision=1,this.readonly=!1,this.disabled=!1,this.getSymbol=()=>'<sl-icon name="star-fill" library="system"></sl-icon>'}getValueFromMousePosition(e){return this.getValueFromXCoordinate(e.clientX)}getValueFromTouchPosition(e){return this.getValueFromXCoordinate(e.touches[0].clientX)}getValueFromXCoordinate(e){const t="rtl"===this.localize.dir(),{left:s,right:i,width:r}=this.rating.getBoundingClientRect(),n=t?this.roundToPrecision((i-e)/r*this.max,this.precision):this.roundToPrecision((e-s)/r*this.max,this.precision);return(0,l.u)(n,0,this.max)}handleClick(e){this.disabled||(this.setValue(this.getValueFromMousePosition(e)),this.emit("sl-change"))}setValue(e){this.disabled||this.readonly||(this.value=e===this.value?0:e,this.isHovering=!1)}handleKeyDown(e){const t="ltr"===this.localize.dir(),s="rtl"===this.localize.dir(),i=this.value;if(!this.disabled&&!this.readonly){if("ArrowDown"===e.key||t&&"ArrowLeft"===e.key||s&&"ArrowRight"===e.key){const t=e.shiftKey?1:this.precision;this.value=Math.max(0,this.value-t),e.preventDefault()}if("ArrowUp"===e.key||t&&"ArrowRight"===e.key||s&&"ArrowLeft"===e.key){const t=e.shiftKey?1:this.precision;this.value=Math.min(this.max,this.value+t),e.preventDefault()}"Home"===e.key&&(this.value=0,e.preventDefault()),"End"===e.key&&(this.value=this.max,e.preventDefault()),this.value!==i&&this.emit("sl-change")}}handleMouseEnter(e){this.isHovering=!0,this.hoverValue=this.getValueFromMousePosition(e)}handleMouseMove(e){this.hoverValue=this.getValueFromMousePosition(e)}handleMouseLeave(){this.isHovering=!1}handleTouchStart(e){this.isHovering=!0,this.hoverValue=this.getValueFromTouchPosition(e),e.preventDefault()}handleTouchMove(e){this.hoverValue=this.getValueFromTouchPosition(e)}handleTouchEnd(e){this.isHovering=!1,this.setValue(this.hoverValue),this.emit("sl-change"),e.preventDefault()}roundToPrecision(e,t=.5){const s=1/t;return Math.ceil(e*s)/s}handleHoverValueChange(){this.emit("sl-hover",{detail:{phase:"move",value:this.hoverValue}})}handleIsHoveringChange(){this.emit("sl-hover",{detail:{phase:this.isHovering?"start":"end",value:this.hoverValue}})}focus(e){this.rating.focus(e)}blur(){this.rating.blur()}render(){const e="rtl"===this.localize.dir(),t=Array.from(Array(this.max).keys());let s=0;return s=this.disabled||this.readonly?this.value:this.isHovering?this.hoverValue:this.value,r.y`
      <div
        part="base"
        class=${(0,d.o)({rating:!0,"rating--readonly":this.readonly,"rating--disabled":this.disabled,"rating--rtl":e})}
        role="slider"
        aria-label=${this.label}
        aria-disabled=${this.disabled?"true":"false"}
        aria-readonly=${this.readonly?"true":"false"}
        aria-valuenow=${this.value}
        aria-valuemin=${0}
        aria-valuemax=${this.max}
        tabindex=${this.disabled?"-1":"0"}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mouseenter=${this.handleMouseEnter}
        @touchstart=${this.handleTouchStart}
        @mouseleave=${this.handleMouseLeave}
        @touchend=${this.handleTouchEnd}
        @mousemove=${this.handleMouseMove}
        @touchmove=${this.handleTouchMove}
      >
        <span class="rating__symbols rating__symbols--inactive">
          ${t.map((e=>r.y`
              <span
                class=${(0,d.o)({rating__symbol:!0,"rating__symbol--hover":this.isHovering&&Math.ceil(s)===e+1})}
                role="presentation"
                @mouseenter=${this.handleMouseEnter}
              >
                ${p(this.getSymbol(e+1))}
              </span>
            `))}
        </span>

        <span class="rating__symbols rating__symbols--indicator">
          ${t.map((t=>r.y`
              <span
                class=${(0,d.o)({rating__symbol:!0,"rating__symbol--hover":this.isHovering&&Math.ceil(s)===t+1})}
                style=${(0,o.i)({clipPath:s>t+1?"none":e?`inset(0 0 0 ${100-(s-t)/1*100}%)`:`inset(0 ${100-(s-t)/1*100}% 0 0)`})}
                role="presentation"
              >
                ${p(this.getSymbol(t+1))}
              </span>
            `))}
        </span>
      </div>
    `}};m.styles=n,(0,v.u2)([(0,u.i)(".rating")],m.prototype,"rating",2),(0,v.u2)([(0,u.t)()],m.prototype,"hoverValue",2),(0,v.u2)([(0,u.t)()],m.prototype,"isHovering",2),(0,v.u2)([(0,u.e2)()],m.prototype,"label",2),(0,v.u2)([(0,u.e2)({type:Number})],m.prototype,"value",2),(0,v.u2)([(0,u.e2)({type:Number})],m.prototype,"max",2),(0,v.u2)([(0,u.e2)({type:Number})],m.prototype,"precision",2),(0,v.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"readonly",2),(0,v.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"disabled",2),(0,v.u2)([(0,u.e2)()],m.prototype,"getSymbol",2),(0,v.u2)([(0,u.e3)({passive:!0})],m.prototype,"handleTouchMove",1),(0,v.u2)([(0,h.Y)("hoverValue")],m.prototype,"handleHoverValueChange",1),(0,v.u2)([(0,h.Y)("isHovering")],m.prototype,"handleIsHoveringChange",1),m=(0,v.u2)([(0,u.e)("sl-rating")],m),s(1862),s(9940),s(9191),s(836),s(2759),s(1939)}}]);
//# sourceMappingURL=sl-rating.d8040073.js.map