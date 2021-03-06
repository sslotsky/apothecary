[![Build Status](https://travis-ci.org/sslotsky/apothecary.svg?branch=master)](https://travis-ci.org/sslotsky/apothecary)
[![codecov](https://codecov.io/gh/sslotsky/apothecary/branch/master/graph/badge.svg)](https://codecov.io/gh/sslotsky/apothecary)

# Apothecary

Your local, friendly storekeeper. Apothecary is:

* Like redux, with less boilerplate
* What they call a "predictable state container"
* Similar to Flux/Redux, but without action types and reducers

It's pure JavaScript and dependency free, so it can be used with React or any other JS UI tools you prefer.

## Usage

In Flux, data is managed in a centralized data store, and there's a dispatcher that sends messages (usually called actions) to it, causing the store to be updated. The view layer subscribes to the store and updates when the store changes. To implement this scheme, using apothecary consists of the following elements:

1. Initializing the store with an initial state
2. Mutators that mutate the state when dispatched to the store
3. A way to subscribe to the updates that take place in the store

These are all described in turn below.

### Initialization

Declare your initial state however you see fit, and pass it into `initialize`:

```javascript
import { initialize } from 'apothecary'

const initialState = { n: 1 }

const store = initialize(initialState)
```

### Mutators

A mutator is a function that describes a change to our application state. It's usually applied as a result of a user 
.
In apothecary, a mutator is just a function that takes the current state and returns the new state. Dispatching
that mutator to the store will cause the store to update. Example:

```javascript
const increment = state => ({ ...state, n: state.n + 1 })

store.dispatch(increment)
```

This sends the `increment` message to the store which causes the mutation. Assuming that `n` was initially equal to
1, we could verify that it was incremented:

```javascript
const { n } = store.getState()    // 2
```

Conceptually, a mutator takes the ideas of actions and reducers in Redux and combines them into a single, simple abstraction.

#### Async Mutators

Some mutators will need to be asynchronous, like submitting form data to a server. You can use the `jam` function to
make your mutators asynchronous. Here's how you might use it:

```javascript
import { initialize, jam } from 'apothecary'
import api from 'APP/api'

const initialState = { n: 1 }

const increment = state => ({ ...state, n: state.n + 1 })

const incrementAsync = jam(dispatch =>
  api.increment().then(() => dispatch(increment))
)

store.dispatch(incrementAsync).then(() =>
  ...
```

Notice in the last line above: when we dispatch an async mutator, it returns a promise that we could chain to pop up
a toast notification or something similar.

#### Splitting Mutators

If your state tree gets fairly deep, it's much easier to define a mutator that only works on a small subtree, or even
a leaf, of the application state. If you're using a plain JavaScript object to represent your state, you can do that by
drilling into the application state with the `split` function. Simple example:

```javascript
import { initialize, split } from 'apothecary'

const store = initialize({ n: 1 });

const increment = split(n => n + 1, "n");

const decrement = split(n => n - 1, "n");
```

Notice that although our state is an object, we are only operating on the variable `n`. We accomplish this by passing
a list of state keys into `split` after our mutation function. These can go arbitrarily deep:

```javascript
const store = initialize({ counter: { n: 1 } });

const increment = split(n => n + 1, "counter", "n");

const decrement = split(n => n - 1, "counter", "n");
```

### Subscription

We subscribe to the store so that we can be notified whenever it mutates. The callback will be executed with the
new application state, and subscribers can then do whatever's necessary to update the display. An example in react:

```javascript
componentWillMount() {
  store.subscribe(state => this.setState(state))
}
```

Now this component will be updated every time a mutator is dispatched to the store.

#### UI Bindings

If you are using React, you can download `react-apothecary` to bind to the UI layer. This manages subscriptions to
the store and provides a mechanism to easily inject state and mutators into your components, very similar to how it's
done in `react-redux`. Here's a simple and complete example:

```javascript
import React from "react";
import { initialize, split } from "apothecary";
import { Bridge, tunnel } from "react-apothecary";

const store = initialize({ n: 1 });

const increment = () => split(n => n + 1, "n");

const decrement = () => split(n => n - 1, "n");

function Counter({ n, inc, dec }) {
  return (
    <div>
      <button onClick={dec}>-</button>{n}<button onClick={inc}>+</button>
    </div>
  );
}

const CounterApp = tunnel(state => ({ n: state.n }), {
  inc: increment,
  dec: decrement
})(Counter);

export default () => <Bridge store={store}><CounterApp /></Bridge>;
```

Note the subtle difference between the mutators shown here and the ones that we've seen:

```javascript
// regular mutator
const increment = split(n => n + 1, "n");

// higher order mutator, or "action creator"
const increment = () => split(n => n + 1, "n");
```

With `react-apothecary` you define functions that _return_ mutators. These are like action creators in redux. This is needed so that they can accept arguments. e.g.

```javascript
const updateComment = text => split(() => text, "someFormState", "comment");
```

See [the react-apothecary repo](https://github.com/sslotsky/react-apothecary) for further documentation.
