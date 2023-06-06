/*! For license information please see sl-textarea.38d236e6.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[6044],{6106:(t,e,o)=>{o.r(e),o(7515),o(5517)},5517:(t,e,o)=>{o(2969),o(3467);var r=o(4124);function i(t){document.documentElement.classList["dark"===t||"dark-v2"===t?"add":"remove"]("sl-theme-dark")}o(1744),(0,r.t)(o.p),i(document.documentElement.dataset.theme),window.addEventListener("theme.change",(t=>{i(t.detail)}))},738:(t,e,o)=>{o.d(e,{Z:()=>l});var r=o(9601),i=o.n(r),a=o(2609),s=o.n(a)()(i());s.push([t.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const l=s},1744:(t,e,o)=>{var r=o(6062),i=o.n(r),a=o(4036),s=o.n(a),l=o(6793),n=o.n(l),h=o(7892),d=o.n(h),u=o(1173),c=o.n(u),p=o(2464),m=o.n(p),f=o(738),v={};v.styleTagTransform=m(),v.setAttributes=d(),v.insert=n().bind(null,"head"),v.domAPI=s(),v.insertStyleElement=c(),i()(f.Z,v),f.Z&&f.Z.locals&&f.Z.locals},3515:(t,e,o)=>{o.d(e,{F:()=>i,r:()=>r});var r=class{constructor(t,...e){this.slotNames=[],(this.host=t).addController(this),this.slotNames=e,this.handleSlotChange=this.handleSlotChange.bind(this)}hasDefaultSlot(){return[...this.host.childNodes].some((t=>{if(t.nodeType===t.TEXT_NODE&&""!==t.textContent.trim())return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if("sl-visually-hidden"===e.tagName.toLowerCase())return!1;if(!e.hasAttribute("slot"))return!0}return!1}))}hasNamedSlot(t){return null!==this.host.querySelector(`:scope > [slot="${t}"]`)}test(t){return"[default]"===t?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}handleSlotChange(t){const e=t.target;(this.slotNames.includes("[default]")&&!e.name||e.name&&this.slotNames.includes(e.name))&&this.host.requestUpdate()}};function i(t){if(!t)return"";const e=t.assignedNodes({flatten:!0});let o="";return[...e].forEach((t=>{t.nodeType===Node.TEXT_NODE&&(o+=t.textContent)})),o}},6281:(t,e,o)=>{o.d(e,{N:()=>r});var r=o(5954).i`
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
`},3480:(t,e,o)=>{o.d(e,{ZW:()=>u,o9:()=>h,pY:()=>n,st:()=>d});var r=o(453),i=new WeakMap,a=new WeakMap,s=new WeakSet,l=new WeakMap,n=class{constructor(t,e){(this.host=t).addController(this),this.options=(0,r.ih)({form:t=>{if(t.hasAttribute("form")&&""!==t.getAttribute("form")){const e=t.getRootNode(),o=t.getAttribute("form");if(o)return e.getElementById(o)}return t.closest("form")},name:t=>t.name,value:t=>t.value,defaultValue:t=>t.defaultValue,disabled:t=>{var e;return null!=(e=t.disabled)&&e},reportValidity:t=>"function"!=typeof t.reportValidity||t.reportValidity(),setValue:(t,e)=>t.value=e,assumeInteractionOn:["sl-input"]},e),this.handleFormData=this.handleFormData.bind(this),this.handleFormSubmit=this.handleFormSubmit.bind(this),this.handleFormReset=this.handleFormReset.bind(this),this.reportFormValidity=this.reportFormValidity.bind(this),this.handleInteraction=this.handleInteraction.bind(this)}hostConnected(){const t=this.options.form(this.host);t&&this.attachForm(t),l.set(this.host,[]),this.options.assumeInteractionOn.forEach((t=>{this.host.addEventListener(t,this.handleInteraction)}))}hostDisconnected(){this.detachForm(),l.delete(this.host),this.options.assumeInteractionOn.forEach((t=>{this.host.removeEventListener(t,this.handleInteraction)}))}hostUpdated(){const t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,i.has(this.form)?i.get(this.form).add(this.host):i.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),a.has(this.form)||(a.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity())):this.form=void 0}detachForm(){var t;this.form&&(null==(t=i.get(this.form))||t.delete(this.host),this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),a.has(this.form)&&(this.form.reportValidity=a.get(this.form),a.delete(this.form))),this.form=void 0}handleFormData(t){const e=this.options.disabled(this.host),o=this.options.name(this.host),r=this.options.value(this.host),i="sl-button"===this.host.tagName.toLowerCase();!e&&!i&&"string"==typeof o&&o.length>0&&void 0!==r&&(Array.isArray(r)?r.forEach((e=>{t.formData.append(o,e.toString())})):t.formData.append(o,r.toString()))}handleFormSubmit(t){var e;const o=this.options.disabled(this.host),r=this.options.reportValidity;this.form&&!this.form.noValidate&&(null==(e=i.get(this.form))||e.forEach((t=>{this.setUserInteracted(t,!0)}))),!this.form||this.form.noValidate||o||r(this.host)||(t.preventDefault(),t.stopImmediatePropagation())}handleFormReset(){this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),l.set(this.host,[])}handleInteraction(t){const e=l.get(this.host);e.includes(t.type)||e.push(t.type),e.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)}reportFormValidity(){if(this.form&&!this.form.noValidate){const t=this.form.querySelectorAll("*");for(const e of t)if("function"==typeof e.reportValidity&&!e.reportValidity())return!1}return!0}setUserInteracted(t,e){e?s.add(t):s.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){const o=document.createElement("button");o.type=t,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",e&&(o.name=e.name,o.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach((t=>{e.hasAttribute(t)&&o.setAttribute(t,e.getAttribute(t))}))),this.form.append(o),o.click(),o.remove()}}getForm(){var t;return null!=(t=this.form)?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){const e=this.host,o=Boolean(s.has(e)),r=Boolean(e.required);e.toggleAttribute("data-required",r),e.toggleAttribute("data-optional",!r),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&o),e.toggleAttribute("data-user-valid",t&&o)}updateValidity(){const t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){const e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||null==t||t.preventDefault()}},h=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1}),d=Object.freeze((0,r.EZ)((0,r.ih)({},h),{valid:!1,valueMissing:!0})),u=Object.freeze((0,r.EZ)((0,r.ih)({},h),{valid:!1,customError:!0}))},3434:(t,e,o)=>{o.d(e,{n:()=>r});var r=o(5954).i`
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
`},5381:(t,e,o)=>{o.d(e,{o:()=>a});var r=o(4370),i=o(5954),a=(0,r.e)(class extends r.i{constructor(t){var e;if(super(t),t.type!==r.t.ATTRIBUTE||"class"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){var o,r;if(void 0===this.nt){this.nt=new Set,void 0!==t.strings&&(this.st=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!(null===(o=this.st)||void 0===o?void 0:o.has(t))&&this.nt.add(t);return this.render(e)}const a=t.element.classList;this.nt.forEach((t=>{t in e||(a.remove(t),this.nt.delete(t))}));for(const t in e){const o=!!e[t];o===this.nt.has(t)||(null===(r=this.st)||void 0===r?void 0:r.has(t))||(o?(a.add(t),this.nt.add(t)):(a.remove(t),this.nt.delete(t)))}return i.x}})},4617:(t,e,o)=>{o.d(e,{l:()=>l});var r=o(4370),i=o(5954),{I:a}=i.L,s={},l=(0,r.e)(class extends r.i{constructor(t){if(super(t),t.type!==r.t.PROPERTY&&t.type!==r.t.ATTRIBUTE&&t.type!==r.t.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(void 0!==t.strings)throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===i.x||e===i.b)return e;const o=t.element,a=t.name;if(t.type===r.t.PROPERTY){if(e===o[a])return i.x}else if(t.type===r.t.BOOLEAN_ATTRIBUTE){if(!!e===o.hasAttribute(a))return i.x}else if(t.type===r.t.ATTRIBUTE&&o.getAttribute(a)===e+"")return i.x;return((t,e=s)=>{t._$AH=e})(t),e}})},4370:(t,e,o)=>{o.d(e,{e:()=>i,i:()=>a,t:()=>r});var r={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},i=t=>(...e)=>({_$litDirective$:t,values:e}),a=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}},8734:(t,e,o)=>{o.d(e,{l:()=>i});var r=o(5954),i=t=>null!=t?t:r.b},5710:(t,e,o)=>{o.d(e,{Y:()=>i});var r=o(453);function i(t,e){const o=(0,r.ih)({waitUntilFirstUpdate:!1},e);return(e,r)=>{const{update:i}=e,a=Array.isArray(t)?t:[t];e.update=function(t){a.forEach((e=>{const i=e;if(t.has(i)){const e=t.get(i),a=this[i];e!==a&&(o.waitUntilFirstUpdate&&!this.hasUpdated||this[r](e,a))}})),i.call(this,t)}}}},4577:(t,e,o)=>{o.d(e,{L:()=>i});var r=o(5954),i=(t="value")=>(e,o)=>{const i=e.constructor,a=i.prototype.attributeChangedCallback;i.prototype.attributeChangedCallback=function(e,s,l){var n;const h=i.getPropertyOptions(t);if(e===("string"==typeof h.attribute?h.attribute:t)){const e=h.converter||r.n,i=("function"==typeof e?e:null!=(n=null==e?void 0:e.fromAttribute)?n:r.n.fromAttribute)(l,h.type);this[t]!==i&&(this[o]=i)}a.call(this,e,s,l)}}},7515:(t,e,o)=>{var r=o(3434),i=o(6281),a=o(5954),s=a.i`
  ${i.N}
  ${r.n}

  :host {
    display: block;
  }

  .textarea {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    transition: var(--sl-transition-fast) color, var(--sl-transition-fast) border, var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
    cursor: text;
  }

  /* Standard textareas */
  .textarea--standard {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .textarea--standard:hover:not(.textarea--disabled) {
    background-color: var(--sl-input-background-color-hover);
    border-color: var(--sl-input-border-color-hover);
  }
  .textarea--standard:hover:not(.textarea--disabled) .textarea__control {
    color: var(--sl-input-color-hover);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    color: var(--sl-input-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) .textarea__control {
    color: var(--sl-input-color-focus);
  }

  .textarea--standard.textarea--disabled {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .textarea--standard.textarea--disabled .textarea__control {
    color: var(--sl-input-color-disabled);
  }

  .textarea--standard.textarea--disabled .textarea__control::placeholder {
    color: var(--sl-input-placeholder-color-disabled);
  }

  /* Filled textareas */
  .textarea--filled {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .textarea--filled:hover:not(.textarea--disabled) {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .textarea--filled.textarea--focused:not(.textarea--disabled) {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .textarea--filled.textarea--disabled {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .textarea__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: 1.4;
    color: var(--sl-input-color);
    border: none;
    background: none;
    box-shadow: none;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .textarea__control::-webkit-search-decoration,
  .textarea__control::-webkit-search-cancel-button,
  .textarea__control::-webkit-search-results-button,
  .textarea__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .textarea__control::placeholder {
    color: var(--sl-input-placeholder-color);
    user-select: none;
  }

  .textarea__control:focus {
    outline: none;
  }

  /*
   * Size modifiers
   */

  .textarea--small {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
  }

  .textarea--small .textarea__control {
    padding: 0.5em var(--sl-input-spacing-small);
  }

  .textarea--medium {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
  }

  .textarea--medium .textarea__control {
    padding: 0.5em var(--sl-input-spacing-medium);
  }

  .textarea--large {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
  }

  .textarea--large .textarea__control {
    padding: 0.5em var(--sl-input-spacing-large);
  }

  /*
   * Resize types
   */

  .textarea--resize-none .textarea__control {
    resize: none;
  }

  .textarea--resize-vertical .textarea__control {
    resize: vertical;
  }

  .textarea--resize-auto .textarea__control {
    height: auto;
    resize: none;
    overflow-y: hidden;
  }
`,l=o(4617),n=o(4577),h=o(3480),d=o(8734),u=o(3515),c=o(5710),p=o(5381),m=o(8424),f=o(453),v=class extends m.P{constructor(){super(...arguments),this.formControlController=new h.pY(this,{assumeInteractionOn:["sl-blur","sl-input"]}),this.hasSlotController=new u.r(this,"help-text","label"),this.hasFocus=!1,this.title="",this.name="",this.value="",this.size="medium",this.filled=!1,this.label="",this.helpText="",this.placeholder="",this.rows=4,this.resize="vertical",this.disabled=!1,this.readonly=!1,this.form="",this.required=!1,this.spellcheck=!0,this.defaultValue=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver((()=>this.setTextareaHeight())),this.updateComplete.then((()=>{this.setTextareaHeight(),this.resizeObserver.observe(this.input)}))}firstUpdated(){this.formControlController.updateValidity()}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this.input)}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.setTextareaHeight(),this.emit("sl-change")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}setTextareaHeight(){"auto"===this.resize?(this.input.style.height="auto",this.input.style.height=`${this.input.scrollHeight}px`):this.input.style.height=void 0}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleRowsChange(){this.setTextareaHeight()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity(),this.setTextareaHeight()}focus(t){this.input.focus(t)}blur(){this.input.blur()}select(){this.input.select()}scrollPosition(t){return t?("number"==typeof t.top&&(this.input.scrollTop=t.top),void("number"==typeof t.left&&(this.input.scrollLeft=t.left))):{top:this.input.scrollTop,left:this.input.scrollTop}}setSelectionRange(t,e,o="none"){this.input.setSelectionRange(t,e,o)}setRangeText(t,e,o,r){this.input.setRangeText(t,e,o,r),this.value!==this.input.value&&(this.value=this.input.value),this.value!==this.input.value&&(this.value=this.input.value,this.setTextareaHeight())}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){const t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=!!this.label||!!t,r=!!this.helpText||!!e;return a.y`
      <div
        part="form-control"
        class=${(0,p.o)({"form-control":!0,"form-control--small":"small"===this.size,"form-control--medium":"medium"===this.size,"form-control--large":"large"===this.size,"form-control--has-label":o,"form-control--has-help-text":r})}
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
            class=${(0,p.o)({textarea:!0,"textarea--small":"small"===this.size,"textarea--medium":"medium"===this.size,"textarea--large":"large"===this.size,"textarea--standard":!this.filled,"textarea--filled":this.filled,"textarea--disabled":this.disabled,"textarea--focused":this.hasFocus,"textarea--empty":!this.value,"textarea--resize-none":"none"===this.resize,"textarea--resize-vertical":"vertical"===this.resize,"textarea--resize-auto":"auto"===this.resize})}
          >
            <textarea
              part="textarea"
              id="input"
              class="textarea__control"
              title=${this.title}
              name=${(0,d.l)(this.name)}
              .value=${(0,l.l)(this.value)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${(0,d.l)(this.placeholder)}
              rows=${(0,d.l)(this.rows)}
              minlength=${(0,d.l)(this.minlength)}
              maxlength=${(0,d.l)(this.maxlength)}
              autocapitalize=${(0,d.l)(this.autocapitalize)}
              autocorrect=${(0,d.l)(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${(0,d.l)(this.spellcheck)}
              enterkeyhint=${(0,d.l)(this.enterkeyhint)}
              inputmode=${(0,d.l)(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            ></textarea>
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
    `}};v.styles=s,(0,f.u2)([(0,m.i)(".textarea__control")],v.prototype,"input",2),(0,f.u2)([(0,m.t)()],v.prototype,"hasFocus",2),(0,f.u2)([(0,m.e2)()],v.prototype,"title",2),(0,f.u2)([(0,m.e2)()],v.prototype,"name",2),(0,f.u2)([(0,m.e2)()],v.prototype,"value",2),(0,f.u2)([(0,m.e2)({reflect:!0})],v.prototype,"size",2),(0,f.u2)([(0,m.e2)({type:Boolean,reflect:!0})],v.prototype,"filled",2),(0,f.u2)([(0,m.e2)()],v.prototype,"label",2),(0,f.u2)([(0,m.e2)({attribute:"help-text"})],v.prototype,"helpText",2),(0,f.u2)([(0,m.e2)()],v.prototype,"placeholder",2),(0,f.u2)([(0,m.e2)({type:Number})],v.prototype,"rows",2),(0,f.u2)([(0,m.e2)()],v.prototype,"resize",2),(0,f.u2)([(0,m.e2)({type:Boolean,reflect:!0})],v.prototype,"disabled",2),(0,f.u2)([(0,m.e2)({type:Boolean,reflect:!0})],v.prototype,"readonly",2),(0,f.u2)([(0,m.e2)({reflect:!0})],v.prototype,"form",2),(0,f.u2)([(0,m.e2)({type:Boolean,reflect:!0})],v.prototype,"required",2),(0,f.u2)([(0,m.e2)({type:Number})],v.prototype,"minlength",2),(0,f.u2)([(0,m.e2)({type:Number})],v.prototype,"maxlength",2),(0,f.u2)([(0,m.e2)()],v.prototype,"autocapitalize",2),(0,f.u2)([(0,m.e2)()],v.prototype,"autocorrect",2),(0,f.u2)([(0,m.e2)()],v.prototype,"autocomplete",2),(0,f.u2)([(0,m.e2)({type:Boolean})],v.prototype,"autofocus",2),(0,f.u2)([(0,m.e2)()],v.prototype,"enterkeyhint",2),(0,f.u2)([(0,m.e2)({type:Boolean,converter:{fromAttribute:t=>!(!t||"false"===t),toAttribute:t=>t?"true":"false"}})],v.prototype,"spellcheck",2),(0,f.u2)([(0,m.e2)()],v.prototype,"inputmode",2),(0,f.u2)([(0,n.L)()],v.prototype,"defaultValue",2),(0,f.u2)([(0,c.Y)("disabled",{waitUntilFirstUpdate:!0})],v.prototype,"handleDisabledChange",1),(0,f.u2)([(0,c.Y)("rows",{waitUntilFirstUpdate:!0})],v.prototype,"handleRowsChange",1),(0,f.u2)([(0,c.Y)("value",{waitUntilFirstUpdate:!0})],v.prototype,"handleValueChange",1),v=(0,f.u2)([(0,m.e)("sl-textarea")],v),o(4370)}}]);
//# sourceMappingURL=sl-textarea.38d236e6.js.map