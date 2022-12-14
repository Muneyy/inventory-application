import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Wrap, Image, Container, Heading, Center, Text, Button, Stack, Link, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex, Avatar, Badge } from '@chakra-ui/react'
import {ArrowForwardIcon} from '@chakra-ui/icons'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-router-dom';
import {Link as RouteLink} from "react-router-dom";
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
                await axios.get('http://localhost:3000/collections')
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

    function decodeHTMLEntities(rawStr: string) {
        return rawStr.replace(/&#(\d+);/g, ((match, dec) => `${String.fromCharCode(dec)}`));
    }


    return (
        (loading)
            ? (
                <>
                    <Stack direction="row" spacing={4}>
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
                    <Center display="flex" mt={2} flexDirection="column">
                        <Heading size="m">Current Collections:</Heading>
                        <Grid templateColumns={"1fr"}>
                            {reqCollectionData.map((collection:any) => {
                                return (
                                    <Grid borderWidth='1px' key={uuidv4()} templateColumns={"1fr 2fr"}>
                                        <Image
                                            boxSize='300px'
                                            objectFit='cover'
                                            src='https://res.cloudinary.com/dxnmxxph1/image/upload/v1671005414/user-avatars/14a9ccdd-59e4-4dd2-902d-b8535bd34467.png'
                                            alt='Dan Abramov'
                                        />
                                        <Container position="relative" display="flex" flexDir={"column"} px="24px" py="8px">
                                            <Text fontSize="xl" fontWeight="bold">{(collection.name).split(/[%$]/).join('')}</Text>
                                            <Wrap>
                                                {collection.tags?.map((tag: string) => {
                                                    return (
                                                        <Badge colorScheme={"purple"} mr={2} key={uuidv4()}>{tag}</Badge>
                                                    )
                                                })}
                                            </Wrap>
                                            <Text mt={3} fontSize="m">{collection.summary}</Text>
                                            <Wrap bottom="5" position="absolute" mt={3} alignSelf={"flex-end"}>
                                                <Avatar size="xs" src={collection.user.avatarURL} />
                                                <Text fontSize="m">{collection.user.username}</Text>
                                            </Wrap>
                                        </Container>
                                    </Grid>
                                )
                            })}
                        </Grid>

                    </Center>
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