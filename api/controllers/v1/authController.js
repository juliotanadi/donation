const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    jwt: { secret },
} = require('../../configs')
const { mysql } = require('../../connections')
const { response: Response } = require('../../helpers')

const register = async (
    { headers: { authorization }, body: { name, username, password } },
    response,
) => {
    const token = authorization.replace('Bearer ', '')

    const { isAdmin } = jwt.decode(token, secret)

    if (!isAdmin) return response.send(new Response(403, 'Unauthorized', null))

    if (!name | !username || !password)
        return response.send(new Response(400, 'Bad request', null))
    try {
        await mysql.execute(
            'INSERT INTO users(name, username, password) VALUES (?, ?, ?)',
            [name, username, await bcrypt.hash(password, 10)],
        )

        const [
            user,
        ] = await mysql.execute(
            'SELECT id, name FROM users WHERE username = ? AND deleted_at = 0',
            [username],
        )

        return response.send(new Response(200, null, user[0]))
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY')
            return response.send(new Response(409, 'User already exist', null))

        return response.send(new Response(400, error.message, null))
    }
}

const login = async ({ body: { username, password } }, response) => {
    if (!username || !password)
        return response.send(new Response(400, 'Bad request', null))

    const [
        user,
    ] = await mysql.execute(
        'SELECT id, name, password, is_admin FROM users WHERE username = ? AND deleted_at = 0 LIMIT 1',
        [username],
    )

    if (user.length === 0 || !bcrypt.compareSync(password, user[0].password))
        return response.send(new Response(401, 'Invalid username / password'))

    const token = jwt.sign(
        {
            id: user[0].id,
            isAdmin: user[0].is_admin == 1,
        },
        secret,
    )

    await mysql.execute('UPDATE users SET token = ? WHERE id = ?', [
        token,
        user[0].id,
    ])

    return response.send(
        new Response(200, null, {
            token,
            user: {
                id: user[0].id,
                name: user[0].name,
                isAdmin: user[0].is_admin == 1,
            },
        }),
    )
}

const checkLogin = async ({ headers: { authorization } }, response) => {
    const decodedToken = jwt.verify(
        authorization.replace('Bearer ', ''),
        secret,
    )

    const [
        user,
    ] = await mysql.execute(
        'SELECT id, name, is_admin FROM users WHERE id = ? AND deleted_at = 0',
        [decodedToken.id],
    )

    if (user.length === 0)
        return response.send(new Response(404, 'User not found', null))

    return response.send(
        new Response(200, null, {
            id: user[0].id,
            name: user[0].name,
            isAdmin: user[0].is_admin == 1,
        }),
    )
}

module.exports = {
    register,
    login,
    checkLogin,
}
