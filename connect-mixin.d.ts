import { Store, Action, AnyAction } from "redux";
import { ILazyReducerStore } from "./lazy-reducer-enhancer";

/**
  Mixin for connecting an element to the Redux store; implements the
  basic store-connection boilerplate.

  @template S the type of state held by the redux store.
  @template B the interface to the base element which will be connected to the redis store.

  @example
  import { connect } from '../node_modules/pwa-helpers/connect-mixin.js';

  class MyElement extends connect(store)(HTMLElement) {
    // ...

    _stateChanged(state) {
      this.count = state.data.count;
    }
  }
*/
export declare function connect<S, A extends Action = AnyAction>(
  store: Store<S, A> | ILazyReducerStore<S, A>
): <B>(baseElement: B) => B & IElementWithReduxStore<S>;
export declare function connect<S, A extends Action = AnyAction>(
  store: ILazyReducerStore<S, A>
): <B>(baseElement: B) => B & IElementWithReduxStore<S>;

/**
 * Interface to the resultant element that is connected to the redis store.
 *
 * @template S the type of state held by the redux store.
 */
export interface IElementWithReduxStore<S> {
  connectedCallback(): void;
  disconnectedCallback(): void;
  _stateChanged(state: S): void;
  __storeUnsubscribe(): void;
}
