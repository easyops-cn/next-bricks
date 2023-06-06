/*! For license information please see sl-badge.a1cdf8eb.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[2947],{944:(e,r,s)=>{s.r(r),s(9282),s(5517)},5517:(e,r,s)=>{s(2969),s(3467);var t=s(4124);function a(e){document.documentElement.classList["dark"===e||"dark-v2"===e?"add":"remove"]("sl-theme-dark")}s(1744),(0,t.t)(s.p),a(document.documentElement.dataset.theme),window.addEventListener("theme.change",(e=>{a(e.detail)}))},738:(e,r,s)=>{s.d(r,{Z:()=>n});var t=s(9601),a=s.n(t),l=s(2609),o=s.n(l)()(a());o.push([e.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const n=o},1744:(e,r,s)=>{var t=s(6062),a=s.n(t),l=s(4036),o=s.n(l),n=s(6793),i=s.n(n),d=s(7892),c=s.n(d),u=s(1173),p=s.n(u),h=s(2464),g=s.n(h),b=s(738),v={};v.styleTagTransform=g(),v.setAttributes=c(),v.insert=i().bind(null,"head"),v.domAPI=o(),v.insertStyleElement=p(),a()(b.Z,v),b.Z&&b.Z.locals&&b.Z.locals},6281:(e,r,s)=>{s.d(r,{N:()=>t});var t=s(5954).i`
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
`},5381:(e,r,s)=>{s.d(r,{o:()=>l});var t=s(4370),a=s(5954),l=(0,t.e)(class extends t.i{constructor(e){var r;if(super(e),e.type!==t.t.ATTRIBUTE||"class"!==e.name||(null===(r=e.strings)||void 0===r?void 0:r.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((r=>e[r])).join(" ")+" "}update(e,[r]){var s,t;if(void 0===this.nt){this.nt=new Set,void 0!==e.strings&&(this.st=new Set(e.strings.join(" ").split(/\s/).filter((e=>""!==e))));for(const e in r)r[e]&&!(null===(s=this.st)||void 0===s?void 0:s.has(e))&&this.nt.add(e);return this.render(r)}const l=e.element.classList;this.nt.forEach((e=>{e in r||(l.remove(e),this.nt.delete(e))}));for(const e in r){const s=!!r[e];s===this.nt.has(e)||(null===(t=this.st)||void 0===t?void 0:t.has(e))||(s?(l.add(e),this.nt.add(e)):(l.remove(e),this.nt.delete(e)))}return a.x}})},4370:(e,r,s)=>{s.d(r,{e:()=>a,i:()=>l,t:()=>t});var t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},a=e=>(...r)=>({_$litDirective$:e,values:r}),l=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,s){this._$Ct=e,this._$AM=r,this._$Ci=s}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}}},9282:(e,r,s)=>{var t=s(5381),a=s(8424),l=s(6281),o=s(5954),n=o.i`
  ${l.N}

  :host {
    display: inline-flex;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: max(12px, 0.75em);
    font-weight: var(--sl-font-weight-semibold);
    letter-spacing: var(--sl-letter-spacing-normal);
    line-height: 1;
    border-radius: var(--sl-border-radius-small);
    border: solid 1px var(--sl-color-neutral-0);
    white-space: nowrap;
    padding: 0.35em 0.6em;
    user-select: none;
    cursor: inherit;
  }

  /* Variant modifiers */
  .badge--primary {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--success {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--neutral {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--warning {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--danger {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /* Pill modifier */
  .badge--pill {
    border-radius: var(--sl-border-radius-pill);
  }

  /* Pulse modifier */
  .badge--pulse {
    animation: pulse 1.5s infinite;
  }

  .badge--pulse.badge--primary {
    --pulse-color: var(--sl-color-primary-600);
  }

  .badge--pulse.badge--success {
    --pulse-color: var(--sl-color-success-600);
  }

  .badge--pulse.badge--neutral {
    --pulse-color: var(--sl-color-neutral-600);
  }

  .badge--pulse.badge--warning {
    --pulse-color: var(--sl-color-warning-600);
  }

  .badge--pulse.badge--danger {
    --pulse-color: var(--sl-color-danger-600);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--pulse-color);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }
`,i=s(453),d=class extends a.P{constructor(){super(...arguments),this.variant="primary",this.pill=!1,this.pulse=!1}render(){return o.y`
      <slot
        part="base"
        class=${(0,t.o)({badge:!0,"badge--primary":"primary"===this.variant,"badge--success":"success"===this.variant,"badge--neutral":"neutral"===this.variant,"badge--warning":"warning"===this.variant,"badge--danger":"danger"===this.variant,"badge--pill":this.pill,"badge--pulse":this.pulse})}
        role="status"
      ></slot>
    `}};d.styles=n,(0,i.u2)([(0,a.e2)({reflect:!0})],d.prototype,"variant",2),(0,i.u2)([(0,a.e2)({type:Boolean,reflect:!0})],d.prototype,"pill",2),(0,i.u2)([(0,a.e2)({type:Boolean,reflect:!0})],d.prototype,"pulse",2),d=(0,i.u2)([(0,a.e)("sl-badge")],d),s(4370)}}]);
//# sourceMappingURL=sl-badge.a1cdf8eb.js.map