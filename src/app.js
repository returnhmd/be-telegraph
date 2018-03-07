const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')

const app = new Koa()

app.use(logger({}))
app.use(bodyParser({}))

app.use(async (ctx, next) => {
  ctx.body = `Hello, ${ctx}`
  await next()
})

app.listen(3000)
