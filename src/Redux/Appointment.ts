import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';

// Fetch appointments thunk
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async () => {
    console.log('Fetching appointments from API...'); // Log the fetch call
    const response = await fetch('https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_available_slots');
    if (!response.ok) {
      console.error('Failed to fetch appointments, status:', response.status); // Log any HTTP error
      throw new Error('Failed to fetch appointments');
    }
    const data = await response.json();
    console.log('Fetched data from API:', data); // Log the returned data
    return data;
  }
);

// Appointments slice
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    items: [], // Store appointments
    status: 'idle', // Track the request status (idle, loading, succeeded, failed)
    error: null, // Store error messages if any
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        console.log('Fetching appointments pending...'); // Log status
        state.status = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        console.log('Fetch appointments succeeded:', action.payload); // Log successful response
        state.status = 'succeeded';
        state.items = action.payload; // Store fetched appointments
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        console.error('Fetch failed:', action.error.message); // Log error message
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Configure and export store
const store = configureStore({
  reducer: {
    appointments: appointmentsSlice.reducer, // Add appointments reducer
  },
});

export { store }; // Export the store
export default appointmentsSlice.reducer; // Export reducer as default
