import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from '../redux/user/userSlice.js'
import walletReducer from '../redux/wallet/walletSlice.js'
import campaignReducer from '../redux/campaign/campaignSlice.js';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['user', 'wallet', 'campaign']
};

const persistedReducer = persistReducer(persistConfig,
    combineReducers({
        user: userReducer,
        wallet: walletReducer,
        campaign: campaignReducer,
    })
);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

export const persistor = persistStore(store);
