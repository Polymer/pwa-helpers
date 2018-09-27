import {
  Reducer,
  Store,
  ReducersMapObject,
  Action,
  AnyAction,
  StoreEnhancer,
  StoreEnhancerStoreCreator,
  combineReducers
} from "redux";

export interface ICombineReducers<S> {
  (reducers: ReducersMapObject<S, any>): Reducer<S>;
}

export interface ICombineReducers<S, A extends Action = AnyAction> {
  (reducers: ReducersMapObject<S, A>): Reducer<S, A>;
}

/**
  If you are lazy loading any connected elements, then these elements must be
  able to lazily install their reducers. This is a store enhancer that
  enables that.

  @template S The type of state held by this store.
  @template A the type of actions which may be dispatched by this store.
  @template Ext Store extension that is mixed into the Store type.
  @template StateExt State extension that is mixed into the state type.

  @return enhanced store with a `addReducers` method.
  
  @example
  // Sample use (where you define your redux store, in store.js):
  import lazyReducerEnhancer from '../node_modules/pwa-helpers/lazy-reducer-enhancer.js';
  import someReducer from './reducers/someReducer.js';

  export const store = createStore(
    (state, action) => state,
    compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
  );

  Then, in your page/element, you can lazy load a specific reducer with:
  store.addReducers({
    someReducer
  });
*/
export declare function lazyReducerEnhancer<
  S,
  A extends Action = AnyAction,
  Ext = {},
  StateExt = {}
>(
  _combineReducers: typeof combineReducers
): StoreEnhancer<Ext & ILazyReducerStore<S, A>, StateExt>

/**
 * Interface for a store enhanced with `lazyReducerEnhancer`.
 *
 * @template S The type of state held by this store.
 * @template A the type of actions which may be dispatched by this store.
 */
export interface ILazyReducerStore<S, A extends Action = AnyAction>
  extends Store<S, A> {
  /**
   * Lazily loads reducers.
   * @param reducers Object whose values correspond to different reducer functions.
   */
  addReducers(reducers: ReducersMapObject<S, A>): void;
}
