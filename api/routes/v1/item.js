const multer = require('fastify-multer')
upload = multer({ dest: 'public/images/' })
const {
    v1: { item },
} = require('../../controllers')
const {
    v1: { authenticate },
} = require('../../middlewares')

const routes = async server => {
    server.get('/', item.showAll)
    server.get('/:id', item.show)
    server.post(
        '/',
        {
            preHandler: [authenticate, upload.single('image')],
        },
        item.store,
    )
    server.put(
        '/',
        {
            preHandler: [authenticate, upload.single('image')],
        },
        item.update,
    )
    server.delete(
        '/',
        {
            preHandler: authenticate,
        },
        item.destroy,
    )
}

module.exports = routes
