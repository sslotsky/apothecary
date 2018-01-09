import { reduce, reductive } from "../src/reduce";
import initialize from "../src/store";

describe("reductive", () => {
  it("allows for flux style actions", () => {
    const store = initialize({ n: 1 }, reductive());
    const counter = (state, action) => {
      if (action.type === "increment") {
        return { ...state, n: state.n + 1 };
      }

      return state;
    };

    const inc = () => ({ type: "increment" });
    const actions = reduce(counter)({ inc });

    const state = store.dispatch(actions.inc());
    expect(state.n).toBe(2);
  });

  it("passes along regular actions", () => {
    const store = initialize({ n: 1 }, reductive());
    const inc = state => ({ ...state, n: state.n + 1 });
    const state = store.dispatch(inc);
    expect(state.n).toBe(2);
  });
});
