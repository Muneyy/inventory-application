import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import { Box, Button, Center, ChakraProvider, Container, Flex, Grid, GridItem, Heading, Icon, useColorMode } from '@chakra-ui/react'
import CreateUser from './Components/SignUp';
import CreateCollection from './Components/CreateCollection';
import LogIn from './Components/LogIn';
import store from './app/store'
import { Provider } from 'react-redux'
import Profile from './Components/Profile';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import UserProfile from './Components/UserProfile';
import UsersList from './Components/UsersList';
import theme from "./theme"
import NavBar from './Components/Navbar';
import LeftLinks from './Components/AppComponents/LeftLinks';
import RightLinks from './Components/AppComponents/RightLinks';
import CollectionPage from './Components/CollectionPage';
import CreateItem from './Components/CreateItem';

function App() {

    const persistor = persistStore(store);

    return (
        <ChakraProvider theme={theme}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        {/* prevent scrollbar from messing up width of the page */}
                        <Box overflowX={"clip"} maxW="calc(100vw - 1em)" >
                            <NavBar />
                            <Center>
                                <Flex position="static">
                                    <LeftLinks />
                                    <Center alignItems={"center"} mx={3} display="flex" justifyContent={"flex-start"} flexDirection="column" 
                                        borderWidth='1px' py={10} borderY={"none"} minW="768px" maxW="768px" minHeight={"94vh"}>
                                        <Routes>
                                            <Route path ='/' element={<Home/>}/>
                                            <Route path ='/createUser' element={<CreateUser/>} />
                                            <Route path ='/createCollection' element={<CreateCollection/>} />
                                            <Route path='/collections/:collectionId/createItem' element={<CreateItem/>} />
                                            <Route path ='/login' element={<LogIn/>} />
                                            <Route path ='/profile' element={<Profile/>} />
                                            <Route path='/:userId' element={<UserProfile/>} />
                                            <Route path="/users" element={<UsersList/>}/>
                                            <Route path="/collections/:collectionId" element={<CollectionPage/>} />
                                        </Routes>
                                    </Center>
                                    <RightLinks />
                                </Flex>
                            </Center>
                        </Box>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </ChakraProvider>
    );
}

export default App;
