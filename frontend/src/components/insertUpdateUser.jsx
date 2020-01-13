import React, { useContext, useState } from 'react'
import { Button, Card, Form, Message } from 'semantic-ui-react'
import { navigate } from '@reach/router'
import { AuthContext, NavbarContext } from '../contexts'
import { Items } from '../pages'
import config from '../../config'
import { navbarConstant } from '../constants'

const InsertUpdateUser = ({ user }) => {
    const token = localStorage.getItem('token')

    const { backendUrl, clientSecret } = config

    const [authUser] = useContext(AuthContext)
    const [navbar, setNavbar] = useContext(NavbarContext)

    const [fields, setFields] = useState({
        name: user ? user.name : '',
        username: user ? user.username : '',
        isAdmin: user ? user.isAdmin : 0,
        password: '',
        passwordConfirmation: '',
    })

    const [error, setError] = useState({
        name: null,
        username: null,
        password: null,
        passwordConfirmation: null,
        register: null,
    })
    const [isLoading, setIsLoading] = useState(false)

    const resetError = interval => {
        setTimeout(
            () =>
                setError({
                    username: null,
                    password: null,
                    passwordConfirmation: null,
                    register: null,
                }),
            interval,
        )
    }

    const handleInputChange = (value, type) => {
        switch (type) {
            case 'USERNAME':
                setFields({
                    ...fields,
                    username: value,
                })
                break
            case 'NAME':
                setFields({
                    ...fields,
                    name: value,
                })
                break
            case 'PASSWORD':
                setFields({
                    ...fields,
                    password: value,
                })
                break
            case 'PASSWORD_CONFIRMATION':
                setFields({
                    ...fields,
                    passwordConfirmation: value,
                })
                break
            case 'IS_ADMIN':
                setFields({
                    ...fields,
                    isAdmin: value,
                })
                break
            default:
                return null
        }
    }

    const onRegisterSubmit = () => {
        setIsLoading(true)

        if (!fields.name) {
            setError({
                ...error,
                name: 'Name tidak dapat kosong',
            })

            resetError(5000)

            return setIsLoading(false)
        }

        if (!fields.username) {
            setError({
                ...error,
                username: 'Username tidak dapat kosong',
            })

            resetError(5000)

            return setIsLoading(false)
        }

        if (!user) {
            if (!fields.password) {
                setError({
                    ...error,
                    password: 'Password tidak dapat kosong',
                })

                resetError(5000)

                return setIsLoading(false)
            }

            if (!fields.passwordConfirmation) {
                setError({
                    ...error,
                    passwordConfirmation: 'Konfirmasi tidak dapat kosong',
                })

                resetError(5000)

                return setIsLoading(false)
            }
        }

        if (fields.passwordConfirmation !== fields.password) {
            setError({
                ...error,
                password: 'Password tidak sama',
                passwordConfirmation: 'Password tidak sama',
            })

            resetError(5000)

            return setIsLoading(false)
        }

        if (!token) {
            history.go(-1)
        }

        if (!user) {
            fetch(`${backendUrl}/v1/auth/register`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    clientSecret,
                },
                body: JSON.stringify({
                    name: fields.name,
                    username: fields.username,
                    password: fields.password,
                }),
            })
                .then(response => {
                    response.json().then(data => {
                        if (data.code === 409) {
                            setError({
                                ...error,
                                register: 'Username sudah terdaftar!',
                            })

                            resetError(5000)

                            return setIsLoading(false)
                        }

                        navigate('/')
                    })
                })
                .catch(() => setIsLoading(false))
        } else {
            if (authUser.id !== user.id && !authUser.isAdmin) history.go(-1)

            fetch(`${backendUrl}/v1/user`, {
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    clientSecret,
                },
                body: JSON.stringify({
                    id: user.id,
                    name: fields.name,
                    username: fields.username,
                    password: fields.password ? fields.password : undefined,
                    isAdmin: fields.isAdmin,
                }),
            })
                .then(response => {
                    response.json().then(data => {
                        if (data.code === 409) {
                            setError({
                                ...error,
                                register: 'Username sudah terdaftar!',
                            })

                            resetError(5000)

                            return setIsLoading(false)
                        }

                        setNavbar(navbarConstant.ITEM)
                        navigate('/')
                    })
                })
                .catch(() => setIsLoading(false))
        }
    }

    if (!token) {
        setNavbar(navbarConstant.ITEM)
        navigate('/')
        window.location.reload()
    }

    return token ? (
        <Card centered style={styles.mainContainer}>
            <Card.Content>
                <Form onSubmit={onRegisterSubmit}>
                    <Form.Input
                        error={error.name}
                        value={fields.name}
                        label="Name"
                        placeholder="Julio Tanadi"
                        onChange={e =>
                            handleInputChange(e.target.value, 'NAME')
                        }
                    />
                    <Form.Input
                        error={error.username}
                        value={fields.username}
                        label="Username"
                        placeholder="e.g. adminhog"
                        onChange={e =>
                            handleInputChange(e.target.value, 'USERNAME')
                        }
                    />
                    <Form.Input
                        error={error.password}
                        value={fields.password}
                        label="Password"
                        placeholder="Password"
                        type="password"
                        onChange={e =>
                            handleInputChange(e.target.value, 'PASSWORD')
                        }
                    />
                    <Form.Input
                        error={error.passwordConfirmation}
                        value={fields.passwordConfirmation}
                        label="Masukan kembali password"
                        placeholder="Konfirmasi password"
                        type="password"
                        onChange={e =>
                            handleInputChange(
                                e.target.value,
                                'PASSWORD_CONFIRMATION',
                            )
                        }
                    />
                    {authUser && authUser.isAdmin && (
                        <Form.Field
                            error={error.categoryId}
                            label="Is admin?"
                            control="select"
                            onChange={e =>
                                handleInputChange(e.target.value, 'IS_ADMIN')
                            }
                            value={fields.isAdmin}
                        >
                            <option value={0}>No</option>
                            <option value={1}>Yes</option>
                        </Form.Field>
                    )}
                    {error.register && (
                        <Message
                            negative
                            header="Register error"
                            content={error.register}
                        />
                    )}
                    <Button loading={isLoading} color="blue">
                        {user ? 'Update' : 'Register'}
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

export default InsertUpdateUser
