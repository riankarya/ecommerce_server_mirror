const app = require('../app')
const request = require('supertest')
const { User, Product } = require('../models')
const { generateToken } = require('../helpers/jwt')

const user1 = {
  email: 'riankarya@mail.com',
  password: 'riankarya'
}

const product1 = {
  name: 'kursi gaming',
  image_url: 'https://ecs7.tokopedia.net/img/cache/700/product-1/2019/1/8/5174415/5174415_a53fbb23-c454-45cc-896e-5330389ebf5d.jpg',
  price: 3000000,
  stock: 5
}

const editProduct1 = {
  name: 'kursi gaming',
  image_url: 'https://ecs7.tokopedia.net/img/cache/700/product-1/2019/1/8/5174415/5174415_a53fbb23-c454-45cc-896e-5330389ebf5d.jpg',
  price: 2500000,
  stock: 3
}

let userAdmin = null
let userAdminToken = null
let userCustomer = null
let userCustomerToken = null
let product = null
let productId = null

beforeAll(async () => {
  await Product.destroy({ where: {}})
  await User.destroy({ where: {role: 'customer'} })
  userAdmin = await User.findOne({where: {role: 'admin'}})
  userAdminToken = generateToken({id: userAdmin.id, email: userAdmin.email, role: userAdmin.role})
  await User.create(user1)
  userCustomer = await User.findOne({where: {role: 'customer'}})
  userCustomerToken = generateToken({id: userCustomer.id, email: userCustomer.email, role: userCustomer.role})
  //  create user admin
  await Product.create(product1)
  product = await Product.findAll()
  productId = product[0].dataValues.id
  //  create user customer
  //  get token from login user admin
  //  get token from login user customer
})

describe('Product Routes', () => {
  describe('POST /products', () => {
    test('Success should return status 201 and product object', (done) => {
      request(app)
        .post('/products')
        .set({
          token: userAdminToken
        })
        .send(product1)
        .expect(201)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('data')
            expect(res.body).toHaveProperty('msg', 'sukses nambah produk')
            done()
          }
        })
    })
    test('Fail null access token should return status 401 and error object', (done) => {
      request(app)
        .post('/products')
        .set({
          token: ''
        })
        .send(product1)
        .expect(401)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual(['Not Authenticated'])
            done()
          }
        })
    })
    test('Fail customer access token should return status 403 and error object', (done) => {
      request(app)
        .post('/products')
        .set({
          token: userCustomerToken
        })
        .send(product1)
        .expect(403)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual(['Admin Only'])
            done()
          }
        })
    })
    test('Fail null input should return status 422 and error object', (done) => {
      request(app)
        .post('/products')
        .set({
          token: userAdminToken
        })
        .send({
          name: '',
          image_url: '',
          price: '',
          stock: ''
        })
        .expect(422)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual([
              'name harus diisi',
              'image_url harus diisi',
              'price harus diisi',
              'stock harus diisi'
            ])
            done()
          }
        })
    })
    test('Fail minus stock input should return status 422 and error object', (done) => {
      request(app)
        .post('/products')
        .set({
          token: userAdminToken
        })
        .send({
          name: 'kursi gaming',
          image_url: 'https://ecs7.tokopedia.net/img/cache/700/product-1/2019/1/8/5174415/5174415_a53fbb23-c454-45cc-896e-5330389ebf5d.jpg',
          price: 3000000,
          stock: -5
        })
        .expect(422)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual([
              'stock tidak boleh negatif'
            ])
            done()
          }
        })
    })
    test('Fail minus price input should return status 422 and error object', (done) => {
      request(app)
        .post('/products')
        .set({
          token: userAdminToken
        })
        .send({
          name: 'kursi gaming',
          image_url: 'https://ecs7.tokopedia.net/img/cache/700/product-1/2019/1/8/5174415/5174415_a53fbb23-c454-45cc-896e-5330389ebf5d.jpg',
          price: -3000000,
          stock: 5
        })
        .expect(422)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual([
              'price tidak boleh negatif'
            ])
            done()
          }
        })
    })
    test('Fail worng data type input should return status 422 and error object', (done) => {
      request(app)
        .post('/products')
        .set({
          token: userAdminToken
        })
        .send({
          name: 'kursi gaming',
          image_url: 'https://ecs7.tokopedia.net/img/cache/700/product-1/2019/1/8/5174415/5174415_a53fbb23-c454-45cc-896e-5330389ebf5d.jpg',
          price: 'ahiw',
          stock: 'ihaw'
        })
        .expect(422)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual([
              'price hanya boleh menggunakan angka',
              'stock hanya boleh menggunakan angka'
            ])
            done()
          }
        })
    })
  })
  describe('PUT /products/:id', () => {
    test('Success should return status 200 and product object', (done) => {
      request(app)
        .put(`/products/${productId}`)
        .set({
          token: userAdminToken
        })
        .send(editProduct1)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('data')
            expect(res.body).toHaveProperty('msg', 'sukses edit produk')
            done()
          }
        })
    })
    test('Fail null access token should return status 401 and error object', (done) => {
      request(app)
        .put(`/products/${productId}`)
        .set({
          token: ''
        })
        .send(editProduct1)
        .expect(401)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual(['Not Authenticated'])
            done()
          }
        })
    })
    test('Fail customer access token should return status 403 and error object', (done) => {
      request(app)
        .put(`/products/${productId }`)
        .set({
          token: userCustomerToken
        })
        .send(editProduct1)
        .expect(403)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual(['Admin Only'])
            done()
          }
        })
    })
    test('Fail null input should return status 422 and error object', (done) => {
      request(app)
        .put(`/products/${productId}`)
        .set({
          token: userAdminToken
        })
        .send({
          name: '',
          image_url: '',
          price: '',
          stock: ''
        })
        .expect(422)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual([
              'name harus diisi',
              'image_url harus diisi',
              'price harus diisi',
              'stock harus diisi'
            ])
            done()
          }
        })
    })
    test('Fail minus stock input should return status 422 and error object', (done) => {
      request(app)
        .put(`/products/${productId}`)
        .set({
          token: userAdminToken
        })
        .send({
          name: 'kursi gaming',
          image_url: 'https://ecs7.tokopedia.net/img/cache/700/product-1/2019/1/8/5174415/5174415_a53fbb23-c454-45cc-896e-5330389ebf5d.jpg',
          price: 3000000,
          stock: -5
        })
        .expect(422)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual([
              'stock tidak boleh negatif'
            ])
            done()
          }
        })
    })
    test('Fail minus price input should return status 422 and error object', (done) => {
      request(app)
        .put(`/products/${productId}`)
        .set({
          token: userAdminToken
        })
        .send({
          name: 'kursi gaming',
          image_url: 'https://ecs7.tokopedia.net/img/cache/700/product-1/2019/1/8/5174415/5174415_a53fbb23-c454-45cc-896e-5330389ebf5d.jpg',
          price: -3000000,
          stock: 5
        })
        .expect(422)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual([
              'price tidak boleh negatif'
            ])
            done()
          }
        })
    })
    test('Fail worng data type input should return status 422 and error object', (done) => {
      request(app)
        .put(`/products/${productId}`)
        .set({
          token: userAdminToken
        })
        .send({
          name: 'kursi gaming',
          image_url: 'https://ecs7.tokopedia.net/img/cache/700/product-1/2019/1/8/5174415/5174415_a53fbb23-c454-45cc-896e-5330389ebf5d.jpg',
          price: 'ahiw',
          stock: 'ihaw'
        })
        .expect(422)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual([
              'price hanya boleh menggunakan angka',
              'stock hanya boleh menggunakan angka'
            ])
            done()
          }
        })
    })
  })
  describe('DELETE /products/:id', () => {
    test('Success should return status 200 and product object', (done) => {
      request(app)
        .delete(`/products/${productId}`)
        .set({
          token: userAdminToken
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('data')
            expect(res.body).toHaveProperty('msg', 'sukses delete produk')
            done()
          }
        })
    })
    test('Fail null access token should return status 401 and error object', (done) => {
      request(app)
        .delete(`/products/${productId}`)
        .set({
          token: ''
        })
        .expect(401)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual(['Not Authenticated'])
            done()
          }
        })
    })
    test('Fail customer access token should return status 403 and error object', (done) => {
      request(app)
        .delete(`/products/${productId }`)
        .set({
          token: userCustomerToken
        })
        .expect(403)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(res.body).toHaveProperty('errors')
            expect(res.body.errors).toEqual(['Admin Only'])
            done()
          }
        })
    })
  })
})