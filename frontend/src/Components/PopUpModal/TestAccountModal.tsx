import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Text, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import {
    randCatchPhrase,
    randEmail,
    randFirstName,
    randLastName,
    randPassword,
    randTextRange,
    randUserName,
} from "@ngneat/falso";
import axios from 'axios';
import { useAppDispatch } from '../../app/hooks';
import { useNavigate } from "react-router-dom";
import { setToken, removeToken } from '../../Features/currentTokenSlice';
import { login, logout } from '../../Features/currentUserSlice';
import persistStore from "redux-persist/es/persistStore";
import store from "../../app/store";

function TestAccountModal({userIsLoggedIn} : {
    userIsLoggedIn: boolean
}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [showTestModal, setShowTestModal] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const persistor = persistStore(store);

    useEffect(() => {
        if (!userIsLoggedIn) {
            setShowTestModal(true);
        }
    }, [userIsLoggedIn])

    function handleClose () {
        onClose();
        setShowTestModal(false);
    }

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // BAD DUPLICATE CODE
    // TODO: REFACTOR THIS CODE TOGETHER WITH SettingsModal
    async function createTestAccount () {
        setIsSubmitting(true);
        const testUserHandle = 'Test' + randTextRange({ min: 4, max: 8 }).replace(/\s/g,'');
        const testUserPassword = `$1` + randPassword();
        const testUser = {
            username: 'TestUser' + randTextRange({ min: 2, max: 5 }).replace(/\s/g,''),
            handle: testUserHandle,
            password: testUserPassword,
            bio: randCatchPhrase(),
            email: randEmail(),
        };

        await axios.post("http://localhost:3000/users/post", testUser)
            .then(res => {
                const persistor = persistStore(store);
                persistor.purge();
            })
            .catch(err => {
                console.error(err);
            })

        await axios.post('http://localhost:3000/log-in', {
            username: testUserHandle,
            password: testUserPassword
        })
            .then(res => {
                // Change REDUX current state user here
                dispatch(login(res.data.user));
                dispatch(setToken(res.data.token));
                onClose();
                navigate("/profile");
                setIsSubmitting(false);
            })
            .catch(err => {
                console.error(err);
            })
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
                    <Button disabled={isSubmitting} colorScheme='yellow' mr={3} onClick={createTestAccount}>
                        {isSubmitting ? <Spinner></Spinner> : "Test Drive an Account"}
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