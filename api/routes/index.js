const v1 = require('./v1')

const routes = async server => {
    server.register(v1, {
        prefix: '/v1',
    })
}

module.exports = routes
