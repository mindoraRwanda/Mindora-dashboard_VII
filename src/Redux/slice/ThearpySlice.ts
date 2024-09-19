import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface PersonalInformation {
  name?: string;
  gender: string;
  address: string;
  dateOfBirth: string;
  phoneNumber?: string;
  age?: number;
  degree?: string;
  email?: string;
  lastName?: string;
  firstName?: string;
};

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  email: string;
  phoneNumber: string | null;
  profileImage: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

interface Therapist {
  id: string;
  personalInformation: PersonalInformation;
  diploma: string;
  licence: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
};

interface TherapyState {
  therapists: Therapist[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

interface TherapyCredentials {
  name: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  diploma: string;
  licence: string;
  userId: string;
};

const initialState: TherapyState = {
  therapists: [],
  status: "idle",
  error: null,
};

export const fetchTherapy = createAsyncThunk(
  "Therapy/fetchTherapy",
  async (credentials: TherapyCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<Therapist>(
        'https://mindora-backend-beta-version.onrender.com/api/therapists',
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

export const getAllTherapists = createAsyncThunk(
  "Therapist/getAllTherapists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Therapist[]>('https://mindora-backend-beta-version.onrender.com/api/therapists',_);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "An Unexpected error occurred");
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
        state.therapists.push(action.payload);
      })
      .addCase(fetchTherapy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(getAllTherapists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTherapists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.therapists = action.payload;
      })
      .addCase(getAllTherapists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default TherapySlice.reducer;