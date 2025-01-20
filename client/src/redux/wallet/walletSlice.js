import { createSlice } from '@reduxjs/toolkit';
export const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        wallet: null,
        isConnected: false,
    },
    reducers: {
        setWallet: (state, action) => {
            state.wallet = action.payload;
            state.isConnected = true;
            state.error = null;
        },
        clearWallet: (state) => {
            state.wallet = null;
        },
        walletNotConnected: (state) => {
            state.isConnected = false;
        },
        walletConnected: (state) => {
            state.isConnected = true;
        }
    }
});

export const { setWallet, clearWallet, walletNotConnected, walletConnected } = walletSlice.actions;

export default walletSlice.reducer;