'use strict'

const amqplib = require('amqplib')

class PubSub {

  constructor() {
    this._rx = null
    this._tx = null
    this._rxConnection = null
    this._txConnection = null
  }

  /**
   * @method connect
   * @description Connects to a AMQP server specified by a URL for both transmition and reception
   * @author Antonio Saad
   */
  connect(url) {
    return this.connectForRx(url).connectForTx(url)
  }

  /**
   * @method connectForRx
   * @description Connects to a AMQP server specified by a URL just for reception (listening messages)
   * @author Antonio Saad
   */
  connectForRx(url) {
    this._rx = (typeof url === 'string') ? amqplib.connect(url) : url
    return this
  }

  /**
   * @method connectForTx
   * @description Connects to a AMQP server specified by a URL just for transmition (publish messages)
   * @author Antonio Saad
   */
  connectForTx(url) {
    this._tx = (typeof url === 'string') ? amqplib.connect(url) : url
    return this
  }

  /**
   * @method close
   * @description close all connections
   * @author Carlos Marcano
   */
  close() {
    if (this._txConnection !== null) {
      this._txConnection.close()
      this._txConnection = null
    }
    if (this._rxConnection !== null) {
      this._rxConnection.close()
      this._rxConnection = null
    }
  }

  /**
   * @method publish
   * @description Publish a message to a specific exchange
   * @author Antonio Saad
   */
  publish(exchange, message) {
    if (this._tx === null) throw new Error('No connection available for publishing')
    return this._tx.then(connection => {
      this._txConnection = connection
      return this._txConnection.createChannel()
    })
      .then(channel => {
        const content = this._buildContent(message)
        channel.assertExchange(exchange, 'fanout', {durable: false})
        return channel.publish(exchange, '', content)
      })
  }

  /**
   * @method subscribe
   * @description Subscribe to a specific exchange and attends the incoming messages in the Promise returned
   * @author Antonio Saad
   */
  subscribe(exchange, cb) {
    if (this._rx === null) throw new Error('No connection available for consuming')
    return this._rx.then(connection => {
      this._rxConnection = connection
      return this._rxConnection.createChannel()
    })
      .then(channel => {
        channel.assertExchange(exchange, 'fanout', {durable: false})
        return [channel, channel.assertQueue('', {exclusive: true})]
      })
      .then(results => {
        const channel = results[0]
        const queue = results[1]
        channel.bindQueue(queue.queue, exchange, '')
        return channel.consume(queue.queue, message => cb(this._getContent(message)))
      })
  }


  /**
   * @method _buildContent
   * @description build a content to send
   * @author Carlos Marcano
   */
  _buildContent(message) {
    const type = typeof message
    if (type === 'string' || type === 'array') return new Buffer(message)
    if (type === 'object') return new Buffer(JSON.stringify(message))
    return undefined
  }

  /**
   * @method _getContent
   * @description
   * @author Carlos Marcano
   */
  _getContent(message) {
    const str = message.content.toString()
    try {
      return JSON.parse(str)
    } catch (e) {
      return str
    }
  }

}

module.exports = PubSub
