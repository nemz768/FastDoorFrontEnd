import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import fetchOrders from "./slices/ordersSlice";



export const store = configureStore({
    reducer: {
        auth: authReducer,
        orders: fetchOrders
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;