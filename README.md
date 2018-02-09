# pwa-helpers
Small helper methods or mixins to help build a PWA,
and reduce the boilerplate you might have to write. There are many different
ways in which you could write these helpers; use these if you want a simple
starting point.

## `router.js`
This is a basic router that calls a callback whenever the location is updated.

Example (in your top level element or document):
```js
import { installRouter } from '../node_modules/@polymer/redux-helpers/router.js';

installRouter(() => someCallback(window.location));
```

## `network.js`
This is a utility method that calls a callback whenever the network connectivity of the app changes.

Example (in your top level element or document):
```js
import { installOfflineWatcher } from '../node_modules/@polymer/redux-helpers/router.js';

installOfflineWatcher((offline) => {
  this._offline.textContent = offline ? ' offline' : 'online';
});
```

## `connect-mixin.js`
This is a JavaScript mixin that you can add to a Custom Element base class
to automatically connect to a Redux store. It requires you to implement a
`stateChanged` method, which is called every time the store state is updated.

Example (in an element):
```js
import { connect } from '../node_modules/@polymer/redux-helpers/connect-mixin.js';

class MyElement extends connect(store)(HTMLElement) {
  // ...

  stateChanged(state) {
    this.count = state.data.count;
  }
}
```

## `lazy-reducer-enhancer.js`
A Redux store enhancer that lets you lazy-install reducers after the store
has booted up. Use this if your application lazy-loads routes that are connected
to a Redux store.

Example (in your store code):
```js
import lazyReducerEnhancer from '../node_modules/@polymer/redux-helpers/lazy-reducer-enhancer.js';
import someReducer from './reducers/someReducer.js';

export const store = createStore(
  (state, action) => state,
  compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
);
// An initial, lazy-loaded reducer. Use this for any other lazy reducers in elements as well.
store.addReducers({
  someReducer
});
```
