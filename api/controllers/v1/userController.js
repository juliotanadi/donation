const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { mysql } = require('../../connections')
const { response: Response } = require('../../helpers')
const {
    jwt: { secret },
} = require('../../configs')

const checkIsAdmin = authorization => {
    const token = authorization.replace('Bearer ', '')

    const { isAdmin } = jwt.decode(token, secret)

    return isAdmin
}

const showAll = async ({ headers: { authorization } }, response) => {
    if (!checkIsAdmin(authorization))
        return response.send(new Response(403, 'Unauthorized', null))

    const [users] = await mysql.execute(
        'SELECT id, name, username, deleted_at FROM users WHERE deleted_at = 0',
    )

    return response.send(
        new Response(
            200,
            null,
            users.map(user => {
                return {
                    id: user.id,
                    name: user.name,
                    isDeleted: user.deleted_at !== 0,
                }
            }),
        ),
    )
}

const show = async (
    { headers: { authorization }, params: { id } },
    response,
) => {
    const token = authorization.replace('Bearer ', '')

    const { id: userId } = jwt.decode(token, secret)

    if (userId != id && !checkIsAdmin(authorization))
        return response.send(new Response(403, 'Unauthorized', null))

    const [
        user,
    ] = await mysql.execute(
        'SELECT id, name, username, is_admin, deleted_at FROM users WHERE id = ?',
        [id],
    )

    return response.send(
        user.length !== 0
            ? new Response(200, null, {
                  id: user[0].id,
                  name: user[0].name,
                  username: user[0].username,
                  isAdmin: user[0].is_admin,
                  isDeleted: user[0].deleted_at !== 0,
              })
            : new Response(404, 'User not found', null),
    )
}

const update = async (
    { headers: { authorization }, body: { id, name, username, password } },
    response,
) => {
    const token = authorization.replace('Bearer ', '')

    const { id: userId } = jwt.decode(token, secret)

    if (userId !== id && !checkIsAdmin(authorization))
        return response.send(new Response(403, 'Unauthorized', null))

    try {
        if (password)
            await mysql.execute(
                'UPDATE users SET name = ?, username = ?, password = ?, updated_at = ? WHERE id = ? AND deleted_at = 0',
                [
                    name,
                    username,
                    await bcrypt.hash(password, 10),
                    new Date(),
                    id,
                ],
            )
        else
            await mysql.execute(
                'UPDATE users SET name = ?, username = ?, updated_at = ? WHERE id = ? AND deleted_at = 0',
                [name, username, new Date(), id],
            )

        const [
            user,
        ] = await mysql.execute(
            'SELECT id, name, username, deleted_at FROM users WHERE id = ? AND deleted_at = 0 LIMIT 1',
            [id],
        )

        return response.send(
            user.length !== 0
                ? new Response(200, null, {
                      id: user[0].id,
                      name: user[0].name,
                      username: user[0].username,
                      isDeleted: user[0].deleted_at !== 0,
                  })
                : new Response(404, 'User not found', null),
        )
    } catch (error) {
        if (error.errno === 1062)
            return response.send(
                new Response(409, 'Username already exist', null),
            )

        return response.send(new Response(400, error.message, null))
    }
}

const destroy = async (
    { headers: { authorization }, body: { id } },
    response,
) => {
    if (!checkIsAdmin(authorization))
        return response.send(new Response(403, 'Unauthorized', null))

    await mysql.execute(
        'UPDATE users SET token = null, deleted_at = ? WHERE id = ?',
        [new Date().getTime(), id],
    )

    const [
        user,
    ] = await mysql.execute(
        'SELECT id, name, username, deleted_at FROM users WHERE id = ? LIMIT 1',
        [id],
    )

    if (user.length === 0)
        return response.send(new Response(404, 'User not found', null))

    return response.send(
        new Response(200, null, {
            id: user[0].id,
            name: user[0].name,
            username: user[0].username,
            isDeleted: user[0].deleted_at !== 0,
        }),
    )
}

module.exports = {
    showAll,
    show,
    update,
    destroy,
}
