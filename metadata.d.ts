/**
 * Utility method that updates the page's open graph and Twitter card metadata.
 * It takes an object as a parameter with the following properties:
 * title | description | url | image.
 *
 * If the `url` is not specified, `document.location.href` will be used; for
 * all other properties, if they aren't specified, then that metadata field will not
 * be set.
 *
 * @example
 * Sample use:
 * import { updateMetadata } from '../node_modules/pwa-helpers/metadata.js';
 *
 * updateMetadata({
 *   title: 'My App - view 1',
 *   description: 'This is my sample app',
 *   url: document.location.href,
 *   image: '/assets/view1-hero.png'
 * });
 *
 */
export declare function updateMetadata({
  title,
  description,
  url,
  image
}: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}): void;
