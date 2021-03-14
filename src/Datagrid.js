import { h, Component } from 'preact';
import { FilteredCollection, SortedCollection, SubCollection } from './RestCollection';

/**
 * @constructor
 * @param {AsyncCollection} props.collection 
 * @param {number} props.limit
 */
function Datagrid(props) {
	Component.call(this, props);
	this.state = {
		rows: [],
		loading: true,
		error: false,
		offset: 0,
		sortedBy: '',
		asc: true,
		filters: {}
	};

	this.prev = this.prev.bind(this);
	this.next = this.next.bind(this);
	this.sort = this.sort.bind(this);
	this.filter = this.filter.bind(this);
}

Datagrid.prototype = Object.create(Component.prototype);
Datagrid.prototype.constructor = Datagrid;

Datagrid.prototype.componentDidMount = function() {
	this.fetchRows();
};

Datagrid.prototype.fetchRows = function() {
	var state = this.state;
	(new SubCollection(
		new FilteredCollection(
			new SortedCollection(
				this.props.collection,
				this.state.sortedBy,
				this.state.asc ? 'ASC' : 'DESC'
			),
			state.filters
		),
		state.offset,
		state.offset + this.props.limit
	)).as(
		Array,
		this.receiveRows,
		this
	);
};

Datagrid.prototype.componentDidUpdate = function(prevProps, prevState) {
	if ((this.props.collection !== prevProps.collection)
		|| (this.props.limit !== prevProps.limit)
		|| (this.state.offset !== prevState.offset)
		|| (this.state.filters !== prevState.filters)
		|| (this.state.sortedBy !== prevState.sortedBy)
		|| (this.state.asc !== prevState.asc)) {
		this.fetchRows();
		this.setState({
			error: false,
			loading: true
		});
	}
};

Datagrid.prototype.error = function() {
	this.setState({
		error: true,
		loading: false
	});
};

Datagrid.prototype.receiveRows = function(rows) {
	this.setState({
		rows: rows,
		loading: false
	});
};

Datagrid.prototype.prev = function() {
	this.setState({
		offset: this.state.offset - this.props.limit
	});
};

Datagrid.prototype.next = function() {
	this.setState({
		offset: this.state.offset + this.props.limit
	});
};

Datagrid.prototype.sort = function(col) {
	this.setState({
		sortedBy: this.state.sortedBy === col && this.state.asc === false ? '' : col,
		asc: this.state.sortedBy === col ? !this.state.asc : true
	});
};

Datagrid.prototype.filter = function(col, value) {
	if (value !== '') {
		var filter = {};
		filter[col] = value;
		this.setState({
			filters: Object.assign({}, this.state.filters, filter)
		});
	} else {
		delete this.state.filters[col];
		this.setState({
			filters: Object.assign({}, this.state.filters)
		});
	}
};

Datagrid.prototype.render = function() {
	var count = this.state.rows.length;
	return h('div', null,
		h('table', null,
			h('thead', null, count ? this.state.rows[0].renderHead(this.state.sortedBy, this.state.asc, this.sort, this.filter) : ''),
			!this.state.loading
				? h('tbody', null, this.state.rows.map((row, i) => row.renderRow(i + 1 + this.state.offset)))
				: 'loading...'
		),
		this.state.offset > 0
			? h('button', {onClick: this.prev}, 'prev')
			: '',
		h('button', {onClick: this.next}, 'next')
	);
};

export default Datagrid;