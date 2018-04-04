import React from 'react';
import PouchDB from 'pouchdb-browser';
import injectSheet from 'react-jss';
import PropTypes from 'proptypes';
import TextField from 'material-ui/TextField';
import InfiniteScroll from './InfiniteScroll.js';

const NUM_ITEMS = 10;
const DB = new PouchDB(process.env.DB_URL);
const ALL_DOCS = DB.query('sketches/name').then(({ rows }) => rows.map(({ id, key: name }) => ({ id, name })));

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  search: {
    flexShrink: 0
  },
  thumbContainer: {
    position: 'relative',
    flexGrow: 1
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gridColumnGap: '10px',
    gridRowGap: '10px'
  },
  thumb: {
    padding: '10px',
    border: '1px solid #e0e0e0',
    '& img': {
      width: '100%'
    }
  }
};

class App extends React.Component {
  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.string)
  };

  state = {
    query: '',
    ids: [],
    thumbs: [],
    page: 0
  };

  componentDidMount = () => {
    this.search('');
  };

  onChange = (event) => {
    const { value } = event.target;

    this.setState({ value });
    this.search(value);
  };

  search = async (query) => {
    query = query.toUpperCase();

    const ids = (await ALL_DOCS)
      .filter(({ name }) => name.toUpperCase().includes(query))
      .map(({ id }) => ({ id }));

    this.setState({ ids, thumbs: [], page: 0 });
  };

  loadMore = async () => {
    const { page, ids } = this.state;
    const docs = ids.slice((page - 1) * NUM_ITEMS, (page - 1) * NUM_ITEMS + NUM_ITEMS);

    const thumbs = (await DB.bulkGet({ docs, attachments: true, binary: true })).results
      .map(result => result.docs[0].ok)
      .map(doc => {
        for (const id in doc._attachments) {
          doc._attachments[id].data = URL.createObjectURL(doc._attachments[id].data);
        }
        return doc;
      });

    if (ids === this.state.ids) {
      this.setState({ thumbs: [...this.state.thumbs, ...thumbs], page: page + 1 });
    }
  };

  render() {
    const { classes } = this.props;
    const { ids, thumbs } = this.state;

    return (
      <div className={classes.container}>
        <span className={classes.search}>
          <TextField
            value={this.state.value}
            ref="input"
            onChange={this.onChange}
            fullWidth
            hintText="Search"
          />
        </span>
        <span className={classes.thumbContainer}>
          <InfiniteScroll hasMore={thumbs.length < ids.length} loadMore={this.loadMore}>
            <div className={classes.grid}>
              {thumbs.map(thumb => <div className={classes.thumb}>
                <img src={thumb._attachments.img.data} />
                <p>{thumb.name}</p>
              </div>)}
            </div>
          </InfiniteScroll>
        </span>
      </div>
    );
  }
}

export default injectSheet(styles)(App);
