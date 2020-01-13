const auth = require('./auth')
const category = require('./category')
const item = require('./item')
const user = require('./user')

const routes = async server => {
    server.register(auth, {
        prefix: '/auth',
    })
    server.register(category, {
        prefix: '/category',
    })
    server.register(item, {
        prefix: '/item',
    })
    server.register(user, {
        prefix: '/user',
    })
}

module.exports = routes
