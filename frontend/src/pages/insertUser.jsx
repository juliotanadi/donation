import React from 'react'
import { InsertUpdateUser } from '../components'
import Error from './error'

const InsertUser = () => {
    const token = localStorage.getItem('token')

    return token ? <InsertUpdateUser /> : <Error content="Not found" />
}

export default InsertUser
