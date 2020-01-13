import React, { useEffect, useState } from 'react'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'
import { Item } from '../components'
import config from '../../config'

const Items = () => {
    const { backendUrl, clientSecret } = config

    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch(`${backendUrl}/v1/item`, {
            method: 'GET',
            headers: {
                clientSecret,
            },
        }).then(response => {
            response.json().then(data => {
                if (data.code === 200) {
                    setIsLoading(false)
                    setItems(data.data)
                }
            })
        })
    }, [])

    return (
        <React.Fragment>
            <Loader active={isLoading} inline="centered" />
            {items.length !== 0 ? (
                items.map(item => <Item key={item.id} {...item} />)
            ) : (
                <h1 style={styles.noItem}>Tidak ada barang</h1>
            )}
        </React.Fragment>
    )
}

const styles = {
    noItem: {
        textAlign: 'center',
    },
}

export default Items
