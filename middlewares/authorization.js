const { Task } = require('../models')

// function authorizationUser (req, res, next) {
//     const id = +req.params.id
//     Task.findOne({where: {id}})
//     .then(data => {
//         if(!data) throw {name: 'TaskNotFound', msg: 'Task not found'}
//         else if(data.UserId == req.loggedUser.id) next()
//         else throw {name: 'UnAuthorized', msg: 'You are not authorized'}
//     })
//     .catch(next)
// }
function authorizationAdmin(req, res, next) {
    const role = req.loggedUser.role
    if(role == 'admin') next()
    else next({name: 'NotAdmin', msg: 'Admin Only'})
    // Task.findOne({ where: { id } })
    //     .then(data => {
    //         if (!data) throw { name: 'TaskNotFound', msg: 'Task not found' }
    //         else if (data.UserId == req.loggedUser.id) next()
    //         else throw { name: 'UnAuthorized', msg: 'You are not authorized' }
    //     })
    //     .catch(next)
}

module.exports = { authorizationAdmin }