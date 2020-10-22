const router = require('express').Router()
const Controller = require('../controllers/controllerLove')
const authentication = require('../middlewares/authentication')
const { authorizationUserLove } = require('../middlewares/authorization')

router.use(authentication)
router.get('/', Controller.fetchLoves)
router.post('/:productId', Controller.addLoves)
router.delete('/:loveId', authorizationUserLove, Controller.deleteLoves)

module.exports = router