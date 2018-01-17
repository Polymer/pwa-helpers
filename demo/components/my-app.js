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
import { installRouter } from '../../router.js';
import { store } from '../store.js';
import { navigate, increment, decrement } from '../actions/app.js';

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
  <p>Here are some links, to demostrate the basic router. Clicking on the
  link will not do a page refresh, and will update the displayed page in the store. </p>
  <p>
  You're currently on <b><span id="pageSpan"></span></b></p>
  <a href="/demo/">home</a> | <a href="/demo/page1">page1</a> | <a href="/demo/page2">page2</a> | <a href="/demo/page3">page3</a>
  <hr>
  <p>This is a demo of a simple counter element, whose internal state is kept in the Redux store<p>
  <counter-element></counter-element>
</div>
`

class MyApp extends connect(store)(HTMLElement) {
  constructor() {
    super();

    // Stamp the template.
    let shadowRoot = this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(document.importNode(template.content, true));

    this._counter = shadowRoot.querySelector('counter-element');
    this._page = shadowRoot.getElementById('pageSpan');

    // Every time the display of the counter updates, we should save
    // these values in the store
    this.addEventListener('counter-incremented', function() {
      store.dispatch(increment());
    });

    this.addEventListener('counter-decremented', function() {
      store.dispatch(decrement());
    });

    // Setup the router.
    installRouter(() => store.dispatch(navigate(window.location)));
  }

  update(state) {
    if (this._counter) {
      this._counter.clicks = state.clicks;
      this._counter.value = state.value;
    }
    if (this._page) {
      this._page.textContent = state.page;
    }

  }
}

window.customElements.define('my-app', MyApp);
