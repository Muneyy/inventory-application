import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Image, Container, Heading, Center, Text, Button, Stack, Link, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex, GridItem, Circle, Avatar, AvatarBadge, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Alert, AlertDescription, AlertIcon, AlertTitle, Icon } from '@chakra-ui/react'
import {ArrowForwardIcon, AttachmentIcon} from '@chakra-ui/icons'
import { login, logout } from '../Features/currentUserSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-router-dom';
import {Link as RouteLink} from "react-router-dom";
import { CheckCircleIcon } from '@chakra-ui/icons'
import FriendAction from './Buttons/FriendAction';
import { useFormik } from 'formik';
import UploadAvatar from './ProfileComponents/UploadAvatar';
import { UserType } from '../Types/SchemaTypes';
import UploadAvatarModal from './ProfileComponents/UploadAvatarModal';
import { FaUserFriends } from 'react-icons/fa';
import FriendsDrawer from './ProfileComponents/FriendsDrawer';


function Profile () {
    // const [currentUser, setCurrentUser] = useState<any>({returned: []});


    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    const [loggedinUser, setLoggedinUser] = useState<UserType>({
        _id: "",
        username: "",
        handle: "",
        bio: "",
        friends: [],
        avatarURL: "",
    });
    // Get token and refactor
    const token = useAppSelector(state => state.currentToken);
    let tokenJWT = "";

    useEffect(() => {
        if (currentUser.returned.length === 1) {
            setLoggedinUser(currentUser.returned[0]);
        }
    }, [currentUser])
    // Refactor REDUX states
    
    if (token.returned.length === 1) {
        tokenJWT = token.returned[0];
    }

    // Setup Friends Drawer using Chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef() as React.MutableRefObject<HTMLInputElement> & React.LegacyRef<HTMLButtonElement>;

    return (
        (loggedinUser?._id) 
            ?   (
                <Grid ml={10} alignSelf={"flex-start"} templateColumns={"260px 1fr"} alignItems={"start"} flex={"1"} gap={4}>
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
                                <Avatar borderRadius='full' boxSize='200px' size={"xl"}></Avatar>
                            )}
                    </GridItem>
                    <GridItem display={"flex"} justifyContent="center" alignItems="start" p={5} flexDir="column">
                        <Text fontSize="5xl" fontWeight={700}>{loggedinUser.username}</Text>
                        <Text fontSize={"sm"} fontWeight={300}>@{loggedinUser.handle}</Text>
                        <Text fontSize={"md"} fontWeight={500}>{loggedinUser.bio}</Text>
                        <Button mt={1} colorScheme="pink" ref={btnRef} onClick={onOpen} size="sm"><Icon as={FaUserFriends} mr={2} />Show Friends</Button>
                        {/* TODO: Put form in separate Modal for cleaner UI, put button to change picture in settings.
                                      Or can also make clicking profile picture as button to open modal to change profile picture. */}
                        <UploadAvatarModal userId={loggedinUser._id} setLoggedinUser={setLoggedinUser} />
                            
                        {/* TODO: put Drawer in separate component */}
                        <FriendsDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} friendsArray={loggedinUser.friends} />
                    </GridItem>
                </Grid>
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