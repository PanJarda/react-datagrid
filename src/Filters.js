import { h, Component } from 'preact';

/**
 * @constructor
 * @param {*} props 
 */
export function TextFilter(props) {
	Component.call(this, props);
}
TextFilter.prototype = Object.create(Component.prototype);
TextFilter.prototype.constructor = TextFilter;

TextFilter.prototype.render = function() {
	return h('input', { type: 'text' });
};

/**
 * @constructor
 * @param {*} props 
 */
export function AddressFilter(props) {
	Component.call(this, props);
}
AddressFilter.prototype = Object.create(Component.prototype);
AddressFilter.prototype.constructor = AddressFilter;

AddressFilter.prototype.render = function() {
	return h('input', { type: 'text' });
};