import { createSlice } from '@reduxjs/toolkit'

interface userState {
    value: Record<string, unknown>[]
}

const initialState: any = {
    returned: []
}

export const currentTokenSlice = createSlice({
    name: 'currentToken',
    initialState,
    reducers: {
        setToken: (state, action) => {
            const tempArray = [];
            tempArray.push(action.payload);
            state.returned = tempArray;
        },
        removeToken: (state, action)=> {
            const tempArray: any = [];
            state.returned = tempArray;
        }
    }
})

export const { setToken, removeToken } = currentTokenSlice.actions;

export default currentTokenSlice.reducer;