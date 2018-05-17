/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import './counter-element.js';
import { connect } from '../../connect-mixin.js';
import { store, RootLazyState, RootState } from '../store.js';
import { increment, decrement } from '../actions/counter.js';
import * as r from 'redux';


/*
This is an element that is connected to the Redux store, which contains
the immutable state for the clicks/value of the counter element.
This element is also responsible for updating the counter element's internal
state.
*/

// For simplicity, we're not using any styles in this element so that we
// don't have to set up a Shady CSS polyfill.
let template = document.createElement('template');
template.innerHTML = `
<div>
  Inside &lt;redux-example&gt;. The store state is:
  <ul>
    <li><code>clicks = <span id="clicksSpan"></span></code></li>
    <li><code>value = <span id="valueSpan"></span></code></li>
    <li><code>didLoad = <span id="didLoadSpan"></span></code></li>
    <li><code>toggleValue = <span id="lazyToggleSpan"></span></code></li>
  </ul>
  <counter-element></counter-element>
  <button id="lazyLoadButton">Load lazy reducer</button>
  <button id="lazyActionButtonOn">Lazy Action Toggle On</button>
  <button id="lazyActionButtonOff">Lazy Action Toggle Off</button>
  <button id="lazyActionButton">Lazy Action Toggle</button>
</div>
`

class ReduxExample extends connect(store)(HTMLElement) {
  _counter: CounterElement;
  _clicksSpan: HTMLElement;
  _valueSpan: HTMLElement;
  _didLoadSpan: HTMLElement;
  _lazyToggleSpan: HTMLElement;
  _lazyLoadButton: HTMLButtonElement;
  _lazyActionButtonOn: HTMLButtonElement;
  _lazyActionButtonOff: HTMLButtonElement;
  _lazyActionButton: HTMLButtonElement;

  constructor() {
    super();

    // Stamp the template.
    let shadowRoot = this.attachShadow({mode: 'open'})!;
    shadowRoot.appendChild(document.importNode(template.content, true));

    // Cache some elements so that you don't qsa all the time.
    this._counter = shadowRoot.querySelector('counter-element')!;
    this._clicksSpan = shadowRoot.getElementById('clicksSpan')!;
    this._valueSpan = shadowRoot.getElementById('valueSpan')!;
    this._didLoadSpan = shadowRoot.getElementById('didLoadSpan')!;
    this._lazyToggleSpan = shadowRoot.getElementById('lazyToggleSpan')!;
    this._lazyLoadButton = shadowRoot.getElementById('lazyLoadButton')! as HTMLButtonElement;
    this._lazyActionButtonOn = shadowRoot.getElementById('lazyActionButtonOn')! as HTMLButtonElement;
    this._lazyActionButtonOff = shadowRoot.getElementById('lazyActionButtonOff')! as HTMLButtonElement;
    this._lazyActionButton = shadowRoot.getElementById('lazyActionButton')! as HTMLButtonElement;

    // Every time the display of the counter updates, we should save
    // these values in the store.
    this.addEventListener('counter-incremented', () => store.dispatch(increment()));
    this.addEventListener('counter-decremented', () => store.dispatch(decrement()));

    this._lazyLoadButton.addEventListener('click',
        () => this._loadReducer());

    this._lazyActionButtonOn.addEventListener('click',
        () => this._toggleLazy(true));
    this._lazyActionButtonOff.addEventListener('click',
        () => this._toggleLazy(false));
    this._lazyActionButton.addEventListener('click',
        () => this._toggleLazy());
  }

  _stateChanged(state: RootState) {
    const numClicks = this._counter.clicks = state.counter.clicks;
    const value = this._counter.value = state.counter.value;
    // Update the UI.
    this._clicksSpan.textContent = numClicks.toString();
    this._valueSpan.textContent = value.toString();
    this._didLoadSpan.textContent = state.lazy ? state.lazy.didLoad.toString() : 'undefined';
    this._lazyToggleSpan.textContent = state.lazy ? state.lazy.toggleValue.toString() : 'undefined';
  }

  _loadReducer() {
    import('../reducers/lazy.js').then((module) => {
      const reducer = module.default;
      const reducerMap: r.ReducersMapObject<RootLazyState> = {'lazy': reducer};
      store.addReducers(reducerMap);
    });
  }

  _toggleLazy(value?: boolean) {
    import('../actions/lazy.js').then((module) => {
      if (value === undefined) {
        store.dispatch(module.toggle());

        return;
      }

      store.dispatch(module.forceToggle(value));
    });
  }

}

window.customElements.define('redux-example', ReduxExample);
