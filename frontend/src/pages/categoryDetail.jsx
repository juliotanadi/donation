import React, { useEffect, useState } from 'react'
import { Loader, Message } from 'semantic-ui-react'
import { Item } from '../components'
import config from '../../config'

const CategoryDetail = ({ id }) => {
    const { backendUrl, clientSecret } = config

    const [category, setCategory] = useState(null)

    useEffect(() => {
        fetch(`${backendUrl}/v1/category/${id}`, {
            method: 'GET',
            headers: {
                clientSecret,
            },
        }).then(response => {
            response.json().then(data => {
                if (data.code === 200) setCategory(data.data)
                else history.go(-1)
            })
        })
    }, [])

    return category ? (
        <React.Fragment>
            <Message style={styles.titleContainer}>
                <Message.Header>{category.name}</Message.Header>
                <h4>{category.items.length} barang</h4>
            </Message>
            {category.items.map(item => (
                <Item key={item.id} {...item} />
            ))}
        </React.Fragment>
    ) : (
        <Loader active inline="centered" />
    )
}

const styles = {
    titleContainer: {
        margin: '2%',
    },
}

export default CategoryDetail
