import { Spinner, Divider, Container, Heading, Center, Text, Button, Stack, Link } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@chakra-ui/react';
import { useFormik } from "formik";
import { login, logout } from '../Features/currentUserSlice';
import { setToken, removeToken } from '../Features/currentTokenSlice';
import { useAppSelector, useAppDispatch } from '../app/hooks'

function LogIn () {
    const [currentUser, setCurrentUser] = useState<any>()
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Formik to handle form
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        onSubmit: async (values) => {
            const submitUser = {
                username: values.username,
                password: values.password,
            }

            await axios.post('http://localhost:3000/log-in', submitUser)
                .then(res => {
                    // Change REDUX current state user here
                    // console.log(res.data.user);
                    dispatch(login(res.data.user));
                    dispatch(setToken(res.data.token));
                    setCurrentUser(res.data.user);
                    navigate("/profile");
                })
        }
    })

    return (
        (currentUser) 
            ? (
                <Center mt="5rem">
                    <Heading> Welcome back {currentUser.username} </Heading>
                </Center>
            )
            : (
                <Center>
                    <Center flexDirection="column">
                        <Heading size='2xl' fontWeight="extrabold">Log In</Heading>
                        <Heading size='l'> Enter your credentials</Heading>
                        <Container borderWidth='3px' borderRadius='lg' py={"30px"} px={"50px"} mt="1rem" centerContent>
                            <form onSubmit={formik.handleSubmit}>
                                <FormControl isRequired w="md">
                                    <FormLabel>Username:</FormLabel>
                                    <Input 
                                        type="text" 
                                        name="username" 
                                        id="username" 
                                        onChange={formik.handleChange}
                                        value={formik.values.username} 
                                    />
                                </FormControl>
                                <Divider my="1rem"/>
                                <FormControl isRequired>
                                    <FormLabel>Password:</FormLabel>
                                    <Input 
                                        type="password" 
                                        name="password" 
                                        id="password" 
                                        onChange={formik.handleChange}
                                        value={formik.values.password}
                                        minLength={8}
                                    />
                                </FormControl>
                                <Divider my="1rem"/>
                                <Button type='submit' colorScheme="teal">Login</Button>
                            </form>
                        </Container>
                    </Center>
                </Center>

            )
    )
}

export default LogIn;