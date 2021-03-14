import { h, Component } from 'preact';
import Datagrid from './Datagrid';
import { RestCollection } from './RestCollection';

function Event(props) {
	this.props = props;
}

Event.prototype.renderHead = function() {
	return h('tr', null,
		h('th', null, 'Jméno'),
		h('th', null, 'Slug')
	);
}

Event.prototype.renderRow = function() {
	var props = this.props;

	return h('tr', null,
		h('td', null, props.name),
		h('td', null, props.slug)
	);
};

var events = new RestCollection('https://ventip.infotrh.cz/api/events', Event);

function App(props) {
	Component.call(this, props);
}
App.prototype = Object.create(Component.prototype);
App.prototype.constructor = App;

App.prototype.render = function() {
	return (
		h(Datagrid, {
			collection: events,
			limit: 10
		})
	);
};

export default App;