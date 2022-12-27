import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, useMediaQuery, Image, Container, Heading, Center, Text, Button, Stack, Link, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex, Avatar } from '@chakra-ui/react'
import {ArrowForwardIcon} from '@chakra-ui/icons'
import { login, logout } from '../Features/currentUserSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-router-dom';
import {Link as RouteLink} from "react-router-dom";
import { useFormik } from 'formik';
import { current } from '@reduxjs/toolkit';
import { userInfo } from 'os';

import persistStore from 'redux-persist/es/persistStore';
import store from '../app/store';
import LoadingPage from './LoadingPage';



function UsersList() {
    const [loading, setLoading] = useState(0);
    const [reqUserData, setReqUserData] = useState<any>([]);

    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    let loggedinUser: any = {};

    // Refactor code for convenience
    if (currentUser.returned.length === 1) {
        loggedinUser = currentUser.returned[0];
    }

    // Get token and refactor
    const token = useAppSelector(state => state.currentToken);
    let tokenJWT = ""

    if (token.returned.length === 1) {
        tokenJWT = token.returned[0];
    }

    useEffect(() => {
        // At page mount, get users and collections to display them
        const fetchData = async () => {
            try {
                axios.get('http://localhost:3000/users')
                    .then(res => {
                        setReqUserData(res.data);
                    });
                setLoading(1);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");
  
    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
    }, [isSmallScreen]);

    return (
        (loading)
            ? (
                <Box width={width} display="flex" flexDir={"column"} alignItems="center">
                    <Heading fontSize="2xl" fontWeight="extrabold">
                                Current Users
                    </Heading>
                    {/* Displays current users */}
                    <Center flexDirection="column">
                        <Grid templateColumns={"repeat(2, 1fr)"}>
                            {reqUserData.map((user:any) => {
                                return (
                                    (currentUser.returned.length === 1)
                                        ? (
                                            // Check if user is the logged in User,
                                            // if it is, then return an empty Text container
                                            (loggedinUser.username == user.username)
                                                ? (
                                                    null
                                                ) : (
                                            // TODO: move this to a separate card component :D
                                                    // Do not display logged in user in list of current users
                                                    <RouteLink key={uuidv4()} to={`/${user._id}`}  style={{ textDecoration: 'none' }}>
                                                        <Container key={uuidv4()} borderWidth='1px' borderRadius='sm' px="24px" py="8px">
                                                            <Flex flexDir="row" gap={5} alignItems="center">
                                                                {(user.avatarURL)
                                                                    ? (
                                                                        <Image
                                                                            borderRadius='full'
                                                                            boxSize='50px'
                                                                            src={user.avatarURL}
                                                                            objectFit="cover"
                                                                            alt='Avatar'/>
                                                                    )
                                                                    : (
                                                                        <Avatar size={"md"}></Avatar>
                                                                    )}
                                                                <Flex overflow="hidden" flexDir={"column"}>
                                                                    <Text fontSize="xl" fontWeight="bold">{user.username}</Text>
                                                                    <Text fontSize="sm" color="gray">@{user.handle}</Text>
                                                                </Flex>
                                                            </Flex>
                                                        </Container>
                                                    </RouteLink>
                                                )
                                        ) : (
                                            <RouteLink key={uuidv4()} to={`/${user._id}`}  style={{ textDecoration: 'none' }}>
                                                <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                    <Flex flexDir="row" gap={5} alignItems="center">
                                                        {(user.avatarURL)
                                                            ? (
                                                                <Image
                                                                    borderRadius='full'
                                                                    boxSize='50px'
                                                                    src={user.avatarURL}
                                                                    objectFit="cover"
                                                                    alt='Avatar'/>
                                                            )
                                                            : (
                                                                <Avatar size={"md"}></Avatar>
                                                            )}
                                                        <Flex overflow="hidden" flexDir={"column"}>
                                                            <Text fontSize="xl" fontWeight="bold">{user.username}</Text>
                                                            <Text fontSize="sm" color="gray">@{user.handle}</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Container>
                                            </RouteLink>
                                        )
                                )
                            })}
                        </Grid>
                    </Center>
                </Box>

                    
            )
            : (
                <LoadingPage/>
            )
    );

}

export default UsersList;