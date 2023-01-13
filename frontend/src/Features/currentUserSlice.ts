import { createSlice } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';

const initialState: any = {
    returned: []
}

export const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState,
    reducers: {
        login: (state, action) => {
            const tempArray = [];
            tempArray.push(action.payload);
            state.returned = tempArray;
        },
        logout: (state, action)=> {
            const tempArray: any = [];
            state.returned = tempArray;
            storage.removeItem('root');
        }
    }
})

export const { login, logout } = currentUserSlice.actions;

export default currentUserSlice.reducer;