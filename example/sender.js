'use strict'
const PubSub = require('../index.js')
const pubsub = new PubSub()
const queue = 'update issue'
const tx = 'amqp://localhost'
const message = { o: process.argv[2] }

console.log(queue)
pubsub.connect(tx)
pubsub.publish(queue, message)
  .then(sent => console.log('sent', sent))
  .catch(err => console.error(err))
  .finally(() => {
    setTimeout(() => {
      pubsub.close()
      process.exit(0)
    }, 500)
  })
