import { Spinner, Divider, Container, Heading, Center, Text, Button, Stack, Link, Select } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from '@chakra-ui/react';
import { useFormik } from "formik";

function CreateCollection () {
    const [loading, setLoading] = useState(1);
    const navigate = useNavigate();
    const [reqData, setReqData] = useState([]);

    const formik = useFormik({
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
                user: values.user
            }

            console.log("This is what I am submitting:")
            console.log(submitCollection)

            axios.post('http://localhost:3000/collections', submitCollection)
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
                <Center>
                    <Center flexDirection="column" mt="5rem" w="600px">
                        <Heading size='2xl' fontWeight="extrabold">Create a Collection</Heading>
                        <Heading size='l'> Please fill out the fields below.</Heading>
                        <Container borderWidth='1px' borderRadius='lg' py={"5"} px={"10"} mt="1rem" centerContent>
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
                                    placeholder='Select user to assign collection to.' 
                                    onChange={formik.handleChange}
                                    value={formik.values.user}
                                    isRequired>
                                    {reqData.map((user: any) => {
                                        return (
                                            <option key={uuidv4()} value={user._id}>{user.username}</option>
                                        )
                                    })}
                                </Select>
                                <Divider my="1rem"/>
                                <Button type='submit' colorScheme="teal">Create!</Button>
                            </form>
                        </Container>
                    </Center>
                </Center>
            )
            : (

                <Center mt={"5rem"}>
                    <Spinner />
                </Center>

            )
    );

}

export default CreateCollection;