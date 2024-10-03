import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  user;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk(

  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://mindora-backend-beta-version.onrender.com/api/auth/login', credentials);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const forgotPass = createAsyncThunk('auth/forgotPass',
  async (credential: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://mindora-backend-beta-version-m0bk.onrender.com/api/auth/forgot_password', credential);
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response.data || { message: error.message });
    }
  });

// the following is for reset passpassword

export const resetPass = createAsyncThunk('user/resetPass',
  async (credentials: { token: string; password: string; confirmPassword: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`https://mindora-backend-beta-version-m0bk.onrender.com/api/auth/reset_password/${credentials.token}`, 
        { password: credentials.password, confirmPassword: credentials.confirmPassword }
      );
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // forgot pass for authentication

      .addCase(forgotPass.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(forgotPass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(forgotPass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // The following are about reset password

      .addCase(resetPass.pending, (state)=>{
        state.status='loading';
      })
      .addCase(resetPass.fulfilled,(state,action)=>{
        state.status='succeeded';
        state.user = action.payload;
      })
      .addCase(resetPass.rejected,(state,action)=>{
        state.status='failed';
        state.error=action.payload as string;
      })
  },
});

export default authSlice.reducer;