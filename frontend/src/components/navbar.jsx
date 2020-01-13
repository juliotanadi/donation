import React, { useContext, useEffect } from 'react'
import { Link, navigate } from '@reach/router'
import { Container, Icon, Menu } from 'semantic-ui-react'
import { AuthContext, NavbarContext } from '../contexts'
import { navbarConstant } from '../constants'

const Navbar = () => {
    const [user, setUser] = useContext(AuthContext)
    const [navbar, setNavbar] = useContext(NavbarContext)

    const currentPath = window.location.pathname

    if (currentPath.startsWith('/items/add')) setNavbar(navbarConstant.ITEM_ADD)
    else if (currentPath.startsWith('/items')) setNavbar(navbarConstant.ITEM)
    else if (currentPath.startsWith('/categories/add'))
        setNavbar(navbarConstant.CATEGORY_ADD)
    else if (currentPath.startsWith('/categories'))
        setNavbar(navbarConstant.CATEGORY)
    else if (currentPath.startsWith('/login')) setNavbar(navbarConstant.LOGIN)
    else if (currentPath.startsWith('/register'))
        setNavbar(navbarConstant.USER_MANAGEMENT)

    const onLogoutClick = () => {
        setNavbar(navbarConstant.ITEM)
        setUser(null)
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <Container style={{ width: '100%' }}>
            <Menu stackable>
                <Link
                    to="/items"
                    onClick={() => setNavbar(navbarConstant.ITEM)}
                >
                    <Menu.Item link active={navbar === navbarConstant.ITEM}>
                        Barang
                    </Menu.Item>
                </Link>
                <Link
                    to="/categories"
                    onClick={() => setNavbar(navbarConstant.CATEGORY)}
                >
                    <Menu.Item link active={navbar === navbarConstant.CATEGORY}>
                        Kategori
                    </Menu.Item>
                </Link>
                {!user && (
                    <React.Fragment>
                        <Menu.Item
                            link
                            active={navbar === navbarConstant.LOGIN}
                            position="right"
                            onClick={() => {
                                setNavbar(navbarConstant.LOGIN)
                                navigate('/login')
                            }}
                        >
                            Login
                        </Menu.Item>
                    </React.Fragment>
                )}

                {user && (
                    <React.Fragment>
                        {user.isAdmin && (
                            <Menu.Item
                                link
                                active={navbar === navbarConstant.CATEGORY_ADD}
                                onClick={() => {
                                    setNavbar(navbarConstant.CATEGORY_ADD)
                                    navigate('/categories/add')
                                }}
                            >
                                Add category
                            </Menu.Item>
                        )}
                        <Menu.Item
                            link
                            active={navbar === navbarConstant.ITEM_ADD}
                            onClick={() => {
                                setNavbar(navbarConstant.ITEM_ADD)
                                navigate('/items/add')
                            }}
                        >
                            Add item
                        </Menu.Item>
                        <Menu.Item
                            position="right"
                            link
                            active={navbar === navbarConstant.PROFILE}
                            onClick={() => {
                                setNavbar(navbarConstant.PROFILE)
                                navigate('/me')
                            }}
                        >
                            <Icon name="user" />
                            {user.name}
                        </Menu.Item>
                        {user.isAdmin && (
                            <Menu.Item
                                link
                                active={
                                    navbar === navbarConstant.USER_MANAGEMENT
                                }
                                onClick={() => {
                                    setNavbar(navbarConstant.USER_MANAGEMENT)
                                    navigate('/users')
                                }}
                            >
                                User management
                            </Menu.Item>
                        )}
                        <Menu.Item link onClick={onLogoutClick}>
                            Logout
                        </Menu.Item>
                    </React.Fragment>
                )}
            </Menu>
        </Container>
    )
}

export default Navbar
