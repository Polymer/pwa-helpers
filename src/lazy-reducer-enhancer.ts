/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { ReducersMapObject, StoreEnhancer } from 'redux'

export interface LazyStore {
  addReducers: (newReducers: ReducersMapObject) => void
}

/**
  A Redux store enhancer that lets you lazy-install reducers after the store
  has booted up. Use this if your application lazy-loads routes that are connected
  to a Redux store.

  Example:

      import { combineReducers } from 'redux';
      import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';
      import someReducer from './reducers/someReducer.js';

      export const store = createStore(
        (state, action) => state,
        compose(lazyReducerEnhancer(combineReducers))
      );

  Then, in your page/element, you can lazy load a specific reducer with:

      store.addReducers({
        someReducer
      });
*/
export const lazyReducerEnhancer =
  (combineReducers: typeof import('redux').combineReducers) => {
    const enhancer: StoreEnhancer<LazyStore> = (nextCreator) => {
      return (origReducer, preloadedState) => {
        let lazyReducers = {};
        const nextStore = nextCreator(origReducer, preloadedState);
        return {
          ...nextStore,
          addReducers(newReducers) {
            const combinedReducerMap: ReducersMapObject = {
              ...lazyReducers,
              ...newReducers
            };

            this.replaceReducer(combineReducers(lazyReducers = combinedReducerMap));
          }
        }
      }
    }

    return enhancer;
  };
