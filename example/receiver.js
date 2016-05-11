'use strict'
const PubSub = require('../index.js')
const pubsub = new PubSub()
const queue = 'update issue'
const rx = 'amqp://localhost'

console.log(queue)

pubsub.connect(rx)
pubsub.subscribe(queue, message => {
  console.log('[+]', typeof message)
  console.log(message)
})
