((LitElement) => {

console.info('NUMBERBOX_CARD 1.8');
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;
class NumberBox extends LitElement {


constructor() {
	super();
	this.rolling = 0;
}

static get properties() {
	return {
		_hass: {},
		config: {},
		stateObj: {},
		rolling: {},
	}
}

static get styles() {
	return css`
	ha-card{
		-webkit-font-smoothing:var(--paper-font-body1_-_-webkit-font-smoothing);
		font-size:var(--paper-font-body1_-_font-size);
		font-weight:var(--paper-font-body1_-_font-weight);
		line-height:var(--paper-font-body1_-_line-height);
		padding:4px 0}
	ha-card.noborder{padding:0 !important;margin:0 !important;
		box-shadow:none !important;border:none !important}
	.body{
		display:grid;grid-auto-flow:column;grid-auto-columns:1fr;
		place-items:center;padding:0 4px;
		padding-bottom:2px}
	.main{display:flex;flex-direction:row;align-items:center;justify-content:center}
	.cur-box{display:flex;align-items:center;justify-content:center;flex-direction:row-reverse}
	.cur-num-box{display:flex;align-items:center}
	.cur-num{
		font-size:var(--paper-font-subhead_-_font-size);
		line-height:var(--paper-font-subhead_-_line-height);
		font-weight:normal;margin:0}
	.cur-unit{font-size:80%;opacity:0.5}
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
	  overflow: hidden;
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

shouldUpdate(changedProps) {
	if (changedProps.has('stateObj')) {return true;}
}

render() {
	if(!this.stateObj){return html`<ha-card>Missing:'${this.config.entity}'</ha-card>`;}
	const vars={};
	vars['icon_plus']=this.config.icon_plus ? this.config.icon_plus : 'mdi:plus';
	vars['icon_minus']=this.config.icon_minus ? this.config.icon_minus : 'mdi:minus';
	if( !this.config.border){
		vars['border']='noborder';
	}else{vars['border']='';}
	if( this.config.icon === undefined && this.stateObj.attributes.icon ){
		vars['icon']=this.stateObj.attributes.icon;
	}else{
		if(this.config.icon){
			vars['icon']=this.config.icon;
		}else{
			vars['icon']=false;
		}
	}
	if( this.config.unit === undefined && this.stateObj.attributes.unit_of_measurement ){
		vars['unit']=this.stateObj.attributes.unit_of_measurement;
	}else{
		if(this.config.unit){
			vars['unit']=this.config.unit;
		}else{
			vars['unit']=false;
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
	let d=false;
	if(vars.icon || vars.name){d=true;}
	return html`
	<ha-card class="${vars.border}">
		${d ? html`<div class="grid">
		<div class="grid-content grid-left" @click="${() => this.moreInfo('hass-more-info')}">
			<div>
			${vars.icon ? html`<ha-icon icon="${vars.icon}" style="margin-right:20px;color:var(--paper-item-icon-color);"></ha-icon>` : null }
			${vars.name}
			</div>
		</div><div class="grid-content grid-right">${this.renderNum(vars)}</div></div>` : this.renderNum(vars) }
	</ha-card>
`;
}

renderNum(vars){
	return html`<section class="body">
			<div class="main">
				<div class="cur-box">
				<ha-icon-button class="nopad" icon="${vars.icon_plus}"
					@click="${() => this.incVal(this)}"
					@mousedown="${() => this.onMouseDown(1)}"
					@mouseup="${() => this.onMouseUp()}"
					@touchstart="${() => this.onMouseDown(1)}"
					@touchend="${() => this.onMouseUp()}"
				>
				</ha-icon-button>
				<div class="cur-num-box" @click="${() => this.moreInfo('hass-more-info')}" >
					<h3 class="cur-num" > ${this.niceNum(vars)} </h3>
				</div>
				<ha-icon-button class="nopad" icon="${vars.icon_minus}"
					@click="${() => this.decVal(this)}"
					@mousedown="${() => this.onMouseDown(0)}"
					@mouseup="${() => this.onMouseUp()}"
					@touchstart="${() => this.onMouseDown(0)}"
					@touchend="${() => this.onMouseUp()}"
				>
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
	if (config.entity.split('.')[0] !== 'input_number')
		{throw new Error('Please define a input_number entity.');}
	this.config = {
		name: config.name,
		entity: config.entity,
		icon: config.icon,
		border: config.border,
		speed: config.speed,
		unit: config.unit,
		icon_plus: config.icon_plus,
		icon_minus: config.icon_minus,
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

incVal(dhis){
	dhis._hass.callService("input_number", 'increment', { entity_id: dhis.stateObj.entity_id });
}

decVal(dhis){
	dhis._hass.callService("input_number", 'decrement', { entity_id: dhis.stateObj.entity_id });
}

niceNum(vars){
	let fix=0;
	const stp=Number(this.stateObj.attributes.step);
	if( Math.round(stp) != stp ){ fix=stp.toString().split(".")[1].length || 1;}
	fix = Number(this.stateObj.state).toFixed(fix);
	return vars.unit ? html`${fix}<span class="cur-unit" >${vars.unit}</span>` : fix ;
}

moreInfo(type, options = {}) {
	const e = new Event(type, {
		bubbles: options.bubbles || true,
		cancelable: options.cancelable || true,
		composed: options.composed || true,
	});
	e.detail = {entityId: this.stateObj.entity_id};
	this.dispatchEvent(e);
	return e;
}

onMouseDown(v) {
	if( this.config.speed === undefined ){ this.config.speed=0;}
	if( this.config.speed > 0 ){
		this.onMouseUp();
		if(v){
			this.rolling = setInterval(this.incVal, this.config.speed, this);
		}else{
			this.rolling = setInterval(this.decVal, this.config.speed, this);
		}
	}
}

onMouseUp() {
	if( this.config.speed === undefined ){ this.config.speed=0;}
	if( this.config.speed > 0 ){
		clearInterval(this.rolling);
	}
}



} customElements.define('numberbox-card', NumberBox);
})(window.LitElement || Object.getPrototypeOf(customElements.get("hui-masonry-view") || customElements.get("hui-view")));
