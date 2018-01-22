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

    update(state) {
      this.count = state.data.count;
    }
  }
*/

export const connect = (store) => (baseElement) => class extends baseElement {
  constructor() {
    super();

    // Connect the element to the store.
    store.subscribe(() => this.update(store.getState()));
    this.update(store.getState());
  }


  // This is called every time something is updated in the store.
  update(state) {
    throw new Error('update() not implemented', this);
  }
};
