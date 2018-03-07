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
  Utility method that updates the page's open graph and Twitter card metadata.
  It takes an object as a parameter with the following properties:
  title | description | url | image.

  If the `url` is not specified, `document.location.href` will be used; for
  all other properties, if they aren't specified, then that metadata field will not
  be set.

  Sample use:
  import { updateMetadata } from '../node_modules/@polymer/pwa-helpers/metadata.js';

  updateMetadata({
      title: 'My App - view 1',
      description: 'This is my sample app',
      url: document.location.href,
      image: '/assets/view1-hero.png'
  });

*/

export const updateMetadata = ({title, description, url, image}) => {
  if (title) {
    document.title = title;
    _setMeta('property', 'og:title', document.title);
    _setMeta('property', 'twitter:title', document.title);
  }

  if (description) {
    _setMeta('property', 'og:description', description);
    _setMeta('property', 'twitter:description', document.title);
  }

  if (image) {
    _setMeta('property', 'og:image', image);
    _setMeta('property', 'twitter:image:src', image);
  }

  url = url || document.location.href;
  _setMeta('property', 'og:url', url);
  _setMeta('property', 'twitter:url', url);
}

function _setMeta(attrName, attrValue, content) {
  let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content || '');
}
