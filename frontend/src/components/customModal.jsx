import React, { useState } from 'react'
import { Button, Header, Icon, Modal, Loader } from 'semantic-ui-react'

const CustomModal = ({ isOpen, title, content, noHandler, yesHandler }) => {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <Modal open={isOpen} basic size="small">
            <Header icon="archive" content={title} />
            <Modal.Content>
                <p>{content}</p>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    color="youtube"
                    onClick={() => {
                        yesHandler(), setIsLoading(true)
                    }}
                    loading={isLoading}
                >
                    <Icon name="checkmark" /> Yes
                </Button>
                <Button color="green" onClick={noHandler}>
                    <Icon name="remove" /> No
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default CustomModal
