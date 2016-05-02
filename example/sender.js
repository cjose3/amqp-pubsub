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
