const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')

require('./db')

const r = require('./routers')
const { errorCatcher } = require('./middlewares')
const config = require('./config')

const app = new Koa()
app.keys = config.appKeys

app.use(logger(config.logger))
app.use(bodyParser(config.bodyParser))

app.use(errorCatcher())
app.use(r.routes())

app.listen(config.port)
