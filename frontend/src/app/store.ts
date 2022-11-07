import { configureStore } from '@reduxjs/toolkit'
import currentUserReducer from '../Features/currentUserSlice'
import currentTokenReducer from '../Features/currentTokenSlice'

const store = configureStore({
    reducer: {
        currentUser: currentUserReducer,
        currentToken: currentTokenReducer,
    }
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch