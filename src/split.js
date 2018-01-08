const drill = (state, action, keys) => {
  const key = keys[0];
  const substate = state[key];

  if (keys.length === 1) {
    const key = keys[0];

    return { ...state, [key]: action(substate) };
  }

  return {
    ...state,
    [key]: drill(substate || {}, action, keys.slice(1))
  };
};

export default function split(action, ...keys) {
  return state => drill(state, action, keys);
}

export function splits(...keys) {
  return actions =>
    Object.entries(actions).reduce(
      (all, [name, f]) => ({
        ...all,
        [name]: split(f, ...keys)
      }),
      {}
    );
}
