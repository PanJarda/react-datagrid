import { h, Component } from 'preact';
import Datagrid from './Datagrid';
import { RestCollection } from './RestCollection';

class Event {
	constructor(props) {
		Object.assign(this, props);
	}

	renderHead(sortedBy, asc, sort, filter) {
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

	renderRow(i) {
		return h('tr', null,
			h('td', null, i),
			h('td', null, this.name),
			h('td', null, this.slug)
		);
	}
}

class Wrap extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return h('table', null,
			h('thead', null, this.props.head),
			h('tbody', null, this.props.body)
		);
	}
}

class App extends Component {
	constructor() {
		super()
	}

	render() {
		return (
			h(Datagrid, {
				collection: new RestCollection('https://ventip.infotrh.cz/api/events', Event),
				wrap: Wrap,
				button: 'button',
				limit: 10
			})
		);
	}
}

export default App;