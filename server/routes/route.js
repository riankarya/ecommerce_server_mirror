const router = require('express').Router()
const User = require('./routeUser')
const Product = require('./routeProduct')

router.use('/users', User)
router.use('/products', Product)

module.exports = router