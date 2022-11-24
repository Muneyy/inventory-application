import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Container, Heading, Center, Text, Button, Stack, Link, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex, GridItem, Circle } from '@chakra-ui/react'
import {ArrowForwardIcon} from '@chakra-ui/icons'
import { login, logout } from '../Features/currentUserSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-router-dom';
import {Link as RouteLink} from "react-router-dom";
import { CheckCircleIcon } from '@chakra-ui/icons'

function Profile () {

    ////////////////////////////////////////////////
    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    let loggedinUser: any = {};
    // Get token and refactor
    const token = useAppSelector(state => state.currentToken);
    let tokenJWT = ""

    // Refactor REDUX states
    if (currentUser.returned.length === 1) {
        loggedinUser = currentUser.returned[0];
    }
    if (token.returned.length === 1) {
        tokenJWT = token.returned[0];
    }
    ////////////////////////////////////////////////

    return (
        (loggedinUser) 
            ?   (
                <Center backgroundColor={"teal.300"} p={10}>
                    <Box borderWidth='1px' borderRadius='lg' overflow='hidden' paddingX={15} paddingY={5}>
                        <Grid templateColumns={"3fr 5fr"} gap={4}>
                            <GridItem display={"flex"} alignItems="center" p={5}>
                                <CheckCircleIcon w={100} h={100}></CheckCircleIcon>
                            </GridItem>
                            <GridItem display={"flex"} justifyContent="center" alignItems="start" p={5} flexDir="column">
                                <Text fontSize="5xl" fontWeight={700}>{loggedinUser.username}</Text>
                                <Text fontSize={"sm"} fontWeight={300}>@{loggedinUser.handle}</Text>
                                <Text fontSize={"md"} fontWeight={500}>{loggedinUser.bio}</Text>
                            </GridItem>
                        </Grid>
                    </Box>
                </Center>
            ) 
            : (
                <Heading>Please log in first.</Heading>
            )
    )
}

export default Profile;