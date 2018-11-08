/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
  Utility method that updates the page's open graph and Twitter card metadata.
  It takes an object as a parameter with the following properties:
  title | description | url | image.

  If the `url` is not specified, `window.location.href` will be used; for
  all other properties, if they aren't specified, then that metadata field will not
  be set.

  Example (in your top level element or document, or in the router callback):

      import { updateMetadata } from 'pwa-helpers/metadata.js';

      updateMetadata({
        title: 'My App - view 1',
        description: 'This is my sample app',
        url: window.location.href,
        image: '/assets/view1-hero.png'
      });

*/
export const updateMetadata = ({title, description, url, image, imageAlt}: {title?: string, description?: string, url?: string, image?: string, imageAlt?: string}) => {
  if (title) {
    document.title = title;
    _setMeta('property', 'og:title', title);
  }

  if (description) {
    _setMeta('name', 'description', description);
    _setMeta('property', 'og:description', description);
  }

  if (image) {
    _setMeta('property', 'og:image', image);
  }

  if (imageAlt) {
    _setMeta('property', 'og:image:alt', imageAlt);
  }

  url = url || window.location.href;
  _setMeta('property', 'og:url', url);
}

function _setMeta(attrName:string, attrValue:string, content:string) {
  let element = document.head!.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head!.appendChild(element);
  }
  element.setAttribute('content', content || '');
}
