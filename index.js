'use strict';

const events = require("events");
const util = require('util');
const debug = util.debuglog('simple-retry');

class SimpleRetry {
  constructor(option) {
    option = option || {};
    if (!isFuction(option.fn)) {
      throw new Error('please provide retry function.');
    }
    this.fn = option.fn;
    this.retry_delay = 150;
    this.current_delay = this.retry_delay;
    this.retry_backoff = option.factor || 1.7;
    this.attempts = 0;
    this.isReady = false;
    this.max_attempts = option.max_attempts;
    this.max_delay = option.max_delay;
    this.retry_timer = null;
  }

  retry() {
    let self = this;
    self.attempts++;
    debug(`retry for ${self.attempts} attemps.`);
    self.fn((error, result) => {
      if (self.retry_timer) {
        return;
      }
      if (error) {
        self.emit('error', error);
        self.current_delay = Math.floor(self.current_delay * self.retry_backoff);
        self.isReady = false;
        if (self.max_delay && self.current_delay > self.max_delay) {
          self.current_delay = self.max_delay;
        }
        if (self.max_attempts && self.attempts >= self.max_attempts) {
          debug(`retry max ${self.attempts} attemps.`);
          self.current_delay = self.retry_delay;
          self.attempts = 0;
          self.emit('finish', 'retry max');
        } else {
          debug(`retry in ${self.current_delay}ms.`);
          self.retry_timer = setTimeout(() => {
            self.retry_timer = null;
            self.retry();
          }, self.current_delay);
        }
      } else {
        self.current_delay = self.retry_delay;
        self.retry_timer = null;
        self.attempts = 0;
        self.isReady = true;
        self.emit('finish', result);
      }
    })
  }
}

util.inherits(SimpleRetry, events.EventEmitter);

let isFuction = (fn) => typeof fn == 'function' || false;

module.exports = SimpleRetry;