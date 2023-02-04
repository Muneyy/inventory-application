import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
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
} from "@chakra-ui/react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { login } from "../../../Features/currentUserSlice";
import FriendAction from "./FriendAction";
import { useGetUserAndToken } from "../../../HelperFunctions/useGetUserandToken";
import NotificationBadge from "./NotificationBadge";

const FriendRequestsModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [notificationNumber, setNotificationNumber] = useState<any>(0);

    const [loggedinUser, tokenJWT] = useGetUserAndToken();

    useEffect(() => {
        setNotificationNumber(
            loggedinUser?.friends?.filter((friend) => friend.status === 2)
                .length
        );
    }, [loggedinUser]);

    const dispatch = useAppDispatch();

    // Accepts a friend request
    async function acceptFriendRequest(recipient: string) {
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
                setNotificationNumber((prevNumber: any) => {
                    return prevNumber - 1;
                });
            })
            .catch((err) => {
                console.log(err);
            });

        onClose();
        await refreshUserState();
    }

    // Reject friend request
    async function rejectFriendRequest(recipient: string) {
        const friendRequest = {
            requester: loggedinUser._id,
            recipient,
        };

        await axios
            .post(
                "http://localhost:3000/friends/rejectFriendRequest",
                friendRequest,
                tokenJWT
            )
            .then((res) => {
                console.log(res);
                setNotificationNumber((prevNumber: any) => {
                    return prevNumber - 1;
                });
            })
            .catch((err) => {
                console.log(err);
            });

        onClose();
        await refreshUserState();
    }

    // GET request to get updated attributes of updated logged in user
    async function refreshUserState() {
        await axios
            .get(`http://localhost:3000/users/${loggedinUser._id}`, tokenJWT)
            .then(async (res) => {
                console.log(res);
                // update state of loggedinUser
                await dispatch(login(res.data.user));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <Button position="relative" size="sm" onClick={onOpen}>
                <PlusSquareIcon />
                {notificationNumber > 0 && (
                    <NotificationBadge
                        numberOfNotification={notificationNumber}
                    />
                )}
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Friend Requests</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {loggedinUser?.friends?.map((friend: any) => {
                            return friend.status === 2 ? (
                                <Container
                                    key={uuidv4()}
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    mt="12px"
                                    px="24px"
                                    py="8px"
                                >
                                    {/* Sometimes recipient is null (probably deleted user without deleting friends.) 
                                                so we need to check if recipient is not null*/}
                                    {friend.recipient ? (
                                        <Flex
                                            flexDir={"row"}
                                            alignItems="center"
                                            gap={5}
                                        >
                                            {friend.recipient?.avatarURL ? (
                                                <Image
                                                    borderRadius="full"
                                                    boxSize="50px"
                                                    src={
                                                        friend.recipient
                                                            .avatarURL
                                                    }
                                                    objectFit="cover"
                                                    alt="Avatar"
                                                />
                                            ) : (
                                                <Avatar size={"md"}></Avatar>
                                            )}
                                            <Flex
                                                flexDir={"column"}
                                                w=""
                                                flex={"1"}
                                            >
                                                <Text
                                                    fontSize="xl"
                                                    fontWeight="bold"
                                                >
                                                    {friend.recipient.username}
                                                </Text>
                                                <Text
                                                    fontSize="sm"
                                                    color="gray"
                                                >
                                                    @{friend.recipient.handle}
                                                </Text>
                                                <FriendAction
                                                    acceptFriendRequest={
                                                        acceptFriendRequest
                                                    }
                                                    rejectFriendRequest={
                                                        rejectFriendRequest
                                                    }
                                                    id={friend.recipient._id}
                                                />
                                            </Flex>
                                        </Flex>
                                    ) : (
                                        <></>
                                    )}
                                </Container>
                            ) : (
                                <Text key={uuidv4()}></Text>
                            );
                        })}
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default FriendRequestsModal;
