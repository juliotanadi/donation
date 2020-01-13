import React, { useContext, useState } from 'react'
import { Button, Card, Icon, Image, Modal, Header } from 'semantic-ui-react'
import { Link } from '@reach/router'
import { CustomModal } from '../components'
import { AuthContext } from '../contexts'
import config from '../../config'

const Item = ({
    id,
    name,
    description,
    quantity,
    image,
    category,
    user: { id: ownerId },
}) => {
    const { backendUrl, clientSecret } = config

    const [user] = useContext(AuthContext)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const deleteItemHandler = id => {
        fetch(`${backendUrl}/v1/item`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                clientSecret,
            },
            body: JSON.stringify({ id }),
        }).then(response => {
            response.json().then(data => {
                if (data.code === 200) window.location.replace('/')
            })
        })
    }

    return (
        <Card centered style={styles.card}>
            {image ? (
                <Image src={`${backendUrl}/${image}`} wrapped />
            ) : (
                <Image src="https://picsum.photos/id/1010/300" wrapped />
            )}
            <Card.Content>
                <Card.Header>{name || 'Item Name'}</Card.Header>
                {category && (
                    <Card.Meta>
                        <Link to={`/categories/${category.id}`}>
                            {category.name}
                        </Link>
                    </Card.Meta>
                )}
                <Card.Content>{description || 'Item Description'}</Card.Content>
                <Card.Description>{quantity || 0} pc(s)</Card.Description>
            </Card.Content>
            {user && (user.id == ownerId || user.isAdmin) && (
                <React.Fragment>
                    <CustomModal
                        isOpen={isModalOpen}
                        title="Are you sure to delete this item?"
                        content="This action cannot be undone"
                        yesHandler={() => deleteItemHandler(id)}
                        noHandler={() => setIsModalOpen(false)}
                    />
                    <Card.Content extra>
                        <Link to={`/items/update/${id}`}>
                            <Button icon color="yellow">
                                <Icon name="edit" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            icon
                            color="youtube"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Icon name="delete" />
                            Delete
                        </Button>
                    </Card.Content>
                </React.Fragment>
            )}
        </Card>
    )
}

const styles = {
    card: {
        marginTop: '2%',
        marginBottom: '2%',
    },
}

export default Item
