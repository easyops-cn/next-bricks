"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[9632],{8315:(e,t,i)=>{i.d(t,{K:()=>o});var s=i(6281),o=i(5954).i`
  ${s.N}

  :host {
    --aspect-ratio: inherit;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    max-height: 100%;
    aspect-ratio: var(--aspect-ratio);
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  ::slotted(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`},6412:(e,t,i)=>{i.d(t,{j:()=>a});var s=i(8315),o=i(8424),r=i(5954),n=i(453),a=class extends o.P{static isCarouselItem(e){return e instanceof Element&&"slide"===e.getAttribute("aria-roledescription")}connectedCallback(){super.connectedCallback(),this.setAttribute("role","group")}render(){return r.y` <slot></slot> `}};a.styles=s.K,a=(0,n.u2)([(0,o.e)("sl-carousel-item")],a)},9628:(e,t,i)=>{i(6412),i(8315),i(8424),i(6281),i(5954),i(453)},2411:(e,t,i)=>{var s=i(1807),o=i(6281),r=i(5954),n=r.i`
  ${o.N}

  :host {
    --slide-gap: var(--sl-spacing-medium, 1rem);
    --aspect-ratio: 16 / 9;
    --scroll-hint: 0px;

    display: flex;
  }

  .carousel {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: 1fr min-content;
    grid-template-areas:
      '. slides .'
      '. pagination .';
    gap: var(--sl-spacing-medium);
    align-items: center;
    min-height: 100%;
    min-width: 100%;
    position: relative;
  }

  .carousel__pagination {
    grid-area: pagination;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--sl-spacing-small);
  }

  .carousel__slides {
    grid-area: slides;

    display: grid;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-items: center;
    overflow: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    aspect-ratio: calc(var(--aspect-ratio) * var(--slides-per-page));
    border-radius: var(--sl-border-radius-small);

    --slide-size: calc((100% - (var(--slides-per-page) - 1) * var(--slide-gap)) / var(--slides-per-page));
  }

  @media (prefers-reduced-motion) {
    :where(.carousel__slides) {
      scroll-behavior: auto;
    }
  }

  .carousel__slides--horizontal {
    grid-auto-flow: column;
    grid-auto-columns: var(--slide-size);
    grid-auto-rows: 100%;
    column-gap: var(--slide-gap);
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--scroll-hint);
    padding-inline: var(--scroll-hint);
    overflow-y: hidden;
  }

  .carousel__slides--vertical {
    grid-auto-flow: row;
    grid-auto-columns: 100%;
    grid-auto-rows: var(--slide-size);
    row-gap: var(--slide-gap);
    scroll-snap-type: y mandatory;
    scroll-padding-block: var(--scroll-hint);
    padding-block: var(--scroll-hint);
    overflow-x: hidden;
  }

  .carousel__slides--dragging,
  .carousel__slides--dropping {
    scroll-snap-type: unset;
  }

  :host([vertical]) ::slotted(sl-carousel-item) {
    height: 100%;
  }

  .carousel__slides::-webkit-scrollbar {
    display: none;
  }

  .carousel__navigation {
    grid-area: navigation;
    display: contents;
    font-size: var(--sl-font-size-x-large);
  }

  .carousel__navigation-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-small);
    font-size: inherit;
    color: var(--sl-color-neutral-600);
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-medium) color;
    appearance: none;
  }

  .carousel__navigation-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .carousel__navigation-button--disabled::part(base) {
    pointer-events: none;
  }

  .carousel__navigation-button--previous {
    grid-column: 1;
    grid-row: 1;
  }

  .carousel__navigation-button--next {
    grid-column: 3;
    grid-row: 1;
  }

  .carousel__pagination-item {
    display: block;
    cursor: pointer;
    background: none;
    border: 0;
    border-radius: var(--sl-border-radius-circle);
    width: var(--sl-spacing-small);
    height: var(--sl-spacing-small);
    background-color: var(--sl-color-neutral-300);
    padding: 0;
    margin: 0;
  }

  .carousel__pagination-item--active {
    background-color: var(--sl-color-neutral-700);
    transform: scale(1.2);
  }

  /* Focus styles */
  .carousel__slides:focus-visible,
  .carousel__navigation-button:focus-visible,
  .carousel__pagination-item:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }
`,a=i(4867),l=i(9745),h=i(453),d=Symbol(),c=class{constructor(e){this.pointers=new Set,this.dragging=!1,this.scrolling=!1,this.mouseDragging=!1,this.host=e,e.addController(this),this.handleScroll=this.handleScroll.bind(this),this.handlePointerDown=this.handlePointerDown.bind(this),this.handlePointerMove=this.handlePointerMove.bind(this),this.handlePointerUp=this.handlePointerUp.bind(this),this.handlePointerUp=this.handlePointerUp.bind(this),this.handleTouchStart=this.handleTouchStart.bind(this),this.handleTouchEnd=this.handleTouchEnd.bind(this)}async hostConnected(){const e=this.host;await e.updateComplete;const t=e.scrollContainer;t.addEventListener("scroll",this.handleScroll,{passive:!0}),t.addEventListener("pointerdown",this.handlePointerDown),t.addEventListener("pointerup",this.handlePointerUp),t.addEventListener("pointercancel",this.handlePointerUp),t.addEventListener("touchstart",this.handleTouchStart,{passive:!0}),t.addEventListener("touchend",this.handleTouchEnd)}hostDisconnected(){const e=this.host.scrollContainer;e.removeEventListener("scroll",this.handleScroll),e.removeEventListener("pointerdown",this.handlePointerDown),e.removeEventListener("pointerup",this.handlePointerUp),e.removeEventListener("pointercancel",this.handlePointerUp),e.removeEventListener("touchstart",this.handleTouchStart),e.removeEventListener("touchend",this.handleTouchEnd)}handleScroll(){this.scrolling||(this.scrolling=!0,this.host.requestUpdate()),this.handleScrollEnd()}handleScrollEnd(){this.pointers.size?this.handleScrollEnd():(this.scrolling=!1,this.host.scrollContainer.dispatchEvent(new CustomEvent("scrollend",{bubbles:!1,cancelable:!1})),this.host.requestUpdate())}handlePointerDown(e){"touch"!==e.pointerType&&(this.pointers.add(e.pointerId),this.mouseDragging&&!this.dragging&&0===e.button&&(e.preventDefault(),this.host.scrollContainer.addEventListener("pointermove",this.handlePointerMove)))}handlePointerMove(e){const t=this.host.scrollContainer,i=!!e.movementX||!!e.movementY;!this.dragging&&i?(t.setPointerCapture(e.pointerId),this.handleDragStart()):t.hasPointerCapture(e.pointerId)&&this.handleDrag(e)}handlePointerUp(e){this.pointers.delete(e.pointerId),this.host.scrollContainer.releasePointerCapture(e.pointerId),0===this.pointers.size&&this.handleDragEnd()}handleTouchEnd(e){for(const t of e.changedTouches)this.pointers.delete(t.identifier)}handleTouchStart(e){for(const t of e.touches)this.pointers.add(t.identifier)}handleDragStart(){const e=this.host;this.dragging=!0,e.scrollContainer.style.setProperty("scroll-snap-type","unset"),e.requestUpdate()}handleDrag(e){this.host.scrollContainer.scrollBy({left:-e.movementX,top:-e.movementY})}async handleDragEnd(){const e=this.host,t=e.scrollContainer;t.removeEventListener("pointermove",this.handlePointerMove),this.dragging=!1;const i=t.scrollLeft,s=t.scrollTop;t.style.removeProperty("scroll-snap-type");const o=t.scrollLeft,r=t.scrollTop;t.style.setProperty("scroll-snap-type","unset"),t.scrollTo({left:i,top:s,behavior:"auto"}),t.scrollTo({left:o,top:r,behavior:(0,l.nk)()?"auto":"smooth"}),this.scrolling&&await(0,a.m)(t,"scrollend"),t.style.removeProperty("scroll-snap-type"),e.requestUpdate()}};(0,h.u2)([(100,(e,t,i)=>{const s=i.value;i.value=function(...e){clearTimeout(this[d]),this[d]=window.setTimeout((()=>{s.apply(this,e)}),100)}})],c.prototype,"handleScrollEnd",1);var u=i(6412),p=i(1862),g=i(5710),v=i(5381),m=i(8424),b=class extends m.P{constructor(){super(...arguments),this.loop=!1,this.navigation=!1,this.pagination=!1,this.autoplay=!1,this.autoplayInterval=3e3,this.slidesPerPage=1,this.slidesPerMove=1,this.orientation="horizontal",this.mouseDragging=!1,this.activeSlide=0,this.autoplayController=new class{constructor(e,t){this.timerId=0,this.activeInteractions=0,this.paused=!1,this.stopped=!0,this.pause=()=>{this.activeInteractions++||(this.paused=!0,this.host.requestUpdate())},this.resume=()=>{--this.activeInteractions||(this.paused=!1,this.host.requestUpdate())},e.addController(this),this.host=e,this.tickCallback=t}hostConnected(){this.host.addEventListener("mouseenter",this.pause),this.host.addEventListener("mouseleave",this.resume),this.host.addEventListener("focusin",this.pause),this.host.addEventListener("focusout",this.resume),this.host.addEventListener("touchstart",this.pause,{passive:!0}),this.host.addEventListener("touchend",this.resume)}hostDisconnected(){this.stop(),this.host.removeEventListener("mouseenter",this.pause),this.host.removeEventListener("mouseleave",this.resume),this.host.removeEventListener("focusin",this.pause),this.host.removeEventListener("focusout",this.resume),this.host.removeEventListener("touchstart",this.pause),this.host.removeEventListener("touchend",this.resume)}start(e){this.stop(),this.stopped=!1,this.timerId=window.setInterval((()=>{this.paused||this.tickCallback()}),e)}stop(){clearInterval(this.timerId),this.stopped=!0,this.host.requestUpdate()}}(this,(()=>this.next())),this.scrollController=new c(this),this.slides=this.getElementsByTagName("sl-carousel-item"),this.intersectionObserverEntries=new Map,this.localize=new p.V(this)}connectedCallback(){super.connectedCallback(),this.setAttribute("role","region"),this.setAttribute("aria-label",this.localize.term("carousel"));const e=new IntersectionObserver((e=>{e.forEach((e=>{this.intersectionObserverEntries.set(e.target,e);const t=e.target;t.toggleAttribute("inert",!e.isIntersecting),t.classList.toggle("--in-view",e.isIntersecting),t.setAttribute("aria-hidden",e.isIntersecting?"false":"true")}))}),{root:this,threshold:.6});this.intersectionObserver=e,e.takeRecords().forEach((e=>{this.intersectionObserverEntries.set(e.target,e)}))}disconnectedCallback(){super.disconnectedCallback(),this.intersectionObserver.disconnect(),this.mutationObserver.disconnect()}firstUpdated(){this.initializeSlides(),this.mutationObserver=new MutationObserver(this.handleSlotChange.bind(this)),this.mutationObserver.observe(this,{childList:!0,subtree:!1})}getPageCount(){return Math.ceil(this.getSlides().length/this.slidesPerPage)}getCurrentPage(){return Math.floor(this.activeSlide/this.slidesPerPage)}getSlides({excludeClones:e=!0}={}){return[...this.slides].filter((t=>!e||!t.hasAttribute("data-clone")))}handleKeyDown(e){if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key)){const t=e.target,i="rtl"===this.localize.dir(),s=null!==t.closest('[part~="pagination-item"]'),o="ArrowDown"===e.key||!i&&"ArrowRight"===e.key||i&&"ArrowLeft"===e.key,r="ArrowUp"===e.key||!i&&"ArrowLeft"===e.key||i&&"ArrowRight"===e.key;e.preventDefault(),r&&this.previous(),o&&this.next(),"Home"===e.key&&this.goToSlide(0),"End"===e.key&&this.goToSlide(this.getSlides().length-1),s&&this.updateComplete.then((()=>{var e;const t=null==(e=this.shadowRoot)?void 0:e.querySelector('[part~="pagination-item--active"]');t&&t.focus()}))}}handleScrollEnd(){const e=this.getSlides(),t=[...this.intersectionObserverEntries.values()].find((e=>e.isIntersecting));if(this.loop&&(null==t?void 0:t.target.hasAttribute("data-clone"))){const e=Number(t.target.getAttribute("data-clone"));this.goToSlide(e,"auto")}else t&&(this.activeSlide=e.indexOf(t.target))}handleSlotChange(e){e.some((e=>[...e.addedNodes,...e.removedNodes].some((e=>u.j.isCarouselItem(e)&&!e.hasAttribute("data-clone")))))&&this.initializeSlides(),this.requestUpdate()}initializeSlides(){const e=this.getSlides(),t=this.intersectionObserver;if(this.intersectionObserverEntries.clear(),this.getSlides({excludeClones:!1}).forEach(((e,i)=>{t.unobserve(e),e.classList.remove("--in-view"),e.classList.remove("--is-active"),e.setAttribute("aria-label",this.localize.term("slideNum",i+1)),e.hasAttribute("data-clone")&&e.remove()})),this.loop){const t=this.slidesPerPage,i=e.slice(-t),s=e.slice(0,t);i.reverse().forEach(((t,i)=>{const s=t.cloneNode(!0);s.setAttribute("data-clone",String(e.length-i-1)),this.prepend(s)})),s.forEach(((e,t)=>{const i=e.cloneNode(!0);i.setAttribute("data-clone",String(t)),this.append(i)}))}this.getSlides({excludeClones:!1}).forEach((e=>{t.observe(e)})),this.goToSlide(this.activeSlide,"auto")}handelSlideChange(){const e=this.getSlides();e.forEach(((e,t)=>{e.classList.toggle("--is-active",t===this.activeSlide)})),this.hasUpdated&&this.emit("sl-slide-change",{detail:{index:this.activeSlide,slide:e[this.activeSlide]}})}handleSlidesPerMoveChange(){const e=this.getSlides({excludeClones:!1}),t=this.slidesPerMove;e.forEach(((e,i)=>{Math.abs(i-t)%t==0?e.style.removeProperty("scroll-snap-align"):e.style.setProperty("scroll-snap-align","none")}))}handleAutoplayChange(){this.autoplayController.stop(),this.autoplay&&this.autoplayController.start(this.autoplayInterval)}handleMouseDraggingChange(){this.scrollController.mouseDragging=this.mouseDragging}previous(e="smooth"){this.goToSlide(this.activeSlide-this.slidesPerMove,e)}next(e="smooth"){this.goToSlide(this.activeSlide+this.slidesPerMove,e)}goToSlide(e,t="smooth"){const{slidesPerPage:i,loop:o,scrollContainer:r}=this,n=this.getSlides(),a=this.getSlides({excludeClones:!1}),h=(e+n.length)%n.length;this.activeSlide=h;const d=a[(0,s.u)(e+(o?i:0),0,a.length-1)],c=r.getBoundingClientRect(),u=d.getBoundingClientRect();r.scrollTo({left:u.left-c.left+r.scrollLeft,top:u.top-c.top+r.scrollTop,behavior:(0,l.nk)()?"auto":t})}render(){const{scrollController:e,slidesPerPage:t}=this,i=this.getPageCount(),s=this.getCurrentPage(),o=this.loop||s>0,n=this.loop||s<i-1,a="ltr"===this.localize.dir();return r.y`
      <div part="base" class="carousel">
        <div
          id="scroll-container"
          part="scroll-container"
          class="${(0,v.o)({carousel__slides:!0,"carousel__slides--horizontal":"horizontal"===this.orientation,"carousel__slides--vertical":"vertical"===this.orientation})}"
          style="--slides-per-page: ${this.slidesPerPage};"
          aria-busy="${e.scrolling?"true":"false"}"
          aria-atomic="true"
          tabindex="0"
          @keydown=${this.handleKeyDown}
          @scrollend=${this.handleScrollEnd}
        >
          <slot></slot>
        </div>

        ${this.navigation?r.y`
              <div part="navigation" class="carousel__navigation">
                <button
                  part="navigation-button navigation-button--previous"
                  class="${(0,v.o)({"carousel__navigation-button":!0,"carousel__navigation-button--previous":!0,"carousel__navigation-button--disabled":!o})}"
                  aria-label="${this.localize.term("previousSlide")}"
                  aria-controls="scroll-container"
                  aria-disabled="${o?"false":"true"}"
                  @click=${o?()=>this.previous():null}
                >
                  <slot name="previous-icon">
                    <sl-icon library="system" name="${a?"chevron-left":"chevron-right"}"></sl-icon>
                  </slot>
                </button>

                <button
                  part="navigation-button navigation-button--next"
                  class=${(0,v.o)({"carousel__navigation-button":!0,"carousel__navigation-button--next":!0,"carousel__navigation-button--disabled":!n})}
                  aria-label="${this.localize.term("nextSlide")}"
                  aria-controls="scroll-container"
                  aria-disabled="${n?"false":"true"}"
                  @click=${n?()=>this.next():null}
                >
                  <slot name="next-icon">
                    <sl-icon library="system" name="${a?"chevron-right":"chevron-left"}"></sl-icon>
                  </slot>
                </button>
              </div>
            `:""}
        ${this.pagination?r.y`
              <div part="pagination" role="tablist" class="carousel__pagination" aria-controls="scroll-container">
                ${function*(e,t){if(void 0!==e){let i=0;for(const s of e)yield t(s,i++)}}(function*(e,t,i=1){const s=void 0===t?0:e;null!=t||(t=e);for(let e=s;i>0?e<t:t<e;e+=i)yield e}(i),(e=>{const o=e===s;return r.y`
                    <button
                      part="pagination-item ${o?"pagination-item--active":""}"
                      class="${(0,v.o)({"carousel__pagination-item":!0,"carousel__pagination-item--active":o})}"
                      role="tab"
                      aria-selected="${o?"true":"false"}"
                      aria-label="${this.localize.term("goToSlide",e+1,i)}"
                      tabindex=${o?"0":"-1"}
                      @click=${()=>this.goToSlide(e*t)}
                      @keydown=${this.handleKeyDown}
                    ></button>
                  `}))}
              </div>
            `:""}
      </div>
    `}};b.styles=n,(0,h.u2)([(0,m.e2)({type:Boolean,reflect:!0})],b.prototype,"loop",2),(0,h.u2)([(0,m.e2)({type:Boolean,reflect:!0})],b.prototype,"navigation",2),(0,h.u2)([(0,m.e2)({type:Boolean,reflect:!0})],b.prototype,"pagination",2),(0,h.u2)([(0,m.e2)({type:Boolean,reflect:!0})],b.prototype,"autoplay",2),(0,h.u2)([(0,m.e2)({type:Number,attribute:"autoplay-interval"})],b.prototype,"autoplayInterval",2),(0,h.u2)([(0,m.e2)({type:Number,attribute:"slides-per-page"})],b.prototype,"slidesPerPage",2),(0,h.u2)([(0,m.e2)({type:Number,attribute:"slides-per-move"})],b.prototype,"slidesPerMove",2),(0,h.u2)([(0,m.e2)()],b.prototype,"orientation",2),(0,h.u2)([(0,m.e2)({type:Boolean,reflect:!0,attribute:"mouse-dragging"})],b.prototype,"mouseDragging",2),(0,h.u2)([(0,m.i)("slot:not([name])")],b.prototype,"defaultSlot",2),(0,h.u2)([(0,m.i)(".carousel__slides")],b.prototype,"scrollContainer",2),(0,h.u2)([(0,m.i)(".carousel__pagination")],b.prototype,"paginationContainer",2),(0,h.u2)([(0,m.t)()],b.prototype,"activeSlide",2),(0,h.u2)([(0,g.Y)("loop",{waitUntilFirstUpdate:!0}),(0,g.Y)("slidesPerPage",{waitUntilFirstUpdate:!0})],b.prototype,"initializeSlides",1),(0,h.u2)([(0,g.Y)("activeSlide")],b.prototype,"handelSlideChange",1),(0,h.u2)([(0,g.Y)("slidesPerMove")],b.prototype,"handleSlidesPerMoveChange",1),(0,h.u2)([(0,g.Y)("autoplay")],b.prototype,"handleAutoplayChange",1),(0,h.u2)([(0,g.Y)("mouseDragging")],b.prototype,"handleMouseDraggingChange",1),b=(0,h.u2)([(0,m.e)("sl-carousel")],b),i(8315),i(9940),i(9191),i(836),i(2759),i(1939),i(4370)}}]);
//# sourceMappingURL=9632.f64486ba.js.map