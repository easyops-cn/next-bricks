/*! For license information please see sl-card.ac1679bb.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[5967],{7680:(e,t,r)=>{r.r(t),r(4775),r(5517)},5517:(e,t,r)=>{r(2969),r(3467);var s=r(4124);function a(e){document.documentElement.classList["dark"===e||"dark-v2"===e?"add":"remove"]("sl-theme-dark")}r(1744),(0,s.t)(r.p),a(document.documentElement.dataset.theme),window.addEventListener("theme.change",(e=>{a(e.detail)}))},738:(e,t,r)=>{r.d(t,{Z:()=>i});var s=r(9601),a=r.n(s),o=r(2609),d=r.n(o)()(a());d.push([e.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const i=d},1744:(e,t,r)=>{var s=r(6062),a=r.n(s),o=r(4036),d=r.n(o),i=r(6793),n=r.n(i),l=r(7892),h=r.n(l),c=r(1173),u=r.n(c),b=r(2464),m=r.n(b),p=r(738),v={};v.styleTagTransform=m(),v.setAttributes=h(),v.insert=n().bind(null,"head"),v.domAPI=d(),v.insertStyleElement=u(),a()(p.Z,v),p.Z&&p.Z.locals&&p.Z.locals},3515:(e,t,r)=>{r.d(t,{F:()=>a,r:()=>s});var s=class{constructor(e,...t){this.slotNames=[],(this.host=e).addController(this),this.slotNames=t,this.handleSlotChange=this.handleSlotChange.bind(this)}hasDefaultSlot(){return[...this.host.childNodes].some((e=>{if(e.nodeType===e.TEXT_NODE&&""!==e.textContent.trim())return!0;if(e.nodeType===e.ELEMENT_NODE){const t=e;if("sl-visually-hidden"===t.tagName.toLowerCase())return!1;if(!t.hasAttribute("slot"))return!0}return!1}))}hasNamedSlot(e){return null!==this.host.querySelector(`:scope > [slot="${e}"]`)}test(e){return"[default]"===e?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}handleSlotChange(e){const t=e.target;(this.slotNames.includes("[default]")&&!t.name||t.name&&this.slotNames.includes(t.name))&&this.host.requestUpdate()}};function a(e){if(!e)return"";const t=e.assignedNodes({flatten:!0});let r="";return[...t].forEach((e=>{e.nodeType===Node.TEXT_NODE&&(r+=e.textContent)})),r}},6281:(e,t,r)=>{r.d(t,{N:()=>s});var s=r(5954).i`
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
`},5381:(e,t,r)=>{r.d(t,{o:()=>o});var s=r(4370),a=r(5954),o=(0,s.e)(class extends s.i{constructor(e){var t;if(super(e),e.type!==s.t.ATTRIBUTE||"class"!==e.name||(null===(t=e.strings)||void 0===t?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){var r,s;if(void 0===this.nt){this.nt=new Set,void 0!==e.strings&&(this.st=new Set(e.strings.join(" ").split(/\s/).filter((e=>""!==e))));for(const e in t)t[e]&&!(null===(r=this.st)||void 0===r?void 0:r.has(e))&&this.nt.add(e);return this.render(t)}const o=e.element.classList;this.nt.forEach((e=>{e in t||(o.remove(e),this.nt.delete(e))}));for(const e in t){const r=!!t[e];r===this.nt.has(e)||(null===(s=this.st)||void 0===s?void 0:s.has(e))||(r?(o.add(e),this.nt.add(e)):(o.remove(e),this.nt.delete(e)))}return a.x}})},4370:(e,t,r)=>{r.d(t,{e:()=>a,i:()=>o,t:()=>s});var s={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},a=e=>(...t)=>({_$litDirective$:e,values:t}),o=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}},4775:(e,t,r)=>{var s=r(6281),a=r(5954),o=a.i`
  ${s.N}

  :host {
    --border-color: var(--sl-color-neutral-200);
    --border-radius: var(--sl-border-radius-medium);
    --border-width: 1px;
    --padding: var(--sl-spacing-large);

    display: inline-block;
  }

  .card {
    display: flex;
    flex-direction: column;
    background-color: var(--sl-panel-background-color);
    box-shadow: var(--sl-shadow-x-small);
    border: solid var(--border-width) var(--border-color);
    border-radius: var(--border-radius);
  }

  .card__image {
    display: flex;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    margin: calc(-1 * var(--border-width));
    overflow: hidden;
  }

  .card__image::slotted(img) {
    display: block;
    width: 100%;
  }

  .card:not(.card--has-image) .card__image {
    display: none;
  }

  .card__header {
    display: block;
    border-bottom: solid var(--border-width) var(--border-color);
    padding: calc(var(--padding) / 2) var(--padding);
  }

  .card:not(.card--has-header) .card__header {
    display: none;
  }

  .card:not(.card--has-image) .card__header {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  .card__body {
    display: block;
    padding: var(--padding);
  }

  .card--has-footer .card__footer {
    display: block;
    border-top: solid var(--border-width) var(--border-color);
    padding: var(--padding);
  }

  .card:not(.card--has-footer) .card__footer {
    display: none;
  }
`,d=r(3515),i=r(5381),n=r(8424),l=r(453),h=class extends n.P{constructor(){super(...arguments),this.hasSlotController=new d.r(this,"footer","header","image")}render(){return a.y`
      <div
        part="base"
        class=${(0,i.o)({card:!0,"card--has-footer":this.hasSlotController.test("footer"),"card--has-image":this.hasSlotController.test("image"),"card--has-header":this.hasSlotController.test("header")})}
      >
        <slot name="image" part="image" class="card__image"></slot>
        <slot name="header" part="header" class="card__header"></slot>
        <slot part="body" class="card__body"></slot>
        <slot name="footer" part="footer" class="card__footer"></slot>
      </div>
    `}};h.styles=o,h=(0,l.u2)([(0,n.e)("sl-card")],h),r(4370)}}]);
//# sourceMappingURL=sl-card.ac1679bb.js.map