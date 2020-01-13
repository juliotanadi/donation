import React, { useContext, useEffect, useState } from 'react'
import { navigate } from '@reach/router'
import { Message, Progress } from 'semantic-ui-react'
import { NavbarContext } from '../contexts'
import { navbarConstant } from '../constants'

const Error = ({ content }) => {
    const [navbar, setNavbar] = useContext(NavbarContext)
    setNavbar('')

    const [percentage, setPercentage] = useState(10)

    useEffect(() => {
        if (percentage !== 100)
            setTimeout(() => setPercentage(percentage + 10), 1000)
        if (percentage === 100) {
            setNavbar(navbarConstant.ITEM)
            navigate('/items')
        }
    }, [percentage])

    return (
        <div style={styles.mainContainer}>
            <Message
                negative
                header={content}
                content={`You will be redirected to home in ${Math.abs(
                    percentage - 100,
                ) / 10} second${
                    Math.abs(percentage - 100) / 10 > 1 ? 's' : ''
                }!`}
            />
            <Progress percent={percentage} error />
        </div>
    )
}

const styles = {
    mainContainer: {
        padding: '2%',
    },
}

export default Error
