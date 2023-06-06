/*! For license information please see sl-details.01fff87e.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[9934],{4784:(e,t,n)=>{n.r(t),n(2087),n(5517)},5517:(e,t,n)=>{n(2969),n(3467);var s=n(4124);function i(e){document.documentElement.classList["dark"===e||"dark-v2"===e?"add":"remove"]("sl-theme-dark")}n(1744),(0,s.t)(n.p),i(document.documentElement.dataset.theme),window.addEventListener("theme.change",(e=>{i(e.detail)}))},738:(e,t,n)=>{n.d(t,{Z:()=>a});var s=n(9601),i=n.n(s),o=n(2609),r=n.n(o)()(i());r.push([e.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const a=r},1744:(e,t,n)=>{var s=n(6062),i=n.n(s),o=n(4036),r=n.n(o),a=n(6793),l=n.n(a),d=n(7892),h=n.n(d),c=n(1173),u=n.n(c),p=n(2464),g=n.n(p),m=n(738),v={};v.styleTagTransform=g(),v.setAttributes=h(),v.insert=l().bind(null,"head"),v.domAPI=r(),v.insertStyleElement=u(),i()(m.Z,v),m.Z&&m.Z.locals&&m.Z.locals},9745:(e,t,n)=>{n.d(t,{GH:()=>l,RA:()=>o,U_:()=>a,nk:()=>r,nv:()=>i});var s=n(453);function i(e,t,n){return new Promise((i=>{if((null==n?void 0:n.duration)===1/0)throw new Error("Promise-based animations must be finite.");const o=e.animate(t,(0,s.EZ)((0,s.ih)({},n),{duration:r()?0:n.duration}));o.addEventListener("cancel",i,{once:!0}),o.addEventListener("finish",i,{once:!0})}))}function o(e){return(e=e.toString().toLowerCase()).indexOf("ms")>-1?parseFloat(e):e.indexOf("s")>-1?1e3*parseFloat(e):parseFloat(e)}function r(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function a(e){return Promise.all(e.getAnimations().map((e=>new Promise((t=>{const n=requestAnimationFrame(t);e.addEventListener("cancel",(()=>n),{once:!0}),e.addEventListener("finish",(()=>n),{once:!0}),e.cancel()})))))}function l(e,t){return e.map((e=>(0,s.EZ)((0,s.ih)({},e),{height:"auto"===e.height?`${t}px`:e.height})))}},9940:(e,t,n)=>{var s,i=n(9191),o=n(1939),r=n(5710),a=n(8424),l=n(453),d=Symbol(),h=Symbol(),c=new Map,u=class extends a.P{constructor(){super(...arguments),this.svg=null,this.label="",this.library="default"}static async resolveIcon(e){var t;let n;try{if(n=await fetch(e,{mode:"cors"}),!n.ok)return 410===n.status?d:h}catch(e){return h}try{const e=document.createElement("div");e.innerHTML=await n.text();const i=e.firstElementChild;if("svg"!==(null==(t=null==i?void 0:i.tagName)?void 0:t.toLowerCase()))return d;s||(s=new DOMParser);const o=s.parseFromString(i.outerHTML,"text/html").body.querySelector("svg");return o?(o.part.add("svg"),document.adoptNode(o)):d}catch(e){return d}}connectedCallback(){super.connectedCallback(),(0,i.E4)(this)}firstUpdated(){this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),(0,i.Sw)(this)}getUrl(){const e=(0,i.Tb)(this.library);return this.name&&e?e.resolver(this.name):this.src}handleLabelChange(){"string"==typeof this.label&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var e;const t=(0,i.Tb)(this.library),n=this.getUrl();if(!n)return void(this.svg=null);let s=c.get(n);s||(s=u.resolveIcon(n),c.set(n,s));const o=await s;if(o===h&&c.delete(n),n===this.getUrl())switch(o){case h:case d:this.svg=null,this.emit("sl-error");break;default:this.svg=o.cloneNode(!0),null==(e=null==t?void 0:t.mutator)||e.call(t,this.svg),this.emit("sl-load")}}render(){return this.svg}};u.styles=o.W,(0,l.u2)([(0,a.t)()],u.prototype,"svg",2),(0,l.u2)([(0,a.e2)({reflect:!0})],u.prototype,"name",2),(0,l.u2)([(0,a.e2)()],u.prototype,"src",2),(0,l.u2)([(0,a.e2)()],u.prototype,"label",2),(0,l.u2)([(0,a.e2)({reflect:!0})],u.prototype,"library",2),(0,l.u2)([(0,r.Y)("label")],u.prototype,"handleLabelChange",1),(0,l.u2)([(0,r.Y)(["name","src","library"])],u.prototype,"setIcon",1),u=(0,l.u2)([(0,a.e)("sl-icon")],u)},4867:(e,t,n)=>{function s(e,t){return new Promise((n=>{e.addEventListener(t,(function s(i){i.target===e&&(e.removeEventListener(t,s),n())}))}))}n.d(t,{m:()=>s})},6281:(e,t,n)=>{n.d(t,{N:()=>s});var s=n(5954).i`
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
`},1939:(e,t,n)=>{n.d(t,{W:()=>i});var s=n(6281),i=n(5954).i`
  ${s.N}

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
`},2759:(e,t,n)=>{n.d(t,{J:()=>i});var s={caret:'\n    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n      <polyline points="6 9 12 15 18 9"></polyline>\n    </svg>\n  ',check:'\n    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">\n        <g stroke="currentColor" stroke-width="2">\n          <g transform="translate(3.428571, 3.428571)">\n            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>\n            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>\n          </g>\n        </g>\n      </g>\n    </svg>\n  ',"chevron-down":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',"chevron-left":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>\n    </svg>\n  ',"chevron-right":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',eye:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">\n      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>\n      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>\n    </svg>\n  ',"eye-slash":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">\n      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>\n      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>\n      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>\n    </svg>\n  ',eyedropper:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">\n      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>\n    </svg>\n  ',"grip-vertical":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">\n      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>\n    </svg>\n  ',indeterminate:'\n    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">\n        <g stroke="currentColor" stroke-width="2">\n          <g transform="translate(2.285714, 6.857143)">\n            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>\n          </g>\n        </g>\n      </g>\n    </svg>\n  ',"person-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">\n      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>\n    </svg>\n  ',"play-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">\n      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>\n    </svg>\n  ',"pause-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">\n      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>\n    </svg>\n  ',radio:'\n    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <g fill="currentColor">\n          <circle cx="8" cy="8" r="3.42857143"></circle>\n        </g>\n      </g>\n    </svg>\n  ',"star-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">\n      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>\n    </svg>\n  ',"x-lg":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">\n      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>\n    </svg>\n  ',"x-circle-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">\n      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>\n    </svg>\n  '},i={name:"system",resolver:e=>e in s?`data:image/svg+xml,${encodeURIComponent(s[e])}`:""}},1862:(e,t,n)=>{n.d(t,{P:()=>d,V:()=>c});var s,i=new Set,o=new MutationObserver(h),r=new Map,a=document.documentElement.dir||"ltr",l=document.documentElement.lang||navigator.language;function d(...e){e.map((e=>{const t=e.$code.toLowerCase();r.has(t)?r.set(t,Object.assign(Object.assign({},r.get(t)),e)):r.set(t,e),s||(s=e)})),h()}function h(){a=document.documentElement.dir||"ltr",l=document.documentElement.lang||navigator.language,[...i.keys()].map((e=>{"function"==typeof e.requestUpdate&&e.requestUpdate()}))}o.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]});var c=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){i.add(this.host)}hostDisconnected(){i.delete(this.host)}dir(){return`${this.host.dir||a}`.toLowerCase()}lang(){return`${this.host.lang||l}`.toLowerCase()}getTranslationData(e){var t,n;const s=new Intl.Locale(e),i=null==s?void 0:s.language.toLowerCase(),o=null!==(n=null===(t=null==s?void 0:s.region)||void 0===t?void 0:t.toLowerCase())&&void 0!==n?n:"";return{locale:s,language:i,region:o,primary:r.get(`${i}-${o}`),secondary:r.get(i)}}exists(e,t){var n;const{primary:i,secondary:o}=this.getTranslationData(null!==(n=t.lang)&&void 0!==n?n:this.lang());return t=Object.assign({includeFallback:!1},t),!!(i&&i[e]||o&&o[e]||t.includeFallback&&s&&s[e])}term(e,...t){const{primary:n,secondary:i}=this.getTranslationData(this.lang());let o;if(n&&n[e])o=n[e];else if(i&&i[e])o=i[e];else{if(!s||!s[e])return console.error(`No translation found for: ${String(e)}`),String(e);o=s[e]}return"function"==typeof o?o(...t):o}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,n){return new Intl.RelativeTimeFormat(this.lang(),n).format(e,t)}}},8379:(e,t,n)=>{n.d(t,{V:()=>i});var s=n(1862),i=class extends s.V{};(0,s.P)({$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copy:"Copy",currentValue:"Current value",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>0===e?"No options selected":1===e?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"})},2486:(e,t,n)=>{n.d(t,{O8:()=>a,jx:()=>r}),n(453);var s=new Map,i=new WeakMap;function o(e,t){return"rtl"===t.toLowerCase()?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function r(e,t){s.set(e,function(e){return null!=e?e:{keyframes:[],options:{duration:0}}}(t))}function a(e,t,n){const r=i.get(e);if(null==r?void 0:r[t])return o(r[t],n.dir);const a=s.get(t);return a?o(a,n.dir):{keyframes:[],options:{duration:0}}}},5381:(e,t,n)=>{n.d(t,{o:()=>o});var s=n(4370),i=n(5954),o=(0,s.e)(class extends s.i{constructor(e){var t;if(super(e),e.type!==s.t.ATTRIBUTE||"class"!==e.name||(null===(t=e.strings)||void 0===t?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){var n,s;if(void 0===this.nt){this.nt=new Set,void 0!==e.strings&&(this.st=new Set(e.strings.join(" ").split(/\s/).filter((e=>""!==e))));for(const e in t)t[e]&&!(null===(n=this.st)||void 0===n?void 0:n.has(e))&&this.nt.add(e);return this.render(t)}const o=e.element.classList;this.nt.forEach((e=>{e in t||(o.remove(e),this.nt.delete(e))}));for(const e in t){const n=!!t[e];n===this.nt.has(e)||(null===(s=this.st)||void 0===s?void 0:s.has(e))||(n?(o.add(e),this.nt.add(e)):(o.remove(e),this.nt.delete(e)))}return i.x}})},836:(e,t,n)=>{n.d(t,{Z:()=>i});var s=n(9264),i={name:"default",resolver:e=>(0,s.b)(`assets/icons/${e}.svg`)}},4370:(e,t,n)=>{n.d(t,{e:()=>i,i:()=>o,t:()=>s});var s={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},i=e=>(...t)=>({_$litDirective$:e,values:t}),o=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}},9191:(e,t,n)=>{n.d(t,{E4:()=>a,Sw:()=>l,Tb:()=>d});var s=n(836),i=n(2759),o=[s.Z,i.J],r=[];function a(e){r.push(e)}function l(e){r=r.filter((t=>t!==e))}function d(e){return o.find((t=>t.name===e))}},5710:(e,t,n)=>{n.d(t,{Y:()=>i});var s=n(453);function i(e,t){const n=(0,s.ih)({waitUntilFirstUpdate:!1},t);return(t,s)=>{const{update:i}=t,o=Array.isArray(e)?e:[e];t.update=function(e){o.forEach((t=>{const i=t;if(e.has(i)){const t=e.get(i),o=this[i];t!==o&&(n.waitUntilFirstUpdate&&!this.hasUpdated||this[s](t,o))}})),i.call(this,e)}}}},2087:(e,t,n)=>{var s=n(6281),i=n(5954),o=i.i`
  ${s.N}

  :host {
    display: block;
  }

  .details {
    border: solid 1px var(--sl-color-neutral-200);
    border-radius: var(--sl-border-radius-medium);
    background-color: var(--sl-color-neutral-0);
    overflow-anchor: none;
  }

  .details--disabled {
    opacity: 0.5;
  }

  .details__header {
    display: flex;
    align-items: center;
    border-radius: inherit;
    padding: var(--sl-spacing-medium);
    user-select: none;
    cursor: pointer;
  }

  .details__header:focus {
    outline: none;
  }

  .details__header:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: calc(1px + var(--sl-focus-ring-offset));
  }

  .details--disabled .details__header {
    cursor: not-allowed;
  }

  .details--disabled .details__header:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .details__summary {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }

  .details__summary-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--sl-transition-medium) rotate ease;
  }

  .details--open .details__summary-icon {
    rotate: 90deg;
  }

  .details--open.details--rtl .details__summary-icon {
    rotate: -90deg;
  }

  .details--open slot[name='expand-icon'],
  .details:not(.details--open) slot[name='collapse-icon'] {
    display: none;
  }

  .details__body {
    overflow: hidden;
  }

  .details__content {
    display: block;
    padding: var(--sl-spacing-medium);
  }
`,r=n(2486),a=n(4867),l=n(9745),d=n(8379),h=n(5710),c=n(5381),u=n(8424),p=n(453),g=class extends u.P{constructor(){super(...arguments),this.localize=new d.V(this),this.open=!1,this.disabled=!1}firstUpdated(){this.body.hidden=!this.open,this.body.style.height=this.open?"auto":"0"}handleSummaryClick(){this.disabled||(this.open?this.hide():this.show(),this.header.focus())}handleSummaryKeyDown(e){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this.open?this.hide():this.show()),"ArrowUp"!==e.key&&"ArrowLeft"!==e.key||(e.preventDefault(),this.hide()),"ArrowDown"!==e.key&&"ArrowRight"!==e.key||(e.preventDefault(),this.show())}async handleOpenChange(){if(this.open){if(this.emit("sl-show",{cancelable:!0}).defaultPrevented)return void(this.open=!1);await(0,l.U_)(this.body),this.body.hidden=!1;const{keyframes:e,options:t}=(0,r.O8)(this,"details.show",{dir:this.localize.dir()});await(0,l.nv)(this.body,(0,l.GH)(e,this.body.scrollHeight),t),this.body.style.height="auto",this.emit("sl-after-show")}else{if(this.emit("sl-hide",{cancelable:!0}).defaultPrevented)return void(this.open=!0);await(0,l.U_)(this.body);const{keyframes:e,options:t}=(0,r.O8)(this,"details.hide",{dir:this.localize.dir()});await(0,l.nv)(this.body,(0,l.GH)(e,this.body.scrollHeight),t),this.body.hidden=!0,this.body.style.height="auto",this.emit("sl-after-hide")}}async show(){if(!this.open&&!this.disabled)return this.open=!0,(0,a.m)(this,"sl-after-show")}async hide(){if(this.open&&!this.disabled)return this.open=!1,(0,a.m)(this,"sl-after-hide")}render(){const e="rtl"===this.localize.dir();return i.y`
      <div
        part="base"
        class=${(0,c.o)({details:!0,"details--open":this.open,"details--disabled":this.disabled,"details--rtl":e})}
      >
        <div
          part="header"
          id="header"
          class="details__header"
          role="button"
          aria-expanded=${this.open?"true":"false"}
          aria-controls="content"
          aria-disabled=${this.disabled?"true":"false"}
          tabindex=${this.disabled?"-1":"0"}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <slot name="summary" part="summary" class="details__summary">${this.summary}</slot>

          <span part="summary-icon" class="details__summary-icon">
            <slot name="expand-icon">
              <sl-icon library="system" name=${e?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
            <slot name="collapse-icon">
              <sl-icon library="system" name=${e?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
          </span>
        </div>

        <div class="details__body" role="region" aria-labelledby="header">
          <slot part="content" id="content" class="details__content"></slot>
        </div>
      </div>
    `}};g.styles=o,(0,p.u2)([(0,u.i)(".details")],g.prototype,"details",2),(0,p.u2)([(0,u.i)(".details__header")],g.prototype,"header",2),(0,p.u2)([(0,u.i)(".details__body")],g.prototype,"body",2),(0,p.u2)([(0,u.i)(".details__expand-icon-slot")],g.prototype,"expandIconSlot",2),(0,p.u2)([(0,u.e2)({type:Boolean,reflect:!0})],g.prototype,"open",2),(0,p.u2)([(0,u.e2)()],g.prototype,"summary",2),(0,p.u2)([(0,u.e2)({type:Boolean,reflect:!0})],g.prototype,"disabled",2),(0,p.u2)([(0,h.Y)("open",{waitUntilFirstUpdate:!0})],g.prototype,"handleOpenChange",1),g=(0,p.u2)([(0,u.e)("sl-details")],g),(0,r.jx)("details.show",{keyframes:[{height:"0",opacity:"0"},{height:"auto",opacity:"1"}],options:{duration:250,easing:"linear"}}),(0,r.jx)("details.hide",{keyframes:[{height:"auto",opacity:"1"},{height:"0",opacity:"0"}],options:{duration:250,easing:"linear"}}),n(1862),n(9940),n(9191),n(836),n(2759),n(1939),n(4370)}}]);
//# sourceMappingURL=sl-details.01fff87e.js.map