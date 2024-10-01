import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface PatientState {
    therapy: null | string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
};

interface PatientCredentials {
    userId: string;
    name: string;
    email: string;
    age: number;
    gender: string;
    lastVisit: number | string;
    contact: number | string;
    condition: string;
    
};

const initialState: PatientState = {
    therapy: null,
    status: 'idle',
    error: null,
};

export const createPatient = createAsyncThunk('Create/createPatient',
    async (credentials: PatientCredentials, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://mindora-backend-beta-version.onrender.com/api/patients', {
                userId: credentials.userId,
                medicalProfile: {
                    lastVisit: credentials.lastVisit,
                    condition: credentials.condition,
                },
                personalInformation: {
                    age: credentials.age,
                    gender: credentials.gender
                },
                emergenceContact: {
                    contact: credentials.contact
                }

            });
            return response.data;
        }
        catch (err) {
            return rejectWithValue(err.message);
        }
    }

)

const patientSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(createPatient.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createPatient.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.patients.push(action.payload);
            })
            .addCase(createPatient.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

    }
}

)
export default patientSlice.reducer;


