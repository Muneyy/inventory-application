import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { Flex, Image as ChakraImage, Center, Spinner, Text, Alert, AlertDescription, AlertIcon, AlertTitle, Avatar, Wrap, Heading, Box, Button, Badge, Icon } from '@chakra-ui/react';
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper";

import { Link as RouteLink } from 'react-router-dom';
import {v4} from 'uuid';

import {SlLike} from 'react-icons/sl'
import { AiOutlineComment } from 'react-icons/ai';
import { FaShare } from 'react-icons/fa';

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

function ItemCard(props: {
    item: ItemType
    pictureWidth: string
}) {
    const item = props.item;
    
    return (
        <Box position="relative" flexDir={"column"} borderWidth="1px" borderX="none">
            <Box p={5} pb={2}>
                <Heading>{item.name}</Heading>
                <Wrap>
                    {item.tags?.map((tag: string) => {
                        return (
                            <Badge borderRadius={"lg"} colorScheme={"blue"} mr={2} key={v4()}>{tag}</Badge>
                        )
                    })}
                </Wrap>
                <Wrap mt={1}>
                    <Badge borderRadius={"lg"} colorScheme={"pink"} mr={2}>{item.price}</Badge>
                </Wrap>
            </Box>
            <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
                {
                    item.images_urls.map((image_url) => {
                        return (
                            <SwiperSlide key={v4()}>
                                {/* Import chakra ui Image as ChakraImage to avoid overlap with Image() */}
                                <ChakraImage
                                    // Size of the image
                                    // TODO: make image size dynamic
                                    w="570px"
                                    h={props.pictureWidth}
                                    objectFit='cover'
                                    src={image_url}
                                    alt={`Item from ${image_url}`}
                                />
                            </SwiperSlide>
                        )
                    })}
            </Swiper>
            <Box p={5}>
                <RouteLink to={`/${item.user._id}`}  style={{ textDecoration: 'none' }}>
                    <Box alignItems="center" borderRadius={"lg"} display="flex" gap={3}>
                        <Avatar size="xs" src={item.user.avatarURL} />
                        <Text fontSize="md">{item.user.username}</Text>
                        <Text fontWeight={"100"} fontSize="sm">@{item.user.handle}</Text>
                    </Box>
                </RouteLink>
                <Text>{item.description}</Text>
            </Box>
            <Flex backgroundColor={"blackAlpha.100"} justifyContent={"space-evenly"}>
                <Button flex="1"><Icon as={SlLike} mr={3} />Like</Button>
                <Button flex="1"><Icon as={AiOutlineComment} mr={3} />Comment</Button>
                <Button flex="1"><Icon as={FaShare} mr={3} />Share</Button>
            </Flex>

        </Box>
    )
}

export default ItemCard