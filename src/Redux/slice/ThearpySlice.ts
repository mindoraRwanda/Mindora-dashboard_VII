import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface TherapyState {
    user: unknown | null;
    therapists: unknown[]; 
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

interface TherapyCredentials {
    name: string;
    gender: string;
    dateOfBirth: number;  
    address: string;
    phoneNumber: string;
    diploma: string;
    licence: string;
    userId: string;
}

const initialState: TherapyState = {
    user: null,
    therapists: [], // Initialize this as an empty array
    status: "idle",
    error: null,
};

// Creating new Therapy
export const fetchTherapy = createAsyncThunk("Therapy/fetchTherapy", 
    async(credentials: TherapyCredentials, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://mindora-backend-beta-version.onrender.com/api/therapists', 
                {
                    personalInformation: {
                        name: credentials.name,
                        gender: credentials.gender,
                        dateOfBirth: credentials.dateOfBirth,
                        address: credentials.address,
                        phoneNumber: credentials.phoneNumber,
                    },
                    diploma: credentials.diploma,
                    licence: credentials.licence,
                    userId: credentials.userId,
                }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data || "An Unexpected error occurred");
        }
    }
);

const TherapySlice = createSlice({
    name: 'Therapy',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchTherapy.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchTherapy.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.user = action.payload;
        })
        .addCase(fetchTherapy.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })
     },
});

export default TherapySlice.reducer;
