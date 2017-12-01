const drill = (state, action, keys) => {
  const key = keys[0];

  if (keys.length === 1) {
    const key = keys[0];

    return { ...state, [key]: action(state[key]) };
  }

  return {
    ...state,
    [key]: drill(state[key], action, keys.slice(1))
  };
};

export default function split(action, ...keys) {
  return state => drill(state, action, keys);
};
