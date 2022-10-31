import React from 'react';
import './App.css';
import User from './Components/User';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import { ChakraProvider } from '@chakra-ui/react'
import CreateUser from './Components/CreateUser';
import CreateCollection from './Components/CreateCollection';
import LogIn from './Components/LogIn';

function App() {
    return (
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    <Route path ='/' element={<Home/>}/>
                    <Route path ='/createUser' element={<CreateUser/>} />
                    <Route path ='/createCollection' element={<CreateCollection/>} />
                    <Route path ='/login' element={<LogIn/>} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default App;
