import { h, Component } from 'preact';
import Datagrid from './Datagrid';
import { TextFilter, AddressFilter } from './Filters';
import RestCollection from './RestCollection';
import Server from './Server';

var server = new Server('/api', {
	restaurants: {
		url: '/restaurants',
		method: 'GET',
		responseType: 'json'
	}
});

function RestaurantsRow(props) {
	Component.call(this, props);
}
RestaurantsRow.prototype = Object.create(Component.prototype);
RestaurantsRow.prototype.constructor = RestaurantsRow;

RestaurantsRow.prototype.render = function() {
	return (
		h('tr', null, [
			h('td', null, props.name),
			h('td', null, props.slug),
			h('td', null, props.address.street)
		])
	);
};

function RestaurantsRestCollection(props) {
	Component.call(this, props);
}
RestaurantsRestCollection.prototype = Object.create(Component.prototype);
RestaurantsRestCollection.prototype.constructor = RestaurantsRestCollection;

RestaurantsRestCollection.prototype.render = function() {
	return h(RestCollection, {
		server: server,
		endpoint: 'restaurants',
		itemComponent: RestaurantsRow,
		query: this.props.query
	});
}


function App(props) {
	Component.call(this, props);
}
App.prototype = Object.create(Component.prototype);
App.prototype.constructor = App;

App.prototype.render = function() {
	return (
		h(Datagrid, {
			collection: RestaurantsRestCollection,
			columns: {
				name: {
					label: 'Jmeno',
					filter: TextFilter
				},
				slug: {
					label: 'slug',
					filter: TextFilter
				},
				address: {
					label: 'Adresa',
					filter: AddressFilter
				}
			},
			orderBy: 'name'
		})
	);
};

export default App;