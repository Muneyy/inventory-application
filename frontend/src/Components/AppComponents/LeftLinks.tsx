import { Flex, useMediaQuery, Button, Icon, Heading, Show, Hide } from '@chakra-ui/react'
import React from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { FaUserFriends } from 'react-icons/fa'
import {Link as RouteLink} from "react-router-dom";
import { ImProfile } from 'react-icons/im'

function LeftLinks() {

    // Breakpoints for media queries
    const firstBreakpoint = useMediaQuery("(min-width: 1200px)");

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
            </Flex>
        </Show>
    )
}

export default LeftLinks
