require('dotenv').config()
const server = require('fastify')({
    logger: true,
})
const fastifyCors = require('fastify-cors')
const fastifyMulter = require('fastify-multer')
const fastifyStatic = require('fastify-static')
const path = require('path')
const routes = require('./routes')

server.register(fastifyCors)
server.register(fastifyMulter.contentParser)
server.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public',
})

server.get('/', (request, response) =>
    response.send({
        hello: 'world',
    }),
)
server.register(routes)

const serve = async () => {
    try {
        await server.listen(process.env.PORT || 3000)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}
serve()
