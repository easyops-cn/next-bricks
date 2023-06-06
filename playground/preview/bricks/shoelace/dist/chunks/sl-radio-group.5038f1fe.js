/*! For license information please see sl-radio-group.5038f1fe.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[9402],{5626:(t,e,o)=>{o.r(e),o(6794),o(5517)},5517:(t,e,o)=>{o(2969),o(3467);var s=o(4124);function i(t){document.documentElement.classList["dark"===t||"dark-v2"===t?"add":"remove"]("sl-theme-dark")}o(1744),(0,s.t)(o.p),i(document.documentElement.dataset.theme),window.addEventListener("theme.change",(t=>{i(t.detail)}))},738:(t,e,o)=>{o.d(e,{Z:()=>a});var s=o(9601),i=o.n(s),r=o(2609),l=o.n(r)()(i());l.push([t.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const a=l},1744:(t,e,o)=>{var s=o(6062),i=o.n(s),r=o(4036),l=o.n(r),a=o(6793),n=o.n(a),h=o(7892),d=o.n(h),u=o(1173),c=o.n(u),m=o(2464),p=o.n(m),f=o(738),v={};v.styleTagTransform=p(),v.setAttributes=d(),v.insert=n().bind(null,"head"),v.domAPI=l(),v.insertStyleElement=c(),i()(f.Z,v),f.Z&&f.Z.locals&&f.Z.locals},3515:(t,e,o)=>{o.d(e,{F:()=>i,r:()=>s});var s=class{constructor(t,...e){this.slotNames=[],(this.host=t).addController(this),this.slotNames=e,this.handleSlotChange=this.handleSlotChange.bind(this)}hasDefaultSlot(){return[...this.host.childNodes].some((t=>{if(t.nodeType===t.TEXT_NODE&&""!==t.textContent.trim())return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if("sl-visually-hidden"===e.tagName.toLowerCase())return!1;if(!e.hasAttribute("slot"))return!0}return!1}))}hasNamedSlot(t){return null!==this.host.querySelector(`:scope > [slot="${t}"]`)}test(t){return"[default]"===t?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}handleSlotChange(t){const e=t.target;(this.slotNames.includes("[default]")&&!e.name||e.name&&this.slotNames.includes(e.name))&&this.host.requestUpdate()}};function i(t){if(!t)return"";const e=t.assignedNodes({flatten:!0});let o="";return[...e].forEach((t=>{t.nodeType===Node.TEXT_NODE&&(o+=t.textContent)})),o}},9340:(t,e,o)=>{var s=o(7918),i=o(8424),r=o(5954),l=o(453),a=class extends i.P{constructor(){super(...arguments),this.disableRole=!1,this.label=""}handleFocus(t){const e=n(t.target);null==e||e.classList.add("sl-button-group__button--focus")}handleBlur(t){const e=n(t.target);null==e||e.classList.remove("sl-button-group__button--focus")}handleMouseOver(t){const e=n(t.target);null==e||e.classList.add("sl-button-group__button--hover")}handleMouseOut(t){const e=n(t.target);null==e||e.classList.remove("sl-button-group__button--hover")}handleSlotChange(){const t=[...this.defaultSlot.assignedElements({flatten:!0})];t.forEach((e=>{const o=t.indexOf(e),s=n(e);null!==s&&(s.classList.add("sl-button-group__button"),s.classList.toggle("sl-button-group__button--first",0===o),s.classList.toggle("sl-button-group__button--inner",o>0&&o<t.length-1),s.classList.toggle("sl-button-group__button--last",o===t.length-1),s.classList.toggle("sl-button-group__button--radio","sl-radio-button"===s.tagName.toLowerCase()))}))}render(){return r.y`
      <slot
        part="base"
        class="button-group"
        role="${this.disableRole?"presentation":"group"}"
        aria-label=${this.label}
        @focusout=${this.handleBlur}
        @focusin=${this.handleFocus}
        @mouseover=${this.handleMouseOver}
        @mouseout=${this.handleMouseOut}
        @slotchange=${this.handleSlotChange}
      ></slot>
    `}};function n(t){var e;const o="sl-button, sl-radio-button";return null!=(e=t.closest(o))?e:t.querySelector(o)}a.styles=s.j,(0,l.u2)([(0,i.i)("slot")],a.prototype,"defaultSlot",2),(0,l.u2)([(0,i.t)()],a.prototype,"disableRole",2),(0,l.u2)([(0,i.e2)()],a.prototype,"label",2),a=(0,l.u2)([(0,i.e)("sl-button-group")],a)},6281:(t,e,o)=>{o.d(e,{N:()=>s});var s=o(5954).i`
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
`},3480:(t,e,o)=>{o.d(e,{ZW:()=>u,o9:()=>h,pY:()=>n,st:()=>d});var s=o(453),i=new WeakMap,r=new WeakMap,l=new WeakSet,a=new WeakMap,n=class{constructor(t,e){(this.host=t).addController(this),this.options=(0,s.ih)({form:t=>{if(t.hasAttribute("form")&&""!==t.getAttribute("form")){const e=t.getRootNode(),o=t.getAttribute("form");if(o)return e.getElementById(o)}return t.closest("form")},name:t=>t.name,value:t=>t.value,defaultValue:t=>t.defaultValue,disabled:t=>{var e;return null!=(e=t.disabled)&&e},reportValidity:t=>"function"!=typeof t.reportValidity||t.reportValidity(),setValue:(t,e)=>t.value=e,assumeInteractionOn:["sl-input"]},e),this.handleFormData=this.handleFormData.bind(this),this.handleFormSubmit=this.handleFormSubmit.bind(this),this.handleFormReset=this.handleFormReset.bind(this),this.reportFormValidity=this.reportFormValidity.bind(this),this.handleInteraction=this.handleInteraction.bind(this)}hostConnected(){const t=this.options.form(this.host);t&&this.attachForm(t),a.set(this.host,[]),this.options.assumeInteractionOn.forEach((t=>{this.host.addEventListener(t,this.handleInteraction)}))}hostDisconnected(){this.detachForm(),a.delete(this.host),this.options.assumeInteractionOn.forEach((t=>{this.host.removeEventListener(t,this.handleInteraction)}))}hostUpdated(){const t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,i.has(this.form)?i.get(this.form).add(this.host):i.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),r.has(this.form)||(r.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity())):this.form=void 0}detachForm(){var t;this.form&&(null==(t=i.get(this.form))||t.delete(this.host),this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),r.has(this.form)&&(this.form.reportValidity=r.get(this.form),r.delete(this.form))),this.form=void 0}handleFormData(t){const e=this.options.disabled(this.host),o=this.options.name(this.host),s=this.options.value(this.host),i="sl-button"===this.host.tagName.toLowerCase();!e&&!i&&"string"==typeof o&&o.length>0&&void 0!==s&&(Array.isArray(s)?s.forEach((e=>{t.formData.append(o,e.toString())})):t.formData.append(o,s.toString()))}handleFormSubmit(t){var e;const o=this.options.disabled(this.host),s=this.options.reportValidity;this.form&&!this.form.noValidate&&(null==(e=i.get(this.form))||e.forEach((t=>{this.setUserInteracted(t,!0)}))),!this.form||this.form.noValidate||o||s(this.host)||(t.preventDefault(),t.stopImmediatePropagation())}handleFormReset(){this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),a.set(this.host,[])}handleInteraction(t){const e=a.get(this.host);e.includes(t.type)||e.push(t.type),e.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)}reportFormValidity(){if(this.form&&!this.form.noValidate){const t=this.form.querySelectorAll("*");for(const e of t)if("function"==typeof e.reportValidity&&!e.reportValidity())return!1}return!0}setUserInteracted(t,e){e?l.add(t):l.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){const o=document.createElement("button");o.type=t,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",e&&(o.name=e.name,o.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach((t=>{e.hasAttribute(t)&&o.setAttribute(t,e.getAttribute(t))}))),this.form.append(o),o.click(),o.remove()}}getForm(){var t;return null!=(t=this.form)?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){const e=this.host,o=Boolean(l.has(e)),s=Boolean(e.required);e.toggleAttribute("data-required",s),e.toggleAttribute("data-optional",!s),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&o),e.toggleAttribute("data-user-valid",t&&o)}updateValidity(){const t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){const e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||null==t||t.preventDefault()}},h=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1}),d=Object.freeze((0,s.EZ)((0,s.ih)({},h),{valid:!1,valueMissing:!0})),u=Object.freeze((0,s.EZ)((0,s.ih)({},h),{valid:!1,customError:!0}))},3434:(t,e,o)=>{o.d(e,{n:()=>s});var s=o(5954).i`
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
`},5381:(t,e,o)=>{o.d(e,{o:()=>r});var s=o(4370),i=o(5954),r=(0,s.e)(class extends s.i{constructor(t){var e;if(super(t),t.type!==s.t.ATTRIBUTE||"class"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){var o,s;if(void 0===this.nt){this.nt=new Set,void 0!==t.strings&&(this.st=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!(null===(o=this.st)||void 0===o?void 0:o.has(t))&&this.nt.add(t);return this.render(e)}const r=t.element.classList;this.nt.forEach((t=>{t in e||(r.remove(t),this.nt.delete(t))}));for(const t in e){const o=!!e[t];o===this.nt.has(t)||(null===(s=this.st)||void 0===s?void 0:s.has(t))||(o?(r.add(t),this.nt.add(t)):(r.remove(t),this.nt.delete(t)))}return i.x}})},4370:(t,e,o)=>{o.d(e,{e:()=>i,i:()=>r,t:()=>s});var s={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},i=t=>(...e)=>({_$litDirective$:t,values:e}),r=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}},5710:(t,e,o)=>{o.d(e,{Y:()=>i});var s=o(453);function i(t,e){const o=(0,s.ih)({waitUntilFirstUpdate:!1},e);return(e,s)=>{const{update:i}=e,r=Array.isArray(t)?t:[t];e.update=function(t){r.forEach((e=>{const i=e;if(t.has(i)){const e=t.get(i),r=this[i];e!==r&&(o.waitUntilFirstUpdate&&!this.hasUpdated||this[s](e,r))}})),i.call(this,t)}}}},7918:(t,e,o)=>{o.d(e,{j:()=>i});var s=o(6281),i=o(5954).i`
  ${s.N}

  :host {
    display: inline-block;
  }

  .button-group {
    display: flex;
    flex-wrap: nowrap;
  }
`},6794:(t,e,o)=>{var s=o(3434),i=o(6281),r=o(5954),l=r.i`
  ${i.N}
  ${s.n}

  :host {
    display: block;
  }

  .form-control {
    border: none;
    padding: 0;
    margin: 0;
  }

  .form-control__label {
    padding: 0;
  }

  .radio-group--required .radio-group__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`,a=o(3480),n=o(3515),h=o(5710),d=o(5381),u=o(8424),c=o(453),m=class extends u.P{constructor(){super(...arguments),this.formControlController=new a.pY(this),this.hasSlotController=new n.r(this,"help-text","label"),this.customValidityMessage="",this.hasButtonGroup=!1,this.errorMessage="",this.defaultValue="",this.label="",this.helpText="",this.name="option",this.value="",this.size="medium",this.form="",this.required=!1}get validity(){const t=this.required&&!this.value;return""!==this.customValidityMessage?a.ZW:t?a.st:a.o9}get validationMessage(){const t=this.required&&!this.value;return""!==this.customValidityMessage?this.customValidityMessage:t?this.validationInput.validationMessage:""}connectedCallback(){super.connectedCallback(),this.defaultValue=this.value}firstUpdated(){this.formControlController.updateValidity()}getAllRadios(){return[...this.querySelectorAll("sl-radio, sl-radio-button")]}handleRadioClick(t){const e=t.target.closest("sl-radio, sl-radio-button"),o=this.getAllRadios(),s=this.value;e.disabled||(this.value=e.value,o.forEach((t=>t.checked=t===e)),this.value!==s&&(this.emit("sl-change"),this.emit("sl-input")))}handleKeyDown(t){var e;if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(t.key))return;const o=this.getAllRadios().filter((t=>!t.disabled)),s=null!=(e=o.find((t=>t.checked)))?e:o[0],i=" "===t.key?0:["ArrowUp","ArrowLeft"].includes(t.key)?-1:1,r=this.value;let l=o.indexOf(s)+i;l<0&&(l=o.length-1),l>o.length-1&&(l=0),this.getAllRadios().forEach((t=>{t.checked=!1,this.hasButtonGroup||(t.tabIndex=-1)})),this.value=o[l].value,o[l].checked=!0,this.hasButtonGroup?o[l].shadowRoot.querySelector("button").focus():(o[l].tabIndex=0,o[l].focus()),this.value!==r&&(this.emit("sl-change"),this.emit("sl-input")),t.preventDefault()}handleLabelClick(){const t=this.getAllRadios(),e=t.find((t=>t.checked))||t[0];e&&e.focus()}handleSlotChange(){var t,e;if(customElements.get("sl-radio")||customElements.get("sl-radio-button")){const o=this.getAllRadios();if(o.forEach((t=>{t.checked=t.value===this.value,t.size=this.size})),this.hasButtonGroup=o.some((t=>"sl-radio-button"===t.tagName.toLowerCase())),!o.some((t=>t.checked)))if(this.hasButtonGroup){const e=null==(t=o[0].shadowRoot)?void 0:t.querySelector("button");e&&(e.tabIndex=0)}else o[0].tabIndex=0;if(this.hasButtonGroup){const t=null==(e=this.shadowRoot)?void 0:e.querySelector("sl-button-group");t&&(t.disableRole=!0)}}else customElements.whenDefined("sl-radio").then((()=>this.handleSlotChange())),customElements.whenDefined("sl-radio-button").then((()=>this.handleSlotChange()))}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}updateCheckedRadio(){this.getAllRadios().forEach((t=>t.checked=t.value===this.value)),this.formControlController.setValidity(this.validity.valid)}handleValueChange(){this.hasUpdated&&this.updateCheckedRadio()}checkValidity(){const t=this.required&&!this.value,e=""!==this.customValidityMessage;return!t&&!e||(this.formControlController.emitInvalidEvent(),!1)}getForm(){return this.formControlController.getForm()}reportValidity(){const t=this.validity.valid;return this.errorMessage=this.customValidityMessage||t?"":this.validationInput.validationMessage,this.formControlController.setValidity(t),this.validationInput.hidden=!0,clearTimeout(this.validationTimeout),t||(this.validationInput.hidden=!1,this.validationInput.reportValidity(),this.validationTimeout=setTimeout((()=>this.validationInput.hidden=!0),1e4)),t}setCustomValidity(t=""){this.customValidityMessage=t,this.errorMessage=t,this.validationInput.setCustomValidity(t),this.formControlController.updateValidity()}render(){const t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=!!this.label||!!t,s=!!this.helpText||!!e,i=r.y`
      <slot
        @click=${this.handleRadioClick}
        @keydown=${this.handleKeyDown}
        @slotchange=${this.handleSlotChange}
        role="presentation"
      ></slot>
    `;return r.y`
      <fieldset
        part="form-control"
        class=${(0,d.o)({"form-control":!0,"form-control--small":"small"===this.size,"form-control--medium":"medium"===this.size,"form-control--large":"large"===this.size,"form-control--radio-group":!0,"form-control--has-label":o,"form-control--has-help-text":s})}
        role="radiogroup"
        aria-labelledby="label"
        aria-describedby="help-text"
        aria-errormessage="error-message"
      >
        <label
          part="form-control-label"
          id="label"
          class="form-control__label"
          aria-hidden=${o?"false":"true"}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div class="visually-hidden">
            <div id="error-message" aria-live="assertive">${this.errorMessage}</div>
            <label class="radio-group__validation">
              <input
                type="text"
                class="radio-group__validation-input"
                ?required=${this.required}
                tabindex="-1"
                hidden
                @invalid=${this.handleInvalid}
              />
            </label>
          </div>

          ${this.hasButtonGroup?r.y`
                <sl-button-group part="button-group" exportparts="base:button-group__base">
                  ${i}
                </sl-button-group>
              `:i}
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${s?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </fieldset>
    `}};m.styles=l,(0,c.u2)([(0,u.i)("slot:not([name])")],m.prototype,"defaultSlot",2),(0,c.u2)([(0,u.i)(".radio-group__validation-input")],m.prototype,"validationInput",2),(0,c.u2)([(0,u.t)()],m.prototype,"hasButtonGroup",2),(0,c.u2)([(0,u.t)()],m.prototype,"errorMessage",2),(0,c.u2)([(0,u.t)()],m.prototype,"defaultValue",2),(0,c.u2)([(0,u.e2)()],m.prototype,"label",2),(0,c.u2)([(0,u.e2)({attribute:"help-text"})],m.prototype,"helpText",2),(0,c.u2)([(0,u.e2)()],m.prototype,"name",2),(0,c.u2)([(0,u.e2)({reflect:!0})],m.prototype,"value",2),(0,c.u2)([(0,u.e2)({reflect:!0})],m.prototype,"size",2),(0,c.u2)([(0,u.e2)({reflect:!0})],m.prototype,"form",2),(0,c.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"required",2),(0,c.u2)([(0,h.Y)("value")],m.prototype,"handleValueChange",1),m=(0,c.u2)([(0,u.e)("sl-radio-group")],m),o(9340),o(7918),o(4370)}}]);
//# sourceMappingURL=sl-radio-group.5038f1fe.js.map