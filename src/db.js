const mongoose = require('mongoose')

const connectStr = 'mongodb://localhost/telegraph'

mongoose.connect(`${connectStr}`)

const conn = mongoose.connection

/* eslint no-console: 0 */

conn.on('open', () => {
  console.log(`Succesful connected to ${connectStr}`)
})

conn.on('error', () => {
  console.error('Error with MongoDB')
})
