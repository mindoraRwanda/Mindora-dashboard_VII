import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface TreatmentPlan {
    patientId: string;
    TherapistId: string;
    title: string;
    descriptions: string;
    startDate: number|string;
    endDate: number|string;
    statusInput: string
}

interface TreatmentState{
    data:TreatmentPlan[];
    loading: boolean;
    status: "idle" | "loading" | "succeeded" | "rejected";
    error: string | null;
}

const initialState: TreatmentState = {
    data: [],
    loading: false,
    status: "idle",
    error: null
}

export const createPlan = createAsyncThunk(
    'createPlan/create',
    async (data: TreatmentPlan, { rejectWithValue }) => {
      try {
        const response = await axios.post(
            'https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment_plans',
          data
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  

const treatmentPlanSlice = createSlice({
    name: 'treatmentPlan',
    initialState,
    reducers: {
      resetStatus: (state) => {
        state.status = 'idle'; 
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(createPlan.pending, (state) => {
          state.status = "loading";
        })
        .addCase(createPlan.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.data.push(action.payload);
        })
        .addCase(createPlan.rejected, (state, action) => {
          state.status = "failed"; 
          state.error = action.payload as string;
        })
        
        .addCase(resetStatus, (state) => {
            state.status = 'idle';
            state.error = null;
         });
    },
  });
  
export const { resetStatus } = treatmentPlanSlice.actions;
export default treatmentPlanSlice.reducer;