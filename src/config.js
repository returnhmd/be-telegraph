const NODE_ENV = process.env.NODE_ENV || 'development'

const isProd = NODE_ENV === 'production'
const isTest = NODE_ENV === 'test'
const isDev = NODE_ENV === 'development'

module.exports = {
  port: process.env.PORT || 3000,
  mongoConnect: process.env.MONGO_PORT || 'mongodb://localhost/telegraph',

  env: {
    isProd,
    isDev,
    isTest,
  },

  appKeys: ['secret'],
  cookieKey: 't_uuid',
  bodyParser: {},
  logger: {},
}
