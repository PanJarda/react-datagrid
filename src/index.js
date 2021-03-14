import { h, Component } from 'preact';
import Datagrid from './Datagrid';
import { RestCollection } from './RestCollection';

function Event(props) {
	this.props = props;
}

Event.prototype.renderHead = function(sortedBy, asc, sort, filter) {
	return h('tr', null,
		h('th', null, '#'),
		h('th', null,
			h('span', {onClick: () => sort('name')}, 'Jméno' + (sortedBy === 'name' ? asc ? ' ^' : ' v' : '' )),
			h('input', {onChange: e => filter('name', e.target.value)})
		),
		h('th',null,
			h('span', {onClick: () => sort('slug')}, 'Slug' + (sortedBy === 'slug' ? asc ? ' ^' : ' v' : '' )),
			h('input', {onChange: e => filter('slug', e.target.value)})
		)
	);
}

Event.prototype.renderRow = function(i) {
	var props = this.props;

	return h('tr', null,
		h('td', null, i),
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