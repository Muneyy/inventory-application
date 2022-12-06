import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Container, Heading, Center, Text, Button, Stack, Link, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex, Avatar } from '@chakra-ui/react'
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



function Home() {
    const [loading, setLoading] = useState(0);
    const [reqCollectionData, setReqCollectionData] = useState<any>([]);

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

    // import dispatch to dispatch payloads to redux
    const dispatch = useAppDispatch();
    // navigate to other routers in react-router
    const navigate = useNavigate();

    useEffect(() => {
        // At page mount, get users and collections to display them
        const fetchData = async () => {
            try {
                axios.get('http://localhost:3000/collections')
                    .then(res => {
                        setReqCollectionData(res.data);
                    });
                setLoading(1);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    // Logout user and then reload
    const persistor = persistStore(store);

    async function testJWT () {
        // console.log(tokenJWT);
        const config = {
            headers: { Authorization: `Bearer ${tokenJWT}` }
        };
        await axios.get('http://localhost:3000/items', config)
            .then(res => {
                // console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        (loading)
            ? (
                <>
                    <Stack direction="row" spacing={4} mt={3} ml={4}>
                        <RouteLink to="/createCollection">
                            <Button size="sm" rightIcon={<ArrowForwardIcon />} variant="outline" colorScheme="teal">
                                        Collection
                            </Button>
                        </RouteLink>


                        {/* <RouteLink to='/createItem' style={{ textDecoration: 'none' }}> */}
                        <Button size="sm" onClick = {() => testJWT()} rightIcon={<ArrowForwardIcon />} variant="outline" colorScheme="teal">
                                    Item
                        </Button>
                        {/* </RouteLink> */}
                    </Stack>
                    <Grid templateColumns='repeat(2, 50%)' gap='10' alignItems="start" mt="2">
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
                </>

                    
            )
            : (
                <div>
                    <h1>
                        <Center mt={"5rem"} display="flex" flexDir={"column"}>
                            <Spinner />
                            <Text>Loading...</Text>
                        </Center>
                    </h1>
                </div>
            )
    );

}

export default Home;