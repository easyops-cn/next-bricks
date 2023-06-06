"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[7443],{402:(e,t,o)=>{o.r(t),o(828),o(5517)},5517:(e,t,o)=>{o(2969),o(3467);var i=o(4124);function s(e){document.documentElement.classList["dark"===e||"dark-v2"===e?"add":"remove"]("sl-theme-dark")}o(1744),(0,i.t)(o.p),s(document.documentElement.dataset.theme),window.addEventListener("theme.change",(e=>{s(e.detail)}))},738:(e,t,o)=>{o.d(t,{Z:()=>a});var i=o(9601),s=o.n(i),n=o(2609),r=o.n(n)()(s());r.push([e.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const a=r},1744:(e,t,o)=>{var i=o(6062),s=o.n(i),n=o(4036),r=o.n(n),a=o(6793),l=o.n(a),d=o(7892),h=o.n(d),p=o(1173),u=o.n(p),c=o(2464),m=o.n(c),g=o(738),v={};v.styleTagTransform=m(),v.setAttributes=h(),v.insert=l().bind(null,"head"),v.domAPI=r(),v.insertStyleElement=u(),s()(g.Z,v),g.Z&&g.Z.locals&&g.Z.locals},9745:(e,t,o)=>{o.d(t,{GH:()=>l,RA:()=>n,U_:()=>a,nk:()=>r,nv:()=>s});var i=o(453);function s(e,t,o){return new Promise((s=>{if((null==o?void 0:o.duration)===1/0)throw new Error("Promise-based animations must be finite.");const n=e.animate(t,(0,i.EZ)((0,i.ih)({},o),{duration:r()?0:o.duration}));n.addEventListener("cancel",s,{once:!0}),n.addEventListener("finish",s,{once:!0})}))}function n(e){return(e=e.toString().toLowerCase()).indexOf("ms")>-1?parseFloat(e):e.indexOf("s")>-1?1e3*parseFloat(e):parseFloat(e)}function r(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function a(e){return Promise.all(e.getAnimations().map((e=>new Promise((t=>{const o=requestAnimationFrame(t);e.addEventListener("cancel",(()=>o),{once:!0}),e.addEventListener("finish",(()=>o),{once:!0}),e.cancel()})))))}function l(e,t){return e.map((e=>(0,i.EZ)((0,i.ih)({},e),{height:"auto"===e.height?`${t}px`:e.height})))}},4867:(e,t,o)=>{function i(e,t){return new Promise((o=>{e.addEventListener(t,(function i(s){s.target===e&&(e.removeEventListener(t,i),o())}))}))}o.d(t,{m:()=>i})},1862:(e,t,o)=>{o.d(t,{P:()=>d,V:()=>p});var i,s=new Set,n=new MutationObserver(h),r=new Map,a=document.documentElement.dir||"ltr",l=document.documentElement.lang||navigator.language;function d(...e){e.map((e=>{const t=e.$code.toLowerCase();r.has(t)?r.set(t,Object.assign(Object.assign({},r.get(t)),e)):r.set(t,e),i||(i=e)})),h()}function h(){a=document.documentElement.dir||"ltr",l=document.documentElement.lang||navigator.language,[...s.keys()].map((e=>{"function"==typeof e.requestUpdate&&e.requestUpdate()}))}n.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]});var p=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){s.add(this.host)}hostDisconnected(){s.delete(this.host)}dir(){return`${this.host.dir||a}`.toLowerCase()}lang(){return`${this.host.lang||l}`.toLowerCase()}getTranslationData(e){var t,o;const i=new Intl.Locale(e),s=null==i?void 0:i.language.toLowerCase(),n=null!==(o=null===(t=null==i?void 0:i.region)||void 0===t?void 0:t.toLowerCase())&&void 0!==o?o:"";return{locale:i,language:s,region:n,primary:r.get(`${s}-${n}`),secondary:r.get(s)}}exists(e,t){var o;const{primary:s,secondary:n}=this.getTranslationData(null!==(o=t.lang)&&void 0!==o?o:this.lang());return t=Object.assign({includeFallback:!1},t),!!(s&&s[e]||n&&n[e]||t.includeFallback&&i&&i[e])}term(e,...t){const{primary:o,secondary:s}=this.getTranslationData(this.lang());let n;if(o&&o[e])n=o[e];else if(s&&s[e])n=s[e];else{if(!i||!i[e])return console.error(`No translation found for: ${String(e)}`),String(e);n=i[e]}return"function"==typeof n?n(...t):n}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(e,t)}}},8379:(e,t,o)=>{o.d(t,{V:()=>s});var i=o(1862),s=class extends i.V{};(0,i.P)({$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copy:"Copy",currentValue:"Current value",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>0===e?"No options selected":1===e?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"})},2486:(e,t,o)=>{o.d(t,{O8:()=>a,jx:()=>r}),o(453);var i=new Map,s=new WeakMap;function n(e,t){return"rtl"===t.toLowerCase()?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function r(e,t){i.set(e,function(e){return null!=e?e:{keyframes:[],options:{duration:0}}}(t))}function a(e,t,o){const r=s.get(e);if(null==r?void 0:r[t])return n(r[t],o.dir);const a=i.get(t);return a?n(a,o.dir):{keyframes:[],options:{duration:0}}}},5710:(e,t,o)=>{o.d(t,{Y:()=>s});var i=o(453);function s(e,t){const o=(0,i.ih)({waitUntilFirstUpdate:!1},t);return(t,i)=>{const{update:s}=t,n=Array.isArray(e)?e:[e];t.update=function(e){n.forEach((t=>{const s=t;if(e.has(s)){const t=e.get(s),n=this[s];t!==n&&(o.waitUntilFirstUpdate&&!this.hasUpdated||this[i](t,n))}})),s.call(this,e)}}}},828:(e,t,o)=>{var i=o(6281),s=o(5954),n=s.i`
  ${i.N}

  :host {
    --max-width: 20rem;
    --hide-delay: 0ms;
    --show-delay: 150ms;

    display: contents;
  }

  .tooltip {
    --arrow-size: var(--sl-tooltip-arrow-size);
    --arrow-color: var(--sl-tooltip-background-color);
  }

  .tooltip::part(popup) {
    pointer-events: none;
    z-index: var(--sl-z-index-tooltip);
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .tooltip__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--sl-tooltip-border-radius);
    background-color: var(--sl-tooltip-background-color);
    font-family: var(--sl-tooltip-font-family);
    font-size: var(--sl-tooltip-font-size);
    font-weight: var(--sl-tooltip-font-weight);
    line-height: var(--sl-tooltip-line-height);
    color: var(--sl-tooltip-color);
    padding: var(--sl-tooltip-padding);
    pointer-events: none;
  }
`,r=o(2486),a=o(4867),l=o(9745),d=o(8379),h=o(5710),p=o(5381),u=o(8424),c=o(453),m=class extends u.P{constructor(){super(...arguments),this.localize=new d.V(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1}connectedCallback(){super.connectedCallback(),this.handleBlur=this.handleBlur.bind(this),this.handleClick=this.handleClick.bind(this),this.handleFocus=this.handleFocus.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleMouseOver=this.handleMouseOver.bind(this),this.handleMouseOut=this.handleMouseOut.bind(this),this.updateComplete.then((()=>{this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("keydown",this.handleKeyDown),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}))}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("blur",this.handleBlur,!0),this.removeEventListener("focus",this.handleFocus,!0),this.removeEventListener("click",this.handleClick),this.removeEventListener("keydown",this.handleKeyDown),this.removeEventListener("mouseover",this.handleMouseOver),this.removeEventListener("mouseout",this.handleMouseOut)}handleBlur(){this.hasTrigger("focus")&&this.hide()}handleClick(){this.hasTrigger("click")&&(this.open?this.hide():this.show())}handleFocus(){this.hasTrigger("focus")&&this.show()}handleKeyDown(e){this.open&&"Escape"===e.key&&(e.stopPropagation(),this.hide())}handleMouseOver(){if(this.hasTrigger("hover")){const e=(0,l.RA)(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout((()=>this.show()),e)}}handleMouseOut(){if(this.hasTrigger("hover")){const e=(0,l.RA)(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout((()=>this.hide()),e)}}hasTrigger(e){return this.trigger.split(" ").includes(e)}async handleOpenChange(){if(this.open){if(this.disabled)return;this.emit("sl-show"),await(0,l.U_)(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:e,options:t}=(0,r.O8)(this,"tooltip.show",{dir:this.localize.dir()});await(0,l.nv)(this.popup.popup,e,t),this.emit("sl-after-show")}else{this.emit("sl-hide"),await(0,l.U_)(this.body);const{keyframes:e,options:t}=(0,r.O8)(this,"tooltip.hide",{dir:this.localize.dir()});await(0,l.nv)(this.popup.popup,e,t),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,(0,a.m)(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,(0,a.m)(this,"sl-after-hide")}render(){return s.y`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${(0,p.o)({tooltip:!0,"tooltip--open":this.open})}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        arrow
      >
        <slot slot="anchor" aria-describedby="tooltip"></slot>

        <slot
          name="content"
          part="body"
          id="tooltip"
          class="tooltip__body"
          role="tooltip"
          aria-live=${this.open?"polite":"off"}
        >
          ${this.content}
        </slot>
      </sl-popup>
    `}};m.styles=n,(0,c.u2)([(0,u.i)("slot:not([name])")],m.prototype,"defaultSlot",2),(0,c.u2)([(0,u.i)(".tooltip__body")],m.prototype,"body",2),(0,c.u2)([(0,u.i)("sl-popup")],m.prototype,"popup",2),(0,c.u2)([(0,u.e2)()],m.prototype,"content",2),(0,c.u2)([(0,u.e2)()],m.prototype,"placement",2),(0,c.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"disabled",2),(0,c.u2)([(0,u.e2)({type:Number})],m.prototype,"distance",2),(0,c.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"open",2),(0,c.u2)([(0,u.e2)({type:Number})],m.prototype,"skidding",2),(0,c.u2)([(0,u.e2)()],m.prototype,"trigger",2),(0,c.u2)([(0,u.e2)({type:Boolean})],m.prototype,"hoist",2),(0,c.u2)([(0,h.Y)("open",{waitUntilFirstUpdate:!0})],m.prototype,"handleOpenChange",1),(0,c.u2)([(0,h.Y)(["content","distance","hoist","placement","skidding"])],m.prototype,"handleOptionsChange",1),(0,c.u2)([(0,h.Y)("disabled")],m.prototype,"handleDisabledChange",1),m=(0,c.u2)([(0,u.e)("sl-tooltip")],m),(0,r.jx)("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),(0,r.jx)("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),o(6789),o(1732),o(1862),o(4370)}}]);
//# sourceMappingURL=sl-tooltip.f04ca5bb.js.map