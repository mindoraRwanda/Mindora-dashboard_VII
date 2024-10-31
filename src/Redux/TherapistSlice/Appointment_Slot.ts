import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

interface AvailableSlot{
    startTime: string;
    endTime: string
    therapistId:string;
    availableDay:string;
    recurring: boolean|string;
    date:string;
    timeZone:string;
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
export const createAvailableSlot = createAsyncThunk('getAvailableSlot/createSlot',
    async (data:AvailableSlot,{rejectWithValue})=>{
        try {
            const response = await axios.post('https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_available_slots', data);
            console.log("Those are data Reach to database", response);
            return response.data;
        }
        catch (err) {
            return rejectWithValue(err.response?.data || 'unexpected error');
        }
    });


    // to get all availableSlot

    export const getAvailableSlot = createAsyncThunk('getAvailableSlot/getSlot',
        async (_, { rejectWithValue }) => {
            try {
                const response = await axios.get<AvailableSlot[]>('https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_available_slots');
                return response.data;
            }
            catch (error) {
                return rejectWithValue(error.response?.data?.message  || 'unexpected error');
            }
        }
    );
// the following is for getting single slot data

export const getAvailableSlotById = createAsyncThunk('getAvailableSlotById',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_available_slots/${id}`);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message  || 'unexpected error');
        }
    }
);

    const AvailableSlotData =createSlice({
        name: 'availableSlot',
        initialState,
            // Add Slot Reducer
            reducers: {
                resetStatus: (state) => {
                  state.status = 'idle';
                  state.error = null;
                },
        },
        extraReducers: (builder) => {
            builder
                // Create Slot Cases
                .addCase(createAvailableSlot.pending, (state) => {
                    state.status = 'loading';
                    state.error = null;
                })
                .addCase(createAvailableSlot.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.data.push(action.payload);
                    state.error = null;
                })
                .addCase(createAvailableSlot.rejected, (state, action) => {
                    state.status = 'rejected';
                    state.error = action.payload as string;
                })
                // Get Slots Cases
                .addCase(getAvailableSlot.pending, (state) => {
                    state.status = 'loading';
                    state.error = null;
                })
                .addCase(getAvailableSlot.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.data = action.payload;
                    state.error = null;
                })
                .addCase(getAvailableSlot.rejected, (state, action) => {
                    state.status = 'rejected';
                    state.error = action.payload as string;
                });
        }});
        export const { resetStatus } = AvailableSlotData.actions;
        export default AvailableSlotData.reducer;
        

       
    