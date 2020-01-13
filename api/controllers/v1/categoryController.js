const { mysql } = require('../../connections')
const { response: Response } = require('../../helpers')

const showAll = async (request, response) => {
    const [categories] = await mysql.execute(
        'SELECT id, name FROM categories WHERE deleted_at = 0',
    )

    return response.send(new Response(200, null, categories))
}

const show = async ({ params: { id } }, response) => {
    const [
        category,
    ] = await mysql.execute(
        'SELECT id, name FROM categories WHERE id = ? AND deleted_at = 0 LIMIT 1',
        [id],
    )

    if (category.length === 0)
        return response.send(new Response(404, 'Category not found', null))

    const [
        items,
    ] = await mysql.execute(
        'SELECT id, name, quantity, description, image_url, user_id FROM items WHERE category_id = ? AND deleted_at = 0',
        [id],
    )

    return response.send(
        new Response(200, null, {
            ...category[0],
            items: items.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    description: item.description,
                    image: item.image_url,
                    user: {
                        id: item.user_id,
                    },
                }
            }),
        }),
    )
}

const store = async ({ body: { name } }, response) => {
    try {
        await mysql.execute('INSERT INTO categories(name) VALUES(?)', [name])

        const [category] = await mysql.execute(
            'SELECT * FROM categories ORDER BY id DESC LIMIT 1',
        )

        return response.send(
            new Response(200, null, {
                id: category[0].id,
                name: category[0].name,
            }),
        )
    } catch (error) {
        if (error.errno === 1062)
            return response.send(
                new Response(409, 'Category already exist', null),
            )

        return response.send(new Response(400, error.message, null))
    }
}

const update = async ({ body: { name, id } }, response) => {
    try {
        await mysql.execute(
            'UPDATE categories SET name = ?, updated_at = ? WHERE id = ? AND deleted_at = 0',
            [name, new Date(), id],
        )

        const [
            category,
        ] = await mysql.execute(
            'SELECT id, name FROM categories WHERE id = ? AND deleted_at = 0 LIMIT 1',
            [id],
        )

        return response.send(
            new Response(
                category.length === 0 ? 404 : 200,
                null,
                category.length !== 0 ? category[0] : null,
            ),
        )
    } catch (error) {
        if (error.errno === 1062)
            return response.send(
                new Response(409, 'Category already exist', null),
            )

        return response.send(new Response(400, error.message, null))
    }
}

const destroy = async ({ body: { id } }, response) => {
    await mysql.execute('UPDATE categories SET deleted_at = ? WHERE id = ?', [
        new Date().getTime(),
        id,
    ])

    const [
        category,
    ] = await mysql.execute('SELECT * FROM categories WHERE id = ? LIMIT 1', [
        id,
    ])

    if (category.length === 0)
        return response.send(new Response(404, 'Category not found', null))

    return response.send(
        new Response(200, null, { id: category[0].id, name: category[0].name }),
    )
}

module.exports = {
    showAll,
    show,
    store,
    update,
    destroy,
}
