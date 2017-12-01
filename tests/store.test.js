import initialize from '../src/store';

test('subscribers notified on update', () => {
  const store = initialize({ n: 1 });
  const inc = state => ({ ...state, n: state.n + 1 });
  const callback = jest.fn();

  store.subscribe(callback);
  store.dispatch(inc);

  expect(callback.mock.calls.length).toBe(1);
});
