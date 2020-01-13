import React, { useState, useEffect } from 'react'
import { Router } from '@reach/router'
import { AuthContext, NavbarContext } from './contexts'
import { Navbar } from './components'
import {
    CategoryDetail,
    Categories,
    Error,
    InsertCategory,
    InsertItem,
    InsertUser,
    Items,
    Login,
    Profile,
    Register,
    UpdateCategory,
    UpdateItem,
    UpdateUser,
    Users,
} from './pages'
import config from '../config'

const App = () => {
    const { backendUrl, clientSecret } = config

    const userHook = useState(null)
    const navbarHook = useState('')
    const [_, setUser] = userHook

    useEffect(() => {
        checkLoginState()
    }, [])

    const checkLoginState = () => {
        const token = localStorage.getItem('token')

        if (!token || token === '') return setUser(null)

        fetch(`${backendUrl}/v1/auth/check`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                clientSecret,
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
        }).then(response => {
            response.json().then(data => {
                if (data.code === 200) setUser(data.data)
            })
        })
    }

    return (
        <AuthContext.Provider value={userHook}>
            <NavbarContext.Provider value={navbarHook}>
                <Navbar />
                <Router>
                    <Items path="/" />
                    <Items path="/items" />
                    <InsertItem path="/items/add" />
                    <UpdateItem path="/items/update/:id" />
                    <Categories path="/categories" />
                    <InsertCategory path="/categories/add" />
                    <UpdateCategory path="/categories/update/:id" />
                    <CategoryDetail path="categories/:id" />
                    <Users path="/users" />
                    <InsertUser path="/users/add" />
                    <UpdateUser path="/users/update/:id" />
                    <Login path="/login" />
                    <Register path="/register" />
                    <Profile path="/me" />
                    <Error content="Not found!" default />
                </Router>
            </NavbarContext.Provider>
        </AuthContext.Provider>
    )
}

export default App
