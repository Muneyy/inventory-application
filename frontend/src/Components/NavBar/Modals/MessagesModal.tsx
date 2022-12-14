import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
} from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons';

const MessagesModal = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button size="sm" onClick={onOpen}>
                <ChatIcon />
            </Button>
      
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Messages</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    </ModalBody>
                    <ModalFooter>
                        <Button size="md" colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default MessagesModal