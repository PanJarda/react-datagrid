import RestCollection from "./RestCollection";

class RestApples {
	constructor(url, AppleConstructor) {
		this.url = url;
		this.AppleConstructor = AppleConstructor;
	}

	filter(prop) {
		this.filterBy = prop;
	}

	sort(prop) {
		this.sortBy = prop;
	}

	_fetch() {
		//...
	}

	async next() {
		this._fetch(this.url + '?sortBy=' + this.sortBy + 'offset=0')
	}

	[Symbol.asyncIterator]() { return this; }

	getByRange(range) {
		this._fetch(/*...*/)
	}

	forEach(fn, self) {}

	map(fn, self) {}

	filter(fn, self) {}

	every(fn, self) {}

	some(fn, self) {}
}

class Apple {
	constructor(obj) {}

	async barva() {
		//fetch(apiUrl, 'color'))
	}
}

var restApple = new RestApple(url, color);
kosik.pridej(restApple);

kosik.prvni(this, 'whenPrvniDone');

var barva = await jablko.barva();

zjistiBarvu = function() {
	jablko.barva(this, 'callMeBack');
}

var kosik = new RestCollection('/api/jabka', Apple);

var prvnich10 = kosik.vyber((1).to(10));

var poleJablek = await prvnich10.toArray();


kosikJablek.map(this, jablko => h(ReactiJablko, {jablko: jablko}), 'vykresliJablka');



class RestovaKolekce {
	constructor(konstruktor) {
		this.constructor = konstruktor;
	}

	next() {}
}


class ReactiKosikJablek extends Component {
	constructor(props) {
		super(props);
		this.state = {
			laoding: true,
			poleJablek: []
		};
	}

	uzMamJablka(poleJablek) {
		this.setState({
			laoding: false,
			poleJablek: poleJablek.map(jablko => h(this.props.JablkoComponenta, jablko))
		});
	}

	componentDidUpdate() {
		this.props.kosikJablek.toArray(this, 'uzMamJablka');
	}

	render() {
		h('div', null, this.state.poleJablek);
	}
}


var apples = new RestApples('/api/apples')
apples
	.filter('red')
	.sort('size')
	.select();


var apples = new RestApples('/api/apples');

var filtered = new FilteredApples(apples, 'red');

var sorted = new SortedApples(apples, 'size');


sorted = new SortedApples(
	new FilteredApples(
		new RestApples('/api/apples'),
		'red'
	),
	'size'
);


class FilteredApples {
	constructor(collection, filterBy) {
		this.collection = collection.filter(filterBy);
	}

	next() {
		return this.collection.next();
	}
}


class AsyncCollection {
	constructor() {
		this.items = [];
	}

	add(sender, value, msg) {
		sender[msg](this.items.push(value));
	}

	delete(sender, value, msgSuccess, msgError) {}

	size(sender, msg) {
		sender[msg](this.items.length);
	}
}



new SortedApples(
	new FilteredApples(
		new CachedApples(
			new RestApples('/api/fsafds')
		),
		'color'
	),
	'size'
);


class AbstractApple {
	color() {
		return this.color;
	}
}

class RestApple extends AbstractApple {
	constructor(api, ) {}

	color() {

	}
}

jablko.size(); // --> 5cm;
jablko.color(); // --> 'red'

JablkoRadek(jablko)

class JablkoRadek extends Component {
	constructor() {
		this.state = {
			color: '',
			size: 0
		}
	}

	grabSize(sender, size) {
		this.setState({ size })
	}

	grabColor(sender, color) {
		this.setState({ color })
	}

	componentDidMount() {
		const jablko = this.props.jablko;

		jablko.color(this, 'grabColor');
		jablko.size(this, 'grabSize');
	}

	render() {
		const state;

		state = this.state;

		return h('tr', null, [
			h(td, null, state.color),
			h(td, null, state.size)
		]);
	}
}



class AbstractRestCollection {
	constructor(dataSource, constructor) {

	}

	add(sender, obj, msg) {
		
	}

	/**
	 * @method
	 * @param {*} sender 
	 * @param {*} msg
	 * @param {*} options.sortBy
	 * @param {*} options.filterBy
	 * @param {*} options.page
	 * @param {*} options.offset
	 * @param {*} options.fields
	 */
	toArray(sender, msg, options) {
		sender[msg]([new Constructor(this.dataSource, id)]);
	}

	size(sender, msg) {
		//sender[msg]()
	}
}

Datagrid(kosikJablek, RadekProJablko)