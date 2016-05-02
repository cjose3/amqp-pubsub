'use strict'
const PubSub = require('../index.js')
const pubsub = new PubSub()
const queue = 'logs'
const message = { data: process.argv[2] }
const tx = 'amqp://localhost'

console.log(queue)

pubsub.connect(tx)
pubsub.publish(queue, process.argv[2])
  .then(sent => console.log('sent', sent))
  .catch(err => console.error(err))
  .finally(() => {
    setTimeout(() => {
      pubsub.close()
      process.exit(0)
    }, 500)
  })

// var amqp = require('amqplib/callback_api');
//
// amqp.connect('amqp://localhost', function(err, conn) {
//   conn.createChannel(function(err, ch) {
//     var ex = 'logs';
//     var msg = process.argv.slice(2).join(' ') || 'Hello World!';
//
//     ch.assertExchange(ex, 'fanout', {durable: false});
//     ch.publish(ex, '', new Buffer(msg));
//     console.log(" [x] Sent %s", msg);
//   });
//
//   setTimeout(function() { conn.close(); process.exit(0) }, 500);
// });
