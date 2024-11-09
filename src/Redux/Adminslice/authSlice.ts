import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  user: {
    therapistId?: string;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  therapistId:string| null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  therapistId: null, 
};

export const loginUser = createAsyncThunk(
'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://mindora-backend-beta-version-m0bk.onrender.com/api/auth/login', credentials);
     console.log("Login Response:", {
        fullData: response.data,
        user: response.data.user,
        therapistId: response.data.user?.therapist?.id 

      });
      return response.data;
    } catch (err: unknown) {
      if(err.response && err.response.data){
        return rejectWithValue(err.response.data.message);
      }
      else{
      return rejectWithValue('An error occurred. Please try again later.');
    }}
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
        //To store TherapistId on Local storage if User is Therapist
        state.TherapistId = action.payload.user?.therapist?.id;
        localStorage.setItem('TherapistId', action.payload.user?.therapist?.id || '');
        console.log("therapy id stored:", state.TherapistId);
       // To store name of any User logedIn
       const fullName = `${action.payload.user?.firstName || ''} ${action.payload.user?.lastName || ''}`.trim();
       localStorage.setItem('fullName', fullName);
       console.log("full Name stored:", fullName);
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