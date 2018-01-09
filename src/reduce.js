class Reduced {
  constructor(reducer, data) {
    this.data = data;
    this.reducer = reducer;
  }

  reduce(store) {
    return () => this.reducer(store.getState(), this.data);
  }
}

export function reduce(reducer) {
  return actions =>
    Object.entries(actions).reduce(
      (reduced, [name, action]) => ({
        ...reduced,
        [name]: (...args) => new Reduced(reducer, action(...args))
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
