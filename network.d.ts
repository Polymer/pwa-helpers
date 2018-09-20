/**
  Utility method that calls a callback whenever the network connectivity of the app changes.
  The callback should take a boolean parameter (with "true" meaning
  the network is offline, and "false" meaning online)

  @example
  import { installOfflineWatcher } from '../node_modules/pwa-helpers/network.js';

  installOfflineWatcher((offline) => {
    console.log('You are ' + offline ? ' offline' : 'online');
  });

*/
export declare function installOfflineWatcher(
  offlineUpdatedCallback: (isOffline: boolean) => void
): void;
