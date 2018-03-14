const mongoose = require('mongoose')
const latinize = require('latinize')

const { Schema } = mongoose

const articleSchema = new Schema({
  title: { type: String, required: true, maxlength: [400, 'Too long title'] },
  author: { type: String, required: true },
  cookie: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  body: { type: Schema.Types.Mixed, required: true, maxlength: [400] },
  path: { type: String },
})

articleSchema.pre('validate', function fixLengthTitle() {
  if (this.title.length > 40) {
    this.title = `${this.title.slice(40)}...`
  }
})

articleSchema.pre('validate', function genPathArticle(next) {
  const pathArr = []

  let newTitle = latinize(this.title)
  newTitle = newTitle
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/ /g, '-')
  pathArr.push(newTitle)

  const [month, day] = this.timestamp
    .toString()
    .split(' ')
    .slice(1, 3)
  pathArr.push(day, month)

  // eslint-disable-next-line
  Article.find({
    title: this.title,
  })
    .count()
    .then(coincidences => {
      if (coincidences) pathArr.push(coincidences)
      this.path = pathArr.join('-')
    })
    .then(next)
    .catch(next)
})

const Article = mongoose.model('Article', articleSchema)

module.exports = { Article }
