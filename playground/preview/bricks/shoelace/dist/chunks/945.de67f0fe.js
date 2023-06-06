/*! For license information please see 945.de67f0fe.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[945],{2518:(e,t,i)=>{var n=i(4617),s=i(4577),l=i(2626),o=i(3480),a=i(8734),r=i(5710),d=i(5381),c=i(8424),h=i(5954),u=i(453),p=class extends c.P{constructor(){super(...arguments),this.formControlController=new o.pY(this,{value:e=>e.checked?e.value||"on":void 0,defaultValue:e=>e.defaultChecked,setValue:(e,t)=>e.checked=t}),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.indeterminate=!1,this.defaultChecked=!1,this.form="",this.required=!1}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleClick(){this.checked=!this.checked,this.indeterminate=!1,this.emit("sl-change")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStateChange(){this.input.checked=this.checked,this.input.indeterminate=this.indeterminate,this.formControlController.updateValidity()}click(){this.input.click()}focus(e){this.input.focus(e)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.formControlController.updateValidity()}render(){return h.y`
      <label
        part="base"
        class=${(0,d.o)({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate,"checkbox--small":"small"===this.size,"checkbox--medium":"medium"===this.size,"checkbox--large":"large"===this.size})}
      >
        <input
          class="checkbox__input"
          type="checkbox"
          title=${this.title}
          name=${this.name}
          value=${(0,a.l)(this.value)}
          .indeterminate=${(0,n.l)(this.indeterminate)}
          .checked=${(0,n.l)(this.checked)}
          .disabled=${this.disabled}
          .required=${this.required}
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @input=${this.handleInput}
          @invalid=${this.handleInvalid}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
        />

        <span
          part="control${this.checked?" control--checked":""}${this.indeterminate?" control--indeterminate":""}"
          class="checkbox__control"
        >
          ${this.checked?h.y`
                <sl-icon part="checked-icon" class="checkbox__checked-icon" library="system" name="check"></sl-icon>
              `:""}
          ${!this.checked&&this.indeterminate?h.y`
                <sl-icon
                  part="indeterminate-icon"
                  class="checkbox__indeterminate-icon"
                  library="system"
                  name="indeterminate"
                ></sl-icon>
              `:""}
        </span>

        <div part="label" class="checkbox__label">
          <slot></slot>
        </div>
      </label>
    `}};p.styles=l.r,(0,u.u2)([(0,c.i)('input[type="checkbox"]')],p.prototype,"input",2),(0,u.u2)([(0,c.t)()],p.prototype,"hasFocus",2),(0,u.u2)([(0,c.e2)()],p.prototype,"title",2),(0,u.u2)([(0,c.e2)()],p.prototype,"name",2),(0,u.u2)([(0,c.e2)()],p.prototype,"value",2),(0,u.u2)([(0,c.e2)({reflect:!0})],p.prototype,"size",2),(0,u.u2)([(0,c.e2)({type:Boolean,reflect:!0})],p.prototype,"disabled",2),(0,u.u2)([(0,c.e2)({type:Boolean,reflect:!0})],p.prototype,"checked",2),(0,u.u2)([(0,c.e2)({type:Boolean,reflect:!0})],p.prototype,"indeterminate",2),(0,u.u2)([(0,s.L)("checked")],p.prototype,"defaultChecked",2),(0,u.u2)([(0,c.e2)({reflect:!0})],p.prototype,"form",2),(0,u.u2)([(0,c.e2)({type:Boolean,reflect:!0})],p.prototype,"required",2),(0,u.u2)([(0,r.Y)("disabled",{waitUntilFirstUpdate:!0})],p.prototype,"handleDisabledChange",1),(0,u.u2)([(0,r.Y)(["checked","indeterminate"],{waitUntilFirstUpdate:!0})],p.prototype,"handleStateChange",1),p=(0,u.u2)([(0,c.e)("sl-checkbox")],p)},6089:(e,t,i)=>{i.d(t,{E:()=>m});var n=i(9188),s=i(4617),l=i(2486),o=i(9745),a=i(8379),r=i(5710),d=i(5381),c=i(8424),h=i(5954),u=i(453);function p(e,t,i){return e?t():null==i?void 0:i()}var m=class extends c.P{constructor(){super(...arguments),this.localize=new a.V(this),this.indeterminate=!1,this.isLeaf=!1,this.loading=!1,this.selectable=!1,this.expanded=!1,this.selected=!1,this.disabled=!1,this.lazy=!1}static isTreeItem(e){return e instanceof Element&&"treeitem"===e.getAttribute("role")}connectedCallback(){super.connectedCallback(),this.setAttribute("role","treeitem"),this.setAttribute("tabindex","-1"),this.isNestedItem()&&(this.slot="children")}firstUpdated(){this.childrenContainer.hidden=!this.expanded,this.childrenContainer.style.height=this.expanded?"auto":"0",this.isLeaf=!this.lazy&&0===this.getChildrenItems().length,this.handleExpandedChange()}async animateCollapse(){this.emit("sl-collapse"),await(0,o.U_)(this.childrenContainer);const{keyframes:e,options:t}=(0,l.O8)(this,"tree-item.collapse",{dir:this.localize.dir()});await(0,o.nv)(this.childrenContainer,(0,o.GH)(e,this.childrenContainer.scrollHeight),t),this.childrenContainer.hidden=!0,this.emit("sl-after-collapse")}isNestedItem(){const e=this.parentElement;return!!e&&m.isTreeItem(e)}handleChildrenSlotChange(){this.loading=!1,this.isLeaf=!this.lazy&&0===this.getChildrenItems().length}willUpdate(e){e.has("selected")&&!e.has("indeterminate")&&(this.indeterminate=!1)}async animateExpand(){this.emit("sl-expand"),await(0,o.U_)(this.childrenContainer),this.childrenContainer.hidden=!1;const{keyframes:e,options:t}=(0,l.O8)(this,"tree-item.expand",{dir:this.localize.dir()});await(0,o.nv)(this.childrenContainer,(0,o.GH)(e,this.childrenContainer.scrollHeight),t),this.childrenContainer.style.height="auto",this.emit("sl-after-expand")}handleLoadingChange(){this.setAttribute("aria-busy",this.loading?"true":"false"),this.loading||this.animateExpand()}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleSelectedChange(){this.setAttribute("aria-selected",this.selected?"true":"false")}handleExpandedChange(){this.isLeaf?this.removeAttribute("aria-expanded"):this.setAttribute("aria-expanded",this.expanded?"true":"false")}handleExpandAnimation(){this.expanded?this.lazy?(this.loading=!0,this.emit("sl-lazy-load")):this.animateExpand():this.animateCollapse()}handleLazyChange(){this.emit("sl-lazy-change")}getChildrenItems({includeDisabled:e=!0}={}){return this.childrenSlot?[...this.childrenSlot.assignedElements({flatten:!0})].filter((t=>m.isTreeItem(t)&&(e||!t.disabled))):[]}render(){const e="rtl"===this.localize.dir(),t=!this.loading&&(!this.isLeaf||this.lazy);return h.y`
      <div
        part="base"
        class="${(0,d.o)({"tree-item":!0,"tree-item--expanded":this.expanded,"tree-item--selected":this.selected,"tree-item--disabled":this.disabled,"tree-item--leaf":this.isLeaf,"tree-item--has-expand-button":t,"tree-item--rtl":"rtl"===this.localize.dir()})}"
      >
        <div
          class="tree-item__item"
          part="
            item
            ${this.disabled?"item--disabled":""}
            ${this.expanded?"item--expanded":""}
            ${this.indeterminate?"item--indeterminate":""}
            ${this.selected?"item--selected":""}
          "
        >
          <div class="tree-item__indentation" part="indentation"></div>

          <div
            part="expand-button"
            class=${(0,d.o)({"tree-item__expand-button":!0,"tree-item__expand-button--visible":t})}
            aria-hidden="true"
          >
            ${p(this.loading,(()=>h.y` <sl-spinner></sl-spinner> `))}
            <slot class="tree-item__expand-icon-slot" name="expand-icon">
              <sl-icon library="system" name=${e?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
            <slot class="tree-item__expand-icon-slot" name="collapse-icon">
              <sl-icon library="system" name=${e?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
          </div>

          ${p(this.selectable,(()=>h.y`
                <sl-checkbox
                  tabindex="-1"
                  class="tree-item__checkbox"
                  ?disabled="${this.disabled}"
                  ?checked="${(0,s.l)(this.selected)}"
                  ?indeterminate="${this.indeterminate}"
                ></sl-checkbox>
              `))}

          <slot class="tree-item__label" part="label"></slot>
        </div>

        <slot
          name="children"
          class="tree-item__children"
          part="children"
          role="group"
          @slotchange="${this.handleChildrenSlotChange}"
        ></slot>
      </div>
    `}};m.styles=n.O,(0,u.u2)([(0,c.t)()],m.prototype,"indeterminate",2),(0,u.u2)([(0,c.t)()],m.prototype,"isLeaf",2),(0,u.u2)([(0,c.t)()],m.prototype,"loading",2),(0,u.u2)([(0,c.t)()],m.prototype,"selectable",2),(0,u.u2)([(0,c.e2)({type:Boolean,reflect:!0})],m.prototype,"expanded",2),(0,u.u2)([(0,c.e2)({type:Boolean,reflect:!0})],m.prototype,"selected",2),(0,u.u2)([(0,c.e2)({type:Boolean,reflect:!0})],m.prototype,"disabled",2),(0,u.u2)([(0,c.e2)({type:Boolean,reflect:!0})],m.prototype,"lazy",2),(0,u.u2)([(0,c.i)("slot:not([name])")],m.prototype,"defaultSlot",2),(0,u.u2)([(0,c.i)("slot[name=children]")],m.prototype,"childrenSlot",2),(0,u.u2)([(0,c.i)(".tree-item__item")],m.prototype,"itemElement",2),(0,u.u2)([(0,c.i)(".tree-item__children")],m.prototype,"childrenContainer",2),(0,u.u2)([(0,c.i)(".tree-item__expand-button slot")],m.prototype,"expandButtonSlot",2),(0,u.u2)([(0,r.Y)("loading",{waitUntilFirstUpdate:!0})],m.prototype,"handleLoadingChange",1),(0,u.u2)([(0,r.Y)("disabled")],m.prototype,"handleDisabledChange",1),(0,u.u2)([(0,r.Y)("selected")],m.prototype,"handleSelectedChange",1),(0,u.u2)([(0,r.Y)("expanded",{waitUntilFirstUpdate:!0})],m.prototype,"handleExpandedChange",1),(0,u.u2)([(0,r.Y)("expanded",{waitUntilFirstUpdate:!0})],m.prototype,"handleExpandAnimation",1),(0,u.u2)([(0,r.Y)("lazy",{waitUntilFirstUpdate:!0})],m.prototype,"handleLazyChange",1),m=(0,u.u2)([(0,c.e)("sl-tree-item")],m),(0,l.jx)("tree-item.expand",{keyframes:[{height:"0",opacity:"0",overflow:"hidden"},{height:"auto",opacity:"1",overflow:"hidden"}],options:{duration:250,easing:"cubic-bezier(0.4, 0.0, 0.2, 1)"}}),(0,l.jx)("tree-item.collapse",{keyframes:[{height:"auto",opacity:"1",overflow:"hidden"},{height:"0",opacity:"0",overflow:"hidden"}],options:{duration:200,easing:"cubic-bezier(0.4, 0.0, 0.2, 1)"}})},2626:(e,t,i)=>{i.d(t,{r:()=>s});var n=i(6281),s=i(5954).i`
  ${n.N}

  :host {
    display: inline-block;
  }

  .checkbox {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    color: var(--sl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .checkbox--small {
    --toggle-size: var(--sl-toggle-size-small);
    font-size: var(--sl-input-font-size-small);
  }

  .checkbox--medium {
    --toggle-size: var(--sl-toggle-size-medium);
    font-size: var(--sl-input-font-size-medium);
  }

  .checkbox--large {
    --toggle-size: var(--sl-toggle-size-large);
    font-size: var(--sl-input-font-size-large);
  }

  .checkbox__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
    border-radius: 2px;
    background-color: var(--sl-input-background-color);
    color: var(--sl-color-neutral-0);
    transition: var(--sl-transition-fast) border-color, var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) color, var(--sl-transition-fast) box-shadow;
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  .checkbox__checked-icon,
  .checkbox__indeterminate-icon {
    display: inline-flex;
    width: var(--toggle-size);
    height: var(--toggle-size);
  }

  /* Hover */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--sl-input-border-color-hover);
    background-color: var(--sl-input-background-color-hover);
  }

  /* Focus */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Checked/indeterminate */
  .checkbox--checked .checkbox__control,
  .checkbox--indeterminate .checkbox__control {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
  }

  /* Checked/indeterminate + hover */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--sl-color-primary-500);
    background-color: var(--sl-color-primary-500);
  }

  /* Checked/indeterminate + focus */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Disabled */
  .checkbox--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    line-height: var(--toggle-size);
    margin-inline-start: 0.5em;
    user-select: none;
  }

  :host([required]) .checkbox__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
  }
`},9188:(e,t,i)=>{i.d(t,{O:()=>s});var n=i(6281),s=i(5954).i`
  ${n.N}

  :host {
    display: block;
    outline: 0;
    z-index: 0;
  }

  :host(:focus) {
    outline: none;
  }

  slot:not([name])::slotted(sl-icon) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .tree-item {
    position: relative;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    color: var(--sl-color-neutral-700);
    cursor: pointer;
    user-select: none;
  }

  .tree-item__checkbox {
    pointer-events: none;
  }

  .tree-item__expand-button,
  .tree-item__checkbox,
  .tree-item__label {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-dense);
    letter-spacing: var(--sl-letter-spacing-normal);
  }

  .tree-item__checkbox::part(base) {
    display: flex;
    align-items: center;
  }

  .tree-item__indentation {
    display: block;
    width: 1em;
    flex-shrink: 0;
  }

  .tree-item__expand-button {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    color: var(--sl-color-neutral-500);
    padding: var(--sl-spacing-x-small);
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    cursor: pointer;
  }

  .tree-item__expand-button {
    transition: var(--sl-transition-medium) rotate ease;
  }

  .tree-item--expanded .tree-item__expand-button {
    rotate: 90deg;
  }

  .tree-item--expanded.tree-item--rtl .tree-item__expand-button {
    rotate: -90deg;
  }

  .tree-item--expanded slot[name='expand-icon'],
  .tree-item:not(.tree-item--expanded) slot[name='collapse-icon'] {
    display: none;
  }

  .tree-item:not(.tree-item--has-expand-button) .tree-item__expand-icon-slot {
    display: none;
  }

  .tree-item__expand-button--visible {
    cursor: pointer;
  }

  .tree-item__item {
    display: flex;
    align-items: center;
    border-inline-start: solid 3px transparent;
  }

  .tree-item--disabled .tree-item__item {
    opacity: 0.5;
    outline: none;
    cursor: not-allowed;
  }

  :host(:focus-visible) .tree-item__item {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
    z-index: 2;
  }

  :host(:not([aria-disabled='true'])) .tree-item--selected .tree-item__item {
    background-color: var(--sl-color-neutral-100);
    border-inline-start-color: var(--sl-color-primary-600);
  }

  :host(:not([aria-disabled='true'])) .tree-item__expand-button {
    color: var(--sl-color-neutral-600);
  }

  .tree-item__label {
    display: flex;
    align-items: center;
    transition: var(--sl-transition-fast) color;
  }

  .tree-item__children {
    display: block;
    font-size: calc(1em + var(--indent-size, var(--sl-spacing-medium)));
  }

  /* Indentation lines */
  .tree-item__children {
    position: relative;
  }

  .tree-item__children::before {
    content: '';
    position: absolute;
    top: var(--indent-guide-offset);
    bottom: var(--indent-guide-offset);
    left: calc(1em - (var(--indent-guide-width) / 2) - 1px);
    border-inline-end: var(--indent-guide-width) var(--indent-guide-style) var(--indent-guide-color);
    z-index: 1;
  }

  .tree-item--rtl .tree-item__children::before {
    left: auto;
    right: 1em;
  }

  @media (forced-colors: active) {
    :host(:not([aria-disabled='true'])) .tree-item--selected .tree-item__item {
      outline: dashed 1px SelectedItem;
    }
  }
`},6469:(e,t,i)=>{i(6089),i(9188),i(2518),i(4617),i(4577),i(2626),i(6328),i(8832),i(3480),i(2486),i(9745),i(8734),i(8379),i(1862),i(9940),i(9191),i(836),i(2759),i(1939),i(5710),i(5381),i(4370),i(8424),i(6281),i(5954),i(453)},7845:(e,t,i)=>{var n=i(6281),s=i(5954),l=s.i`
  ${n.N}

  :host {
    /*
     * These are actually used by tree item, but we define them here so they can more easily be set and all tree items
     * stay consistent.
     */
    --indent-guide-color: var(--sl-color-neutral-200);
    --indent-guide-offset: 0;
    --indent-guide-style: solid;
    --indent-guide-width: 0;
    --indent-size: var(--sl-spacing-large);

    display: block;
    isolation: isolate;

    /*
     * Tree item indentation uses the "em" unit to increment its width on each level, so setting the font size to zero
     * here removes the indentation for all the nodes on the first level.
     */
    font-size: 0;
  }
`,o=i(6089),a=i(1807),r=i(8379),d=i(5710),c=i(8424),h=i(453);function u(e,t=!1){function i(e){const t=e.getChildrenItems({includeDisabled:!1});if(t.length){const i=t.every((e=>e.selected)),n=t.every((e=>!e.selected&&!e.indeterminate));e.selected=i,e.indeterminate=!i&&!n}}!function e(n){for(const i of n.getChildrenItems())i.selected=t?n.selected||i.selected:!i.disabled&&n.selected,e(i);t&&i(n)}(e),function e(t){const n=t.parentElement;o.E.isTreeItem(n)&&(i(n),e(n))}(e)}var p=class extends c.P{constructor(){super(...arguments),this.selection="single",this.localize=new r.V(this),this.clickTarget=null,this.initTreeItem=e=>{e.selectable="multiple"===this.selection,["expand","collapse"].filter((e=>!!this.querySelector(`[slot="${e}-icon"]`))).forEach((t=>{const i=e.querySelector(`[slot="${t}-icon"]`);null===i?e.append(this.getExpandButtonIcon(t)):i.hasAttribute("data-default")&&i.replaceWith(this.getExpandButtonIcon(t))}))}}async connectedCallback(){super.connectedCallback(),this.handleTreeChanged=this.handleTreeChanged.bind(this),this.handleFocusIn=this.handleFocusIn.bind(this),this.handleFocusOut=this.handleFocusOut.bind(this),this.setAttribute("role","tree"),this.setAttribute("tabindex","0"),this.addEventListener("focusin",this.handleFocusIn),this.addEventListener("focusout",this.handleFocusOut),this.addEventListener("sl-lazy-change",this.handleSlotChange),await this.updateComplete,this.mutationObserver=new MutationObserver(this.handleTreeChanged),this.mutationObserver.observe(this,{childList:!0,subtree:!0})}disconnectedCallback(){super.disconnectedCallback(),this.mutationObserver.disconnect(),this.removeEventListener("focusin",this.handleFocusIn),this.removeEventListener("focusout",this.handleFocusOut),this.removeEventListener("sl-lazy-change",this.handleSlotChange)}getExpandButtonIcon(e){const t=("expand"===e?this.expandedIconSlot:this.collapsedIconSlot).assignedElements({flatten:!0})[0];if(t){const i=t.cloneNode(!0);return[i,...i.querySelectorAll("[id]")].forEach((e=>e.removeAttribute("id"))),i.setAttribute("data-default",""),i.slot=`${e}-icon`,i}return null}handleTreeChanged(e){for(const t of e){const e=[...t.addedNodes].filter(o.E.isTreeItem),i=[...t.removedNodes].filter(o.E.isTreeItem);e.forEach(this.initTreeItem),i.includes(this.lastFocusedItem)&&this.focusItem(this.getFocusableItems()[0])}}syncTreeItems(e){const t=this.getAllTreeItems();if("multiple"===this.selection)u(e);else for(const i of t)i!==e&&(i.selected=!1)}selectItem(e){const t=[...this.selectedItems];"multiple"===this.selection?(e.selected=!e.selected,e.lazy&&(e.expanded=!0),this.syncTreeItems(e)):"single"===this.selection||e.isLeaf?(e.expanded=!e.expanded,e.selected=!0,this.syncTreeItems(e)):"leaf"===this.selection&&(e.expanded=!e.expanded);const i=this.selectedItems;(t.length!==i.length||i.some((e=>!t.includes(e))))&&Promise.all(i.map((e=>e.updateComplete))).then((()=>{this.emit("sl-selection-change",{detail:{selection:i}})}))}getAllTreeItems(){return[...this.querySelectorAll("sl-tree-item")]}focusItem(e){null==e||e.focus()}handleKeyDown(e){if(!["ArrowDown","ArrowUp","ArrowRight","ArrowLeft","Home","End","Enter"," "].includes(e.key))return;const t=this.getFocusableItems(),i="ltr"===this.localize.dir(),n="rtl"===this.localize.dir();if(t.length>0){e.preventDefault();const s=t.findIndex((e=>e.matches(":focus"))),l=t[s],o=e=>{const i=t[(0,a.u)(e,0,t.length-1)];this.focusItem(i)},r=e=>{l.expanded=e};"ArrowDown"===e.key?o(s+1):"ArrowUp"===e.key?o(s-1):i&&"ArrowRight"===e.key||n&&"ArrowLeft"===e.key?!l||l.disabled||l.expanded||l.isLeaf&&!l.lazy?o(s+1):r(!0):i&&"ArrowLeft"===e.key||n&&"ArrowRight"===e.key?!l||l.disabled||l.isLeaf||!l.expanded?o(s-1):r(!1):"Home"===e.key?o(0):"End"===e.key?o(t.length-1):"Enter"!==e.key&&" "!==e.key||l.disabled||this.selectItem(l)}}handleClick(e){const t=e.target,i=t.closest("sl-tree-item"),n=e.composedPath().some((e=>{var t;return null==(t=null==e?void 0:e.classList)?void 0:t.contains("tree-item__expand-button")}));i&&!i.disabled&&t===this.clickTarget&&("multiple"===this.selection&&n?i.expanded=!i.expanded:this.selectItem(i))}handleMouseDown(e){this.clickTarget=e.target}handleFocusOut(e){const t=e.relatedTarget;t&&this.contains(t)||(this.tabIndex=0)}handleFocusIn(e){const t=e.target;e.target===this&&this.focusItem(this.lastFocusedItem||this.getAllTreeItems()[0]),o.E.isTreeItem(t)&&!t.disabled&&(this.lastFocusedItem&&(this.lastFocusedItem.tabIndex=-1),this.lastFocusedItem=t,this.tabIndex=-1,t.tabIndex=0)}handleSlotChange(){this.getAllTreeItems().forEach(this.initTreeItem)}async handleSelectionChange(){const e="multiple"===this.selection,t=this.getAllTreeItems();this.setAttribute("aria-multiselectable",e?"true":"false");for(const i of t)i.selectable=e;e&&(await this.updateComplete,[...this.querySelectorAll(":scope > sl-tree-item")].forEach((e=>u(e,!0))))}get selectedItems(){return this.getAllTreeItems().filter((e=>e.selected))}getFocusableItems(){const e=this.getAllTreeItems(),t=new Set;return e.filter((e=>{var i;if(e.disabled)return!1;const n=null==(i=e.parentElement)?void 0:i.closest("[role=treeitem]");return n&&(!n.expanded||n.loading||t.has(n))&&t.add(e),!t.has(e)}))}render(){return s.y`
      <div
        part="base"
        class="tree"
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
        <slot name="expand-icon" hidden aria-hidden="true"> </slot>
        <slot name="collapse-icon" hidden aria-hidden="true"> </slot>
      </div>
    `}};p.styles=l,(0,h.u2)([(0,c.i)("slot:not([name])")],p.prototype,"defaultSlot",2),(0,h.u2)([(0,c.i)("slot[name=expand-icon]")],p.prototype,"expandedIconSlot",2),(0,h.u2)([(0,c.i)("slot[name=collapse-icon]")],p.prototype,"collapsedIconSlot",2),(0,h.u2)([(0,c.e2)()],p.prototype,"selection",2),(0,h.u2)([(0,d.Y)("selection")],p.prototype,"handleSelectionChange",1),p=(0,h.u2)([(0,c.e)("sl-tree")],p),i(9188),i(2518),i(4617),i(4577),i(2626),i(6328),i(8832),i(3480),i(2486),i(9745),i(8734),i(1862),i(9940),i(9191),i(836),i(2759),i(1939),i(5381),i(4370)}}]);
//# sourceMappingURL=945.de67f0fe.js.map