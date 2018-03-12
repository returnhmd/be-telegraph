const Router = require('koa-router')
const v1 = require('./v1')

const api = new Router()

api.use('/v1', v1.routes())

module.exports = api
