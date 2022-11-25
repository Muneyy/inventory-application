import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import currentUserReducer from '../Features/currentUserSlice'
import currentTokenReducer from '../Features/currentTokenSlice'
import { persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'

const reducers = combineReducers({
    currentUser: currentUserReducer,
    currentToken: currentTokenReducer,
});

const persistConfig = {
    timeout: 10, //Set the timeout function to 0.5s seconds
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk]
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch