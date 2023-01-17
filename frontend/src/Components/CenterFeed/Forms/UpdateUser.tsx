import { Spinner, Divider, Container, Heading, Center, Text, Button, Stack, Link, AlertIcon, Alert, Box, useMediaQuery } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@chakra-ui/react';
import { Formik, Form, Field, useFormik } from "formik";
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import store from '../../../app/store';

// import dispatch actions for logging out user in Redux
import { login, logout } from '../../../Features/currentUserSlice';
import LoadingPage from '../Loading/LoadingPage';
import { UserType } from '../../../Types/UserType';
import { resolve } from 'node:path/win32';
import { useGetUserAndToken } from '../../../HelperFunctions/useGetUserandToken';

function UpdateUser () {
    const [loaded, setLoaded] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [submitting, setSubmitting] = useState<boolean>(false);
    const {userId} = useParams();
    const [loggedinUser, tokenJWT] = useGetUserAndToken();
    const [handleChecker, setHandleChecker] = useState<string>();
    const [usersHandles, setUsersHandles] = useState<string[]>([]);

    useEffect(() => {
        setHandleChecker(loggedinUser.handle);
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/users/handles');
                setUsersHandles(res.data
                    .filter((user: any) => user.handle !== undefined && user.handle !== loggedinUser.handle)
                    .map((user: any) => user.handle));
                setLoaded(1);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        console.log(usersHandles)
    }, [usersHandles]);

    const SignupSchema = Yup.object().shape({
        username: Yup.string()
            .min(2, "Username must be between 2-20 characters")
            .max(20, "Username must be between 2-20 characters")
            .required('Required'),
        handle: Yup.string()
            .min(6, "Handle must be between 6-12 characters")
            .max(12, "Handle must be between 6-12 characters")
            .matches(/^[a-zA-Z0-9]+$/, "Handle must not contain spaces or special characters")
            .test('handle-not-taken', 'This handle is already taken.', (handle: any) => {
                // Check if the handle is already taken
                return !usersHandles.includes(handle);
            })
            .required('Required'),
    })


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: loggedinUser
            ? {
                username: loggedinUser.username,
                handle: loggedinUser.handle,
                bio: loggedinUser.bio
            }
            : {
                username: "",
                handle: "",
                bio: ""
            },
        validationSchema: SignupSchema,
        onSubmit: (values) => {
            setSubmitting(true);
            const submitUser = {
                username: values.username,
                handle: values.handle,
                bio: values.bio,
                requesterId: loggedinUser._id,
            }

            axios.put(`http://localhost:3000/users/${userId}/update`, submitUser, tokenJWT)
                .then(async (res) => {
                    console.log(res);
                    await refreshUserState();
                    setSubmitting(false);
                    navigate(`/profile`);
                })
        }, 
    })

    // GET request to get updated attributes of updated logged in user
    async function refreshUserState () {
        await axios.get(`http://localhost:3000/users/${loggedinUser._id}`)
            .then(async (res) => {
                // console.log(res);
                await dispatch(login(res.data.user));
                // const updateUser = useAppSelector(state => state.currentUser);
                // await props.setLoggedinUser(updateUser.returned[0])
            })
            .catch(err => {
                console.log(err);
            })
    }

    const [isSmallScreen] = useMediaQuery("(max-width: 570px)");
    const [width, setWidth] = useState(isSmallScreen ? "100vw" : "570px");
  
    useEffect(() => {
        setWidth(isSmallScreen ? "100vw" : "570px");
    }, [isSmallScreen]);

    return(
        (loaded)
            ? (
                <Box w={width} p={5}>
                    <Heading size='xl' fontWeight="extrabold">Update Profile</Heading>
                    
                    <form onSubmit={formik.handleSubmit}>
                        <FormControl isRequired >
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
                                <FormHelperText>Username must be 2-20 characters.</FormHelperText>
                            )}
                        </FormControl>
                        <Divider my="1rem"/>
                        <FormControl isRequired >
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
                        <FormControl isRequired >
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
                        <Button disabled={submitting} type='submit' colorScheme="teal">{submitting ? <Spinner></Spinner> : "Update"}</Button>
                        {/* </Formik> */}
                    </form>
                </Box>
            )
            : (
                <LoadingPage />
            )
    );

}

export default UpdateUser;