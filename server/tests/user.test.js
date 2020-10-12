const app = require('../app')
const request = require('supertest')
const {User} = require('../models')

const user1 = {
  email: 'riankarya@mail.com',
  password: 'riankarya'
}

beforeAll(async() => {
  await User.destroy({where: {role: 'customer'}})
  await User.create(user1)
})

afterAll(async done => {
  done();
});

describe('User Routes', () => {
  describe('POST /login', () => {
    test('Success should return status 201 and user object', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: 'riankarya@mail.com',
          password: 'riankarya'
        })
        .expect(200)
        .end((err, res) => {
          if(err) {
            done(err);
          } else {
            expect(res.body).toHaveProperty('id')
            expect(res.body).toHaveProperty('msg', 'berhasil login')
            expect(res.body).toHaveProperty('token')
            done();
          }
        })
        })
    test('Fail email not registered should return status 403 and error object', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: 'rian@mail.com',
          password: 'rian'
        })
        .expect(403)
        .end((err, res) => {
          if(err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual(['invalid email or password'])
            done()
          }
        })
    })
    test('Fail wrong password should return status 403 and error object', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: 'riankarya@mail.com',
          password: 'rian'
        })
        .expect(403)
        .end((err, res) => {
          if(err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual(['invalid email or password'])
            done()
          }
        })
    })
    test('Fail null email should return status 422 and error object', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: '',
          password: 'rian'
        })
        .expect(422)
        .end((err, res) => {
          if(err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual(['email tidak boleh kosong'])
            done()
          }
        })
    })
    test('Fail null password should return status 422 and error object', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: 'riankarya@mail.com',
          password: ''
        })
        .expect(422)
        .end((err, res) => {
          if(err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual(['password tidak boleh kosong'])
            done()
          }
        })
    })
    test('Fail null email and password should return status 422 and error object', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: '',
          password: ''
        })
        .expect(422)
        .end((err, res) => {
          if(err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual(['email tidak boleh kosong', 'password tidak boleh kosong'])
            done()
          }
        })
    })
  })
})