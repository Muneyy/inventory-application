import axios from "axios";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    Spinner,
    Image,
    Center,
    Text,
    Button,
    Grid,
    useDisclosure,
    Box,
    GridItem,
    Avatar,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    useMediaQuery,
} from "@chakra-ui/react";
import { ArrowForwardIcon, CheckIcon } from "@chakra-ui/icons";
import { login, logout } from "../../../Features/currentUserSlice";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircleIcon } from "@chakra-ui/icons";
import FriendAction from "../../NavBar/Modals/FriendAction";
import LoadingPage from "../Loading/LoadingPage";
import CollectionCard from "../CardComponents/CollectionCard";
import CollectionType from "../../../Types/CollectionType";
import { useGetUserAndToken } from "../../../HelperFunctions/useGetUserandToken";

function UserProfile() {
    const [loading, setLoading] = useState(0);
    const dispatch = useAppDispatch();
    const [fetchedUser, setFetchedUser] = useState<fetchedUserType>();
    const [fetchedUserCollections, setFetchedUserCollections] = useState([]);
    const [friendRequestSent, setFriendRequestSent] = useState<boolean>(false);

    const { userId } = useParams();

    type fetchedUserType = {
        username: string;
        handle: string;
        bio: string;
        _id: string;
        avatarURL: string;
    };

    const [loggedinUser, tokenJWT] = useGetUserAndToken();

    useEffect(() => {
        console.log(loggedinUser)
    }, [loggedinUser]);

    // Setup Friends Drawer using Chakra UI
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef() as React.MutableRefObject<HTMLInputElement> &
        React.LegacyRef<HTMLButtonElement>;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${tokenJWT}`;

                await axios
                    .get(`http://localhost:3000/users/${userId}`)
                    .then((res) => {
                        setFetchedUser(res.data.user);
                    });

                await axios
                    .get(`http://localhost:3000/${userId}/collections`)
                    .then((res) => {
                        setFetchedUserCollections(res.data);
                    });

                // console.log(JSON.parse(JSON.stringify(reqUserData)));
                setLoading(1);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        console.log(fetchedUserCollections);
    }, [fetchedUserCollections]);

    // Sends a friend request to backend
    async function sendFriendRequest(recipient: string) {
        setFriendRequestSent(true);
        const friendRequest = {
            requester: loggedinUser._id,
            recipient,
        };
        await axios
            .post(
                "http://localhost:3000/friends/sendFriendRequest",
                friendRequest,
                tokenJWT
            )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        await refreshUserState();
    }

    // Accepts a friend request
    async function acceptFriendRequest(recipient: string) {
        setFriendRequestSent(true);
        const friendRequest = {
            requester: loggedinUser._id,
            recipient,
        };

        await axios
            .post(
                "http://localhost:3000/friends/acceptFriendRequest",
                friendRequest,
                tokenJWT
            )
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        await refreshUserState();
    }

    const navigate = useNavigate();
    function navigateHome() {
        navigate("/");
    }

    async function refreshUserState() {
        await axios
            .get(`http://localhost:3000/users/${loggedinUser._id}`)
            .then(async (res) => {
                await dispatch(login(res.data.user));
                // run useEffect that is subscribed to the value of currentUser
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Make array of loggedinUser's friends to check
    // Also check if loggedinUser has already added viewed user
    const userFriends: string[] = [];
    const addedFriends: string[] = [];
    const incomingFriends: string[] = [];
    if (loggedinUser._id && loggedinUser.friends) {
        loggedinUser.friends.map((friend) => {
            if (friend.status === 3) {
                userFriends.push(friend.recipient._id);
                // TODO: separate 2 from 1 to determine who sent friend request
            } else if (friend.status === 2) {
                addedFriends.push(friend.recipient._id);
            } else if (friend.status === 1) {
                incomingFriends.push(friend.recipient._id);
            }
        });
    }

    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");

    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
    }, [isSmallScreen]);

    return loading ? (
        fetchedUser ? (
            <Box w={width}>
                <Grid
                    position="relative"
                    top={-10}
                    alignSelf={"flex-start"}
                    alignContent="space-between"
                    templateColumns={"40% 1fr"}
                    alignItems={"center"}
                    gap={1}
                    borderBottomWidth="1px"
                >
                    <GridItem
                        display={"flex"}
                        alignItems="center"
                        justifyContent={"center"}
                        p={5}
                    >
                        {fetchedUser.avatarURL ? (
                            <Image
                                borderRadius="full"
                                boxSize="150px"
                                src={fetchedUser.avatarURL}
                                objectFit="cover"
                                alt="Avatar"
                            />
                        ) : (
                            <Avatar boxSize="150px"></Avatar>
                        )}
                    </GridItem>
                    <GridItem
                        display={"flex"}
                        justifyContent="center"
                        alignItems="start"
                        p={5}
                        flexDir="column"
                    >
                        <Text fontSize="2xl" fontWeight={700}>
                            {fetchedUser.username}
                        </Text>
                        <Text fontSize={"xs"} fontWeight={300}>
                            @{fetchedUser.handle}
                        </Text>
                        <Text fontSize={"sm"} fontWeight={500}>
                            {fetchedUser.bio}
                        </Text>
                        {/* TODO: remove add friend button if user is not logged in. */}
                        {loggedinUser._id && loggedinUser._id != userId ? (
                            userFriends.includes(fetchedUser._id) ? (
                                <Button mt={1} disabled colorScheme="pink" ref={btnRef} size="sm" >
                                    <CheckCircleIcon mr={2} />
                                    {"Friend"}
                                </Button>
                            ) : addedFriends.includes(fetchedUser._id) ? (
                                <Button mt={1} colorScheme="pink" ref={btnRef} size="sm" disabled={friendRequestSent}
                                    onClick={() =>
                                        acceptFriendRequest(fetchedUser._id)
                                    }
                                >
                                    {friendRequestSent ? ( <Spinner></Spinner> ) : ("Accept Friend Request")}
                                </Button>
                            ) : incomingFriends.includes(fetchedUser._id) ? (
                                <Button mt={1} colorScheme="pink" ref={btnRef} size="sm" disabled>
                                    <CheckCircleIcon mr={2} />
                                    {"Friend Request sent"}
                                </Button>
                            ) : (
                                <Button mt={1} colorScheme="pink" ref={btnRef} size="sm" disabled={friendRequestSent}
                                    onClick={() =>
                                        sendFriendRequest(fetchedUser._id)
                                    }
                                >
                                    {friendRequestSent ? (<Spinner></Spinner>) : ("Add Friend")}
                                </Button>
                            )
                        ) : null}
                    </GridItem>
                </Grid>
                {/* TODO-CSS: FIX TOP EXTRACT WIDTH MEDIA QUERY FROM ALL COMPONENTS TO OUTER BOX */}
                <Center
                    top={-10}
                    position={"relative"}
                    display="flex"
                    flexDirection="column"
                >
                    {/* <Grid templateColumns={"1fr"}> */}
                    {fetchedUserCollections.map(
                        (collection: CollectionType) => {
                            return (
                                <CollectionCard
                                    key={uuidv4()}
                                    collection={collection}
                                    isDisplayedInProfile={true}
                                />
                            );
                        }
                    )}
                    {/* </Grid> */}
                </Center>
            </Box>
        ) : (
            <Alert status="error">
                <AlertIcon />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>User has not been found!</AlertDescription>
            </Alert>
        )
    ) : (
        <LoadingPage />
    );
}

export default UserProfile;
