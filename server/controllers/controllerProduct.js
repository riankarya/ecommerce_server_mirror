const { Product } = require('../models')

class Controller {
  static products(req, res, next) {
    Product.findAll()
      .then(data => {
        res.status(202).json({ data })
      })
      .catch(err => {
        next(err)
      })
  }
  static productsById(req, res, next) {
    const id = +req.params.id
    Product.findOne({ where: { id } })
      .then(data => {
        if(!data) throw {name: 'ProductNotFound', error: "not found" }
        res.status(200).json({ data })
      })
      .catch(next)
  }
  static addProducts(req, res, next) {
    const { name, image_url, price, stock, category } = req.body
    const obj = { name, image_url, price, stock, category }
    Product.create(obj)
      .then(data => {
        res.status(201).json({ msg: 'sukses nambah produk', data })
      })
      .catch(next)
  }
  static editProducts(req, res, next) {
    const id = +req.params.id
    const { name, image_url, price, stock, category } = req.body
    const obj = { name, image_url, price, stock, category }
    Product.update(obj, { where: { id } })
      .then(() => {
        return Product.findOne({ where: { id } })
      })
      .then(data => {
        if (!data) throw { name: 'ProductNotFound', error: "not found" }
        res.status(200).json({ msg: 'sukses edit produk', data })
      })
      .catch(next)
  }
  static deleteProducts(req, res, next) {
    const id = +req.params.id
    Product.findOne({where: {id}})
    .then(data => {
        if(!data) throw {name: 'ProductNotFound', error: "not found"}
        Product.destroy({where: {id}})
        res.status(200).json({msg: 'sukses delete produk', data})
    })
    .catch(next)
  }
}

module.exports = Controller