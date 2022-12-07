import React from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useAppSelector, useAppDispatch } from '../../app/hooks'
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
    Container,
    Text,
    Flex,
    Image,
    Avatar,
} from '@chakra-ui/react'
import { PlusSquareIcon } from '@chakra-ui/icons';
import { login, logout } from '../../Features/currentUserSlice';
import FriendAction from '../Buttons/FriendAction';

const FriendRequestsModal = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    let loggedinUser: any = {};

    // Refactor code for convenience
    if (currentUser.returned.length === 1) {
        loggedinUser = currentUser.returned[0];
    }

    // Get token and refactor
    const token = useAppSelector(state => state.currentToken);
    let tokenJWT = ""

    if (token.returned.length === 1) {
        tokenJWT = token.returned[0];
    }

    const JWTconfig = {
        headers: { Authorization: `Bearer ${tokenJWT}` }
    };

    const dispatch = useAppDispatch();

    // Accepts a friend request
    async function acceptFriendRequest (recipient: string) {
        const friendRequest = {
            requester: loggedinUser._id,
            recipient,
        }
  
        await axios.post('http://localhost:3000/friends/acceptFriendRequest', friendRequest, JWTconfig)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })

        await refreshUserState();
        
    }
  
    // Reject friend request
    async function rejectFriendRequest (recipient: string) {
        const friendRequest = {
            requester: loggedinUser._id,
            recipient,
        }
  
        await axios.post('http://localhost:3000/friends/rejectFriendRequest', friendRequest, JWTconfig)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })

        await refreshUserState();
    }

    // GET request to get updated attributes of updated logged in user
    async function refreshUserState () {
        await axios.get(`http://localhost:3000/users/${loggedinUser._id}`, JWTconfig)
            .then(async (res) => {
                console.log(res);
                await dispatch(login(res.data.user));
                const updateUser = useAppSelector(state => state.currentUser);
                loggedinUser = updateUser.returned[0];
            })
            .catch(err => {
                console.log(err);
            })
    }

    console.log(loggedinUser);

    return (
        <>
            <Button size="sm" onClick={onOpen}>
                <PlusSquareIcon />
            </Button>
      
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Friend Requests</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {loggedinUser?.friends?.map((friend: any) => {
                            return (
                                (friend.status === 2)
                                    ? (
                                        <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                            {/* Sometimes recipient is null (probably deleted user without deleting friends.) 
                                                so we need to check if recipient is not null*/}
                                            {friend.recipient
                                                ? (

                                                    <Flex flexDir={"row"} alignItems="center" gap={5}>
                                                        {
                                                            (friend.recipient?.avatarURL) 
                                                                ? (
                                                                    <Image
                                                                        borderRadius='full'
                                                                        boxSize='50px'
                                                                        src={friend.recipient.avatarURL}
                                                                        objectFit="cover"
                                                                        alt='Avatar'/>
                                                                ) 
                                                                : (
                                                                    <Avatar size={"md"}></Avatar>
                                                                )
                                                        }
                                                        <Flex flexDir={"column"} w="" flex={"1"}>
                                                            <Text fontSize="xl" fontWeight="bold">{friend.recipient.username}</Text>
                                                            <Text fontSize="sm" color="gray">@{friend.recipient.handle}</Text>
                                                            <FriendAction acceptFriendRequest={acceptFriendRequest} rejectFriendRequest={rejectFriendRequest} id = {friend.recipient._id} />
                                                        </Flex>
                                                    </Flex>
                                                )
                                                : (
                                                    <></>
                                                )}
                                        </Container>
                                    ) : (
                                        <Text key={uuidv4()}></Text>
                                    )
                            )
                        })}
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default FriendRequestsModal