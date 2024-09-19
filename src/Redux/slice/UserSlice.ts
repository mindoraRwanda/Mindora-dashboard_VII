import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
    user: null | string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface usersCredentials {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

const initialState: UserState = {
    users: [],
    status: 'idle',
    error: null,
};

export const NewUser = createAsyncThunk(
    'users/NewUser',
    async (credentials: usersCredentials, { rejectWithValue }) => {

        try {
            const response = await axios.post('https://mindora-backend-beta-version.onrender.com/api/auth/register', credentials);
            return response.data;

        }
        catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const GetAllUsers=createAsyncThunk('User/GetAllUsers', async(_,{rejectWithValue})=>{
        try{
        const response= await axios.get('https://mindora-backend-beta-version.onrender.com/api/users',_);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response.data);
    }
}
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(NewUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(NewUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users.push(action.payload);
            })
            .addCase(NewUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(GetAllUsers.pending,(state)=>{
                state.status='loading';
            })
            .addCase(GetAllUsers.fulfilled,(state,action)=>{
                state.status='succeeded';
                state.users=action.payload;
            })
            .addCase(GetAllUsers.rejected,(state,action)=>{
                state.status='failed';
                state.error=action.payload;
            })
    }
});
export default userSlice.reducer;