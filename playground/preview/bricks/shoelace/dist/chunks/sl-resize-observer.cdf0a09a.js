"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[4992],{7561:(e,s,t)=>{t.r(s),t(9092),t(5517)},5517:(e,s,t)=>{t(2969),t(3467);var r=t(4124);function n(e){document.documentElement.classList["dark"===e||"dark-v2"===e?"add":"remove"]("sl-theme-dark")}t(1744),(0,r.t)(t.p),n(document.documentElement.dataset.theme),window.addEventListener("theme.change",(e=>{n(e.detail)}))},738:(e,s,t)=>{t.d(s,{Z:()=>o});var r=t(9601),n=t.n(r),i=t(2609),a=t.n(i)()(n());a.push([e.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const o=a},1744:(e,s,t)=>{var r=t(6062),n=t.n(r),i=t(4036),a=t.n(i),o=t(6793),d=t.n(o),l=t(7892),h=t.n(l),c=t(1173),b=t.n(c),u=t(2464),p=t.n(u),v=t(738),m={};m.styleTagTransform=p(),m.setAttributes=h(),m.insert=d().bind(null,"head"),m.domAPI=a(),m.insertStyleElement=b(),n()(v.Z,m),v.Z&&v.Z.locals&&v.Z.locals},6281:(e,s,t)=>{t.d(s,{N:()=>r});var r=t(5954).i`
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
`},5710:(e,s,t)=>{t.d(s,{Y:()=>n});var r=t(453);function n(e,s){const t=(0,r.ih)({waitUntilFirstUpdate:!1},s);return(s,r)=>{const{update:n}=s,i=Array.isArray(e)?e:[e];s.update=function(e){i.forEach((s=>{const n=s;if(e.has(n)){const s=e.get(n),i=this[n];s!==i&&(t.waitUntilFirstUpdate&&!this.hasUpdated||this[r](s,i))}})),n.call(this,e)}}}},9092:(e,s,t)=>{var r=t(6281),n=t(5954),i=n.i`
  ${r.N}

  :host {
    display: contents;
  }
`,a=t(5710),o=t(8424),d=t(453),l=class extends o.P{constructor(){super(...arguments),this.observedElements=[],this.disabled=!1}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver((e=>{this.emit("sl-resize",{detail:{entries:e}})})),this.disabled||this.startObserver()}disconnectedCallback(){super.disconnectedCallback(),this.stopObserver()}handleSlotChange(){this.disabled||this.startObserver()}startObserver(){const e=this.shadowRoot.querySelector("slot");if(null!==e){const s=e.assignedElements({flatten:!0});this.observedElements.forEach((e=>this.resizeObserver.unobserve(e))),this.observedElements=[],s.forEach((e=>{this.resizeObserver.observe(e),this.observedElements.push(e)}))}}stopObserver(){this.resizeObserver.disconnect()}handleDisabledChange(){this.disabled?this.stopObserver():this.startObserver()}render(){return n.y` <slot @slotchange=${this.handleSlotChange}></slot> `}};l.styles=i,(0,d.u2)([(0,o.e2)({type:Boolean,reflect:!0})],l.prototype,"disabled",2),(0,d.u2)([(0,a.Y)("disabled",{waitUntilFirstUpdate:!0})],l.prototype,"handleDisabledChange",1),l=(0,d.u2)([(0,o.e)("sl-resize-observer")],l)}}]);
//# sourceMappingURL=sl-resize-observer.cdf0a09a.js.map