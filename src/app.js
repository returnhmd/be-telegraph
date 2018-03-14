const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')

require('./db')

const r = require('./routers')
const { errorCatcher } = require('./middlewares')

const app = new Koa()
app.keys = ['secret']

app.use(logger({}))
app.use(errorCatcher())
app.use(bodyParser({}))

app.use(r.routes())

app.listen(3000)
