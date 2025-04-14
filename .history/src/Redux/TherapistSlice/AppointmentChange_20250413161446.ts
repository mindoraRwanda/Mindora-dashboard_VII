import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

 export interface Reschedule{
    appointmentId:string|number;
    newStartTime: string;
    newEndTime: string; 
    action:string;
    reason:string;
    actionBy:string|number;
    actionTime:string;
     id?:string|number;
};
interface rescheduleState{
    data: Reschedule[];
    status: 'idle' | 'loading' | 'succeeded' | 'rejected';
    error: string | null;

};

export const createReschedule=createAsyncThunk('createReschedule/createReschedule',
    async (data:Reschedule, { rejectWithValue }) => {
        
        try {
            // console.log('Sending data to the server:', data)
        
            const response = await axios.post('https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_changes', data,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
          
            console.log('Reschedule response on Appointment changes:', response.data);
            return response.data;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const getAllAppointmentChanges=createAsyncThunk('get all changes/getAllAppointmentChanges',
    async(_,{reject})=>{
        try{
            const result=await axios.get('https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_changes');
            console.log('Response from the backend about appointment change', result.data);
            return result.data;
        }
        catch (err) {
            return rejectedValue((err as Error).message);
        }
    }
);

export const updateAppointmentChange=createAsyncThunk('updatechange/update',
    async(data:id,{rejectWithValue})=>{
        try{
            const response=await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_changes/${data.id}`,data);
            return response.data;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const deleteAppointmentChange = createAsyncThunk('deletechange/delete',
    async (id: string | number, { rejectWithValue }) => {
        try {
          const response=await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_changes/${id}`);
            return response.data;
        }
        catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    }
);

const rescheduleSlice = createSlice({
    name:'reschedule',
    initialState: {
        data: [] as Reschedule[],
        status: 'idle',
        error: null,
    },
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
           .addCase(createReschedule.pending, (state) => {
                state.status = 'loading';
            })
           .addCase(createReschedule.fulfilled, (state, action) => {
                state.status ='succeeded';
                state.data.push(action.payload);
            })
           .addCase(createReschedule.rejected, (state, action) => {
                state.status ='rejected';
                state.error = action.payload;
            })
            .addCase(getAllAppointmentChanges.pending,(state)=>{
                state.status='loading';
            })
            .addCase(getAllAppointmentChanges.fulfilled,(state,action) => {
                state.status ='succeeded';
                state.data = action.payload;
            })
            .addCase(getAllAppointmentChanges.rejected, (state,action)=>{
                state.status='rejected';
                state.error=action.payload as string | null;
            })
            .addCase(updateAppointmentChange.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateAppointmentChange.fulfilled,(state,action)=>{
                state.status ='succeeded';
                const index=state.data.findIndex((item)=>item.id===action.payload.id);
                if(index>-1){
                    state.data[index]=action.payload;
                }
            })
            .addCase(updateAppointmentChange.rejected,(state,action)=>{
                state.status='rejected';
                state.error=action.payload as string | null;
            })
            .addCase(deleteAppointmentChange.pending,(state)=>{
                state.status='loading';
            })
            .addCase(deleteAppointmentChange.fulfilled,(state,action)=>{
                state.status ='succeeded';
                const index=state.data.findIndex((item)=>item.id===action);
                if(index>-1){
                    state.data.splice(index,1);
                }
            })
            .addCase(deleteAppointmentChange.rejected,(state,action)=>{
                state.status='rejected';
                state.error=action.payload as string | null;
            })
    },
});

export const { resetStatus } = rescheduleSlice.actions;

export default rescheduleSlice.reducer;