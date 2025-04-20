import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Updated Patient interface to be compatible with PatientsList.tsx
export interface Patient {
    id: number | string;
    userId?: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName?: string;
        phoneNumber?: string;
        profileImage?: string;
    };
    personalInformation: {
        age: string | number;
        gender: string;
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

export const SelectedTotalPatints = (state: { patients: { patients: Patient[] } }) => state.patients.patients.length;

// the following is about creating new patient
export const createPatient = createAsyncThunk('Patient/createPatient',
    async (PatientData: Partial<Patient>, { rejectWithValue }) => {
        console.log('Sending data to the server:', PatientData);
        try {
            const response = await axios.post<Patient>('https://mindora-backend-beta-version-m0bk.onrender.com/api/patients',
                PatientData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        }
        catch (err: any) {
            console.error('Error in createPatient:', err.response || err);
            return rejectWithValue((err as Error).message);
        }
    }
);

// The rest of your PatientSlice.ts file remains the same