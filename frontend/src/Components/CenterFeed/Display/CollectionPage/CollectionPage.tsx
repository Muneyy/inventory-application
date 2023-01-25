import { ArrowForwardIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { Flex, Image, Center, Spinner, Text, Alert, AlertDescription, AlertIcon, AlertTitle, Avatar, Wrap, Heading, Box, Button, useMediaQuery, Badge } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link as RouteLink, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { v4 } from 'uuid';
import { useAppSelector } from '../../../../app/hooks';
import { useGetUserAndToken } from '../../../../HelperFunctions/useGetUserandToken';
import CollectionType from '../../../../Types/CollectionType';
import ItemType from '../../../../Types/ItemType';
import ItemCard from '../../CardComponents/ItemCard';
import LoadingPage from '../../Loading/LoadingPage';
import { purpleTags, yellowTags } from '../../../../Types/AvailableTags';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
} from '@chakra-ui/react'
import DeleteCollectionModal from './Components/DeleteCollectionModal';

function CollectionPage() {
    const { collectionId } = useParams();
    const [loadingDone, setLoadingDone] = useState<boolean>(false);
    const [fetchedCollection, setFetchedCollection] = useState<CollectionType>();
    const [fetchedCollectionItems, setFetchedCollectionItems] = useState<ItemType[]>([]);

    const [loggedinUser] = useGetUserAndToken();
    const navigate = useNavigate();

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

    // useEffect(() => {
    //     console.log(fetchedCollection);
    // }, [fetchedCollection])
    
    function handleAddItemClick (collectionId: string) {
        navigate(`/collections/${collectionId}/createitem`)
    }

    function handleUpdateCollectionClick (collectionId: string) {
        navigate(`/collections/${collectionId}/update`)
    }

    return (
        (loadingDone)
            ? (
                (fetchedCollection)
                    ? (
                        (fetchedCollection.isDeleted)
                            ? (
                                <Alert status='success' w={width}>
                                    <AlertIcon />
                                    <AlertTitle>Success!</AlertTitle>
                                    <AlertDescription>You have deleted your collection.</AlertDescription>
                                </Alert>
                            )
                            : (
                        // top = -10 to counteract padding from parent component
                                <Flex top={-10} position={"relative"} w={width} flexDirection={"column"}>
                                    <Image
                                        w="100%"
                                        h="250px"
                                        objectFit='cover'
                                        src={fetchedCollection.image_url}
                                        fallbackSrc={`https://res.cloudinary.com/dxnmxxph1/image/upload/v1674458770/placeholderreal_rdowcr.png`}
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
                                        <Flex justifyContent={"space-between"}>
                                            <Heading size="lg">{fetchedCollection.name}</Heading>
                                            {/* Edit Component!
                                            TODO: Move this to a separate component */}
                                            {(fetchedCollection.user._id === loggedinUser._id)
                                                ? (
                                                    <Popover>
                                                        <PopoverTrigger>
                                                            <Button colorScheme="teal" variant="ghost" size="sm" w="50px">Edit</Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <PopoverArrow />
                                                            <PopoverCloseButton />
                                                            <PopoverHeader>Edit your collection.</PopoverHeader>
                                                            <PopoverBody>
                                                                <Flex flexDir={"column"} gap={2}>
                                                                    <Button size="sm" fontSize="sm" onClick={() => handleAddItemClick(fetchedCollection._id)} borderRadius="3xl" rightIcon={<PlusSquareIcon />} colorScheme="teal">
                                                                    Add Item
                                                                    </Button>
                                                                    <Button size="sm" fontSize="sm" onClick={() => handleUpdateCollectionClick(fetchedCollection._id)} borderRadius="3xl" rightIcon={<PlusSquareIcon />} colorScheme="teal">
                                                                    Update Collection
                                                                    </Button>
                                                                    <DeleteCollectionModal collectionId={collectionId} />
                                                                </Flex>
                                                            </PopoverBody>
                                                        </PopoverContent>
                                                    </Popover>

                                                )
                                                : (
                                                    null
                                                )
                                            }
                                        </Flex>
                                        <Text size="sm">{fetchedCollection.summary}</Text>
                                        <Wrap>
                                            {fetchedCollection.tags?.map((tag: string) => {
                                                if (yellowTags.includes(tag)) {
                                                    return (
                                                        <Badge borderRadius={"lg"} colorScheme={"yellow"} mr={2} key={v4()}>{tag}</Badge>
                                                    )
                                                } else if (purpleTags.includes(tag)) {
                                                    return (
                                                        <Badge borderRadius={"lg"} colorScheme={"purple"} mr={2} key={v4()}>{tag}</Badge>
                                                    )
                                                }
                                            })}
                                        </Wrap>
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
                                            <Heading size="sm">No items have been added to this collection yet.</Heading>
                                        )}
                                </Flex>

                            )
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