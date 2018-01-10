import { drill } from "./split";

class Reduced {
  constructor(reducer, data, ...keys) {
    this.data = data;
    this.reducer = reducer;
    this.keys = keys;
  }

  reduce(store) {
    return () =>
      drill(
        store.getState(),
        state => this.reducer(state, this.data),
        this.keys
      );
  }
}

export function reduce(reducer, ...keys) {
  return actions =>
    Object.entries(actions).reduce(
      (reduced, [name, action]) => ({
        ...reduced,
        [name]: (...args) => new Reduced(reducer, action(...args), ...keys)
      }),
      {}
    );
}

export const reductive = (callback = () => {}) => store => next => action => {
  if (!(action instanceof Reduced)) {
    return next(action);
  }

  const previousState = store.getState();
  const fluxEvent = action.data;
  const final = next(action.reduce(store));
  const nextState = store.getState();

  callback(fluxEvent, previousState, nextState);

  return final;
};
