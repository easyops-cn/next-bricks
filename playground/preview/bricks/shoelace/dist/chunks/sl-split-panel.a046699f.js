/*! For license information please see sl-split-panel.a046699f.js.LICENSE.txt */
"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[3845],{7019:(e,t,i)=>{i.r(t),i(9399),i(5517)},5517:(e,t,i)=>{i(2969),i(3467);var o=i(4124);function s(e){document.documentElement.classList["dark"===e||"dark-v2"===e?"add":"remove"]("sl-theme-dark")}i(1744),(0,o.t)(i.p),s(document.documentElement.dataset.theme),window.addEventListener("theme.change",(e=>{s(e.detail)}))},738:(e,t,i)=>{i.d(t,{Z:()=>a});var o=i(9601),s=i.n(o),r=i(2609),n=i.n(r)()(s());n.push([e.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const a=n},1744:(e,t,i)=>{var o=i(6062),s=i.n(o),r=i(4036),n=i.n(r),a=i(6793),l=i.n(a),d=i(7892),h=i.n(d),c=i(1173),p=i.n(c),u=i(2464),v=i.n(u),m=i(738),g={};g.styleTagTransform=v(),g.setAttributes=h(),g.insert=l().bind(null,"head"),g.domAPI=n(),g.insertStyleElement=p(),s()(m.Z,g),m.Z&&m.Z.locals&&m.Z.locals},6200:(e,t,i)=>{function o(e,t){function i(i){const o=e.getBoundingClientRect(),s=e.ownerDocument.defaultView,r=o.left+s.pageXOffset,n=o.top+s.pageYOffset,a=i.pageX-r,l=i.pageY-n;(null==t?void 0:t.onMove)&&t.onMove(a,l)}document.addEventListener("pointermove",i,{passive:!0}),document.addEventListener("pointerup",(function e(){document.removeEventListener("pointermove",i),document.removeEventListener("pointerup",e),(null==t?void 0:t.onStop)&&t.onStop()})),(null==t?void 0:t.initialEvent)instanceof PointerEvent&&i(t.initialEvent)}i.d(t,{o:()=>o})},6281:(e,t,i)=>{i.d(t,{N:()=>o});var o=i(5954).i`
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
`},1807:(e,t,i)=>{function o(e,t,i){return o=e<t?t:e>i?i:e,Object.is(o,-0)?0:o;var o}i.d(t,{u:()=>o})},1862:(e,t,i)=>{i.d(t,{P:()=>d,V:()=>c});var o,s=new Set,r=new MutationObserver(h),n=new Map,a=document.documentElement.dir||"ltr",l=document.documentElement.lang||navigator.language;function d(...e){e.map((e=>{const t=e.$code.toLowerCase();n.has(t)?n.set(t,Object.assign(Object.assign({},n.get(t)),e)):n.set(t,e),o||(o=e)})),h()}function h(){a=document.documentElement.dir||"ltr",l=document.documentElement.lang||navigator.language,[...s.keys()].map((e=>{"function"==typeof e.requestUpdate&&e.requestUpdate()}))}r.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]});var c=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){s.add(this.host)}hostDisconnected(){s.delete(this.host)}dir(){return`${this.host.dir||a}`.toLowerCase()}lang(){return`${this.host.lang||l}`.toLowerCase()}getTranslationData(e){var t,i;const o=new Intl.Locale(e),s=null==o?void 0:o.language.toLowerCase(),r=null!==(i=null===(t=null==o?void 0:o.region)||void 0===t?void 0:t.toLowerCase())&&void 0!==i?i:"";return{locale:o,language:s,region:r,primary:n.get(`${s}-${r}`),secondary:n.get(s)}}exists(e,t){var i;const{primary:s,secondary:r}=this.getTranslationData(null!==(i=t.lang)&&void 0!==i?i:this.lang());return t=Object.assign({includeFallback:!1},t),!!(s&&s[e]||r&&r[e]||t.includeFallback&&o&&o[e])}term(e,...t){const{primary:i,secondary:s}=this.getTranslationData(this.lang());let r;if(i&&i[e])r=i[e];else if(s&&s[e])r=s[e];else{if(!o||!o[e])return console.error(`No translation found for: ${String(e)}`),String(e);r=o[e]}return"function"==typeof r?r(...t):r}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,i){return new Intl.RelativeTimeFormat(this.lang(),i).format(e,t)}}},8379:(e,t,i)=>{i.d(t,{V:()=>s});var o=i(1862),s=class extends o.V{};(0,o.P)({$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copy:"Copy",currentValue:"Current value",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>0===e?"No options selected":1===e?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"})},8734:(e,t,i)=>{i.d(t,{l:()=>s});var o=i(5954),s=e=>null!=e?e:o.b},5710:(e,t,i)=>{i.d(t,{Y:()=>s});var o=i(453);function s(e,t){const i=(0,o.ih)({waitUntilFirstUpdate:!1},t);return(t,o)=>{const{update:s}=t,r=Array.isArray(e)?e:[e];t.update=function(e){r.forEach((t=>{const s=t;if(e.has(s)){const t=e.get(s),r=this[s];t!==r&&(i.waitUntilFirstUpdate&&!this.hasUpdated||this[o](t,r))}})),s.call(this,e)}}}},9399:(e,t,i)=>{var o=i(6281),s=i(5954),r=s.i`
  ${o.N}

  :host {
    --divider-width: 4px;
    --divider-hit-area: 12px;
    --min: 0%;
    --max: 100%;

    display: grid;
  }

  .start,
  .end {
    overflow: hidden;
  }

  .divider {
    flex: 0 0 var(--divider-width);
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    background-color: var(--sl-color-neutral-200);
    color: var(--sl-color-neutral-900);
    z-index: 1;
  }

  .divider:focus {
    outline: none;
  }

  :host(:not([disabled])) .divider:focus-visible {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  :host([disabled]) .divider {
    cursor: not-allowed;
  }

  /* Horizontal */
  :host(:not([vertical], [disabled])) .divider {
    cursor: col-resize;
  }

  :host(:not([vertical])) .divider::after {
    display: flex;
    content: '';
    position: absolute;
    height: 100%;
    left: calc(var(--divider-hit-area) / -2 + var(--divider-width) / 2);
    width: var(--divider-hit-area);
  }

  /* Vertical */
  :host([vertical]) {
    flex-direction: column;
  }

  :host([vertical]:not([disabled])) .divider {
    cursor: row-resize;
  }

  :host([vertical]) .divider::after {
    content: '';
    position: absolute;
    width: 100%;
    top: calc(var(--divider-hit-area) / -2 + var(--divider-width) / 2);
    height: var(--divider-hit-area);
  }

  @media (forced-colors: active) {
    .divider {
      outline: solid 1px transparent;
    }
  }
`,n=i(6200),a=i(1807),l=i(8734),d=i(8379),h=i(5710),c=i(8424),p=i(453),u=class extends c.P{constructor(){super(...arguments),this.localize=new d.V(this),this.position=50,this.vertical=!1,this.disabled=!1,this.snapThreshold=12}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver((e=>this.handleResize(e))),this.updateComplete.then((()=>this.resizeObserver.observe(this))),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this)}detectSize(){const{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){const t="rtl"===this.localize.dir();this.disabled||(e.cancelable&&e.preventDefault(),(0,n.o)(this,{onMove:(e,i)=>{let o=this.vertical?i:e;"end"===this.primary&&(o=this.size-o),this.snap&&this.snap.split(" ").forEach((e=>{let i;i=e.endsWith("%")?this.size*(parseFloat(e)/100):parseFloat(e),t&&!this.vertical&&(i=this.size-i),o>=i-this.snapThreshold&&o<=i+this.snapThreshold&&(o=i)})),this.position=(0,a.u)(this.pixelsToPercentage(o),0,100)},initialEvent:e}))}handleKeyDown(e){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key)){let t=this.position;const i=(e.shiftKey?10:1)*("end"===this.primary?-1:1);e.preventDefault(),("ArrowLeft"===e.key&&!this.vertical||"ArrowUp"===e.key&&this.vertical)&&(t-=i),("ArrowRight"===e.key&&!this.vertical||"ArrowDown"===e.key&&this.vertical)&&(t+=i),"Home"===e.key&&(t="end"===this.primary?100:0),"End"===e.key&&(t="end"===this.primary?0:100),this.position=(0,a.u)(t,0,100)}}handleResize(e){const{width:t,height:i}=e[0].contentRect;this.size=this.vertical?i:t,this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){const e=this.vertical?"gridTemplateRows":"gridTemplateColumns",t=this.vertical?"gridTemplateColumns":"gridTemplateRows",i="rtl"===this.localize.dir(),o=`\n      clamp(\n        0%,\n        clamp(\n          var(--min),\n          ${this.position}% - var(--divider-width) / 2,\n          var(--max)\n        ),\n        calc(100% - var(--divider-width))\n      )\n    `,r="auto";return"end"===this.primary?i&&!this.vertical?this.style[e]=`${o} var(--divider-width) ${r}`:this.style[e]=`${r} var(--divider-width) ${o}`:i&&!this.vertical?this.style[e]=`${r} var(--divider-width) ${o}`:this.style[e]=`${o} var(--divider-width) ${r}`,this.style[t]="",s.y`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${(0,l.l)(this.disabled?void 0:"0")}
        role="separator"
        aria-valuenow=${this.position}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label=${this.localize.term("resize")}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleDrag}
        @touchstart=${this.handleDrag}
      >
        <slot name="divider"></slot>
      </div>

      <slot name="end" part="panel end" class="end"></slot>
    `}};u.styles=r,(0,p.u2)([(0,c.i)(".divider")],u.prototype,"divider",2),(0,p.u2)([(0,c.e2)({type:Number,reflect:!0})],u.prototype,"position",2),(0,p.u2)([(0,c.e2)({attribute:"position-in-pixels",type:Number})],u.prototype,"positionInPixels",2),(0,p.u2)([(0,c.e2)({type:Boolean,reflect:!0})],u.prototype,"vertical",2),(0,p.u2)([(0,c.e2)({type:Boolean,reflect:!0})],u.prototype,"disabled",2),(0,p.u2)([(0,c.e2)()],u.prototype,"primary",2),(0,p.u2)([(0,c.e2)()],u.prototype,"snap",2),(0,p.u2)([(0,c.e2)({type:Number,attribute:"snap-threshold"})],u.prototype,"snapThreshold",2),(0,p.u2)([(0,h.Y)("position")],u.prototype,"handlePositionChange",1),(0,p.u2)([(0,h.Y)("positionInPixels")],u.prototype,"handlePositionInPixelsChange",1),(0,p.u2)([(0,h.Y)("vertical")],u.prototype,"handleVerticalChange",1),u=(0,p.u2)([(0,c.e)("sl-split-panel")],u),i(1862)}}]);
//# sourceMappingURL=sl-split-panel.a046699f.js.map