import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchPosts } from '../actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'

class App extends Component {
  static propTypes = {
    selectedReddit: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  handleChange = nextReddit => {
    this.props.dispatch(fetchPosts(nextReddit))
  }

  render() {
    const { selectedReddit, posts, isFetching } = this.props
    const isEmpty = posts.length === 0
    return (
      <div>
        <Picker
          value={selectedReddit}
          onChange={this.handleChange}
          options={[ 'reactjs', 'frontend' ]}
        />
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Posts posts={posts} />
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { selectedReddit, postsByReddit } = state
  const {
    isFetching,
    items: posts
  } = postsByReddit[selectedReddit] || {
    isFetching: true,
    items: []
  }

  return {
    selectedReddit,
    posts,
    isFetching
  }
}

export default connect(mapStateToProps)(App)
