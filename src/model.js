const mongoose = require('mongoose')

const { Schema } = mongoose
const { normilizeStr } = require('./helper')

const articleSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  cookie: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  body: { type: Schema.Types.Mixed, required: true, maxlength: [400] },
  path: { type: String },
})

articleSchema.post('validate', function fixLengthTitle() {
  if (this.title.length > 40) {
    this.title = `${this.title.slice(40)}...`
  }
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
