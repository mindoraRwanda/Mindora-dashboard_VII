import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define an async thunk for fetching patients
export const fetchPatients = createAsyncThunk("patients/fetchPatients", async () => {
  const response = await axios.get("https://mindora-backend-beta-version-m0bk.onrender.com/api/patients");
  return response.data;
});

export const fetchPatientById = createAsyncThunk("patients/fetchPatientById", async (id) => {
    const response = await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/patients/${id}`);
    return response.data;
  });

  export const addPatient = createAsyncThunk("patients/addPatient", async (newPatient) => {
    const response = await axios.post(`https://mindora-backend-beta-version-m0bk.onrender.com/api/patients`, newPatient);
    return response.data;
  });
  

// Create the patients slice
const patientsSlice = createSlice({
  name: "patients",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {}, // No manual reducers here, since we'll use extraReducers for async actions
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default patientsSlice.reducer;
