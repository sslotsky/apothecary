import jam from '../src/jam';
import initialize from '../src/store';

test('allows for asynchronous actions', () => {
  const store = initialize({ n: 1 });
  const inc = state => ({ ...state, n: state.n + 1 });
  const incAsync = jam(dispatch =>
    Promise.resolve().then(() => dispatch(inc))
  );

  return store.dispatch(incAsync).then(() => {
    expect(store.getState().n).toBe(2);
  });
});

