const Router = require('koa-router')

const { Article } = require('../model')
const { uploadImg, randomStringCookie, randomStringFile } = require('../helper')
const { cookieKey } = require('../config')

const router = new Router()

router.get('/:articlePath', async ctx => {
  const { articlePath } = ctx.params
  const foundArticle = await Article.findOne(
    { path: articlePath },
    {},
    { select: { cookie: false } },
  )
  if (!foundArticle) ctx.throw(404)

  ctx.body = foundArticle
})

router.post('/save', async ctx => {
  const { body } = ctx.request

  let cookie = ctx.cookies.get(cookieKey)
  if (!cookie) {
    cookie = randomStringCookie()
    ctx.cookies.set(cookieKey, cookie)
  }

  const createdArticle = new Article({ ...body, cookie })
  await createdArticle.save()

  ctx.status = 201
  ctx.body = { id: createdArticle.id, path: createdArticle.path }
})

router.put('/update', async ctx => {
  const { body } = ctx.request
  const cookie = ctx.cookies.get(cookieKey)
  const article = await Article.findById(
    body.id,
    {},
    { select: { cookie: true } },
  )
  if (!cookie || !article || cookie !== article.cookie) {
    ctx.throw(403, 'Access denied')
  }
  await Article.updateOne({ _id: article.id }, body)

  ctx.status = 204
})

router.post('/check', async ctx => {
  const { body } = ctx.request

  let accessToEdit = false

  console.log('cons in /check', body)

  const { cookie } = await Article.findById(
    body.id,
    {},
    { select: { cookie: true } },
  )

  if (ctx.cookies.get(cookieKey) === cookie) accessToEdit = true

  ctx.body = { can_edit: accessToEdit }
})

router.post('/upload', async ctx => {
  const createdFilePath = await uploadImg(
    ctx.req,
    '/home/hmd/nginxfiles/imgs',
    randomStringFile(),
  )
  ctx.body = { file_path: createdFilePath }
})

module.exports = router
