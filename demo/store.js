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
import createStore from '../node_modules/@0xcda7a/redux-es6/es/createStore.js';
import origCompose from '../node_modules/@0xcda7a/redux-es6/es/compose.js';
import combineReducers from '../node_modules/@0xcda7a/redux-es6/es/combineReducers.js';

import { lazyReducerEnhancer } from '../lazy-reducer-enhancer.js'

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;

// Initializes the Redux store with a lazyReducerEnhancer (so that you can
// lazily add reducers after the store has been created).
export const store = createStore(
  (state, action) => state,
  compose(lazyReducerEnhancer(combineReducers))
);

// Initially loaded reducers.
import counter from './reducers/counter.js';
store.addReducers({
  counter
});
