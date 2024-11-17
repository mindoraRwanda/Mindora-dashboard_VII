import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  location: string;
  appointmentType: string;
  status: string;
  notes: string;
}
interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'rejected';
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  status: 'idle',
  error: null,
};

export const getAppointmentById = createAsyncThunk(
  "getAppointmentById/getAll",
  async (therapistId: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/therapists/${therapistId}/appointments`);
      console.log("API Response:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAppointments = createAsyncThunk(
  'updateAppointments/update',
  async (appointmentData: Appointment, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://mindora-backend-beta-version-m0bk.onrender.com/api/appointments/${appointmentData.id}`,
        appointmentData
      );
      console.log("Data to be updated", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
// Logic to delete the appointment

export const deleteAppointment = createAsyncThunk(
  "deleteAppointment/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/appointments/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.status = "idle";
      state.error = null;
      state.appointments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointmentById.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.appointments = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(updateAppointments.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.appointments = state.appointments.map(app =>
          app.id === action.payload.id ? action.payload : app);
      })
      .addCase(updateAppointments.rejected,(state,action)=>{
        state.loading = false;
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(deleteAppointment.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action)=>{
        state.loading = false;
        state.status = "succeeded";
        state.appointments = state.appointments.filter(app => app.id!== action.payload);
      })
      .addCase(deleteAppointment.rejected, (state, action)=>{
        state.loading = false;
        state.status = "rejected";
        state.error = action.payload;
      })
  },
});

export const { resetStatus } = appointmentSlice.actions;
export default appointmentSlice.reducer;