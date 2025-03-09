import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
    name: 'user',
    initialState: {
        _id: null,
        currentUser: null,
        loading: false,
        error: null,
    },
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        }
    }
});


export const {
    signInStart,
    signInSuccess,
    signInFailure,
    signOut
} = userSlice.actions;


export default userSlice.reducer;
