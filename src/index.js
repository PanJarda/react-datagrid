import { h, Component } from 'preact';
import Datagrid from './Datagrid';
import { RestCollection } from './RestCollection';

function Apple(props) {
	Component.call(this, props);
}

Apple.prototype = Object.create(Component.prototype);
Apple.prototype.constructor = Apple;

Apple.prototype.renderHead = function() {
	return h('tr', null,
		h('th', null, 'Jméno'),
		h('th', null, 'Slug')
	);
}

Apple.prototype.renderRow = function() {
	var props = this.props;

	return h('tr', null,
		h('td', null, props.name),
		h('td', null, props.slug)
	);
};

function AppleRow(props) {
	return h(Apple, props);
};

var apples = new RestCollection('https://ventip.infotrh.cz/api/events', Apple);

function App(props) {
	Component.call(this, props);
}
App.prototype = Object.create(Component.prototype);
App.prototype.constructor = App;

App.prototype.render = function() {
	return (
		h(Datagrid, {
			collection: apples,
			limit: 10
		})
	);
};

export default App;