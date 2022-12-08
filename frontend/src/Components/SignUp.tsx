import { Spinner, Divider, Container, Heading, Center, Text, Button, Stack, Link, AlertIcon, Alert } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@chakra-ui/react';
import { Formik, Form, Field, useFormik } from "formik";
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import store from '../app/store';

// import dispatch actions for logging out user in Redux
import { login, logout } from '../Features/currentUserSlice';

function CreateUser () {
    const [loading, setLoading] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const usersHandles: string[] = [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get('http://localhost:3000/users/handles')
                    .then(res => {
                        console.log(res.data);
                        res.data.forEach((handle: string)=> {
                            usersHandles.push(handle);
                        })})
                setLoading(1);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [])

    const SignupSchema = Yup.object().shape({
        username: Yup.string()
            .min(8, "Username must be between 8-20 characters")
            .required('Required'),
        handle: Yup.string()
            .min(6, "Handle must be between 4-12 characters")
            .required('Required')
            .oneOf(usersHandles, "This handle is already taken."),
        password: Yup.string()
            .min(8, "Password must be a minimum of 8 characters"),
        email: Yup.string()
            .email('Invalid email')
            .required('Required'),
    })

    const formik = useFormik({
        initialValues: {
            username: "",
            handle: "",
            password: "",
            email: "",
            bio: ""
        },
        validationSchema: SignupSchema,
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
        },
        
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
                            {formik.errors.username && formik.touched.username ? (
                                <Alert mt={1} p={2} size="sm" borderRadius="3xl" status="warning">
                                    <AlertIcon />
                                    {formik.errors.username}
                                </Alert>
                            ) : (
                                <FormHelperText>Username must be 8-20 characters.</FormHelperText>
                            )}
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
                            {formik.errors.handle && formik.touched.handle ? (
                                <Alert mt={1} p={2} size="sm" borderRadius="3xl" status="warning">
                                    <AlertIcon />
                                    {formik.errors.handle}
                                </Alert>
                            ) : (
                                <FormHelperText>Handle must be 6-12 characters and unique.</FormHelperText>
                            )}
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
                            {formik.errors.password && formik.touched.password ? (
                                <Alert mt={1} p={2} size="sm" borderRadius="3xl" status="warning">
                                    <AlertIcon />
                                    {formik.errors.password}
                                </Alert>
                            ) : (
                                <FormHelperText>Minimum of 8 characters.</FormHelperText>
                            )}
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
                            {formik.errors.bio && formik.touched.bio ? (
                                <Alert mt={1} p={2} size="sm" borderRadius="3xl" status="warning">
                                    <AlertIcon />
                                    {formik.errors.bio}
                                </Alert>
                            ) : (
                                <FormHelperText>Make a brief statement.</FormHelperText>
                            )}
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
                            {formik.errors.email && formik.touched.email ? (
                                <Alert mt={1} p={2} size="sm" borderRadius="3xl" status="warning">
                                    <AlertIcon />
                                    {formik.errors.email}
                                </Alert>
                            ) : (
                                <FormHelperText>Please enter a valid email.</FormHelperText>
                            )}
                        </FormControl>
                        <Divider my="1rem"/>
                        <Button type='submit' colorScheme="teal">Create!</Button>
                        {/* </Formik> */}
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