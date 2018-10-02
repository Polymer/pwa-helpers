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
  This is a JavaScript mixin that you can use to connect a Custom Element base class
  to a Redux store. You can implement `mapStateToProps(state)` and
  `mapDispatchToProps(dispatch)` methods to connect the element to the store.

  import { connect } from '../node_modules/pwa-helpers/connect-mixin.js';

  class MyElement extends connect(store)(HTMLElement) {
    // ...

    mapStateToProps(state) {
      return {
        count: state.data.count
      };
    }

    mapDispatchToProps(dispatch) {
      return {
        onIncrement: count => dispatch(increment(count))
      };
    }
  }

  Alternatively, you can implement a `stateChanged(state)` method which is called when
  the state is updated. If you implement this method, `mapStateToProps(state)` won't
  be used.

  import { connect } from '../node_modules/pwa-helpers/connect-mixin.js';

  class MyElement extends connect(store)(HTMLElement) {
    stateChanged(state) {
      this.textContent = state.data.count.toString();
    }
  }
*/
import { Store, Unsubscribe } from 'redux';

type Constructor<T> = new(...args: any[]) => T;

export const connect =
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

      this._storeUnsubscribe = store.subscribe(() => this.stateChanged(store.getState()));
      this.stateChanged(store.getState());
    }

    disconnectedCallback() {
      this._storeUnsubscribe();

      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }

    stateChanged(state: S) {
      Object.assign(this, this.mapStateToProps(state));
    }

    mapStateToProps(_state: S) {
      return {};
    }

    mapDispatchToProps(_dispatch: typeof store.dispatch) {
      return {};
    }
  };
