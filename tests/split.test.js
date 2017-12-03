import split from '../src/split';
import initialize from '../src/store';

test('operates on a subtree', () => {
  const store = initialize({ pagination: { page: 1 } });
  const next = split(page => page + 1, 'pagination', 'page');

  const state = store.dispatch(next);

  expect(state.pagination.page).toBe(2);
});

test('it fills in missing keys along the path', () => {
  const store = initialize({});
  const next = split((page = 7) => page + 1, 'pagination', 'page');

  const state = store.dispatch(next);

  expect(state.pagination.page).toBe(8);
});
