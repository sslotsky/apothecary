import { reduce, reductive } from "../src/reduce";
import initialize from "../src/store";

describe("reductive", () => {
  it("allows for flux style actions", () => {
    const store = initialize({ counter: { n: 1 } }, reductive());
    const counter = (n, action) => {
      if (action.type === "increment") {
        return n + 1;
      }

      return n;
    };

    const inc = () => ({ type: "increment" });
    const actions = reduce(counter, "counter", "n")({ inc });

    const state = store.dispatch(actions.inc());
    expect(state.counter.n).toBe(2);
  });

  it("passes along regular actions", () => {
    const store = initialize({ n: 1 }, reductive());
    const inc = state => ({ ...state, n: state.n + 1 });
    const state = store.dispatch(inc);
    expect(state.n).toBe(2);
  });

  it("invokes the provided callback appropriately", () => {
    const initialState = { n: 1 };
    const endState = { n: 2 };
    const callback = jest.fn();
    const store = initialize(initialState, reductive(callback));
    const payload = { type: "increment" };
    const inc = () => payload;
    const actions = reduce(() => endState)({ inc });
    const state = store.dispatch(actions.inc());
    expect(callback).toHaveBeenCalledWith(payload, initialState, endState);
  });
});
