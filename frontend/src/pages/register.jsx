import React, { useContext, useState } from 'react'
import { Button, Card, Form, Message } from 'semantic-ui-react'
import { navigate } from '@reach/router'
import { AuthContext, NavbarContext } from '../contexts'
import config from '../../config'
import { InsertUpdateUser } from '../components'

const Register = () => {
    return <InsertUpdateUser />
}

export default Register
