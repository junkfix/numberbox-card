((LitElement) => {
    console.info('NUMBERBOX_CARD 1.2');
	const html = LitElement.prototype.html;
	const css = LitElement.prototype.css;
	class NumberBox extends LitElement {

		static get properties() {
			return {
				_hass: {},
				config: {},
				stateObj: {},
			}
		}

		static get styles() {
			return css`:host{--st-default-spacing: 1px}
			ha-card{
				-webkit-font-smoothing:var(--paper-font-body1_-_-webkit-font-smoothing);
				font-size:var(--paper-font-body1_-_font-size);
				font-weight:var(--paper-font-body1_-_font-weight);
				line-height:var(--paper-font-body1_-_line-height);
				padding:calc(var(--st-spacing, var(--st-default-spacing)) * 4) 0}
			ha-card.noborder{padding:0 !important;margin:0 !important;
				box-shadow:none !important;border:none !important}
			.body{
				display:grid;grid-auto-flow:column;grid-auto-columns:1fr;
				place-items:center;padding:0 calc(var(--st-spacing, var(--st-default-spacing)) * 4);
				padding-bottom:calc(var(--st-spacing, var(--st-default-spacing)) * 2)}
			.main{display:flex;flex-direction:row;align-items:center;justify-content:center}
			.cur-box{display:flex;align-items:center;justify-content:center;flex-direction:row-reverse}
			.cur-num-box{display:flex;align-items:center}
			.cur-num{
				font-size:var(--paper-font-subhead_-_font-size);
				line-height:var(--paper-font-subhead_-_line-height);
				font-weight:normal;margin:0}
			.nopad{padding:0px}
			.grid {
			  display: grid;
			  grid-template-columns: repeat(2, auto);
			}
			.grid-content {
			  display: grid;
			}
			.grid-left {
			  text-align: left;
			  font-size: var(--paper-font-body1_-_font-size);
			  padding: 16px 0 16px 16px;
			  cursor: pointer;
			  text-overflow: ellipsis;
			  word-break: keep-all;
			  white-space: nowrap
			}
			.noborder .grid-left{padding-left:8px !important}
			.grid-right .body{margin-left:auto}
			.grid-right {
			  text-align: right;
			  padding-right: 10px;
			}
			.noborder .grid-right{padding-right:0 !important}
			`;
		}

		render() {
			if(!this.stateObj){return html`<ha-card>Missing:'${this.config.entity}'</ha-card>`;}
			const vars={};
			if( this.config.border === undefined || this.config.border){
				vars['border']='';
			}else{vars['border']='noborder';}
			if( this.config.icon === undefined && this.stateObj.attributes.icon ){
				vars['icon']=this.stateObj.attributes.icon;
			}else{
				if(this.config.icon){
					vars['icon']=this.config.icon;
				}else{
					vars['icon']=false;
				}
			}
			if( this.config.name === undefined && this.stateObj.attributes.friendly_name ){
				vars['name']=this.stateObj.attributes.friendly_name;
			}else{
				if(this.config.name){
					vars['name']=this.config.name;
				}else{
					vars['name']=null;
				}
			}
			return this.renderMain(vars);
		}
		renderMain(vars) {
			return html`
			<ha-card class="${vars.border}">
				${vars.icon ? html`<div class="grid">
				<div class="grid-content grid-left" @click="${() => this.moreInfo('hass-more-info')}">
					<div>
					<ha-icon icon="${vars.icon}" style="margin-right:20px;color:var(--paper-item-icon-color);"></ha-icon>
					${vars.name}
					</div>
				</div><div class="grid-content grid-right">${this.renderNum()}</div></div>` : this.renderNum() }
			</ha-card>
		`;
		}
		renderNum(){
			return html`<section class="body">
					<div class="main">
						<div class="cur-box">
						<ha-icon-button class="nopad" icon="mdi:plus"
							@click="${() => this.setNumb(true)}">
						</ha-icon-button>
						<div class="cur-num-box" @click="${() => this.moreInfo('hass-more-info')}" >
							<h3 class="cur-num" > ${this.niceNum()} </h3>
						</div>
						<ha-icon-button class="nopad" icon="mdi:minus"
							@click="${() => this.setNumb(false)}">
						</ha-icon-button>
						</div>
					</div>
					</section>`;
		}
		getCardSize() {
			return 1;
		}

		setConfig(config) {
			if (!config.entity) throw new Error('Please define an entity.');
			if (config.entity.split('.')[0] !== 'input_number') throw new Error('Please define a input_number entity.');
			this.config = {
				name: config.name,
				entity: config.entity,
				icon: config.icon,
				border: config.border,
			};
		}

		set hass(hass) {
			if (hass && this.config) {
				this.stateObj = this.config.entity in hass.states ? hass.states[this.config.entity] : null;
			}
			this._hass = hass;
		}

		callService(service, data = {entity_id: this.stateObj.entity_id}) {
			const [domain, name] = service.split('.');
			this._hass.callService(domain, name, data);
		}
		
		publishNum(val){
			this._hass.callService("input_number", "set_value", { entity_id: this.stateObj.entity_id, value: val });
		}
		
		setNumb(addd){
			const minn=Number(this.stateObj.attributes.min);
			const maxx=Number(this.stateObj.attributes.max);
			const step=Number(this.stateObj.attributes.step);
			const curr=Number(this.stateObj.state);
			if(addd){
				const adval=(curr + step);
				if( adval <=  maxx){
					this.publishNum(adval);
				}
			}else{
				const adval=(curr - step);
				if( adval >= minn){
					this.publishNum(adval);
				}				
			}
		}
		
		niceNum(){
			const stp=Number(this.stateObj.attributes.step);
			if( Math.round(stp) != stp ){
				return Number(this.stateObj.state).toFixed(1);
			}else{
				return Number(this.stateObj.state).toFixed(0);
			}
		}

		moreInfo(type, options = {}) {
			const event = new Event(type, {
				bubbles: options.bubbles || true,
				cancelable: options.cancelable || true,
				composed: options.composed || true,
			});
			event.detail = {entityId: this.stateObj.entity_id};
			this.dispatchEvent(event);
		}

	}

	customElements.define('numberbox-card', NumberBox);
})(window.LitElement || Object.getPrototypeOf(customElements.get("hui-masonry-view") || customElements.get("hui-view")));
