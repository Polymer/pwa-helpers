import { installRouter } from '../router.js';
import { installOfflineWatcher } from '../network.js';
import { installMediaQueryWatcher } from '../media-query.js';
import { updateMetadata } from '../metadata.js';
import { axeReport } from '../axe-report.js';

const testButton = document.getElementById('testButton')!;
const axeReportOutput = document.getElementById('axeReportOutput')!;
const pageSpan = document.getElementById('pageSpan')!;
const offlineSpan = document.getElementById('offlineSpan')!;
const screenSpan = document.getElementById('screenSpan')!;

(async function() {
  axeReport(testButton).then(
    () => {},
    (e) => { axeReportOutput.textContent = e }
    );
})();

installRouter((location) => {
  const page = location.pathname
  pageSpan.textContent = page;

  if (page === '/demo/update-meta') {
    updateMetadata({
        title: '🎁🎉 PWA helpers for all! 🎉🎁',
        description: 'Demo of the utility methods in PWA helpers',
        url: '',
        image: ''
    });
  }
});
installOfflineWatcher((offline) => {
  offlineSpan.textContent = offline ? ' offline' : 'online';
});
installMediaQueryWatcher(`(min-width: 600px)`, (matches) => {
  screenSpan.textContent = matches ? 'wide' : 'narrow';
});