const Router = require('koa-router')
const uuid = require('uuid/v4')

const { Article } = require('../model')
const { uploadImg } = require('../helper')

const router = new Router()

router.get('/:articlePath', async ctx => {
  try {
    const { articlePath } = ctx.params
    const [data] = await Article.find({ path: articlePath })

    ctx.body = data
  } catch (e) {
    ctx.throw(418, e.message)
  }
})

router.post('/save', async ctx => {
  try {
    const { body } = ctx.request

    let cookie = ctx.cookies.get('uuid')
    if (!cookie) {
      cookie = uuid()
      ctx.cookies.set('uuid', cookie)
    }

    const article = new Article({ ...body, cookie })
    await article.save()

    ctx.body = article
  } catch (e) {
    ctx.throw(418, e.message)
  }
})

router.put('/update', async ctx => {
  try {
    const { body } = ctx.request
    const cookie = ctx.cookies.get('uuid')
    const article = await Article.findById(
      body.id,
      {},
      { select: { cookie: true } },
    )
    if (!cookie || !article || cookie !== article.cookie) {
      throw new Error('Access denied')
    }
    ctx.body = 'all good'
  } catch (e) {
    ctx.throw(418, e.message)
  }
})

router.post('/check')

router.post('/upload', async ctx => {
  try {
    const createdFile = await uploadImg(ctx.req, '/home/hmd/nginxfiles/imgs')
    ctx.body = createdFile
  } catch (e) {
    ctx.throw(418, e.message)
  }
})

module.exports = router
