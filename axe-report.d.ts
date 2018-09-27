/**
  This is an [axe-core](https://github.com/dequelabs/axe-core) reporter that returns an
  Error containing every a11y violation for an element. Use this if you want to
  include `axe-core` in automated Mocha tests, etc. Note that this helper does not
  include `axe-core` for you; you must do this separately.

  The `axeReport` function takes an optional second argument:
  {cleanup: {...}, axeConfig: {...}}, where `cleanup` is a callback to be
  called after the test is ran (so that you can remove the element from the DOM, etc)
  and `axeConfig` are the optional extra config parameters to pass to axe.

  @throws accessibility violations errors

  @example
  import '../node_modules/axe-core/axe.min.js';
  import { axeReport } from '../node_modules/pwa-helpers/axe-report.js';
    
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
export declare function axeReport(
  dom: Node | string | RunOnlyObject,
  { cleanup, axeConfig }?: AxeReportConfig
): Promise<void>;

/** Config for axeReport. */
export interface AxeReportConfig {
  cleanup?: () => void;
  axeConfig?: RunOptions;
}

/** Run options passed to axe. */
export interface RunOptions {
  runOnly?: RunOnly;
  rules?: Object;
  iframes?: boolean;
  elementRef?: boolean;
  selectors?: boolean;
  resultTypes?: resultGroups[];
}

export type RunOnlyObject = {
  include?: string[] | string[][];
  exclude?: string[] | string[][];
};

export interface RunOnly {
  type: RunOnlyType;
  values?: TagValue[] | string[] | RunOnlyObject;
}

export type ImpactValue = "minor" | "moderate" | "serious" | "critical";

export type TagValue = "wcag2a" | "wcag2aa" | "section508" | "best-practice";

export type ReporterVersion = "v1" | "v2";

export type RunOnlyType = "rule" | "rules" | "tag" | "tags";

export type resultGroups = "inapplicable" | "passes" | "incomplete" | "violations";
