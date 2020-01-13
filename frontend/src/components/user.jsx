import React, { useContext, useState } from 'react'
import { Button, Icon, Message } from 'semantic-ui-react'
import { Link } from '@reach/router'
import { AuthContext } from '../contexts'
import CustomModal from './customModal'
import config from '../../config'

const User = ({ user }) => {
    const { backendUrl, clientSecret } = config

    const [authUser] = useContext(AuthContext)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const deleteUserHandler = id => {
        fetch(`${backendUrl}/v1/user`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                clientSecret,
            },
            body: JSON.stringify({ id }),
        }).then(response => {
            response.json().then(data => {
                if (data.code === 200) window.location.replace('/users')
            })
        })
    }

    return (
        <Message style={styles.container}>
            <div style={styles.userContainer}>
                <CustomModal
                    isOpen={isModalOpen}
                    title="Are you sure to delete this user?"
                    content="This action cannot be undone"
                    yesHandler={() => deleteUserHandler(user.id)}
                    noHandler={() => setIsModalOpen(false)}
                />
                <h2 style={{ margin: 0 }}>{user.name}</h2>
                {authUser && (authUser.id === user.id || authUser.isAdmin) && (
                    <div>
                        <Link to={`/users/update/${user.id}`}>
                            <Button icon color="yellow">
                                <Icon name="edit" />
                                Edit
                            </Button>
                        </Link>
                        {authUser.isAdmin && (
                            <Button
                                icon
                                color="youtube"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Icon name="delete" />
                                Delete
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </Message>
    )
}

const styles = {
    container: {
        margin: '2%',
    },
    userContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
}

export default User
