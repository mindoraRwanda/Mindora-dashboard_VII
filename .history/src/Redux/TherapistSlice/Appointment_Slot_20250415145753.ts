import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";



export interface AvaillableSlot {
    id: string;
    startTime: string;
    endTime: string;
    location: string;
    appointmentType: string;
    status: string;
    notes: string;
}


interface AvailableSlotState {
    data: AvailableSlot[];
    loading: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'rejected';
    error: string | null;
}

const initialState: AvailableSlotState = {
    data: [],
    loading: false,
    status: 'idle',
    error: null,
};

// this is for create new Slot
export const createAvailableSlot = createAsyncThunk('CreateAvailableSlot/createSlot',
    async (data:AvaillableSlot,{rejectWithValue})=>{
        try {
            const token=localStorage.getItem('token');
            const response = await axios.post('https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_available_slots', data,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            console.log("Those are data Reach to database", response);
            return response.data;
        }
        catch (err:any) {
            return rejectWithValue(err.response?.data || 'unexpected error');
        }
    });
    
// Redux Slice for Getting All Availlable Slot of Therapist
export const getAllAvailableSlot=createAsyncThunk('getAllAvailableSlot/getAll',
async (therapistId: string,{rejectWithValue})=>{
   
    try{
        const token=localStorage.getItem('token');
        const response= await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_available_slots/therapists/${therapistId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (err: any) {
        return rejectWithValue(err.response?.data || 'unexpected error');
    }
}) ;

// Redux Slice for Delleting Availlable Slot

export const deleteAvailableSlot=createAsyncThunk('deleteAvailableSlot/delete',
    async(id:string,{rejectWithValue})=>{
        try{
            const token=localStorage.getItem('token');
            await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_available_slots/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            return id;
        }
        catch (err: any) {
            return rejectWithValue(err.response?.data || 'unexpected error');
        }
    }
);

// ReduxSlice for Update Availlable Slots

export const updateAvailableSlot=createAsyncThunk('updataAvaillableSlot/update',
    async(data:{id:string;[key:string]:unknown},{rejectWithValue})=>{
        // const dispatch=useDispatch();
        try{
            const token=localStorage.getItem('token');
            const response=await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_available_slots/${data.id}`,data,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            return response.data;
        }
        catch (err: any) {
            return rejectWithValue(err.response?.data || 'unexpected error');
        }
    }
);

    const AvailableSlotData =createSlice({
        name: 'availableSlot',
        initialState,
            reducers: {},
        extraReducers: (builder) => {
            builder
                // Create Slot Cases
                .addCase(createAvailableSlot.pending, (state) => {
                    state.status = 'loading';
                    state.error = null;
                })
                .addCase(createAvailableSlot.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    const existingIndex = state.data.findIndex(slot => slot.id === action.payload.id);
                    if (existingIndex === -1) {
                        state.data.push(action.payload);
                    }
                    state.error = null;
                })
                .addCase(createAvailableSlot.rejected, (state, action) => {
                    state.status = 'rejected';
                    state.error = action.payload as string;
                })

                // This is for getting all AvailableSlot
                .addCase(getAllAvailableSlot.pending, (state)=>{
                    state.status='loading';
                    state.error=null;       
                })
                .addCase(getAllAvailableSlot.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.data = action.payload;
                    state.error = null;
                })
             .addCase(getAllAvailableSlot.rejected, (state,  action)=>{
                 state.status='rejected';
                 state.error=action.payload as string;
             })
             // This is for deleting AvailableSlot

             .addCase(deleteAvailableSlot.pending, (state)=>{
                 state.status='loading';
                 state.error=null;
             })
             .addCase(deleteAvailableSlot.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.filter((slot:any => slot.id !== action.payload);
                state.error = null;
            })
            
             .addCase(deleteAvailableSlot.rejected, (state, action)=>{
                 state.status='rejected';
                 state.error=action.payload as string;
             })

             // Extra redux for updating Appointment AvaillableSlot

             .addCase(updateAvailableSlot.pending, (state)=>{
                 state.status='loading';
                 state.error=null;
             })

             .addCase(updateAvailableSlot.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.data.findIndex((slot:any) => slot.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateAvailableSlot.rejected, (state, action)=>{
                state.status='rejected';
                state.error=action.payload as string;
            })
          
         
        }});
        export default AvailableSlotData.reducer;
        

       
    