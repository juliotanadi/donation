const jwt = require('jsonwebtoken')
const { mysql } = require('../../connections')
const { response: Response } = require('../../helpers')
const {
    jwt: { secret },
    clientSecret,
} = require('../../configs')

const authenticate = async ({ headers }, response) => {
    const { authorization, clientsecret } = headers

    if (!authorization || !clientsecret || clientsecret !== clientSecret)
        response.send(new Response(403, 'Unauthorized', null))

    const token = authorization.replace('Bearer ', '')

    try {
        const { id } = jwt.verify(token, secret)

        if (!id) response.send(new Response(403, 'Unauthorized', null))

        const [
            user,
        ] = await mysql.execute('SELECT token FROM users WHERE id = ?', [id])

        if (user[0].token !== token)
            response.send(new Response(403, 'Unauthorized', null))
    } catch (error) {
        response.send(new Response(403, 'Unauthorized', null))
    }
}

module.exports = authenticate
