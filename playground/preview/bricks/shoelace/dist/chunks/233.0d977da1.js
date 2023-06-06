"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[233],{8806:(t,a,e)=>{var o=e(6281),s=e(5954),i=s.i`
  ${o.N}

  :host {
    --indicator-color: var(--sl-color-primary-600);
    --track-color: var(--sl-color-neutral-200);
    --track-width: 2px;

    display: block;
  }

  .tab-group {
    display: flex;
    border-radius: 0;
  }

  .tab-group__tabs {
    display: flex;
    position: relative;
  }

  .tab-group__indicator {
    position: absolute;
    transition: var(--sl-transition-fast) translate ease, var(--sl-transition-fast) width ease;
  }

  .tab-group--has-scroll-controls .tab-group__nav-container {
    position: relative;
    padding: 0 var(--sl-spacing-x-large);
  }

  .tab-group__body {
    display: block;
    overflow: auto;
  }

  .tab-group__scroll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    width: var(--sl-spacing-x-large);
  }

  .tab-group__scroll-button--start {
    left: 0;
  }

  .tab-group__scroll-button--end {
    right: 0;
  }

  .tab-group--rtl .tab-group__scroll-button--start {
    left: auto;
    right: 0;
  }

  .tab-group--rtl .tab-group__scroll-button--end {
    left: 0;
    right: auto;
  }

  /*
   * Top
   */

  .tab-group--top {
    flex-direction: column;
  }

  .tab-group--top .tab-group__nav-container {
    order: 1;
  }

  .tab-group--top .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group--top .tab-group__nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group--top .tab-group__tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-bottom: solid var(--track-width) var(--track-color);
  }

  .tab-group--top .tab-group__indicator {
    bottom: calc(-1 * var(--track-width));
    border-bottom: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--top .tab-group__body {
    order: 2;
  }

  .tab-group--top ::slotted(sl-tab-panel) {
    --padding: var(--sl-spacing-medium) 0;
  }

  /*
   * Bottom
   */

  .tab-group--bottom {
    flex-direction: column;
  }

  .tab-group--bottom .tab-group__nav-container {
    order: 2;
  }

  .tab-group--bottom .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group--bottom .tab-group__nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group--bottom .tab-group__tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-top: solid var(--track-width) var(--track-color);
  }

  .tab-group--bottom .tab-group__indicator {
    top: calc(-1 * var(--track-width));
    border-top: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--bottom .tab-group__body {
    order: 1;
  }

  .tab-group--bottom ::slotted(sl-tab-panel) {
    --padding: var(--sl-spacing-medium) 0;
  }

  /*
   * Start
   */

  .tab-group--start {
    flex-direction: row;
  }

  .tab-group--start .tab-group__nav-container {
    order: 1;
  }

  .tab-group--start .tab-group__tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-inline-end: solid var(--track-width) var(--track-color);
  }

  .tab-group--start .tab-group__indicator {
    right: calc(-1 * var(--track-width));
    border-right: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--start.tab-group--rtl .tab-group__indicator {
    right: auto;
    left: calc(-1 * var(--track-width));
  }

  .tab-group--start .tab-group__body {
    flex: 1 1 auto;
    order: 2;
  }

  .tab-group--start ::slotted(sl-tab-panel) {
    --padding: 0 var(--sl-spacing-medium);
  }

  /*
   * End
   */

  .tab-group--end {
    flex-direction: row;
  }

  .tab-group--end .tab-group__nav-container {
    order: 2;
  }

  .tab-group--end .tab-group__tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-left: solid var(--track-width) var(--track-color);
  }

  .tab-group--end .tab-group__indicator {
    left: calc(-1 * var(--track-width));
    border-inline-start: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--end.tab-group--rtl .tab-group__indicator {
    right: calc(-1 * var(--track-width));
    left: auto;
  }

  .tab-group--end .tab-group__body {
    flex: 1 1 auto;
    order: 1;
  }

  .tab-group--end ::slotted(sl-tab-panel) {
    --padding: 0 var(--sl-spacing-medium);
  }
`,r=e(9622),l=e(8379),n=e(5710),c=e(5381),b=e(8424),d=e(453),p=class extends b.P{constructor(){super(...arguments),this.localize=new l.V(this),this.tabs=[],this.panels=[],this.hasScrollControls=!1,this.placement="top",this.activation="auto",this.noScrollControls=!1}connectedCallback(){const t=Promise.allSettled([customElements.whenDefined("sl-tab"),customElements.whenDefined("sl-tab-panel")]);super.connectedCallback(),this.resizeObserver=new ResizeObserver((()=>{this.repositionIndicator(),this.updateScrollControls()})),this.mutationObserver=new MutationObserver((t=>{t.some((t=>!["aria-labelledby","aria-controls"].includes(t.attributeName)))&&setTimeout((()=>this.setAriaLabels())),t.some((t=>"disabled"===t.attributeName))&&this.syncTabsAndPanels()})),this.updateComplete.then((()=>{this.syncTabsAndPanels(),this.mutationObserver.observe(this,{attributes:!0,childList:!0,subtree:!0}),this.resizeObserver.observe(this.nav),t.then((()=>{new IntersectionObserver(((t,a)=>{var e;t[0].intersectionRatio>0&&(this.setAriaLabels(),this.setActiveTab(null!=(e=this.getActiveTab())?e:this.tabs[0],{emitEvents:!1}),a.unobserve(t[0].target))})).observe(this.tabGroup)}))}))}disconnectedCallback(){this.mutationObserver.disconnect(),this.resizeObserver.unobserve(this.nav)}getAllTabs(t={includeDisabled:!0}){return[...this.shadowRoot.querySelector('slot[name="nav"]').assignedElements()].filter((a=>t.includeDisabled?"sl-tab"===a.tagName.toLowerCase():"sl-tab"===a.tagName.toLowerCase()&&!a.disabled))}getAllPanels(){return[...this.body.assignedElements()].filter((t=>"sl-tab-panel"===t.tagName.toLowerCase()))}getActiveTab(){return this.tabs.find((t=>t.active))}handleClick(t){const a=t.target.closest("sl-tab");(null==a?void 0:a.closest("sl-tab-group"))===this&&null!==a&&this.setActiveTab(a,{scrollBehavior:"smooth"})}handleKeyDown(t){const a=t.target.closest("sl-tab");if((null==a?void 0:a.closest("sl-tab-group"))===this&&(["Enter"," "].includes(t.key)&&null!==a&&(this.setActiveTab(a,{scrollBehavior:"smooth"}),t.preventDefault()),["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(t.key))){const a=this.tabs.find((t=>t.matches(":focus"))),e="rtl"===this.localize.dir();if("sl-tab"===(null==a?void 0:a.tagName.toLowerCase())){let o=this.tabs.indexOf(a);"Home"===t.key?o=0:"End"===t.key?o=this.tabs.length-1:["top","bottom"].includes(this.placement)&&t.key===(e?"ArrowRight":"ArrowLeft")||["start","end"].includes(this.placement)&&"ArrowUp"===t.key?o--:(["top","bottom"].includes(this.placement)&&t.key===(e?"ArrowLeft":"ArrowRight")||["start","end"].includes(this.placement)&&"ArrowDown"===t.key)&&o++,o<0&&(o=this.tabs.length-1),o>this.tabs.length-1&&(o=0),this.tabs[o].focus({preventScroll:!0}),"auto"===this.activation&&this.setActiveTab(this.tabs[o],{scrollBehavior:"smooth"}),["top","bottom"].includes(this.placement)&&(0,r.zT)(this.tabs[o],this.nav,"horizontal"),t.preventDefault()}}}handleScrollToStart(){this.nav.scroll({left:"rtl"===this.localize.dir()?this.nav.scrollLeft+this.nav.clientWidth:this.nav.scrollLeft-this.nav.clientWidth,behavior:"smooth"})}handleScrollToEnd(){this.nav.scroll({left:"rtl"===this.localize.dir()?this.nav.scrollLeft-this.nav.clientWidth:this.nav.scrollLeft+this.nav.clientWidth,behavior:"smooth"})}setActiveTab(t,a){if(a=(0,d.ih)({emitEvents:!0,scrollBehavior:"auto"},a),t!==this.activeTab&&!t.disabled){const e=this.activeTab;this.activeTab=t,this.tabs.map((t=>t.active=t===this.activeTab)),this.panels.map((t=>{var a;return t.active=t.name===(null==(a=this.activeTab)?void 0:a.panel)})),this.syncIndicator(),["top","bottom"].includes(this.placement)&&(0,r.zT)(this.activeTab,this.nav,"horizontal",a.scrollBehavior),a.emitEvents&&(e&&this.emit("sl-tab-hide",{detail:{name:e.panel}}),this.emit("sl-tab-show",{detail:{name:this.activeTab.panel}}))}}setAriaLabels(){this.tabs.forEach((t=>{const a=this.panels.find((a=>a.name===t.panel));a&&(t.setAttribute("aria-controls",a.getAttribute("id")),a.setAttribute("aria-labelledby",t.getAttribute("id")))}))}repositionIndicator(){const t=this.getActiveTab();if(!t)return;const a=t.clientWidth,e=t.clientHeight,o="rtl"===this.localize.dir(),s=this.getAllTabs(),i=s.slice(0,s.indexOf(t)).reduce(((t,a)=>({left:t.left+a.clientWidth,top:t.top+a.clientHeight})),{left:0,top:0});switch(this.placement){case"top":case"bottom":this.indicator.style.width=`${a}px`,this.indicator.style.height="auto",this.indicator.style.translate=o?-1*i.left+"px":`${i.left}px`;break;case"start":case"end":this.indicator.style.width="auto",this.indicator.style.height=`${e}px`,this.indicator.style.translate=`0 ${i.top}px`}}syncTabsAndPanels(){this.tabs=this.getAllTabs({includeDisabled:!1}),this.panels=this.getAllPanels(),this.syncIndicator(),this.updateComplete.then((()=>this.updateScrollControls()))}updateScrollControls(){this.noScrollControls?this.hasScrollControls=!1:this.hasScrollControls=["top","bottom"].includes(this.placement)&&this.nav.scrollWidth>this.nav.clientWidth}syncIndicator(){this.getActiveTab()?(this.indicator.style.display="block",this.repositionIndicator()):this.indicator.style.display="none"}show(t){const a=this.tabs.find((a=>a.panel===t));a&&this.setActiveTab(a,{scrollBehavior:"smooth"})}render(){const t="rtl"===this.localize.dir();return s.y`
      <div
        part="base"
        class=${(0,c.o)({"tab-group":!0,"tab-group--top":"top"===this.placement,"tab-group--bottom":"bottom"===this.placement,"tab-group--start":"start"===this.placement,"tab-group--end":"end"===this.placement,"tab-group--rtl":"rtl"===this.localize.dir(),"tab-group--has-scroll-controls":this.hasScrollControls})}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container" part="nav">
          ${this.hasScrollControls?s.y`
                <sl-icon-button
                  part="scroll-button scroll-button--start"
                  exportparts="base:scroll-button__base"
                  class="tab-group__scroll-button tab-group__scroll-button--start"
                  name=${t?"chevron-right":"chevron-left"}
                  library="system"
                  label=${this.localize.term("scrollToStart")}
                  @click=${this.handleScrollToStart}
                ></sl-icon-button>
              `:""}

          <div class="tab-group__nav">
            <div part="tabs" class="tab-group__tabs" role="tablist">
              <div part="active-tab-indicator" class="tab-group__indicator"></div>
              <slot name="nav" @slotchange=${this.syncTabsAndPanels}></slot>
            </div>
          </div>

          ${this.hasScrollControls?s.y`
                <sl-icon-button
                  part="scroll-button scroll-button--end"
                  exportparts="base:scroll-button__base"
                  class="tab-group__scroll-button tab-group__scroll-button--end"
                  name=${t?"chevron-left":"chevron-right"}
                  library="system"
                  label=${this.localize.term("scrollToEnd")}
                  @click=${this.handleScrollToEnd}
                ></sl-icon-button>
              `:""}
        </div>

        <slot part="body" class="tab-group__body" @slotchange=${this.syncTabsAndPanels}></slot>
      </div>
    `}};p.styles=i,(0,d.u2)([(0,b.i)(".tab-group")],p.prototype,"tabGroup",2),(0,d.u2)([(0,b.i)(".tab-group__body")],p.prototype,"body",2),(0,d.u2)([(0,b.i)(".tab-group__nav")],p.prototype,"nav",2),(0,d.u2)([(0,b.i)(".tab-group__indicator")],p.prototype,"indicator",2),(0,d.u2)([(0,b.t)()],p.prototype,"hasScrollControls",2),(0,d.u2)([(0,b.e2)()],p.prototype,"placement",2),(0,d.u2)([(0,b.e2)()],p.prototype,"activation",2),(0,d.u2)([(0,b.e2)({attribute:"no-scroll-controls",type:Boolean})],p.prototype,"noScrollControls",2),(0,d.u2)([(0,n.Y)("noScrollControls",{waitUntilFirstUpdate:!0})],p.prototype,"updateScrollControls",1),(0,d.u2)([(0,n.Y)("placement",{waitUntilFirstUpdate:!0})],p.prototype,"syncIndicator",1),p=(0,d.u2)([(0,b.e)("sl-tab-group")],p),e(3149),e(4073),e(3251),e(8734),e(1862),e(9940),e(9191),e(836),e(2759),e(1939),e(4370)},3228:(t,a,e)=>{var o=e(6281),s=e(5954),i=s.i`
  ${o.N}

  :host {
    --padding: 0;

    display: none;
  }

  :host([active]) {
    display: block;
  }

  .tab-panel {
    display: block;
    padding: var(--padding);
  }
`,r=e(5710),l=e(5381),n=e(8424),c=e(453),b=0,d=class extends n.P{constructor(){super(...arguments),this.attrId=++b,this.componentId=`sl-tab-panel-${this.attrId}`,this.name="",this.active=!1}connectedCallback(){super.connectedCallback(),this.id=this.id.length>0?this.id:this.componentId,this.setAttribute("role","tabpanel")}handleActiveChange(){this.setAttribute("aria-hidden",this.active?"false":"true")}render(){return s.y`
      <slot
        part="base"
        class=${(0,l.o)({"tab-panel":!0,"tab-panel--active":this.active})}
      ></slot>
    `}};d.styles=i,(0,c.u2)([(0,n.e2)({reflect:!0})],d.prototype,"name",2),(0,c.u2)([(0,n.e2)({type:Boolean,reflect:!0})],d.prototype,"active",2),(0,c.u2)([(0,r.Y)("active")],d.prototype,"handleActiveChange",1),d=(0,c.u2)([(0,n.e)("sl-tab-panel")],d),e(4370)},3799:(t,a,e)=>{var o=e(6281),s=e(5954),i=s.i`
  ${o.N}

  :host {
    display: inline-block;
  }

  .tab {
    display: inline-flex;
    align-items: center;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    border-radius: var(--sl-border-radius-medium);
    color: var(--sl-color-neutral-600);
    padding: var(--sl-spacing-medium) var(--sl-spacing-large);
    white-space: nowrap;
    user-select: none;
    cursor: pointer;
    transition: var(--transition-speed) box-shadow, var(--transition-speed) color;
  }

  .tab:hover:not(.tab--disabled) {
    color: var(--sl-color-primary-600);
  }

  .tab:focus {
    outline: none;
  }

  .tab:focus-visible:not(.tab--disabled) {
    color: var(--sl-color-primary-600);
  }

  .tab:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: calc(-1 * var(--sl-focus-ring-width) - var(--sl-focus-ring-offset));
  }

  .tab.tab--active:not(.tab--disabled) {
    color: var(--sl-color-primary-600);
  }

  .tab.tab--closable {
    padding-inline-end: var(--sl-spacing-small);
  }

  .tab.tab--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tab__close-button {
    font-size: var(--sl-font-size-small);
    margin-inline-start: var(--sl-spacing-small);
  }

  .tab__close-button::part(base) {
    padding: var(--sl-spacing-3x-small);
  }

  @media (forced-colors: active) {
    .tab.tab--active:not(.tab--disabled) {
      outline: solid 1px transparent;
      outline-offset: -3px;
    }
  }
`,r=e(8379),l=e(5710),n=e(5381),c=e(8424),b=e(453),d=0,p=class extends c.P{constructor(){super(...arguments),this.localize=new r.V(this),this.attrId=++d,this.componentId=`sl-tab-${this.attrId}`,this.panel="",this.active=!1,this.closable=!1,this.disabled=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tab")}handleCloseClick(t){t.stopPropagation(),this.emit("sl-close")}handleActiveChange(){this.setAttribute("aria-selected",this.active?"true":"false")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}focus(t){this.tab.focus(t)}blur(){this.tab.blur()}render(){return this.id=this.id.length>0?this.id:this.componentId,s.y`
      <div
        part="base"
        class=${(0,n.o)({tab:!0,"tab--active":this.active,"tab--closable":this.closable,"tab--disabled":this.disabled})}
        tabindex=${this.disabled?"-1":"0"}
      >
        <slot></slot>
        ${this.closable?s.y`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("close")}
                class="tab__close-button"
                @click=${this.handleCloseClick}
                tabindex="-1"
              ></sl-icon-button>
            `:""}
      </div>
    `}};p.styles=i,(0,b.u2)([(0,c.i)(".tab")],p.prototype,"tab",2),(0,b.u2)([(0,c.e2)({reflect:!0})],p.prototype,"panel",2),(0,b.u2)([(0,c.e2)({type:Boolean,reflect:!0})],p.prototype,"active",2),(0,b.u2)([(0,c.e2)({type:Boolean})],p.prototype,"closable",2),(0,b.u2)([(0,c.e2)({type:Boolean,reflect:!0})],p.prototype,"disabled",2),(0,b.u2)([(0,l.Y)("active")],p.prototype,"handleActiveChange",1),(0,b.u2)([(0,l.Y)("disabled")],p.prototype,"handleDisabledChange",1),p=(0,b.u2)([(0,c.e)("sl-tab")],p),e(3149),e(4073),e(3251),e(8734),e(1862),e(9940),e(9191),e(836),e(2759),e(1939),e(4370)}}]);
//# sourceMappingURL=233.0d977da1.js.map