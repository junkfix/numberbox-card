((LitElement) => {

console.info('NUMBERBOX_CARD 2.2');
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;
class NumberBox extends LitElement {

constructor() {
	super();
	this.bounce = false;
	this.pending = false;
}

static get properties() {
	return {
		_hass: {},
		config: {},
		stateObj: {},
		bounce: {},
		pending: {},
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
		place-items:center;padding:0 4px}
	.main{display:flex;flex-direction:row;align-items:center;justify-content:center}
	.cur-box{display:flex;align-items:center;justify-content:center;flex-direction:row-reverse}
	.cur-num-box{display:flex;align-items:center}
	.cur-num{
		font-size:var(--paper-font-subhead_-_font-size);
		line-height:var(--paper-font-subhead_-_line-height);
		font-weight:normal;margin:0}
	.cur-unit{font-size:80%;opacity:0.5}
	.upd{color:#f00}
	.padr,.padl{padding:8px;cursor:pointer}
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
	  padding: 8px 0 8px 16px;
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
	if( changedProps.has('stateObj') || changedProps.has('pending') ){return true;}
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
	return html`
	<section class="body">
	<div class="main">
		<div class="cur-box">
		<ha-icon class="padl" icon="${vars.icon_plus}" @click="${() => this.setNumb(1)}" >
		</ha-icon>
		<div class="cur-num-box" @click="${() => this.moreInfo('hass-more-info')}" >
			<h3 class="cur-num ${(this.pending===false)? null:'upd'}" > ${this.niceNum(vars)} </h3>
		</div>
		<ha-icon class="padr" icon="${vars.icon_minus}" @click="${() => this.setNumb(0)}" >
		</ha-icon>
		</div>
	</div>
	</section>`;
}

getCardSize() {
	return 1;
}

setConfig(config) {
	if (!config.entity) throw new Error('Please define an entity.');
	let c=config.entity.split('.')[0];
	if (!(c == 'input_number' || c == 'number' )){
		throw new Error('Please define a number entity.');
	}
	this.config = {
		name: config.name,
		entity: config.entity,
		icon: config.icon,
		border: config.border,
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

setNumb(c){
	let v=this.pending;
	const step=Number(this.stateObj.attributes.step);
	if( v===false ){ v=Number(this.stateObj.state); }
	const adval=c?(v + step):(v - step);
	if( adval <=  Number(this.stateObj.attributes.max) && adval >= Number(this.stateObj.attributes.min)){
		this.pending=(adval);
		clearTimeout(this.bounce);
		this.bounce = setTimeout(this.publishNum, 1000, this);
	}
}

publishNum(dhis){
	const v=dhis.pending;
	dhis.pending=false;
	dhis._hass.callService(dhis.stateObj.entity_id.split('.')[0], "set_value", { entity_id: dhis.stateObj.entity_id, value: v });
}

zeroFill(number, width){
	width -= number.toString().length;
	if ( width > 0 ){
		return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
	}
	return number + "";
}

niceNum(vars){
	let fix=0; let v=this.pending;
	if( v === false ){ v=Number(this.stateObj.state); }
	const stp=Number(this.stateObj.attributes.step);
	if( Math.round(stp) != stp ){ fix=stp.toString().split(".")[1].length || 1;}
	fix = v.toFixed(fix);
	if( vars.unit=="time" ){
		return html`${this.zeroFill(Math.floor(fix/3600), 2)}:${this.zeroFill(Math.floor(fix/60), 2)}:${this.zeroFill(fix%60, 2)}`
	}
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

static getConfigElement() {
    return document.createElement("numberbox-card-editor");
}

static getStubConfig() {
	return {border: true};
}

} customElements.define('numberbox-card', NumberBox);

//Editor
const includeDomains = ['input_number','number'];
const fireEvent = (node, type, detail = {}, options = {}) => {
	const event = new Event(type, {
		bubbles: options.bubbles === undefined ? true : options.bubbles,
		cancelable: Boolean(options.cancelable),
		composed: options.composed === undefined ? true : options.composed,
	});
	event.detail = detail;
	node.dispatchEvent(event);
	return event;
}

class NumberBoxEditor extends LitElement {

static get properties() {
	return { hass: {}, config: {} };
}

static get styles() {
	return css`
.side {
	display:flex;
	align-items:center;
}
.side > * {
	flex:1;
	padding-right:4px;
}	
`;
}
get _border() {
	if (this.config.border) {
		return true;
	} else {
		return false;
	}
}
setConfig(config) {
	this.config = config;
}

render() {
	if (!this.hass){ return html``; }
	return html`
<div class="side">
	<ha-entity-picker
		label="Entity (required)"
		.hass=${this.hass}
		.value="${this.config.entity}"
		.configValue=${'entity'}
		.includeDomains=${includeDomains}
		@change="${this.updVal}"
		allow-custom-entity
	></ha-entity-picker>
</div>
<ha-formfield label="Show border?">
	<ha-switch
		.checked=${this._border}
		.configValue="${'border'}"
		@change=${this.updVal}
	></ha-switch>
</ha-formfield>
<div class="side">
	<paper-input
		label="Name (Optional, false to hide)"
		.value="${this.config.name}"
		.configValue="${'name'}"
		@value-changed="${this.updVal}"
	></paper-input>
	<paper-input
		label="Icon (Optional, false to hide)"
		.value="${this.config.icon}"
		.configValue="${'icon'}"
		@value-changed="${this.updVal}"
	></paper-input>
</div>
<div class="side">
	<ha-icon-input
		label="Icon Plus [mdi:plus]"
		.value="${this.config.icon_plus}"
		.configValue=${'icon_plus'}
		@value-changed=${this.updVal}
	></ha-icon-input>
	<ha-icon-input
		label="Icon Minus [mdi:minus]"
		.value="${this.config.icon_minus}"
		.configValue=${'icon_minus'}
		@value-changed=${this.updVal}
	></ha-icon-input>
</div>			
<div class="side">
	<ha-icon-input
		label="Unit (false to hide)"
		.value="${this.config.unit}"
		.configValue=${'unit'}
		@value-changed=${this.updVal}
	></ha-icon-input>
</div>
`;
}


updVal(v) {
	if (!this.config || !this.hass) {return;}
	const { target } = v;
	if (this[`_${target.configValue}`] === target.value) {
		return;
	}
	if (target.configValue) {
		if (target.value === '') {
			delete this.config[target.configValue];
		} else {
		if (target.value === 'false') {target.value = false;}
			this.config = {
				...this.config,
				[target.configValue]: target.checked !== undefined ? target.checked : target.value,
			}
		}
	}
	fireEvent(this, 'config-changed', { config: this.config });
}

}
customElements.define("numberbox-card-editor", NumberBoxEditor);

})(window.LitElement || Object.getPrototypeOf(customElements.get("hui-masonry-view") ));

window.customCards = window.customCards || [];
window.customCards.push({
	type: 'numberbox-card',
	name: 'Numberbox Card',
	preview: false,
	description: 'Replace number/input_number sliders with plus and minus buttons'
});

