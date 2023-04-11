const logEvents = require('./logEvents')

const EventEmitter = require('events')

class MyEmitter extends EventEmitter {};

// initialize object
const myEmitter = new MyEmitter();

//add listerner for the log events
myEmitter.on('log', (msg) => logEvents(msg));

setTimeout(() => {
    //Emit event
    myEmitter.emit('log', 'Log event emitted');
}, 2000)