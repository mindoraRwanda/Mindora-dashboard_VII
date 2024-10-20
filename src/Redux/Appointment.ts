import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch appointments thunk
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async () => {
    console.log('Fetching appointments from API...'); // Log the fetch call
    const response = await fetch('https://mindora-backend-beta-version-m0bk.onrender.com/api/appointment_available_slots');
    
    // Check if the response is OK
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
  reducers: {}, // No synchronous actions defined yet
  extraReducers: (builder) => {
    builder
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

// Export the reducer as default
export default appointmentsSlice.reducer;

// Configure and export store separately to keep concerns separate
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    appointments: appointmentsSlice.reducer, // Add appointments reducer
  },
});

// Export the store and types for use in components
export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;