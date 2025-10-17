import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Order } from '../../Interfaces/Interfaces';

type QueryKey = string;

interface QueryEntry {
    data: Order[];
    loading: boolean;
    error: string | null;
    totalPages: number;
}

interface OrdersState {
    queries: Record<QueryKey, QueryEntry>;
}

const initialState: OrdersState = {
    queries: {},
};

export const fetchOrders = createAsyncThunk(
    'orders/fetch',
    async (
        { endpoint, queryKey }: { endpoint: string; queryKey: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axios.get<{
                orders: Order[];
                totalPages: number;
                currentPage: number;
            }>(endpoint);

            const normalized = res.data.orders.map((o) => ({
                ...o,
                id: String(o.id),
            }));

             return { data: normalized, totalPages: res.data.totalPages, queryKey };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки');
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state, action) => {
                const key = action.meta.arg.queryKey;
                state.queries[key] = {
                    data: [],
                    totalPages: 0,
                    loading: true,
                    error: null,
                };
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                const { data, totalPages, queryKey } = action.payload;
                state.queries[queryKey] = {
                    data,
                    totalPages,
                    loading: false,
                    error: null,
                };
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                const key = action.meta.arg.queryKey;
                state.queries[key] = {

                    data: [],
                    totalPages: 0,
                    loading: false,
                    error: action.payload as string || 'Ошибка',
                };
            });
    },
});

export default ordersSlice.reducer;