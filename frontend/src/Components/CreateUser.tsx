import { Spinner, Divider, Container, Heading, Center, Text, Button, Stack, Link } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@chakra-ui/react';
import { useFormik } from "formik";
import { useDispatch } from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import store from '../app/store';

// import dispatch actions for logging out user in Redux
import { login, logout } from '../Features/currentUserSlice';

function CreateUser () {
    const [loading, setLoading] = useState(1);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            username: "",
            handle: "",
            password: "",
            email: "",
            bio: ""
        },
        onSubmit: (values) => {

            const submitUser = {
                username: values.username,
                handle: values.handle,
                password: values.password,
                bio: values.bio,
                email: values.email,
            }

            axios.post('http://localhost:3000/users', submitUser)
                .then(res => {
                    console.log(res);
                    const persistor = persistStore(store);
                    persistor.purge();
                    navigate('/');
                })
        }
    })

    return(
        (loading)
            ? (
                <>
                    <Heading size='2xl' fontWeight="extrabold">Sign Up!</Heading>
                    <Heading size='l'> Please fill out the fields below.</Heading>
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
                            <FormHelperText>Username cannot be empty.</FormHelperText>
                        </FormControl>
                        <Divider my="1rem"/>
                        <FormControl isRequired w="md">
                            <FormLabel>Handle:</FormLabel>
                            <Input
                                type="text"
                                name="handle"
                                id="handle"
                                onChange={formik.handleChange}
                                value={formik.values.handle}
                            />
                            <FormHelperText>Handle must be unique.</FormHelperText>
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
                            <FormHelperText>Minimum of 8 characters.</FormHelperText>
                        </FormControl>
                        <Divider my="1rem"/>
                        <FormControl isRequired w="md">
                            <FormLabel>Bio:</FormLabel>
                            <Input
                                type="text"
                                name="bio"
                                id="bio"
                                onChange={formik.handleChange}
                                value={formik.values.bio}
                            />
                            <FormHelperText>Description.</FormHelperText>
                        </FormControl>
                        <Divider my="1rem"/>
                        <FormControl isRequired>
                            <FormLabel>Email:</FormLabel>
                            <Input
                                type="text"
                                name="email"
                                id="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                            />
                            <FormHelperText>Please enter a valid email.</FormHelperText>
                        </FormControl>
                        <Divider my="1rem"/>
                        <Button type='submit' colorScheme="teal">Create!</Button>
                    </form>
                </>
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