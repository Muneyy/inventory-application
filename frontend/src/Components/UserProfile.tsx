import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Container, Image, Heading, Center, Text, Button, Stack, Link, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex, GridItem, Circle, Avatar, AvatarBadge, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react'
import {ArrowForwardIcon, CheckIcon} from '@chakra-ui/icons'
import { login, logout } from '../Features/currentUserSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useNavigate, useParams } from 'react-router-dom';
import {Link as RouteLink} from "react-router-dom";
import { CheckCircleIcon } from '@chakra-ui/icons'
import FriendAction from './Buttons/FriendAction';

function UserProfile () {
    const [loading, setLoading] = useState(0);
    const dispatch = useAppDispatch();
    const [fetchedUser, setFetchedUser] = useState<fetchedUserType>();
    const [friendRequestSent, setFriendRequestSent] = useState<boolean>(false);

    const { userId } = useParams();

    type fetchedUserType = {
        username: string,
        handle : string,
        bio: string,
        _id: string,
        avatarURL: string,
    }

    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    let loggedinUser: any = {};
    // Get token and refactor
    const token = useAppSelector(state => state.currentToken);
    let tokenJWT = ""

    // Refactor REDUX states
    if (currentUser.returned.length === 1) {
        loggedinUser = currentUser.returned[0];
        console.log(loggedinUser);
    }
    if (token.returned.length === 1) {
        tokenJWT = token.returned[0];
    }

    // Setup Friends Drawer using Chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef() as React.MutableRefObject<HTMLInputElement> & React.LegacyRef<HTMLButtonElement>;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                axios.defaults.headers.common["Authorization"] = `Bearer ${tokenJWT}`;

                await axios.get(`http://localhost:3000/users/${userId}`)
                    .then(res => {
                        setFetchedUser(res.data.user);
                    })

                // console.log(JSON.parse(JSON.stringify(reqUserData)));
                setLoading(1);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserData();
    }, [])

    // Sends a friend request to backend
    async function sendFriendRequest (recipient: string) {
        setFriendRequestSent(true);
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

        await refreshUserState();
    }

    const navigate = useNavigate();
    function navigateHome () {
        navigate("/");
    }

    async function refreshUserState () {
        await axios.get(`http://localhost:3000/users/${loggedinUser._id}`)
            .then(async (res) => {
                await dispatch(login(res.data.user));
                const updateUser = useAppSelector(state => state.currentUser);
                loggedinUser = updateUser.returned[0];
            })
            .catch(err => {
                console.log(err);
            })
    }

    // Make array of loggedinUser's friends to check
    // Also check if loggedinUser has already added viewed user
    const userFriends: string[] = []
    const addedFriends: string[] = []
    if (loggedinUser._id) {
        loggedinUser.friends.map((friend: {status: number,recipient: {_id: string}}) => {
            if (friend.status === 3) {
                userFriends.push(friend.recipient._id);
                // TODO: separate 2 from 1 to determine who sent friend request
            } else if (friend.status === 2 || friend.status === 1) {
                addedFriends.push(friend.recipient._id)
            }
        })
    }

    // TODO: Fix bug/ Add functionality
    // Frontend does not determine who sent/received friend request

    return (
        (loading) 
            ?   (
                (fetchedUser) 
                    ? (
                        <>
                            <Grid templateColumns={"230px 1fr"} gap={4}>
                                <GridItem display={"flex"} alignItems="center" justifyContent={"center"}>
                                    {(fetchedUser.avatarURL) 
                                        ? (
                                            <Image
                                                borderRadius='full'
                                                boxSize='200px'
                                                src={fetchedUser.avatarURL}
                                                objectFit="cover"
                                                alt='Avatar'/>
                                        ) 
                                        : (
                                            <Avatar size={"md"}></Avatar>
                                        )}
                                </GridItem>
                                <GridItem display={"flex"} justifyContent="center" alignItems="start" p={5} flexDir="column">
                                    <Text fontSize="5xl" fontWeight={700}>{fetchedUser.username}</Text>
                                    <Text fontSize={"sm"} fontWeight={300}>@{fetchedUser.handle}</Text>
                                    <Text fontSize={"md"} fontWeight={500}>{fetchedUser.bio}</Text>
                                    {/* TODO: remove add friend button if user is not logged in. */}

                                    {(loggedinUser._id)
                                        ? (
                                            (userFriends.includes(fetchedUser._id))
                                                ? (
                                                    <Button mt={1} disabled colorScheme="pink" ref={btnRef} onClick={() => sendFriendRequest(fetchedUser._id)} size="sm">
                                                        <CheckCircleIcon/>{"Friend"}
                                                    </Button> 
                                                ) 
                                                : (
                                                    (addedFriends.includes(fetchedUser._id)
                                                        ? (
                                                            <Button mt={1}  colorScheme="pink" ref={btnRef} onClick={() => sendFriendRequest(fetchedUser._id)} size="sm" disabled>
                                                                <CheckCircleIcon/>{"Friend Request sent"}
                                                            </Button>
                                                        )
                                                        : (
                                                            <Button mt={1}  colorScheme="pink" ref={btnRef} onClick={() => sendFriendRequest(fetchedUser._id)} size="sm" disabled={friendRequestSent}>
                                                                {"Add Friend"}
                                                            </Button>
                                                        ))
                                                )
                                        )
                                        : (
                                            <></>
                                        )}


                                </GridItem>
                            </Grid>
                        </>

                    ) 
                    : (

                        <Alert status='error'>
                            <AlertIcon />
                            <AlertTitle>Error!</AlertTitle>
                            <AlertDescription>User has not been found!</AlertDescription>
                        </Alert>
                    )
            ) 
            : (
                <Center mt={"5rem"} display="flex" flexDir={"column"}>
                    <Spinner />
                    <Text>Loading...</Text>
                </Center>
            )
    )
}

export default UserProfile;