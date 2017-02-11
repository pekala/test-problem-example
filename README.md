# Problem with Jest + Redux async actions with Promises

In the `src/integration.test.js` I would like to test whether a correct sequence
of actions is dispatched in response to user interacting with the select box.

Action sequence can be retrieved using `store.getActions` method provided by
`redux-mock-store` library, but it needs to be done after the redux async action
thunk chain has been exhausted.

The async action dispatches one sync action right away, and then
returns a Promise (which is immidiately resolved because of mocked `fetch` function).
We need to assert on the actions sequence after the Promise chain is ran to completion.
My first attempt is using Jest's `jest.runAllTicks()` method:

```javascript
test('changing the reddit downloads posts', () => {
    jest.useFakeTimers();
    selectBox.simulate('change', { target: { value : 'frontend' } })
    jest.runAllTicks();
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
});
```

But this doesn't work, i.e. only the synchronously dispatched action has beed
dispatched before assertion.

Another, more hacky attempt is to use `setTimeout(..., 0)` to get run assertion
strictly after Promise micro-queue.

```javascript
test('changing the reddit downloads posts', done => {
    selectBox.simulate('change', { target: { value : 'frontend' } })
    setTimeout(() => {
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
        done()
    }, 0)
});
```

While this does work, and all actions have been dispatched to the store before
assertion, there is a strange Jest behaviour if the assertion is incorrect - it just
hangs and after a while fails (e.g. a typo in action type) with `Timeout - Async callback was not invoked within timeout
specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.`.

Another way I tried is returning a Promise from the test, but since we don't have
handle to the actual Promise chain of the async action, we can't reliably place
ourselves after the end of that chain, i.e. this doesn't work:
```javascript
return Promise.resolve().then(() => {
    // assertion
});
```

but this works (also, fails correctly with typo):

```javascript
return Promise.resolve().then(() => {}).then(() => {
    // assertion
});
```
which means this method is dependent on the length of the promise chain we're testing.
