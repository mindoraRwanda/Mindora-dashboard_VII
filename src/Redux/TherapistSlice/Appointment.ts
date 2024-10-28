import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface appointment {
    id: number;
    startTime: number | string;
    endTime: number | string;
    therapistId: number | string;
    patientId: number | string;
    name: string;
    statusApp: string;
    location: string;
    date: string | number;
    appointmentType: string;
    duration: number;
    notes: string
};
// This is for create new appointment
export const CreateAppointment = createAsyncThunk('createAppointment',
    async (AppointmentData: appointment, { rejectWithValue }) => {
        console.log('Sending data to the server:', AppointmentData);
        try {
            const response = await axios.post<appointment>('https://mindora-backend-beta-version-m0bk.onrender.com/api/appointments', AppointmentData);
            console.log('Appointment created', response.data);
            return response.data;
          
        } catch (error) {
           return rejectWithValue(error.response?.message || "unexpected error with creating appointment");
        }
    }
);

// This is for getting all the appointment
export const GetAppointments = createAsyncThunk('GetAppointments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<appointment[]>('https://mindora-backend-beta-version-m0bk.onrender.com/api/appointments');
            return response.data;
            console.log('All Appointments fetched', response.data);
        } catch (error) {
            rejectWithValue(error.response?.message || "unexpected error with fetching appointments");
        }
    }
);

// This for canceling the appointments
export const CancelAppointment = createAsyncThunk('cancelAppointment',
    async (appointmentId: number, { rejectWithValue }) => {
        try {
            await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/appointments/${appointmentId}`);
            return response.data;
            console.log('Appointment cancelled', appointmentId);
        } catch (error) {
            rejectWithValue(error.response?.message || "unexpected error with cancelling appointment");
        }
    }
);

// This for updating the appointments

export const UpdateAppointment = createAsyncThunk('updateAppointment',
    async (formData: appointment, { rejectWithValue }) => {
        try {
            await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/appointments/${formData.id}`, formData);
            return response.data;
            console.log('Appointment updated', formData.id);
        } catch (error) {
            rejectWithValue(error.response?.message || "unexpected error with updating appointment");
        }
    }
);


const appointmentSlice = createSlice({
    name: 'appointment',
    initialState: {
        appointments: [],
        loading: false,
        status: 'idle',
        error: null,
    },
    reducers: {
        // Add your reducers here
        resetStatus:(state)=>{
            state.status = 'idle';
            state.error = null;
            state.appointments = [];
        },
    },
    extraReducers: (builder) => {
        builder

            // This is for creating a new appointment
            .addCase(CreateAppointment.pending, (state) => {
                state.status = 'loading';
                state.error=null;
            })
            .addCase(CreateAppointment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.appointments.push(action.payload);
                state.error = null;
            })
            .addCase(CreateAppointment.rejected, (state, action) => {
                state.status = ' rejected';
                state.error = action.payload as string;

            })
            // This is for getting all appointments
            .addCase(GetAppointments.pending, (state) => {
                state.status = 'loading';

            })
            .addCase(GetAppointments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.appointments = action.payload;
            })
            .addCase(GetAppointments.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })
            // This is for canceling the appointments
            .addCase(CancelAppointment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(CancelAppointment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.appointments = state.appointments.filter(appointment => appointment.id !== action.payload);
            })
            .addCase(CancelAppointment.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })

            //This is for Updating the Appointments

            .addCase(UpdateAppointment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(UpdateAppointment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.appointments = state.appointments.map(appointment => appointment.id === action.payload.id ? action.payload : appointment);
            })
            .addCase(UpdateAppointment.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })
    },
});

export default appointmentSlice.reducer;