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
import { useGetUserAndToken } from '../../../HelperFunctions/useGetUserandToken';

// FOR MODAL to later be put into separate component
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import TestAccountModal from '../../PopUpModal/TestAccountModal';

function Home() {
    const [loading, setLoading] = useState(0);
    const [reqCollectionData, setReqCollectionData] = useState<any>([]);

    const [loggedinUser, tokenJWT] = useGetUserAndToken();

    // import dispatch to dispatch payloads to redux
    const dispatch = useAppDispatch();
    // navigate to other routers in react-router
    const navigate = useNavigate();

    useEffect(() => {
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
                    <TestAccountModal userIsLoggedIn={loggedinUser.username !== undefined ? true : false} />
                </Center>
            )
            : (
                <LoadingPage />
            )
    );

}

export default Home;