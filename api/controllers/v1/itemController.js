const jwt = require('jsonwebtoken')
const fs = require('fs')
const jimp = require('jimp')
const { mysql } = require('../../connections')
const { response: Response } = require('../../helpers')
const {
    jwt: { secret },
} = require('../../configs')

const showAll = async (request, response) => {
    const [items] = await mysql.execute(
        'SELECT i.id AS itemId , i.name AS itemName, description, quantity, image_url, user_id, c.id AS categoryId, c.name AS categoryName FROM items i JOIN categories c ON i.category_id = c.id WHERE i.deleted_at = 0',
    )

    return response.send(
        new Response(
            200,
            null,
            items.map(item => {
                return {
                    id: item.itemId,
                    name: item.itemName,
                    quantity: item.quantity,
                    description: item.description,
                    image: item.image_url,
                    category: {
                        id: item.categoryId,
                        name: item.categoryName,
                    },
                    user: {
                        id: item.user_id,
                    },
                }
            }),
        ),
    )
}

const show = async ({ params: { id } }, response) => {
    const [
        item,
    ] = await mysql.execute(
        'SELECT i.id AS itemId , i.name AS itemName, description, quantity, image_url, user_id, c.id AS categoryId, c.name AS categoryName FROM items i JOIN categories c ON i.category_id = c.id WHERE i.deleted_at = 0 AND i.id = ?',
        [id],
    )

    if (item.length === 0)
        return response.send(new Response(404, 'Item not found', null))

    return response.send(
        new Response(200, null, {
            id: item[0].itemId,
            name: item[0].itemName,
            quantity: item[0].quantity,
            description: item[0].description,
            image: item[0].image_url,
            category: {
                id: item[0].categoryId,
                name: item[0].categoryName,
            },
            user: {
                id: item[0].user_id,
            },
        }),
    )
}

const store = async (
    {
        file,
        body: { name, description, quantity, categoryId },
        headers: { authorization },
    },
    response,
) => {
    const fileName = `${new Date().getTime()}.jpg`
    const filePath = file.path.replace(file.filename, fileName)

    fs.rename(file.path, filePath, error => {
        if (error) return response.send(new Response(400, 'Bad request', null))
    })

    try {
        const token = authorization.replace('Bearer ', '')
        const { id } = jwt.decode(token, secret)

        await mysql.execute(
            'INSERT INTO items(name, description, quantity, image_url, category_id, user_id) VALUES(?, ?, ?, ?, ?, ?)',
            [name, description, quantity, filePath, categoryId, id],
        )

        const [item] = await mysql.execute(
            'SELECT * FROM items ORDER BY id DESC LIMIT 1',
        )

        jimp.read(filePath).then(image => {
            return image
                .resize(256, 256)
                .quality(60)
                .write(filePath)
        })

        return response.send(
            new Response(200, null, {
                id: item[0].id,
                name: item[0].name,
                quantity: item[0].quantity,
                image_url: item[0].image_url,
            }),
        )
    } catch (error) {
        console.log(error)
        await fs.unlinkSync(fileName)

        if (error.errno === 1062)
            return response.send(new Response(409, 'Item already exist', null))

        if (error.errno === 1452)
            return response.send(
                new Response(409, `Category doesn't exist`, null),
            )

        return response.send(new Response(400, error.message, null))
    }
}

const update = async (
    { file, body: { id, name, description, quantity, categoryId } },
    response,
) => {
    let filePath

    if (file) {
        const [
            oldImage,
        ] = await mysql.execute(
            'SELECT image_url FROM items WHERE id = ? AND deleted_at = 0',
            [id],
        )

        if (oldImage.length === 1) {
            fs.unlink(oldImage[0].image_url, () => {})
        }

        filePath = file.path.replace(
            file.filename,
            `${new Date().getTime()}.jpg`,
        )

        fs.rename(file.path, filePath, error => {
            if (error)
                return response.send(new Response(400, 'Bad request', null))
        })

        jimp.read(filePath).then(image => {
            return image
                .resize(256, 256)
                .quality(60)
                .write(filePath)
        })
    }

    try {
        if (file)
            await mysql.execute(
                'UPDATE items SET name = ?, description = ?, quantity = ?, image_url = ?, category_id = ? WHERE id = ? AND deleted_at = 0',
                [name, description, quantity, filePath, categoryId, id],
            )
        else
            await mysql.execute(
                'UPDATE items SET name = ?, description = ?, quantity = ?, category_id = ? WHERE id = ? AND deleted_at = 0',
                [name, description, quantity, categoryId, id],
            )

        const [
            item,
        ] = await mysql.execute(
            'SELECT * FROM items WHERE id = ? AND deleted_at = 0 LIMIT 1',
            [id],
        )

        if (item.length === 0) {
            await fs.unlink(filePath)
            response.send(new Response(404, 'Item not found', null))
        }

        return response.send(
            new Response(200, null, {
                id: item[0].id,
                name: item[0].name,
                quantity: item[0].quantity,
                image_url: item[0].image_url,
            }),
        )
    } catch (error) {
        await fs.unlink(filePath)

        if (error.errno === 1062)
            return response.send(new Response(409, 'Item already exist', null))

        if (error.errno === 1452)
            return response.send(
                new Response(409, `Category doesn't exist`, null),
            )

        return response.send(new Response(400, error, null))
    }
}

const destroy = async ({ body: { id } }, response) => {
    await mysql.execute('UPDATE items SET deleted_at = ? WHERE id = ?', [
        new Date().getTime(),
        id,
    ])

    const [
        item,
    ] = await mysql.execute(
        'SELECT id, name, quantity, image_url FROM items WHERE id = ? LIMIT 1',
        [id],
    )

    if (item.length === 0)
        return response.send(new Response(404, 'Item not found', null))

    return response.send(
        new Response(200, null, {
            id: item[0].id,
            name: item[0].name,
            quantity: item[0].quantity,
            image_url: item[0].image_url,
        }),
    )
}

module.exports = {
    showAll,
    show,
    store,
    update,
    destroy,
}
