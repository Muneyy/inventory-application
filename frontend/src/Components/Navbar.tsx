import { useColorMode, Flex, Heading, Button, Box, Icon } from '@chakra-ui/react';
import React from 'react';
import FriendRequestsModal from './Modals/FriendRequests';
import MessagesModal from './Modals/MessagesModal';
import SettingsModal from './Modals/SettingsModal';
import BsSun from "react-icons/bs"
import { SunIcon } from '@chakra-ui/icons';

function NavBar () {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <Box borderWidth={"2px"} borderColor="blackAlpha.200" py={3} mb={5}>
            <Flex justifyContent={"space-evenly"} alignItems="center">
                <Heading fontSize={"xl"}>POP IT</Heading>
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