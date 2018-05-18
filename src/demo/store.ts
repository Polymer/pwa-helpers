/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

declare global {
  interface Window {
    process?: Object;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof r.compose;
  }
}

import * as r from 'redux';
import * as enhancers from '../lazy-reducer-enhancer.js'
import * as counterActions from './actions/counter.js';
import * as lazyActions from './actions/lazy';
import { LazyState } from './reducers/lazy.js';

// static states
export interface RootStateCounter {
  counter: CounterState
}

// lazy states
export interface RootLazyState {
  lazy: LazyState
}

// root action is an or of all actions lazy or not. If there is no reducer
// it will simply not execute
type RootAction = counterActions.CounterAction | lazyActions.LazyAction;

// root state extends static states and partials of lazy states
export type RootState = RootStateCounter & Partial<RootLazyState>;

// Initially loaded reducers.
import counter, { CounterState } from './reducers/counter.js';

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const newCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || r.compose;

// Initializes the Redux store with a lazyReducerEnhancer (so that you can
// lazily add reducers after the store has been created).
export const store = r.createStore(
  ((state) => state) as r.Reducer<RootState, RootAction>,
  newCompose(enhancers.lazyReducerEnhancer(r.combineReducers))
);

const reducer: r.ReducersMapObject<RootStateCounter, counterActions.CounterAction> = { counter };
store.addReducers(reducer);
