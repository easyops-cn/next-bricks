"use strict";(self.webpackChunk_next_bricks_shoelace=self.webpackChunk_next_bricks_shoelace||[]).push([[9268],{7029:(e,t,a)=>{var i=a(2484);t.s=i.createRoot,i.hydrateRoot},7896:(e,t,a)=>{function i(){return i=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var i in a)Object.prototype.hasOwnProperty.call(a,i)&&(e[i]=a[i])}return e},i.apply(this,arguments)}a.d(t,{Z:()=>i})},3897:(e,t,a)=>{a.d(t,{u:()=>s});var i=a(1199),o=[],s=class{constructor(e){this.tabDirection="forward",this.element=e,this.handleFocusIn=this.handleFocusIn.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleKeyUp=this.handleKeyUp.bind(this)}activate(){o.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){o=o.filter((e=>e!==this.element)),document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return o[o.length-1]===this.element}checkFocus(){if(this.isActive()&&!this.element.matches(":focus-within")){const{start:e,end:t}=(0,i.C)(this.element),a="forward"===this.tabDirection?e:t;"function"==typeof(null==a?void 0:a.focus)&&a.focus({preventScroll:!0})}}handleFocusIn(){this.checkFocus()}handleKeyDown(e){"Tab"===e.key&&e.shiftKey&&(this.tabDirection="backward",requestAnimationFrame((()=>this.checkFocus())))}handleKeyUp(){this.tabDirection="forward"}}},5099:(e,t,a)=>{var i=a(2486),o=a(4867),s=a(9745),l=a(3515),r=a(8379),n=a(5710),d=a(6281),h=a(5954),c=h.i`
  ${d.N}

  :host {
    display: contents;

    /* For better DX, we'll reset the margin here so the base part can inherit it */
    margin: 0;
  }

  .alert {
    position: relative;
    display: flex;
    align-items: stretch;
    background-color: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-top-width: calc(var(--sl-panel-border-width) * 3);
    border-radius: var(--sl-border-radius-medium);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: 1.6;
    color: var(--sl-color-neutral-700);
    margin: inherit;
  }

  .alert:not(.alert--has-icon) .alert__icon,
  .alert:not(.alert--closable) .alert__close-button {
    display: none;
  }

  .alert__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-large);
    padding-inline-start: var(--sl-spacing-large);
  }

  .alert--primary {
    border-top-color: var(--sl-color-primary-600);
  }

  .alert--primary .alert__icon {
    color: var(--sl-color-primary-600);
  }

  .alert--success {
    border-top-color: var(--sl-color-success-600);
  }

  .alert--success .alert__icon {
    color: var(--sl-color-success-600);
  }

  .alert--neutral {
    border-top-color: var(--sl-color-neutral-600);
  }

  .alert--neutral .alert__icon {
    color: var(--sl-color-neutral-600);
  }

  .alert--warning {
    border-top-color: var(--sl-color-warning-600);
  }

  .alert--warning .alert__icon {
    color: var(--sl-color-warning-600);
  }

  .alert--danger {
    border-top-color: var(--sl-color-danger-600);
  }

  .alert--danger .alert__icon {
    color: var(--sl-color-danger-600);
  }

  .alert__message {
    flex: 1 1 auto;
    display: block;
    padding: var(--sl-spacing-large);
    overflow: hidden;
  }

  .alert__close-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-medium);
    padding-inline-end: var(--sl-spacing-medium);
  }
`,p=a(5381),u=a(8424),g=a(453),y=Object.assign(document.createElement("div"),{className:"sl-toast-stack"}),m=class extends u.P{constructor(){super(...arguments),this.hasSlotController=new l.r(this,"icon","suffix"),this.localize=new r.V(this),this.open=!1,this.closable=!1,this.variant="primary",this.duration=1/0}firstUpdated(){this.base.hidden=!this.open}restartAutoHide(){clearTimeout(this.autoHideTimeout),this.open&&this.duration<1/0&&(this.autoHideTimeout=window.setTimeout((()=>this.hide()),this.duration))}handleCloseClick(){this.hide()}handleMouseMove(){this.restartAutoHide()}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.duration<1/0&&this.restartAutoHide(),await(0,s.U_)(this.base),this.base.hidden=!1;const{keyframes:e,options:t}=(0,i.O8)(this,"alert.show",{dir:this.localize.dir()});await(0,s.nv)(this.base,e,t),this.emit("sl-after-show")}else{this.emit("sl-hide"),clearTimeout(this.autoHideTimeout),await(0,s.U_)(this.base);const{keyframes:e,options:t}=(0,i.O8)(this,"alert.hide",{dir:this.localize.dir()});await(0,s.nv)(this.base,e,t),this.base.hidden=!0,this.emit("sl-after-hide")}}handleDurationChange(){this.restartAutoHide()}async show(){if(!this.open)return this.open=!0,(0,o.m)(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,(0,o.m)(this,"sl-after-hide")}async toast(){return new Promise((e=>{null===y.parentElement&&document.body.append(y),y.appendChild(this),requestAnimationFrame((()=>{this.clientWidth,this.show()})),this.addEventListener("sl-after-hide",(()=>{y.removeChild(this),e(),null===y.querySelector("sl-alert")&&y.remove()}),{once:!0})}))}render(){return h.y`
      <div
        part="base"
        class=${(0,p.o)({alert:!0,"alert--open":this.open,"alert--closable":this.closable,"alert--has-icon":this.hasSlotController.test("icon"),"alert--primary":"primary"===this.variant,"alert--success":"success"===this.variant,"alert--neutral":"neutral"===this.variant,"alert--warning":"warning"===this.variant,"alert--danger":"danger"===this.variant})}
        role="alert"
        aria-hidden=${this.open?"false":"true"}
        @mousemove=${this.handleMouseMove}
      >
        <slot name="icon" part="icon" class="alert__icon"></slot>

        <slot part="message" class="alert__message" aria-live="polite"></slot>

        ${this.closable?h.y`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                class="alert__close-button"
                name="x-lg"
                library="system"
                label=${this.localize.term("close")}
                @click=${this.handleCloseClick}
              ></sl-icon-button>
            `:""}
      </div>
    `}};m.styles=c,(0,g.u2)([(0,u.i)('[part~="base"]')],m.prototype,"base",2),(0,g.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"open",2),(0,g.u2)([(0,u.e2)({type:Boolean,reflect:!0})],m.prototype,"closable",2),(0,g.u2)([(0,u.e2)({reflect:!0})],m.prototype,"variant",2),(0,g.u2)([(0,u.e2)({type:Number})],m.prototype,"duration",2),(0,g.u2)([(0,n.Y)("open",{waitUntilFirstUpdate:!0})],m.prototype,"handleOpenChange",1),(0,g.u2)([(0,n.Y)("duration")],m.prototype,"handleDurationChange",1),m=(0,g.u2)([(0,u.e)("sl-alert")],m),(0,i.jx)("alert.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:"ease"}}),(0,i.jx)("alert.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:"ease"}}),a(3149),a(4073),a(3251),a(8734),a(1862),a(9940),a(9191),a(836),a(2759),a(1939),a(4370)},4603:(e,t,a)=>{a(3860),a(6328),a(8832),a(3480),a(7772),a(3251),a(8734),a(8379),a(1862),a(9940),a(9191),a(836),a(2759),a(1939),a(5710),a(5381),a(4370),a(8424),a(6281),a(5954),a(453)},1031:(e,t,a)=>{var i=a(3897),o=a(9622),s=a(6281),l=a(5954),r=l.i`
  ${s.N}

  :host {
    --width: 31rem;
    --header-spacing: var(--sl-spacing-large);
    --body-spacing: var(--sl-spacing-large);
    --footer-spacing: var(--sl-spacing-large);

    display: contents;
  }

  .dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--sl-z-index-dialog);
  }

  .dialog__panel {
    display: flex;
    flex-direction: column;
    z-index: 2;
    width: var(--width);
    max-width: calc(100% - var(--sl-spacing-2x-large));
    max-height: calc(100% - var(--sl-spacing-2x-large));
    background-color: var(--sl-panel-background-color);
    border-radius: var(--sl-border-radius-medium);
    box-shadow: var(--sl-shadow-x-large);
  }

  .dialog__panel:focus {
    outline: none;
  }

  /* Ensure there's enough vertical padding for phones that don't update vh when chrome appears (e.g. iPhone) */
  @media screen and (max-width: 420px) {
    .dialog__panel {
      max-height: 80vh;
    }
  }

  .dialog--open .dialog__panel {
    display: flex;
    opacity: 1;
  }

  .dialog__header {
    flex: 0 0 auto;
    display: flex;
  }

  .dialog__title {
    flex: 1 1 auto;
    font: inherit;
    font-size: var(--sl-font-size-large);
    line-height: var(--sl-line-height-dense);
    padding: var(--header-spacing);
    margin: 0;
  }

  .dialog__header-actions {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--sl-spacing-2x-small);
    padding: 0 var(--header-spacing);
  }

  .dialog__header-actions sl-icon-button,
  .dialog__header-actions ::slotted(sl-icon-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-medium);
  }

  .dialog__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .dialog__footer {
    flex: 0 0 auto;
    text-align: right;
    padding: var(--footer-spacing);
  }

  .dialog__footer ::slotted(sl-button:not(:first-of-type)) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  .dialog:not(.dialog--has-footer) .dialog__footer {
    display: none;
  }

  .dialog__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--sl-overlay-background-color);
  }

  @media (forced-colors: active) {
    .dialog__panel {
      border: solid 1px var(--sl-color-neutral-0);
    }
  }
`,n=a(2486),d=a(4867),h=a(9745),c=a(8734),p=a(3515),u=a(8379),g=a(5710),y=a(5381),m=a(8424),v=a(453),f=class extends m.P{constructor(){super(...arguments),this.hasSlotController=new p.r(this,"footer"),this.localize=new u.V(this),this.open=!1,this.label="",this.noHeader=!1}connectedCallback(){super.connectedCallback(),this.handleDocumentKeyDown=this.handleDocumentKeyDown.bind(this),this.modal=new i.u(this)}firstUpdated(){this.dialog.hidden=!this.open,this.open&&(this.addOpenListeners(),this.modal.activate(),(0,o.M4)(this))}disconnectedCallback(){super.disconnectedCallback(),(0,o.gG)(this)}requestClose(e){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:e}}).defaultPrevented){const e=(0,n.O8)(this,"dialog.denyClose",{dir:this.localize.dir()});(0,h.nv)(this.panel,e.keyframes,e.options)}else this.hide()}addOpenListeners(){document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){document.removeEventListener("keydown",this.handleDocumentKeyDown)}handleDocumentKeyDown(e){this.open&&"Escape"===e.key&&(e.stopPropagation(),this.requestClose("keyboard"))}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.modal.activate(),(0,o.M4)(this);const e=this.querySelector("[autofocus]");e&&e.removeAttribute("autofocus"),await Promise.all([(0,h.U_)(this.dialog),(0,h.U_)(this.overlay)]),this.dialog.hidden=!1,requestAnimationFrame((()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute("autofocus","")}));const t=(0,n.O8)(this,"dialog.show",{dir:this.localize.dir()}),a=(0,n.O8)(this,"dialog.overlay.show",{dir:this.localize.dir()});await Promise.all([(0,h.nv)(this.panel,t.keyframes,t.options),(0,h.nv)(this.overlay,a.keyframes,a.options)]),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),this.modal.deactivate(),await Promise.all([(0,h.U_)(this.dialog),(0,h.U_)(this.overlay)]);const e=(0,n.O8)(this,"dialog.hide",{dir:this.localize.dir()}),t=(0,n.O8)(this,"dialog.overlay.hide",{dir:this.localize.dir()});await Promise.all([(0,h.nv)(this.overlay,t.keyframes,t.options).then((()=>{this.overlay.hidden=!0})),(0,h.nv)(this.panel,e.keyframes,e.options).then((()=>{this.panel.hidden=!0}))]),this.dialog.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1,(0,o.gG)(this);const a=this.originalTrigger;"function"==typeof(null==a?void 0:a.focus)&&setTimeout((()=>a.focus())),this.emit("sl-after-hide")}}async show(){if(!this.open)return this.open=!0,(0,d.m)(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,(0,d.m)(this,"sl-after-hide")}render(){return l.y`
      <div
        part="base"
        class=${(0,y.o)({dialog:!0,"dialog--open":this.open,"dialog--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="dialog__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${(0,c.l)(this.noHeader?this.label:void 0)}
          aria-labelledby=${(0,c.l)(this.noHeader?void 0:"title")}
          tabindex="0"
        >
          ${this.noHeader?"":l.y`
                <header part="header" class="dialog__header">
                  <h2 part="title" class="dialog__title" id="title">
                    <slot name="label"> ${this.label.length>0?this.label:String.fromCharCode(65279)} </slot>
                  </h2>
                  <div part="header-actions" class="dialog__header-actions">
                    <slot name="header-actions"></slot>
                    <sl-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="dialog__close"
                      name="x-lg"
                      label=${this.localize.term("close")}
                      library="system"
                      @click="${()=>this.requestClose("close-button")}"
                    ></sl-icon-button>
                  </div>
                </header>
              `}

          <slot part="body" class="dialog__body"></slot>

          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `}};f.styles=r,(0,v.u2)([(0,m.i)(".dialog")],f.prototype,"dialog",2),(0,v.u2)([(0,m.i)(".dialog__panel")],f.prototype,"panel",2),(0,v.u2)([(0,m.i)(".dialog__overlay")],f.prototype,"overlay",2),(0,v.u2)([(0,m.e2)({type:Boolean,reflect:!0})],f.prototype,"open",2),(0,v.u2)([(0,m.e2)({reflect:!0})],f.prototype,"label",2),(0,v.u2)([(0,m.e2)({attribute:"no-header",type:Boolean,reflect:!0})],f.prototype,"noHeader",2),(0,v.u2)([(0,g.Y)("open",{waitUntilFirstUpdate:!0})],f.prototype,"handleOpenChange",1),f=(0,v.u2)([(0,m.e)("sl-dialog")],f),(0,n.jx)("dialog.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:"ease"}}),(0,n.jx)("dialog.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:"ease"}}),(0,n.jx)("dialog.denyClose",{keyframes:[{scale:1},{scale:1.02},{scale:1}],options:{duration:250}}),(0,n.jx)("dialog.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),(0,n.jx)("dialog.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),a(3149),a(4073),a(3251),a(1862),a(9940),a(9191),a(836),a(2759),a(1939),a(4370)},1324:(e,t,a)=>{a(3149),a(4073),a(3251),a(8734),a(9940),a(9191),a(836),a(2759),a(1939),a(5710),a(5381),a(4370),a(8424),a(6281),a(5954),a(453)},7695:(e,t,a)=>{a(9940),a(9191),a(836),a(2759),a(1939),a(5710),a(8424),a(6281),a(5954),a(453)}}]);
//# sourceMappingURL=9268.efb33403.js.map