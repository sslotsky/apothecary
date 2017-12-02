function computeState(state, action) {
  return action ? action(state) : state;
}

export default function initialize(initialState) {
  let state = computeState(initialState);
  const listeners = [];
  const dispatch = action => {
    if (action.jam) {
      return action(dispatch);
    }

    state = computeState(state, action);
    listeners.forEach(l => l(state));
    return state;
  };

  return {
    subscribe: listener => listeners.push(listener),
    unsubscribe: listener => listeners.splice(listeners.indexOf(listener), 1),
    getState: () => state,
    dispatch
  };
}

