import React from 'react';
import './App.css';
import User from './Components/User';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import { ChakraProvider } from '@chakra-ui/react'
import CreateUser from './Components/CreateUser';
import CreateCollection from './Components/CreateCollection';
import LogIn from './Components/LogIn';
import store from './app/store'
import { Provider } from 'react-redux'
import Profile from './Components/Profile';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { constants } from 'fs/promises';
// Yes

function App() {

    const persistor = persistStore(store);

    return (
        <ChakraProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <Routes>
                            <Route path ='/' element={<Home/>}/>
                            <Route path ='/createUser' element={<CreateUser/>} />
                            <Route path ='/createCollection' element={<CreateCollection/>} />
                            <Route path ='/login' element={<LogIn/>} />
                            <Route path ='/profile' element={<Profile/>} />
                        </Routes>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </ChakraProvider>
    );
}

export default App;
