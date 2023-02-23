import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

function TestAccountModal({userIsLoggedIn} : {
    userIsLoggedIn: boolean
}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [showTestModal, setShowTestModal] = useState<boolean>(false);

    useEffect(() => {
        if (!userIsLoggedIn) {
            setShowTestModal(true);
        }
    }, [userIsLoggedIn])

    function handleClose () {
        onClose();
        setShowTestModal(false);
    }

    return (
        <Modal isOpen={showTestModal} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Hello There!</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>To be able to upload collections, add friends, like, and comment, you need an account.</Text>
                    <br></br>
                    <Text>Would you like to use a test account to have full access to these features?</Text>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='yellow' mr={3} onClick={onClose}>
                Test Drive an Account
                    </Button>
                    <Button colorScheme='pink' mr={3} onClick={handleClose}>
                No Thanks
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default TestAccountModal