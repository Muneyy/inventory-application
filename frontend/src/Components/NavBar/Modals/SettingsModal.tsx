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

const SettingsModal = () => {

    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    let loggedinUser: any = {};

    // Refactor code for convenience
    if (currentUser.returned.length === 1) {
        loggedinUser = currentUser.returned[0];
    }

    // Subscribe to changes when loggedinUser changes in react redux
    // Update friends after the dispatch call in refreshUserState() 
    // after accepting friend request. This is better than refreshing the page.
    useEffect(() => {
        loggedinUser = currentUser.returned[0]
    }, [currentUser])

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