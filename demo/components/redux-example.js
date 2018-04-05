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
import { store } from '../store.js';
import { increment, decrement } from '../actions/counter.js';

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
  </ul>
  <counter-element></counter-element>
  <button>Load lazy reducer</button>
</div>
`

class ReduxExample extends connect(store)(HTMLElement) {
  constructor() {
    super();

    // Stamp the template.
    let shadowRoot = this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(document.importNode(template.content, true));

    // Cache some elements so that you don't qsa all the time.
    this._counter = shadowRoot.querySelector('counter-element');
    this._clicksSpan = shadowRoot.getElementById('clicksSpan');
    this._valueSpan = shadowRoot.getElementById('valueSpan');
    this._didLoadSpan = shadowRoot.getElementById('didLoadSpan');

    // Every time the display of the counter updates, we should save
    // these values in the store.
    this.addEventListener('counter-incremented', () => store.dispatch(increment()));
    this.addEventListener('counter-decremented', () => store.dispatch(decrement()));

    shadowRoot.querySelector('button').addEventListener('click',
        () => this._loadReducer());
  }

  stateChanged(state) {
    // Update the UI.
    this._clicksSpan.textContent = this._counter.clicks = state.counter.clicks;
    this._valueSpan.textContent = this._counter.value = state.counter.value;
    this._didLoadSpan.textContent = state.lazy ? state.lazy.didLoad : 'undefined';
  }

  _loadReducer() {
    import('../reducers/lazy.js').then((module) => {
      const reducer = module.default;
      store.addReducers({'lazy': reducer});
    });
  }

}

window.customElements.define('redux-example', ReduxExample);
