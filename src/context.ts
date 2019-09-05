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
  disconnectedCallback?(): void;
  readonly isConnected: boolean;
}

interface Detail<T> {
  onChange: (v: T) => void;
  setUnsubscribe: (uf: () => void) => void;
}

type Constructor<T> = new (...args: any[]) => T;

const doNothing = () => {};

/**
  This creates a new context. Context can be used to pass arbitary values down 
  the dom tree. Context is updated when the value property changes or the 
  position in the dom of the comsumer changes. Consumer will always receive a
  context.

  This returs [`Provider`, `consumerMixin`, `callbackPropertySymbol`].
  `Provider` is the context providing custom element.`consumerMixin` is the 
  mixin that is used to actually consume a value provided. 
  `callbackProperSymbol` is the property that will be called when the 
  context value changes.

  Example:

    // log-context.js

    import createContext from 'pwa-helpers/context.js';

    const LoggerContext = "logger";    

    export const [Provider, consumerMixin, loggerCallback] = createContext(
      LoggerContext,
      {
        log: console.log
      }
    );

    customElements.define("context-logger", Provider);

    // my-app.js

    import "./log-context.js";

    @customElement("hey-app")
    class HeyApp extends LitElement {
      render() {
        // If we remove `.value` here it will default to `console.log`
        return html`
          <context-logger .value=${{ log: console.error }}>
            <inside-app></inside-app>
          </context-logger>
        `;
      }
    }    

    // inside-app.js

    import { consumerMixin, loggerCallback } from "./log-context.js";

    @customElement("inside-app")
    export class InsideApp extends consumerMixin(LitElement) {
      render() {
        return html`
          <div>Inside</div>
        `;
      }

      [loggerCallback](l) {
        l.log("Logger Received");
      }
    }
*/
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
    _value = defaultValue;
    consumers: Array<(t: T) => void> = [];

    constructor() {
      super();

      this.addEventListener(eventName, (e: Event & { detail?: Detail<T> }) => {
        if (e.detail) {
          e.detail.onChange && e.detail.onChange(this._value);
          if (e.detail.setUnsubscribe && e.detail.onChange) {
            const onChange = e.detail.onChange;
            this.consumers = [...this.consumers, onChange];
            e.detail.setUnsubscribe(
              () =>
                (this.consumers = this.consumers.filter(v => v !== onChange))
            );
          }
        }

        e.stopPropagation();
      });
    }

    get value() {
      return this._value;
    }

    set value(value: T) {
      this._value = value;
      this.consumers.forEach(c => c(value));
    }
  }

  const callbackPropertySymbol = Symbol(`_on${name}ContextChange`);
  const unSubsribe = Symbol(`_unsubscribe${name}`);

  const consumerMixin = <V extends Constructor<CustomElement>>(Base: V) => {
    return class Consumer extends Base {
      connectedCallback() {
        super.connectedCallback && super.connectedCallback();

        this[unSubsribe]();
        let called = false;
        const event = new CustomEvent<Detail<T>>(eventName, {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            onChange: value => {
              called = true;
              this[callbackPropertySymbol](value);
            },
            setUnsubscribe: uf => {
              this[unSubsribe] = uf;
            }
          }
        });
        this.dispatchEvent(event);

        if (!called) {
          this[callbackPropertySymbol](defaultValue);
        }
      }

      disconnectedCallback() {
        super.disconnectedCallback && super.disconnectedCallback();
        this[unSubsribe]();
        this[unSubsribe] = doNothing;
      }

      [callbackPropertySymbol](_: T) {}
      [unSubsribe] = doNothing;
    };
  };

  return [Provider, consumerMixin, callbackPropertySymbol];
}

export default createContext;
