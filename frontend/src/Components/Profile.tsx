import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Container, Heading, Center, Text, Button, Stack, Link, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex, GridItem, Circle, Avatar, AvatarBadge, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react'
import {ArrowForwardIcon} from '@chakra-ui/icons'
import { login, logout } from '../Features/currentUserSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-router-dom';
import {Link as RouteLink} from "react-router-dom";
import { CheckCircleIcon } from '@chakra-ui/icons'
import FriendAction from './Buttons/FriendAction';

function Profile () {
    const dispatch = useAppDispatch();
    // const [currentUser, setCurrentUser] = useState<any>({returned: []});

    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    let loggedinUser: any = {};
    // Get token and refactor
    const token = useAppSelector(state => state.currentToken);
    let tokenJWT = ""

    // Refactor REDUX states
    if (currentUser.returned.length === 1) {
        loggedinUser = currentUser.returned[0];
    }
    if (token.returned.length === 1) {
        tokenJWT = token.returned[0];
    }

    // Setup Friends Drawer using Chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef() as React.MutableRefObject<HTMLInputElement> & React.LegacyRef<HTMLButtonElement>;

    // Sends a friend request to backend
    async function sendFriendRequest (recipient: string) {
        const friendRequest = {
            requester: loggedinUser._id,
            recipient,
        }

        await axios.post('http://localhost:3000/friends/sendFriendRequest', friendRequest)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    }

    // Accepts a friend request
    async function acceptFriendRequest (recipient: string, e: React.MouseEvent<HTMLElement>) {
        // const target = e.target as HTMLInputElement
        // target.disabled = true;
        const friendRequest = {
            requester: loggedinUser._id,
            recipient,
        }

        await axios.post('http://localhost:3000/friends/acceptFriendRequest', friendRequest)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
        
        // update friends list by updating user state
        await refreshUserState()    
    }

    // Reject friend request
    async function rejectFriendRequest (recipient: string, e: React.MouseEvent<HTMLElement>) {
        const target = e.target as HTMLInputElement
        target.disabled = true;
        const friendRequest = {
            requester: loggedinUser._id,
            recipient,
        }

        await axios.post('http://localhost:3000/friends/rejectFriendRequest', friendRequest)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })

        // update friends list by updating user state
        await refreshUserState()    
    }

    const navigate = useNavigate();
    function navigateHome () {
        navigate("/");
    }

    async function refreshUserState () {
        await axios.get(`http://localhost:3000/users/${loggedinUser._id}`)
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

    return (
        (loggedinUser._id) 
            ?   (
                <Center backgroundColor={"teal.300"} p={10}>
                    <Box borderColor={"blackAlpha.300"} borderWidth='3px' borderRadius='lg' overflow='hidden' paddingX={15} paddingY={5}>
                        <Grid templateColumns={"2fr 5fr"} gap={4}>
                            <GridItem display={"flex"} alignItems="center" justifyContent={"center"} p={5}>
                                <Avatar size={"xl"}></Avatar>
                            </GridItem>
                            <GridItem display={"flex"} justifyContent="center" alignItems="start" p={5} flexDir="column">
                                <Text fontSize="5xl" fontWeight={700}>{loggedinUser.username}</Text>
                                <Text fontSize={"sm"} fontWeight={300}>@{loggedinUser.handle}</Text>
                                <Text fontSize={"md"} fontWeight={500}>{loggedinUser.bio}</Text>
                                <Button mt={1}  colorScheme="pink" ref={btnRef} onClick={onOpen} size="sm">Show Friends</Button>
                                <Button mt={1} size="sm" onClick={()=>navigateHome()}>Home</Button>
                                <Drawer
                                    isOpen={isOpen}
                                    placement='right'
                                    onClose={onClose}
                                    finalFocusRef={btnRef}
                                >
                                    <DrawerOverlay />
                                    <DrawerContent>
                                        <DrawerHeader>Friends</DrawerHeader>

                                        <DrawerBody>
                                            <Container px={8} py={5}>
                                                <Heading size="sm">Incoming Friend Requests:</Heading>
                                                {loggedinUser.friends?.map((friend: any) => {
                                                    return (
                                                        (friend.status === 2)
                                                            ? (
                                                                <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                                    <Flex flexDir={"row"} alignItems="center" gap={5}>
                                                                        <Avatar></Avatar>
                                                                        <Flex flexDir={"column"}>
                                                                            <Text fontSize="xl" fontWeight="bold">{friend.recipient.username}</Text>
                                                                            <Text fontSize="sm" color="gray">@{friend.recipient.handle}</Text>
                                                                            <Flex flexDir="row">
                                                                                <FriendAction acceptFriendRequest={acceptFriendRequest} rejectFriendRequest={rejectFriendRequest} id = {friend.recipient._id} />
                                                                                {/* <RejectButton rejectFriendRequest={rejectFriendRequest} id = {friend.recipient._id} /> */}
                                                                            </Flex>
                                                                        </Flex>
                                                                    </Flex>
                                                                </Container>
                                                            ) : (
                                                                <Text key={uuidv4()}></Text>
                                                            )
                                                    )
                                                })}
                                            </Container>
                                        </DrawerBody>
                                        <DrawerBody>
                                            <Container px={8} py={5}>
                                                <Heading size="sm">Sent Friend Requests:</Heading>
                                                {loggedinUser.friends.map((friend: any) => {
                                                    return (
                                                        (friend.status === 1)
                                                            ? (
                                                                <Container key={uuidv4()} display="flex" flexDir="column" borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                                    <Flex flexDir="row" gap={5} alignItems="center">
                                                                        <Avatar></Avatar>
                                                                        <Flex flexDir="column">
                                                                            <Text fontSize="xl" fontWeight="bold">{friend.recipient.username}</Text>
                                                                            <Text fontSize="sm" color="gray">@{friend.recipient.handle}</Text>
                                                                            <Button size="sm" colorScheme="gray" alignSelf="end" disabled> Pending </Button>
                                                                        </Flex>
                                                                    </Flex>
                                                                </Container>
                                                            ) : (
                                                                <Text key={uuidv4()}></Text>
                                                            )
                                                    )
                                                })}
                                            </Container>
                                        </DrawerBody>

                                        <DrawerBody>
                                            <Container px={8} py={5}>
                                                <Heading size="sm">Friends:</Heading>
                                                {loggedinUser.friends?.map((friend: any) => {
                                                    return (
                                                        (friend.status === 3)
                                                            ? (
                                                                <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                                    <Flex flexDir="row" gap={5} alignItems="center">
                                                                        <Avatar></Avatar>
                                                                        <Flex flexDir={"column"}>
                                                                            <Text fontSize="xl" fontWeight="bold">{friend.recipient.username}</Text>
                                                                            <Text fontSize="sm" color="gray">@{friend.recipient.handle}</Text>
                                                                            <Button size ="sm" colorScheme="pink" disabled> Friend </Button>
                                                                        </Flex>
                                                                    </Flex>
                                                                </Container>
                                                            ) : (
                                                                <Text key={uuidv4()}></Text>
                                                            )
                                                    )
                                                })}
                                            </Container>
                                        </DrawerBody>

                                        {/* <DrawerFooter>
                                            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
                                            </Button>
                                            <Button colorScheme='teal'>Save</Button>
                                        </DrawerFooter> */}
                                    </DrawerContent>
                                </Drawer>
                            </GridItem>
                        </Grid>
                    </Box>
                </Center>
            ) 
            : (
                <Alert status='error'>
                    <AlertIcon />
                    <AlertTitle>Please log in first!</AlertTitle>
                    <AlertDescription>View your profile here after logging in.</AlertDescription>
                </Alert>
            )
    )
}

export default Profile;