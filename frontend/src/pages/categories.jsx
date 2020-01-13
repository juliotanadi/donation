import React, { useEffect, useState } from 'react'
import { Loader } from 'semantic-ui-react'
import { Category } from '../components'
import config from '../../config'

const Categories = () => {
    const { backendUrl, clientSecret } = config

    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetch(`${backendUrl}/v1/category`, {
            method: 'GET',
            headers: {
                clientSecret,
            },
        }).then(response => {
            response.json().then(data => {
                if (data.code === 200) setCategories(data.data)
                else history.go(-1)
            })
        })
    }, [])

    return (
        <React.Fragment>
            <Loader active={categories.length === 0} inline="centered" />
            {categories.map(category => (
                <Category key={category.id} category={category} />
            ))}
        </React.Fragment>
    )
}

export default Categories
