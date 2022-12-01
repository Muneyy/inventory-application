import React from 'react';
import './App.css';
import User from './Components/User';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import { Box, Center, ChakraProvider, Container, Flex, Heading } from '@chakra-ui/react'
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
// Yes

function App() {

    const persistor = persistStore(store);

    return (
        <ChakraProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <Box border={1} borderColor="blackAlpha.200" backgroundColor={"teal.200"} py={3}>
                            <Flex justifyContent={"space-evenly"} alignItems="center">
                                <Heading fontSize={"xl"}>POP IT</Heading>
                                <Flex gap={"10px"} alignItems="center" justifyContent={"space-evenly"}>
                                    <MessagesModal />
                                    <FriendRequestsModal/>
                                    <SettingsModal />
                                </Flex>
                            </Flex>
                        </Box>
                        <Routes>
                            <Route path ='/' element={<Home/>}/>
                            <Route path ='/createUser' element={<CreateUser/>} />
                            <Route path ='/createCollection' element={<CreateCollection/>} />
                            <Route path ='/login' element={<LogIn/>} />
                            <Route path ='/profile' element={<Profile/>} />
                            <Route path='/:userId' element={<UserProfile/>} />
                        </Routes>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </ChakraProvider>
    );
}

export default App;
