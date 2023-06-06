"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[2493],{7299:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    --control-box-size: 3rem;
    --icon-size: calc(var(--control-box-size) * 0.625);

    display: inline-flex;
    position: relative;
    cursor: pointer;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
  }

  img[aria-hidden='true'] {
    display: none;
  }

  .animated-image__control-box {
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    top: calc(50% - var(--control-box-size) / 2);
    right: calc(50% - var(--control-box-size) / 2);
    width: var(--control-box-size);
    height: var(--control-box-size);
    font-size: var(--icon-size);
    background: none;
    border: solid 2px currentColor;
    background-color: rgb(0 0 0 /50%);
    border-radius: var(--sl-border-radius-circle);
    color: white;
    pointer-events: none;
    transition: var(--sl-transition-fast) opacity;
  }

  :host([play]:hover) .animated-image__control-box {
    opacity: 1;
  }

  :host([play]:not(:hover)) .animated-image__control-box {
    opacity: 0;
  }

  :host([play]) slot[name='play-icon'],
  :host(:not([play])) slot[name='pause-icon'] {
    display: none;
  }
`,s=i(5710),l=i(8424),n=i(453),d=class extends l.P{constructor(){super(...arguments),this.isLoaded=!1}handleClick(){this.play=!this.play}handleLoad(){const e=document.createElement("canvas"),{width:t,height:i}=this.animatedImage;e.width=t,e.height=i,e.getContext("2d").drawImage(this.animatedImage,0,0,t,i),this.frozenFrame=e.toDataURL("image/gif"),this.isLoaded||(this.emit("sl-load"),this.isLoaded=!0)}handleError(){this.emit("sl-error")}handlePlayChange(){this.play&&(this.animatedImage.src="",this.animatedImage.src=this.src)}handleSrcChange(){this.isLoaded=!1}render(){return a.y`
      <div class="animated-image">
        <img
          class="animated-image__animated"
          src=${this.src}
          alt=${this.alt}
          crossorigin="anonymous"
          aria-hidden=${this.play?"false":"true"}
          @click=${this.handleClick}
          @load=${this.handleLoad}
          @error=${this.handleError}
        />

        ${this.isLoaded?a.y`
              <img
                class="animated-image__frozen"
                src=${this.frozenFrame}
                alt=${this.alt}
                aria-hidden=${this.play?"true":"false"}
                @click=${this.handleClick}
              />

              <div part="control-box" class="animated-image__control-box">
                <slot name="play-icon"><sl-icon name="play-fill" library="system"></sl-icon></slot>
                <slot name="pause-icon"><sl-icon name="pause-fill" library="system"></sl-icon></slot>
              </div>
            `:""}
      </div>
    `}};d.styles=o,(0,n.u2)([(0,l.i)(".animated-image__animated")],d.prototype,"animatedImage",2),(0,n.u2)([(0,l.t)()],d.prototype,"frozenFrame",2),(0,n.u2)([(0,l.t)()],d.prototype,"isLoaded",2),(0,n.u2)([(0,l.e2)()],d.prototype,"src",2),(0,n.u2)([(0,l.e2)()],d.prototype,"alt",2),(0,n.u2)([(0,l.e2)({type:Boolean,reflect:!0})],d.prototype,"play",2),(0,n.u2)([(0,s.Y)("play",{waitUntilFirstUpdate:!0})],d.prototype,"handlePlayChange",1),(0,n.u2)([(0,s.Y)("src")],d.prototype,"handleSrcChange",1),d=(0,n.u2)([(0,l.e)("sl-animated-image")],d),i(9940),i(9191),i(836),i(2759),i(1939)},7794:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    display: inline-block;

    --size: 3rem;
  }

  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: var(--size);
    height: var(--size);
    background-color: var(--sl-color-neutral-400);
    font-family: var(--sl-font-sans);
    font-size: calc(var(--size) * 0.5);
    font-weight: var(--sl-font-weight-normal);
    color: var(--sl-color-neutral-0);
    user-select: none;
    vertical-align: middle;
  }

  .avatar--circle,
  .avatar--circle .avatar__image {
    border-radius: var(--sl-border-radius-circle);
  }

  .avatar--rounded,
  .avatar--rounded .avatar__image {
    border-radius: var(--sl-border-radius-medium);
  }

  .avatar--square {
    border-radius: 0;
  }

  .avatar__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .avatar__initials {
    line-height: 1;
    text-transform: uppercase;
  }

  .avatar__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
  }
`,s=i(5710),l=i(5381),n=i(8424),d=i(453),h=class extends n.P{constructor(){super(...arguments),this.hasError=!1,this.image="",this.label="",this.initials="",this.loading="eager",this.shape="circle"}handleImageChange(){this.hasError=!1}render(){const e=a.y`
      <img
        part="image"
        class="avatar__image"
        src="${this.image}"
        loading="${this.loading}"
        alt=""
        @error="${()=>this.hasError=!0}"
      />
    `;let t=a.y``;return t=this.initials?a.y`<div part="initials" class="avatar__initials">${this.initials}</div>`:a.y`
        <slot name="icon" part="icon" class="avatar__icon" aria-hidden="true">
          <sl-icon name="person-fill" library="system"></sl-icon>
        </slot>
      `,a.y`
      <div
        part="base"
        class=${(0,l.o)({avatar:!0,"avatar--circle":"circle"===this.shape,"avatar--rounded":"rounded"===this.shape,"avatar--square":"square"===this.shape})}
        role="img"
        aria-label=${this.label}
      >
        ${this.image&&!this.hasError?e:t}
      </div>
    `}};h.styles=o,(0,d.u2)([(0,n.t)()],h.prototype,"hasError",2),(0,d.u2)([(0,n.e2)()],h.prototype,"image",2),(0,d.u2)([(0,n.e2)()],h.prototype,"label",2),(0,d.u2)([(0,n.e2)()],h.prototype,"initials",2),(0,d.u2)([(0,n.e2)()],h.prototype,"loading",2),(0,d.u2)([(0,n.e2)({reflect:!0})],h.prototype,"shape",2),(0,d.u2)([(0,s.Y)("image")],h.prototype,"handleImageChange",1),h=(0,d.u2)([(0,n.e)("sl-avatar")],h),i(9940),i(9191),i(836),i(2759),i(1939),i(4370)},9282:(e,t,i)=>{var r=i(5381),a=i(8424),o=i(6281),s=i(5954),l=s.i`
  ${o.N}

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
`,n=i(453),d=class extends a.P{constructor(){super(...arguments),this.variant="primary",this.pill=!1,this.pulse=!1}render(){return s.y`
      <slot
        part="base"
        class=${(0,r.o)({badge:!0,"badge--primary":"primary"===this.variant,"badge--success":"success"===this.variant,"badge--neutral":"neutral"===this.variant,"badge--warning":"warning"===this.variant,"badge--danger":"danger"===this.variant,"badge--pill":this.pill,"badge--pulse":this.pulse})}
        role="status"
      ></slot>
    `}};d.styles=l,(0,n.u2)([(0,a.e2)({reflect:!0})],d.prototype,"variant",2),(0,n.u2)([(0,a.e2)({type:Boolean,reflect:!0})],d.prototype,"pill",2),(0,n.u2)([(0,a.e2)({type:Boolean,reflect:!0})],d.prototype,"pulse",2),d=(0,n.u2)([(0,a.e)("sl-badge")],d),i(4370)},623:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    display: inline-flex;
  }

  .breadcrumb-item {
    display: inline-flex;
    align-items: center;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-neutral-600);
    line-height: var(--sl-line-height-normal);
    white-space: nowrap;
  }

  .breadcrumb-item__label {
    display: inline-block;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    text-decoration: none;
    color: inherit;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    padding: 0;
    margin: 0;
    cursor: pointer;
    transition: var(--sl-transition-fast) --color;
  }

  :host(:not(:last-of-type)) .breadcrumb-item__label {
    color: var(--sl-color-primary-600);
  }

  :host(:not(:last-of-type)) .breadcrumb-item__label:hover {
    color: var(--sl-color-primary-500);
  }

  :host(:not(:last-of-type)) .breadcrumb-item__label:active {
    color: var(--sl-color-primary-600);
  }

  .breadcrumb-item__label:focus {
    outline: none;
  }

  .breadcrumb-item__label:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .breadcrumb-item__prefix,
  .breadcrumb-item__suffix {
    display: none;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .breadcrumb-item--has-prefix .breadcrumb-item__prefix {
    display: inline-flex;
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .breadcrumb-item--has-suffix .breadcrumb-item__suffix {
    display: inline-flex;
    margin-inline-start: var(--sl-spacing-x-small);
  }

  :host(:last-of-type) .breadcrumb-item__separator {
    display: none;
  }

  .breadcrumb-item__separator {
    display: inline-flex;
    align-items: center;
    margin: 0 var(--sl-spacing-x-small);
    user-select: none;
  }
`,s=i(8734),l=i(3515),n=i(5381),d=i(8424),h=i(453),c=class extends d.P{constructor(){super(...arguments),this.hasSlotController=new l.r(this,"prefix","suffix"),this.rel="noreferrer noopener"}render(){const e=!!this.href;return a.y`
      <div
        part="base"
        class=${(0,n.o)({"breadcrumb-item":!0,"breadcrumb-item--has-prefix":this.hasSlotController.test("prefix"),"breadcrumb-item--has-suffix":this.hasSlotController.test("suffix")})}
      >
        <slot name="prefix" part="prefix" class="breadcrumb-item__prefix"></slot>

        ${e?a.y`
              <a
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--link"
                href="${this.href}"
                target="${(0,s.l)(this.target?this.target:void 0)}"
                rel=${(0,s.l)(this.target?this.rel:void 0)}
              >
                <slot></slot>
              </a>
            `:a.y`
              <button part="label" type="button" class="breadcrumb-item__label breadcrumb-item__label--button">
                <slot></slot>
              </button>
            `}

        <slot name="suffix" part="suffix" class="breadcrumb-item__suffix"></slot>

        <slot name="separator" part="separator" class="breadcrumb-item__separator" aria-hidden="true"></slot>
      </div>
    `}};c.styles=o,(0,h.u2)([(0,d.e2)()],c.prototype,"href",2),(0,h.u2)([(0,d.e2)()],c.prototype,"target",2),(0,h.u2)([(0,d.e2)()],c.prototype,"rel",2),c=(0,h.u2)([(0,d.e)("sl-breadcrumb-item")],c),i(4370)},1310:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
`,s=i(8379),l=i(8424),n=i(453),d=class extends l.P{constructor(){super(...arguments),this.localize=new s.V(this),this.separatorDir=this.localize.dir(),this.label=""}getSeparator(){const e=this.separatorSlot.assignedElements({flatten:!0})[0].cloneNode(!0);return[e,...e.querySelectorAll("[id]")].forEach((e=>e.removeAttribute("id"))),e.setAttribute("data-default",""),e.slot="separator",e}handleSlotChange(){const e=[...this.defaultSlot.assignedElements({flatten:!0})].filter((e=>"sl-breadcrumb-item"===e.tagName.toLowerCase()));e.forEach(((t,i)=>{const r=t.querySelector('[slot="separator"]');null===r?t.append(this.getSeparator()):r.hasAttribute("data-default")&&r.replaceWith(this.getSeparator()),i===e.length-1?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current")}))}render(){return this.separatorDir!==this.localize.dir()&&(this.separatorDir=this.localize.dir(),this.updateComplete.then((()=>this.handleSlotChange()))),a.y`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>

      <slot name="separator" hidden aria-hidden="true">
        <sl-icon name=${"rtl"===this.localize.dir()?"chevron-left":"chevron-right"} library="system"></sl-icon>
      </slot>
    `}};d.styles=o,(0,n.u2)([(0,l.i)("slot")],d.prototype,"defaultSlot",2),(0,n.u2)([(0,l.i)('slot[name="separator"]')],d.prototype,"separatorSlot",2),(0,n.u2)([(0,l.e2)()],d.prototype,"label",2),d=(0,n.u2)([(0,l.e)("sl-breadcrumb")],d),i(1862),i(9940),i(9191),i(836),i(2759),i(1939),i(5710)},4299:(e,t,i)=>{i(9340),i(7918),i(8424),i(6281),i(5954),i(453)},4775:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    --border-color: var(--sl-color-neutral-200);
    --border-radius: var(--sl-border-radius-medium);
    --border-width: 1px;
    --padding: var(--sl-spacing-large);

    display: inline-block;
  }

  .card {
    display: flex;
    flex-direction: column;
    background-color: var(--sl-panel-background-color);
    box-shadow: var(--sl-shadow-x-small);
    border: solid var(--border-width) var(--border-color);
    border-radius: var(--border-radius);
  }

  .card__image {
    display: flex;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    margin: calc(-1 * var(--border-width));
    overflow: hidden;
  }

  .card__image::slotted(img) {
    display: block;
    width: 100%;
  }

  .card:not(.card--has-image) .card__image {
    display: none;
  }

  .card__header {
    display: block;
    border-bottom: solid var(--border-width) var(--border-color);
    padding: calc(var(--padding) / 2) var(--padding);
  }

  .card:not(.card--has-header) .card__header {
    display: none;
  }

  .card:not(.card--has-image) .card__header {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  .card__body {
    display: block;
    padding: var(--padding);
  }

  .card--has-footer .card__footer {
    display: block;
    border-top: solid var(--border-width) var(--border-color);
    padding: var(--padding);
  }

  .card:not(.card--has-footer) .card__footer {
    display: none;
  }
`,s=i(3515),l=i(5381),n=i(8424),d=i(453),h=class extends n.P{constructor(){super(...arguments),this.hasSlotController=new s.r(this,"footer","header","image")}render(){return a.y`
      <div
        part="base"
        class=${(0,l.o)({card:!0,"card--has-footer":this.hasSlotController.test("footer"),"card--has-image":this.hasSlotController.test("image"),"card--has-header":this.hasSlotController.test("header")})}
      >
        <slot name="image" part="image" class="card__image"></slot>
        <slot name="header" part="header" class="card__header"></slot>
        <slot part="body" class="card__body"></slot>
        <slot name="footer" part="footer" class="card__footer"></slot>
      </div>
    `}};h.styles=o,h=(0,d.u2)([(0,n.e)("sl-card")],h),i(4370)},8629:(e,t,i)=>{i(2518),i(4617),i(4577),i(2626),i(3480),i(8734),i(9940),i(9191),i(836),i(2759),i(1939),i(5710),i(5381),i(4370),i(8424),i(6281),i(5954),i(453)},2087:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    display: block;
  }

  .details {
    border: solid 1px var(--sl-color-neutral-200);
    border-radius: var(--sl-border-radius-medium);
    background-color: var(--sl-color-neutral-0);
    overflow-anchor: none;
  }

  .details--disabled {
    opacity: 0.5;
  }

  .details__header {
    display: flex;
    align-items: center;
    border-radius: inherit;
    padding: var(--sl-spacing-medium);
    user-select: none;
    cursor: pointer;
  }

  .details__header:focus {
    outline: none;
  }

  .details__header:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: calc(1px + var(--sl-focus-ring-offset));
  }

  .details--disabled .details__header {
    cursor: not-allowed;
  }

  .details--disabled .details__header:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .details__summary {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }

  .details__summary-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--sl-transition-medium) rotate ease;
  }

  .details--open .details__summary-icon {
    rotate: 90deg;
  }

  .details--open.details--rtl .details__summary-icon {
    rotate: -90deg;
  }

  .details--open slot[name='expand-icon'],
  .details:not(.details--open) slot[name='collapse-icon'] {
    display: none;
  }

  .details__body {
    overflow: hidden;
  }

  .details__content {
    display: block;
    padding: var(--sl-spacing-medium);
  }
`,s=i(2486),l=i(4867),n=i(9745),d=i(8379),h=i(5710),c=i(5381),u=i(8424),p=i(453),m=class extends u.P{constructor(){super(...arguments),this.localize=new d.V(this),this.open=!1,this.disabled=!1}firstUpdated(){this.body.hidden=!this.open,this.body.style.height=this.open?"auto":"0"}handleSummaryClick(){this.disabled||(this.open?this.hide():this.show(),this.header.focus())}handleSummaryKeyDown(e){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this.open?this.hide():this.show()),"ArrowUp"!==e.key&&"ArrowLeft"!==e.key||(e.preventDefault(),this.hide()),"ArrowDown"!==e.key&&"ArrowRight"!==e.key||(e.preventDefault(),this.show())}async handleOpenChange(){if(this.open){if(this.emit("sl-show",{cancelable:!0}).defaultPrevented)return void(this.open=!1);await(0,n.U_)(this.body),this.body.hidden=!1;const{keyframes:e,options:t}=(0,s.O8)(this,"details.show",{dir:this.localize.dir()});await(0,n.nv)(this.body,(0,n.GH)(e,this.body.scrollHeight),t),this.body.style.height="auto",this.emit("sl-after-show")}else{if(this.emit("sl-hide",{cancelable:!0}).defaultPrevented)return void(this.open=!0);await(0,n.U_)(this.body);const{keyframes:e,options:t}=(0,s.O8)(this,"details.hide",{dir:this.localize.dir()});await(0,n.nv)(this.body,(0,n.GH)(e,this.body.scrollHeight),t),this.body.hidden=!0,this.body.style.height="auto",this.emit("sl-after-hide")}}async show(){if(!this.open&&!this.disabled)return this.open=!0,(0,l.m)(this,"sl-after-show")}async hide(){if(this.open&&!this.disabled)return this.open=!1,(0,l.m)(this,"sl-after-hide")}render(){const e="rtl"===this.localize.dir();return a.y`
      <div
        part="base"
        class=${(0,c.o)({details:!0,"details--open":this.open,"details--disabled":this.disabled,"details--rtl":e})}
      >
        <div
          part="header"
          id="header"
          class="details__header"
          role="button"
          aria-expanded=${this.open?"true":"false"}
          aria-controls="content"
          aria-disabled=${this.disabled?"true":"false"}
          tabindex=${this.disabled?"-1":"0"}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <slot name="summary" part="summary" class="details__summary">${this.summary}</slot>

          <span part="summary-icon" class="details__summary-icon">
            <slot name="expand-icon">
              <sl-icon library="system" name=${e?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
            <slot name="collapse-icon">
              <sl-icon library="system" name=${e?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
          </span>
        </div>

        <div class="details__body" role="region" aria-labelledby="header">
          <slot part="content" id="content" class="details__content"></slot>
        </div>
      </div>
    `}};m.styles=o,(0,p.u2)([(0,u.i)(".details")],m.prototype,"details",2),(0,p.u2)([(0,u.i)(".details__header")],m.prototype,"header",2),(0,p.u2)([(0,u.i)(".details__body")],m.prototype,"body",2),(0,p.u2)([(0,u.i)(".details__expand-icon-slot")],m.prototype,"expandIconSlot",2),(0,p.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"open",2),(0,p.u2)([(0,u.e2)()],m.prototype,"summary",2),(0,p.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"disabled",2),(0,p.u2)([(0,h.Y)("open",{waitUntilFirstUpdate:!0})],m.prototype,"handleOpenChange",1),m=(0,p.u2)([(0,u.e)("sl-details")],m),(0,s.jx)("details.show",{keyframes:[{height:"0",opacity:"0"},{height:"auto",opacity:"1"}],options:{duration:250,easing:"linear"}}),(0,s.jx)("details.hide",{keyframes:[{height:"auto",opacity:"1"},{height:"0",opacity:"0"}],options:{duration:250,easing:"linear"}}),i(1862),i(9940),i(9191),i(836),i(2759),i(1939),i(4370)},2924:(e,t,i)=>{var r=i(6281),a=i(5954).i`
  ${r.N}

  :host {
    --color: var(--sl-panel-border-color);
    --width: var(--sl-panel-border-width);
    --spacing: var(--sl-spacing-medium);
  }

  :host(:not([vertical])) {
    display: block;
    border-top: solid var(--width) var(--color);
    margin: var(--spacing) 0;
  }

  :host([vertical]) {
    display: inline-block;
    height: 100%;
    border-left: solid var(--width) var(--color);
    margin: 0 var(--spacing);
  }
`,o=i(5710),s=i(8424),l=i(453),n=class extends s.P{constructor(){super(...arguments),this.vertical=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","separator")}handleVerticalChange(){this.setAttribute("aria-orientation",this.vertical?"vertical":"horizontal")}};n.styles=a,(0,l.u2)([(0,s.e2)({type:Boolean,reflect:!0})],n.prototype,"vertical",2),(0,l.u2)([(0,o.Y)("vertical")],n.prototype,"handleVerticalChange",1),n=(0,l.u2)([(0,s.e)("sl-divider")],n)},8878:(e,t,i)=>{var r=i(3897),a=i(9622),o=i(6281),s=i(5954),l=s.i`
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
`,n=i(2486),d=i(4867),h=i(9745),c=i(8734),u=i(3515),p=i(8379),m=i(5710),b=i(5381),v=i(8424),g=i(453);function y(e){return e.charAt(0).toUpperCase()+e.slice(1)}var f=class extends v.P{constructor(){super(...arguments),this.hasSlotController=new u.r(this,"footer"),this.localize=new p.V(this),this.open=!1,this.label="",this.placement="end",this.contained=!1,this.noHeader=!1}connectedCallback(){super.connectedCallback(),this.handleDocumentKeyDown=this.handleDocumentKeyDown.bind(this),this.modal=new r.u(this)}firstUpdated(){this.drawer.hidden=!this.open,this.open&&(this.addOpenListeners(),this.contained||(this.modal.activate(),(0,a.M4)(this)))}disconnectedCallback(){super.disconnectedCallback(),(0,a.gG)(this)}requestClose(e){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:e}}).defaultPrevented){const e=(0,n.O8)(this,"drawer.denyClose",{dir:this.localize.dir()});(0,h.nv)(this.panel,e.keyframes,e.options)}else this.hide()}addOpenListeners(){document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){document.removeEventListener("keydown",this.handleDocumentKeyDown)}handleDocumentKeyDown(e){this.open&&!this.contained&&"Escape"===e.key&&(e.stopPropagation(),this.requestClose("keyboard"))}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),(0,a.M4)(this));const e=this.querySelector("[autofocus]");e&&e.removeAttribute("autofocus"),await Promise.all([(0,h.U_)(this.drawer),(0,h.U_)(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame((()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute("autofocus","")}));const t=(0,n.O8)(this,`drawer.show${y(this.placement)}`,{dir:this.localize.dir()}),i=(0,n.O8)(this,"drawer.overlay.show",{dir:this.localize.dir()});await Promise.all([(0,h.nv)(this.panel,t.keyframes,t.options),(0,h.nv)(this.overlay,i.keyframes,i.options)]),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),this.contained||(this.modal.deactivate(),(0,a.gG)(this)),await Promise.all([(0,h.U_)(this.drawer),(0,h.U_)(this.overlay)]);const e=(0,n.O8)(this,`drawer.hide${y(this.placement)}`,{dir:this.localize.dir()}),t=(0,n.O8)(this,"drawer.overlay.hide",{dir:this.localize.dir()});await Promise.all([(0,h.nv)(this.overlay,t.keyframes,t.options).then((()=>{this.overlay.hidden=!0})),(0,h.nv)(this.panel,e.keyframes,e.options).then((()=>{this.panel.hidden=!0}))]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;const i=this.originalTrigger;"function"==typeof(null==i?void 0:i.focus)&&setTimeout((()=>i.focus())),this.emit("sl-after-hide")}}handleNoModalChange(){this.open&&!this.contained&&(this.modal.activate(),(0,a.M4)(this)),this.open&&this.contained&&(this.modal.deactivate(),(0,a.gG)(this))}async show(){if(!this.open)return this.open=!0,(0,d.m)(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,(0,d.m)(this,"sl-after-hide")}render(){return s.y`
      <div
        part="base"
        class=${(0,b.o)({drawer:!0,"drawer--open":this.open,"drawer--top":"top"===this.placement,"drawer--end":"end"===this.placement,"drawer--bottom":"bottom"===this.placement,"drawer--start":"start"===this.placement,"drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":"rtl"===this.localize.dir(),"drawer--has-footer":this.hasSlotController.test("footer")})}
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
    `}};f.styles=l,(0,g.u2)([(0,v.i)(".drawer")],f.prototype,"drawer",2),(0,g.u2)([(0,v.i)(".drawer__panel")],f.prototype,"panel",2),(0,g.u2)([(0,v.i)(".drawer__overlay")],f.prototype,"overlay",2),(0,g.u2)([(0,v.e2)({type:Boolean,reflect:!0})],f.prototype,"open",2),(0,g.u2)([(0,v.e2)({reflect:!0})],f.prototype,"label",2),(0,g.u2)([(0,v.e2)({reflect:!0})],f.prototype,"placement",2),(0,g.u2)([(0,v.e2)({type:Boolean,reflect:!0})],f.prototype,"contained",2),(0,g.u2)([(0,v.e2)({attribute:"no-header",type:Boolean,reflect:!0})],f.prototype,"noHeader",2),(0,g.u2)([(0,m.Y)("open",{waitUntilFirstUpdate:!0})],f.prototype,"handleOpenChange",1),(0,g.u2)([(0,m.Y)("contained",{waitUntilFirstUpdate:!0})],f.prototype,"handleNoModalChange",1),f=(0,g.u2)([(0,v.e)("sl-drawer")],f),(0,n.jx)("drawer.showTop",{keyframes:[{opacity:0,translate:"0 -100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),(0,n.jx)("drawer.hideTop",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 -100%"}],options:{duration:250,easing:"ease"}}),(0,n.jx)("drawer.showEnd",{keyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),(0,n.jx)("drawer.hideEnd",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],options:{duration:250,easing:"ease"}}),(0,n.jx)("drawer.showBottom",{keyframes:[{opacity:0,translate:"0 100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),(0,n.jx)("drawer.hideBottom",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 100%"}],options:{duration:250,easing:"ease"}}),(0,n.jx)("drawer.showStart",{keyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),(0,n.jx)("drawer.hideStart",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],options:{duration:250,easing:"ease"}}),(0,n.jx)("drawer.denyClose",{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}}),(0,n.jx)("drawer.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),(0,n.jx)("drawer.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),i(3149),i(4073),i(3251),i(1862),i(9940),i(9191),i(836),i(2759),i(1939),i(4370)},3387:(e,t,i)=>{i(9157),i(6789),i(1732),i(8977),i(2486),i(9745),i(8379),i(1862),i(5710),i(5381),i(4370),i(8424),i(6281),i(5954),i(453)},5642:(e,t,i)=>{var r=i(8379),a=i(8424),o=i(453),s=class extends a.P{constructor(){super(...arguments),this.localize=new r.V(this),this.value=0,this.unit="byte",this.display="short"}render(){if(isNaN(this.value))return"";const e="bit"===this.unit?["","kilo","mega","giga","tera"]:["","kilo","mega","giga","tera","peta"],t=Math.max(0,Math.min(Math.floor(Math.log10(this.value)/3),e.length-1)),i=e[t]+this.unit,r=parseFloat((this.value/Math.pow(1e3,t)).toPrecision(3));return this.localize.number(r,{style:"unit",unit:i,unitDisplay:this.display})}};(0,o.u2)([(0,a.e2)({type:Number})],s.prototype,"value",2),(0,o.u2)([(0,a.e2)()],s.prototype,"unit",2),(0,o.u2)([(0,a.e2)()],s.prototype,"display",2),s=(0,o.u2)([(0,a.e)("sl-format-bytes")],s),i(1862),i(5954)},9796:(e,t,i)=>{var r=i(8379),a=i(8424),o=i(5954),s=i(453),l=class extends a.P{constructor(){super(...arguments),this.localize=new r.V(this),this.date=new Date,this.hourFormat="auto"}render(){const e=new Date(this.date),t="auto"===this.hourFormat?void 0:"12"===this.hourFormat;if(!isNaN(e.getMilliseconds()))return o.y`
      <time datetime=${e.toISOString()}>
        ${this.localize.date(e,{weekday:this.weekday,era:this.era,year:this.year,month:this.month,day:this.day,hour:this.hour,minute:this.minute,second:this.second,timeZoneName:this.timeZoneName,timeZone:this.timeZone,hour12:t})}
      </time>
    `}};(0,s.u2)([(0,a.e2)()],l.prototype,"date",2),(0,s.u2)([(0,a.e2)()],l.prototype,"weekday",2),(0,s.u2)([(0,a.e2)()],l.prototype,"era",2),(0,s.u2)([(0,a.e2)()],l.prototype,"year",2),(0,s.u2)([(0,a.e2)()],l.prototype,"month",2),(0,s.u2)([(0,a.e2)()],l.prototype,"day",2),(0,s.u2)([(0,a.e2)()],l.prototype,"hour",2),(0,s.u2)([(0,a.e2)()],l.prototype,"minute",2),(0,s.u2)([(0,a.e2)()],l.prototype,"second",2),(0,s.u2)([(0,a.e2)({attribute:"time-zone-name"})],l.prototype,"timeZoneName",2),(0,s.u2)([(0,a.e2)({attribute:"time-zone"})],l.prototype,"timeZone",2),(0,s.u2)([(0,a.e2)({attribute:"hour-format"})],l.prototype,"hourFormat",2),l=(0,s.u2)([(0,a.e)("sl-format-date")],l),i(1862)},9019:(e,t,i)=>{var r=i(8379),a=i(8424),o=i(453),s=class extends a.P{constructor(){super(...arguments),this.localize=new r.V(this),this.value=0,this.type="decimal",this.noGrouping=!1,this.currency="USD",this.currencyDisplay="symbol"}render(){return isNaN(this.value)?"":this.localize.number(this.value,{style:this.type,currency:this.currency,currencyDisplay:this.currencyDisplay,useGrouping:!this.noGrouping,minimumIntegerDigits:this.minimumIntegerDigits,minimumFractionDigits:this.minimumFractionDigits,maximumFractionDigits:this.maximumFractionDigits,minimumSignificantDigits:this.minimumSignificantDigits,maximumSignificantDigits:this.maximumSignificantDigits})}};(0,o.u2)([(0,a.e2)({type:Number})],s.prototype,"value",2),(0,o.u2)([(0,a.e2)()],s.prototype,"type",2),(0,o.u2)([(0,a.e2)({attribute:"no-grouping",type:Boolean})],s.prototype,"noGrouping",2),(0,o.u2)([(0,a.e2)()],s.prototype,"currency",2),(0,o.u2)([(0,a.e2)({attribute:"currency-display"})],s.prototype,"currencyDisplay",2),(0,o.u2)([(0,a.e2)({attribute:"minimum-integer-digits",type:Number})],s.prototype,"minimumIntegerDigits",2),(0,o.u2)([(0,a.e2)({attribute:"minimum-fraction-digits",type:Number})],s.prototype,"minimumFractionDigits",2),(0,o.u2)([(0,a.e2)({attribute:"maximum-fraction-digits",type:Number})],s.prototype,"maximumFractionDigits",2),(0,o.u2)([(0,a.e2)({attribute:"minimum-significant-digits",type:Number})],s.prototype,"minimumSignificantDigits",2),(0,o.u2)([(0,a.e2)({attribute:"maximum-significant-digits",type:Number})],s.prototype,"maximumSignificantDigits",2),s=(0,o.u2)([(0,a.e)("sl-format-number")],s),i(1862),i(5954)},8095:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    --divider-width: 2px;
    --handle-size: 2.5rem;

    display: inline-block;
    position: relative;
  }

  .image-comparer {
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  .image-comparer__before,
  .image-comparer__after {
    display: block;
    pointer-events: none;
  }

  .image-comparer__before::slotted(img),
  .image-comparer__after::slotted(img),
  .image-comparer__before::slotted(svg),
  .image-comparer__after::slotted(svg) {
    display: block;
    max-width: 100% !important;
    height: auto;
  }

  .image-comparer__after {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  .image-comparer__divider {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    width: var(--divider-width);
    height: 100%;
    background-color: var(--sl-color-neutral-0);
    translate: calc(var(--divider-width) / -2);
    cursor: ew-resize;
  }

  .image-comparer__handle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: calc(50% - (var(--handle-size) / 2));
    width: var(--handle-size);
    height: var(--handle-size);
    background-color: var(--sl-color-neutral-0);
    border-radius: var(--sl-border-radius-circle);
    font-size: calc(var(--handle-size) * 0.5);
    color: var(--sl-color-neutral-700);
    cursor: inherit;
    z-index: 10;
  }

  .image-comparer__handle:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }
`,s=i(6200),l=i(7282),n=i(1807),d=i(8379),h=i(5710),c=i(5381),u=i(8424),p=i(453),m=class extends u.P{constructor(){super(...arguments),this.localize=new d.V(this),this.position=50}handleDrag(e){const{width:t}=this.base.getBoundingClientRect(),i="rtl"===this.localize.dir();e.preventDefault(),(0,s.o)(this.base,{onMove:e=>{this.position=parseFloat((0,n.u)(e/t*100,0,100).toFixed(2)),i&&(this.position=100-this.position)},initialEvent:e})}handleKeyDown(e){const t="ltr"===this.localize.dir(),i="rtl"===this.localize.dir();if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){const r=e.shiftKey?10:1;let a=this.position;e.preventDefault(),(t&&"ArrowLeft"===e.key||i&&"ArrowRight"===e.key)&&(a-=r),(t&&"ArrowRight"===e.key||i&&"ArrowLeft"===e.key)&&(a+=r),"Home"===e.key&&(a=0),"End"===e.key&&(a=100),a=(0,n.u)(a,0,100),this.position=a}}handlePositionChange(){this.emit("sl-change")}render(){const e="rtl"===this.localize.dir();return a.y`
      <div
        part="base"
        id="image-comparer"
        class=${(0,c.o)({"image-comparer":!0,"image-comparer--rtl":e})}
        @keydown=${this.handleKeyDown}
      >
        <div class="image-comparer__image">
          <slot name="before" part="before" class="image-comparer__before"></slot>

          <slot
            name="after"
            part="after"
            class="image-comparer__after"
            style=${(0,l.i)({clipPath:e?`inset(0 0 0 ${100-this.position}%)`:`inset(0 ${100-this.position}% 0 0)`})}
          ></slot>
        </div>

        <div
          part="divider"
          class="image-comparer__divider"
          style=${(0,l.i)({left:e?100-this.position+"%":`${this.position}%`})}
          @mousedown=${this.handleDrag}
          @touchstart=${this.handleDrag}
        >
          <slot
            name="handle"
            part="handle"
            class="image-comparer__handle"
            role="scrollbar"
            aria-valuenow=${this.position}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-controls="image-comparer"
            tabindex="0"
          >
            <sl-icon library="system" name="grip-vertical"></sl-icon>
          </slot>
        </div>
      </div>
    `}};m.styles=o,(0,p.u2)([(0,u.i)(".image-comparer")],m.prototype,"base",2),(0,p.u2)([(0,u.i)(".image-comparer__handle")],m.prototype,"handle",2),(0,p.u2)([(0,u.e2)({type:Number,reflect:!0})],m.prototype,"position",2),(0,p.u2)([(0,h.Y)("position",{waitUntilFirstUpdate:!0})],m.prototype,"handlePositionChange",1),m=(0,p.u2)([(0,u.e)("sl-image-comparer")],m),i(1862),i(9940),i(9191),i(836),i(2759),i(1939),i(4370)},2319:(e,t,i)=>{i(3997),i(6038),i(3434),i(4617),i(4577),i(3480),i(8734),i(8379),i(1862),i(9940),i(9191),i(836),i(2759),i(1939),i(5710),i(5381),i(4370),i(8424),i(6281),i(5954),i(453)},3510:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    display: block;
  }

  :host([inert]) {
    display: none;
  }

  .menu-item {
    position: relative;
    display: flex;
    align-items: stretch;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-700);
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-2x-small);
    transition: var(--sl-transition-fast) fill;
    user-select: none;
    white-space: nowrap;
    cursor: pointer;
  }

  .menu-item.menu-item--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .menu-item .menu-item__label {
    flex: 1 1 auto;
    display: inline-block;
  }

  .menu-item .menu-item__prefix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__prefix::slotted(*) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .menu-item .menu-item__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__suffix::slotted(*) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(:hover:not([aria-disabled='true'], :focus-visible)) .menu-item {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-1000);
  }

  :host(:focus-visible) .menu-item {
    outline: none;
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    opacity: 1;
  }

  .menu-item .menu-item__check,
  .menu-item .menu-item__chevron {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    visibility: hidden;
  }

  .menu-item--checked .menu-item__check,
  .menu-item--has-submenu .menu-item__chevron {
    visibility: visible;
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .menu-item,
    :host(:focus-visible) .menu-item {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`,s=i(3515),l=i(5710),n=i(5381),d=i(8424),h=i(453),c=class extends d.P{constructor(){super(...arguments),this.type="normal",this.checked=!1,this.value="",this.disabled=!1}connectedCallback(){super.connectedCallback(),this.handleHostClick=this.handleHostClick.bind(this),this.addEventListener("click",this.handleHostClick)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleHostClick)}handleDefaultSlotChange(){const e=this.getTextLabel();void 0!==this.cachedTextLabel?e!==this.cachedTextLabel&&(this.cachedTextLabel=e,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1})):this.cachedTextLabel=e}handleHostClick(e){this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}handleCheckedChange(){if(this.checked&&"checkbox"!==this.type)return this.checked=!1,void console.error('The checked attribute can only be used on menu items with type="checkbox"',this);"checkbox"===this.type?this.setAttribute("aria-checked",this.checked?"true":"false"):this.removeAttribute("aria-checked")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleTypeChange(){"checkbox"===this.type?(this.setAttribute("role","menuitemcheckbox"),this.setAttribute("aria-checked",this.checked?"true":"false")):(this.setAttribute("role","menuitem"),this.removeAttribute("aria-checked"))}getTextLabel(){return(0,s.F)(this.defaultSlot)}render(){return a.y`
      <div
        part="base"
        class=${(0,n.o)({"menu-item":!0,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled,"menu-item--has-submenu":!1})}
      >
        <span part="checked-icon" class="menu-item__check">
          <sl-icon name="check" library="system" aria-hidden="true"></sl-icon>
        </span>

        <slot name="prefix" part="prefix" class="menu-item__prefix"></slot>

        <slot part="label" class="menu-item__label" @slotchange=${this.handleDefaultSlotChange}></slot>

        <slot name="suffix" part="suffix" class="menu-item__suffix"></slot>

        <span class="menu-item__chevron">
          <sl-icon name="chevron-right" library="system" aria-hidden="true"></sl-icon>
        </span>
      </div>
    `}};c.styles=o,(0,h.u2)([(0,d.i)("slot:not([name])")],c.prototype,"defaultSlot",2),(0,h.u2)([(0,d.i)(".menu-item")],c.prototype,"menuItem",2),(0,h.u2)([(0,d.e2)()],c.prototype,"type",2),(0,h.u2)([(0,d.e2)({type:Boolean,reflect:!0})],c.prototype,"checked",2),(0,h.u2)([(0,d.e2)()],c.prototype,"value",2),(0,h.u2)([(0,d.e2)({type:Boolean,reflect:!0})],c.prototype,"disabled",2),(0,h.u2)([(0,l.Y)("checked")],c.prototype,"handleCheckedChange",1),(0,h.u2)([(0,l.Y)("disabled")],c.prototype,"handleDisabledChange",1),(0,h.u2)([(0,l.Y)("type")],c.prototype,"handleTypeChange",1),c=(0,h.u2)([(0,d.e)("sl-menu-item")],c),i(9940),i(9191),i(836),i(2759),i(1939),i(4370)},239:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    display: block;
  }

  .menu-label {
    display: inline-block;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-500);
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-x-large);
    user-select: none;
  }
`,s=i(8424),l=i(453),n=class extends s.P{render(){return a.y` <slot part="base" class="menu-label"></slot> `}};n.styles=o,n=(0,l.u2)([(0,s.e)("sl-menu-label")],n)},1335:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    display: block;
    position: relative;
    background: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    padding: var(--sl-spacing-x-small) 0;
    overflow: auto;
    overscroll-behavior: none;
  }

  ::slotted(sl-divider) {
    --spacing: var(--sl-spacing-x-small);
  }
`,s=i(8424),l=i(453),n=class extends s.P{connectedCallback(){super.connectedCallback(),this.setAttribute("role","menu")}handleClick(e){const t=e.target.closest("sl-menu-item");!t||t.disabled||t.inert||("checkbox"===t.type&&(t.checked=!t.checked),this.emit("sl-select",{detail:{item:t}}))}handleKeyDown(e){if("Enter"===e.key){const t=this.getCurrentItem();e.preventDefault(),null==t||t.click()}if(" "===e.key&&e.preventDefault(),["ArrowDown","ArrowUp","Home","End"].includes(e.key)){const t=this.getAllItems(),i=this.getCurrentItem();let r=i?t.indexOf(i):0;t.length>0&&(e.preventDefault(),"ArrowDown"===e.key?r++:"ArrowUp"===e.key?r--:"Home"===e.key?r=0:"End"===e.key&&(r=t.length-1),r<0&&(r=t.length-1),r>t.length-1&&(r=0),this.setCurrentItem(t[r]),t[r].focus())}}handleMouseDown(e){const t=e.target;this.isMenuItem(t)&&this.setCurrentItem(t)}handleSlotChange(){const e=this.getAllItems();e.length>0&&this.setCurrentItem(e[0])}isMenuItem(e){var t;return"sl-menu-item"===e.tagName.toLowerCase()||["menuitem","menuitemcheckbox","menuitemradio"].includes(null!=(t=e.getAttribute("role"))?t:"")}getAllItems(){return[...this.defaultSlot.assignedElements({flatten:!0})].filter((e=>!(e.inert||!this.isMenuItem(e))))}getCurrentItem(){return this.getAllItems().find((e=>"0"===e.getAttribute("tabindex")))}setCurrentItem(e){this.getAllItems().forEach((t=>{t.setAttribute("tabindex",t===e?"0":"-1")}))}render(){return a.y`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `}};n.styles=o,(0,l.u2)([(0,s.i)("slot")],n.prototype,"defaultSlot",2),n=(0,l.u2)([(0,s.e)("sl-menu")],n)},7401:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    display: contents;
  }
`,s=i(5710),l=i(8424),n=i(453),d=class extends l.P{constructor(){super(...arguments),this.attrOldValue=!1,this.charData=!1,this.charDataOldValue=!1,this.childList=!1,this.disabled=!1}connectedCallback(){super.connectedCallback(),this.handleMutation=this.handleMutation.bind(this),this.mutationObserver=new MutationObserver(this.handleMutation),this.disabled||this.startObserver()}disconnectedCallback(){this.stopObserver()}handleMutation(e){this.emit("sl-mutation",{detail:{mutationList:e}})}startObserver(){const e="string"==typeof this.attr&&this.attr.length>0,t=e&&"*"!==this.attr?this.attr.split(" "):void 0;try{this.mutationObserver.observe(this,{subtree:!0,childList:this.childList,attributes:e,attributeFilter:t,attributeOldValue:this.attrOldValue,characterData:this.charData,characterDataOldValue:this.charDataOldValue})}catch(e){}}stopObserver(){this.mutationObserver.disconnect()}handleDisabledChange(){this.disabled?this.stopObserver():this.startObserver()}handleChange(){this.stopObserver(),this.startObserver()}render(){return a.y` <slot></slot> `}};d.styles=o,(0,n.u2)([(0,l.e2)({reflect:!0})],d.prototype,"attr",2),(0,n.u2)([(0,l.e2)({attribute:"attr-old-value",type:Boolean,reflect:!0})],d.prototype,"attrOldValue",2),(0,n.u2)([(0,l.e2)({attribute:"char-data",type:Boolean,reflect:!0})],d.prototype,"charData",2),(0,n.u2)([(0,l.e2)({attribute:"char-data-old-value",type:Boolean,reflect:!0})],d.prototype,"charDataOldValue",2),(0,n.u2)([(0,l.e2)({attribute:"child-list",type:Boolean,reflect:!0})],d.prototype,"childList",2),(0,n.u2)([(0,l.e2)({type:Boolean,reflect:!0})],d.prototype,"disabled",2),(0,n.u2)([(0,s.Y)("disabled")],d.prototype,"handleDisabledChange",1),(0,n.u2)([(0,s.Y)("attr",{waitUntilFirstUpdate:!0}),(0,s.Y)("attr-old-value",{waitUntilFirstUpdate:!0}),(0,s.Y)("char-data",{waitUntilFirstUpdate:!0}),(0,s.Y)("char-data-old-value",{waitUntilFirstUpdate:!0}),(0,s.Y)("childList",{waitUntilFirstUpdate:!0})],d.prototype,"handleChange",1),d=(0,n.u2)([(0,l.e)("sl-mutation-observer")],d)},6248:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    display: block;
    user-select: none;
  }

  :host(:focus) {
    outline: none;
  }

  .option {
    position: relative;
    display: flex;
    align-items: center;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-700);
    padding: var(--sl-spacing-x-small) var(--sl-spacing-medium) var(--sl-spacing-x-small) var(--sl-spacing-x-small);
    transition: var(--sl-transition-fast) fill;
    cursor: pointer;
  }

  .option--hover:not(.option--current):not(.option--disabled) {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-1000);
  }

  .option--current,
  .option--current.option--disabled {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    opacity: 1;
  }

  .option--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .option__label {
    flex: 1 1 auto;
    display: inline-block;
    line-height: var(--sl-line-height-dense);
  }

  .option .option__check {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    padding-inline-end: var(--sl-spacing-2x-small);
  }

  .option--selected .option__check {
    visibility: visible;
  }

  .option__prefix,
  .option__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .option__prefix::slotted(*) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .option__suffix::slotted(*) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .option {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`,s=i(8379),l=i(5710),n=i(5381),d=i(8424),h=i(453),c=class extends d.P{constructor(){super(...arguments),this.localize=new s.V(this),this.current=!1,this.selected=!1,this.hasHover=!1,this.value="",this.disabled=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","option"),this.setAttribute("aria-selected","false")}handleDefaultSlotChange(){const e=this.getTextLabel();void 0!==this.cachedTextLabel?e!==this.cachedTextLabel&&(this.cachedTextLabel=e,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1})):this.cachedTextLabel=e}handleMouseEnter(){this.hasHover=!0}handleMouseLeave(){this.hasHover=!1}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleSelectedChange(){this.setAttribute("aria-selected",this.selected?"true":"false")}handleValueChange(){"string"!=typeof this.value&&(this.value=String(this.value)),this.value.includes(" ")&&(console.error("Option values cannot include a space. All spaces have been replaced with underscores.",this),this.value=this.value.replace(/ /g,"_"))}getTextLabel(){var e;return(null!=(e=this.textContent)?e:"").trim()}render(){return a.y`
      <div
        part="base"
        class=${(0,n.o)({option:!0,"option--current":this.current,"option--disabled":this.disabled,"option--selected":this.selected,"option--hover":this.hasHover})}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        <sl-icon part="checked-icon" class="option__check" name="check" library="system" aria-hidden="true"></sl-icon>
        <slot part="prefix" name="prefix" class="option__prefix"></slot>
        <slot part="label" class="option__label" @slotchange=${this.handleDefaultSlotChange}></slot>
        <slot part="suffix" name="suffix" class="option__suffix"></slot>
      </div>
    `}};c.styles=o,(0,h.u2)([(0,d.i)(".option__label")],c.prototype,"defaultSlot",2),(0,h.u2)([(0,d.t)()],c.prototype,"current",2),(0,h.u2)([(0,d.t)()],c.prototype,"selected",2),(0,h.u2)([(0,d.t)()],c.prototype,"hasHover",2),(0,h.u2)([(0,d.e2)({reflect:!0})],c.prototype,"value",2),(0,h.u2)([(0,d.e2)({type:Boolean,reflect:!0})],c.prototype,"disabled",2),(0,h.u2)([(0,l.Y)("disabled")],c.prototype,"handleDisabledChange",1),(0,h.u2)([(0,l.Y)("selected")],c.prototype,"handleSelectedChange",1),(0,h.u2)([(0,l.Y)("value")],c.prototype,"handleValueChange",1),c=(0,h.u2)([(0,d.e)("sl-option")],c),i(1862),i(9940),i(9191),i(836),i(2759),i(1939),i(4370)},8803:(e,t,i)=>{i(6789),i(1732),i(5381),i(4370),i(8424),i(6281),i(5954),i(453)},456:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    --height: 1rem;
    --track-color: var(--sl-color-neutral-200);
    --indicator-color: var(--sl-color-primary-600);
    --label-color: var(--sl-color-neutral-0);

    display: block;
  }

  .progress-bar {
    position: relative;
    background-color: var(--track-color);
    height: var(--height);
    border-radius: var(--sl-border-radius-pill);
    box-shadow: inset var(--sl-shadow-small);
    overflow: hidden;
  }

  .progress-bar__indicator {
    height: 100%;
    font-family: var(--sl-font-sans);
    font-size: 12px;
    font-weight: var(--sl-font-weight-normal);
    background-color: var(--indicator-color);
    color: var(--label-color);
    text-align: center;
    line-height: var(--height);
    white-space: nowrap;
    overflow: hidden;
    transition: 400ms width, 400ms background-color;
    user-select: none;
  }

  /* Indeterminate */
  .progress-bar--indeterminate .progress-bar__indicator {
    position: absolute;
    animation: indeterminate 2.5s infinite cubic-bezier(0.37, 0, 0.63, 1);
  }

  .progress-bar--indeterminate.progress-bar--rtl .progress-bar__indicator {
    animation-name: indeterminate-rtl;
  }

  @media (forced-colors: active) {
    .progress-bar {
      outline: solid 1px SelectedItem;
      background-color: var(--sl-color-neutral-0);
    }

    .progress-bar__indicator {
      outline: solid 1px SelectedItem;
      background-color: SelectedItem;
    }
  }

  @keyframes indeterminate {
    0% {
      left: -50%;
      width: 50%;
    }
    75%,
    100% {
      left: 100%;
      width: 50%;
    }
  }

  @keyframes indeterminate-rtl {
    0% {
      right: -50%;
      width: 50%;
    }
    75%,
    100% {
      right: 100%;
      width: 50%;
    }
  }
`,s=i(7282),l=i(8734),n=i(8379),d=i(5381),h=i(8424),c=i(453),u=class extends h.P{constructor(){super(...arguments),this.localize=new n.V(this),this.value=0,this.indeterminate=!1,this.label=""}render(){return a.y`
      <div
        part="base"
        class=${(0,d.o)({"progress-bar":!0,"progress-bar--indeterminate":this.indeterminate,"progress-bar--rtl":"rtl"===this.localize.dir()})}
        role="progressbar"
        title=${(0,l.l)(this.title)}
        aria-label=${this.label.length>0?this.label:this.localize.term("progress")}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${this.indeterminate?0:this.value}
      >
        <div part="indicator" class="progress-bar__indicator" style=${(0,s.i)({width:`${this.value}%`})}>
          ${this.indeterminate?"":a.y` <slot part="label" class="progress-bar__label"></slot> `}
        </div>
      </div>
    `}};u.styles=o,(0,c.u2)([(0,h.e2)({type:Number,reflect:!0})],u.prototype,"value",2),(0,c.u2)([(0,h.e2)({type:Boolean,reflect:!0})],u.prototype,"indeterminate",2),(0,c.u2)([(0,h.e2)()],u.prototype,"label",2),u=(0,c.u2)([(0,h.e)("sl-progress-bar")],u),i(1862),i(4370)},6578:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

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
`,s=i(8379),l=i(8424),n=i(453),d=class extends l.P{constructor(){super(...arguments),this.localize=new s.V(this),this.value=0,this.label=""}updated(e){if(super.updated(e),e.has("value")){const e=parseFloat(getComputedStyle(this.indicator).getPropertyValue("r")),t=2*Math.PI*e,i=t-this.value/100*t;this.indicatorOffset=`${i}px`}}render(){return a.y`
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
    `}};d.styles=o,(0,n.u2)([(0,l.i)(".progress-ring__indicator")],d.prototype,"indicator",2),(0,n.u2)([(0,l.t)()],d.prototype,"indicatorOffset",2),(0,n.u2)([(0,l.e2)({type:Number,reflect:!0})],d.prototype,"value",2),(0,n.u2)([(0,l.e2)()],d.prototype,"label",2),d=(0,n.u2)([(0,l.e)("sl-progress-ring")],d),i(1862)},4936:(e,t,i)=>{var r=i(7772),a=i(5954).i`
  ${r.y}

  .button__prefix,
  .button__suffix,
  .button__label {
    display: inline-flex;
    position: relative;
    align-items: center;
  }

  /* We use a hidden input so constraint validation errors work, since they don't appear to show when used with buttons.
    We can't actually hide it, though, otherwise the messages will be suppressed by the browser. */
  .hidden-input {
    all: unset;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    outline: dotted 1px red;
    opacity: 0;
    z-index: -1;
  }
`,o=i(3251),s=i(8734),l=i(3515),n=i(5710),d=i(5381),h=i(8424),c=i(453),u=class extends h.P{constructor(){super(...arguments),this.hasSlotController=new l.r(this,"[default]","prefix","suffix"),this.hasFocus=!1,this.checked=!1,this.disabled=!1,this.size="medium",this.pill=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","presentation")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleClick(e){if(this.disabled)return e.preventDefault(),void e.stopPropagation();this.checked=!0}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}focus(e){this.input.focus(e)}blur(){this.input.blur()}render(){return o.n`
      <div part="base" role="presentation">
        <button
          part="${"button"+(this.checked?" button--checked":"")}"
          role="radio"
          aria-checked="${this.checked}"
          class=${(0,d.o)({button:!0,"button--default":!0,"button--small":"small"===this.size,"button--medium":"medium"===this.size,"button--large":"large"===this.size,"button--checked":this.checked,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--outline":!0,"button--pill":this.pill,"button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
          aria-disabled=${this.disabled}
          type="button"
          value=${(0,s.l)(this.value)}
          tabindex="${this.checked?"0":"-1"}"
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @click=${this.handleClick}
        >
          <slot name="prefix" part="prefix" class="button__prefix"></slot>
          <slot part="label" class="button__label"></slot>
          <slot name="suffix" part="suffix" class="button__suffix"></slot>
        </button>
      </div>
    `}};u.styles=a,(0,c.u2)([(0,h.i)(".button")],u.prototype,"input",2),(0,c.u2)([(0,h.i)(".hidden-input")],u.prototype,"hiddenInput",2),(0,c.u2)([(0,h.t)()],u.prototype,"hasFocus",2),(0,c.u2)([(0,h.e2)({type:Boolean,reflect:!0})],u.prototype,"checked",2),(0,c.u2)([(0,h.e2)()],u.prototype,"value",2),(0,c.u2)([(0,h.e2)({type:Boolean,reflect:!0})],u.prototype,"disabled",2),(0,c.u2)([(0,h.e2)({reflect:!0})],u.prototype,"size",2),(0,c.u2)([(0,h.e2)({type:Boolean,reflect:!0})],u.prototype,"pill",2),(0,c.u2)([(0,n.Y)("disabled",{waitUntilFirstUpdate:!0})],u.prototype,"handleDisabledChange",1),u=(0,c.u2)([(0,h.e)("sl-radio-button")],u),i(4370),i(6281)},6794:(e,t,i)=>{var r=i(3434),a=i(6281),o=i(5954),s=o.i`
  ${a.N}
  ${r.n}

  :host {
    display: block;
  }

  .form-control {
    border: none;
    padding: 0;
    margin: 0;
  }

  .form-control__label {
    padding: 0;
  }

  .radio-group--required .radio-group__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`,l=i(3480),n=i(3515),d=i(5710),h=i(5381),c=i(8424),u=i(453),p=class extends c.P{constructor(){super(...arguments),this.formControlController=new l.pY(this),this.hasSlotController=new n.r(this,"help-text","label"),this.customValidityMessage="",this.hasButtonGroup=!1,this.errorMessage="",this.defaultValue="",this.label="",this.helpText="",this.name="option",this.value="",this.size="medium",this.form="",this.required=!1}get validity(){const e=this.required&&!this.value;return""!==this.customValidityMessage?l.ZW:e?l.st:l.o9}get validationMessage(){const e=this.required&&!this.value;return""!==this.customValidityMessage?this.customValidityMessage:e?this.validationInput.validationMessage:""}connectedCallback(){super.connectedCallback(),this.defaultValue=this.value}firstUpdated(){this.formControlController.updateValidity()}getAllRadios(){return[...this.querySelectorAll("sl-radio, sl-radio-button")]}handleRadioClick(e){const t=e.target.closest("sl-radio, sl-radio-button"),i=this.getAllRadios(),r=this.value;t.disabled||(this.value=t.value,i.forEach((e=>e.checked=e===t)),this.value!==r&&(this.emit("sl-change"),this.emit("sl-input")))}handleKeyDown(e){var t;if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))return;const i=this.getAllRadios().filter((e=>!e.disabled)),r=null!=(t=i.find((e=>e.checked)))?t:i[0],a=" "===e.key?0:["ArrowUp","ArrowLeft"].includes(e.key)?-1:1,o=this.value;let s=i.indexOf(r)+a;s<0&&(s=i.length-1),s>i.length-1&&(s=0),this.getAllRadios().forEach((e=>{e.checked=!1,this.hasButtonGroup||(e.tabIndex=-1)})),this.value=i[s].value,i[s].checked=!0,this.hasButtonGroup?i[s].shadowRoot.querySelector("button").focus():(i[s].tabIndex=0,i[s].focus()),this.value!==o&&(this.emit("sl-change"),this.emit("sl-input")),e.preventDefault()}handleLabelClick(){const e=this.getAllRadios(),t=e.find((e=>e.checked))||e[0];t&&t.focus()}handleSlotChange(){var e,t;if(customElements.get("sl-radio")||customElements.get("sl-radio-button")){const i=this.getAllRadios();if(i.forEach((e=>{e.checked=e.value===this.value,e.size=this.size})),this.hasButtonGroup=i.some((e=>"sl-radio-button"===e.tagName.toLowerCase())),!i.some((e=>e.checked)))if(this.hasButtonGroup){const t=null==(e=i[0].shadowRoot)?void 0:e.querySelector("button");t&&(t.tabIndex=0)}else i[0].tabIndex=0;if(this.hasButtonGroup){const e=null==(t=this.shadowRoot)?void 0:t.querySelector("sl-button-group");e&&(e.disableRole=!0)}}else customElements.whenDefined("sl-radio").then((()=>this.handleSlotChange())),customElements.whenDefined("sl-radio-button").then((()=>this.handleSlotChange()))}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}updateCheckedRadio(){this.getAllRadios().forEach((e=>e.checked=e.value===this.value)),this.formControlController.setValidity(this.validity.valid)}handleValueChange(){this.hasUpdated&&this.updateCheckedRadio()}checkValidity(){const e=this.required&&!this.value,t=""!==this.customValidityMessage;return!e&&!t||(this.formControlController.emitInvalidEvent(),!1)}getForm(){return this.formControlController.getForm()}reportValidity(){const e=this.validity.valid;return this.errorMessage=this.customValidityMessage||e?"":this.validationInput.validationMessage,this.formControlController.setValidity(e),this.validationInput.hidden=!0,clearTimeout(this.validationTimeout),e||(this.validationInput.hidden=!1,this.validationInput.reportValidity(),this.validationTimeout=setTimeout((()=>this.validationInput.hidden=!0),1e4)),e}setCustomValidity(e=""){this.customValidityMessage=e,this.errorMessage=e,this.validationInput.setCustomValidity(e),this.formControlController.updateValidity()}render(){const e=this.hasSlotController.test("label"),t=this.hasSlotController.test("help-text"),i=!!this.label||!!e,r=!!this.helpText||!!t,a=o.y`
      <slot
        @click=${this.handleRadioClick}
        @keydown=${this.handleKeyDown}
        @slotchange=${this.handleSlotChange}
        role="presentation"
      ></slot>
    `;return o.y`
      <fieldset
        part="form-control"
        class=${(0,h.o)({"form-control":!0,"form-control--small":"small"===this.size,"form-control--medium":"medium"===this.size,"form-control--large":"large"===this.size,"form-control--radio-group":!0,"form-control--has-label":i,"form-control--has-help-text":r})}
        role="radiogroup"
        aria-labelledby="label"
        aria-describedby="help-text"
        aria-errormessage="error-message"
      >
        <label
          part="form-control-label"
          id="label"
          class="form-control__label"
          aria-hidden=${i?"false":"true"}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div class="visually-hidden">
            <div id="error-message" aria-live="assertive">${this.errorMessage}</div>
            <label class="radio-group__validation">
              <input
                type="text"
                class="radio-group__validation-input"
                ?required=${this.required}
                tabindex="-1"
                hidden
                @invalid=${this.handleInvalid}
              />
            </label>
          </div>

          ${this.hasButtonGroup?o.y`
                <sl-button-group part="button-group" exportparts="base:button-group__base">
                  ${a}
                </sl-button-group>
              `:a}
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${r?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </fieldset>
    `}};p.styles=s,(0,u.u2)([(0,c.i)("slot:not([name])")],p.prototype,"defaultSlot",2),(0,u.u2)([(0,c.i)(".radio-group__validation-input")],p.prototype,"validationInput",2),(0,u.u2)([(0,c.t)()],p.prototype,"hasButtonGroup",2),(0,u.u2)([(0,c.t)()],p.prototype,"errorMessage",2),(0,u.u2)([(0,c.t)()],p.prototype,"defaultValue",2),(0,u.u2)([(0,c.e2)()],p.prototype,"label",2),(0,u.u2)([(0,c.e2)({attribute:"help-text"})],p.prototype,"helpText",2),(0,u.u2)([(0,c.e2)()],p.prototype,"name",2),(0,u.u2)([(0,c.e2)({reflect:!0})],p.prototype,"value",2),(0,u.u2)([(0,c.e2)({reflect:!0})],p.prototype,"size",2),(0,u.u2)([(0,c.e2)({reflect:!0})],p.prototype,"form",2),(0,u.u2)([(0,c.e2)({type:Boolean,reflect:!0})],p.prototype,"required",2),(0,u.u2)([(0,d.Y)("value")],p.prototype,"handleValueChange",1),p=(0,u.u2)([(0,c.e)("sl-radio-group")],p),i(9340),i(7918),i(4370)},9791:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    display: block;
  }

  :host(:focus-visible) {
    outline: 0px;
  }

  .radio {
    display: inline-flex;
    align-items: top;
    font-family: var(--sl-input-font-family);
    font-size: var(--sl-input-font-size-medium);
    font-weight: var(--sl-input-font-weight);
    color: var(--sl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .radio--small {
    --toggle-size: var(--sl-toggle-size-small);
    font-size: var(--sl-input-font-size-small);
  }

  .radio--medium {
    --toggle-size: var(--sl-toggle-size-medium);
    font-size: var(--sl-input-font-size-medium);
  }

  .radio--large {
    --toggle-size: var(--sl-toggle-size-large);
    font-size: var(--sl-input-font-size-large);
  }

  .radio__checked-icon {
    display: inline-flex;
    width: var(--toggle-size);
    height: var(--toggle-size);
  }

  .radio__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
    border-radius: 50%;
    background-color: var(--sl-input-background-color);
    color: transparent;
    transition: var(--sl-transition-fast) border-color, var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) color, var(--sl-transition-fast) box-shadow;
  }

  .radio__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Hover */
  .radio:not(.radio--checked):not(.radio--disabled) .radio__control:hover {
    border-color: var(--sl-input-border-color-hover);
    background-color: var(--sl-input-background-color-hover);
  }

  /* Checked */
  .radio--checked .radio__control {
    color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
  }

  /* Checked + hover */
  .radio.radio--checked:not(.radio--disabled) .radio__control:hover {
    border-color: var(--sl-color-primary-500);
    background-color: var(--sl-color-primary-500);
  }

  /* Checked + focus */
  :host(:focus-visible) .radio__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Disabled */
  .radio--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* When the control isn't checked, hide the circle for Windows High Contrast mode a11y */
  .radio:not(.radio--checked) svg circle {
    opacity: 0;
  }

  .radio__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    line-height: var(--toggle-size);
    margin-inline-start: 0.5em;
    user-select: none;
  }
`,s=i(5710),l=i(5381),n=i(8424),d=i(453),h=class extends n.P{constructor(){super(...arguments),this.checked=!1,this.hasFocus=!1,this.size="medium",this.disabled=!1}connectedCallback(){super.connectedCallback(),this.handleBlur=this.handleBlur.bind(this),this.handleClick=this.handleClick.bind(this),this.handleFocus=this.handleFocus.bind(this),this.setInitialAttributes(),this.addEventListeners()}disconnectedCallback(){this.removeEventListeners()}addEventListeners(){this.addEventListener("blur",this.handleBlur),this.addEventListener("click",this.handleClick),this.addEventListener("focus",this.handleFocus)}removeEventListeners(){this.removeEventListener("blur",this.handleBlur),this.removeEventListener("click",this.handleClick),this.removeEventListener("focus",this.handleFocus)}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleClick(){this.disabled||(this.checked=!0)}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}setInitialAttributes(){this.setAttribute("role","radio"),this.setAttribute("tabindex","-1"),this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleCheckedChange(){this.setAttribute("aria-checked",this.checked?"true":"false"),this.setAttribute("tabindex",this.checked?"0":"-1")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}render(){return a.y`
      <span
        part="base"
        class=${(0,l.o)({radio:!0,"radio--checked":this.checked,"radio--disabled":this.disabled,"radio--focused":this.hasFocus,"radio--small":"small"===this.size,"radio--medium":"medium"===this.size,"radio--large":"large"===this.size})}
      >
        <span part="${"control"+(this.checked?" control--checked":"")}" class="radio__control">
          ${this.checked?a.y` <sl-icon part="checked-icon" class="radio__checked-icon" library="system" name="radio"></sl-icon> `:""}
        </span>

        <slot part="label" class="radio__label"></slot>
      </span>
    `}};h.styles=o,(0,d.u2)([(0,n.t)()],h.prototype,"checked",2),(0,d.u2)([(0,n.t)()],h.prototype,"hasFocus",2),(0,d.u2)([(0,n.e2)()],h.prototype,"value",2),(0,d.u2)([(0,n.e2)({reflect:!0})],h.prototype,"size",2),(0,d.u2)([(0,n.e2)({type:Boolean,reflect:!0})],h.prototype,"disabled",2),(0,d.u2)([(0,s.Y)("checked")],h.prototype,"handleCheckedChange",1),(0,d.u2)([(0,s.Y)("disabled",{waitUntilFirstUpdate:!0})],h.prototype,"handleDisabledChange",1),h=(0,d.u2)([(0,n.e)("sl-radio")],h),i(9940),i(9191),i(836),i(2759),i(1939),i(4370)},9086:(e,t,i)=>{var r=i(3434),a=i(6281),o=i(5954),s=o.i`
  ${a.N}
  ${r.n}

  :host {
    --thumb-size: 20px;
    --tooltip-offset: 10px;
    --track-color-active: var(--sl-color-neutral-200);
    --track-color-inactive: var(--sl-color-neutral-200);
    --track-active-offset: 0%;
    --track-height: 6px;

    display: block;
  }

  .range {
    position: relative;
  }

  .range__control {
    --percent: 0%;
    -webkit-appearance: none;
    border-radius: 3px;
    width: 100%;
    height: var(--track-height);
    background: transparent;
    line-height: var(--sl-input-height-medium);
    vertical-align: middle;
    margin: 0;

    background-image: linear-gradient(
      to right,
      var(--track-color-inactive) 0%,
      var(--track-color-inactive) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) 100%
    );
  }

  .range--rtl .range__control {
    background-image: linear-gradient(
      to left,
      var(--track-color-inactive) 0%,
      var(--track-color-inactive) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) min(var(--percent), var(--track-active-offset)),
      var(--track-color-active) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) max(var(--percent), var(--track-active-offset)),
      var(--track-color-inactive) 100%
    );
  }

  /* Webkit */
  .range__control::-webkit-slider-runnable-track {
    width: 100%;
    height: var(--track-height);
    border-radius: 3px;
    border: none;
  }

  .range__control::-webkit-slider-thumb {
    border: none;
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: 50%;
    background-color: var(--sl-color-primary-600);
    border: solid var(--sl-input-border-width) var(--sl-color-primary-600);
    -webkit-appearance: none;
    margin-top: calc(var(--thumb-size) / -2 + var(--track-height) / 2);
    cursor: pointer;
  }

  .range__control:enabled::-webkit-slider-thumb:hover {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
  }

  .range__control:enabled:focus-visible::-webkit-slider-thumb {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .range__control:enabled::-webkit-slider-thumb:active {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    cursor: grabbing;
  }

  /* Firefox */
  .range__control::-moz-focus-outer {
    border: 0;
  }

  .range__control::-moz-range-progress {
    background-color: var(--track-color-active);
    border-radius: 3px;
    height: var(--track-height);
  }

  .range__control::-moz-range-track {
    width: 100%;
    height: var(--track-height);
    background-color: var(--track-color-inactive);
    border-radius: 3px;
    border: none;
  }

  .range__control::-moz-range-thumb {
    border: none;
    height: var(--thumb-size);
    width: var(--thumb-size);
    border-radius: 50%;
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    transition: var(--sl-transition-fast) border-color, var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) color, var(--sl-transition-fast) box-shadow;
    cursor: pointer;
  }

  .range__control:enabled::-moz-range-thumb:hover {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
  }

  .range__control:enabled:focus-visible::-moz-range-thumb {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .range__control:enabled::-moz-range-thumb:active {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    cursor: grabbing;
  }

  /* States */
  .range__control:focus-visible {
    outline: none;
  }

  .range__control:disabled {
    opacity: 0.5;
  }

  .range__control:disabled::-webkit-slider-thumb {
    cursor: not-allowed;
  }

  .range__control:disabled::-moz-range-thumb {
    cursor: not-allowed;
  }

  /* Tooltip output */
  .range__tooltip {
    position: absolute;
    z-index: var(--sl-z-index-tooltip);
    left: 0;
    border-radius: var(--sl-tooltip-border-radius);
    background-color: var(--sl-tooltip-background-color);
    font-family: var(--sl-tooltip-font-family);
    font-size: var(--sl-tooltip-font-size);
    font-weight: var(--sl-tooltip-font-weight);
    line-height: var(--sl-tooltip-line-height);
    color: var(--sl-tooltip-color);
    opacity: 0;
    padding: var(--sl-tooltip-padding);
    transition: var(--sl-transition-fast) opacity;
    pointer-events: none;
  }

  .range__tooltip:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: 50%;
    translate: calc(-1 * var(--sl-tooltip-arrow-size));
  }

  .range--tooltip-visible .range__tooltip {
    opacity: 1;
  }

  /* Tooltip on top */
  .range--tooltip-top .range__tooltip {
    top: calc(-1 * var(--thumb-size) - var(--tooltip-offset));
  }

  .range--tooltip-top .range__tooltip:after {
    border-top: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);
    border-left: var(--sl-tooltip-arrow-size) solid transparent;
    border-right: var(--sl-tooltip-arrow-size) solid transparent;
    top: 100%;
  }

  /* Tooltip on bottom */
  .range--tooltip-bottom .range__tooltip {
    bottom: calc(-1 * var(--thumb-size) - var(--tooltip-offset));
  }

  .range--tooltip-bottom .range__tooltip:after {
    border-bottom: var(--sl-tooltip-arrow-size) solid var(--sl-tooltip-background-color);
    border-left: var(--sl-tooltip-arrow-size) solid transparent;
    border-right: var(--sl-tooltip-arrow-size) solid transparent;
    bottom: 100%;
  }

  @media (forced-colors: active) {
    .range__control,
    .range__tooltip {
      border: solid 1px transparent;
    }

    .range__control::-webkit-slider-thumb {
      border: solid 1px transparent;
    }

    .range__control::-moz-range-thumb {
      border: solid 1px transparent;
    }

    .range__tooltip:after {
      display: none;
    }
  }
`,l=i(4617),n=i(4577),d=i(3480),h=i(8734),c=i(3515),u=i(8379),p=i(5710),m=i(5381),b=i(8424),v=i(453),g=class extends b.P{constructor(){super(...arguments),this.formControlController=new d.pY(this),this.hasSlotController=new c.r(this,"help-text","label"),this.localize=new u.V(this),this.hasFocus=!1,this.hasTooltip=!1,this.title="",this.name="",this.value=0,this.label="",this.helpText="",this.disabled=!1,this.min=0,this.max=100,this.step=1,this.tooltip="top",this.tooltipFormatter=e=>e.toString(),this.form="",this.defaultValue=0}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver((()=>this.syncRange())),this.value<this.min&&(this.value=this.min),this.value>this.max&&(this.value=this.max),this.updateComplete.then((()=>{this.syncRange(),this.resizeObserver.observe(this.input)}))}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this.input)}handleChange(){this.emit("sl-change")}handleInput(){this.value=parseFloat(this.input.value),this.emit("sl-input"),this.syncRange()}handleBlur(){this.hasFocus=!1,this.hasTooltip=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.hasTooltip=!0,this.emit("sl-focus")}handleThumbDragStart(){this.hasTooltip=!0}handleThumbDragEnd(){this.hasTooltip=!1}syncProgress(e){this.input.style.setProperty("--percent",100*e+"%")}syncTooltip(e){if(null!==this.output){const t=this.input.offsetWidth,i=this.output.offsetWidth,r=getComputedStyle(this.input).getPropertyValue("--thumb-size"),a=t*e;if("rtl"===this.localize.dir()){const o=`${t-a}px + ${e} * ${r}`;this.output.style.translate=`calc((${o} - ${i/2}px - ${r} / 2))`}else{const t=`${a}px - ${e} * ${r}`;this.output.style.translate=`calc(${t} - ${i/2}px + ${r} / 2)`}}}handleValueChange(){this.formControlController.updateValidity(),this.input.value=this.value.toString(),this.value=parseFloat(this.input.value),this.syncRange()}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}syncRange(){const e=Math.max(0,(this.value-this.min)/(this.max-this.min));this.syncProgress(e),"none"!==this.tooltip&&this.syncTooltip(e)}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}focus(e){this.input.focus(e)}blur(){this.input.blur()}stepUp(){this.input.stepUp(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}stepDown(){this.input.stepDown(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.formControlController.updateValidity()}render(){const e=this.hasSlotController.test("label"),t=this.hasSlotController.test("help-text"),i=!!this.label||!!e,r=!!this.helpText||!!t;return o.y`
      <div
        part="form-control"
        class=${(0,m.o)({"form-control":!0,"form-control--medium":!0,"form-control--has-label":i,"form-control--has-help-text":r})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${i?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${(0,m.o)({range:!0,"range--disabled":this.disabled,"range--focused":this.hasFocus,"range--rtl":"rtl"===this.localize.dir(),"range--tooltip-visible":this.hasTooltip,"range--tooltip-top":"top"===this.tooltip,"range--tooltip-bottom":"bottom"===this.tooltip})}
            @mousedown=${this.handleThumbDragStart}
            @mouseup=${this.handleThumbDragEnd}
            @touchstart=${this.handleThumbDragStart}
            @touchend=${this.handleThumbDragEnd}
          >
            <input
              part="input"
              id="input"
              class="range__control"
              title=${this.title}
              type="range"
              name=${(0,h.l)(this.name)}
              ?disabled=${this.disabled}
              min=${(0,h.l)(this.min)}
              max=${(0,h.l)(this.max)}
              step=${(0,h.l)(this.step)}
              .value=${(0,l.l)(this.value.toString())}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @focus=${this.handleFocus}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @blur=${this.handleBlur}
            />
            ${"none"===this.tooltip||this.disabled?"":o.y`
                  <output part="tooltip" class="range__tooltip">
                    ${"function"==typeof this.tooltipFormatter?this.tooltipFormatter(this.value):this.value}
                  </output>
                `}
          </div>
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${r?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </div>
    `}};g.styles=s,(0,v.u2)([(0,b.i)(".range__control")],g.prototype,"input",2),(0,v.u2)([(0,b.i)(".range__tooltip")],g.prototype,"output",2),(0,v.u2)([(0,b.t)()],g.prototype,"hasFocus",2),(0,v.u2)([(0,b.t)()],g.prototype,"hasTooltip",2),(0,v.u2)([(0,b.e2)()],g.prototype,"title",2),(0,v.u2)([(0,b.e2)()],g.prototype,"name",2),(0,v.u2)([(0,b.e2)({type:Number})],g.prototype,"value",2),(0,v.u2)([(0,b.e2)()],g.prototype,"label",2),(0,v.u2)([(0,b.e2)({attribute:"help-text"})],g.prototype,"helpText",2),(0,v.u2)([(0,b.e2)({type:Boolean,reflect:!0})],g.prototype,"disabled",2),(0,v.u2)([(0,b.e2)({type:Number})],g.prototype,"min",2),(0,v.u2)([(0,b.e2)({type:Number})],g.prototype,"max",2),(0,v.u2)([(0,b.e2)({type:Number})],g.prototype,"step",2),(0,v.u2)([(0,b.e2)()],g.prototype,"tooltip",2),(0,v.u2)([(0,b.e2)({attribute:!1})],g.prototype,"tooltipFormatter",2),(0,v.u2)([(0,b.e2)({reflect:!0})],g.prototype,"form",2),(0,v.u2)([(0,n.L)()],g.prototype,"defaultValue",2),(0,v.u2)([(0,b.e3)({passive:!0})],g.prototype,"handleThumbDragStart",1),(0,v.u2)([(0,p.Y)("value",{waitUntilFirstUpdate:!0})],g.prototype,"handleValueChange",1),(0,v.u2)([(0,p.Y)("disabled",{waitUntilFirstUpdate:!0})],g.prototype,"handleDisabledChange",1),(0,v.u2)([(0,p.Y)("hasTooltip",{waitUntilFirstUpdate:!0})],g.prototype,"syncRange",1),g=(0,v.u2)([(0,b.e)("sl-range")],g),i(1862),i(4370)},5734:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    --symbol-color: var(--sl-color-neutral-300);
    --symbol-color-active: var(--sl-color-amber-500);
    --symbol-size: 1.2rem;
    --symbol-spacing: var(--sl-spacing-3x-small);

    display: inline-flex;
  }

  .rating {
    position: relative;
    display: inline-flex;
    border-radius: var(--sl-border-radius-medium);
    vertical-align: middle;
  }

  .rating:focus {
    outline: none;
  }

  .rating:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .rating__symbols {
    display: inline-flex;
    position: relative;
    font-size: var(--symbol-size);
    line-height: 0;
    color: var(--symbol-color);
    white-space: nowrap;
    cursor: pointer;
  }

  .rating__symbols > * {
    padding: var(--symbol-spacing);
  }

  .rating__symbols--indicator {
    position: absolute;
    top: 0;
    left: 0;
    color: var(--symbol-color-active);
    pointer-events: none;
  }

  .rating__symbol {
    transition: var(--sl-transition-fast) scale;
  }

  .rating__symbol--hover {
    scale: 1.2;
  }

  .rating--disabled .rating__symbols,
  .rating--readonly .rating__symbols {
    cursor: default;
  }

  .rating--disabled .rating__symbol--hover,
  .rating--readonly .rating__symbol--hover {
    scale: none;
  }

  .rating--disabled {
    opacity: 0.5;
  }

  .rating--disabled .rating__symbols {
    cursor: not-allowed;
  }

  /* Forced colors mode */
  @media (forced-colors: active) {
    .rating__symbols--indicator {
      color: SelectedItem;
    }
  }
`,s=i(7282),l=i(1807),n=i(8379),d=i(5710),h=i(5381),c=i(4370),u=i(8424),p=i(453),m=class extends c.i{constructor(e){if(super(e),this.it=a.b,e.type!==c.t.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===a.b||null==e)return this._t=void 0,this.it=e;if(e===a.x)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};m.directiveName="unsafeHTML",m.resultType=1;var b=(0,c.e)(m),v=class extends u.P{constructor(){super(...arguments),this.localize=new n.V(this),this.hoverValue=0,this.isHovering=!1,this.label="",this.value=0,this.max=5,this.precision=1,this.readonly=!1,this.disabled=!1,this.getSymbol=()=>'<sl-icon name="star-fill" library="system"></sl-icon>'}getValueFromMousePosition(e){return this.getValueFromXCoordinate(e.clientX)}getValueFromTouchPosition(e){return this.getValueFromXCoordinate(e.touches[0].clientX)}getValueFromXCoordinate(e){const t="rtl"===this.localize.dir(),{left:i,right:r,width:a}=this.rating.getBoundingClientRect(),o=t?this.roundToPrecision((r-e)/a*this.max,this.precision):this.roundToPrecision((e-i)/a*this.max,this.precision);return(0,l.u)(o,0,this.max)}handleClick(e){this.disabled||(this.setValue(this.getValueFromMousePosition(e)),this.emit("sl-change"))}setValue(e){this.disabled||this.readonly||(this.value=e===this.value?0:e,this.isHovering=!1)}handleKeyDown(e){const t="ltr"===this.localize.dir(),i="rtl"===this.localize.dir(),r=this.value;if(!this.disabled&&!this.readonly){if("ArrowDown"===e.key||t&&"ArrowLeft"===e.key||i&&"ArrowRight"===e.key){const t=e.shiftKey?1:this.precision;this.value=Math.max(0,this.value-t),e.preventDefault()}if("ArrowUp"===e.key||t&&"ArrowRight"===e.key||i&&"ArrowLeft"===e.key){const t=e.shiftKey?1:this.precision;this.value=Math.min(this.max,this.value+t),e.preventDefault()}"Home"===e.key&&(this.value=0,e.preventDefault()),"End"===e.key&&(this.value=this.max,e.preventDefault()),this.value!==r&&this.emit("sl-change")}}handleMouseEnter(e){this.isHovering=!0,this.hoverValue=this.getValueFromMousePosition(e)}handleMouseMove(e){this.hoverValue=this.getValueFromMousePosition(e)}handleMouseLeave(){this.isHovering=!1}handleTouchStart(e){this.isHovering=!0,this.hoverValue=this.getValueFromTouchPosition(e),e.preventDefault()}handleTouchMove(e){this.hoverValue=this.getValueFromTouchPosition(e)}handleTouchEnd(e){this.isHovering=!1,this.setValue(this.hoverValue),this.emit("sl-change"),e.preventDefault()}roundToPrecision(e,t=.5){const i=1/t;return Math.ceil(e*i)/i}handleHoverValueChange(){this.emit("sl-hover",{detail:{phase:"move",value:this.hoverValue}})}handleIsHoveringChange(){this.emit("sl-hover",{detail:{phase:this.isHovering?"start":"end",value:this.hoverValue}})}focus(e){this.rating.focus(e)}blur(){this.rating.blur()}render(){const e="rtl"===this.localize.dir(),t=Array.from(Array(this.max).keys());let i=0;return i=this.disabled||this.readonly?this.value:this.isHovering?this.hoverValue:this.value,a.y`
      <div
        part="base"
        class=${(0,h.o)({rating:!0,"rating--readonly":this.readonly,"rating--disabled":this.disabled,"rating--rtl":e})}
        role="slider"
        aria-label=${this.label}
        aria-disabled=${this.disabled?"true":"false"}
        aria-readonly=${this.readonly?"true":"false"}
        aria-valuenow=${this.value}
        aria-valuemin=${0}
        aria-valuemax=${this.max}
        tabindex=${this.disabled?"-1":"0"}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mouseenter=${this.handleMouseEnter}
        @touchstart=${this.handleTouchStart}
        @mouseleave=${this.handleMouseLeave}
        @touchend=${this.handleTouchEnd}
        @mousemove=${this.handleMouseMove}
        @touchmove=${this.handleTouchMove}
      >
        <span class="rating__symbols rating__symbols--inactive">
          ${t.map((e=>a.y`
              <span
                class=${(0,h.o)({rating__symbol:!0,"rating__symbol--hover":this.isHovering&&Math.ceil(i)===e+1})}
                role="presentation"
                @mouseenter=${this.handleMouseEnter}
              >
                ${b(this.getSymbol(e+1))}
              </span>
            `))}
        </span>

        <span class="rating__symbols rating__symbols--indicator">
          ${t.map((t=>a.y`
              <span
                class=${(0,h.o)({rating__symbol:!0,"rating__symbol--hover":this.isHovering&&Math.ceil(i)===t+1})}
                style=${(0,s.i)({clipPath:i>t+1?"none":e?`inset(0 0 0 ${100-(i-t)/1*100}%)`:`inset(0 ${100-(i-t)/1*100}% 0 0)`})}
                role="presentation"
              >
                ${b(this.getSymbol(t+1))}
              </span>
            `))}
        </span>
      </div>
    `}};v.styles=o,(0,p.u2)([(0,u.i)(".rating")],v.prototype,"rating",2),(0,p.u2)([(0,u.t)()],v.prototype,"hoverValue",2),(0,p.u2)([(0,u.t)()],v.prototype,"isHovering",2),(0,p.u2)([(0,u.e2)()],v.prototype,"label",2),(0,p.u2)([(0,u.e2)({type:Number})],v.prototype,"value",2),(0,p.u2)([(0,u.e2)({type:Number})],v.prototype,"max",2),(0,p.u2)([(0,u.e2)({type:Number})],v.prototype,"precision",2),(0,p.u2)([(0,u.e2)({type:Boolean,reflect:!0})],v.prototype,"readonly",2),(0,p.u2)([(0,u.e2)({type:Boolean,reflect:!0})],v.prototype,"disabled",2),(0,p.u2)([(0,u.e2)()],v.prototype,"getSymbol",2),(0,p.u2)([(0,u.e3)({passive:!0})],v.prototype,"handleTouchMove",1),(0,p.u2)([(0,d.Y)("hoverValue")],v.prototype,"handleHoverValueChange",1),(0,p.u2)([(0,d.Y)("isHovering")],v.prototype,"handleIsHoveringChange",1),v=(0,p.u2)([(0,u.e)("sl-rating")],v),i(1862),i(9940),i(9191),i(836),i(2759),i(1939)},3442:(e,t,i)=>{var r=i(8379),a=i(8424),o=i(5954),s=i(453),l=[{max:276e4,value:6e4,unit:"minute"},{max:72e6,value:36e5,unit:"hour"},{max:5184e5,value:864e5,unit:"day"},{max:24192e5,value:6048e5,unit:"week"},{max:28512e6,value:2592e6,unit:"month"},{max:1/0,value:31536e6,unit:"year"}],n=class extends a.P{constructor(){super(...arguments),this.localize=new r.V(this),this.isoTime="",this.relativeTime="",this.titleTime="",this.date=new Date,this.format="long",this.numeric="auto",this.sync=!1}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.updateTimeout)}render(){const e=new Date,t=new Date(this.date);if(isNaN(t.getMilliseconds()))return this.relativeTime="",this.isoTime="","";const i=t.getTime()-e.getTime(),{unit:r,value:a}=l.find((e=>Math.abs(i)<e.max));if(this.isoTime=t.toISOString(),this.titleTime=this.localize.date(t,{month:"long",year:"numeric",day:"numeric",hour:"numeric",minute:"numeric",timeZoneName:"short"}),this.relativeTime=this.localize.relativeTime(Math.round(i/a),r,{numeric:this.numeric,style:this.format}),clearTimeout(this.updateTimeout),this.sync){let e;e=function(e){const t={second:1e3,minute:6e4,hour:36e5,day:864e5}[e];return t-Date.now()%t}("minute"===r?"second":"hour"===r?"minute":"day"===r?"hour":"day"),this.updateTimeout=window.setTimeout((()=>this.requestUpdate()),e)}return o.y` <time datetime=${this.isoTime} title=${this.titleTime}>${this.relativeTime}</time> `}};(0,s.u2)([(0,a.t)()],n.prototype,"isoTime",2),(0,s.u2)([(0,a.t)()],n.prototype,"relativeTime",2),(0,s.u2)([(0,a.t)()],n.prototype,"titleTime",2),(0,s.u2)([(0,a.e2)()],n.prototype,"date",2),(0,s.u2)([(0,a.e2)()],n.prototype,"format",2),(0,s.u2)([(0,a.e2)()],n.prototype,"numeric",2),(0,s.u2)([(0,a.e2)({type:Boolean})],n.prototype,"sync",2),n=(0,s.u2)([(0,a.e)("sl-relative-time")],n),i(1862)},9092:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    display: contents;
  }
`,s=i(5710),l=i(8424),n=i(453),d=class extends l.P{constructor(){super(...arguments),this.observedElements=[],this.disabled=!1}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver((e=>{this.emit("sl-resize",{detail:{entries:e}})})),this.disabled||this.startObserver()}disconnectedCallback(){super.disconnectedCallback(),this.stopObserver()}handleSlotChange(){this.disabled||this.startObserver()}startObserver(){const e=this.shadowRoot.querySelector("slot");if(null!==e){const t=e.assignedElements({flatten:!0});this.observedElements.forEach((e=>this.resizeObserver.unobserve(e))),this.observedElements=[],t.forEach((e=>{this.resizeObserver.observe(e),this.observedElements.push(e)}))}}stopObserver(){this.resizeObserver.disconnect()}handleDisabledChange(){this.disabled?this.stopObserver():this.startObserver()}render(){return a.y` <slot @slotchange=${this.handleSlotChange}></slot> `}};d.styles=o,(0,n.u2)([(0,l.e2)({type:Boolean,reflect:!0})],d.prototype,"disabled",2),(0,n.u2)([(0,s.Y)("disabled",{waitUntilFirstUpdate:!0})],d.prototype,"handleDisabledChange",1),d=(0,n.u2)([(0,l.e)("sl-resize-observer")],d)},3873:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

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
`,s=i(5381),l=i(8424),n=i(453),d=class extends l.P{constructor(){super(...arguments),this.effect="none"}render(){return a.y`
      <div
        part="base"
        class=${(0,s.o)({skeleton:!0,"skeleton--pulse":"pulse"===this.effect,"skeleton--sheen":"sheen"===this.effect})}
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `}};d.styles=o,(0,n.u2)([(0,l.e2)()],d.prototype,"effect",2),d=(0,n.u2)([(0,l.e)("sl-skeleton")],d),i(4370)},7201:(e,t,i)=>{i(6328),i(8832),i(8379),i(1862),i(8424),i(6281),i(5954),i(453)},9399:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

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
`,s=i(6200),l=i(1807),n=i(8734),d=i(8379),h=i(5710),c=i(8424),u=i(453),p=class extends c.P{constructor(){super(...arguments),this.localize=new d.V(this),this.position=50,this.vertical=!1,this.disabled=!1,this.snapThreshold=12}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver((e=>this.handleResize(e))),this.updateComplete.then((()=>this.resizeObserver.observe(this))),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this)}detectSize(){const{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){const t="rtl"===this.localize.dir();this.disabled||(e.cancelable&&e.preventDefault(),(0,s.o)(this,{onMove:(e,i)=>{let r=this.vertical?i:e;"end"===this.primary&&(r=this.size-r),this.snap&&this.snap.split(" ").forEach((e=>{let i;i=e.endsWith("%")?this.size*(parseFloat(e)/100):parseFloat(e),t&&!this.vertical&&(i=this.size-i),r>=i-this.snapThreshold&&r<=i+this.snapThreshold&&(r=i)})),this.position=(0,l.u)(this.pixelsToPercentage(r),0,100)},initialEvent:e}))}handleKeyDown(e){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key)){let t=this.position;const i=(e.shiftKey?10:1)*("end"===this.primary?-1:1);e.preventDefault(),("ArrowLeft"===e.key&&!this.vertical||"ArrowUp"===e.key&&this.vertical)&&(t-=i),("ArrowRight"===e.key&&!this.vertical||"ArrowDown"===e.key&&this.vertical)&&(t+=i),"Home"===e.key&&(t="end"===this.primary?100:0),"End"===e.key&&(t="end"===this.primary?0:100),this.position=(0,l.u)(t,0,100)}}handleResize(e){const{width:t,height:i}=e[0].contentRect;this.size=this.vertical?i:t,this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){const e=this.vertical?"gridTemplateRows":"gridTemplateColumns",t=this.vertical?"gridTemplateColumns":"gridTemplateRows",i="rtl"===this.localize.dir(),r=`\n      clamp(\n        0%,\n        clamp(\n          var(--min),\n          ${this.position}% - var(--divider-width) / 2,\n          var(--max)\n        ),\n        calc(100% - var(--divider-width))\n      )\n    `,o="auto";return"end"===this.primary?i&&!this.vertical?this.style[e]=`${r} var(--divider-width) ${o}`:this.style[e]=`${o} var(--divider-width) ${r}`:i&&!this.vertical?this.style[e]=`${o} var(--divider-width) ${r}`:this.style[e]=`${r} var(--divider-width) ${o}`,this.style[t]="",a.y`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${(0,n.l)(this.disabled?void 0:"0")}
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
    `}};p.styles=o,(0,u.u2)([(0,c.i)(".divider")],p.prototype,"divider",2),(0,u.u2)([(0,c.e2)({type:Number,reflect:!0})],p.prototype,"position",2),(0,u.u2)([(0,c.e2)({attribute:"position-in-pixels",type:Number})],p.prototype,"positionInPixels",2),(0,u.u2)([(0,c.e2)({type:Boolean,reflect:!0})],p.prototype,"vertical",2),(0,u.u2)([(0,c.e2)({type:Boolean,reflect:!0})],p.prototype,"disabled",2),(0,u.u2)([(0,c.e2)()],p.prototype,"primary",2),(0,u.u2)([(0,c.e2)()],p.prototype,"snap",2),(0,u.u2)([(0,c.e2)({type:Number,attribute:"snap-threshold"})],p.prototype,"snapThreshold",2),(0,u.u2)([(0,h.Y)("position")],p.prototype,"handlePositionChange",1),(0,u.u2)([(0,h.Y)("positionInPixels")],p.prototype,"handlePositionInPixelsChange",1),(0,u.u2)([(0,h.Y)("vertical")],p.prototype,"handleVerticalChange",1),p=(0,u.u2)([(0,c.e)("sl-split-panel")],p),i(1862)},7061:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

  :host {
    display: inline-block;
  }

  :host([size='small']) {
    --height: var(--sl-toggle-size-small);
    --thumb-size: calc(var(--sl-toggle-size-small) + 4px);
    --width: calc(var(--height) * 2);

    font-size: var(--sl-input-font-size-small);
  }

  :host([size='medium']) {
    --height: var(--sl-toggle-size-medium);
    --thumb-size: calc(var(--sl-toggle-size-medium) + 4px);
    --width: calc(var(--height) * 2);

    font-size: var(--sl-input-font-size-medium);
  }

  :host([size='large']) {
    --height: var(--sl-toggle-size-large);
    --thumb-size: calc(var(--sl-toggle-size-large) + 4px);
    --width: calc(var(--height) * 2);

    font-size: var(--sl-input-font-size-large);
  }

  .switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    font-family: var(--sl-input-font-family);
    font-size: inherit;
    font-weight: var(--sl-input-font-weight);
    color: var(--sl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .switch__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background-color: var(--sl-color-neutral-400);
    border: solid var(--sl-input-border-width) var(--sl-color-neutral-400);
    border-radius: var(--height);
    transition: var(--sl-transition-fast) border-color, var(--sl-transition-fast) background-color;
  }

  .switch__control .switch__thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--sl-color-neutral-0);
    border-radius: 50%;
    border: solid var(--sl-input-border-width) var(--sl-color-neutral-400);
    translate: calc((var(--width) - var(--height)) / -2);
    transition: var(--sl-transition-fast) translate ease, var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) border-color, var(--sl-transition-fast) box-shadow;
  }

  .switch__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Hover */
  .switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover {
    background-color: var(--sl-color-neutral-400);
    border-color: var(--sl-color-neutral-400);
  }

  .switch:not(.switch--checked):not(.switch--disabled) .switch__control:hover .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-neutral-400);
  }

  /* Focus */
  .switch:not(.switch--checked):not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
    background-color: var(--sl-color-neutral-400);
    border-color: var(--sl-color-neutral-400);
  }

  .switch:not(.switch--checked):not(.switch--disabled) .switch__input:focus-visible ~ .switch__control .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Checked */
  .switch--checked .switch__control {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
  }

  .switch--checked .switch__control .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    translate: calc((var(--width) - var(--height)) / 2);
  }

  /* Checked + hover */
  .switch.switch--checked:not(.switch--disabled) .switch__control:hover {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
  }

  .switch.switch--checked:not(.switch--disabled) .switch__control:hover .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
  }

  /* Checked + focus */
  .switch.switch--checked:not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
  }

  .switch.switch--checked:not(.switch--disabled) .switch__input:focus-visible ~ .switch__control .switch__thumb {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-color-primary-600);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Disabled */
  .switch--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .switch__label {
    display: inline-block;
    line-height: var(--height);
    margin-inline-start: 0.5em;
    user-select: none;
  }

  :host([required]) .switch__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
  }

  @media (forced-colors: active) {
    .switch.switch--checked:not(.switch--disabled) .switch__control:hover .switch__thumb,
    .switch--checked .switch__control .switch__thumb {
      background-color: ButtonText;
    }
  }
`,s=i(4617),l=i(4577),n=i(3480),d=i(8734),h=i(5710),c=i(5381),u=i(8424),p=i(453),m=class extends u.P{constructor(){super(...arguments),this.formControlController=new n.pY(this,{value:e=>e.checked?e.value||"on":void 0,defaultValue:e=>e.defaultChecked,setValue:(e,t)=>e.checked=t}),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.defaultChecked=!1,this.form="",this.required=!1}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}handleClick(){this.checked=!this.checked,this.emit("sl-change")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleKeyDown(e){"ArrowLeft"===e.key&&(e.preventDefault(),this.checked=!1,this.emit("sl-change"),this.emit("sl-input")),"ArrowRight"===e.key&&(e.preventDefault(),this.checked=!0,this.emit("sl-change"),this.emit("sl-input"))}handleCheckedChange(){this.input.checked=this.checked,this.formControlController.updateValidity()}handleDisabledChange(){this.formControlController.setValidity(!0)}click(){this.input.click()}focus(e){this.input.focus(e)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.formControlController.updateValidity()}render(){return a.y`
      <label
        part="base"
        class=${(0,c.o)({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled,"switch--focused":this.hasFocus,"switch--small":"small"===this.size,"switch--medium":"medium"===this.size,"switch--large":"large"===this.size})}
      >
        <input
          class="switch__input"
          type="checkbox"
          title=${this.title}
          name=${this.name}
          value=${(0,d.l)(this.value)}
          .checked=${(0,s.l)(this.checked)}
          .disabled=${this.disabled}
          .required=${this.required}
          role="switch"
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @input=${this.handleInput}
          @invalid=${this.handleInvalid}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @keydown=${this.handleKeyDown}
        />

        <span part="control" class="switch__control">
          <span part="thumb" class="switch__thumb"></span>
        </span>

        <slot part="label" class="switch__label"></slot>
      </label>
    `}};m.styles=o,(0,p.u2)([(0,u.i)('input[type="checkbox"]')],m.prototype,"input",2),(0,p.u2)([(0,u.t)()],m.prototype,"hasFocus",2),(0,p.u2)([(0,u.e2)()],m.prototype,"title",2),(0,p.u2)([(0,u.e2)()],m.prototype,"name",2),(0,p.u2)([(0,u.e2)()],m.prototype,"value",2),(0,p.u2)([(0,u.e2)({reflect:!0})],m.prototype,"size",2),(0,p.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"disabled",2),(0,p.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"checked",2),(0,p.u2)([(0,l.L)("checked")],m.prototype,"defaultChecked",2),(0,p.u2)([(0,u.e2)({reflect:!0})],m.prototype,"form",2),(0,p.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"required",2),(0,p.u2)([(0,h.Y)("checked",{waitUntilFirstUpdate:!0})],m.prototype,"handleCheckedChange",1),(0,p.u2)([(0,h.Y)("disabled",{waitUntilFirstUpdate:!0})],m.prototype,"handleDisabledChange",1),m=(0,p.u2)([(0,u.e)("sl-switch")],m),i(4370)},1025:(e,t,i)=>{i(5013),i(8595),i(3149),i(4073),i(3251),i(8734),i(8379),i(1862),i(9940),i(9191),i(836),i(2759),i(1939),i(5710),i(5381),i(4370),i(8424),i(6281),i(5954),i(453)},7515:(e,t,i)=>{var r=i(3434),a=i(6281),o=i(5954),s=o.i`
  ${a.N}
  ${r.n}

  :host {
    display: block;
  }

  .textarea {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    transition: var(--sl-transition-fast) color, var(--sl-transition-fast) border, var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
    cursor: text;
  }

  /* Standard textareas */
  .textarea--standard {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .textarea--standard:hover:not(.textarea--disabled) {
    background-color: var(--sl-input-background-color-hover);
    border-color: var(--sl-input-border-color-hover);
  }
  .textarea--standard:hover:not(.textarea--disabled) .textarea__control {
    color: var(--sl-input-color-hover);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    color: var(--sl-input-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) .textarea__control {
    color: var(--sl-input-color-focus);
  }

  .textarea--standard.textarea--disabled {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .textarea--standard.textarea--disabled .textarea__control {
    color: var(--sl-input-color-disabled);
  }

  .textarea--standard.textarea--disabled .textarea__control::placeholder {
    color: var(--sl-input-placeholder-color-disabled);
  }

  /* Filled textareas */
  .textarea--filled {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .textarea--filled:hover:not(.textarea--disabled) {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .textarea--filled.textarea--focused:not(.textarea--disabled) {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .textarea--filled.textarea--disabled {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .textarea__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: 1.4;
    color: var(--sl-input-color);
    border: none;
    background: none;
    box-shadow: none;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .textarea__control::-webkit-search-decoration,
  .textarea__control::-webkit-search-cancel-button,
  .textarea__control::-webkit-search-results-button,
  .textarea__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .textarea__control::placeholder {
    color: var(--sl-input-placeholder-color);
    user-select: none;
  }

  .textarea__control:focus {
    outline: none;
  }

  /*
   * Size modifiers
   */

  .textarea--small {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
  }

  .textarea--small .textarea__control {
    padding: 0.5em var(--sl-input-spacing-small);
  }

  .textarea--medium {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
  }

  .textarea--medium .textarea__control {
    padding: 0.5em var(--sl-input-spacing-medium);
  }

  .textarea--large {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
  }

  .textarea--large .textarea__control {
    padding: 0.5em var(--sl-input-spacing-large);
  }

  /*
   * Resize types
   */

  .textarea--resize-none .textarea__control {
    resize: none;
  }

  .textarea--resize-vertical .textarea__control {
    resize: vertical;
  }

  .textarea--resize-auto .textarea__control {
    height: auto;
    resize: none;
    overflow-y: hidden;
  }
`,l=i(4617),n=i(4577),d=i(3480),h=i(8734),c=i(3515),u=i(5710),p=i(5381),m=i(8424),b=i(453),v=class extends m.P{constructor(){super(...arguments),this.formControlController=new d.pY(this,{assumeInteractionOn:["sl-blur","sl-input"]}),this.hasSlotController=new c.r(this,"help-text","label"),this.hasFocus=!1,this.title="",this.name="",this.value="",this.size="medium",this.filled=!1,this.label="",this.helpText="",this.placeholder="",this.rows=4,this.resize="vertical",this.disabled=!1,this.readonly=!1,this.form="",this.required=!1,this.spellcheck=!0,this.defaultValue=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver((()=>this.setTextareaHeight())),this.updateComplete.then((()=>{this.setTextareaHeight(),this.resizeObserver.observe(this.input)}))}firstUpdated(){this.formControlController.updateValidity()}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this.input)}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.setTextareaHeight(),this.emit("sl-change")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.emit("sl-input")}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}setTextareaHeight(){"auto"===this.resize?(this.input.style.height="auto",this.input.style.height=`${this.input.scrollHeight}px`):this.input.style.height=void 0}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleRowsChange(){this.setTextareaHeight()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity(),this.setTextareaHeight()}focus(e){this.input.focus(e)}blur(){this.input.blur()}select(){this.input.select()}scrollPosition(e){return e?("number"==typeof e.top&&(this.input.scrollTop=e.top),void("number"==typeof e.left&&(this.input.scrollLeft=e.left))):{top:this.input.scrollTop,left:this.input.scrollTop}}setSelectionRange(e,t,i="none"){this.input.setSelectionRange(e,t,i)}setRangeText(e,t,i,r){this.input.setRangeText(e,t,i,r),this.value!==this.input.value&&(this.value=this.input.value),this.value!==this.input.value&&(this.value=this.input.value,this.setTextareaHeight())}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.formControlController.updateValidity()}render(){const e=this.hasSlotController.test("label"),t=this.hasSlotController.test("help-text"),i=!!this.label||!!e,r=!!this.helpText||!!t;return o.y`
      <div
        part="form-control"
        class=${(0,p.o)({"form-control":!0,"form-control--small":"small"===this.size,"form-control--medium":"medium"===this.size,"form-control--large":"large"===this.size,"form-control--has-label":i,"form-control--has-help-text":r})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${i?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${(0,p.o)({textarea:!0,"textarea--small":"small"===this.size,"textarea--medium":"medium"===this.size,"textarea--large":"large"===this.size,"textarea--standard":!this.filled,"textarea--filled":this.filled,"textarea--disabled":this.disabled,"textarea--focused":this.hasFocus,"textarea--empty":!this.value,"textarea--resize-none":"none"===this.resize,"textarea--resize-vertical":"vertical"===this.resize,"textarea--resize-auto":"auto"===this.resize})}
          >
            <textarea
              part="textarea"
              id="input"
              class="textarea__control"
              title=${this.title}
              name=${(0,h.l)(this.name)}
              .value=${(0,l.l)(this.value)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${(0,h.l)(this.placeholder)}
              rows=${(0,h.l)(this.rows)}
              minlength=${(0,h.l)(this.minlength)}
              maxlength=${(0,h.l)(this.maxlength)}
              autocapitalize=${(0,h.l)(this.autocapitalize)}
              autocorrect=${(0,h.l)(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${(0,h.l)(this.spellcheck)}
              enterkeyhint=${(0,h.l)(this.enterkeyhint)}
              inputmode=${(0,h.l)(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            ></textarea>
          </div>
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${r?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </div>
    `}};v.styles=s,(0,b.u2)([(0,m.i)(".textarea__control")],v.prototype,"input",2),(0,b.u2)([(0,m.t)()],v.prototype,"hasFocus",2),(0,b.u2)([(0,m.e2)()],v.prototype,"title",2),(0,b.u2)([(0,m.e2)()],v.prototype,"name",2),(0,b.u2)([(0,m.e2)()],v.prototype,"value",2),(0,b.u2)([(0,m.e2)({reflect:!0})],v.prototype,"size",2),(0,b.u2)([(0,m.e2)({type:Boolean,reflect:!0})],v.prototype,"filled",2),(0,b.u2)([(0,m.e2)()],v.prototype,"label",2),(0,b.u2)([(0,m.e2)({attribute:"help-text"})],v.prototype,"helpText",2),(0,b.u2)([(0,m.e2)()],v.prototype,"placeholder",2),(0,b.u2)([(0,m.e2)({type:Number})],v.prototype,"rows",2),(0,b.u2)([(0,m.e2)()],v.prototype,"resize",2),(0,b.u2)([(0,m.e2)({type:Boolean,reflect:!0})],v.prototype,"disabled",2),(0,b.u2)([(0,m.e2)({type:Boolean,reflect:!0})],v.prototype,"readonly",2),(0,b.u2)([(0,m.e2)({reflect:!0})],v.prototype,"form",2),(0,b.u2)([(0,m.e2)({type:Boolean,reflect:!0})],v.prototype,"required",2),(0,b.u2)([(0,m.e2)({type:Number})],v.prototype,"minlength",2),(0,b.u2)([(0,m.e2)({type:Number})],v.prototype,"maxlength",2),(0,b.u2)([(0,m.e2)()],v.prototype,"autocapitalize",2),(0,b.u2)([(0,m.e2)()],v.prototype,"autocorrect",2),(0,b.u2)([(0,m.e2)()],v.prototype,"autocomplete",2),(0,b.u2)([(0,m.e2)({type:Boolean})],v.prototype,"autofocus",2),(0,b.u2)([(0,m.e2)()],v.prototype,"enterkeyhint",2),(0,b.u2)([(0,m.e2)({type:Boolean,converter:{fromAttribute:e=>!(!e||"false"===e),toAttribute:e=>e?"true":"false"}})],v.prototype,"spellcheck",2),(0,b.u2)([(0,m.e2)()],v.prototype,"inputmode",2),(0,b.u2)([(0,n.L)()],v.prototype,"defaultValue",2),(0,b.u2)([(0,u.Y)("disabled",{waitUntilFirstUpdate:!0})],v.prototype,"handleDisabledChange",1),(0,b.u2)([(0,u.Y)("rows",{waitUntilFirstUpdate:!0})],v.prototype,"handleRowsChange",1),(0,b.u2)([(0,u.Y)("value",{waitUntilFirstUpdate:!0})],v.prototype,"handleValueChange",1),v=(0,b.u2)([(0,m.e)("sl-textarea")],v),i(4370)},828:(e,t,i)=>{var r=i(6281),a=i(5954),o=a.i`
  ${r.N}

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
`,s=i(2486),l=i(4867),n=i(9745),d=i(8379),h=i(5710),c=i(5381),u=i(8424),p=i(453),m=class extends u.P{constructor(){super(...arguments),this.localize=new d.V(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1}connectedCallback(){super.connectedCallback(),this.handleBlur=this.handleBlur.bind(this),this.handleClick=this.handleClick.bind(this),this.handleFocus=this.handleFocus.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleMouseOver=this.handleMouseOver.bind(this),this.handleMouseOut=this.handleMouseOut.bind(this),this.updateComplete.then((()=>{this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("keydown",this.handleKeyDown),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}))}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("blur",this.handleBlur,!0),this.removeEventListener("focus",this.handleFocus,!0),this.removeEventListener("click",this.handleClick),this.removeEventListener("keydown",this.handleKeyDown),this.removeEventListener("mouseover",this.handleMouseOver),this.removeEventListener("mouseout",this.handleMouseOut)}handleBlur(){this.hasTrigger("focus")&&this.hide()}handleClick(){this.hasTrigger("click")&&(this.open?this.hide():this.show())}handleFocus(){this.hasTrigger("focus")&&this.show()}handleKeyDown(e){this.open&&"Escape"===e.key&&(e.stopPropagation(),this.hide())}handleMouseOver(){if(this.hasTrigger("hover")){const e=(0,n.RA)(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout((()=>this.show()),e)}}handleMouseOut(){if(this.hasTrigger("hover")){const e=(0,n.RA)(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout((()=>this.hide()),e)}}hasTrigger(e){return this.trigger.split(" ").includes(e)}async handleOpenChange(){if(this.open){if(this.disabled)return;this.emit("sl-show"),await(0,n.U_)(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:e,options:t}=(0,s.O8)(this,"tooltip.show",{dir:this.localize.dir()});await(0,n.nv)(this.popup.popup,e,t),this.emit("sl-after-show")}else{this.emit("sl-hide"),await(0,n.U_)(this.body);const{keyframes:e,options:t}=(0,s.O8)(this,"tooltip.hide",{dir:this.localize.dir()});await(0,n.nv)(this.popup.popup,e,t),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,(0,l.m)(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,(0,l.m)(this,"sl-after-hide")}render(){return a.y`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${(0,c.o)({tooltip:!0,"tooltip--open":this.open})}
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
    `}};m.styles=o,(0,p.u2)([(0,u.i)("slot:not([name])")],m.prototype,"defaultSlot",2),(0,p.u2)([(0,u.i)(".tooltip__body")],m.prototype,"body",2),(0,p.u2)([(0,u.i)("sl-popup")],m.prototype,"popup",2),(0,p.u2)([(0,u.e2)()],m.prototype,"content",2),(0,p.u2)([(0,u.e2)()],m.prototype,"placement",2),(0,p.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"disabled",2),(0,p.u2)([(0,u.e2)({type:Number})],m.prototype,"distance",2),(0,p.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"open",2),(0,p.u2)([(0,u.e2)({type:Number})],m.prototype,"skidding",2),(0,p.u2)([(0,u.e2)()],m.prototype,"trigger",2),(0,p.u2)([(0,u.e2)({type:Boolean})],m.prototype,"hoist",2),(0,p.u2)([(0,h.Y)("open",{waitUntilFirstUpdate:!0})],m.prototype,"handleOpenChange",1),(0,p.u2)([(0,h.Y)(["content","distance","hoist","placement","skidding"])],m.prototype,"handleOptionsChange",1),(0,p.u2)([(0,h.Y)("disabled")],m.prototype,"handleDisabledChange",1),m=(0,p.u2)([(0,u.e)("sl-tooltip")],m),(0,s.jx)("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),(0,s.jx)("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),i(6789),i(1732),i(1862),i(4370)},2151:(e,t,i)=>{i(4625),i(2443),i(8424),i(6281),i(5954),i(453)}}]);
//# sourceMappingURL=2493.0e0e0359.js.map