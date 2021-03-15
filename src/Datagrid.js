import { h, Component } from 'preact';
import {
  FilteredCollection,
  SortedCollection,
  SubCollection
} from './RestCollection';

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
		pageCount: 0,
    offset: 0,
    sortedBy: '',
    asc: true,
    filters: {}
  };

  this.prev = this.prev.bind(this);
  this.next = this.next.bind(this);
	this.onPage = this.onPage.bind(this);
  this.sort = this.sort.bind(this);
  this.filter = this.filter.bind(this);
}

Datagrid.prototype = Object.create(Component.prototype);
Datagrid.prototype.constructor = Datagrid;

Datagrid.prototype.componentDidMount = function () {
  this.fetchRows(true);
};

Datagrid.prototype.fetchRows = function (withSize) {
  var state = this.state;
  var collection = new SubCollection(
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
  );

	collection.as(Array, this.receiveRows, this);
	if (withSize) {
		collection.size(this.receiveSize, this);
	}
};

Datagrid.prototype.componentDidUpdate = function (prevProps, prevState) {
  if (
    this.props.collection !== prevProps.collection ||
    this.props.limit !== prevProps.limit ||
    this.state.offset !== prevState.offset ||
    this.state.sortedBy !== prevState.sortedBy ||
    this.state.asc !== prevState.asc
  ) {
    this.fetchRows(false);
		this.setState({
			error: false,
			loading: true
		});
  } else if (this.state.filters !== prevState.filters) {
		this.fetchRows(true);
		this.setState({
			error: false,
			loading: true
		});
	}
};

Datagrid.prototype.error = function () {
  this.setState({
    error: true,
    loading: false
  });
};

Datagrid.prototype.receiveRows = function (rows) {
  this.setState({
    rows: rows,
    loading: false
  });
};

Datagrid.prototype.receiveSize = function(size) {
	this.setState({
		pageCount: Math.ceil(size / this.props.limit)
	});
}

Datagrid.prototype.prev = function () {
  this.setState({
    offset: this.state.offset - this.props.limit
  });
};

Datagrid.prototype.next = function () {
  this.setState({
    offset: this.state.offset + this.props.limit
  });
};

Datagrid.prototype.sort = function (col) {
  this.setState({
    sortedBy:
      this.state.sortedBy === col && this.state.asc === false ? '' : col,
    asc: this.state.sortedBy === col ? !this.state.asc : true
  });
};

Datagrid.prototype.filter = function (col, value) {
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

Datagrid.prototype.onPage = function(page) {
	this.setState({
    offset: this.props.limit * (page - 1)
  });
};

Datagrid.prototype.render = function () {
  var count = this.state.rows.length;
  return h(
    'div',
    null,
    h(this.props.container, {
			onPrev: this.prev,
			onNext: this.next,
			onPage: this.onPage,
			pageCount: this.state.pageCount,
			page: (this.state.offset / this.props.limit) + 1,
      head: count
        ? this.state.rows[0].renderHead(
            this.state.sortedBy,
            this.state.asc,
            this.sort,
            this.filter
          )
        : '',
      body: !this.state.loading
        ? this.state.rows.map((row, i) =>
            row.renderRow(i + 1 + this.state.offset)
          )
        : 'loading...'
    })
  );
};

export default Datagrid;
