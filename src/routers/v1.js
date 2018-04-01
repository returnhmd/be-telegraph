const Router = require('koa-router')

const { Article } = require('../model')
const {
  uploadImg,
  randomStringCookie,
  randomStringFile,
  readAndSendImg,
} = require('../utils')
const { cookieKey } = require('../config')

const router = new Router()

router.get('/:articlePath', async ctx => {
  const { articlePath } = ctx.params
  const foundArticle = await Article.findOne({ path: articlePath })
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

  const createdArticle = new Article(
    {
      ...body,
      cookie,
    },
    { versionKey: false },
  )
  await createdArticle.save()

  ctx.status = 201
  ctx.body = { path: createdArticle.path }
})

router.put('/update', async ctx => {
  const { body } = ctx.request

  if (!body.id) throw new Error('Field `id` is required')

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

  if (!body.id) throw new Error('Field `id` is required')

  let accessToEdit = false

  const article = await Article.findById(
    body.id,
    {},
    { select: { cookie: true } },
  )

  if (!article) ctx.throw(404)

  if (ctx.cookies.get(cookieKey) === article.cookie) accessToEdit = true

  ctx.body = { can_edit: accessToEdit }
})

router.post('/upload', async ctx => {
  const createdFilePath = await uploadImg(ctx.req, randomStringFile())
  ctx.status = 201
  ctx.body = { file_path: createdFilePath }
})

router.get('/imgs/:imgName', async ctx => {
  const { imgName } = ctx.params
  // console.log(imgName)

  // need add gzip
  const imageStream = readAndSendImg(imgName)
  ctx.set({ 'Content-Type': `image/${imgName.split('.')[1]}` })
  ctx.body = imageStream
})

module.exports = router
