import { createStore, Action, combineReducers, Reducer } from "redux";
import {
  connect,
  lazyReducerEnhancer,
  installMediaQueryWatcher,
  updateMetadata,
  installOfflineWatcher,
  installRouter
} from "../pwa-helpers";
import { IElementWithReduxStore } from "../connect-mixin";
import { ILazyReducerStore } from "../lazy-reducer-enhancer";

/** Utility function to type check argument. */
const isType = <T>(a: T) => a;

// test lazyReducerEnhancer
interface IAppState {
  foo: number;
}
interface IState {
  app?: IAppState;
}
const appState: IState = {};
const store = createStore(
  (state => state) as Reducer<IState, Action<any>>,
  lazyReducerEnhancer<IState, Action<any>>(combineReducers)
);
isType<ILazyReducerStore<IState, Action<any>>>(store)
store.addReducers({
  app: (state => state) as Reducer<IAppState, Action<any>>
});

// test connect
const mixins = connect(store)(HTMLElement);
isType<IElementWithReduxStore<IState>>(mixins)

class MyElement extends mixins {}
window.customElements.define("my-element", MyElement);
MyElement._stateChanged(appState);
MyElement.__storeUnsubscribe();

// test installMediaQueryWatcher
installMediaQueryWatcher(`(min-width: 600px)`, matches => {
  isType<boolean>(matches);
});

// test updateMetadata
updateMetadata({});
updateMetadata({
  title: "My App - view 1",
  description: "This is my sample app",
  url: document.location.href,
  image: "/assets/view1-hero.png"
});

// test installOfflineWatcher
installOfflineWatcher(offline => {
  isType<boolean>(offline);
});

// test installRouter
installRouter((location, event) => {
  isType<Location>(location);
  event && isType<MouseEvent | PopStateEvent>(event);
});
