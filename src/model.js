const mongoose = require('mongoose')

const { Schema } = mongoose
const { normilizeStr } = require('./utils')

const articleSchema = new Schema({
  author: { type: String, required: true, trim: true, maxlength: [40] },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [300],
    get: v => (v.length > 200 ? `${v.slice(200)}...` : v),
  },
  body: {
    type: Schema.Types.Mixed,
    required: true,
  },
  path: { type: String },
  cookie: { type: String, required: true, select: false },
  timestamp: { type: Date, default: Date.now },
})

articleSchema.pre('save', function genPathArticle(next) {
  // eslint-disable-next-line
  Article.find({
    title: this.title,
  })
    .count()
    .then(coincidences => {
      this.path = normilizeStr(this.title, this.timestamp, coincidences)
    })
    .then(next)
    .catch(next)
})

const Article = mongoose.model('Article', articleSchema)

module.exports = { Article }
