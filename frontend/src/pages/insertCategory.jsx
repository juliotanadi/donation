import React from 'react'
import { InsertUpdateCategory } from '../components'
import Error from './error'

const InsertCategory = () => {
    const token = localStorage.getItem('token')

    return token ? <InsertUpdateCategory /> : <Error content="Not found!" />
}

export default InsertCategory
