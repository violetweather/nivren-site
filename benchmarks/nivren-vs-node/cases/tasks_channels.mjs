// A bounded async producer/consumer pair; JavaScript has no channels, so
// this is the idiomatic equivalent: an async queue with backpressure.
class Channel {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = [];
    this.senders = [];
    this.receivers = [];
  }

  send(value) {
    if (this.receivers.length > 0) {
      this.receivers.shift()(value);
      return Promise.resolve();
    }
    if (this.items.length < this.capacity) {
      this.items.push(value);
      return Promise.resolve();
    }
    return new Promise(resolve => this.senders.push({ value, resolve }));
  }

  receive() {
    if (this.items.length > 0) {
      const value = this.items.shift();
      if (this.senders.length > 0) {
        const sender = this.senders.shift();
        this.items.push(sender.value);
        sender.resolve();
      }
      return Promise.resolve(value);
    }
    if (this.senders.length > 0) {
      const sender = this.senders.shift();
      sender.resolve();
      return Promise.resolve(sender.value);
    }
    return new Promise(resolve => this.receivers.push(resolve));
  }
}

const channel = new Channel(64);
const producer = (async () => {
  for (let index = 0; index < 20000; index += 1) {
    await channel.send(index);
  }
  return 20000;
})();

let total = 0;
for (let received = 0; received < 20000; received += 1) {
  total += await channel.receive();
}
await producer;
console.log(total);
