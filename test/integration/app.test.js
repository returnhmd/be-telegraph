/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* eslint no-underscore-dangle: 0 */
process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const fs = require('fs')
const path = require('path')
const server = require('../../src/app')
const faker = require('faker')

const should = chai.should()

chai.use(chaiHttp)

describe('routes testing', () => {
  describe('certain methods', () => {
    const agent = chai.request.agent(server)

    const infoForCreate = {
      title: faker.lorem.sentence(),
      author: faker.name.lastName(),
      body: faker.lorem.sentences(),
    }

    it('POST /save: Create article', done => {
      agent
        .post('/save')
        .send(infoForCreate)
        .then(res => {
          res.should.have.status(201)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('path')
          res.body.should.have.not.property('cookie')
          res.body.path.should.be.a('string')
          res.should.have.cookie('t_uuid')
        })
        .then(done)
        .catch(done)
    })

    function requestPostCreateArticle(
      articleFields,
      funcAgent = chai.request(server),
    ) {
      return funcAgent
        .post('/save')
        .send(articleFields)
        .then(res =>
          Promise.resolve({
            createdArticleId: res.body.id,
            createdArticlePath: res.body.path,
          }),
        )
    }

    it('GET /<pathArticle>: Get article after create article', done => {
      requestPostCreateArticle(infoForCreate, agent)
        .then(({ createdArticlePath }) => agent.get(`/${createdArticlePath}`))
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')

          res.body.should.have.property('_id')
          res.body.should.have.property('timestamp')
          res.body.should.have.property('title')
          res.body.should.have.property('author')
          res.body.should.have.property('body')
          res.body.should.have.property('path')

          res.body._id.should.be.a('string')
          res.body.timestamp.should.be.a('string')
          const parsedDate = Date.parse(res.body.timestamp)
          parsedDate.should.be.a('number')
          res.body.title.should.be.a('string')
          res.body.author.should.be.a('string')
          res.body.body.should.be.a('string')
          res.body.path.should.be.a('string')
        })
        .then(done)
        .catch(done)
    })

    it('POST /check: Check on can edit article by ID after it is created', done => {
      requestPostCreateArticle(infoForCreate, agent)
        .then(({ createdArticleId }) =>
          agent.post('/check').send({ id: createdArticleId }),
        )
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')

          res.body.should.have.property('can_edit')
          res.body.can_edit.should.be.true
        })
        .then(done)
        .catch(done)
    })
    it('POST /check: Check on can edit article by ID after it is created without cookie', done => {
      requestPostCreateArticle(infoForCreate)
        .then(({ createdArticleId }) =>
          chai
            .request(server)
            .post('/check')
            .send({ id: createdArticleId }),
        )
        .then(res => {
          res.body.can_edit.should.be.false
        })
        .then(done)
        .catch(done)
    })

    it('PUT /update: Update article by ID after it is created --and compare result with original', done => {
      requestPostCreateArticle(infoForCreate, agent)
        .then(({ createdArticleId }) =>
          agent.put('/update').send({
            id: createdArticleId,
            title: 'Test',
            author: 'Test',
            body: 'Test',
          }),
        )
        .then(res => {
          res.should.have.status(204)
        })
        .then(done)
        .catch(done)
    })
    it('PUT /update: Update article by ID after it is created without cookie', done => {
      requestPostCreateArticle(infoForCreate)
        .then(({ createdArticleId }) =>
          agent.put('/update').send({ id: createdArticleId, title: '123' }),
        )
        .then(res => {
          throw new Error("Shouldn't get here")
        })
        .then(done)
        .catch(error => {
          error.should.have.status(403)
          done()
        })
    })
  })
})
