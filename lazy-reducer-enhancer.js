/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/*
  If you are lazy loading any connected elements, then these elements must be
  able to lazily install their reducers. This is a store enhancer that
  enables that.

  Sample use (where you define your redux store, in store.js):

  import lazyReducerEnhancer from '../node_modules/@polymer/pwa-helpers/lazy-reducer-enhancer.js';
  import someReducer from './reducers/someReducer.js';

  export const store = createStore(
    (state, action) => state,
    compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
  );

  Then, in your page/element, you can lazy load a specific reducer with:
  store.addReducers({
    someReducer
  });
*/
export const lazyReducerEnhancer = function(combineReducers) {
  return (nextCreator) => {
    return (origReducer, preloadedState) => {
      let lazyReducers = {};
      const nextStore = nextCreator(origReducer, preloadedState);
      return {
        ...nextStore,
        addReducers(newReducers) {
          this.replaceReducer(combineReducers(lazyReducers = {
            ...lazyReducers,
            ...newReducers
          }));
        }
      }
    }
  }
}
