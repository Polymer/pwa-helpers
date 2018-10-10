# pwa-helpers

[![Build Status](https://travis-ci.org/Polymer/pwa-helpers.svg?branch=master)](https://travis-ci.org/Polymer/pwa-helpers)
[![Published on npm](https://img.shields.io/npm/v/pwa-helpers.svg)](https://www.npmjs.com/package/pwa-helpers)

Small helper methods or mixins to help build a PWA,
and reduce the boilerplate you might have to write. There are many different
ways in which you could write these helpers; use these if you want a simple
starting point.

## Basic helpers
These are vanilla JavaScript methods that can be used regardless of which
frameworks or libraries your application is written in.

### `router.js`
Basic router that calls a callback whenever the location is updated.

Example:

```js
import { installRouter } from 'pwa-helpers/router.js';

installRouter((location) => handleNavigation(location));
```

For example, if you're using this router in a Redux-connected component,
you could dispatch an action in the callback:

```js
import { installRouter } from 'pwa-helpers/router.js';
import { navigate } from '../actions/app.js';

installRouter((location) => store.dispatch(navigate(location)));
```

If you need to force a navigation to a new location programmatically, you can
do so by pushing a new state using the History API, and then manually
calling the callback with the new location:

```js
window.history.pushState({}, '', '/new-route');
handleNavigation(window.location);
```

Optionally, you can use the second argument to read the event that caused the
navigation. For example, you may want to scroll to top only after a link click.

```js
installRouter((location, event) => {
  // Only scroll to top on link clicks, not popstate events.
  if (event && event.type === 'click') {
    window.scrollTo(0, 0);
  }
  handleNavigation(location);
});
```

### `network.js`
Utility method that calls a callback whenever the network connectivity of the app changes.
The callback should take a boolean parameter (with `true` meaning
the network is offline, and `false` meaning online)

Example:

```js
import { installOfflineWatcher } from 'pwa-helpers/network.js';

installOfflineWatcher((offline) => {
  console.log('You are ' + offline ? ' offline' : 'online');
});
```

### `metadata.js`
Utility method that updates the page's open graph and Twitter card metadata.
It takes an object as a parameter with the following properties:
title | description | url | image.

If the `url` is not specified, `window.location.href` will be used; for
all other properties, if they aren't specified, then that metadata field will not
be set.

Example (in your top level element or document, or in the router callback):

```js
import { updateMetadata } from 'pwa-helpers/metadata.js';

updateMetadata({
  title: 'My App - view 1',
  description: 'This is my sample app',
  url: window.location.href,
  image: '/assets/view1-hero.png'
});
```

### `media-query.js`
Utility method that calls a callback whenever a media-query matches in response
to the viewport size changing. The callback should take a boolean parameter
(with `true` meaning the media query is matched).

Example:

```js
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';

installMediaQueryWatcher(`(min-width: 600px)`, (matches) => {
  console.log(matches ? 'wide screen' : 'narrow sreen');
});
```

## Test helpers
Utility methods to be used inside of testing frameworks, to reduce some testing boilerplate.

### `axe-report.js`
This is an [axe-core](https://github.com/dequelabs/axe-core) reporter that returns an
Error containing every a11y violation for an element. Use this if you want to
include `axe-core` in automated Mocha tests, etc.

Example (in a Mocha test):

```js
import 'axe-core/axe.min.js';
import { axeReport } from 'pwa-helpers/axe-report.js';

describe('button', function() {
  it('is accessible', function() {
    const button = document.createElement('button');
    button.textContent = 'click this';  // Test should fail without this line.
    return axeReport(button);
  });
});
```

## Redux helpers
These utility methods are useful if your application is using Redux for state management.

### `connect-mixin.js`
This is a JavaScript mixin that you can use to connect a Custom Element base
class to a Redux store. The `stateChanged(state)` method will be called when
the state is updated.

Example:

```js
import { connect } from 'pwa-helpers/connect-mixin.js';

class MyElement extends connect(store)(HTMLElement) {
  stateChanged(state) {
    this.textContent = state.data.count.toString();
  }
}
```

### `lazy-reducer-enhancer.js`
A Redux store enhancer that lets you lazy-install reducers after the store
has booted up. Use this if your application lazy-loads routes that are connected
to a Redux store.

Example:

```js
import { combineReducers } from 'redux';
import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';
import someReducer from './reducers/someReducer.js';

export const store = createStore(
  (state, action) => state,
  compose(lazyReducerEnhancer(combineReducers))
);
```

Then, in your page/element, you can lazy load a specific reducer with:

```js
store.addReducers({
  someReducer
});
```
