import { h, Component } from 'preact';
import Datagrid from './Datagrid';
import { RestCollection } from './RestCollection';

class Event {
  constructor(props) {
    Object.assign(this, props);
  }

  renderHead(sortedBy, asc, sort, filter) {
    return (
      <tr>
        <th>#</th>
        <th>
          <span onClick={() => sort('name')}>{ 'Jméno' + (sortedBy === 'name' ? asc ? ' ^' : ' v' : '' ) }</span>
          <input onChange={ e => filter('name', e.target.value) } />
        </th>
        <th>
          <span onClick={() => sort('slug')}>{ 'Slug' + (sortedBy === 'slug' ? asc ? ' ^' : ' v' : '' ) }</span>
          <input onChange={  e => filter('slug', e.target.value) } />
        </th>
      </tr>
    );
  }

  renderRow(i) {
    return (
      <tr>
        <td>{ i }</td>
        <td>{ this.name }</td>
        <td>{ this.slug }</td>
      </tr>
    );
  }
}

class Table extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table>
        <thead>{ this.props.head }</thead>
        <tbody>{ this.props.body }</tbody>
      </table>
    );
  }
}

class App extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <Datagrid
        collection={new RestCollection('https://ventip.infotrh.cz/api/events', Event)}
        container={Table}
        button={'button'}
        limit={10}
      />
    );
  }
}

export default App;