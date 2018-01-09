import { middleware as jam } from "./jam";

function computeState(state, action) {
  return action ? action(state) : state;
}

const chain = (first, ...rest) => {
  if (rest.length) {
    return first(chain(...rest));
  }

  return first(action => action);
};

const withStore = (store, mids) => mids.map(m => m(store));

export default function initialize(initialState, ...mids) {
  let state = computeState(initialState);

  const listeners = [];

  const store = {};

  store.getState = () => state;

  const end = () => action => {
    state = computeState(state, action);
    listeners.forEach(l => l(state));
    return state;
  };

  store.dispatch = action => {
    const transform = chain(...withStore(store, mids.concat(jam)).concat(end));

    return transform(action);
  };

  const unsubscribe = listener => {
    listeners.splice(listeners.indexOf(listener), 1);
  };

  store.subscribe = listener => {
    listeners.push(listener);

    return () => unsubscribe(listener);
  };

  return store;
}
