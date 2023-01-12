import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Wrap, Image, Container, Heading, useMediaQuery, Center, Text, Button, Stack, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex, Avatar, Badge } from '@chakra-ui/react'
import {ArrowForwardIcon} from '@chakra-ui/icons'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
import { useNavigate } from 'react-router-dom';
import {Link as RouteLink} from "react-router-dom";
import persistStore from 'redux-persist/es/persistStore';
import store from '../../../app/store';
import LoadingPage from '../Loading/LoadingPage';
import CollectionType from '../../../Types/CollectionType';
import CollectionCard from '../CardComponents/CollectionCard';
import { getUserAndToken } from '../../../HelperFunctions/GetUserandToken';


function Home() {
    const [loading, setLoading] = useState(0);
    const [reqCollectionData, setReqCollectionData] = useState<any>([]);

    const [loggedinUser, tokenJWT] = getUserAndToken();

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
    
    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");
  
    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
    }, [isSmallScreen]);

    return (
        (loading)
            ? (
                <Center position={"relative"} w={width} top={-10} display="flex" flexDirection="column">
                    {/* <Grid templateColumns={"1fr"}> */}
                    {reqCollectionData.map((collection: CollectionType) => {
                        return (
                            <CollectionCard key={uuidv4()} collection={collection} />
                        )
                    })}
                    {/* </Grid> */}

                </Center>
            )
            : (
                <LoadingPage />
            )
    );

}

export default Home;