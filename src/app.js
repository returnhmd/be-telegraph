const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')

require('./db')

const r = require('./routers')

const app = new Koa()
app.keys = ['secret']

app.use(logger({}))
app.use(bodyParser({}))

app.use(r.routes())

app.listen(3000)
