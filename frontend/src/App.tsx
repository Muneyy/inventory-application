import React from 'react';
import './App.css';
import User from './Components/User';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import { Box, Button, Center, ChakraProvider, Container, Flex, Grid, GridItem, Heading, Icon, useColorMode } from '@chakra-ui/react'
import CreateUser from './Components/CreateUser';
import CreateCollection from './Components/CreateCollection';
import LogIn from './Components/LogIn';
import store from './app/store'
import { Provider } from 'react-redux'
import Profile from './Components/Profile';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { constants } from 'fs/promises';
import {Link as RouteLink} from "react-router-dom";
import UserProfile from './Components/UserProfile';
import { v4 } from 'uuid';
import FriendRequestsModal from './Components/Modals/FriendRequests';
import SettingsModal from './Components/Modals/SettingsModal';
import MessagesModal from './Components/Modals/MessagesModal';
import {AiOutlineHome} from "react-icons/ai"
import {ImProfile} from "react-icons/im"
import {FaUserFriends} from "react-icons/fa"
import { ArrowForwardIcon } from '@chakra-ui/icons';
import UsersList from './Components/UsersList';
import theme from "./theme"
import NavBar from './Components/Navbar';
// Yes 

function App() {

    const persistor = persistStore(store);

    return (
        <ChakraProvider theme={theme}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <NavBar />
                        <Center>
                            <Flex position={"static"}>
                                <Flex flexDirection="column" alignItems={"flex-end"} mt={8} gap="20px" position={"sticky"} top={"80px"} w={"100%"} h={"100%"}>
                                    <RouteLink to="/">
                                        <Button variant="ghost" display="flex" gap={5} w="180px" alignItems={"center"} justifyContent="center">
                                            <Icon as={AiOutlineHome}/>
                                            <Heading flex="1" justifySelf={"flex-start"} size="lg">Home</Heading>
                                        </Button>
                                    </RouteLink>
                                    <RouteLink to="/profile">
                                        <Button variant="ghost" display="flex" gap={5} w="180px" alignItems={"center"} justifyContent="center">
                                            <Icon as={ImProfile} />
                                            <Heading flex="1" justifySelf={"flex-start"} size="lg">Profile</Heading>
                                        </Button>
                                    </RouteLink>
                                    <RouteLink to="/users">
                                        <Button variant="ghost" display="flex" gap={5} w="180px" alignItems={"center"} justifyContent="center">
                                            <Icon as={FaUserFriends} />
                                            <Heading flex="1" justifySelf={"flex-start"} size="lg">Users</Heading>
                                        </Button>
                                    </RouteLink>
                                </Flex>
                                <Flex flexDir={"column"} mx={3} w="800px">
                                    <Routes>
                                        <Route path ='/' element={<Home/>}/>
                                        <Route path ='/createUser' element={<CreateUser/>} />
                                        <Route path ='/createCollection' element={<CreateCollection/>} />
                                        <Route path ='/login' element={<LogIn/>} />
                                        <Route path ='/profile' element={<Profile/>} />
                                        <Route path='/:userId' element={<UserProfile/>} />
                                        <Route path="/users" element={<UsersList/>}/>
                                    </Routes>
                                </Flex>
                                <Flex flexDirection="column" alignItems={"flex-start"} mt={8} gap="5px" position={"sticky"} top={"80px"} w={"100%"} h={"100%"}>
                                    <RouteLink to='/createUser' style={{ textDecoration: 'none' }}>
                                        <Button size="sm" rightIcon={<ArrowForwardIcon />} variant="outline" borderRadius={"3xl"} colorScheme="teal">
                                            Sign up
                                        </Button>
                                    </RouteLink>
                                    <RouteLink to='/login' style={{ textDecoration: 'none' }}>
                                        <Button size="sm" rightIcon={<ArrowForwardIcon />} variant="outline" borderRadius={"3xl"} colorScheme="teal">
                                            Log in
                                        </Button>
                                    </RouteLink>
                                </Flex>
                            </Flex>
                        </Center>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </ChakraProvider>
    );
}

export default App;
