import React from 'react';
import PropTypes from 'proptypes';
import CircularProgress from 'material-ui/CircularProgress';
import injectSheet from 'react-jss';
import ReactResizeDetector from 'react-resize-detector';

const styles = {
  container: {
    overflowY: 'auto',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
};

class InfiniteScroll extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    loader: PropTypes.node.isRequired,
    loadMore: PropTypes.func.isRequired,
    children: PropTypes.node,
    hasMore: PropTypes.bool.isRequired,
    classes: PropTypes.objectOf(PropTypes.string),
    edgeOffset: PropTypes.number.isRequired
  };

  static defaultProps = {
    edgeOffset: 100,
    loader: <CircularProgress style={{ margin: '0 auto', display: 'block' }} />
  };

  state = {
    isLoading: false,
    page: 0,
    containerHeight: 0,
    contentHeight: 0,
    scrollPosition: 0
  };

  componentDidMount = () => {
    const { container } = this.refs;

    container.addEventListener('scroll', event => {
      const { scrollTop: scrollPosition } = event.target;
      this.setState({ scrollPosition });
    });
  };

  onResizeContainer = (containerWidth, containerHeight) => {
    this.setState({ containerHeight });
  };

  onResizeContent = (contentWidth, contentHeight) => {
    this.setState({ contentHeight });
  };

  componentDidUpdate = () => {
    this.checkLoadMore();
  };

  checkLoadMore = () => {
    const { containerHeight, contentHeight, scrollPosition, isLoading, page } = this.state;
    const { edgeOffset, loadMore, hasMore } = this.props;

    if (hasMore && !isLoading && scrollPosition + containerHeight + edgeOffset > contentHeight) {
      this.setState({ isLoading: true });
      loadMore(page)
        .then(() => {
          this.setState({ page: page + 1 });
        })
        .finally(() => {
          this.setState({ isLoading: false });
          this.checkLoadMore();
        });
    }
  };

  render() {
    const { loader, classes, children, className } = this.props;
    const { isLoading } = this.state;

    return <span ref="container" className={classes.container}>
      <ReactResizeDetector handleHeight onResize={this.onResizeContainer} />
      <div className={className}>
        <ReactResizeDetector handleHeight onResize={this.onResizeContent} />
        {children}
        {isLoading && loader}
      </div>
    </span>;
  }
}

export default injectSheet(styles)(InfiniteScroll);
