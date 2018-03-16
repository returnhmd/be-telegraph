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
  describe('full chain requests', () => {
    const agent = chai.request.agent(server)

    let createdPath
    let articleForCompareAfterUpdate

    it('POST create Article', done => {
      agent
        .post('/v1/save')
        .send({
          title: faker.lorem.sentence(),
          author: faker.name.firstName(),
          body: faker.lorem.sentences(),
        })
        .then(res => {
          res.should.have.status(201)
          res.should.be.json
          res.body.should.be.a('object')
          res.body.should.have.property('id')
          res.body.should.have.property('path')
          res.body.id.should.be.a('string')
          res.body.path.should.be.a('string')

          res.should.have.cookie('t_uuid')

          createdPath = res.body.path
          articleForCompareAfterUpdate = res.body
        })
        .then(done)
        .catch(done)
    })

    let gotId
    it('GET Article by path', done => {
      agent
        .get(`/v1/${createdPath}`)
        .then(res => {
          res.should.have.status(200)
          res.should.be.json
          res.body.should.be.a('object')

          res.body.should.have.property('_id')
          res.body.should.have.property('title')
          res.body.should.have.property('author')
          res.body.should.have.property('body')
          res.body.should.have.property('timestamp')
          res.body.should.have.property('path')

          res.body._id.should.be.a('string')
          res.body.title.should.be.a('string')
          res.body.author.should.be.a('string')
          res.body.body.should.be.a('string')
          res.body.timestamp.should.be.a('string')
          res.body.path.should.be.a('string')

          gotId = res.body.id
        })
        .then(done)
        .catch(done)
    })

    it('POST for check can edit the Article', done => {
      agent
        .post('/v1/check')
        .send({ keki: '123', id: gotId })
        .then(res => {
          console.log('>>>>>>', gotId)
        })
        .then(done)
        .catch(done)
    })
  })
})

// it('POST check on can edit Article', done => {
//   agent
//     .post('/v1/check')
//     .send({ id: gotId })
//     .then(res => {
//       res.should.have.status(200)
//       res.should.be.json
//       res.body.should.be.a('object')

//       res.body.can_edit.should.be.true

//       res.should.have.property('can_edit')
//     })
//     .then(done)
//     .catch(done)
// })

// it('PUT Article by path with cookie', done => {
//   agent
//     .put(`/v1/update`)
//     .send({
//       id: gotId,
//       title: faker.lorem.sentence(),
//       body: faker.lorem.sentences(),
//     })
//     .then(res => {
//       res.should.have.status(204)
//     })
//     .then(done)
//     .catch(done)
// })
