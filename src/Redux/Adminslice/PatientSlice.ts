import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
interface Patient {
    userId: string;
    name: string;
    email: string;
    age: number;
    gender: string;
    lastVisit: number | string;
    phoneNumber: number | string;
    condition: string;

};


// the following ia about creating new patient
export const createPatient = createAsyncThunk('Patient/createPatient',
    async (PatientData: patientData, { rejectWithValue }) => {
        console.log('Sending data to the server:', PatientData); 
        try {
            const response = await axios.post<Patient>('https://mindora-backend-beta-version-m0bk.onrender.com/api/patients', 
                PatientData);   
            return response.data;
            console.log('Server response:', response);
        }
        catch (err) {
            console.error('Error in createPatient:', err.response||err); 
            return rejectWithValue(err.response?.data?.message || 'Unexpected error occurred while creating the patient');
         }
         
    }

);
// Get all the patient

export const allPatients = createAsyncThunk('getPatients',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://mindora-backend-beta-version-m0bk.onrender.com/api/patients');
            return response.data;
        }
        catch (err) {
            return rejectWithValue(err.response?.data || 'uexpected error');
        }
    }
);

// the following is for getting single patient
export const getPatientById = createAsyncThunk('getPatientById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/patients/${id}`);
            return response.data;
        }
        catch (err) {
            return rejectWithValue(err.response?.data || 'uexpected error');
        }
    }
);

// the following Api is for Updating Patient

export const updatePatient = createAsyncThunk('updatePatient',
    async ({id,updatePatientData}, { rejectWithValue }) => {
        
        try {
            const response = await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/patients/${id}`,updatePatientData);
            return response.data;
        }
        catch (err) {
            return rejectWithValue(err.message);
        }
    }
);
// the followinf codes are for deleting the patient

export const deletePatient = createAsyncThunk('deletePatient',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/patients/${id}`);
            return response.data;
        }
        catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const patientSlice = createSlice({
    name: 'patients',
    initialState: {
        patients: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // this is for creating patient
            .addCase(createPatient.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createPatient.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.patients.push(action.payload);
            })
            .addCase(createPatient.rejected, (state, action) => {
                console.log('Error payload:', action.payload);
                console.log('Error message:', action.error.message);
                state.status = 'failed';
                state.error = action.payload;
            })
            // this is for getting
            .addCase(allPatients.pending, (state) => {
                state.status = 'loading';
            })

            .addCase(allPatients.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.patients = action.payload;
            })

            .addCase(allPatients.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // The Following Extra redux are for Updating patient

            .addCase(updatePatient.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updatePatient.fulfilled,(state,action)=>{
                const index = state.patients.findIndex(patient => patient.id === action.payload.id);
                if (index > -1) {
                  state.patients[index] = action.payload;
                }
              })
            .addCase(updatePatient.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

             // The Following Extra redux are for deleting patient
             .addCase(deletePatient.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deletePatient.fulfilled,(state,action)=>{
                state.patients = state.patients.filter(patient => patient.id!== action.payload);
                state.status ='succeeded';

            })
            .addCase(deletePatient.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
    }
}

);
export default patientSlice.reducer;


