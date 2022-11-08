import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Container, Heading, Center, Text, Button, Stack, Link, Grid } from '@chakra-ui/react'
import {ArrowForwardIcon} from '@chakra-ui/icons'
import { login, logout } from '../Features/currentUserSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-router-dom';
import {Link as RouteLink} from "react-router-dom";

function Home() {
    const [loading, setLoading] = useState(0);
    const [reqUserData, setReqUserData] = useState<any>([]);
    const [reqCollectionData, setReqCollectionData] = useState<any>([]);

    const currentUser = useAppSelector(state => state.currentUser);
    const Token = useAppSelector(state => state.currentToken);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios.defaults.headers.common["Authorization"] = `Bearer ${Token}`;
                const endpoints = ['http://localhost:3000/users', 'http://localhost:3000/collections'];
                axios.all(endpoints.map((endpoint) => 
                    axios.get(endpoint)
                )).then(axios.spread((users, collections) => {
                    setReqUserData(users.data);
                    setReqCollectionData(collections.data);
                }))
                setLoading(1);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    function logoutUser () {
        dispatch(logout);
        window.location.reload();
    }

    return (
        (loading)
            ? (
                <>
                    <Center mt="5rem" flexDirection="column">
                        {(currentUser.returned.length === 1)
                            ? (
                                <>
                                    <Heading> Welcome back {currentUser.returned[0].username}. </Heading>
                                    <Button onClick={logoutUser}> Logout </Button>
                                </>
                            ) : (
                                <Heading> Log in below. </Heading>
                            )}
                    </Center>

                    <Center mt={"1rem"}>
                        <Container borderWidth='1px' borderRadius='lg' py={"5"} px={"10"} minW="3xl" centerContent>
                            <Heading fontSize="5xl" fontWeight="extrabold">
                            Create Here!
                            </Heading>
                            <Grid templateColumns='repeat(2, 50%)' gap='10' alignItems="start" mt="2">
                                <Center flexDirection="column">
                                    <Heading size="m">Current Users:</Heading>
                                    {reqUserData.map((user:any) => {
                                        return (
                                            <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                <Text fontSize="xl" fontWeight="bold">{user.username}</Text>
                                                <Text fontSize="m">{user.bio}</Text>
                                            </Container>
                                        )
                                    })}
                                </Center>
                                <Center flexDirection="column">
                                    <Heading size="m">Current Collections:</Heading>
                                    {reqCollectionData.map((collection:any) => {
                                        return (
                                            <Container key={uuidv4()} borderWidth='1px' borderRadius='lg' mt="12px" px="24px" py="8px">
                                                <Text fontSize="xl" fontWeight="bold">{collection.name}</Text>
                                                <Text fontSize="m">{collection.summary}</Text>
                                                <Text fontSize="m">Owned by: {collection.user.username}</Text>
                                            </Container>
                                        )
                                    })}
                                </Center>
                            </Grid>
                            <Text mt="1rem">
                            Select which category you would like to create:
                            </Text>
                            <Stack direction="row" spacing={4} mt={3}>
                                <RouteLink to='/createUser' style={{ textDecoration: 'none' }}>
                                    <Button rightIcon={<ArrowForwardIcon />} variant="solid" colorScheme="teal">
                                    Sign up
                                    </Button>
                                </RouteLink>
                                <RouteLink to='/login' style={{ textDecoration: 'none' }}>
                                    <Button rightIcon={<ArrowForwardIcon />} variant="solid" colorScheme="teal">
                                    Log in
                                    </Button>
                                </RouteLink>

                                <RouteLink to="/createCollection">
                                    <Button rightIcon={<ArrowForwardIcon />} variant="outline" colorScheme="teal">
                                        Collection
                                    </Button>
                                </RouteLink>

                                <RouteLink to='/createItem' style={{ textDecoration: 'none' }}>
                                    <Button rightIcon={<ArrowForwardIcon />} variant="outline" colorScheme="teal">
                                    Item
                                    </Button>
                                </RouteLink>
                            </Stack>
                        </Container>
                    </Center>
                </>

                    
            )
            : (
                <div>
                    <h1>
                        <Center mt={"5rem"}>
                            <Spinner />
                        </Center>
                    </h1>
                </div>
            )
    );

}

export default Home;