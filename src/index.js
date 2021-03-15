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
          <span onClick={() => sort('name')}>
            {'Jméno' + (sortedBy === 'name' ? (asc ? ' ^' : ' v') : '')}
          </span>
          <input onChange={(e) => filter('name', e.target.value)} />
        </th>
        <th>
          <span onClick={() => sort('slug')}>
            {'Slug' + (sortedBy === 'slug' ? (asc ? ' ^' : ' v') : '')}
          </span>
          <input onChange={(e) => filter('slug', e.target.value)} />
        </th>
        <th>
          <span onClick={() => sort('description')}>
            {'Popis' + (sortedBy === 'description' ? (asc ? ' ^' : ' v') : '')}
          </span>
        </th>
        <th>
          <span onClick={() => sort('city')}>
            {'Adresa' + (sortedBy === 'city' ? (asc ? ' ^' : ' v') : '')}
          </span>
        </th>
      </tr>
    );
  }

  renderRow(i) {
    return (
      <tr>
        <td>{i}</td>
        <td>{this.name}</td>
        <td>{this.slug}</td>
        <td>{this.description}</td>
        <td>
          {this.address.street}, {this.address.city && this.address.city.name}
        </td>
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
      <div>
        <table>
          <thead>{this.props.head}</thead>
          <tbody>
            {this.props.loading
              ? new Array(this.props.limit).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td>{'\u00A0'}</td>
                  </tr>
                ))
              : this.props.body}
          </tbody>
        </table>
        <div>
          {this.props.page > 1 ? (
            <button onClick={this.props.onPrev}>Prev</button>
          ) : (
            ''
          )}
          {new Array(this.props.pageCount)
            .fill(1)
            .map((_, i) =>
              this.props.page === i + 1 ? (
                <span style={{ textDecoration: 'underline' }}>{i + 1}</span>
              ) : (
                <button onClick={() => this.props.onPage(i + 1)}>
                  {i + 1}
                </button>
              )
            )}
          {this.props.page < this.props.pageCount ? (
            <button onClick={this.props.onNext}>Next</button>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.collection = new RestCollection(
      'https://ventip.infotrh.cz/api/events',
      Event
    );
  }

  render() {
    return (
      <Datagrid collection={this.collection} container={Table} limit={10} />
    );
  }
}

export default App;
