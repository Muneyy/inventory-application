import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Image, Container, Heading, Center, Text, Button, Stack, Link, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex, GridItem, Circle, Avatar, AvatarBadge, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react'
import {ArrowForwardIcon, AttachmentIcon} from '@chakra-ui/icons'
import { login, logout } from '../Features/currentUserSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-router-dom';
import {Link as RouteLink} from "react-router-dom";
import { CheckCircleIcon } from '@chakra-ui/icons'
import FriendAction from './Buttons/FriendAction';
import { useFormik } from 'formik';

import Dropzone from "react-dropzone";

function Profile () {
    const dispatch = useAppDispatch();
    // const [currentUser, setCurrentUser] = useState<any>({returned: []});

    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    let loggedinUser: any = {};
    // Get token and refactor
    const token = useAppSelector(state => state.currentToken);
    let tokenJWT = "";

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

    // GET request to get updated attributes of updated logged in user
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

    // Formik to handle form submit for changing profile picture
    // Set submitting for button in change profile picture
    const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
    const formik = useFormik({
        initialValues: {
            image: '',
            userID: loggedinUser._id,
        },
        onSubmit: async (values) => {
            setAvatarLoading(true);
            const submitImage = {
                image: values.image,
                userID: loggedinUser._id,
            }

            const formData = new FormData();
            formData.append("image", values.image);
            formData.append("userID", loggedinUser._id)

            console.log(formData);
            await axios.post('http://localhost:3000/uploadAvatar', formData)
                .then(res => {
                    console.log(res);
                })

            await refreshUserState();
            setAvatarLoading(false);
        }
    })

    // state for profile picutre
    const [uploadedPicture, setUploadedPicture] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>("");

    return (
        (loggedinUser._id) 
            ?   (
                <>
                    <Grid templateColumns={"230px 1fr"} gap={4}>
                        <GridItem display={"flex"} alignItems="center" justifyContent={"center"} p={5}>
                            {(loggedinUser.avatarURL) 
                                ? (
                                    <Image
                                        borderRadius='full'
                                        boxSize='200px'
                                        src={`${loggedinUser.avatarURL}`}
                                        objectFit="cover"
                                        alt='Avatar'/>
                                ) 
                                : (
                                    <Avatar size={"xl"}></Avatar>
                                )}
                        </GridItem>
                        <GridItem display={"flex"} justifyContent="center" alignItems="start" p={5} flexDir="column">
                            <Text fontSize="5xl" fontWeight={700}>{loggedinUser.username}</Text>
                            <Text fontSize={"sm"} fontWeight={300}>@{loggedinUser.handle}</Text>
                            <Text fontSize={"md"} fontWeight={500}>{loggedinUser.bio}</Text>
                            <Button mt={1} colorScheme="pink" ref={btnRef} onClick={onOpen} size="sm">Show Friends</Button>
                            {/* TODO: Put form in separate Modal for cleaner UI, put button to change picture in settings.
                                      Or can also make clicking profile picture as button to open modal to change profile picture. */}
                            <form onSubmit={formik.handleSubmit}>
                                <Flex mt={3} flexDir="column">
                                    <FormControl isRequired w="md">
                                        <FormLabel>Upload image for your profile picture here</FormLabel>
                                        <Dropzone
                                            onDrop={(acceptedFiles) => {
                                                formik.setFieldValue('image', acceptedFiles[0]);
                                                console.log(acceptedFiles[0]);
                                                setUploadedPicture(true);
                                                setFileName(acceptedFiles[0].name)
                                            }}
                                            accept={{
                                                image: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'],
                                            }}
                                        >
                                            {({ getRootProps, getInputProps, isDragActive }) => (
                                                <Box p={3} w="md" h="10rem" borderStyle={"dashed"} borderWidth="1px" {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    {isDragActive ? (
                                                        <p>Drop the files here ...</p>
                                                    ) : (
                                                        ((uploadedPicture)
                                                            ? (
                                                                <Text opacity={"80%"}>{fileName}</Text>
                                                            )
                                                            : (
                                                                <Text opacity={"80%"}>Drag n drop some files here, or click to select files</Text>
                                                            ))
                                                    )}
                                                </Box>
                                            )}
                                        </Dropzone>
                                    </FormControl>
                                    {(uploadedPicture) 
                                        ? (
                                            <Button mt={3} size="sm" type='submit' colorScheme="teal" disabled={avatarLoading}>{avatarLoading ? <Spinner></Spinner> : "Change Profile Picture"}</Button>
                                        ) 
                                        : (
                                            <></>
                                        )}
                                </Flex>
                            </form>
                            {/* TODO: put Drawer in separate component */}
                            <Drawer
                                isOpen={isOpen}
                                placement='right'
                                onClose={onClose}
                                finalFocusRef={btnRef}
                                size="sm"
                            >
                                <DrawerOverlay />
                                <DrawerContent>
                                    <DrawerHeader>Friends</DrawerHeader>
                                    <DrawerBody>
                                        <Container px={8}>
                                            {loggedinUser.friends?.map((friend: any) => {
                                                return (
                                                    (friend.status === 3)
                                                        ? (
                                                            <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                                <Flex flexDir="row" gap={5} alignItems="center">
                                                                    {(friend.recipient.avatarURL) 
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
                                                                        )}
                                                                    <Flex flex="1" overflow="hidden" flexDir={"column"}>
                                                                        <Text fontSize="xl" fontWeight="bold">{friend.recipient.username}</Text>
                                                                        <Text fontSize="sm" color="gray">@{friend.recipient.handle}</Text>
                                                                        <Button maxWidth={"80px"} size ="sm" colorScheme="pink" disabled> Friend </Button>
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
                </>
            ) 
            : (
                <Center>
                    <Alert status='error' borderRadius={"3xl"}>
                        <AlertIcon />
                        <AlertTitle>Please log in first!</AlertTitle>
                        <AlertDescription>View your profile here after logging in.</AlertDescription>
                    </Alert>
                </Center>
            )
    )
}

export default Profile;