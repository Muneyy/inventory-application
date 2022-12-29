import { Box, Button, Flex, Show, Icon, Avatar } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { AiOutlineHeart } from 'react-icons/ai';
import {RiHomeHeartLine} from 'react-icons/ri'
import {FiFeather} from 'react-icons/fi'
import { FaUserFriends } from 'react-icons/fa';
import CreateModal from './MobileModals/CreateModal';
import {Link as RouteLink} from "react-router-dom";
import { useAppSelector } from '../app/hooks';

function MobileMenu() {

    const currentUser = useAppSelector(state => state.currentUser);
    let loggedinUser: any = {};
    
    // Refactor code for convenience
    if (currentUser.returned.length === 1) {
        loggedinUser = currentUser.returned[0];
    }
    
    return (
        <Show below="700px">
            <Flex position="sticky" bottom={0} height="60px" w="100vw" 
                zIndex={"2"} borderWidth="1px" backgroundColor={"blackAlpha.900"}>
                <Button h="100%" flex="1" display={"flex"} justifyContent="center" alignItems={"center"}>
                    <RouteLink to="/">
                        <Icon top={-10} boxSize={"22px"} as={RiHomeHeartLine}></Icon>
                    </RouteLink>
                </Button>
                <Button h="100%" flex="1"><Icon boxSize={"22px"} as={FaUserFriends}></Icon></Button>
                <CreateModal />
                <Button h="100%" flex="1"><Avatar boxSize={"22px"} src={loggedinUser.avatarURL}></Avatar></Button>
            </Flex>
        </Show>
    )
}

export default MobileMenu