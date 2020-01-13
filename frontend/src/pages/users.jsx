import React, { useContext, useEffect, useState } from 'react'
import { Button, Loader } from 'semantic-ui-react'
import { navigate } from '@reach/router'
import { AuthContext } from '../contexts'
import { User } from '../components'
import config from '../../config'

const Users = () => {
    const token = localStorage.getItem('token')

    const { backendUrl, clientSecret } = config

    const [user] = useContext(AuthContext)

    const [users, setUsers] = useState([])

    useEffect(() => {
        if (!localStorage.getItem('token')) return history.go(-1)

        fetch(`${backendUrl}/v1/user`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                clientSecret,
            },
        }).then(response => {
            response.json().then(data => {
                if (data.code === 200) setUsers(data.data)
                else history.go(-1)
            })
        })
    }, [])

    return (
        <React.Fragment>
            <Loader active={users.length === 0} inline="centered" />
            <div style={styles.buttonContainer}>
                <Button color="blue" onClick={() => navigate('/users/add')}>
                    Add user
                </Button>
            </div>
            {users.map(user => (
                <User key={user.id} user={user} />
            ))}
        </React.Fragment>
    )
}

const styles = {
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        margin: '2%',
    },
}

export default Users
