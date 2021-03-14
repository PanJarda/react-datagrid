class JablkoRadek extends Component {
	constructor() {
		this.state = {
			color: '',
			size: 0
		}
	}

	componentDidMount() {
		const jablko = this.props.jablko;

		this.setState({
			color: await jablko.color(),
			size: await jablko.size()
		});
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