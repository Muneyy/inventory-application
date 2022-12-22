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
import { SettingsIcon } from '@chakra-ui/icons';
import persistStore from 'redux-persist/es/persistStore';
import store from '../../app/store';

const SettingsModal = (props: {
    loggedinUser: any
}) => {

    // Logout user and then reload
    const persistor = persistStore(store);
    function logoutUser () {
        persistor.purge();
        window.location.reload();
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button size="sm" onClick={onOpen}>
                <SettingsIcon ></SettingsIcon>
            </Button>
            {/* <Button onClick={onOpen}>Settings</Button> */}
      
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Settings</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    </ModalBody>
                    {(props.loggedinUser._id)
                        ? (
                            <ModalFooter>
                                <Button size="md" onClick={logoutUser} colorScheme="red"> Log Out </Button>
                            </ModalFooter>
                        )
                        : (
                            <ModalFooter>
                            </ModalFooter>
                        )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default SettingsModal