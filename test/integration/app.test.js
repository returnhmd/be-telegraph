/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* eslint no-underscore-dangle: 0 */
process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
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

    it('POST /v1/save: Create article', done => {
      agent
        .post('/v1/save')
        .send(infoForCreate)
        .then(res => {
          res.should.have.status(201)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('id')
          res.body.should.have.property('path')
          res.body.should.have.not.property('cookie')
          res.body.id.should.be.a('string')
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
        .post('/v1/save')
        .send(articleFields)
        .then(res =>
          Promise.resolve({
            createdArticleId: res.body.id,
            createdArticlePath: res.body.path,
          }),
        )
    }

    it('GET /v1/<pathArticle>: Get article after create article', done => {
      requestPostCreateArticle(infoForCreate, agent)
        .then(({ createdArticlePath }) =>
          agent.get(`/v1/${createdArticlePath}`),
        )
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

    it('POST /v1/check: Check on can edit article by ID after it is created', done => {
      requestPostCreateArticle(infoForCreate, agent)
        .then(({ createdArticleId }) =>
          agent.post('/v1/check').send({ id: createdArticleId }),
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
    it('POST /v1/check: Check on can edit article by ID after it is created without cookie', done => {
      requestPostCreateArticle(infoForCreate)
        .then(({ createdArticleId }) =>
          chai
            .request(server)
            .post('/v1/check')
            .send({ id: createdArticleId }),
        )
        .then(res => {
          res.body.can_edit.should.be.false
        })
        .then(done)
        .catch(done)
    })

    it('PUT /v1/update: Update article by ID after it is created --and compare result with original', done => {
      requestPostCreateArticle(infoForCreate, agent)
        .then(({ createdArticleId }) =>
          agent.put('/v1/update').send({
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
    it('PUT /v1/update: Update article by ID after it is created without cookie', done => {
      requestPostCreateArticle(infoForCreate)
        .then(({ createdArticleId }) =>
          agent.put('/v1/update').send({ id: createdArticleId, title: '123' }),
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
