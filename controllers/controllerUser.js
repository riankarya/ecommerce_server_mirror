const { User } = require('../models')
const hashPassword = require('../helpers/hashPassword')
const { generateToken } = require('../helpers/jwt')
// const { OAuth2Client } = require('google-auth-library')


class Controller {
    static registerUser(req, res, next) {
        const { email, password } = req.body
        const obj = { email, password }
        User.create(obj)
            .then(data => {
                data = {
                    id: data.id,
                    email: data.email
                }
                res.status(201).json({ msg: 'berhasil register', data })
            })
            .catch(next)
    }
    static loginUser(req, res, next) {
        const { email, password } = req.body
        let errors = []
        if(!email.length) errors.push('email tidak boleh kosong')
        if(!password.length) errors.push('password tidak boleh kosong')
        if(errors.length) next({name: 'UnprocessibleEntity', errors})
        const obj = { email, password }
        User.findOne({ where: { email } })
            .then(data => {
                if (!data || hashPassword(password) != data.password) throw { name: 'UnAuthorized', msg: 'invalid email or password' }
                let payload = {
                    id: data.id,
                    email: data.email,
                    role: data.role
                }
                const id = +data.id
                let token = generateToken(payload)
                res.status(200).json({ msg: 'berhasil login', token, id })
            })
            .catch(next)
    }

    // static googleLoginUser(req, res, next) {
    //     let tokenGoogle = req.body.tokenGoogle
    //     let googlepayload = null
    //     const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    //     client.verifyIdToken({
    //         idToken: tokenGoogle,
    //         audience: process.env.GOOGLE_CLIENT_ID
    //     })
    //         .then(ticket => {
    //             googlepayload = ticket.getPayload()
    //             return User.findOne({
    //                 where: {
    //                     email: googlepayload.email
    //                 }
    //             })
    //         })
    //         .then((user) => {
    //             if (user) {
    //                 let payload = {
    //                     id: user.id,
    //                     email: user.email,
    //                 }
    //                 let token = generateToken(payload)
    //                 const id = user.id
    //                 res.status(200).json({ msg: 'berhasil login', token, id })
    //                 return user
    //             } else {
    //                 return User.create({
    //                     email: googlepayload.email,
    //                     password: 'google'
    //                 })
    //             }
    //         })
    //         .then(user => {
    //             console.log('googlesing in 333333333333333333333');
    //             let payload = {
    //                 id: user.id,
    //                 email: user.email
    //             }
    //             let token = generateToken(payload)
    //             res.status(200).json({ msg: 'berhasil login', token })
    //         })
    //         .catch(next)
    // }
}

module.exports = Controller