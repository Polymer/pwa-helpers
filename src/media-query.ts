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
  Utility method that calls a callback whenever a media-query matches in response
  to the viewport size changing. The callback should take a boolean parameter
  (with "true" meaning the media query is matched)

  Sample use:
  import { installMediaQueryWatcher } from '../node_modules/pwa-helpers/media-query.js';

  installMediaQueryWatcher(`(min-width: 600px)`, (matches) => {
    someTextSpan.textContent = matches ? 'wide screen' : 'narrow sreen';
    // Here you can run any code as a response to the layout changing, like
    // closing any mobile/small screen drawers, etc.
  });

*/

export const installMediaQueryWatcher = (mediaQuery: string, layoutChangedCallback: (mediaQueryMatches: boolean) => void) => {
  let mql = window.matchMedia(mediaQuery);
  mql.addListener((e) => layoutChangedCallback(e.matches));
  layoutChangedCallback(mql.matches);
};
