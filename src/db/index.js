const mongoose = require('mongoose')
const config = require('../config')
const logger = require('../log')

const connectStr = config.mongoConnect

mongoose.connect(`${connectStr}`)

if (config.env.isDev) mongoose.set('debug', true)

const conn = mongoose.connection

conn.on('open', () => {
  logger.info(`Succesful connected to ${connectStr}`)
})

conn.on('error', ({ message }) => {
  logger.error(message)
})
