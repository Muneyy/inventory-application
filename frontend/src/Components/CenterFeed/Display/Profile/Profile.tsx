import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Image, Container, Heading, Center, Text, Button, Stack, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex, GridItem, Circle, Avatar, AvatarBadge, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Alert, AlertDescription, AlertIcon, AlertTitle, Icon, useMediaQuery } from '@chakra-ui/react'
import {ArrowForwardIcon, AttachmentIcon} from '@chakra-ui/icons'
import { login, logout } from '../../../../Features/currentUserSlice';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks'
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@chakra-ui/icons'
import FriendAction from '../../../Buttons/FriendAction';
import { useFormik } from 'formik';
import UploadAvatar from './ProfileComponents/UploadAvatar';
import { UserType } from '../../../../Types/SchemaTypes';
import UploadAvatarModal from './ProfileComponents/UploadAvatarModal';
import { FaUserFriends } from 'react-icons/fa';
import FriendsDrawer from './ProfileComponents/FriendsDrawer';
import CollectionCard from '../../CardComponents/CollectionCard';
import CollectionType from '../../../../Types/CollectionType';


function Profile () {
    // const [currentUser, setCurrentUser] = useState<any>({returned: []});


    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    const [fetchedUserCollections, setFetchedUserCollections] = useState([]);
    const [loaded, setLoaded] = useState(0);
    let loggedinUser: any = {};
    // Refactor REDUX states
    if (currentUser.returned.length === 1) {
        loggedinUser = currentUser.returned[0];
    }
    // Get token and refactor
    const token = useAppSelector(state => state.currentToken);
    let tokenJWT = "";

    // useEffect(() => {
    //     if (currentUser.returned.length === 1) {
    //         setLoggedinUser(currentUser.returned[0]);
    //     }
    // }, [currentUser])

    // Refactor REDUX states
    if (token.returned.length === 1) {
        tokenJWT = token.returned[0];
    }

    // Retrieve collections of loggedinUser
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                await axios.get(`http://localhost:3000/${loggedinUser._id}/collections`)
                    .then(res => {
                        setFetchedUserCollections(res.data);
                    })
                setLoaded(1);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserData();
    }, [])

    // Setup Friends Drawer using Chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef() as React.MutableRefObject<HTMLInputElement> & React.LegacyRef<HTMLButtonElement>;

    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");
  
    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
    }, [isSmallScreen]);

    return (
        (loggedinUser?._id) 
            ?   (
                <Box w={width}>
                    <Grid position="relative" top={-10} alignSelf={"flex-start"} alignContent="space-between" 
                        templateColumns={"40% 1fr"} alignItems={"center"} gap={1} borderBottomWidth="1px">
                        <GridItem display={"flex"} alignItems="center" justifyContent={"center"} p={5}>
                            {(loggedinUser.avatarURL) 
                                ? (
                                    <Image
                                        borderRadius='full'
                                        boxSize='150px'
                                        src={`${loggedinUser.avatarURL}`}
                                        objectFit="cover"
                                        alt='Avatar'/>
                                ) 
                                : (
                                    <Avatar borderRadius='full' boxSize='150px' size={"xl"}></Avatar>
                                )}
                        </GridItem>
                        <GridItem display={"flex"} justifyContent="center" alignItems="start" flexDir="column">
                            <Text fontSize="2xl" fontWeight={700}>{loggedinUser.username}</Text>
                            <Text fontSize={"xs"} fontWeight={300}>@{loggedinUser.handle}</Text>
                            <Text fontSize={"sm"} fontWeight={500}>{loggedinUser.bio}</Text>
                            <Button mt={1} colorScheme="pink" ref={btnRef} onClick={onOpen} size="xs"><Icon as={FaUserFriends} mr={2} />Show Friends</Button>
                            {/* TODO: Put form in separate Modal for cleaner UI, put button to change picture in settings.
                                      Or can also make clicking profile picture as button to open modal to change profile picture. */}
                            <UploadAvatarModal userId={loggedinUser._id} 
                            // setLoggedinUser={setLoggedinUser} 
                            />
                            
                            {/* TODO: put Drawer in separate component */}
                            <FriendsDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} friendsArray={loggedinUser.friends} />
                        </GridItem>
                    </Grid>
                    {/* TODO-CSS: FIX TOP EXTRACT WIDTH MEDIA QUERY FROM ALL COMPONENTS TO OUTER BOX */}
                    {(loaded)
                        ? (
                            <Center top={-10} position={"relative"} display="flex" flexDirection="column">
                                {/* <Grid templateColumns={"1fr"}> */}
                                {fetchedUserCollections.map((collection: CollectionType) => {
                                    return (
                                        <CollectionCard key={uuidv4()} collection={collection} isDisplayedInProfile={true} />
                                    )
                                })}
                                {/* </Grid> */}

                            </Center>
                        )
                        : (
                        
                            <Center>
                                <Spinner>Waiting...</Spinner>
                            </Center>
                        )}
                </Box>
            ) 
            : (
                <Center w={width}>
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