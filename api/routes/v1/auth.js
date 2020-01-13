const {
    v1: { auth },
} = require('../../controllers')
const {
    v1: { authenticate },
} = require('../../middlewares')

const routes = async server => {
    server.post(
        '/register',
        {
            preHandler: authenticate,
        },
        auth.register,
    )
    server.post('/login', auth.login)
    server.post(
        '/check',
        {
            preHandler: authenticate,
        },
        auth.checkLogin,
    )
}

module.exports = routes
