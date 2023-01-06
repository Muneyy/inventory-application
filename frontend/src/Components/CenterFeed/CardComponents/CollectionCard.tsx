import { Spinner, Wrap, Image, Container, Heading, useMediaQuery, Center, Text, Button, Stack, Grid, FormLabel, FormControl, useDisclosure, Collapse, Box, Flex, Avatar, Badge } from '@chakra-ui/react'
import {Link as RouteLink, useNavigate} from "react-router-dom";
import { v4 } from 'uuid';
import React from 'react';
import CollectionType from '../../../Types/CollectionType'

function CollectionCard(props: {
    collection: CollectionType
    isDisplayedInProfile?: boolean
}) {
    const collection = props.collection;
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

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/collections/${collection._id}`);
    }
    
    return (
        <Grid borderBottomWidth='1px' key={v4()} templateColumns={"1fr 2fr"}>
            <Image
                w="300px"
                h="200px"
                objectFit='cover'
                src={collection.image_url}
                alt='Collection'
                onClick={handleCardClick}
                _hover={{
                    cursor: "pointer",
                }}
            />
            <Container position="relative" display="flex" flexDir={"column"} px="24px" py="8px">
                <RouteLink to={`/collections/${collection._id}`}  style={{ textDecoration: 'none' }}>
                    <Text fontSize="xl" fontWeight="bold">{(collection.name).split(/[%$]/).join('')}</Text>
                </RouteLink>
                <Wrap>
                    {collection.tags?.map((tag: string) => {
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
                <Text mt={3} fontSize="m">{`${collection.summary}`}</Text>
                {(props.isDisplayedInProfile)
                    ? (
                        null
                    )
                    : (
                    
                        <Wrap bottom="5" position="absolute" mt={3} alignSelf={"flex-end"}>
                            <RouteLink to={`/${collection.user._id}`}  style={{ textDecoration: 'none' }}>
                                <Wrap>
                                    <Avatar size="xs" src={collection.user.avatarURL} />
                                    <Text fontSize="m">{collection.user.username}</Text>
                                </Wrap>
                            </RouteLink>
                        </Wrap>
                    )}
            </Container>
        </Grid>
    )
}

export default CollectionCard