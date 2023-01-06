import { Flex, useMediaQuery, Button, Icon, Heading, Show, Text, Avatar, Wrap, Box } from '@chakra-ui/react'
import React from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { FaUserFriends } from 'react-icons/fa'
import {Link as RouteLink} from "react-router-dom";
import { ImProfile } from 'react-icons/im'
import { useAppSelector } from '../../app/hooks';

function LeftLinks() {

    // Breakpoints for media queries
    const firstBreakpoint = useMediaQuery("(min-width: 1200px)");

    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    let loggedinUser: any = {};
    
    // Refactor REDUX states
    if (currentUser.returned.length === 1) {
        loggedinUser = currentUser.returned[0];
    }

    return (
        <Show above="700px">
            <Flex justifyContent="flex-start" flexDirection="column" alignItems={"flex-end"} gap={2} position={"sticky"} top={"80px"} w={"100%"} h={"100%"}>
                <RouteLink to="/">
                    <Button py={7} borderRadius={"3xl"} variant="ghost" display="grid" gap={3} justifyItems="start" gridTemplateColumns="20px 1fr" alignContent={"center"}>
                        <Icon as={AiOutlineHome}/>
                        <Show above="900px">
                            <Heading flex="1" width="120px" size="lg">Home</Heading>
                        </Show>
                    </Button>
                </RouteLink>
                <RouteLink to="/profile">
                    <Button py={7} borderRadius={"3xl"} variant="ghost" display="grid" gap={3} justifyItems="start" gridTemplateColumns="20px 1fr" alignContent={"center"}>
                        <Icon as={ImProfile} />
                        <Show above='900px'>
                            <Heading flex="1" width="120px" size="lg">Profile</Heading>
                        </Show>
                    </Button>
                </RouteLink>
                <RouteLink to="/users">
                    <Button py={7} borderRadius={"3xl"} variant="ghost" display="grid" gap={3} justifyItems="start" gridTemplateColumns="20px 1fr" alignContent={"center"}>
                        <Icon as={FaUserFriends} />
                        <Show above="900px">
                            <Heading flex="1" width="120px" size="lg">Users</Heading>
                        </Show>
                    </Button>
                </RouteLink>
                <RouteLink to={`/${loggedinUser._id}`}>
                    <Button colorScheme={"teal"} bottom="0" py={7} borderRadius={"3xl"} variant="ghost" display="grid" gap={3} justifyItems="start" gridTemplateColumns="20px 1fr" alignContent={"center"}>
                        <Avatar size="sm" src={loggedinUser.avatarURL} />
                        <Show above="900px">
                            <Heading flex="1" width="120px" size="md">{loggedinUser.username}</Heading>
                        </Show>
                    </Button>
                </RouteLink>
            </Flex>
        </Show>
    )
}

export default LeftLinks
