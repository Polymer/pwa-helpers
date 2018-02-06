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
  Mixin for connecting an element to the Redux store; implements the
  basic store-connection boilerplate.

  Sample use:
  import { connect } from '../node_modules/@webcomponents/redux-helpers/connect-mixin.js';

  class MyElement extends connect(store)(HTMLElement) {
    // ...

    stateChanged(state) {
      this.count = state.data.count;
    }
  }
*/

export const connect = (store) => (baseElement) => class extends baseElement {
  connectedCallback() {
    // Connect the element to the store.
    this.__storeUnsubscribe = store.subscribe(() => this.stateChanged(store.getState()));
    this.stateChanged(store.getState());
  }

  disconnectedCallback() {
    this.__storeUnsubscribe();
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    throw new Error('stateChanged() not implemented', this);
  }
};
