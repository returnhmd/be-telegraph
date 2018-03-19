const Koa = require('koa')
const httpLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const helmet = require('koa-helmet')

require('./db')

const r = require('./routers')
const { errorCatcher } = require('./middlewares')
const config = require('./config')
const logger = require('./log')

const app = new Koa()
app.keys = config.appKeys

if (!config.env.isTest) {
  app.use(httpLogger(config.httpLogger))
  app.use(errorCatcher(logger))
} else {
  app.use(errorCatcher())
}

app.use(helmet(config.helmet))
app.use(bodyParser(config.bodyParser))

app.use(r.routes())
app.use(r.allowedMethods())

module.exports = app.listen(config.port, () => {
  logger.info(`App listening on port: ${config.port}`)
})

// const https = require('https')
// https.createServer(app.callback()).listen(3000)
