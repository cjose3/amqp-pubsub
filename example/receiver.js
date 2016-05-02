'use strict'
const PubSub = require('../index.js')
const pubsub = new PubSub()
const queue = 'logs'
const rx = 'amqp://localhost'

console.log(queue)

pubsub.connect(rx)
pubsub.subscribe(queue, message => console.log('[+] %s', message.content.toString()))

// var amqp = require('amqplib/callback_api');
//
// amqp.connect('amqp://localhost', function(err, conn) {
//   conn.createChannel(function(err, ch) {
//     var ex = 'logs';
//
//     ch.assertExchange(ex, 'fanout', {durable: false});
//
//     ch.assertQueue('', {exclusive: true}, function(err, q) {
//       console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
//       ch.bindQueue(q.queue, ex, '');
//
//       ch.consume(q.queue, function(msg) {
//         console.log(" [x] %s", msg.content.toString());
//       }, {noAck: true});
//     });
//   });
// });
