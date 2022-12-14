import { ArrowForwardIcon } from '@chakra-ui/icons'
import {Link as RouteLink} from "react-router-dom";
import { Flex, Button } from '@chakra-ui/react'
import React from 'react'

export default function RightLinks() {
    return (
        <Flex flexDirection="column" alignItems={"flex-start"} gap="5px" position={"sticky"} top={"80px"} w={"100%"} h={"100%"}>
            <RouteLink to='/createUser' style={{ textDecoration: 'none' }}>
                <Button size="sm" rightIcon={<ArrowForwardIcon />} variant="outline" borderRadius={"3xl"} colorScheme="teal">
                                                Sign up
                </Button>
            </RouteLink>
            <RouteLink to='/login' style={{ textDecoration: 'none' }}>
                <Button size="sm" rightIcon={<ArrowForwardIcon />} variant="outline" borderRadius={"3xl"} colorScheme="teal">
                                                Log in
                </Button>
            </RouteLink>
        </Flex>
    )
}
