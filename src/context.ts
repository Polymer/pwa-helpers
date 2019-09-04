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
  By using this `CustomElement` interface instead of `HTMLElement`, we avoid
  having the generated typings include most DOM API already provided by
  TypeScript. This is particularly useful since different versions of
  TypeScript may have different DOM API typings (e.g. TS 3.0.3 and TS 3.1.1).
  The required `isConnected` property is included to avoid the following
  TypeScript error:

      Type 'HTMLElement' has no properties in common with type 'CustomElement'.
*/
interface CustomElement {
  dispatchEvent(event: Event): boolean;
  connectedCallback?(): void;
  readonly isConnected: boolean;
}

type Constructor<T> = new (...args: any[]) => T;

export function createContext<T>(
  name: string,
  defaultValue: T
): [
  typeof HTMLElement,
  (base: typeof HTMLElement) => typeof HTMLElement,
  symbol
] {
  const eventName = `context-${name}`;
  class Provider extends HTMLElement {
    value = defaultValue;
    constructor() {
      super();

      this.addEventListener(
        eventName,
        (
          e: Event & {
            detail?: (v: T) => void;
          }
        ) => {
          e.detail && e.detail(this.value);
          e.stopPropagation();
        }
      );
    }
  }

  const cb = Symbol(`_on${name}ContextChange`);

  const consumerMixin = <V extends Constructor<CustomElement>>(Base: V) =>
    class Consumer extends Base {
      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }

        let called = false;
        const event = new CustomEvent<(v: T) => void>(eventName, {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: value => {
            called = true;
            this[cb](value);
          }
        });
        this.dispatchEvent(event);

        if (!called) {
          this[cb](defaultValue);
        }
      }

      [cb](_: T) {}
    };

  return [Provider, consumerMixin, cb];
}
