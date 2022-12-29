import React from 'react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import {Link as RouteLink} from "react-router-dom";
import { Flex, Button, Show } from '@chakra-ui/react'

export default function RightLinks() {
    return (
        <Show above="800px">
            <Flex flexDirection="column" alignItems={"flex-start"} gap="5px" position={"sticky"} top={"80px"} w={"100%"} h={"100%"}>
                <RouteLink to='/createUser' style={{ textDecoration: 'none' }}>
                    <Button size="sm" leftIcon={<ArrowForwardIcon />} variant="outline" borderRadius={"3xl"} colorScheme="teal">
                            Sign up
                    </Button>
                </RouteLink>
                <RouteLink to='/login' style={{ textDecoration: 'none' }}>
                    <Button mb={10} size="sm" leftIcon={<ArrowForwardIcon />} variant="outline" borderRadius={"3xl"} colorScheme="teal">
                            Log in
                    </Button>
                </RouteLink>
                <RouteLink to="/createCollection">
                    <Button borderRadius="3xl" size="sm" leftIcon={<ArrowForwardIcon />} variant="outline" colorScheme="teal">
                            Collection
                    </Button>
                </RouteLink>
                {/* <RouteLink to='/createItem' style={{ textDecoration: 'none' }}> */}
                <Button borderRadius="3xl" size="sm" leftIcon={<ArrowForwardIcon />} variant="outline" colorScheme="teal">
                            Item
                </Button>
                {/* </RouteLink> */}
            </Flex>
        </Show>
    )
}
