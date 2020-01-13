import React, { useContext, useState } from 'react'
import { Button, Icon, Message } from 'semantic-ui-react'
import { Link } from '@reach/router'
import { AuthContext } from '../contexts'
import CustomModal from './customModal'
import config from '../../config'

const Category = ({ category }) => {
    const { backendUrl, clientSecret } = config

    const [user] = useContext(AuthContext)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const deleteCategoryHandler = id => {
        fetch(`${backendUrl}/v1/category`, {
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
                if (data.code === 200) window.location.replace('/categories')
            })
        })
    }

    return (
        <Message style={styles.container}>
            <div style={styles.categoryContainer}>
                <CustomModal
                    isOpen={isModalOpen}
                    title="Are you sure to delete this category?"
                    content="This action cannot be undone"
                    yesHandler={() => deleteCategoryHandler(category.id)}
                    noHandler={() => setIsModalOpen(false)}
                />
                <Link to={`/categories/${category.id}`}>
                    <h2 style={{ textDecoration: 'underline' }}>
                        {category.name}
                    </h2>
                </Link>
                {user && user.isAdmin && (
                    <div>
                        <Link to={`/categories/update/${category.id}`}>
                            <Button icon color="yellow">
                                <Icon name="edit" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            icon
                            color="youtube"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Icon name="delete" />
                            Delete
                        </Button>
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
    categoryContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
}

export default Category
