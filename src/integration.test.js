/* eslint-env jest */
import React from 'react'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { mount } from 'enzyme'
import configureStore from 'redux-mock-store'
import App from './containers/App'
global.fetch = jest.fn(() => Promise.resolve({
    json: () => ({
        data: {
            children: [],
        }
    }),
}))

const mockStore = configureStore([thunk])
const state = { postsByReddit: {}, selectedReddit: 'reactjs' }
const store = mockStore(state)
const wrapper = mount(
    <Provider store={store}>
        <App />
    </Provider>
);
const selectBox = wrapper.find('select')

const flushPromises = () => new Promise(resolve => setImmediate(resolve));
test('changing the reddit downloads posts', () => {
    selectBox.simulate('change', { target: { value : 'frontend' } })
    return flushPromises().then(() => {
        expect(store.getActions()).toEqual([
            {
                type: 'REQUEST_POSTS',
                reddit: 'frontend'
            },
            {
                type: 'RECEIVE_POSTS',
                reddit: 'frontend',
                posts: [],
            }
        ])
    })
});
