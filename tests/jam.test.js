import jam from '../src/jam';
import initialize from '../src/store';

test('', () => {
  const store = initialize({ n: 1 });
  const inc = state => ({ ...state, n: state.n + 1 });
  const incAsync = jam(dispatch =>
    Promise.resolve().then(() => dispatch(inc))
  );

  const state = store.dispatch(incAsync).then(() => {
    expect(state.n).toBe(2);
  });
});

