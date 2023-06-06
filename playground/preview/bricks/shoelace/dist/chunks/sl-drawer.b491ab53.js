/*! For license information please see sl-drawer.b491ab53.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[302],{1177:(e,t,a)=>{a.r(t),a(8878),a(5517)},5517:(e,t,a)=>{a(2969),a(3467);var n=a(4124);function i(e){document.documentElement.classList["dark"===e||"dark-v2"===e?"add":"remove"]("sl-theme-dark")}a(1744),(0,n.t)(a.p),i(document.documentElement.dataset.theme),window.addEventListener("theme.change",(e=>{i(e.detail)}))},738:(e,t,a)=>{a.d(t,{Z:()=>r});var n=a(9601),i=a.n(n),o=a(2609),s=a.n(o)()(i());s.push([e.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const r=s},1744:(e,t,a)=>{var n=a(6062),i=a.n(n),o=a(4036),s=a.n(o),r=a(6793),l=a.n(r),d=a(7892),h=a.n(d),c=a(1173),u=a.n(c),p=a(2464),f=a.n(p),m=a(738),y={};y.styleTagTransform=f(),y.setAttributes=h(),y.insert=l().bind(null,"head"),y.domAPI=s(),y.insertStyleElement=u(),i()(m.Z,y),m.Z&&m.Z.locals&&m.Z.locals},3515:(e,t,a)=>{a.d(t,{F:()=>i,r:()=>n});var n=class{constructor(e,...t){this.slotNames=[],(this.host=e).addController(this),this.slotNames=t,this.handleSlotChange=this.handleSlotChange.bind(this)}hasDefaultSlot(){return[...this.host.childNodes].some((e=>{if(e.nodeType===e.TEXT_NODE&&""!==e.textContent.trim())return!0;if(e.nodeType===e.ELEMENT_NODE){const t=e;if("sl-visually-hidden"===t.tagName.toLowerCase())return!1;if(!t.hasAttribute("slot"))return!0}return!1}))}hasNamedSlot(e){return null!==this.host.querySelector(`:scope > [slot="${e}"]`)}test(e){return"[default]"===e?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}handleSlotChange(e){const t=e.target;(this.slotNames.includes("[default]")&&!t.name||t.name&&this.slotNames.includes(t.name))&&this.host.requestUpdate()}};function i(e){if(!e)return"";const t=e.assignedNodes({flatten:!0});let a="";return[...t].forEach((e=>{e.nodeType===Node.TEXT_NODE&&(a+=e.textContent)})),a}},9745:(e,t,a)=>{a.d(t,{GH:()=>l,RA:()=>o,U_:()=>r,nk:()=>s,nv:()=>i});var n=a(453);function i(e,t,a){return new Promise((i=>{if((null==a?void 0:a.duration)===1/0)throw new Error("Promise-based animations must be finite.");const o=e.animate(t,(0,n.EZ)((0,n.ih)({},a),{duration:s()?0:a.duration}));o.addEventListener("cancel",i,{once:!0}),o.addEventListener("finish",i,{once:!0})}))}function o(e){return(e=e.toString().toLowerCase()).indexOf("ms")>-1?parseFloat(e):e.indexOf("s")>-1?1e3*parseFloat(e):parseFloat(e)}function s(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function r(e){return Promise.all(e.getAnimations().map((e=>new Promise((t=>{const a=requestAnimationFrame(t);e.addEventListener("cancel",(()=>a),{once:!0}),e.addEventListener("finish",(()=>a),{once:!0}),e.cancel()})))))}function l(e,t){return e.map((e=>(0,n.EZ)((0,n.ih)({},e),{height:"auto"===e.height?`${t}px`:e.height})))}},4867:(e,t,a)=>{function n(e,t){return new Promise((a=>{e.addEventListener(t,(function n(i){i.target===e&&(e.removeEventListener(t,n),a())}))}))}a.d(t,{m:()=>n})},6281:(e,t,a)=>{a.d(t,{N:()=>n});var n=a(5954).i`
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
`},1199:(e,t,a)=>{function n(e){const t=e.tagName.toLowerCase();return"-1"!==e.getAttribute("tabindex")&&!e.hasAttribute("disabled")&&(!e.hasAttribute("aria-disabled")||"false"===e.getAttribute("aria-disabled"))&&!("input"===t&&"radio"===e.getAttribute("type")&&!e.hasAttribute("checked"))&&null!==e.offsetParent&&"hidden"!==window.getComputedStyle(e).visibility&&(!("audio"!==t&&"video"!==t||!e.hasAttribute("controls"))||!!e.hasAttribute("tabindex")||!(!e.hasAttribute("contenteditable")||"false"===e.getAttribute("contenteditable"))||["button","input","select","textarea","a","audio","video","summary"].includes(t))}function i(e){var t,a;const i=[];return function e(t){t instanceof HTMLElement&&(i.push(t),null!==t.shadowRoot&&"open"===t.shadowRoot.mode&&e(t.shadowRoot)),[...t.children].forEach((t=>e(t)))}(e),{start:null!=(t=i.find((e=>n(e))))?t:null,end:null!=(a=i.reverse().find((e=>n(e))))?a:null}}a.d(t,{C:()=>i})},2486:(e,t,a)=>{a.d(t,{O8:()=>r,jx:()=>s}),a(453);var n=new Map,i=new WeakMap;function o(e,t){return"rtl"===t.toLowerCase()?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function s(e,t){n.set(e,function(e){return null!=e?e:{keyframes:[],options:{duration:0}}}(t))}function r(e,t,a){const s=i.get(e);if(null==s?void 0:s[t])return o(s[t],a.dir);const r=n.get(t);return r?o(r,a.dir):{keyframes:[],options:{duration:0}}}},5381:(e,t,a)=>{a.d(t,{o:()=>o});var n=a(4370),i=a(5954),o=(0,n.e)(class extends n.i{constructor(e){var t;if(super(e),e.type!==n.t.ATTRIBUTE||"class"!==e.name||(null===(t=e.strings)||void 0===t?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){var a,n;if(void 0===this.nt){this.nt=new Set,void 0!==e.strings&&(this.st=new Set(e.strings.join(" ").split(/\s/).filter((e=>""!==e))));for(const e in t)t[e]&&!(null===(a=this.st)||void 0===a?void 0:a.has(e))&&this.nt.add(e);return this.render(t)}const o=e.element.classList;this.nt.forEach((e=>{e in t||(o.remove(e),this.nt.delete(e))}));for(const e in t){const a=!!t[e];a===this.nt.has(e)||(null===(n=this.st)||void 0===n?void 0:n.has(e))||(a?(o.add(e),this.nt.add(e)):(o.remove(e),this.nt.delete(e)))}return i.x}})},9622:(e,t,a)=>{a.d(t,{M4:()=>i,gG:()=>o,zT:()=>s});var n=new Set;function i(e){if(n.add(e),!document.body.classList.contains("sl-scroll-lock")){const e=function(){const e=document.documentElement.clientWidth;return Math.abs(window.innerWidth-e)}();document.body.classList.add("sl-scroll-lock"),document.body.style.setProperty("--sl-scroll-lock-size",`${e}px`)}}function o(e){n.delete(e),0===n.size&&(document.body.classList.remove("sl-scroll-lock"),document.body.style.removeProperty("--sl-scroll-lock-size"))}function s(e,t,a="vertical",n="smooth"){const i=function(e,t){return{top:Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(e.getBoundingClientRect().left-t.getBoundingClientRect().left)}}(e,t),o=i.top+t.scrollTop,s=i.left+t.scrollLeft,r=t.scrollLeft,l=t.scrollLeft+t.offsetWidth,d=t.scrollTop,h=t.scrollTop+t.offsetHeight;"horizontal"!==a&&"both"!==a||(s<r?t.scrollTo({left:s,behavior:n}):s+e.clientWidth>l&&t.scrollTo({left:s-t.offsetWidth+e.clientWidth,behavior:n})),"vertical"!==a&&"both"!==a||(o<d?t.scrollTo({top:o,behavior:n}):o+e.clientHeight>h&&t.scrollTo({top:o-t.offsetHeight+e.clientHeight,behavior:n}))}},4370:(e,t,a)=>{a.d(t,{e:()=>i,i:()=>o,t:()=>n});var n={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},i=e=>(...t)=>({_$litDirective$:e,values:t}),o=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,a){this._$Ct=e,this._$AM=t,this._$Ci=a}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}},3897:(e,t,a)=>{a.d(t,{u:()=>o});var n=a(1199),i=[],o=class{constructor(e){this.tabDirection="forward",this.element=e,this.handleFocusIn=this.handleFocusIn.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleKeyUp=this.handleKeyUp.bind(this)}activate(){i.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){i=i.filter((e=>e!==this.element)),document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return i[i.length-1]===this.element}checkFocus(){if(this.isActive()&&!this.element.matches(":focus-within")){const{start:e,end:t}=(0,n.C)(this.element),a="forward"===this.tabDirection?e:t;"function"==typeof(null==a?void 0:a.focus)&&a.focus({preventScroll:!0})}}handleFocusIn(){this.checkFocus()}handleKeyDown(e){"Tab"===e.key&&e.shiftKey&&(this.tabDirection="backward",requestAnimationFrame((()=>this.checkFocus())))}handleKeyUp(){this.tabDirection="forward"}}},8878:(e,t,a)=>{var n=a(3897),i=a(9622),o=a(6281),s=a(5954),r=s.i`
  ${o.N}

  :host {
    --size: 25rem;
    --header-spacing: var(--sl-spacing-large);
    --body-spacing: var(--sl-spacing-large);
    --footer-spacing: var(--sl-spacing-large);

    display: contents;
  }

  .drawer {
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }

  .drawer--contained {
    position: absolute;
    z-index: initial;
  }

  .drawer--fixed {
    position: fixed;
    z-index: var(--sl-z-index-drawer);
  }

  .drawer__panel {
    position: absolute;
    display: flex;
    flex-direction: column;
    z-index: 2;
    max-width: 100%;
    max-height: 100%;
    background-color: var(--sl-panel-background-color);
    box-shadow: var(--sl-shadow-x-large);
    overflow: auto;
    pointer-events: all;
  }

  .drawer__panel:focus {
    outline: none;
  }

  .drawer--top .drawer__panel {
    top: 0;
    inset-inline-end: auto;
    bottom: auto;
    inset-inline-start: 0;
    width: 100%;
    height: var(--size);
  }

  .drawer--end .drawer__panel {
    top: 0;
    inset-inline-end: 0;
    bottom: auto;
    inset-inline-start: auto;
    width: var(--size);
    height: 100%;
  }

  .drawer--bottom .drawer__panel {
    top: auto;
    inset-inline-end: auto;
    bottom: 0;
    inset-inline-start: 0;
    width: 100%;
    height: var(--size);
  }

  .drawer--start .drawer__panel {
    top: 0;
    inset-inline-end: auto;
    bottom: auto;
    inset-inline-start: 0;
    width: var(--size);
    height: 100%;
  }

  .drawer__header {
    display: flex;
  }

  .drawer__title {
    flex: 1 1 auto;
    font: inherit;
    font-size: var(--sl-font-size-large);
    line-height: var(--sl-line-height-dense);
    padding: var(--header-spacing);
    margin: 0;
  }

  .drawer__header-actions {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--sl-spacing-2x-small);
    padding: 0 var(--header-spacing);
  }

  .drawer__header-actions sl-icon-button,
  .drawer__header-actions ::slotted(sl-icon-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-medium);
  }

  .drawer__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .drawer__footer {
    text-align: right;
    padding: var(--footer-spacing);
  }

  .drawer__footer ::slotted(sl-button:not(:last-of-type)) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .drawer:not(.drawer--has-footer) .drawer__footer {
    display: none;
  }

  .drawer__overlay {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--sl-overlay-background-color);
    pointer-events: all;
  }

  .drawer--contained .drawer__overlay {
    display: none;
  }

  @media (forced-colors: active) {
    .drawer__panel {
      border: solid 1px var(--sl-color-neutral-0);
    }
  }
`,l=a(2486),d=a(4867),h=a(9745),c=a(8734),u=a(3515),p=a(8379),f=a(5710),m=a(5381),y=a(8424),w=a(453);function v(e){return e.charAt(0).toUpperCase()+e.slice(1)}var b=class extends y.P{constructor(){super(...arguments),this.hasSlotController=new u.r(this,"footer"),this.localize=new p.V(this),this.open=!1,this.label="",this.placement="end",this.contained=!1,this.noHeader=!1}connectedCallback(){super.connectedCallback(),this.handleDocumentKeyDown=this.handleDocumentKeyDown.bind(this),this.modal=new n.u(this)}firstUpdated(){this.drawer.hidden=!this.open,this.open&&(this.addOpenListeners(),this.contained||(this.modal.activate(),(0,i.M4)(this)))}disconnectedCallback(){super.disconnectedCallback(),(0,i.gG)(this)}requestClose(e){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:e}}).defaultPrevented){const e=(0,l.O8)(this,"drawer.denyClose",{dir:this.localize.dir()});(0,h.nv)(this.panel,e.keyframes,e.options)}else this.hide()}addOpenListeners(){document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){document.removeEventListener("keydown",this.handleDocumentKeyDown)}handleDocumentKeyDown(e){this.open&&!this.contained&&"Escape"===e.key&&(e.stopPropagation(),this.requestClose("keyboard"))}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),(0,i.M4)(this));const e=this.querySelector("[autofocus]");e&&e.removeAttribute("autofocus"),await Promise.all([(0,h.U_)(this.drawer),(0,h.U_)(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame((()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute("autofocus","")}));const t=(0,l.O8)(this,`drawer.show${v(this.placement)}`,{dir:this.localize.dir()}),a=(0,l.O8)(this,"drawer.overlay.show",{dir:this.localize.dir()});await Promise.all([(0,h.nv)(this.panel,t.keyframes,t.options),(0,h.nv)(this.overlay,a.keyframes,a.options)]),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),this.contained||(this.modal.deactivate(),(0,i.gG)(this)),await Promise.all([(0,h.U_)(this.drawer),(0,h.U_)(this.overlay)]);const e=(0,l.O8)(this,`drawer.hide${v(this.placement)}`,{dir:this.localize.dir()}),t=(0,l.O8)(this,"drawer.overlay.hide",{dir:this.localize.dir()});await Promise.all([(0,h.nv)(this.overlay,t.keyframes,t.options).then((()=>{this.overlay.hidden=!0})),(0,h.nv)(this.panel,e.keyframes,e.options).then((()=>{this.panel.hidden=!0}))]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;const a=this.originalTrigger;"function"==typeof(null==a?void 0:a.focus)&&setTimeout((()=>a.focus())),this.emit("sl-after-hide")}}handleNoModalChange(){this.open&&!this.contained&&(this.modal.activate(),(0,i.M4)(this)),this.open&&this.contained&&(this.modal.deactivate(),(0,i.gG)(this))}async show(){if(!this.open)return this.open=!0,(0,d.m)(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,(0,d.m)(this,"sl-after-hide")}render(){return s.y`
      <div
        part="base"
        class=${(0,m.o)({drawer:!0,"drawer--open":this.open,"drawer--top":"top"===this.placement,"drawer--end":"end"===this.placement,"drawer--bottom":"bottom"===this.placement,"drawer--start":"start"===this.placement,"drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":"rtl"===this.localize.dir(),"drawer--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="drawer__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${(0,c.l)(this.noHeader?this.label:void 0)}
          aria-labelledby=${(0,c.l)(this.noHeader?void 0:"title")}
          tabindex="0"
        >
          ${this.noHeader?"":s.y`
                <header part="header" class="drawer__header">
                  <h2 part="title" class="drawer__title" id="title">
                    <!-- If there's no label, use an invisible character to prevent the header from collapsing -->
                    <slot name="label"> ${this.label.length>0?this.label:String.fromCharCode(65279)} </slot>
                  </h2>
                  <div part="header-actions" class="drawer__header-actions">
                    <slot name="header-actions"></slot>
                    <sl-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="drawer__close"
                      name="x-lg"
                      label=${this.localize.term("close")}
                      library="system"
                      @click=${()=>this.requestClose("close-button")}
                    ></sl-icon-button>
                  </div>
                </header>
              `}

          <slot part="body" class="drawer__body"></slot>

          <footer part="footer" class="drawer__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `}};b.styles=r,(0,w.u2)([(0,y.i)(".drawer")],b.prototype,"drawer",2),(0,w.u2)([(0,y.i)(".drawer__panel")],b.prototype,"panel",2),(0,w.u2)([(0,y.i)(".drawer__overlay")],b.prototype,"overlay",2),(0,w.u2)([(0,y.e2)({type:Boolean,reflect:!0})],b.prototype,"open",2),(0,w.u2)([(0,y.e2)({reflect:!0})],b.prototype,"label",2),(0,w.u2)([(0,y.e2)({reflect:!0})],b.prototype,"placement",2),(0,w.u2)([(0,y.e2)({type:Boolean,reflect:!0})],b.prototype,"contained",2),(0,w.u2)([(0,y.e2)({attribute:"no-header",type:Boolean,reflect:!0})],b.prototype,"noHeader",2),(0,w.u2)([(0,f.Y)("open",{waitUntilFirstUpdate:!0})],b.prototype,"handleOpenChange",1),(0,w.u2)([(0,f.Y)("contained",{waitUntilFirstUpdate:!0})],b.prototype,"handleNoModalChange",1),b=(0,w.u2)([(0,y.e)("sl-drawer")],b),(0,l.jx)("drawer.showTop",{keyframes:[{opacity:0,translate:"0 -100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),(0,l.jx)("drawer.hideTop",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 -100%"}],options:{duration:250,easing:"ease"}}),(0,l.jx)("drawer.showEnd",{keyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),(0,l.jx)("drawer.hideEnd",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],options:{duration:250,easing:"ease"}}),(0,l.jx)("drawer.showBottom",{keyframes:[{opacity:0,translate:"0 100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),(0,l.jx)("drawer.hideBottom",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 100%"}],options:{duration:250,easing:"ease"}}),(0,l.jx)("drawer.showStart",{keyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),(0,l.jx)("drawer.hideStart",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],options:{duration:250,easing:"ease"}}),(0,l.jx)("drawer.denyClose",{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}}),(0,l.jx)("drawer.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),(0,l.jx)("drawer.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),a(3149),a(4073),a(3251),a(1862),a(9940),a(9191),a(836),a(2759),a(1939),a(4370)}}]);
//# sourceMappingURL=sl-drawer.b491ab53.js.map