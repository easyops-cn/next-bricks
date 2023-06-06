/*! For license information please see sl-range.7a8bff11.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[8950],{2699:(t,e,o)=>{o.r(e),o(9086),o(5517)},5517:(t,e,o)=>{o(2969),o(3467);var r=o(4124);function i(t){document.documentElement.classList["dark"===t||"dark-v2"===t?"add":"remove"]("sl-theme-dark")}o(1744),(0,r.t)(o.p),i(document.documentElement.dataset.theme),window.addEventListener("theme.change",(t=>{i(t.detail)}))},738:(t,e,o)=>{o.d(e,{Z:()=>n});var r=o(9601),i=o.n(r),a=o(2609),s=o.n(a)()(i());s.push([t.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const n=s},1744:(t,e,o)=>{var r=o(6062),i=o.n(r),a=o(4036),s=o.n(a),n=o(6793),l=o.n(n),h=o(7892),d=o.n(h),c=o(1173),u=o.n(c),p=o(2464),m=o.n(p),v=o(738),f={};f.styleTagTransform=m(),f.setAttributes=d(),f.insert=l().bind(null,"head"),f.domAPI=s(),f.insertStyleElement=u(),i()(v.Z,f),v.Z&&v.Z.locals&&v.Z.locals},3515:(t,e,o)=>{o.d(e,{F:()=>i,r:()=>r});var r=class{constructor(t,...e){this.slotNames=[],(this.host=t).addController(this),this.slotNames=e,this.handleSlotChange=this.handleSlotChange.bind(this)}hasDefaultSlot(){return[...this.host.childNodes].some((t=>{if(t.nodeType===t.TEXT_NODE&&""!==t.textContent.trim())return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if("sl-visually-hidden"===e.tagName.toLowerCase())return!1;if(!e.hasAttribute("slot"))return!0}return!1}))}hasNamedSlot(t){return null!==this.host.querySelector(`:scope > [slot="${t}"]`)}test(t){return"[default]"===t?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}handleSlotChange(t){const e=t.target;(this.slotNames.includes("[default]")&&!e.name||e.name&&this.slotNames.includes(e.name))&&this.host.requestUpdate()}};function i(t){if(!t)return"";const e=t.assignedNodes({flatten:!0});let o="";return[...e].forEach((t=>{t.nodeType===Node.TEXT_NODE&&(o+=t.textContent)})),o}},6281:(t,e,o)=>{o.d(e,{N:()=>r});var r=o(5954).i`
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
`},3480:(t,e,o)=>{o.d(e,{ZW:()=>c,o9:()=>h,pY:()=>l,st:()=>d});var r=o(453),i=new WeakMap,a=new WeakMap,s=new WeakSet,n=new WeakMap,l=class{constructor(t,e){(this.host=t).addController(this),this.options=(0,r.ih)({form:t=>{if(t.hasAttribute("form")&&""!==t.getAttribute("form")){const e=t.getRootNode(),o=t.getAttribute("form");if(o)return e.getElementById(o)}return t.closest("form")},name:t=>t.name,value:t=>t.value,defaultValue:t=>t.defaultValue,disabled:t=>{var e;return null!=(e=t.disabled)&&e},reportValidity:t=>"function"!=typeof t.reportValidity||t.reportValidity(),setValue:(t,e)=>t.value=e,assumeInteractionOn:["sl-input"]},e),this.handleFormData=this.handleFormData.bind(this),this.handleFormSubmit=this.handleFormSubmit.bind(this),this.handleFormReset=this.handleFormReset.bind(this),this.reportFormValidity=this.reportFormValidity.bind(this),this.handleInteraction=this.handleInteraction.bind(this)}hostConnected(){const t=this.options.form(this.host);t&&this.attachForm(t),n.set(this.host,[]),this.options.assumeInteractionOn.forEach((t=>{this.host.addEventListener(t,this.handleInteraction)}))}hostDisconnected(){this.detachForm(),n.delete(this.host),this.options.assumeInteractionOn.forEach((t=>{this.host.removeEventListener(t,this.handleInteraction)}))}hostUpdated(){const t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,i.has(this.form)?i.get(this.form).add(this.host):i.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),a.has(this.form)||(a.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity())):this.form=void 0}detachForm(){var t;this.form&&(null==(t=i.get(this.form))||t.delete(this.host),this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),a.has(this.form)&&(this.form.reportValidity=a.get(this.form),a.delete(this.form))),this.form=void 0}handleFormData(t){const e=this.options.disabled(this.host),o=this.options.name(this.host),r=this.options.value(this.host),i="sl-button"===this.host.tagName.toLowerCase();!e&&!i&&"string"==typeof o&&o.length>0&&void 0!==r&&(Array.isArray(r)?r.forEach((e=>{t.formData.append(o,e.toString())})):t.formData.append(o,r.toString()))}handleFormSubmit(t){var e;const o=this.options.disabled(this.host),r=this.options.reportValidity;this.form&&!this.form.noValidate&&(null==(e=i.get(this.form))||e.forEach((t=>{this.setUserInteracted(t,!0)}))),!this.form||this.form.noValidate||o||r(this.host)||(t.preventDefault(),t.stopImmediatePropagation())}handleFormReset(){this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),n.set(this.host,[])}handleInteraction(t){const e=n.get(this.host);e.includes(t.type)||e.push(t.type),e.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)}reportFormValidity(){if(this.form&&!this.form.noValidate){const t=this.form.querySelectorAll("*");for(const e of t)if("function"==typeof e.reportValidity&&!e.reportValidity())return!1}return!0}setUserInteracted(t,e){e?s.add(t):s.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){const o=document.createElement("button");o.type=t,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",e&&(o.name=e.name,o.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach((t=>{e.hasAttribute(t)&&o.setAttribute(t,e.getAttribute(t))}))),this.form.append(o),o.click(),o.remove()}}getForm(){var t;return null!=(t=this.form)?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){const e=this.host,o=Boolean(s.has(e)),r=Boolean(e.required);e.toggleAttribute("data-required",r),e.toggleAttribute("data-optional",!r),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&o),e.toggleAttribute("data-user-valid",t&&o)}updateValidity(){const t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){const e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||null==t||t.preventDefault()}},h=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1}),d=Object.freeze((0,r.EZ)((0,r.ih)({},h),{valid:!1,valueMissing:!0})),c=Object.freeze((0,r.EZ)((0,r.ih)({},h),{valid:!1,customError:!0}))},3434:(t,e,o)=>{o.d(e,{n:()=>r});var r=o(5954).i`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
    color: var(--sl-input-required-content-color);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
    margin-top: var(--sl-spacing-3x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--sl-spacing-2x-small);
  }
`},1862:(t,e,o)=>{o.d(e,{P:()=>h,V:()=>c});var r,i=new Set,a=new MutationObserver(d),s=new Map,n=document.documentElement.dir||"ltr",l=document.documentElement.lang||navigator.language;function h(...t){t.map((t=>{const e=t.$code.toLowerCase();s.has(e)?s.set(e,Object.assign(Object.assign({},s.get(e)),t)):s.set(e,t),r||(r=t)})),d()}function d(){n=document.documentElement.dir||"ltr",l=document.documentElement.lang||navigator.language,[...i.keys()].map((t=>{"function"==typeof t.requestUpdate&&t.requestUpdate()}))}a.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]});var c=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){i.add(this.host)}hostDisconnected(){i.delete(this.host)}dir(){return`${this.host.dir||n}`.toLowerCase()}lang(){return`${this.host.lang||l}`.toLowerCase()}getTranslationData(t){var e,o;const r=new Intl.Locale(t),i=null==r?void 0:r.language.toLowerCase(),a=null!==(o=null===(e=null==r?void 0:r.region)||void 0===e?void 0:e.toLowerCase())&&void 0!==o?o:"";return{locale:r,language:i,region:a,primary:s.get(`${i}-${a}`),secondary:s.get(i)}}exists(t,e){var o;const{primary:i,secondary:a}=this.getTranslationData(null!==(o=e.lang)&&void 0!==o?o:this.lang());return e=Object.assign({includeFallback:!1},e),!!(i&&i[t]||a&&a[t]||e.includeFallback&&r&&r[t])}term(t,...e){const{primary:o,secondary:i}=this.getTranslationData(this.lang());let a;if(o&&o[t])a=o[t];else if(i&&i[t])a=i[t];else{if(!r||!r[t])return console.error(`No translation found for: ${String(t)}`),String(t);a=r[t]}return"function"==typeof a?a(...e):a}date(t,e){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),e).format(t)}number(t,e){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),e).format(t)}relativeTime(t,e,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(t,e)}}},8379:(t,e,o)=>{o.d(e,{V:()=>i});var r=o(1862),i=class extends r.V{};(0,r.P)({$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copy:"Copy",currentValue:"Current value",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>0===t?"No options selected":1===t?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"})},5381:(t,e,o)=>{o.d(e,{o:()=>a});var r=o(4370),i=o(5954),a=(0,r.e)(class extends r.i{constructor(t){var e;if(super(t),t.type!==r.t.ATTRIBUTE||"class"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){var o,r;if(void 0===this.nt){this.nt=new Set,void 0!==t.strings&&(this.st=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!(null===(o=this.st)||void 0===o?void 0:o.has(t))&&this.nt.add(t);return this.render(e)}const a=t.element.classList;this.nt.forEach((t=>{t in e||(a.remove(t),this.nt.delete(t))}));for(const t in e){const o=!!e[t];o===this.nt.has(t)||(null===(r=this.st)||void 0===r?void 0:r.has(t))||(o?(a.add(t),this.nt.add(t)):(a.remove(t),this.nt.delete(t)))}return i.x}})},4617:(t,e,o)=>{o.d(e,{l:()=>n});var r=o(4370),i=o(5954),{I:a}=i.L,s={},n=(0,r.e)(class extends r.i{constructor(t){if(super(t),t.type!==r.t.PROPERTY&&t.type!==r.t.ATTRIBUTE&&t.type!==r.t.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(void 0!==t.strings)throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===i.x||e===i.b)return e;const o=t.element,a=t.name;if(t.type===r.t.PROPERTY){if(e===o[a])return i.x}else if(t.type===r.t.BOOLEAN_ATTRIBUTE){if(!!e===o.hasAttribute(a))return i.x}else if(t.type===r.t.ATTRIBUTE&&o.getAttribute(a)===e+"")return i.x;return((t,e=s)=>{t._$AH=e})(t),e}})},4370:(t,e,o)=>{o.d(e,{e:()=>i,i:()=>a,t:()=>r});var r={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},i=t=>(...e)=>({_$litDirective$:t,values:e}),a=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}},8734:(t,e,o)=>{o.d(e,{l:()=>i});var r=o(5954),i=t=>null!=t?t:r.b},5710:(t,e,o)=>{o.d(e,{Y:()=>i});var r=o(453);function i(t,e){const o=(0,r.ih)({waitUntilFirstUpdate:!1},e);return(e,r)=>{const{update:i}=e,a=Array.isArray(t)?t:[t];e.update=function(t){a.forEach((e=>{const i=e;if(t.has(i)){const e=t.get(i),a=this[i];e!==a&&(o.waitUntilFirstUpdate&&!this.hasUpdated||this[r](e,a))}})),i.call(this,t)}}}},4577:(t,e,o)=>{o.d(e,{L:()=>i});var r=o(5954),i=(t="value")=>(e,o)=>{const i=e.constructor,a=i.prototype.attributeChangedCallback;i.prototype.attributeChangedCallback=function(e,s,n){var l;const h=i.getPropertyOptions(t);if(e===("string"==typeof h.attribute?h.attribute:t)){const e=h.converter||r.n,i=("function"==typeof e?e:null!=(l=null==e?void 0:e.fromAttribute)?l:r.n.fromAttribute)(n,h.type);this[t]!==i&&(this[o]=i)}a.call(this,e,s,n)}}},9086:(t,e,o)=>{var r=o(3434),i=o(6281),a=o(5954),s=a.i`
  ${i.N}
  ${r.n}

  :host {
    --thumb-size: 20px;
    --tooltip-offset: 10px;
    --track-color-active: var(--sl-color-neutral-200);
    --track-color-inactive: var(--sl-color-neutral-200);
    --track-active-offset: 0%;
    --track-height: 6px;

    display: block;
  }

  .range {
    position: relative;
  }

  .range__control {
    --percent: 0%;
    -webkit-appearance: none;
    border-radius: 3px;
    width: 100%;
    height: var(--track-height);
    background: transparent;
    line-height: var(--sl-input-height-medium);
    vertical-align: middle;
    margin: 0;

    background-image: linear-gradient(
      to right,
      var(--track-color-inactive) 0%,
      var(--track-color-inactive) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) 100%
    );
  }

  .range--rtl .range__control {
    background-image: linear-gradient(
      to left,
      var(--track-color-inactive) 0%,
      var(--track-color-inactive) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) 100%
    );
  }

  /* Webkit */
  .range__control::-webkit-slider-runnable-track {
    width: 100%;
    height: var(--track-height);
    border-radius: 3px;
    border: none;
  }

  .range__control::-webkit-slider-thumb {
    border: none;
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: 50%;
    background-color: var(--sl-color-primary-600);
    border: solid var(--sl-input-border-width) var(--sl-color-primary-600);
    -webkit-appearance: none;
    margin-top: calc(var(--thumb-size) / -2 + var(--track-height) / 2);
    cursor: pointer;
  }

  .range__control:enabled::-webkit-slider-thumb:hover {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
  }

  .range__control:enabled:focus-visible::-webkit-slider-thumb {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .range__control:enabled::-webkit-slider-thumb:active {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    cursor: grabbing;
  }

  /* Firefox */
  .range__control::-moz-focus-outer {
    border: 0;
  }

  .range__control::-moz-range-progress {
    background-color: var(--track-color-active);
    border-radius: 3px;
    height: var(--track-height);
  }

  .range__control::-moz-range-track {
    width: 100%;
    height: var(--track-height);
    background-color: var(--track-color-inactive);
    border-radius: 3px;
    border: none;
  }

  .range__control::-moz-range-thumb {
    border: none;
    height: var(--thumb-size);
    width: var(--thumb-size);
    border-radius: 50%;
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    transition: var(--sl-transition-fast) border-color, var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) color, var(--sl-transition-fast) box-shadow;
    cursor: pointer;
  }

  .range__control:enabled::-moz-range-thumb:hover {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
  }

  .range__control:enabled:focus-visible::-moz-range-thumb {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .range__control:enabled::-moz-range-thumb:active {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    cursor: grabbing;
  }

  /* States */
  .range__control:focus-visible {
    outline: none;
  }

  .range__control:disabled {
    opacity: 0.5;
  }

  .range__control:disabled::-webkit-slider-thumb {
    cursor: not-allowed;
  }

  .range__control:disabled::-moz-range-thumb {
    cursor: not-allowed;
  }

  /* Tooltip output */
  .range__tooltip {
    position: absolute;
    z-index: var(--sl-z-index-tooltip);
    left: 0;
    border-radius: var(--sl-tooltip-border-radius);
    background-color: var(--sl-tooltip-background-color);
    font-family: var(--sl-tooltip-font-family);
    font-size: var(--sl-tooltip-font-size);
    font-weight: var(--sl-tooltip-font-weight);
    line-height: var(--sl-tooltip-line-height);
    color: var(--sl-tooltip-color);
    opacity: 0;
    padding: var(--sl-tooltip-padding);
    transition: var(--sl-transition-fast) opacity;
    pointer-events: none;
  }

  .range__tooltip:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: 50%;
    translate: calc(-1 * var(--sl-tooltip-arrow-size));
  }

  .range--tooltip-visible .range__tooltip {
    opacity: 1;
  }

  /* Tooltip on top */
  .range--tooltip-top .range__tooltip {
    top: calc(-1 * var(--thumb-size) - var(--tooltip-offset));
  }

  .range--tooltip-top .range__tooltip:after {
    border-top: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);
    border-left: var(--sl-tooltip-arrow-size) solid transparent;
    border-right: var(--sl-tooltip-arrow-size) solid transparent;
    top: 100%;
  }

  /* Tooltip on bottom */
  .range--tooltip-bottom .range__tooltip {
    bottom: calc(-1 * var(--thumb-size) - var(--tooltip-offset));
  }

  .range--tooltip-bottom .range__tooltip:after {
    border-bottom: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);
    border-left: var(--sl-tooltip-arrow-size) solid transparent;
    border-right: var(--sl-tooltip-arrow-size) solid transparent;
    bottom: 100%;
  }

  @media (forced-colors: active) {
    .range__control,
    .range__tooltip {
      border: solid 1px transparent;
    }

    .range__control::-webkit-slider-thumb {
      border: solid 1px transparent;
    }

    .range__control::-moz-range-thumb {
      border: solid 1px transparent;
    }

    .range__tooltip:after {
      display: none;
    }
  }
`,n=o(4617),l=o(4577),h=o(3480),d=o(8734),c=o(3515),u=o(8379),p=o(5710),m=o(5381),v=o(8424),f=o(453),g=class extends v.P{constructor(){super(...arguments),this.formControlController=new h.pY(this),this.hasSlotController=new c.r(this,"help-text","label"),this.localize=new u.V(this),this.hasFocus=!1,this.hasTooltip=!1,this.title="",this.name="",this.value=0,this.label="",this.helpText="",this.disabled=!1,this.min=0,this.max=100,this.step=1,this.tooltip="top",this.tooltipFormatter=t=>t.toString(),this.form="",this.defaultValue=0}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver((()=>this.syncRange())),this.value<this.min&&(this.value=this.min),this.value>this.max&&(this.value=this.max),this.updateComplete.then((()=>{this.syncRange(),this.resizeObserver.observe(this.input)}))}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this.input)}handleChange(){this.emit("sl-change")}handleInput(){this.value=parseFloat(this.input.value),this.emit("sl-input"),this.syncRange()}handleBlur(){this.hasFocus=!1,this.hasTooltip=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.hasTooltip=!0,this.emit("sl-focus")}handleThumbDragStart(){this.hasTooltip=!0}handleThumbDragEnd(){this.hasTooltip=!1}syncProgress(t){this.input.style.setProperty("--percent",100*t+"%")}syncTooltip(t){if(null!==this.output){const e=this.input.offsetWidth,o=this.output.offsetWidth,r=getComputedStyle(this.input).getPropertyValue("--thumb-size"),i=e*t;if("rtl"===this.localize.dir()){const a=`${e-i}px + ${t} * ${r}`;this.output.style.translate=`calc((${a} - ${o/2}px - ${r} / 2))`}else{const e=`${i}px - ${t} * ${r}`;this.output.style.translate=`calc(${e} - ${o/2}px + ${r} / 2)`}}}handleValueChange(){this.formControlController.updateValidity(),this.input.value=this.value.toString(),this.value=parseFloat(this.input.value),this.syncRange()}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}syncRange(){const t=Math.max(0,(this.value-this.min)/(this.max-this.min));this.syncProgress(t),"none"!==this.tooltip&&this.syncTooltip(t)}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}focus(t){this.input.focus(t)}blur(){this.input.blur()}stepUp(){this.input.stepUp(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}stepDown(){this.input.stepDown(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){const t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=!!this.label||!!t,r=!!this.helpText||!!e;return a.y`
      <div
        part="form-control"
        class=${(0,m.o)({"form-control":!0,"form-control--medium":!0,"form-control--has-label":o,"form-control--has-help-text":r})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${o?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${(0,m.o)({range:!0,"range--disabled":this.disabled,"range--focused":this.hasFocus,"range--rtl":"rtl"===this.localize.dir(),"range--tooltip-visible":this.hasTooltip,"range--tooltip-top":"top"===this.tooltip,"range--tooltip-bottom":"bottom"===this.tooltip})}
            @mousedown=${this.handleThumbDragStart}
            @mouseup=${this.handleThumbDragEnd}
            @touchstart=${this.handleThumbDragStart}
            @touchend=${this.handleThumbDragEnd}
          >
            <input
              part="input"
              id="input"
              class="range__control"
              title=${this.title}
              type="range"
              name=${(0,d.l)(this.name)}
              ?disabled=${this.disabled}
              min=${(0,d.l)(this.min)}
              max=${(0,d.l)(this.max)}
              step=${(0,d.l)(this.step)}
              .value=${(0,n.l)(this.value.toString())}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @focus=${this.handleFocus}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @blur=${this.handleBlur}
            />
            ${"none"===this.tooltip||this.disabled?"":a.y`
                  <output part="tooltip" class="range__tooltip">
                    ${"function"==typeof this.tooltipFormatter?this.tooltipFormatter(this.value):this.value}
                  </output>
                `}
          </div>
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${r?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </div>
    `}};g.styles=s,(0,f.u2)([(0,v.i)(".range__control")],g.prototype,"input",2),(0,f.u2)([(0,v.i)(".range__tooltip")],g.prototype,"output",2),(0,f.u2)([(0,v.t)()],g.prototype,"hasFocus",2),(0,f.u2)([(0,v.t)()],g.prototype,"hasTooltip",2),(0,f.u2)([(0,v.e2)()],g.prototype,"title",2),(0,f.u2)([(0,v.e2)()],g.prototype,"name",2),(0,f.u2)([(0,v.e2)({type:Number})],g.prototype,"value",2),(0,f.u2)([(0,v.e2)()],g.prototype,"label",2),(0,f.u2)([(0,v.e2)({attribute:"help-text"})],g.prototype,"helpText",2),(0,f.u2)([(0,v.e2)({type:Boolean,reflect:!0})],g.prototype,"disabled",2),(0,f.u2)([(0,v.e2)({type:Number})],g.prototype,"min",2),(0,f.u2)([(0,v.e2)({type:Number})],g.prototype,"max",2),(0,f.u2)([(0,v.e2)({type:Number})],g.prototype,"step",2),(0,f.u2)([(0,v.e2)()],g.prototype,"tooltip",2),(0,f.u2)([(0,v.e2)({attribute:!1})],g.prototype,"tooltipFormatter",2),(0,f.u2)([(0,v.e2)({reflect:!0})],g.prototype,"form",2),(0,f.u2)([(0,l.L)()],g.prototype,"defaultValue",2),(0,f.u2)([(0,v.e3)({passive:!0})],g.prototype,"handleThumbDragStart",1),(0,f.u2)([(0,p.Y)("value",{waitUntilFirstUpdate:!0})],g.prototype,"handleValueChange",1),(0,f.u2)([(0,p.Y)("disabled",{waitUntilFirstUpdate:!0})],g.prototype,"handleDisabledChange",1),(0,f.u2)([(0,p.Y)("hasTooltip",{waitUntilFirstUpdate:!0})],g.prototype,"syncRange",1),g=(0,f.u2)([(0,v.e)("sl-range")],g),o(1862),o(4370)}}]);
//# sourceMappingURL=sl-range.7a8bff11.js.map