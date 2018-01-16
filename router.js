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
  Basic router that calls a callback whenever the location is updated.

  Sample use:
  import { connect } from '../node_modules/@webcomponents/redux-helpers/connect-mixin.js';
  import { installRouter } from '../node_modules/@webcomponents/redux-helpers/router.js';

  class MyElement extends connect(store)(HTMLElement) {
    // ...

    ready() {
      super.ready();

      // If you don’t have any other work to do other than dispatching an action,
      // you can write something like:
      installRouter(() => store.dispatch(updateLocation(window.location)));

      // If you need to do other work, you can also use this, where the
      // _notifyPathChanged method would dispatch the store action.
      // installRouter(this._notifyPathChanged.bind(this));
    }
  }
*/

export const installRouter = (locationUpdatedCallback) => {
  document.body.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey) return;

    const anchor = e.composedPath().filter(n => n.tagName === 'A')[0];
    if (!anchor || anchor.target ||
        anchor.hasAttribute('download') ||
        anchor.getAttribute('rel') === 'external') return;

    const href = anchor.href;
    if (!href || href.indexOf('mailto:') !== -1) return;

    const location = window.location;
    const origin = location.origin || location.protocol + '//' + location.host;
    if (href.indexOf(origin) !== 0) return;

    e.preventDefault();
    if (href !== location.href) {
      window.history.pushState({}, '', href);
      locationUpdatedCallback();
    }
  });

  window.addEventListener('popstate', () => locationUpdatedCallback());
  locationUpdatedCallback();
};
