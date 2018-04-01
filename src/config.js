const path = require('path')

const NODE_ENV = process.env.NODE_ENV || 'development'

const isProd = NODE_ENV === 'production'
const isTest = NODE_ENV === 'test'
const isDev = NODE_ENV === 'development'

module.exports = {
  port: process.env.PORT || 3000,
  // mongodb://returnhmd:aa2325he@ds141328.mlab.com:41328/telegraph'
  mongoConnect: process.env.MONGO_URL || 'mongodb://localhost/telegraph',

  pathToSaveImgs: process.env.SAVE_IMGS_PATH || path.resolve('imgs'),

  env: {
    isProd,
    isDev,
    isTest,
  },

  appKeys: ['secret'],
  cookieKey: 't_uuid',
  bodyParser: {},
  httpLogger: {},
  koaCors: {
    'Access-Control-Allow-Origin': 'google.com',
    'Access-Control-Allow-Credentials': true,
  },
  helmet: {},
}
