/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Store, Unsubscribe } from 'redux';

type Constructor<T> = new(...args: any[]) => T;

/**
  By using this `CustomElement` interface instead of `HTMLElement`, we avoid
  having the generated typings include most DOM API already provided by
  TypeScript. This is particularly useful since different versions of
  TypeScript may have different DOM API typings (e.g. TS 3.0.3 and TS 3.1.1).
  The required `isConnected` property is included to avoid the following
  TypeScript error:

      Type 'HTMLElement' has no properties in common with type 'CustomElement'.
*/
interface CustomElement {
  connectedCallback?(): void;
  disconnectedCallback?(): void;
  readonly isConnected: boolean;
}

/**
  This is a JavaScript mixin that you can use to connect a Custom Element base
  class to a Redux store. The `stateChanged(state)` method will be called when
  the state is updated.

  Example:

      import { connect } from 'pwa-helpers/connect-mixin.js';

      class MyElement extends connect(store)(HTMLElement) {
        stateChanged(state) {
          this.textContent = state.data.count.toString();
        }
      }
*/
export const connect =
  <S>(store: Store<S>) =>
  <T extends Constructor<CustomElement>>(baseElement: T) =>
  class extends baseElement {
    _storeUnsubscribe!: Unsubscribe;

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

    /**
     * The `stateChanged(state)` method will be called when the state is updated.
     */
    stateChanged(_state: S) {}
  };
