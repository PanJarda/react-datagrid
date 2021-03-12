import { h, Component } from 'preact';

/**
 * @constructor
 * @param {Server} props.server - server
 * @param {string} props.endpoint
 * @param {Object} props.columnFilters - key:value - column: Filter
 * @param {Component} props.collection - component to render row
 * @param {Object} props.collectionProps
 */
function Datagrid(props) {
	Component.call(this, props);
}

Datagrid.prototype = Object.create(Component.prototype);

Datagrid.prototype.constructor = Datagrid;

Datagrid.prototype.render = function() {
	return h('div', null, 'ahoj');
};

export default Datagrid;