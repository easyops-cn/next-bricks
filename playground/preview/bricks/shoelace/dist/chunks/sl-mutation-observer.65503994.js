"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[4902],{658:(t,e,a)=>{a.r(e),a(7401),a(5517)},5517:(t,e,a)=>{a(2969),a(3467);var s=a(4124);function i(t){document.documentElement.classList["dark"===t||"dark-v2"===t?"add":"remove"]("sl-theme-dark")}a(1744),(0,s.t)(a.p),i(document.documentElement.dataset.theme),window.addEventListener("theme.change",(t=>{i(t.detail)}))},738:(t,e,a)=>{a.d(e,{Z:()=>n});var s=a(9601),i=a.n(s),r=a(2609),l=a.n(r)()(i());l.push([t.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const n=l},1744:(t,e,a)=>{var s=a(6062),i=a.n(s),r=a(4036),l=a.n(r),n=a(6793),o=a.n(n),d=a(7892),h=a.n(d),c=a(1173),u=a.n(c),p=a(2464),b=a.n(p),v=a(738),y={};y.styleTagTransform=b(),y.setAttributes=h(),y.insert=o().bind(null,"head"),y.domAPI=l(),y.insertStyleElement=u(),i()(v.Z,y),v.Z&&v.Z.locals&&v.Z.locals},6281:(t,e,a)=>{a.d(e,{N:()=>s});var s=a(5954).i`
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
`},5710:(t,e,a)=>{a.d(e,{Y:()=>i});var s=a(453);function i(t,e){const a=(0,s.ih)({waitUntilFirstUpdate:!1},e);return(e,s)=>{const{update:i}=e,r=Array.isArray(t)?t:[t];e.update=function(t){r.forEach((e=>{const i=e;if(t.has(i)){const e=t.get(i),r=this[i];e!==r&&(a.waitUntilFirstUpdate&&!this.hasUpdated||this[s](e,r))}})),i.call(this,t)}}}},7401:(t,e,a)=>{var s=a(6281),i=a(5954),r=i.i`
  ${s.N}

  :host {
    display: contents;
  }
`,l=a(5710),n=a(8424),o=a(453),d=class extends n.P{constructor(){super(...arguments),this.attrOldValue=!1,this.charData=!1,this.charDataOldValue=!1,this.childList=!1,this.disabled=!1}connectedCallback(){super.connectedCallback(),this.handleMutation=this.handleMutation.bind(this),this.mutationObserver=new MutationObserver(this.handleMutation),this.disabled||this.startObserver()}disconnectedCallback(){this.stopObserver()}handleMutation(t){this.emit("sl-mutation",{detail:{mutationList:t}})}startObserver(){const t="string"==typeof this.attr&&this.attr.length>0,e=t&&"*"!==this.attr?this.attr.split(" "):void 0;try{this.mutationObserver.observe(this,{subtree:!0,childList:this.childList,attributes:t,attributeFilter:e,attributeOldValue:this.attrOldValue,characterData:this.charData,characterDataOldValue:this.charDataOldValue})}catch(t){}}stopObserver(){this.mutationObserver.disconnect()}handleDisabledChange(){this.disabled?this.stopObserver():this.startObserver()}handleChange(){this.stopObserver(),this.startObserver()}render(){return i.y` <slot></slot> `}};d.styles=r,(0,o.u2)([(0,n.e2)({reflect:!0})],d.prototype,"attr",2),(0,o.u2)([(0,n.e2)({attribute:"attr-old-value",type:Boolean,reflect:!0})],d.prototype,"attrOldValue",2),(0,o.u2)([(0,n.e2)({attribute:"char-data",type:Boolean,reflect:!0})],d.prototype,"charData",2),(0,o.u2)([(0,n.e2)({attribute:"char-data-old-value",type:Boolean,reflect:!0})],d.prototype,"charDataOldValue",2),(0,o.u2)([(0,n.e2)({attribute:"child-list",type:Boolean,reflect:!0})],d.prototype,"childList",2),(0,o.u2)([(0,n.e2)({type:Boolean,reflect:!0})],d.prototype,"disabled",2),(0,o.u2)([(0,l.Y)("disabled")],d.prototype,"handleDisabledChange",1),(0,o.u2)([(0,l.Y)("attr",{waitUntilFirstUpdate:!0}),(0,l.Y)("attr-old-value",{waitUntilFirstUpdate:!0}),(0,l.Y)("char-data",{waitUntilFirstUpdate:!0}),(0,l.Y)("char-data-old-value",{waitUntilFirstUpdate:!0}),(0,l.Y)("childList",{waitUntilFirstUpdate:!0})],d.prototype,"handleChange",1),d=(0,o.u2)([(0,n.e)("sl-mutation-observer")],d)}}]);
//# sourceMappingURL=sl-mutation-observer.65503994.js.map