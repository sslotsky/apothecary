class Jam {
  constructor(action) {
    this.action = action;
  }
}

export const middleware = store => next => action => {
  if (action instanceof Jam) {
    return action.action(store.dispatch, store.getState);
  }

  return next(action);
};

export default function jam(action) {
  return new Jam(action);
}
