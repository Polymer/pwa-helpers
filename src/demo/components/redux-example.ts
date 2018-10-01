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
import { ReduxMixin } from '../../redux-mixin.js';
import { store, AppState, AppStateLazy } from '../store.js';
import { increment, decrement } from '../actions/counter.js';
import { ReducersMapObject } from 'redux';


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

class ReduxExample extends ReduxMixin(store)(HTMLElement) {
  private _counter: CounterElement
  private _clicksSpan: HTMLElement
  private _valueSpan: HTMLElement
  private _didLoadSpan: HTMLElement
  constructor() {
    super();

    // Stamp the template.
    let shadowRoot = this.attachShadow({mode: 'open'})!;
    shadowRoot.appendChild(document.importNode(template.content, true));

    // Cache some elements so that you don't qsa all the time.
    this._counter = shadowRoot.querySelector('counter-element')! as CounterElement;
    this._clicksSpan = shadowRoot.getElementById('clicksSpan')!;
    this._valueSpan = shadowRoot.getElementById('valueSpan')!;
    this._didLoadSpan = shadowRoot.getElementById('didLoadSpan')!;

    // Every time the display of the counter updates, we should save
    // these values in the store.
    this.addEventListener('counter-incremented', () => store.dispatch(increment()));
    this.addEventListener('counter-decremented', () => store.dispatch(decrement()));

    shadowRoot.querySelector('button')!.addEventListener('click',
        () => this._loadReducer());
  }

  set numClicks(_numClicks: number) {
    this._counter.clicks = _numClicks;
    this._clicksSpan.textContent = _numClicks.toString();
  }

  set value(_value: number) {
    this._counter.value = _value;
    this._valueSpan.textContent = _value.toString();
  }

  set didLoad(_didLoad: string) {
    this._didLoadSpan.textContent = _didLoad;
  }

  mapStateToProps(state: AppState) {
    return {
      numClicks: state.counter.clicks,
      value: state.counter.value,
      didLoad: state.lazy ? state.lazy.didLoad.toString() : 'undefined'
    };
  }

  _loadReducer() {
    import('../reducers/lazy.js').then((module) => {
      const reducer = module.default;
      const reducerMap: ReducersMapObject<AppStateLazy> = {'lazy': reducer};
      store.addReducers(reducerMap);
    });
  }

}

window.customElements.define('redux-example', ReduxExample);
