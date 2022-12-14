import { Spinner, Flex, Checkbox, Divider, Container, Heading, Center, Text, Button, Stack, Link, Select, Alert, AlertDescription, AlertIcon, AlertTitle, CheckboxGroup, Tag, Textarea } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@chakra-ui/react';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useAppSelector } from '../app/hooks';

function CreateCollection () {
    const [loading, setLoading] = useState(1);
    const navigate = useNavigate();
    const [reqData, setReqData] = useState([]);

    // Retrieve logged in user state and JWT token from Redux
    const currentUser = useAppSelector(state => state.currentUser);
    let loggedinUser: any = {};
    // Get token and refactor
    const token = useAppSelector(state => state.currentToken);
    let tokenJWT = ""

    // Refactor REDUX states
    if (currentUser.returned.length === 1) {
        loggedinUser = currentUser.returned[0];
    }
    if (token.returned.length === 1) {
        tokenJWT = token.returned[0];
    }

    const CollectionSchema = Yup.object().shape({
        name: Yup.string()
            .min(1, "Name must be between 1-20 characters")
            .max(20, "Name must be between 1-20 characters")
            .required('Required'),
        summary: Yup.string()
            .min(1, "Summary must be between 1-40 characters")
            .max(40, "Summary must be between 1-40 characters")
            .required('Required'),
        tags: Yup.array()
            .of(Yup.string())
            .min(1, "Please select at least one tag")
            .required("Please select at least one tag")
    })

    const JWTconfig = {
        headers: { Authorization: `Bearer ${tokenJWT}` }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: "",
            summary: "",
            tags: [
            ],
            img_url: "",
            user: "",
        },
        validationSchema: CollectionSchema,
        onSubmit: (values) => {
            const submitCollection = {
                name: values.name,
                summary: values.summary,
                tags: values.tags,
                img_url: values.img_url,
                user: loggedinUser._id,
            }

            console.log("This is what I am submitting:")
            console.log(submitCollection)

            axios.post('http://localhost:3000/collections/post', submitCollection, JWTconfig)
                .then(res => {
                    console.log(res);
                    navigate('/');
                })
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

    const availableTags = [
        "k-pop",
        "j-pop",
        "p-pop",
        "soloist",
        "boy-group",
        "girl-group",
    ]

    return(
        (loading)
            ? (
                (currentUser.returned.length === 1)
                    ? (
                        <>
                            <form onSubmit={formik.handleSubmit}>
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
                                    <FormLabel>Summary:</FormLabel>
                                    <Textarea 
                                        name="summary" 
                                        id="summary" 
                                        onChange={formik.handleChange}
                                        value={formik.values.summary}
                                    />
                                    {formik.errors.summary && formik.touched.summary ? (
                                        <Alert mt={1} p={2} size="sm" borderRadius="3xl" status="warning">
                                            <AlertIcon />
                                            {formik.errors.summary}
                                        </Alert>
                                    ) : (
                                        <FormHelperText>Describe your collection.</FormHelperText>
                                    )}
                                </FormControl>
                                <Divider my="1rem"/>
                                <FormControl>
                                    <FormLabel>Tags:</FormLabel>
                                    <CheckboxGroup colorScheme={"teal"}>
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
                                <FormControl>
                                    <FormLabel>Image URL:</FormLabel>
                                    <Input 
                                        type="text" 
                                        name="img_url" 
                                        id="img_url" 
                                        onChange={formik.handleChange}
                                        value={formik.values.img_url} 
                                    />
                                    <FormHelperText>Optional. URL for your pfp.</FormHelperText>
                                </FormControl>
                                <Divider my="1rem"/>
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
                                <Button type='submit' colorScheme="teal">Create!</Button>
                            </form>
                               
                        </>
                    ) : (
                        <Center>
                            <Alert status='error' borderRadius={"3xl"}>
                                <AlertIcon />
                                <AlertTitle>Please log in first.</AlertTitle>
                                <AlertDescription>Create collections here after logging in.</AlertDescription>
                            </Alert>
                        </Center>
                    )
            )
            : (

                <Center mt={"5rem"}>
                    <Spinner />
                </Center>

            )
    );

}

export default CreateCollection;