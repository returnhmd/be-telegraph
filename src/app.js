const Koa = require('koa')
const views = require('koa-views')
const httpLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const helmet = require('koa-helmet')
const koaCors = require('koa-cors')
const staticFiles = require('koa-static')

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

app.use(staticFiles(config.staticPath))
app.use(views(config.viewsPath, config.viewsOpts))

app.use(helmet(config.helmet))

// !!!need to swap on the custom midleware!!!
app.use(koaCors(config.koaCors))
//

app.use(bodyParser(config.bodyParser))

app.use(r.routes())
app.use(r.allowedMethods())

module.exports = app.listen(config.port, () => {
  logger.info(`App listening on port: ${config.port}`)
})
