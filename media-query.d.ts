/**
 * Utility method that calls a callback whenever a media-query matches in response
 * to the viewport size changing. The callback should take a boolean parameter
 * (with "true" meaning the media query is matched).
 * @param mediaQuery string representing the media query.
 * @param layoutChangedCallback callback that take a boolean parameter (with "true" meaning the media query is matched).
 *
 * @example
 * import { installMediaQueryWatcher } from '../node_modules/pwa-helpers/media-query.js';
 *
 * installMediaQueryWatcher(`(min-width: 600px)`, (matches) => {
 *   someTextSpan.textContent = matches ? 'wide screen' : 'narrow sreen';
 *   // Here you can run any code as a response to the layout changing, like
 *   // closing any mobile/small screen drawers, etc.
 * });
 */
export declare function installMediaQueryWatcher(
  mediaQuery: string,
  layoutChangedCallback: (matches: boolean) => void
): void;
