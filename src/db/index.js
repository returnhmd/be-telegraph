const mongoose = require('mongoose')
const config = require('../config')

const connectStr = config.mongoConnect

mongoose.connect(`${connectStr}`)

if (config.env.isDev) mongoose.set('debug', true)

const conn = mongoose.connection

/* eslint no-console: 0 */

conn.on('open', () => {
  console.log(`Succesful connected to ${connectStr}`)
})

conn.on('error', () => {
  console.error('Error with MongoDB')
})
