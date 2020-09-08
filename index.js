class QueueFull extends Error {
  constructor(...params) {
    super(...params);
    this.name = 'QueueFull';
  }
}

class QueueEmpty extends Error {
  constructor(...params) {
    super(...params);
    this.name = 'QueueEmpty';
  }
}

class Queue {
  constructor(maxSize) {
    this.maxSize = maxSize || 0;
    this._getters = [];
    this._putters = [];
    this._items = [];
  }

  get currSize() {
    return this._items.length;
  }

  isFull() {
    if (this.maxSize === 0) {
      return false;
    } else {
      return this._items.length >= this.maxSize;
    }
  }	

  isEmpty() {
    return this._items.length === 0;
  }

  _put(item) {
    this._items.unshift(item);
  }

  _get() {
    return this._items.pop();
  }

  _wakeUp(waiters) {
    if (waiters.length > 0) {
      waiters.pop()();
    }
  }

  putNowait(item) {
    if(this.isFull()) {
      throw new QueueFull();
    }
    this._put(item);
    this._wakeUp(this._getters);
  }

  getNowait() {
    if (this.isEmpty()) {
      throw new QueueEmpty();
    }
    const item = this._get();
    this._wakeUp(this._putters);
    return item;
  }

  async put(item) {
    if (this.isFull()) {
      await new Promise(r => this._putters.unshift(r));
    }
    this.putNowait(item);
  }

  async get() {
    if (this.isEmpty()) {
      await new Promise(r => this._getters.unshift(r));
    }
    return this.getNowait();
  }
}

module.exports.Queue = Queue;
module.exports.QueueFull = QueueFull;
module.exports.QueueEmpty = QueueEmpty;
