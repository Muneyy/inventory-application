import { createSlice } from '@reduxjs/toolkit'

interface userState {
    value: Record<string, unknown>[]
}

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
        }
    }
})

export const { login, logout } = currentUserSlice.actions;

export default currentUserSlice.reducer;