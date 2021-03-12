import { h } from 'preact';
import { PureComponent } from 'preact/compat';

/**
 * @constructor
 * @param {Object} props.observer - Object to notify on totalcount change
 * @param {string} props.onTotalCount - message to call on observer when totalCount change
 * @param {Server} props.server - server to send
 * @param {string} props.endpoint - endpoint on server
 * @param {UrlSearchParams} props.query
 * @param {CardComponent} props.CardComponent
 */
function RestCollection(props) {
	PureComponent.call(this, props);
	this.state = {
		cards: []
	};
}
RestCollection.prototype = Object.create(PureComponent.prototype);
RestCollection.prototype.constructor = RestCollection;

RestCollection.prototype.collectCards = function (cards) {
	this.setState({
		loading: false,
		cards: cards ? cards : []
	});
	this.pendingRequest = null;
	this.props.observer[this.props.onDataLoaded](
		this.state.requestedPage,
		this.state.totalCount
	);
};

RestCollection.prototype.collectCardsAndCount = function (cards, headers) {
	var props, state;

	props = this.props;
	state = this.state;

	var totalCount = parseInt(headers.getResponseHeader('x-total-count'));
	this.setState({
		loading: false,
		cards: cards ? cards : [],
		totalCount: totalCount !== undefined ? totalCount : state.totalCount
	});
	this.pendingRequest = null;
	props.observer[props.onDataLoaded](state.requestedPage, totalCount);
};

RestCollection.prototype.error = function (error) {
	this.setState({
		loading: false,
		error: error
	});
};

RestCollection.prototype.componentDidMount = function () {
	this.selectCards(true);
};

RestCollection.prototype.componentWillUnmount = function () {
	var props = this.props;

	if (this.pendingRequest) {
		props.server.cancel(this.pendingRequest);
	}
};

RestCollection.prototype.selectCards = function (withTotalCount) {
	var props, state, server, query, requestedPage;

	state = this.state;
	props = this.props;
	server = props.server;
	query = props.query;
	requestedPage = withTotalCount ? 1 : props.page;

	if (state.loading) {
		server.cancel(this.pendingRequest);
	}

	if (withTotalCount) {
		query.delete('offset');
		query.set('page', requestedPage);
	} else {
		query.delete('page');
		query.set('offset', (requestedPage - 1) * props.itemsPerPage);
	}
	query.set('l', props.itemsPerPage);

	this.pendingRequest = server.send({
		messageBody: query.toString(),
		endpoint: props.endpoint,
		sender: this,
		onSuccess: withTotalCount ? 'collectCardsAndCount' : 'collectCards',
		onFailure: 'error'
	});

	this.setState({
		loading: true,
		requestedPage: requestedPage
	});

	props.observer[props.msgLoading]();
};

RestCollection.prototype.page = function () {
	return this.page;
};

RestCollection.prototype.componentDidUpdate = function (prevProps) {
	var props;

	props = this.props;

	if (
		props.updateQuery !== prevProps.updateQuery ||
		props.itemsPerPage !== prevProps.itemsPerPage
	) {
		this.selectCards(true);
	} else if (
		props.page !== prevProps.page &&
		props.page !== this.state.requestedPage
	) {
		this.selectCards();
	}
};

RestCollection.prototype.totalCount = function () {
	return this.state.totalCount;
};

RestCollection.prototype.renderCard = function (card) {
	var props;

	props = this.props;

	return h(
		'li',
		{
			key: 'id' in card ? card.id : undefined,
			className: 'u-hpMd4',
			style: { width: (100 / props.columns).toString() + '%' }
		},
		[
			h(
				props.CardComponent,
				Object.assign(card, {
					cdnUrl: props.cdnUrl,
					linkUrl: props.linkUrl
				})
			)
		]
	);
};

RestCollection.prototype.render = function () {
	return h(
		'ul',
		{
			className: 'ventip_card_container clearfix',
			style: { display: 'block', overflow: 'auto' }
		},
		this.state.cards.map(this.renderCard, this)
	);
};

export default RestCollection;