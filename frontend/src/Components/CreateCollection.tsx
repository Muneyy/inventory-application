import { Spinner, Divider, Container, Heading, Center, Text, Button, Stack, Link, Select, Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@chakra-ui/react';
import { useFormik } from "formik";
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

    const JWTconfig = {
        headers: { Authorization: `Bearer ${tokenJWT}` }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: "",
            summary: "",
            img_url: "",
            user: "",
        },
        onSubmit: (values) => {
            const submitCollection = {
                name: values.name,
                summary: values.summary,
                img_url: values.img_url,
                user: currentUser.returned[0]._id,
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
                                        width="400px"
                                        type="text" 
                                        name="name" 
                                        id="name" 
                                        onChange={formik.handleChange}
                                        value={formik.values.name} 
                                    />
                                    <FormHelperText>Username cannot be empty.</FormHelperText>
                                </FormControl>
                                <Divider my="1rem"/>
                                <FormControl isRequired>
                                    <FormLabel>Summary:</FormLabel>
                                    <Input 
                                        type="text" 
                                        name="summary" 
                                        id="summary" 
                                        onChange={formik.handleChange}
                                        value={formik.values.summary} 
                                    />
                                    <FormHelperText>Some text to introduce yourself.</FormHelperText>
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