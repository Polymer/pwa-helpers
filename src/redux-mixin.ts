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
  import { ReduxMixin } from '../node_modules/pwa-helpers/redux-mixin.js';

  class MyElement extends connect(store)(HTMLElement) {
    // ...

    mapStateToProps(state) {
      return { count: state.data.count };
    }
  }
*/
import { Store, Unsubscribe } from 'redux';

type Constructor<T> = new(...args: any[]) => T;

export const ReduxMixin =
  <S>(store: Store<S>) =>
  <T extends Constructor<HTMLElement>>(baseElement: T) =>
  class extends baseElement {
    _storeUnsubscribe!: Unsubscribe;

    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, this.mapDispatchToProps(store.dispatch));
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      this._storeUnsubscribe = store.subscribe(() => this._stateChanged(store.getState()));
      this._stateChanged(store.getState());
    }

    disconnectedCallback() {
      this._storeUnsubscribe();

      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }

    _stateChanged(state: S) {
      Object.assign(this, this.mapStateToProps(state));
    }

    mapStateToProps(_state: S) {
      return {};
    }

    mapDispatchToProps(_dispatch: typeof store.dispatch) {
      return {};
    }
  };
