/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import * as r from 'redux';
import { LazyAction, TOGGLE, FORCE_TOGGLE } from '../actions/lazy';

export interface LazyState {
  didLoad: boolean,
  toggleValue: boolean
}
// This reducer doesn't do anything other than boot up.
const lazy:r.Reducer<LazyState, LazyAction> = (state = {didLoad:true, toggleValue:false}, action) => {
  switch (action.type) {
    case TOGGLE:
      return {
        ...state,
        toggleValue: !state.toggleValue
      }
    case FORCE_TOGGLE:
      return {
        ...state,
        toggleValue: action.value
      }
    default:
      return state;
  }

}

export default lazy;
