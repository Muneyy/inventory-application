import { Flex, Button, Icon, Heading } from '@chakra-ui/react'
import React from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { FaUserFriends } from 'react-icons/fa'
import {Link as RouteLink} from "react-router-dom";
import { ImProfile } from 'react-icons/im'

function LeftLinks() {
    return (
        <Flex flexDirection="column" alignItems={"flex-end"} mt={8} gap={2} position={"sticky"} top={"80px"} w={"100%"} h={"100%"}>
            <RouteLink to="/">
                <Button py={7} borderRadius={"3xl"} variant="ghost" display="flex" gap={3} w="180px" alignItems={"center"} justifyContent="center">
                    <Icon as={AiOutlineHome}/>
                    <Heading flex="1" justifySelf={"flex-start"} size="lg">Home</Heading>
                </Button>
            </RouteLink>
            <RouteLink to="/profile">
                <Button py={7} borderRadius={"3xl"} variant="ghost" display="flex" gap={3} w="180px" alignItems={"center"} justifyContent="center">
                    <Icon as={ImProfile} />
                    <Heading flex="1" justifySelf={"flex-start"} size="lg">Profile</Heading>
                </Button>
            </RouteLink>
            <RouteLink to="/users">
                <Button py={7} borderRadius={"3xl"} variant="ghost" display="flex" gap={3} w="180px" alignItems={"center"} justifyContent="center">
                    <Icon as={FaUserFriends} />
                    <Heading flex="1" justifySelf={"flex-start"} size="lg">Users</Heading>
                </Button>
            </RouteLink>
        </Flex>
    )
}

export default LeftLinks
