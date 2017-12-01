function computeState(state, action) {
  return action ? action(state) : state;
}

let store = null;

export default function initialize(initialState) {
  if (!store) {
    let state = computeState(initialState);
    const listeners = [];
    const dispatch = action => {
      if (action.thunk) {
        return action(dispatch);
      }

      state = computeState(state, action);
      listeners.forEach(l => l(state));
      return state;
    };

    store = {
      subscribe: listener => listeners.push(listener),
      getState: () => state,
      dispatch
    };
  }

  return store;
}

