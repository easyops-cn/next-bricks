/*! For license information please see sl-tag.542be806.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[400],{265:(r,t,e)=>{e.r(t),e(1025),e(5517)},5517:(r,t,e)=>{e(2969),e(3467);var a=e(4124);function s(r){document.documentElement.classList["dark"===r||"dark-v2"===r?"add":"remove"]("sl-theme-dark")}e(1744),(0,a.t)(e.p),s(document.documentElement.dataset.theme),window.addEventListener("theme.change",(r=>{s(r.detail)}))},738:(r,t,e)=>{e.d(t,{Z:()=>o});var a=e(9601),s=e.n(a),i=e(2609),l=e.n(i)()(s());l.push([r.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const o=l},1744:(r,t,e)=>{var a=e(6062),s=e.n(a),i=e(4036),l=e.n(i),o=e(6793),n=e.n(o),c=e(7892),d=e.n(c),u=e(1173),h=e.n(u),g=e(2464),v=e.n(g),m=e(738),p={};p.styleTagTransform=v(),p.setAttributes=d(),p.insert=n().bind(null,"head"),p.domAPI=l(),p.insertStyleElement=h(),s()(m.Z,p),m.Z&&m.Z.locals&&m.Z.locals},8595:(r,t,e)=>{e.d(t,{l:()=>s});var a=e(6281),s=e(5954).i`
  ${a.N}

  :host {
    display: inline-block;
  }

  .tag {
    display: flex;
    align-items: center;
    border: solid 1px;
    line-height: 1;
    white-space: nowrap;
    user-select: none;
  }

  .tag__remove::part(base) {
    color: inherit;
    padding: 0;
  }

  /*
   * Variant modifiers
   */

  .tag--primary {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-200);
    color: var(--sl-color-primary-800);
  }

  .tag--primary:active > sl-icon-button {
    color: var(--sl-color-primary-600);
  }

  .tag--success {
    background-color: var(--sl-color-success-50);
    border-color: var(--sl-color-success-200);
    color: var(--sl-color-success-800);
  }

  .tag--success:active > sl-icon-button {
    color: var(--sl-color-success-600);
  }

  .tag--neutral {
    background-color: var(--sl-color-neutral-50);
    border-color: var(--sl-color-neutral-200);
    color: var(--sl-color-neutral-800);
  }

  .tag--neutral:active > sl-icon-button {
    color: var(--sl-color-neutral-600);
  }

  .tag--warning {
    background-color: var(--sl-color-warning-50);
    border-color: var(--sl-color-warning-200);
    color: var(--sl-color-warning-800);
  }

  .tag--warning:active > sl-icon-button {
    color: var(--sl-color-warning-600);
  }

  .tag--danger {
    background-color: var(--sl-color-danger-50);
    border-color: var(--sl-color-danger-200);
    color: var(--sl-color-danger-800);
  }

  .tag--danger:active > sl-icon-button {
    color: var(--sl-color-danger-600);
  }

  /*
   * Size modifiers
   */

  .tag--small {
    font-size: var(--sl-button-font-size-small);
    height: calc(var(--sl-input-height-small) * 0.8);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
    padding: 0 var(--sl-spacing-x-small);
  }

  .tag--medium {
    font-size: var(--sl-button-font-size-medium);
    height: calc(var(--sl-input-height-medium) * 0.8);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
    padding: 0 var(--sl-spacing-small);
  }

  .tag--large {
    font-size: var(--sl-button-font-size-large);
    height: calc(var(--sl-input-height-large) * 0.8);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
    padding: 0 var(--sl-spacing-medium);
  }

  .tag__remove {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  /*
   * Pill modifier
   */

  .tag--pill {
    border-radius: var(--sl-border-radius-pill);
  }
`},6281:(r,t,e)=>{e.d(t,{N:()=>a});var a=e(5954).i`
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
`},5013:(r,t,e)=>{var a=e(8595),s=e(8379),i=e(5381),l=e(8424),o=e(5954),n=e(453),c=class extends l.P{constructor(){super(...arguments),this.localize=new s.V(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return o.y`
      <span
        part="base"
        class=${(0,i.o)({tag:!0,"tag--primary":"primary"===this.variant,"tag--success":"success"===this.variant,"tag--neutral":"neutral"===this.variant,"tag--warning":"warning"===this.variant,"tag--danger":"danger"===this.variant,"tag--text":"text"===this.variant,"tag--small":"small"===this.size,"tag--medium":"medium"===this.size,"tag--large":"large"===this.size,"tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?o.y`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("remove")}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></sl-icon-button>
            `:""}
      </span>
    `}};c.styles=a.l,(0,n.u2)([(0,l.e2)({reflect:!0})],c.prototype,"variant",2),(0,n.u2)([(0,l.e2)({reflect:!0})],c.prototype,"size",2),(0,n.u2)([(0,l.e2)({type:Boolean,reflect:!0})],c.prototype,"pill",2),(0,n.u2)([(0,l.e2)({type:Boolean})],c.prototype,"removable",2),c=(0,n.u2)([(0,l.e)("sl-tag")],c)},5381:(r,t,e)=>{e.d(t,{o:()=>i});var a=e(4370),s=e(5954),i=(0,a.e)(class extends a.i{constructor(r){var t;if(super(r),r.type!==a.t.ATTRIBUTE||"class"!==r.name||(null===(t=r.strings)||void 0===t?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(r){return" "+Object.keys(r).filter((t=>r[t])).join(" ")+" "}update(r,[t]){var e,a;if(void 0===this.nt){this.nt=new Set,void 0!==r.strings&&(this.st=new Set(r.strings.join(" ").split(/\s/).filter((r=>""!==r))));for(const r in t)t[r]&&!(null===(e=this.st)||void 0===e?void 0:e.has(r))&&this.nt.add(r);return this.render(t)}const i=r.element.classList;this.nt.forEach((r=>{r in t||(i.remove(r),this.nt.delete(r))}));for(const r in t){const e=!!t[r];e===this.nt.has(r)||(null===(a=this.st)||void 0===a?void 0:a.has(r))||(e?(i.add(r),this.nt.add(r)):(i.remove(r),this.nt.delete(r)))}return s.x}})},4370:(r,t,e)=>{e.d(t,{e:()=>s,i:()=>i,t:()=>a});var a={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},s=r=>(...t)=>({_$litDirective$:r,values:t}),i=class{constructor(r){}get _$AU(){return this._$AM._$AU}_$AT(r,t,e){this._$Ct=r,this._$AM=t,this._$Ci=e}_$AS(r,t){return this.update(r,t)}update(r,t){return this.render(...t)}}},1025:(r,t,e)=>{e(5013),e(8595),e(3149),e(4073),e(3251),e(8734),e(8379),e(1862),e(9940),e(9191),e(836),e(2759),e(1939),e(5710),e(5381),e(4370),e(8424),e(6281),e(5954),e(453)}}]);
//# sourceMappingURL=sl-tag.542be806.js.map