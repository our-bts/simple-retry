# Simple Retry

A simple utility for retrying custom operation until succeed.

## Install

```sh
$ npm install simple-retry
```

## How to Use

```js
const SimpleRetry = require('../');

let doSomething = (cb) => {
  //do anything you want
  if(error){
    cb(error);
  }else{
    cb(null, result);
  }
};

let sr = new SimpleRetry({fn: doSomething, max_attempts: 10, max_delay: 3000 });

sr.on('error', (error) => console.error(`${error}, ${sr.isReady}`));
sr.on('finish', (result) => console.log(`${result}, ${sr.isReady}`));
sr.retry();
```

## Operation

* fn: a function for your operation.
* factor: the exponential factor to calculate the delay time. The current delay time = last delay * factor.
* max_attempts: the max retry amount.
* max_delay: the max milliseconds between two retries.

## License

MIT