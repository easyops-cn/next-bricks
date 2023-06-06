"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[2282],{9248:(e,t,r)=>{r.r(t),r(6578),r(5517)},5517:(e,t,r)=>{r(2969),r(3467);var a=r(4124);function o(e){document.documentElement.classList["dark"===e||"dark-v2"===e?"add":"remove"]("sl-theme-dark")}r(1744),(0,a.t)(r.p),o(document.documentElement.dataset.theme),window.addEventListener("theme.change",(e=>{o(e.detail)}))},738:(e,t,r)=>{r.d(t,{Z:()=>n});var a=r(9601),o=r.n(a),s=r(2609),i=r.n(s)()(o());i.push([e.id,":root,\n.sl-theme-dark{--sl-z-index-drawer:1000;--sl-z-index-dialog:1000;--sl-z-index-dropdown:1050;--sl-z-index-toast:1000;--sl-z-index-tooltip:1070}",""]);const n=i},1744:(e,t,r)=>{var a=r(6062),o=r.n(a),s=r(4036),i=r.n(s),n=r(6793),l=r.n(n),c=r(7892),d=r.n(c),u=r(1173),g=r.n(u),h=r(2464),p=r.n(h),m=r(738),v={};v.styleTagTransform=p(),v.setAttributes=d(),v.insert=l().bind(null,"head"),v.domAPI=i(),v.insertStyleElement=g(),o()(m.Z,v),m.Z&&m.Z.locals&&m.Z.locals},6281:(e,t,r)=>{r.d(t,{N:()=>a});var a=r(5954).i`
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
`},1862:(e,t,r)=>{r.d(t,{P:()=>c,V:()=>u});var a,o=new Set,s=new MutationObserver(d),i=new Map,n=document.documentElement.dir||"ltr",l=document.documentElement.lang||navigator.language;function c(...e){e.map((e=>{const t=e.$code.toLowerCase();i.has(t)?i.set(t,Object.assign(Object.assign({},i.get(t)),e)):i.set(t,e),a||(a=e)})),d()}function d(){n=document.documentElement.dir||"ltr",l=document.documentElement.lang||navigator.language,[...o.keys()].map((e=>{"function"==typeof e.requestUpdate&&e.requestUpdate()}))}s.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]});var u=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){o.add(this.host)}hostDisconnected(){o.delete(this.host)}dir(){return`${this.host.dir||n}`.toLowerCase()}lang(){return`${this.host.lang||l}`.toLowerCase()}getTranslationData(e){var t,r;const a=new Intl.Locale(e),o=null==a?void 0:a.language.toLowerCase(),s=null!==(r=null===(t=null==a?void 0:a.region)||void 0===t?void 0:t.toLowerCase())&&void 0!==r?r:"";return{locale:a,language:o,region:s,primary:i.get(`${o}-${s}`),secondary:i.get(o)}}exists(e,t){var r;const{primary:o,secondary:s}=this.getTranslationData(null!==(r=t.lang)&&void 0!==r?r:this.lang());return t=Object.assign({includeFallback:!1},t),!!(o&&o[e]||s&&s[e]||t.includeFallback&&a&&a[e])}term(e,...t){const{primary:r,secondary:o}=this.getTranslationData(this.lang());let s;if(r&&r[e])s=r[e];else if(o&&o[e])s=o[e];else{if(!a||!a[e])return console.error(`No translation found for: ${String(e)}`),String(e);s=a[e]}return"function"==typeof s?s(...t):s}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(e,t)}}},8379:(e,t,r)=>{r.d(t,{V:()=>o});var a=r(1862),o=class extends a.V{};(0,a.P)({$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copy:"Copy",currentValue:"Current value",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>0===e?"No options selected":1===e?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"})},6578:(e,t,r)=>{var a=r(6281),o=r(5954),s=o.i`
  ${a.N}

  :host {
    --size: 128px;
    --track-width: 4px;
    --track-color: var(--sl-color-neutral-200);
    --indicator-width: var(--track-width);
    --indicator-color: var(--sl-color-primary-600);
    --indicator-transition-duration: 0.35s;

    display: inline-flex;
  }

  .progress-ring {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .progress-ring__image {
    width: var(--size);
    height: var(--size);
    rotate: -90deg;
    transform-origin: 50% 50%;
  }

  .progress-ring__track,
  .progress-ring__indicator {
    --radius: calc(var(--size) / 2 - max(var(--track-width), var(--indicator-width)) * 0.5);
    --circumference: calc(var(--radius) * 2 * 3.141592654);

    fill: none;
    r: var(--radius);
    cx: calc(var(--size) / 2);
    cy: calc(var(--size) / 2);
  }

  .progress-ring__track {
    stroke: var(--track-color);
    stroke-width: var(--track-width);
  }

  .progress-ring__indicator {
    stroke: var(--indicator-color);
    stroke-width: var(--indicator-width);
    stroke-linecap: round;
    transition-property: stroke-dashoffset;
    transition-duration: var(--indicator-transition-duration);
    stroke-dasharray: var(--circumference) var(--circumference);
    stroke-dashoffset: calc(var(--circumference) - var(--percentage) * var(--circumference));
  }

  .progress-ring__label {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    user-select: none;
  }
`,i=r(8379),n=r(8424),l=r(453),c=class extends n.P{constructor(){super(...arguments),this.localize=new i.V(this),this.value=0,this.label=""}updated(e){if(super.updated(e),e.has("value")){const e=parseFloat(getComputedStyle(this.indicator).getPropertyValue("r")),t=2*Math.PI*e,r=t-this.value/100*t;this.indicatorOffset=`${r}px`}}render(){return o.y`
      <div
        part="base"
        class="progress-ring"
        role="progressbar"
        aria-label=${this.label.length>0?this.label:this.localize.term("progress")}
        aria-describedby="label"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${this.value}"
        style="--percentage: ${this.value/100}"
      >
        <svg class="progress-ring__image">
          <circle class="progress-ring__track"></circle>
          <circle class="progress-ring__indicator" style="stroke-dashoffset: ${this.indicatorOffset}"></circle>
        </svg>

        <slot id="label" part="label" class="progress-ring__label"></slot>
      </div>
    `}};c.styles=s,(0,l.u2)([(0,n.i)(".progress-ring__indicator")],c.prototype,"indicator",2),(0,l.u2)([(0,n.t)()],c.prototype,"indicatorOffset",2),(0,l.u2)([(0,n.e2)({type:Number,reflect:!0})],c.prototype,"value",2),(0,l.u2)([(0,n.e2)()],c.prototype,"label",2),c=(0,l.u2)([(0,n.e)("sl-progress-ring")],c),r(1862)}}]);
//# sourceMappingURL=sl-progress-ring.6b1820ae.js.map