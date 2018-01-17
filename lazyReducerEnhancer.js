/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// TODO: We are using this version because standard Redux uses names not paths.
// Investigate if we can require the user to provide their version of combineReducers.
import combineReducers from '../node_modules/@0xcda7a/redux-es6/es/combineReducers.js';

/*
  If you are lazy loading any connected elements, then these elements must be
  able to lazily install their reducers. This is a store enhancer that
  enables that.

  Sample use (where you define your redux store, in store.js):

  import lazyReducerEnhancer from '../node_modules/@webcomponents/redux-helpers/lazyReducerEnhancer.js';
  import someReducer from './reducers/someReducer.js';

  export const store = createStore(
    (state, action) => state,
    compose(lazyReducerEnhancer, applyMiddleware(thunk))
  );

  Then, in your page/element, you can lazy load a specific reducer with:
  store.addReducers({
    someReducer
  });
*/
const lazyReducerEnhancer = function(nextCreator) {
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
export default lazyReducerEnhancer;
