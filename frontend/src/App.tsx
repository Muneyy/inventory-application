import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Components/CenterFeed/Display/Home';
import { Box, Button, Center, ChakraProvider, Container, Flex, Grid, GridItem, Heading, Icon, useColorMode } from '@chakra-ui/react'
import CreateUser from './Components/CenterFeed/Forms/SignUp';
import CreateCollection from './Components/CenterFeed/Forms/CreateCollection';
import LogIn from './Components/CenterFeed/Forms/LogIn';
import store from './app/store'
import { Provider } from 'react-redux'
import Profile from './Components/CenterFeed/Display/Profile/Profile';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import UserProfile from './Components/CenterFeed/Display/UserProfile';
import UsersList from './Components/CenterFeed/Display/UsersList';
import theme from "./theme"
import NavBar from './Components/NavBar/Navbar';
import LeftLinks from './Components/AppComponents/LeftLinks';
import RightLinks from './Components/AppComponents/RightLinks';
import CollectionPage from './Components/CenterFeed/Display/CollectionPage';
import CreateItem from './Components/CenterFeed/Forms/CreateItem';
import MobileMenu from './Components/MobileBar/MobileMenu';
import ScrollToTop from './Components/ScrollToTop';
import { useMediaQuery } from 'react-responsive'

function App() {

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 700px)'
    });

    const persistor = persistStore(store);

    return (
        <ChakraProvider theme={theme}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <ScrollToTop />
                        {/* prevent scrollbar from messing up width of the page */}
                        {/* TODO: find alternatives for scrollbar since this does not work well for mobiile viewports */}
                        <Box position="relative" overflowX={"clip"} maxW={isDesktopOrLaptop ? "calc(100vw - 1em)" : "100%"} >
                            <NavBar />
                            <Center>
                                <Flex position="static">
                                    <LeftLinks />
                                    <Center alignItems={"center"} mx={3} display="flex" justifyContent={"flex-start"} flexDirection="column" 
                                        borderWidth='1px' py={10} borderY={"none"} minHeight={"94vh"}>
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
                            <MobileMenu />
                        </Box>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </ChakraProvider>
    );
}

export default App;
