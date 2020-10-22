const router = require('express').Router()
const Controller = require('../controllers/controllerCart')
const authentication = require('../middlewares/authentication')
const { authorizationUserCart } = require('../middlewares/authorization')

router.use(authentication)
router.get('/', Controller.fetchCarts)
router.post('/:productId', Controller.addCarts)
router.patch('/:cartId', authorizationUserCart, Controller.editQuantityCarts)
router.put('/:cartId', authorizationUserCart, Controller.editStatusCarts)
router.delete('/:cartId', authorizationUserCart, Controller.deleteCarts)

module.exports = router