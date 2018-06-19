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

    import { installRouter } from '../node_modules/pwa-helpers/router.js';
    //...
    installRouter((location) => _locationChanged(location));

  For example, if you're using this router in a Redux-connected component,
  you could dispatch an action in the callback:

    import { installRouter } from '../node_modules/pwa-helpers/router.js';
    import { navigate } from '../actions/app.js';
    //...
    installRouter((location) => store.dispatch(navigate(location)))


  If you need to force a navigation to a new location programmatically, you can
  do so by pushing a new state using the History API, and then manually
  calling the callback with the new location:

    window.history.pushState({}, '', '/new-route');
    _locationChanged(window.location);

  Optionally, you can use the second argument to read the event that caused the
  navigation. For example, you may want to scroll to top only after a link click.

    installRouter((location, event) => {
      // Only scroll to top on link clicks, not popstate events.
      if (event && event.type === 'click') {
        window.scrollTo(0, 0);
      }
      store.dispatch(navigate(location));
    });
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
      locationUpdatedCallback(location, e);
    }
  });

  window.addEventListener('popstate', e => locationUpdatedCallback(window.location, e));
  locationUpdatedCallback(window.location, null /* event */);
};
