import { h, Component } from 'preact';
import { SubCollection } from './RestCollection';

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
		offset: 0
	};

	this.prev = this.prev.bind(this);
	this.next = this.next.bind(this);
}

Datagrid.prototype = Object.create(Component.prototype);
Datagrid.prototype.constructor = Datagrid;

Datagrid.prototype.componentDidMount = function() {
	this.fetchRows();
};

Datagrid.prototype.fetchRows = function() {
	var state = this.state;
	(new SubCollection(
		this.props.collection,
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
		|| (this.state.offset !== prevState.offset)) {
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

Datagrid.prototype.render = function() {
	if (this.state.loading) {
		return h('div', null, 'loading...');
	} else {
		var count = this.state.rows.length;
		return h('div', null,
			h('table', null,
				h('thead', null, count ? this.state.rows[0].renderHead() : ''),
				h('tbody', null, this.state.rows.map(row => row.renderRow()))
			),
			this.state.offset > 0
				? h('button', {onClick: this.prev}, 'prev')
				: '',
			h('button', {onClick: this.next}, 'next')
		);
	}
};

export default Datagrid;