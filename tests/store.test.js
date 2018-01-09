import initialize from "../src/store";

test("subscribers notified on update", () => {
  const store = initialize({ n: 1 });
  const inc = state => ({ ...state, n: state.n + 1 });
  const callback = jest.fn();

  store.subscribe(callback);
  store.dispatch(inc);

  expect(callback.mock.calls.length).toBe(1);
});

test("ability to unsubscribe", () => {
  const store = initialize({ n: 1 });
  const inc = state => ({ ...state, n: state.n + 1 });
  const callback = jest.fn();

  const cancel = store.subscribe(callback);
  store.dispatch(inc);

  cancel();
  store.dispatch(inc);

  expect(callback.mock.calls.length).toBe(1);
});

test("it returns the initial state", () => {
  const initialState = { n: 1 };
  const store = initialize(initialState);
  expect(store.getState()).toBe(initialState);
});
