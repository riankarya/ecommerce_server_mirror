const { Cart, Product } = require('../models')

class Controller {
  static async addCarts(req, res, next) {
    try {
      const UserId = req.loggedUser.id
      const ProductId = +req.params.productId
      const quantity = 1
      const status = true
      const cart = await Cart.findAll({where: {UserId, ProductId, status: true}})
      console.log(cart, 'ASUP TI CONTROLLER ADD CART')
      if(!cart.length) {
        let data = await Cart.create({UserId, ProductId, quantity, status})
        // let productBersangkutan = await Product.findOne({where: {id: ProductId }})
        // await Product.update(
        //   {stock: productBersangkutan.dataValues.stock - quantity},
        //   {where: { id: ProductId }}
        // )
        res.status(201).json(data)
      } else {
        console.log('ASUP ELSE', UserId, ProductId);
        const quantityUpdate = quantity + cart[0].dataValues.quantity
        let updateCart = await Cart.update({quantity: quantityUpdate}, {where: {id: cart[0].dataValues.id}})
        // let productBersangkutan = await Product.findOne({where: {id: ProductId }})
        // await Product.update(
        //   {stock: productBersangkutan.dataValues.stock - quantity},
        //   {where: { id: ProductId }}
        // )
        res.status(201).json(updateCart)
      } 
    } catch(err) {
      next()
    }
  }
  static fetchCarts(req, res, next) {
    const UserId = req.loggedUser.id
    Cart.findAll({where: {UserId, status: true}, include: [Product]})
      .then(data => {
        data = data.map(elem => {
          return {
            id: elem.dataValues.id,
            product: {
              id: elem.dataValues.Product.id,
              name: elem.dataValues.Product.name,
              image_url: elem.dataValues.Product.image_url,
              price: elem.dataValues.Product.price,
              stock: elem.dataValues.Product.stock,
              category: elem.dataValues.Product.category
            },
            quantity: elem.dataValues.quantity,
            status: elem.dataValues.status
          }
        })
        res.status(200).json(data)
      })
      .catch(next)
  }
  static async editQuantityCarts(req, res, next) {
    try {
      const id = +req.params.cartId
      const UserId = req.loggedUser.id
      const quantity = req.body.quantity
      const ProductId = req.body.ProductId
      const cart = await Cart.findAll({where: {UserId, ProductId, status: true}})
      const quantityUpdate = quantity - cart[0].dataValues.quantity
          let updateCart = await Cart.update({quantity}, {where: {id: cart[0].dataValues.id}})
          // let productBersangkutan = await Product.findOne({where: {id: ProductId }})
          // await Product.update(
          //   {stock: productBersangkutan.dataValues.stock - quantityUpdate},
          //   {where: { id: ProductId }}
          // )
          res.status(201).json(updateCart)
    } catch(err) {
      next(err)
    }
  }
  static async editStatusCarts(req, res, next) {
    try {
      const id = +req.params.cartId
      const status = req.body.status
      let cart = await Cart.findOne({where: {id}})
      let cartQuantity = cart.quantity
      let ProductId = cart.ProductId
      let updated = await Cart.update({status}, {where: {id}})
      if (!updated) throw {name:'NotFound', msg: "Not Found"}
      let product = await Product.findOne({where: {id: ProductId}})
      product.stock -= cartQuantity
      await product.save()
      res.status(200).json(updated)
    } catch(err) {
      next(err)
    }
  }
  static async deleteCarts(req, res, next) {
    try {
      const id = +req.params.cartId
      let cart = await Cart.findOne({where: {id}})
      await cart.destroy()
      res.status(200).json('Deleted')
    } catch(err) {
      next(err)
    }
  }
}

module.exports = Controller