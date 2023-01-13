import { ArrowForwardIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { Flex, Image, Center, Spinner, Text, Alert, AlertDescription, AlertIcon, AlertTitle, Avatar, Wrap, Heading, Box, Button, useMediaQuery } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link as RouteLink } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { v4 } from 'uuid';
import { useAppSelector } from '../../../app/hooks';
import { useGetUserAndToken } from '../../../HelperFunctions/useGetUserandToken';
import CollectionType from '../../../Types/CollectionType';
import ItemType from '../../../Types/ItemType';
import ItemCard from '../CardComponents/ItemCard';
import LoadingPage from '../Loading/LoadingPage';

function CollectionPage() {
    const { collectionId } = useParams();
    const [loadingDone, setLoadingDone] = useState<boolean>(false);
    const [fetchedCollection, setFetchedCollection] = useState<CollectionType>();
    const [fetchedCollectionItems, setFetchedCollectionItems] = useState<ItemType[]>([]);

    const [loggedinUser] = useGetUserAndToken();

    useEffect(() => {
        const fetchCollectionData = async () => {
            try {
                await axios.get(`http://localhost:3000/collections/${collectionId}`)
                    .then(res => {
                        // collection and group are sometimes the same thing
                        // since collection is a reserved keyword in mongoDB
                        setFetchedCollection(res.data.group);
                    })
                await axios.get(`http://localhost:3000/collections/${collectionId}/items`)
                    .then(res => {
                        // fetch items from this collection
                        setFetchedCollectionItems(res.data)
                    })
                setLoadingDone(true);
            } catch (error) {
                console.error(error);
            }
        }
        fetchCollectionData();
    }, [])

    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");
    const [pictureWidth, setPictureWidth] = useState(isSmallScreen ? "300px" : "570px");
  
    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
        setPictureWidth(isSmallScreen ? "100vw" : "570px")
    }, [isSmallScreen]);

    // useEffect(() => {
    //     console.log(fetchedCollectionItems);
    // }, [fetchedCollectionItems])
    
    return (
        (loadingDone)
            ? (
                (fetchedCollection)
                    ? (
                        // top = -10 to counteract padding from parent component
                        <Flex top={-10} position={"relative"} w={width} flexDirection={"column"}>
                            <Image
                                w="100%"
                                h="250px"
                                objectFit='cover'
                                src={fetchedCollection.image_url}
                                alt='Collection'
                            />
                            <Wrap top="170px" right="20px" position={"absolute"} bottom="5" mt={3} alignSelf={"flex-end"}>
                                <RouteLink to={`/${fetchedCollection.user._id}`}  style={{ textDecoration: 'none' }}>
                                    <Box backgroundColor={"blackAlpha.800"} alignItems="center" borderRadius={"lg"} px={5} py={2} display="flex" gap={3}>
                                        <Avatar size="sm" src={fetchedCollection.user.avatarURL} />
                                        <Text fontSize="xl">{fetchedCollection.user.username}</Text>
                                    </Box>
                                </RouteLink>
                            </Wrap>
                            <Flex flexDir={"column"} p={10}>
                                <Heading size="lg">{fetchedCollection.name}</Heading>
                                <Text size="sm">{fetchedCollection.summary}</Text>
                                {(fetchedCollection.user._id === loggedinUser._id)
                                    ? (
                                        <RouteLink to={`/collections/${fetchedCollection._id}/createitem`} style={{ textDecoration: 'none' }}>
                                            <Button borderRadius="3xl" size="sm" rightIcon={<PlusSquareIcon />} colorScheme="teal">
                                                Add Item
                                            </Button>
                                        </RouteLink>
                                    )
                                    : (
                                        null
                                    )
                                }
                            </Flex>
                            {(fetchedCollectionItems.length != 0)
                                ? (
                                    fetchedCollectionItems.map((item: ItemType) => {
                                        return (
                                            <ItemCard pictureWidth={pictureWidth} key={v4()} item={item} setFetchedCollectionItems={setFetchedCollectionItems} />
                                        )
                                    })
                                )
                                : (
                                    <Heading>No items have been added to this collection yet.</Heading>
                                )}
                        </Flex>
                    )
                    : (
                        <Alert status='error'>
                            <AlertIcon />
                            <AlertTitle>Error!</AlertTitle>
                            <AlertDescription>Collection does not exist!</AlertDescription>
                        </Alert>
                    )
            )
            : (
                <LoadingPage />
            )
    )
}

export default CollectionPage