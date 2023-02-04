import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import persistStore from "redux-persist/es/persistStore";
import store from "../../../app/store";
import { useAppSelector } from "../../../app/hooks";
import { useGetUserAndToken } from "../../../HelperFunctions/useGetUserandToken";
import axios from "axios";
import {
    randCatchPhrase,
    randEmail,
    randFirstName,
    randLastName,
    randPassword,
    randTextRange,
    randUserName,
} from "@ngneat/falso";
import { UserType } from "../../../Types/UserType";
import { setToken, removeToken } from '../../../Features/currentTokenSlice';
import { login, logout } from '../../../Features/currentUserSlice';
import {  useAppDispatch } from '../../../app/hooks';
import { useNavigate } from "react-router-dom";

const SettingsModal = () => {
    const [loggedinUser, tokenJWT] = useGetUserAndToken();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [testUserAccount, setTestUserAccount] = useState<UserType>();

    // Logout user and then reload
    const persistor = persistStore(store);
    const logoutUser = () => {
        persistor.purge();
        window.location.reload();
    };

    const { isOpen, onOpen, onClose } = useDisclosure();

    async function createTestAccount() {
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
                setTestUserAccount(res.data.user);
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
            })
            .catch(err => {
                console.error(err);
            })
            
    }

    return (
        <>
            <Button size="sm" onClick={onOpen}>
                <SettingsIcon></SettingsIcon>
            </Button>
            {/* <Button onClick={onOpen}>Settings</Button> */}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Settings</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Button colorScheme={"yellow"} onClick={createTestAccount}>
                            {"Test drive an existing account"}
                        </Button>
                    </ModalBody>
                    {loggedinUser._id ? (
                        <ModalFooter>
                            <Button
                                size="md"
                                onClick={() => logoutUser()}
                                colorScheme="red"
                            >
                                {" "}
                                Log Out{" "}
                            </Button>
                        </ModalFooter>
                    ) :                         <ModalFooter>
                        <Button
                            size="md"
                            onClick={onClose}
                            colorScheme="red"
                        >
                            {" "}
                        Close{" "}
                        </Button>
                    </ModalFooter>}
                </ModalContent>
            </Modal>
        </>
    );
};

export default SettingsModal;
