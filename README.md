# async-fifo-queue
Simple async FIFO queue implementation in modern Javascript with 0 dependency.

## Installation

* npm

  `npm install async-fifo-queue`

* yarn

  `yarn add async-fifo-queue`
  
## Usage

```javascript
const { Queue } = require("async-fifo-queue");

// if no size specified, the queue size is infinite
const q = new Queue();

// put an object into the queue
await q.put("something");
await q.put("foobar");

// get the object
const item1 = await q.get(); // item1 === "something"
const item2 = await q.get(); // item2 === "foobar"

// simulating someone adding an item to the queue 1 sec later
setTimeout(() => q.put("blabla"), 1000);
// will wait 1 sec until the item is added into the queue
const item3 = await q.get(); // item3 === "blabla"

// put an object without waiting, will raise QueueFull Error if the queue is already full
q.putNowait("bar");
// get an object without waiting, will raise QueueEmpty Error if the queue is empty
const item4 = q.getNowait();
```

The Queue object also has additionnal properties:
* `currSize` returns the current size of the queue
* `isEmpty()` returns true if the queue is empty
* `isFull()` returns true if the queue is full

## Tests

This project uses [Jest](https://github.com/facebook/jest).

`npm run test`
