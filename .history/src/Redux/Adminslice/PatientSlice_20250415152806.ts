import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Patient } from "../../components/Therapist/PatientsList";

export interface Patient {
    id: number | string;
    userId?: string;
    user: {
        email: string;
        firstName: string;
        lastName: string;
        profileImage?: string;
    };
    personalInformation: {
        age: number;
        gender: string;
        address: string;
    };
    medicalProfile: {
        lastVisit: string;
        condition: string;
    };
    emergencyContact: {
        name: string;
        email: string;
        phoneNumber: string;
    };
    lastLogin?: string;
    totalUsers?: number;
}

export interface PatientsListProps {
    goToPlan: (patientId: number | string) => void;
}

export const SelectedTotalPatints = (state: { patients: Patient }) => state.patients.patients.length;


// the following ia about creating new patient
export const createPatient = createAsyncThunk('Patient/createPatient',
    async (PatientData: patientData<Patient>, { rejectWithValue }) => {
        console.log('Sending data to the server:', PatientData);
        try {
            const response = await axios.post<Patient>('https://mindora-backend-beta-version-m0bk.onrender.com/api/patients',
                PatientData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
            console.log('Server response:', response);
        }
        catch (err) {
            console.error('Error in createPatient:', err.response || err);
            return rejectWithValue((err as Error).message);
        }

    }

);
// Get all the patient
export const allPatients = createAsyncThunk('getPatients',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://mindora-backend-beta-version-m0bk.onrender.com/api/patients', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("API Response:", response.data);
            return response.data;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);
export const getAllPatientOfTherapy = createAsyncThunk('getAllPatientOfTherapy',
    async (therapistId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/therapists/${therapistId}/patients`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    });



// the following is for getting single patient
export const getPatientById = createAsyncThunk('patient/getById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/patients/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

// the following Api is for Updating Patient

export const updatePatient = createAsyncThunk('updatePatient',
    async ({ id, updatePatientData }: { id: number | string; updatePatientData: Partial<Patient> }, { rejectWithValue }) => {

        try {
            const response = await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/patients/${id}`, updatePatientData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);
// the followinf codes are for deleting the patient

export const deletePatient = createAsyncThunk('deletePatient',
    async (id: number | string, { rejectWithValue }) => {
        try {
            await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/patients/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            });
            return id;
        }
        catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

const patientSlice = createSlice({
    name: 'patients',
    initialState: {
        patients: [] as Patient[],
        status: 'idle',
        error: null as string | null,
        data: [] as Patient[],
    },
    reducers: {
        setPatients: (state, action) => {
            state.patients = action.payload;
        },
    },
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
                state.status = 'rejected';
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
                state.status = 'rejected';
                state.error = action.payload as ;
            })
            .addCase(getPatientById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getPatientById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.selectedPatient = action.payload;
            })
            .addCase(getPatientById.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string;
            })

            // The Following Extra redux are for Updating patient
            .addCase(updatePatient.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updatePatient.fulfilled, (state, action) => {
                const index = state.patients.findIndex(patient => patient.id === action.payload.id);
                if (index > -1) {
                    state.patients[index] = action.payload;
                }
            })
            .addCase(updatePatient.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string;
            })

            // The Following Extra redux are for deleting patient
            .addCase(deletePatient.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deletePatient.fulfilled, (state, action) => {
                state.patients = state.patients.filter(patient => patient.id !== action.payload);
                state.status = 'succeeded';

            })
            .addCase(deletePatient.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload as string;
            })
            .addCase(getAllPatientOfTherapy.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllPatientOfTherapy.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(getAllPatientOfTherapy.rejected, (state, action) => {
                state.status = 'rejected';
                console.log(action.payload);
            })
    }
}

);
export const { setPatients } = patientSlice.actions;
export default patientSlice.reducer;


