import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Container, Heading, Center, Text, Button, Stack, Link, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex } from '@chakra-ui/react'
import {ArrowForwardIcon} from '@chakra-ui/icons'
import { login, logout } from '../Features/currentUserSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-router-dom';
import {Link as RouteLink} from "react-router-dom";
import { useFormik } from 'formik';
import { current } from '@reduxjs/toolkit';
import { userInfo } from 'os';

import  IncomingFriendRequests  from "./Friends/incomingFR"
import SentFriendRequests from './Friends/sentFR';

function Home() {
    const [loading, setLoading] = useState(0);
    const [reqUserData, setReqUserData] = useState<any>([]);
    const [reqCollectionData, setReqCollectionData] = useState<any>([]);

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

    // import dispatch to dispatch payloads to redux
    const dispatch = useAppDispatch();
    // navigate to other routers in react-router
    const navigate = useNavigate();

    // import needed chakra ui components for pop up boxes
    const { isOpen, onToggle } = useDisclosure()

    useEffect(() => {
        // At page mount, get users and collections to display them
        const fetchData = async () => {
            try {
                axios.defaults.headers.common["Authorization"] = `Bearer ${tokenJWT}`;
                const endpoints = ['http://localhost:3000/users', 'http://localhost:3000/collections'];
                await axios.all(endpoints.map((endpoint) => 
                    axios.get(endpoint)
                )).then(axios.spread((users, collections) => {
                    setReqUserData(users.data);
                    setReqCollectionData(collections.data);
                    console.log(JSON.parse(JSON.stringify(currentUser)));
                    console.log("huh?");
                }))

                // console.log(JSON.parse(JSON.stringify(reqUserData)));
                setLoading(1);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    // Logout user and then reload
    function logoutUser () {
        dispatch(logout);
        window.location.reload();
    }

    async function testJWT () {
        console.log(tokenJWT);
        const config = {
            headers: { Authorization: `Bearer ${tokenJWT}` }
        };
        await axios.get('http://localhost:3000/items', config)
            .then(res => {
                console.log(res);
            })
    }

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

        
    }

    // Accepts a friend request
    async function acceptFriendRequest (recipient: string) {
        const friendRequest = {
            requester: loggedinUser._id,
            recipient,
        }

        await axios.post('http://localhost:3000/friends/acceptFriendRequest', friendRequest)
            .then(res => {
                console.log(res);
            })
    }

    // Reject friend request
    async function rejectFriendRequest (recipient: string) {
        const friendRequest = {
            requester: loggedinUser._id,
            recipient,
        }

        await axios.post('http://localhost:3000/friends/rejectFriendRequest', friendRequest)
            .then(res => {
                console.log(res);
            })
    }

    return (
        (loading)
            ? (
                <>
                    <Center mt="5rem" flexDirection="column">
                        {/* If there is a current user logged in, display welcome message and current friends */}
                        {(currentUser.returned.length === 1)
                            ? (
                                <>
                                    <Heading> Welcome back {loggedinUser.username}. </Heading>
                                    <Button onClick={logoutUser}> Logout </Button>
                                    <Button mt="1rem" onClick={onToggle} size="md" colorScheme={"telegram"}>Show Friends</Button>
                                    <Center mt="2rem" flexDirection="column">
                                        {/* Code to display sent friend requests */}
                                        {(loggedinUser.friends.length != 0)
                                            ? ( 
                                                <Flex flexDirection="row" gap="100">
                                                    <Box>
                                                        <Collapse in={isOpen} animateOpacity>
                                                            <Button onClick={onToggle} size="md">Incoming Friend Requests:</Button>
                                                            {loggedinUser.friends?.map((friend: any) => {
                                                                return (
                                                                    (friend.status === 2)
                                                                        ? (
                                                                            <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                                                <Text fontSize="xl" fontWeight="bold">{friend.recipient.username}</Text>
                                                                                <Button onClick={() => acceptFriendRequest(friend.recipient._id)} size ="sm" colorScheme="teal"> Accept </Button>
                                                                                <Button onClick={() => rejectFriendRequest(friend.recipient._id)} size ="sm" colorScheme="red"> Reject </Button>
                                                                            </Container>
                                                                        ) : (
                                                                            <Text key={uuidv4()}></Text>
                                                                        )
                                                                )
                                                            })}
                                                        </Collapse>
                                                    </Box>
                                                    <Box>
                                                        <Collapse in={isOpen} animateOpacity>
                                                            <Button onClick={onToggle} size="md">Sent Friend Requests:</Button>
                                                            {loggedinUser.friends.map((friend: any) => {
                                                                return (
                                                                    (friend.status === 1)
                                                                        ? (
                                                                            <Container key={uuidv4()} display="flex" flexDir="column" borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                                                <Text fontSize="xl" fontWeight="bold">{friend.recipient.username}</Text>
                                                                                <Text fontSize="lg" color="gray">{friend.recipient.bio}</Text>
                                                                                <Button size="sm" colorScheme="gray" alignSelf="end" disabled> Pending </Button>
                                                                            </Container>
                                                                        ) : (
                                                                            <Text key={uuidv4()}></Text>
                                                                        )
                                                                )
                                                            })}
                                                        </Collapse>
                                                    </Box>
                                                    <Box>
                                                        <Collapse in={isOpen} animateOpacity>
                                                            <Button onClick={onToggle} size="md">Friends:</Button>
                                                            {loggedinUser.friends?.map((friend: any) => {
                                                                return (
                                                                    (friend.status === 3)
                                                                        ? (
                                                                            <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                                                <Text fontSize="xl" fontWeight="bold">{friend.recipient.username}</Text>
                                                                                <Button size ="sm" colorScheme="pink" disabled> Friend </Button>
                                                                            </Container>
                                                                        ) : (
                                                                            <Text key={uuidv4()}></Text>
                                                                        )
                                                                )
                                                            })}
                                                        </Collapse>
                                                    </Box>
                                                </Flex>
                                            ): (
                                                <Text> No friends </Text>
                                            )}
                                    </Center>
                                </>
                            ) : (
                                <Heading> Log in below. </Heading>
                            )}
                    </Center>



                    <Center mt={"1rem"}>
                        <Container borderWidth='1px' borderRadius='lg' py={"5"} px={"10"} minW="3xl" centerContent>
                            <Heading fontSize="5xl" fontWeight="extrabold">
                            Create Here!
                            </Heading>
                            <Grid templateColumns='repeat(2, 50%)' gap='10' alignItems="start" mt="2">

                                {/* Displays current users */}
                                <Center flexDirection="column">
                                    <Heading size="m">Current Users:</Heading>
                                    {reqUserData.map((user:any) => {
                                        return (
                                            (currentUser.returned.length === 1)
                                                ? (
                                                    // Check if user is the logged in User,
                                                    // if it is, then return an empty Text container
                                                    (loggedinUser.username == user.username)
                                                        ? (
                                                            <Text key={uuidv4()}></Text>
                                                        ) : (
        
                                                    // Do not display logged in user in list of current users.
                                                            <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                                <Text fontSize="xl" fontWeight="bold">{user.username}</Text>
                                                                <Text fontSize="m">{user.bio}</Text>
                                                                <Button colorScheme="teal" onClick={() => sendFriendRequest(user._id)}>Add Friend</Button>
                                                            </Container>
                                                        )
                                                ) : (
                                                    <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                        <Text fontSize="xl" fontWeight="bold">{user.username}</Text>
                                                        <Text fontSize="m">{user.bio}</Text>
                                                        <Button size="m" colorScheme="teal" disabled> Please login to add them as a friend.</Button>
                                                    </Container>
                                                )
                                        )
                                    })}
                                </Center>


                                <Center flexDirection="column">
                                    <Heading size="m">Current Collections:</Heading>
                                    {reqCollectionData.map((collection:any) => {
                                        return (
                                            <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                <Text fontSize="xl" fontWeight="bold">{collection.name}</Text>
                                                <Text fontSize="m">{collection.summary}</Text>
                                                <Text fontSize="m">Owned by: {collection.user.username}</Text>
                                            </Container>
                                        )
                                    })}
                                </Center>
                            </Grid>
                            <Text mt="1rem">
                            Select which category you would like to create:
                            </Text>
                            <Stack direction="row" spacing={4} mt={3}>
                                <RouteLink to='/createUser' style={{ textDecoration: 'none' }}>
                                    <Button rightIcon={<ArrowForwardIcon />} variant="solid" colorScheme="teal">
                                    Sign up
                                    </Button>
                                </RouteLink>
                                <RouteLink to='/login' style={{ textDecoration: 'none' }}>
                                    <Button rightIcon={<ArrowForwardIcon />} variant="solid" colorScheme="teal">
                                    Log in
                                    </Button>
                                </RouteLink>

                                <RouteLink to="/createCollection">
                                    <Button rightIcon={<ArrowForwardIcon />} variant="outline" colorScheme="teal">
                                        Collection
                                    </Button>
                                </RouteLink>

                                {/* <RouteLink to='/createItem' style={{ textDecoration: 'none' }}> */}
                                <Button onClick = {() => testJWT()} rightIcon={<ArrowForwardIcon />} variant="outline" colorScheme="teal">
                                    Item
                                </Button>
                                {/* </RouteLink> */}
                            </Stack>
                        </Container>
                    </Center>
                </>

                    
            )
            : (
                <div>
                    <h1>
                        <Center mt={"5rem"} display="flex" flexDir={"column"}>
                            <Spinner />
                            <Text>Loading...</Text>
                        </Center>
                    </h1>
                </div>
            )
    );

}

export default Home;