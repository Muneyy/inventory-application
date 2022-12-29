import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Wrap, Image, Container, Heading, useMediaQuery, Center, Text, Button, Stack, Link, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex, Avatar, Badge } from '@chakra-ui/react'
import {ArrowForwardIcon} from '@chakra-ui/icons'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-router-dom';
import {Link as RouteLink} from "react-router-dom";
import persistStore from 'redux-persist/es/persistStore';
import store from '../app/store';
import LoadingPage from './LoadingPage';


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

    const yellowTags = [
        "anime",
        "comics",
        "cartoon",
        "series",
        "movie",
    ];
    const purpleTags = [
        "k-pop",
        "j-pop",
        "p-pop",
        "soloist",
        "boy-group",
        "girl-group",
    ];

    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");
  
    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
    }, [isSmallScreen]);

    return (
        (loading)
            ? (
                <Center position={"relative"} w={width} top={-10} display="flex" flexDirection="column">
                    <Grid templateColumns={"1fr"}>
                        {reqCollectionData.map((collection:any) => {
                            return (
                                <Grid borderBottomWidth='1px' key={uuidv4()} templateColumns={"1fr 2fr"}>
                                    <Image
                                        w="300px"
                                        h="200px"
                                        objectFit='cover'
                                        src={collection.image_url}
                                        alt='Collection'
                                    />
                                    <Container position="relative" display="flex" flexDir={"column"} px="24px" py="8px">
                                        <RouteLink to={`collections/${collection._id}`}  style={{ textDecoration: 'none' }}>
                                            <Text fontSize="xl" fontWeight="bold">{(collection.name).split(/[%$]/).join('')}</Text>
                                        </RouteLink>
                                        <Wrap>
                                            {collection.tags?.map((tag: string) => {
                                                if (yellowTags.includes(tag)) {
                                                    return (
                                                        <Badge borderRadius={"lg"} colorScheme={"yellow"} mr={2} key={uuidv4()}>{tag}</Badge>
                                                    )
                                                } else if (purpleTags.includes(tag)) {
                                                    return (
                                                        <Badge borderRadius={"lg"} colorScheme={"purple"} mr={2} key={uuidv4()}>{tag}</Badge>
                                                    )
                                                }
                                            })}
                                        </Wrap>
                                        <Text mt={3} fontSize="m">{`${collection.summary}`}</Text>
                                        <Wrap bottom="5" position="absolute" mt={3} alignSelf={"flex-end"}>
                                            <RouteLink to={`/${collection.user._id}`}  style={{ textDecoration: 'none' }}>
                                                <Wrap>
                                                    <Avatar size="xs" src={collection.user.avatarURL} />
                                                    <Text fontSize="m">{collection.user.username}</Text>
                                                </Wrap>
                                            </RouteLink>
                                        </Wrap>
                                    </Container>
                                </Grid>
                            )
                        })}
                    </Grid>

                </Center>
            )
            : (
                <LoadingPage />
            )
    );

}

export default Home;