import { Spinner, Box, Flex, Checkbox, Divider, Container, Heading, Center, Text, Button, Stack, Link, Select, Alert, AlertDescription, AlertIcon, AlertTitle, CheckboxGroup, Tag, Textarea, useMediaQuery, RadioGroup, Radio } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@chakra-ui/react';
import { useFormik } from "formik";
import * as Yup from 'yup';
import Dropzone from "react-dropzone";
import { useAppSelector } from '../../../app/hooks';
import LoadingPage from '../Loading/LoadingPage';
import { useGetUserAndToken } from '../../../HelperFunctions/useGetUserandToken';
import CollectionType from '../../../Types/CollectionType';
import ItemType from '../../../Types/ItemType';

function UpdateItem () {
    const [loading, setLoadingDone] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [fetchedCollection, setFetchedCollection] = useState<CollectionType>();
    const navigate = useNavigate();
    const [reqData, setReqData] = useState([]);
    // filename for react dropzone
    const [fileName, setFileName] = useState<string[]>();
    // check if picture has been uploaded
    const [uploadedPicture, setUploadedPicture] = useState<boolean>(false);
    const [clearPictures, setClearPictures] = useState<boolean>(false);

    const [loggedinUser, tokenJWT] = useGetUserAndToken();

    // Collection is unnecessary to fetch since item already has reference
    // to collection and can just be populated from the backend.
    // useEffect(() => {
    //     const fetchCollectionData = async () => {
    //         try {
    //             await axios.get(`http://localhost:3000/collections/${collectionId}`)
    //                 .then(res => {
    //                     // collection and group are sometimes the same thing
    //                     // since collection is a reserved keyword in mongoDB
    //                     setFetchedCollection(res.data.group);
    //                 })
    //             setLoadingDone(true);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    //     fetchCollectionData();
    // }, [])

    const [fetchedItem, setFetchedItem] = useState<ItemType>();
    const { itemId } = useParams();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                await axios.get(`http://localhost:3000/items/${itemId}`)
                    .then(res => {
                        setFetchedItem(res.data.item);
                        // update tags field to have a default value
                        formik.setFieldValue("tags", [...res.data.item.tags]);
                    })
                setLoadingDone(true);
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchItem();
    }, [])

    // const { collectionId } = useParams();

    const availableTags = [
        "apparel",
        "photocard",
        "lightstick",
        "album",
        "poster",
        "film",
        "cd",
        "ticket",
        "card",
        "peripheral",
        "stationery",
    ]

    const ItemSchema = Yup.object().shape({
        name: Yup.string()
            .min(1, "Name must be between 1-20 characters")
            .max(20, "Name must be between 1-20 characters")
            .required('Required'),
        description: Yup.string()
            .min(1, "Description must be between 1-40 characters")
            .max(200, "Description must be between 1-40 characters")
            .required('Required'),
        tags: Yup.array()
            .of(Yup.string().oneOf(availableTags, 'Invalid tag'))
            .min(1, "Please select at least one tag")
            .required("Please select at least one tag"),
        price: Yup.number()
            .moreThan(0, "Price must be a positive number")
            .required("Required")
    })

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: fetchedItem
            ? {
                name: fetchedItem.name,
                description: fetchedItem.description,
                tags: fetchedItem.tags,
                price: fetchedItem.price,
                category: fetchedItem.category,
                imageArray: [],
            } : {
                name: "",
                description: "",
                tags: [],
                price: 0,
                category: "",
                imageArray: [],
            },
        validationSchema: ItemSchema,
        onSubmit: async (values) => {
            setSubmitting(true);
            const submitItem = {
                name: values.name,
                description: values.description,
                tags: values.tags,
                price: values.price,
                category: values.category,
                requesterId: loggedinUser._id,
            };

            await axios.put(`http://localhost:3000/items/${itemId}/update`, submitItem, tokenJWT)
                .then(async res => {
                    if (clearPictures) {
                        await axios.post(`http://localhost:3000/items/${itemId}/clear`, {requesterId: loggedinUser._id}, tokenJWT)
                    }
                    if (uploadedPicture) {
                        for (const image of values.imageArray) {
                            const imageUploadForm = new FormData();
                            imageUploadForm.append("image", image);
                            if (loggedinUser._id !== undefined) {
                                imageUploadForm.append("requesterId", loggedinUser._id);
                            }
                            imageUploadForm.append("itemId", res.data._id);
                            console.log(values.imageArray);
                            await axios.post('http://localhost:3000/uploadAvatar', imageUploadForm, tokenJWT)
                                .then(res => {
                                    console.log(res.data.msg);
                                })
                        }
                    }
                })
            setSubmitting(false);
            navigate(`/collections/${fetchedItem?.group._id}`);
        }
    })

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/users');
                setReqData(response.data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchUsers()
    }, [])

    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");
  
    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
    }, [isSmallScreen]);

    function toggleClearPictures () {
        setClearPictures((current) => !current)
    }

    useEffect(() => {
        console.log(fetchedItem)
        console.log
    }, [fetchedItem])

    return(
        // TODO: FIX: loading is not working as intended
        (loading)
            ? (
                (loggedinUser._id)
                    ? (
                        <Flex w={width} px={10}>
                            <form onSubmit={formik.handleSubmit}>
                                <Heading mb={3} >Update Item</Heading>
                                <FormControl isRequired>
                                    <FormLabel>Name:</FormLabel>
                                    <Input 
                                        type="text" 
                                        name="name" 
                                        id="name" 
                                        onChange={formik.handleChange}
                                        value={formik.values.name} 
                                    />
                                    {formik.errors.name && formik.touched.name ? (
                                        <Alert mt={1} p={2} size="sm" borderRadius="3xl" status="warning">
                                            <AlertIcon />
                                            {formik.errors.name}
                                        </Alert>
                                    ) : (
                                
                                        <FormHelperText>Name cannot be empty.</FormHelperText>
                                    )}
                                </FormControl>
                                <Divider my="1rem"/>
                                <FormControl isRequired>
                                    <FormLabel>Description:</FormLabel>
                                    <Textarea 
                                        name="description" 
                                        id="description" 
                                        onChange={formik.handleChange}
                                        value={formik.values.description}
                                    />
                                    {formik.errors.description && formik.touched.description ? (
                                        <Alert mt={1} p={2} size="sm" borderRadius="3xl" status="warning">
                                            <AlertIcon />
                                            {formik.errors.description}
                                        </Alert>
                                    ) : (
                                        <FormHelperText>Describe your item.</FormHelperText>
                                    )}
                                </FormControl>
                                <Divider my="1rem"/>
                                <FormControl>
                                    <FormLabel>Tags:</FormLabel>
                                    <CheckboxGroup defaultValue={fetchedItem?.tags} colorScheme={"teal"}>
                                        <Flex wrap={"wrap"} gap={3}>
                                            {availableTags.map((tag: string) => {
                                                return (
                                                    <Checkbox
                                                        key={uuidv4()}
                                                        name={tag}
                                                        id={tag}
                                                        onChange={(e) => {
                                                            const { checked, name } = e.target;
                                                            if (checked) {
                                                                formik.setFieldValue("tags", [...formik.values.tags, name]);
                                                            } else {
                                                                formik.setFieldValue(
                                                                    "tags",
                                                                    formik.values.tags.filter((v) => v !== name)
                                                                );
                                                            }
                                                        }}
                                                        value={tag}
                                                    >
                                                        {tag}
                                                    </Checkbox>
                                                )
                                            })}
                                        </Flex>
                                    </CheckboxGroup>
                                    {formik.errors.tags && formik.touched.tags ? (
                                        <Alert mt={1} p={2} size="sm" borderRadius="3xl" status="warning">
                                            <AlertIcon />
                                            {formik.errors.tags}
                                        </Alert>
                                    ) : (
                                        <FormHelperText>Choose appropriate tags for your collection.</FormHelperText>
                                    )}
                                </FormControl>
                                <Divider my="1rem"/>
                                <FormControl isRequired>
                                    <FormLabel>Approximate Price:</FormLabel>
                                    <Input
                                        type="number"
                                        name="price" 
                                        id="price" 
                                        onChange={formik.handleChange}
                                        value={formik.values.price}
                                    />
                                    {formik.errors.price && formik.touched.price ? (
                                        <Alert mt={1} p={2} size="sm" borderRadius="3xl" status="warning">
                                            <AlertIcon />
                                            {formik.errors.price}
                                        </Alert>
                                    ) : (
                                        <FormHelperText>{`Estimate your item's price.`}</FormHelperText>
                                    )}
                                </FormControl>
                                <Divider my="1rem"/>
                                <FormControl>
                                    <FormLabel>Choose which category this item belongs to.</FormLabel>
                                    <RadioGroup 
                                        id="category" 
                                        name="category"
                                        value={formik.values.category}>
                                        <Flex gap={3}>
                                            <Radio onChange={formik.handleChange} id="display" value="display">Display</Radio>
                                            <Radio onChange={formik.handleChange} id="buying" value="buying">Buying</Radio>
                                            <Radio onChange={formik.handleChange} id="selling" value="selling">Selling</Radio>
                                        </Flex>
                                    </RadioGroup>
                                    {formik.errors.category && formik.touched.category ? (
                                        <Alert mt={1} p={2} size="sm" borderRadius="3xl" status="warning">
                                            <AlertIcon />
                                            {formik.errors.category}
                                        </Alert>
                                    ) : (
                                        <FormHelperText>{'Are you displaying, looking to buy, or selling this item?'}</FormHelperText>
                                    )}
                                </FormControl>
                                <Divider my="1rem"/>
                                <Checkbox onChange={() => toggleClearPictures()}> 
                                    Delete <b>all</b> previous images?
                                </Checkbox>
                                <Divider my="1rem"/>
                                <FormControl isRequired>
                                    <FormLabel>Add images to your item here.</FormLabel>
                                    <Dropzone
                                        onDrop={ (acceptedFilesArray) => {
                                            const filenameArrayPlaceholder: string[] = [];
                                            acceptedFilesArray.forEach((file) => {
                                                filenameArrayPlaceholder.push(file.name);
                                            })
                                            formik.setFieldValue("imageArray", acceptedFilesArray);
                                            setUploadedPicture(true);
                                            setFileName(filenameArrayPlaceholder);
                                        }}
                                        // Accept only images of these filetypes
                                        accept={{
                                            'image/png': ['.png'], 
                                            'image/jpeg': ['.jpg', '.jpeg'],
                                            'image/gif': ['.gif'],
                                            'image/webp': ['.webp']
                                        }}
                                    >
                                        {({ getRootProps, getInputProps, isDragActive }) => (
                                            <Box p={3} borderStyle={"dashed"} borderWidth="1px" {...getRootProps()}>
                                                <input {...getInputProps()} multiple />
                                                {isDragActive ? (
                                                    <p>Drop the files here ...</p>
                                                ) : (
                                                    ((uploadedPicture && fileName)
                                                        ? (
                                                            <Text opacity={"80%"}>{fileName.map((name) => `${name} `)}</Text>
                                                        )
                                                        : (
                                                            <Text opacity={"80%"}>Drag and drop your images here, or click to select an image.</Text>
                                                        ))
                                                )}
                                            </Box>
                                        )}
                                    </Dropzone>
                                </FormControl>
                                <Divider my="1rem"/>
                                {/* <FormControl>
                                    <FormLabel>User:</FormLabel>
                                    <Select
                                        id ="user"
                                        name="user"
                                        placeholder={loggedinUser.username}
                                        onChange={formik.handleChange}
                                        // defaultValue={formik.values.user}
                                        value={formik.values.user}
                                        isRequired
                                        disabled>
                                        <option key={uuidv4()} value={loggedinUser._id}>{loggedinUser.username}</option>
                                    </Select>
                                    <Divider my="1rem"/>
                                </FormControl>
                                {(fetchedCollection)
                                    ? (
                                        <>
                                            <FormControl>
                                                <FormLabel>Collection:</FormLabel>
                                                <Select
                                                    id ="group"
                                                    name="group"
                                                    placeholder={fetchedCollection.name}
                                                    onChange={formik.handleChange}
                                                    // defaultValue={formik.values.group}
                                                    value={formik.values.group}
                                                    isRequired
                                                    disabled>
                                                    <option key={uuidv4()} value={collectionId}>{fetchedCollection.name}</option>
                                                </Select>
                                                <Divider my="1rem"/>
                                                </FormControl>
                                                </>
                                                
                                                )
                                                : (
                                                    null
                                                )} */}
                                <Button disabled={submitting} type='submit' colorScheme="teal">
                                    {submitting ? <Spinner></Spinner> : <Text>Update</Text>}
                                </Button>
                            </form>
                               
                        </Flex>
                    ) : (
                        <Center w={width}>
                            <Alert status='error' borderRadius={"3xl"}>
                                <AlertIcon />
                                <AlertTitle>Please log in first.</AlertTitle>
                                <AlertDescription>Create collections here after logging in.</AlertDescription>
                            </Alert>
                        </Center>
                    )
            )
            : (

                <LoadingPage />

            )
    );

}

export default UpdateItem;