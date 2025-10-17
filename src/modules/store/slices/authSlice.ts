// src/modules/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Типы
export type UserRole = 'administrator' | 'salespeople' | 'main';
export interface AuthState {
    roles: UserRole | null;
    isLoggedIn: boolean;
    loading: boolean;
    error: string | null;
}

// Async Thunk: вход по логину/паролю
interface LoginCredentials {
    username: string;
    password: string;
    rememberMe: boolean;
}

export const login = createAsyncThunk<{ roles: UserRole }, LoginCredentials, { rejectValue: string }>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/login?remember-me=${credentials.rememberMe}`, credentials);

            if (!response.data?.roles) {
                throw new Error('Неверный формат ответа от сервера');
            }

            const { roles } = response.data;
            if (!['administrator', 'salespeople', 'main'].includes(roles)) {
                throw new Error('Недопустимая роль');
            }

            // Сохраняем в localStorage
            localStorage.setItem('userRoles', roles);

            return { roles };
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || err.message || 'Ошибка входа'
            );
        }
    }
);

// Async Thunk: восстановление сессии при старте
// export const restoreSession = createAsyncThunk<void, void, { dispatch: any }>(
//     'auth/restoreSession',
//     async (_, { dispatch }) => {
//         const storedRoles = localStorage.getItem('userRoles') as UserRole | null;
//         if (storedRoles && ['administrator', 'salespeople', 'main'].includes(storedRoles)) {
//             dispatch(authActions.setLoggedIn(storedRoles));
//         } else {
//             dispatch(authActions.logout());
//         }
//     }
// );

// Инициальное состояние
const initialState: AuthState = {
    roles: null,
    isLoggedIn: false,
    loading: false,
    error: null,
};

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Устанавливаем авторизацию без API (для восстановления)
        setLoggedIn: (state, action: PayloadAction<UserRole>) => {
            state.roles = action.payload;
            state.isLoggedIn = true;
            state.loading = false;
            state.error = null;
        },
        // Выход
        logout: (state) => {
            state.roles = null;
            state.isLoggedIn = false;
            state.error = null;
            localStorage.removeItem('userRoles');
        },
    },
    extraReducers: (builder) => {
        builder
            // login.pending
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // login.fulfilled
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload.roles;
                state.isLoggedIn = true;
            })
            // login.rejected
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Неизвестная ошибка';
                state.isLoggedIn = false;
            });
    },
});

// Экспорты
export const { setLoggedIn, logout } = authSlice.actions;
export const authActions = authSlice.actions;
export default authSlice.reducer;