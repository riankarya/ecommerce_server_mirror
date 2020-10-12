function errorHandler(err, req, res, next) {
    switch (err.name) {
        case "SequelizeValidationError":
            let errors = err.errors.map(elem => elem.message)
            res.status(422).json({ errors })
            break
        case "SequelizeDatabaseError":
            console.log(err.original);
            // let errors = err.errors.map(elem => elem.message)
            res.status(422).json({ errors })
            break
        case "UnprocessibleEntity":
            res.status(422).json({ errors: err.errors })
            break
        case "NotAdmin":
            res.status(403).json({ errors: [err.msg] })
            break
        case 'AuthenticationError':
            res.status(401).json({ errors: [err.msg] })
            break
        case 'UnAuthorized':
            res.status(403).json({ errors: [err.msg] })
            break
        case 'ProductNotFound':
            res.status(404).json({ errors: [err.msg] })
            break
        default:
            res.status(500).json({ errors: ['Internal Server Error'] })
            break
    }
}

module.exports = errorHandler