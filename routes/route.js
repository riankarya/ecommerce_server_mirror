const router = require('express').Router()
const User = require('./routeUser')
const Product = require('./routeProduct')
const Cart = require('./routeCart')
const Love = require('./routeLove')

router.use('/users', User)
router.use('/products', Product)
router.use('/carts', Cart)
router.use('/loves', Love)

module.exports = router