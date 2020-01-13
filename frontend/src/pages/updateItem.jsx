import React, { useContext, useEffect, useState } from 'react'
import { navigate } from '@reach/router'
import { Loader } from 'semantic-ui-react'
import { AuthContext, NavbarContext } from '../contexts'
import { InsertUpdateItem } from '../components'
import config from '../../config'
import { navbarConstant } from '../constants'

const UpdateItem = ({ id }) => {
    const { backendUrl, clientSecret } = config

    const [navbar, setNavbar] = useContext(NavbarContext)
    const [user] = useContext(AuthContext)

    const [item, setItem] = useState(null)

    useEffect(() => {
        fetch(`${backendUrl}/v1/item/${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (localStorage.getItem('token'))
                response.json().then(data => {
                    if (data.code === 200) return setItem(data.data)
                    else history.go(-1)
                })
        })
    }, [])

    if (!localStorage.getItem('token')) {
        setNavbar(navbarConstant.ITEM)
        navigate('/items')
        window.location.reload()
    }

    return item ? (
        <InsertUpdateItem item={item} />
    ) : (
        <Loader active inline="centered" />
    )
}

export default UpdateItem
