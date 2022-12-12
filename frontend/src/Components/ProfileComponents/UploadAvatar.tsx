import { Flex, FormControl, FormLabel, Button, Spinner, Box, Text } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { login, logout } from '../../Features/currentUserSlice';
import Dropzone from "react-dropzone";
import axios from 'axios';
import React, { useState } from 'react'
import { UserType } from '../../Types/SchemaTypes';

// need loggedinuser as props
function UploadAvatar(props: {
    userId: string,
    setLoggedinUser: React.Dispatch<React.SetStateAction<UserType>>,
    onClose: () => void,
}) {
    // Formik to handle form submit for changing profile picture
    // Set submitting for button in change profile picture
    const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
    
    // state for profile picutre
    const [uploadedPicture, setUploadedPicture] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>("");
    
    const dispatch = useAppDispatch();
    // GET request to get updated attributes of updated logged in user
    async function refreshUserState () {
        await axios.get(`http://localhost:3000/users/${props.userId}`)
            .then(async (res) => {
                console.log(res);
                await dispatch(login(res.data.user));
                const updateUser = useAppSelector(state => state.currentUser);
                await props.setLoggedinUser(updateUser.returned[0])
            })
            .catch(err => {
                console.log(err);
            })
    }

    const formik = useFormik({
        initialValues: {
            image: '',
            userID: props.userId,
        },
        onSubmit: async (values) => {
            setAvatarLoading(true);

            const formData = new FormData();
            formData.append("image", values.image);
            formData.append("userID", props.userId)

            console.log(formData);
            await axios.post('http://localhost:3000/uploadAvatar', formData)
                .then(res => {
                    console.log(res);
                })

            await refreshUserState();
            await setAvatarLoading(false);
            await props.onClose;
        }
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <Flex mt={3} flexDir="column">
                <FormControl isRequired w="md">
                    <FormLabel>Upload image for your profile picture here</FormLabel>
                    <Dropzone
                        onDrop={(acceptedFiles) => {
                            formik.setFieldValue('image', acceptedFiles[0]);
                            console.log(acceptedFiles[0]);
                            setUploadedPicture(true);
                            setFileName(acceptedFiles[0].name)
                        }}
                        accept={{
                            image: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'],
                        }}
                    >
                        {({ getRootProps, getInputProps, isDragActive }) => (
                            <Box p={3} w="sm" borderStyle={"dashed"} borderWidth="1px" {...getRootProps()}>
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p>Drop the files here ...</p>
                                ) : (
                                    ((uploadedPicture)
                                        ? (
                                            <Text opacity={"80%"}>{fileName}</Text>
                                        )
                                        : (
                                            <Text opacity={"80%"}>Drag and drop your image here, or click to select an image.</Text>
                                        ))
                                )}
                            </Box>
                        )}
                    </Dropzone>
                </FormControl>
                {(uploadedPicture) 
                    ? (
                        <Button mt={3} w="3xs" type='submit' colorScheme="teal" disabled={avatarLoading}>{avatarLoading ? <Spinner></Spinner> : "Change Profile Picture"}</Button>
                    ) 
                    : (
                        <></>
                    )}
            </Flex>
        </form>
    )
}

export default UploadAvatar