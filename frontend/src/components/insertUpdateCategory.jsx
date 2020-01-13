import React, { useContext, useState } from 'react'
import { Card, Form, Message } from 'semantic-ui-react'
import { navigate } from '@reach/router'
import { AuthContext, NavbarContext } from '../contexts'
import { Error } from '../pages'
import { navbarConstant } from '../constants'
import config from '../../config'

const InsertCategory = ({ category }) => {
    const { backendUrl, clientSecret } = config

    const token = localStorage.getItem('token')

    const [user] = useContext(AuthContext)
    const [navbar, setNavbar] = useContext(NavbarContext)

    const [categoryName, setCategoryName] = useState(
        category ? category.name : '',
    )
    const [error, setError] = useState({
        name: null,
        submit: null,
    })

    const [isLoading, setIsLoading] = useState(false)

    const resetError = interval => {
        setTimeout(() => {
            setError({
                name: null,
                submit: null,
            })
        }, interval)
    }

    const handleCategoryNameChange = value => {
        setCategoryName(value)
    }

    const handleSubmit = () => {
        if (!categoryName) {
            setError({
                ...error,
                name: 'Category name must be filled!',
            })
            return resetError(5000)
        }

        if (!user || !user.isAdmin) {
            setNavbar(navbarConstant.ITEM)
            return navigate('/')
        }

        setIsLoading(true)

        if (category)
            fetch(`${backendUrl}/v1/category`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    clientSecret,
                },
                body: JSON.stringify({ id: category.id, name: categoryName }),
            }).then(response => {
                response.json().then(data => {
                    if (data.code === 200)
                        window.location.replace('/categories')

                    setError({
                        ...error,
                        submit: data.message,
                    })
                    return resetError(5000)
                })
            })
        else
            fetch(`${backendUrl}/v1/category`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    clientSecret,
                },
                body: JSON.stringify({ name: categoryName }),
            }).then(response => {
                response.json().then(data => {
                    if (data.code === 200)
                        window.location.replace('/categories')

                    setError({
                        ...error,
                        submit: data.message,
                    })
                    return resetError(5000)
                })
            })
    }

    return (
        <Card centered style={styles.mainContainer}>
            <Card.Content>
                <Form onSubmit={handleSubmit}>
                    <Message
                        header={
                            (category ? 'Update' : 'Insert') +
                            ' ' +
                            (categoryName || 'category')
                        }
                    />
                    <Form.Input
                        error={error.name}
                        value={categoryName}
                        label="Category name"
                        placeholder="Obat - obatan"
                        onChange={e => handleCategoryNameChange(e.target.value)}
                    />
                    {error.submit && (
                        <Message
                            negative
                            header={(category ? 'Update' : 'Insert') + ' error'}
                            content={error.submit}
                        />
                    )}
                    <Form.Button loading={isLoading} color="blue">
                        {category ? 'Update' : 'Insert'}
                    </Form.Button>
                </Form>
            </Card.Content>
        </Card>
    )
}

const styles = {
    mainContainer: {
        marginTop: '1%',
    },
}

export default InsertCategory
