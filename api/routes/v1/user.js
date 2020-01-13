const {
    v1: { user },
} = require('../../controllers')
const {
    v1: { authenticate },
} = require('../../middlewares')

const routes = async server => {
    server.get(
        '/',
        {
            preHandler: authenticate,
        },
        user.showAll,
    )
    server.get(
        '/:id',
        {
            preHandler: authenticate,
        },
        user.show,
    )
    server.put(
        '/',
        {
            preHandler: authenticate,
        },
        user.update,
    )
    server.delete(
        '/',
        {
            preHandler: authenticate,
        },
        user.destroy,
    )
}

module.exports = routes
