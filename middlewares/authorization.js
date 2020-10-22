const { Cart, Love } = require('../models')

function authorizationUserCart(req, res, next) {
    const UserId = req.loggedUser.id
    const id = req.params.cartId
    console.log(UserId, id, 'ASUP AUTH USER');
    Cart.findOne({where: {id}})
        .then(data => {
            if (!data) throw {name: 'NotFound', msg: 'Not Found'}
            else if (data.UserId == UserId) next()
            else throw {name: 'UnAuthorized', msg: 'Not Authorized'}
        })
        .catch(next)
}
function authorizationUserLove(req, res, next) {
    const UserId = req.loggedUser.id
    const id = req.params.loveId
    console.log(UserId, id, 'ASUP AUTH USER');
    Love.findOne({where: {id}})
        .then(data => {
            if (!data) throw {name: 'NotFound', msg: 'Not Found'}
            else if (data.UserId == UserId) next()
            else throw {name: 'UnAuthorized', msg: 'Not Authorized'}
        })
        .catch(next)
}
function authorizationAdmin(req, res, next) {
    const role = req.loggedUser.role
    if(role == 'admin') next()
    else next({name: 'NotAdmin', msg: 'Admin Only'})
}

module.exports = { authorizationUserCart, authorizationUserLove, authorizationAdmin }