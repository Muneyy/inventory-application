import { useColorMode, Flex, Heading, Button, Box, Icon } from '@chakra-ui/react';
import React from 'react';
import FriendRequestsModal from './Modals/FriendRequestsModal';
import MessagesModal from './Modals/MessagesModal';
import SettingsModal from './Modals/SettingsModal';
import BsSun from "react-icons/bs"
import { SunIcon } from '@chakra-ui/icons';
import {Link as RouteLink} from "react-router-dom";
import { useAppSelector } from '../../app/hooks';

function NavBar () {
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <Box backgroundColor={colorMode === "light" ? "white" : "gray.800"} zIndex={2} top={0} position={"sticky"} w="100vw" borderBottomWidth={"1px"} py={3}>
            <Flex justifyContent={"space-evenly"} alignItems="center">
                <RouteLink to="/">
                    <Heading fontSize={"xl"}>POP IT</Heading>
                </RouteLink>
                <Flex gap={"10px"} alignItems="center" justifyContent={"space-evenly"}>
                    <MessagesModal />
                    <FriendRequestsModal/>
                    <SettingsModal />
                    <Button size="sm" onClick={toggleColorMode}>
                        {colorMode === 'light' ? <SunIcon/> : <SunIcon/>}
                    </Button>
                </Flex>
            </Flex>
        </Box>
    )
}

export default NavBar