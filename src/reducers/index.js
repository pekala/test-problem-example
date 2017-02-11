import { combineReducers } from 'redux'
import {
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions'

const selectedReddit = (state = 'reactjs', action) => {
  switch (action.type) {
    case REQUEST_POSTS:
      return action.reddit
    default:
      return state
  }
}

const posts = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        items: action.posts
      }
    default:
      return state
  }
}

const postsByReddit = (state = { }, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return {
        ...state,
        [action.reddit]: posts(state[action.reddit], action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit
})

export default rootReducer
