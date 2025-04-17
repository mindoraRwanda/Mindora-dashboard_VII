import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// Types for your appointment data
export interface User {
    firstName: string;
    lastName: string;
  }
  
  export interface Patient {
    user: User;
  }
  
  export interface PersonalInformation {
    name: string;
  }
  
  export interface Therapist {
    personalInformation: PersonalInformation;
  }
  
  export interface Appointment {
    id: string;
    patient: Patient;
    therapist: Therapist;
    startTime: string;
    endTime: string;
    location: string;
    status: string;
    notes?: string;
    appointmentType: string;
  }
  
  // Type for your Redux state
  interface AllAppointmentState {
    status: 'idle' | 'loading' | 'success' | 'rejected';
    data: Appointment[];
    error: string | null;
  }
  const ini
  export const getAllAppointmnets = createAsyncThunk<Appointment[]>('getAll',
    async (_,{rejectWithValue})=>{
        try{
            const response = await axios.get('https://mindora-backend-beta-version-m0bk.onrender.com/api/appointments',{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error){
           return rejectWithValue((error as Error).message);
        }
    }
);

const AllAppointmentSlice=createSlice({
    name: 'Allappointments',
    initialState: {
        status:'idle',
        data:[],
        error:null as string | null,
    },
    reducers: {},
    extraReducers:(builder)=>{
            builder
            .addCase(getAllAppointmnets.pending,(state)=>{
                state.status = 'loading';
            })
            .addCase(getAllAppointmnets.fulfilled,(state,action)=>{
                state.status = 'success';
                state.data = action.payload;
            })
            .addCase(getAllAppointmnets.rejected,(state,action)=>{
                state.status = 'rejected';
                state.error = action.payload as string | null;
            })
    }
});
export default AllAppointmentSlice.reducer;