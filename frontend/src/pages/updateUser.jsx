import React, { useEffect, useState } from 'react'
import { InsertUpdateUser } from '../components'
import config from '../../config'
import Error from './error'

const UpdateUser = ({ id }) => {
    const { backendUrl, clientSecret } = config

    const token = localStorage.getItem('token')

    const [user, setUser] = useState(null)

    useEffect(() => {
        fetch(`${backendUrl}/v1/user/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                clientSecret,
            },
        }).then(response => {
            response.json().then(data => {
                if (data.code === 200) setUser(data.data)
                else history.go(-1)
            })
        })
    }, [])

    return token ? (
        user && <InsertUpdateUser user={user} />
    ) : (
        <Error content="Not found!" />
    )
}

export default UpdateUser
