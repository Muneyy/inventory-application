import { Spinner, Divider, Container, Heading, Center, Text, Button, Stack, Link } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@chakra-ui/react';
import { useFormik } from "formik";

function CreateUser () {
    const [loading, setLoading] = useState(1);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: "",
            bio: ""
        },
        onSubmit: (values) => {

            const submitUser = {
                username: values.username,
                bio: values.bio
            }

            axios.post('http://localhost:3000/users', submitUser)
                .then(res => {
                    console.log(res);
                    navigate('/');
                })
        }
    })

    return(
        (loading)
            ? (
                <Center>
                    <Center flexDirection="column" mt="5rem" w="600px">
                        <Heading size='2xl' fontWeight="extrabold">Create a User</Heading>
                        <Heading size='l'> Please fill out the fields below.</Heading>
                        <Container borderWidth='1px' borderRadius='lg' py={"5"} px={"10"} mt="1rem" centerContent>
                            <form onSubmit={formik.handleSubmit}>
                                <FormControl isRequired>
                                    <FormLabel>Username:</FormLabel>
                                    <Input 
                                        type="text" 
                                        name="username" 
                                        id="username" 
                                        onChange={formik.handleChange}
                                        value={formik.values.username} 
                                    />
                                    <FormHelperText>Username cannot be empty.</FormHelperText>
                                </FormControl>
                                <Divider my="1rem"/>
                                <FormControl isRequired>
                                    <FormLabel>Bio:</FormLabel>
                                    <Input 
                                        type="text" 
                                        name="bio" 
                                        id="bio" 
                                        onChange={formik.handleChange}
                                        value={formik.values.bio} 
                                    />
                                    <FormHelperText>Some text to introduce yourself.</FormHelperText>
                                </FormControl>
                                <Divider my="1rem"/>
                                <Button type='submit' colorScheme="teal">Create!</Button>
                            </form>
                        </Container>
                    </Center>
                </Center>
            )
            : (
                <div>
                    <h1>
                        <Center mt={"5rem"}>
                            <Spinner />
                        </Center>
                    </h1>
                </div>
            )
    );

}

export default CreateUser;