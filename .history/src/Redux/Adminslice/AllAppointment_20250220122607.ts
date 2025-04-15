import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllAppointmnets = createAsyncThunk('getAll',
    async (_,{rejectedValue})=>{
        try{
            const response = await axios.get('https://mindora-backend-beta-version-m0bk.onrender.com/api/appointments',{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error){
           return rejectedValue(error as Error).message;
        }
    }
);

const AllAppointmentSlice=createSlice({
    name: 'Allappointments',
    initialState: {
        status:'idle',
        data:[],
        error:null,
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
                state.error = action.payload;
            })
    }
});
export default AllAppointmentSlice.reducer;