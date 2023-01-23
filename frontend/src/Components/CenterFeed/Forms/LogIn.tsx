import { Spinner, Divider, Container, Heading, Center, Text, Button, Stack, Link, Flex, useMediaQuery, Box, Alert, AlertIcon } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@chakra-ui/react';
import { useFormik } from "formik";
import { login, logout } from '../../../Features/currentUserSlice';
import { setToken, removeToken } from '../../../Features/currentTokenSlice';
import { useAppSelector, useAppDispatch } from '../../../app/hooks'

function LogIn () {
    const [currentUser, setCurrentUser] = useState<any>()
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [wrongPassword, setWrongPassword] = useState<boolean>(false);

    // Formik to handle form
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        // username is still the value being passed for the 'handle'
        // since passport.js automatically assumes username as the input
        // for its LocalStrategy
        onSubmit: async (values) => {
            const submitUser = {
                username: values.username,
                password: values.password,
            }

            await axios.post('http://localhost:3000/log-in', submitUser)
                .then(res => {
                    // Change REDUX current state user here
                    console.log(res.data);
                    dispatch(login(res.data.user));
                    dispatch(setToken(res.data.token));
                    setCurrentUser(res.data.user);
                    navigate("/profile");
                })
                .catch(err => {
                    console.log(err);
                    if (err.response.status === 400){
                        setWrongPassword(true);
                    }
                })
        }
    })
    
    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");
  
    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
    }, [isSmallScreen]);

    return (
        (currentUser) 
            ? (
                <Center mt="5rem">
                    <Heading> Welcome back {currentUser.username} </Heading>
                </Center>
            )
            : (
                <Box p={5} width={width} display="flex" flexDir={"column"}>
                    <Heading mb={3} size='xl' fontWeight="extrabold">Log In</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <Flex flexDir={"column"}>
                            <FormControl isRequired>
                                <FormLabel>Handle:</FormLabel>
                                <Input
                                    type="text"
                                    name="username"
                                    id="username"
                                    onChange={formik.handleChange}
                                    value={formik.values.username}
                                />
                                <FormHelperText>Please use your unique handle to log in.</FormHelperText>
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
                            {(wrongPassword) 
                                ? (
                                    <Alert mt={1} p={2} size="sm" borderRadius="3xl" status="warning">
                                        <AlertIcon />
                                        Incorrect handle or password. Please try again.
                                    </Alert>

                                ) : (
                                    null
                                )}
                            <Button alignSelf="flex-end" justifySelf="flex-end" mt={5} type='submit' colorScheme="teal">Login</Button>
                        </Flex>
                    </form>
                </Box>

            )
    )
}

export default LogIn;