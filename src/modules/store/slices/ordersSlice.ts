import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Order } from '../../Interfaces/Interfaces';

// Ключ — обычная строка (можно и без типа, но с ним чище)
type QueryKey = string;

interface OrdersState {

    queries: Record<QueryKey, {
        data: Order[];
        loading: boolean;
        error: string | null;
        totalPages?: number;
    }>;
}

const initialState: OrdersState = {
    queries: {},
};


export const fetchOrders = createAsyncThunk<
    { data: Order[]; queryKey: string },
    { endpoint: string; queryKey: string },
    { rejectValue: string }
>(
    'orders/fetch',
    async ({ endpoint }, { rejectWithValue }) => {
        try {
            const response = await axios.get<Order[]>(endpoint);
            return { data: response.data, queryKey: endpoint }; // или переданный queryKey
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
                    loading: true,
                    error: null,
                };
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                const { data, queryKey } = action.payload;
                state.queries[queryKey] = {
                    data,
                    loading: false,
                    error: null,
                };
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                const key = action.meta.arg.queryKey;
                if (state.queries[key]) {
                    state.queries[key].loading = false;
                    state.queries[key].error = action.payload || 'Ошибка';
                }
            });
    },
});

export default ordersSlice.reducer;
