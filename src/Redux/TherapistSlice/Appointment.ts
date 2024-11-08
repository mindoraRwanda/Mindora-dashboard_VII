import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface appointment {
    therapistId: number | string;
    patientId: number | string;
    name: string;
    statusApp: string;
    location: string;
    date: string | number;
    appointmentType: string;
    appointmentSlot:number | string;
    duration: number;
    notes: string
};


// This is for create new appointment
export const CreateAppointment = createAsyncThunk('createAppointment',
    async (AppointmentData: appointment, { rejectWithValue }) => {
        console.log('Sending data to the server:', AppointmentData);
        try {
            const response = await axios.post('https://mindora-backend-beta-version-m0bk.onrender.com/api/appointments', AppointmentData);
            console.log('Appointment created', response.data);
            return response.data;
          
        } catch (error) {
           return rejectWithValue(error.response?.data?.message || "unexpected error with creating appointment");
        }
    }
);

// This is for getting all the appointment
export const GetAllAppointments = createAsyncThunk('GetAppointments',
    async (therapistId:string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/appointments/${therapistId}`);
            console.log('All Appointments fetched', response.data);
            return response.data;
          
        } catch (error) {
           return rejectWithValue(error.response?.data?.message || "unexpected error with fetching appointments");
        }
    }
);


// This for updating the appointments

export const UpdateAppointment = createAsyncThunk('updateAppointment',
    async (formData: appointment, { rejectWithValue }) => {
        try {
           const response= await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/appointments/${formData.id}`, formData);
            console.log('Appointment updated', formData.id);
            return response.data;
          
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || "unexpected error with updating appointment");
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
            .addCase(GetAllAppointments.pending, (state) => {
                state.status = 'loading';
                state.error=null;

            })
            .addCase(GetAllAppointments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.appointments = action.payload;
            })
            .addCase(GetAllAppointments.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })

            //This is for Updating the Appointments

            .addCase(UpdateAppointment.pending, (state) => {
                state.status = 'loading';
                state.error=null;
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
export const { resetStatus } = appointmentSlice.actions;
export default appointmentSlice.reducer;