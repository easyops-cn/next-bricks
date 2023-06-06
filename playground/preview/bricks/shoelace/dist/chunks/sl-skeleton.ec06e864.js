/*! For license information please see sl-skeleton.ec06e864.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[269],{5666:(e,t,s)=>{s.r(t),s(3873),s(5517)},5517:(e,t,s)=>{s(2969),s(3467);var n=s(4124);function r(e){document.documentElement.classList["dark"===e||"dark-v2"===e?"add":"remove"]("sl-theme-dark")}s(1744),(0,n.t)(s.p),r(document.documentElement.dataset.theme),window.addEventListener("theme.change",(e=>{r(e.detail)}))},738:(e,t,s)=>{s.d(t,{Z:()=>a});var n=s(9601),r=s.n(n),o=s(2609),i=s.n(o)()(r());i.push([e.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const a=i},1744:(e,t,s)=>{var n=s(6062),r=s.n(n),o=s(4036),i=s.n(o),a=s(6793),l=s.n(a),d=s(7892),c=s.n(d),h=s(1173),u=s.n(h),v=s(2464),p=s.n(v),k=s(738),b={};b.styleTagTransform=p(),b.setAttributes=c(),b.insert=l().bind(null,"head"),b.domAPI=i(),b.insertStyleElement=u(),r()(k.Z,b),k.Z&&k.Z.locals&&k.Z.locals},6281:(e,t,s)=>{s.d(t,{N:()=>n});var n=s(5954).i`
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
`},5381:(e,t,s)=>{s.d(t,{o:()=>o});var n=s(4370),r=s(5954),o=(0,n.e)(class extends n.i{constructor(e){var t;if(super(e),e.type!==n.t.ATTRIBUTE||"class"!==e.name||(null===(t=e.strings)||void 0===t?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){var s,n;if(void 0===this.nt){this.nt=new Set,void 0!==e.strings&&(this.st=new Set(e.strings.join(" ").split(/\s/).filter((e=>""!==e))));for(const e in t)t[e]&&!(null===(s=this.st)||void 0===s?void 0:s.has(e))&&this.nt.add(e);return this.render(t)}const o=e.element.classList;this.nt.forEach((e=>{e in t||(o.remove(e),this.nt.delete(e))}));for(const e in t){const s=!!t[e];s===this.nt.has(e)||(null===(n=this.st)||void 0===n?void 0:n.has(e))||(s?(o.add(e),this.nt.add(e)):(o.remove(e),this.nt.delete(e)))}return r.x}})},4370:(e,t,s)=>{s.d(t,{e:()=>r,i:()=>o,t:()=>n});var n={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},r=e=>(...t)=>({_$litDirective$:e,values:t}),o=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}},3873:(e,t,s)=>{var n=s(6281),r=s(5954),o=r.i`
  ${n.N}

  :host {
    --border-radius: var(--sl-border-radius-pill);
    --color: var(--sl-color-neutral-200);
    --sheen-color: var(--sl-color-neutral-300);

    display: block;
    position: relative;
  }

  .skeleton {
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 1rem;
  }

  .skeleton__indicator {
    flex: 1 1 auto;
    background: var(--color);
    border-radius: var(--border-radius);
  }

  .skeleton--sheen .skeleton__indicator {
    background: linear-gradient(270deg, var(--sheen-color), var(--color), var(--color), var(--sheen-color));
    background-size: 400% 100%;
    background-size: 400% 100%;
    animation: sheen 8s ease-in-out infinite;
  }

  .skeleton--pulse .skeleton__indicator {
    animation: pulse 2s ease-in-out 0.5s infinite;
  }

  /* Forced colors mode */
  @media (forced-colors: active) {
    :host {
      --color: GrayText;
    }
  }

  @keyframes sheen {
    0% {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
`,i=s(5381),a=s(8424),l=s(453),d=class extends a.P{constructor(){super(...arguments),this.effect="none"}render(){return r.y`
      <div
        part="base"
        class=${(0,i.o)({skeleton:!0,"skeleton--pulse":"pulse"===this.effect,"skeleton--sheen":"sheen"===this.effect})}
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `}};d.styles=o,(0,l.u2)([(0,a.e2)()],d.prototype,"effect",2),d=(0,l.u2)([(0,a.e)("sl-skeleton")],d),s(4370)}}]);
//# sourceMappingURL=sl-skeleton.ec06e864.js.map