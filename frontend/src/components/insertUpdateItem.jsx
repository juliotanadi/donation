import React, { useContext, useEffect, useState } from 'react'
import { navigate } from '@reach/router'
import { Button, Card, Form, Loader, Message } from 'semantic-ui-react'
import { AuthContext, NavbarContext } from '../contexts'
import { Items } from '../pages'
import config from '../../config'
import { navbarConstant } from '../constants'

const InsertUpdateItem = ({ item }) => {
    const { backendUrl, clientSecret } = config

    const token = localStorage.getItem('token')

    const [user] = useContext(AuthContext)
    const [navbar, setNavbar] = useContext(NavbarContext)

    const [fields, setFields] = useState({
        name: item ? item.name : '',
        description: item ? item.description : '',
        quantity: item ? item.quantity : 0,
        categoryId: item ? item.category.id : 0,
        image: null,
    })

    const [error, setError] = useState({
        name: null,
        description: null,
        quantity: null,
        categoryId: null,
        image: null,
        submit: null,
    })
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetch(`${backendUrl}/v1/category`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (token)
                response.json().then(data => {
                    if (data.code === 200) return setCategories(data.data)
                })
        })
    }, [])

    const resetError = interval => {
        setTimeout(
            () =>
                setError({
                    name: null,
                    description: null,
                    quantity: null,
                    categoryId: null,
                    image: null,
                    submit: null,
                }),
            interval,
        )
    }

    const handleFieldChange = (value, type) => {
        switch (type) {
            case 'NAME':
                setFields({
                    ...fields,
                    name: value,
                })
                break
            case 'DESCRIPTION':
                setFields({
                    ...fields,
                    description: value,
                })
                break
            case 'QUANTITY':
                setFields({
                    ...fields,
                    quantity: value,
                })
                break
            case 'CATEGORY_ID':
                setFields({
                    ...fields,
                    categoryId: value,
                })
                break
            case 'IMAGE':
                setFields({
                    ...fields,
                    image: value,
                })
                break
        }
    }

    const handleSubmit = () => {
        if (!user || (item && item.user.id !== user.id && !user.isAdmin)) {
            setNavbar(navbarConstant.ITEM)
            return navigate('/items')
        }

        if (!fields.name) {
            setError({
                ...error,
                name: 'Name must be filled',
            })
            return resetError(5000)
        }

        if (!fields.description) {
            setError({
                ...error,
                description: 'Description must be filled',
            })
            return resetError(5000)
        }

        if (!item) {
            if (fields.quantity === 0) {
                setError({
                    ...error,
                    quantity: 'Quantity cannot 0',
                })
                return resetError(5000)
            }
        }

        if (!item) {
            if (!fields.image) {
                setError({
                    ...error,
                    image: 'Image must be filled',
                })
                return resetError(5000)
            }
        }

        setIsLoading(true)

        const body = new FormData()
        body.append('name', fields.name)
        body.append('description', fields.description)
        body.append('quantity', fields.quantity)
        body.append('categoryId', fields.categoryId)
        body.append('image', fields.image)

        if (!item) {
            fetch(`${backendUrl}/v1/item`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    clientSecret,
                },
                body,
            }).then(response => {
                response.json().then(data => {
                    setIsLoading(false)

                    if (data.code === 200) return navigate('/')

                    setError({
                        ...error,
                        submit: data.message,
                    })
                    return resetError(5000)
                })
            })
        } else {
            body.append('id', item.id)

            fetch(`${backendUrl}/v1/item`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    clientSecret,
                },
                body,
            }).then(response => {
                response.json().then(data => {
                    setIsLoading(false)

                    if (data.code === 200) return navigate('/')

                    setError({
                        ...error,
                        submit: data.message,
                    })
                    return resetError(5000)
                })
            })
        }
    }

    if (!token) {
        setNavbar(navbarConstant.ITEM)
        navigate('/')
    }

    return token ? (
        <Card centered style={styles.mainContainer}>
            <Card.Content>
                <Form onSubmit={handleSubmit}>
                    <Message
                        header={
                            item
                                ? `Update ${item.name}`
                                : fields.name !== ''
                                ? `Insert ${fields.name}`
                                : 'Insert item'
                        }
                    />
                    <Form.Input
                        error={error.name}
                        label="Item name"
                        type="text"
                        value={fields.name}
                        onChange={e =>
                            handleFieldChange(e.target.value, 'NAME')
                        }
                    />
                    <Form.Input
                        error={error.description}
                        label="Description"
                        type="text"
                        value={fields.description}
                        onChange={e =>
                            handleFieldChange(e.target.value, 'DESCRIPTION')
                        }
                    />
                    <Form.Field
                        error={error.quantity}
                        label="Quantity"
                        control="input"
                        type="number"
                        min={0}
                        value={fields.quantity}
                        onChange={e =>
                            handleFieldChange(e.target.value, 'QUANTITY')
                        }
                    />
                    {categories.length !== 0 ? (
                        <Form.Field
                            error={error.categoryId}
                            label="Category"
                            control="select"
                            onChange={e =>
                                handleFieldChange(e.target.value, 'CATEGORY_ID')
                            }
                            value={fields.categoryId}
                        >
                            <option value={0}>Select category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Field>
                    ) : (
                        <Loader active inline="centered" />
                    )}
                    <React.Fragment>
                        <Form.Input
                            error={error.image}
                            label="Image"
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                handleFieldChange(e.target.files[0], 'IMAGE')
                            }}
                        />
                        <Message
                            color="yellow"
                            header="Please make sure you use a square image"
                        />
                    </React.Fragment>
                    {error.submit && (
                        <Message
                            negative
                            header={(item ? 'Update' : 'Insert') + ' error'}
                            content={error.submit}
                        />
                    )}
                    <Button color="blue" loading={isLoading}>
                        {item ? 'Update' : 'Insert'}
                    </Button>
                </Form>
            </Card.Content>
        </Card>
    ) : (
        <Items />
    )
}

const styles = {
    mainContainer: {
        marginTop: '1%',
    },
}

export default InsertUpdateItem
