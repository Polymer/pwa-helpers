/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { ElementContext, RunOptions } from 'axe-core';

declare global {
  namespace axe {
    const run: typeof import('axe-core').run;
  }
}

export interface AxeReportOptions extends RunOptions {
  cleanup?: () => Promise<void>
  axeConfig?: RunOptions
}

/**
  This is an [axe-core](https://github.com/dequelabs/axe-core) reporter that returns an
  Error containing every a11y violation for an element. Use this if you want to
  include `axe-core` in automated Mocha tests, etc. Note that this helper does not
  include `axe-core` for you; you must do this separately.

  The `axeReport` function takes an optional second argument:
  {cleanup: {...}, axeConfig: {...}}, where `cleanup` is a callback to be
  called after the test is ran (so that you can remove the element from the DOM, etc)
  and `axeConfig` are the optional extra config parameters to pass to axe.

  Example (in a Mocha test):

      import 'axe-core/axe.min.js';
      import { axeReport } from 'pwa-helpers/axe-report.js';

      describe('button', function() {

        it('is accessible', function() {
          const button = document.createElement('button');
          button.textContent = 'click this'; // Test should fail without this line.
          return axeReport(button);

          // If you need to run any cleanup code after the test is run, you
          // can use the `cleanup` object. For example,
          // document.body.appendChild(button);
          // return axeReport(el, { cleanup() { el.remove(); } });
        });
      });
*/
export async function axeReport(dom: ElementContext, config:AxeReportOptions = {}) {
  const {cleanup, axeConfig} = config;
  const defaultConfig: RunOptions = {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'section508']
    },
    // Ignore tests that are passing.
    resultTypes: ['violations']
  };
  const {violations} = await axe.run(dom, axeConfig ||  defaultConfig);
  if (cleanup) {
    await cleanup();
  }
  if (!violations.length) {
    return;
  }
  const errorMessage = ['Accessibility Violations', '---'];
  for (const violation of violations) {
    errorMessage.push(violation.help);
    for (const node of violation.nodes) {
      if (node.failureSummary) {
        errorMessage.push(node.failureSummary);
      }
      errorMessage.push(node.html);
    }
    errorMessage.push('---');
  }
  throw new Error(errorMessage.join('\n'));
}
