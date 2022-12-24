import { ArrowForwardIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { Flex, Image, Center, Spinner, Text, Alert, AlertDescription, AlertIcon, AlertTitle, Avatar, Wrap, Heading, Box, Button } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link as RouteLink } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { v4 } from 'uuid';
import { useAppSelector } from '../app/hooks';
import ItemCard from './ItemCard';

function CollectionPage() {
    const { collectionId } = useParams();
    const [loadingDone, setLoadingDone] = useState<boolean>(false);
    const [fetchedCollection, setFetchedCollection] = useState<CollectionType>();
    const [fetchedCollectionItems, setFetchedCollectionItems] = useState<ItemType[]>([]);

    type ItemType = {
        name: string,
        description: string,
        tags: string[],
        price: number,
        images_urls: string[],
        group: string,
        user: {
            avatarURL: string,
            username: string,
            handle: string,
            _id: string,
        },
    }

    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    let loggedinUser: any = {};
    
    // Refactor code for convenience
    if (currentUser.returned.length === 1) {
        loggedinUser = currentUser.returned[0];
    }

    type CollectionType = {
        name: string,
        summary: string,
        tags: string[],
        image_url: string,
        user: {
            _id: string,
            username: string,
            avatarURL: string,
        },
        _id: string,
    }

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

    return (
        (loadingDone)
            ? (
                (fetchedCollection)
                    ? (
                        // top = -10 to counteract padding from parent component
                        <Flex top={-10} position={"relative"} w="100%" flexDirection={"column"}>
                            <Image
                                w="100%"
                                h="300px"
                                objectFit='cover'
                                src={fetchedCollection.image_url}
                                alt='Collection'
                            />
                            <Wrap top="220px" right="20px" position={"absolute"} bottom="5" mt={3} alignSelf={"flex-end"}>
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
                            {(fetchedCollectionItems)
                                ? (
                                    fetchedCollectionItems.map((item: ItemType) => {
                                        return (
                                            <ItemCard key={v4()} item={item} />
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
                <Center mt={"5rem"} display="flex" flexDir={"column"}>
                    <Spinner />
                    <Text>Loading...</Text>
                </Center>
            )
    )
}

export default CollectionPage