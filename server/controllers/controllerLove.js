const { Product, Love } = require('../models')

class Controller {
  static async addLoves(req, res, next) {
    try {
      const UserId = req.loggedUser.id
      const ProductId = +req.params.productId
      const love = await Love.findAll({where: {UserId, ProductId}})
      if (!love.length) {
        let data = await Love.create({UserId, ProductId})
        res.status(201).json(data)
      }
    } catch (err) {
      next()
    }
  }
  static fetchLoves(req, res, next) {
    const UserId = req.loggedUser.id
    Love.findAll({where: {UserId}, include: [Product]})
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
            }
          }
        })
        res.status(200).json(data)
      })
      .catch(next)
  }
  static async deleteLoves(req, res, next) {
    try {
      const id = +req.params.loveId
      console.log(id, 'asup ti delete love server');
      let love = await Love.findOne({where: {id}})
      await love.destroy()
      res.status(200).json('Deleted')
    } catch(err) {
      next(err)
    }
  }
}

module.exports = Controller