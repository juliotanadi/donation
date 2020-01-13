import React, { useEffect, useState } from 'react'
import { InsertUpdateCategory } from '../components'
import config from '../../config'
import Error from './error'

const UpdateCategory = ({ id }) => {
    const { backendUrl, clientSecret } = config

    const token = localStorage.getItem('token')

    useEffect(() => {
        fetch(`${backendUrl}/v1/category/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                clientSecret,
            },
        }).then(response => {
            response.json().then(data => {
                if (data.code === 200) setCategory(data.data)
            })
        })
    }, [])

    const [category, setCategory] = useState(null)

    return token ? (
        category && <InsertUpdateCategory category={category} />
    ) : (
        <Error content="Not found!" />
    )
}

export default UpdateCategory
