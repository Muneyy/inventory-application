import React, { useEffect } from 'react';
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
import store from '../../../app/store';
import { useAppSelector } from '../../../app/hooks';
import { useGetUserAndToken } from '../../../HelperFunctions/useGetUserandToken';

const SettingsModal = () => {

    const [loggedinUser, tokenJWT] = useGetUserAndToken();

    // Logout user and then reload
    const persistor = persistStore(store);
    const logoutUser = () => {
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
                    {(loggedinUser._id)
                        ? (
                            <ModalFooter>
                                <Button size="md" 
                                    onClick={() => logoutUser()} 
                                    colorScheme="red"> Log Out </Button>
                            </ModalFooter>
                        )
                        : (
                            null
                        )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default SettingsModal