import React from 'react';
import './App.css';
import User from './Components/User';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import { ChakraProvider } from '@chakra-ui/react'
import CreateUser from './Components/CreateUser';

function App() {
    return (
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    <Route path ='/' element={<Home/>}/>
                    <Route path ='/createUser' element={<CreateUser/>} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default App;
