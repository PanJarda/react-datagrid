import { h, Component } from 'preact';

function Datagrid(props) {
	Component.call(this, props);
}

Datagrid.prototype = Object.create(Component.prototype);

Datagrid.prototype.constructor = Datagrid;

Datagrid.prototype.render = function() {
	return h('div', null, 'ahoj');
};

export default Datagrid;