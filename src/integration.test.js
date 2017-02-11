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

test('changing the reddit downloads posts', () => {
    selectBox.simulate('change', { target: { value : 'frontend' } })
    // assert on actions sequence
});
