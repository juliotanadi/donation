import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts'
import { InsertUpdateUser } from '../components'
import Error from './error'
import config from '../../config'

const Profile = () => {
    const { backendUrl, clientSecret } = config

    const token = localStorage.getItem('token')

    const [user, setUser] = useState(null)

    const [authUser] = useContext(AuthContext)

    useEffect(() => {
        if (authUser)
            fetch(`${backendUrl}/v1/user/${authUser.id}`, {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    clientSecret,
                },
            })
                .then(response => {
                    response.json().then(data => {
                        if (data.code === 200) setUser(data.data)
                        else history.go(-1)
                    })
                })
                .catch(e => console.log(e))
    }, [authUser])

    return token ? (
        user && <InsertUpdateUser user={user} />
    ) : (
        <Error content="Not found!" />
    )
}

export default Profile
