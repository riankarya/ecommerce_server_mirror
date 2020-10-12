const router = require('express').Router()
const Controller = require('../controllers/controllerProduct')
const authentication = require('../middlewares/authentication')
const {authorizationAdmin} = require('../middlewares/authorization')

router.use(authentication)
router.post('/', authorizationAdmin, Controller.addProducts)
router.put('/:id', authorizationAdmin, Controller.editProducts)
router.delete('/:id', authorizationAdmin, Controller.deleteProducts)

module.exports = router