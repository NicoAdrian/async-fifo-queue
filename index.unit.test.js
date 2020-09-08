const { Queue, QueueFull, QueueEmpty } = require('./index.js');

const sleep = s => new Promise(r => setTimeout(r, s * 1000));

test('queue max size is zero (infinite) by default', () => {
  const q = new Queue();
  expect(q.maxSize).toBe(0);
});

test('nowait put and get', () => {
  const q = new Queue();
  const itemValue = 'hey';
  q.putNowait(itemValue);
  expect(q.currSize).toBe(1);
  const item = q.getNowait();
  expect(item).toBe(itemValue);
  expect(q.currSize).toBe(0);
});

test('correct fifo', () => {
  const q = new Queue();
  q.putNowait('a');
  q.putNowait('b');
  const item1 = q.getNowait();
  const item2 = q.getNowait();
  expect(item1).toBe('a');
  expect(item2).toBe('b');
});

test('error when queue full with putNowait', () => {
  const q = new Queue(2);
  q.putNowait('hey1');
  q.putNowait('hey2');
  expect(() => q.putNowait('hey3')).toThrowError(QueueFull);
});

test('error when queue empty with getNowait', () => {
  const q = new Queue();
  expect(() => q.getNowait()).toThrowError(QueueEmpty);
});

test('don\'t block event loop', async () => {
  const q = new Queue(1);
  const items = ['hey1', 'hey2', 'hey3'];
  const results = [];
  const loop = setInterval(async () => {
    const item = await q.get();
    results.push(item);
  }, 100);
  items.map(async (item) => {
    await q.put(item);
  });
  await sleep(0.6);
  expect(results).toEqual(items);
  clearInterval(loop);
});

test('queue blocks when full', async () => {
  const q = new Queue();
  let item1 = null;
  let item2 = null;
  setTimeout(async () => {
    item1 = await q.get();
    item2 = await q.get();
  }, 0);
  q.putNowait('hey');
  await sleep(0.5);
  expect(item1).toBe('hey');
  expect(item2).toBe(null);
});

test('queue blocks when empty', async () => {
  const q = new Queue();
  let item = null;
  setTimeout(async () => {
    item = await q.get();
  }, 0);
  await sleep(0.5);
  expect(item).toBe(null);
});
