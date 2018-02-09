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
import { installNetworkWatcher } from '../../network.js';
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
  <h2>Router</h2>
  <p>Here are some links, to demostrate the basic router. Clicking on the
  link will not do a page refresh, and will update the displayed page in the store. </p>
  <p>
  You're currently on <b><span id="pageSpan"></span></b></p>
  <a href="/demo/">home</a> | <a href="/demo/page1">page1</a> | <a href="/demo/page2">page2</a> | <a href="/demo/page3">page3</a> | <a href="/demo/lazy-reducer">lazy-reducer</a>

  <h2>Network state</h2>
  You can get notified any time the network connectivity changes.
  You are currently <b><span id="offlineSpan"></span></b>. If you turn off your
  wifi (or change your status to "offline" in the Chrome DevTools), this value
  will update.

  <h2>Basic Redux example</h2>
  <p>This is a demo of a simple counter element, which is <i>not</i> connected to the
  Redux store. It represents a third-party element you could've gotten from an
  element catalog. However, its parent, the main app element, <i>is</i> connected to
  the store and therefore is responsible for syncing the state.<p>
  <counter-element></counter-element>

  <h2>Lazy loaded reducers</h2>
  <p>When you click on the <b>lazy-reducer</b> link, the app will lazily load a reducer
  which will set a new property in the store, <code>didLoad</code>. That value is
  displayed here:</p>
  <p><code>didLoad = <span id="didLoadSpan"></span></code>
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
    this._loaded = shadowRoot.getElementById('didLoadSpan');
    this._offline = shadowRoot.getElementById('offlineSpan');
    this._ready = true;

    // Every time the display of the counter updates, we should save
    // these values in the store
    this.addEventListener('counter-incremented', function() {
      store.dispatch(increment());
    });

    this.addEventListener('counter-decremented', function() {
      store.dispatch(decrement());
    });

    // Setup the router. Do this last since this will trigger a store
    // update, and correctly update the UI.
    installRouter(() => store.dispatch(navigate(window.location)));

    installNetworkWatcher((offline) => {
      this._offline.textContent = offline ? ' offline' : 'online';
    });
  }

  stateChanged(state) {
    // The store boots up before we have stamped the template.
    if (!this._ready) {
      return;
    }

    // If we're on the page that needs to lazy load the reducer, do that.
    if (!state.lazy && state.app.page === '/demo/lazy-reducer') {
      import('../reducers/lazy.js').then((module) => {
        const reducer = module.default;
        store.addReducers({'lazy': reducer});
      });
    }

    // Update the UI.
    this._counter.clicks = state.counter.clicks;
    this._counter.value = state.counter.value;
    this._page.textContent = state.app.page;
    if (!state.lazy) {
      this._loaded.textContent = 'undefined';
    } else {
      this._loaded.textContent = state.lazy.didLoad;
    }
  }
}

window.customElements.define('my-app', MyApp);
