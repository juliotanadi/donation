import React, { useContext, useState } from 'react'
import { Button, Card, Form, Message } from 'semantic-ui-react'
import { navigate } from '@reach/router'
import { AuthContext, NavbarContext } from '../contexts'
import config from '../../config'
import { navbarConstant } from '../constants'

const Login = () => {
    const { backendUrl, clientSecret } = config

    const [user, setUser] = useContext(AuthContext)
    const [navbar, setNavbar] = useContext(NavbarContext)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState({
        username: null,
        password: null,
        login: null,
    })
    const [isLoading, setIsLoading] = useState(false)

    const resetError = interval => {
        setTimeout(
            () =>
                setError({
                    username: null,
                    password: null,
                    login: null,
                }),
            interval,
        )
    }

    const handleInputChange = (value, type) => {
        switch (type) {
            case 'USERNAME':
                setUsername(value)
                break
            case 'PASSWORD':
                setPassword(value)
                break
            default:
                return null
        }
    }

    const onLoginSubmit = () => {
        setIsLoading(true)

        if (username === '') {
            setError({
                ...error,
                username: 'Username tidak dapat kosong',
            })

            resetError(5000)

            return setIsLoading(false)
        }

        if (password === '') {
            setError({
                ...error,
                password: 'Password tidak dapat kosong',
            })

            resetError(5000)

            return setIsLoading(false)
        }

        fetch(`${backendUrl}/v1/auth/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                clientSecret,
            },
            body: JSON.stringify({
                username,
                password,
            }),
        }).then(response => {
            response.json().then(({ data }) => {
                if (!data) {
                    setError({
                        ...error,
                        login: 'Username / password salah!',
                    })

                    resetError(5000)

                    return setIsLoading(false)
                }
                localStorage.removeItem('token')
                localStorage.setItem('token', data.token)

                setUser(data.user)

                navigate('/items')
            })
        })
    }

    if (user) {
        setNavbar(navbarConstant.ITEM)
        navigate('/items')
    }

    return user === null ? (
        <Card centered style={styles.mainContainer}>
            <Card.Content>
                <Form onSubmit={onLoginSubmit}>
                    <Form.Input
                        error={error.username}
                        value={username}
                        label="Username"
                        placeholder="e.g. adminhog"
                        onChange={e =>
                            handleInputChange(e.target.value, 'USERNAME')
                        }
                    />
                    <Form.Input
                        error={error.password}
                        value={password}
                        label="Password"
                        placeholder="Password"
                        type="password"
                        onChange={e =>
                            handleInputChange(e.target.value, 'PASSWORD')
                        }
                    />
                    {error.login && (
                        <Message
                            negative
                            header="Login error"
                            content={error.login}
                        />
                    )}
                    <Button loading={isLoading} color="blue">
                        Login
                    </Button>
                </Form>
            </Card.Content>
        </Card>
    ) : null
}

const styles = {
    mainContainer: {
        marginTop: '1%',
    },
}

export default Login
