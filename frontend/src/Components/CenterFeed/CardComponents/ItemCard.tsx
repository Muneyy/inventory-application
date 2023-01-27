import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { Flex, Image as ChakraImage, Center, Spinner, Text, Alert, AlertDescription, AlertIcon, AlertTitle, Avatar, Wrap, Heading, Box, Button, Badge, Icon, useDisclosure, Collapse, Textarea, FormControl, FormHelperText } from '@chakra-ui/react';
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper";

import { Link as RouteLink, useNavigate, useParams } from 'react-router-dom';
import {v4} from 'uuid';
import {SlLike} from 'react-icons/sl'
import { AiOutlineComment } from 'react-icons/ai';
import { FaShare } from 'react-icons/fa';
import ItemType from '../../../Types/ItemType';
import axios from 'axios';
import { FcLike, FcDislike } from 'react-icons/fc';
import { useAppSelector } from '../../../app/hooks';
import { motion } from 'framer-motion';
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
import { useFormik } from "formik";
import { useGetUserAndToken } from '../../../HelperFunctions/useGetUserandToken';
import { PlusSquareIcon } from '@chakra-ui/icons';
import DeleteItemModal from './CardModals/DeleteItemModal';


function ItemCard(props: {
    item: ItemType,
    pictureWidth: string,
    setFetchedCollectionItems: React.Dispatch<React.SetStateAction<ItemType[]>>
}) {

    const [loggedinUser, tokenJWT] = useGetUserAndToken();
    const navigate = useNavigate();
    const item = props.item;

    const {collectionId} = useParams();

    // make this dependent on fetched item attributes
    const [liked, setLiked] = useState<boolean>(false);

    // For Comment Modal
    const { isOpen, onToggle } = useDisclosure()

    // Check if user has already liked the item.
    useEffect(() => {
        item.likeUsers.forEach(likedUser => {
            if (likedUser.user._id === loggedinUser._id) {
                setLiked(true);
            }
        })
    }, [])

    async function likeItem() {
        setLiked(true);
  
        // TODO: make a change so that each individual item refreshes on
        // every successful like or comment
        await axios.post(`http://localhost:3000/items/${item._id}/like`,
            {
                liker: loggedinUser._id,
            },
            tokenJWT
        ).then(res => {
            console.log(res.data);
        });
    }

    async function unlikeItem() {
        setLiked(false);
  
        // TODO: make a change so that each individual item refreshes on
        // every successful like or comment
        await axios.post(`http://localhost:3000/items/${item._id}/unlike`,
            {
                liker: loggedinUser._id,
            },
            tokenJWT
        ).then(res => {
            console.log(res.data);
        });
    }

    function handleLikeClick () {
        if (liked) {
            unlikeItem();
        } else {
            likeItem();
        }
    }

    const [submitting, setSubmitting] = useState<boolean>(false);
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            user: "",
            item: "",
            text: "",
        },
        onSubmit: async (values) => {
            setSubmitting(true);
            const submitComment = {
                commenter: loggedinUser._id,
                item: item._id,
                text: values.text,
            }

            await axios.post(`http://localhost:3000/items/${item._id}/comment/add`, submitComment, tokenJWT)
                .then(async res => {
                    console.log(res.data)
                    await axios.get(`http://localhost:3000/items/${item._id}`)
                        .then(async res => {
                            props.setFetchedCollectionItems(prevCollectionItems => 
                                prevCollectionItems.map(prevItem => {
                                    if(prevItem._id === res.data.item._id){
                                        return res.data.item;
                                    }
                                    return prevItem;
                                })
                            )
                        })
                })

            setSubmitting(false);
            values.text = "";
        }
    })
    
    return (
        <Box display="flex" position="relative" flexDir={"column"} borderWidth="1px" borderX="none">
            {/* <Box flex="1" h="20px" backgroundColor="green"> */}
            <Badge 
                colorScheme={
                    (item.category === "display") ? ('purple') : (
                        (item.category === "buying") ? ('yellow') : (
                            (item.category === "selling") ? ('pink') : (
                                undefined
                            )))} 
                flex="1"
                fontSize="md">
                {
                    (item.category === "display") ? ('DISPLAY') : (
                        (item.category === "buying") ? ('WTB / LFS') : (
                            (item.category === "selling") ? ('WTS / LFB') : (
                                null
                            )))} 
            </Badge>
            {/* </Box> */}
            <Box px={5} pb={2} pt={2}>
                <Flex justifyContent={"space-between"}>
                    <Heading>{item.name}</Heading>
                    {(item.user._id === loggedinUser._id)
                        ? (
                            <Popover>
                                <PopoverTrigger>
                                    <Button colorScheme={"teal"} variant="ghost" size="sm" w="50px">Edit</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>Edit item.</PopoverHeader>
                                    <PopoverBody>
                                        <Flex flexDir={"column"} gap={2}>
                                            <Button size="sm" fontSize="sm" onClick={() => navigate(`/items/${item._id}/update`)} borderRadius="3xl" rightIcon={<PlusSquareIcon />} colorScheme="teal">
                                                Update Item
                                            </Button>
                                            {/* <Button size="sm" fontSize="sm" onClick={() => handleUpdateCollectionClick(fetchedCollection._id)} borderRadius="3xl" rightIcon={<PlusSquareIcon />} colorScheme="teal">
                                                Update Collection
                                            </Button> */}
                                            <DeleteItemModal itemId={item._id} />
                                        </Flex>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            null
                        )}
                </Flex>
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
                    (item.images_urls.length !== 0)
                        ? (
                            item.images_urls.map((image_url) => {
                                return (
                                    <SwiperSlide key={v4()}>
                                        {/* Import chakra ui Image component as ChakraImage to avoid overlap with Image() */}
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
                            })
                        )
                        : (
                            <ChakraImage
                                // Size of the image
                                // TODO: make image size dynamic
                                w="570px"
                                h={props.pictureWidth}
                                objectFit='cover'
                                src={`https://res.cloudinary.com/dxnmxxph1/image/upload/v1674458770/placeholderreal_rdowcr.png`}
                                fallbackSrc={`https://res.cloudinary.com/dxnmxxph1/image/upload/v1674457629/placeholder_u9grid.png`}
                                alt={`There are no available pictures for this item.`}
                            />
                        )}
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
            <Flex px={5} right={0} justifyContent={"flex-end"}>
                <Text>{item.likeCounter} likes</Text>
            </Flex>
            <Flex backgroundColor={"blackAlpha.100"} justifyContent={"space-evenly"}>
                <Button 
                    as={motion.button}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLikeClick()} flex="1">
                    <Icon as={(liked) ? FcDislike : FcLike } mr={3} />{(liked) ? "Unlike" : "Like"}
                </Button>
                <Button onClick={onToggle} flex="1"><Icon as={AiOutlineComment} mr={3} />Comment</Button>
                <Button flex="1"><Icon as={FaShare} mr={3} />Share</Button>
            </Flex>
            {item.commentUsers.map((comment: any) => {
                return (
                    <Flex key={v4()} p={1} pl={5} pb={2}>
                        <Avatar onClick={() => navigate(`/${comment.user._id}`)} mr={3} size="xs" src={comment.user.avatarURL}/>
                        <Text>{comment.text}</Text>
                    </Flex>
                )
            })}
            <Collapse in={isOpen} animateOpacity>
                {/* Make the forms here */}
                <Box
                    p={3}
                    color='white'
                    rounded='md'
                    shadow='md'
                >
                    <form onSubmit={formik.handleSubmit}>
                        <Flex flexDir={"column"}>
                            <FormControl>
                                <Textarea
                                    name="text"
                                    id="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.text}
                                    placeholder="Write your comment here..."
                                />
                            </FormControl>
                            <Flex mt={2} justifyContent={"space-between"} alignItems="center">
                                <RouteLink to={`/profile`}  style={{ textDecoration: 'none' }}>
                                    <Box alignItems="center" borderRadius={"lg"} display="flex" gap={2}>
                                        <Avatar size="xs" src={loggedinUser.avatarURL} />
                                        <Text fontSize="md">{loggedinUser.username}</Text>
                                    </Box>
                                </RouteLink>
                                <Button size="sm" alignSelf={"flex-end"} disabled={submitting} type='submit' colorScheme="teal">
                                    {submitting ? <Spinner></Spinner> : <Text>Submit</Text>}
                                </Button>
                            </Flex>
                        </Flex>
                    </form>
                </Box>
            </Collapse>

        </Box>
    )
}

export default ItemCard