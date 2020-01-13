const {
    v1: { category },
} = require('../../controllers')
const {
    v1: { authenticate },
} = require('../../middlewares')

const routes = async server => {
    server.get('/', category.showAll)
    server.get('/:id', category.show)
    server.put(
        '/',
        {
            preHandler: authenticate,
        },
        category.update,
    )
    server.post(
        '/',
        {
            preHandler: authenticate,
        },
        category.store,
    )
    server.delete(
        '/',
        {
            preHandler: authenticate,
        },
        category.destroy,
    )
}

module.exports = routes
