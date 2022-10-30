import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Spinner, Container, Heading, Center, Text, Button, Stack, Link } from '@chakra-ui/react'
import {ArrowForwardIcon} from '@chakra-ui/icons'

function Home() {
    const [loading, setLoading] = useState(0);
    const [reqData, setReqData] = useState<any>({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/users')
                setLoading(1);
                setReqData(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUsers();
    }, []);

    return (
        (loading)
            ? (
                <Center mt={"5rem"}>
                    <Container borderWidth='1px' borderRadius='lg' py={"5"} px={"10"} w={"1000px"} centerContent>
                        <Heading fontSize="6xl" fontWeight="extrabold">
                            Welcome
                        </Heading>
                        <Heading size="m">Current Users:</Heading>
                        {reqData.map((user:any) => {
                            return (
                                <Container key={uuidv4()} borderWidth='1px' borderRadius='lg'>
                                    <Text>{user.username}</Text>
                                    <Text>{user.bio}</Text>
                                </Container>
                            )
                        })}
                        <Text>
                            Select which category you would like to create:
                        </Text>
                        <Stack direction="row" spacing={4} mt={3}>
                            <Link href='/createUser' textDecoration="none">
                                <Button rightIcon={<ArrowForwardIcon />} variant="solid" colorScheme="teal">
                                    User
                                </Button>
                            </Link>
                            <Link href='/createCollection'>
                                <Button rightIcon={<ArrowForwardIcon />} variant="solid" colorScheme="teal">
                                    Collection
                                </Button>
                            </Link>
                            <Link href='/createItem'>
                                <Button rightIcon={<ArrowForwardIcon />} variant="solid" colorScheme="teal">
                                    Item
                                </Button>
                            </Link>
                        </Stack>
                    </Container>
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

export default Home;