'use strict';

const net = require('net');
const SimpleRetry = require('../');

let host = '10.16.75.25';
let port = 8515;

let doTcp = (cb) => {
  let socket = net.createConnection(port, host);
  socket.on('error', (error) => cb(error));
  socket.on('connect', () => cb(null, 'connect'));
  socket.on("close", () => cb("close"));
  socket.on("end", () => cb("end"));
};

let sr = new SimpleRetry({fn: doTcp, max_attempts: 10, max_delay: 3000 });

sr.on('error', (error) => console.error(`error, ${sr.isReady}`));
sr.on('finish', (result) => console.log(`${result}, ${sr.isReady}`));
sr.retry();