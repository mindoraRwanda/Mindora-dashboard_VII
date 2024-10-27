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

const initialState: TherapyState = {
  therapists: [],
  status: "idle",
  error: null,
};

// This is for creating new therapist
export const fetchTherapy = createAsyncThunk(
  "Therapy/fetchTherapy",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post<Therapist>(
        'https://mindora-backend-beta-version-m0bk.onrender.com/api/therapists',
      formData
      );
      return response.data;
      console.log("Response from API:", response);
    } catch (err) {
      console.error("Error response:", err.response || err); 
      return rejectWithValue(err?.response?.data || "An Unexpected error occurred");
    }
  }
);


// This is for displaying all therapiest information
export const getAllTherapists = createAsyncThunk(
  "Therapist/getAllTherapists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://mindora-backend-beta-version.onrender.com/api/therapists`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An Unexpected error occurred");
    }
  }
);
// The following is for deleting Therapists

export const deleteTherapy = createAsyncThunk('delete/Therapy',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`https://mindora-backend-beta-version.onrender.com/api/therapists/${id}`);
      return response.data;
    }
    catch (error) {
      return rejectWithValue(error.response?.data || "An Unexpected error occurred");
    }
  }
);
export const updateTherapy=createAsyncThunk('update/updateTherapy',
  async({id,credentials},{rejectWithValue})=>{
    try{
      const response=await axios.put(`https://mindora-backend-beta-version.onrender.com/api/therapists/${id}`,
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
  
   
      });
      return response.data;
    }
    catch(error){
      console.error("API error:", err.response || error);
      return rejectWithValue(error.response?.data?.message || "An Unexpected error occurred");
    }
  }
)

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

      // this is for Getting all Therapists
      .addCase(getAllTherapists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTherapists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.therapists = action.payload;
      })
      .addCase(getAllTherapists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // The following is for deleting Therapists

      .addCase(deleteTherapy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTherapy.fulfilled, (state, action) => {
        const index = state.therapists.findIndex(therapy => therapy.id === action.payload.id);
        if (index > -1) {
          state.therapists.splice(index, 1);
        }
      })
      .addCase(deleteTherapy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
// the following is for updating the therapists
    .addCase(updateTherapy.pending,(state)=>{
      state.status='loading';
    })
    .addCase(updateTherapy.fulfilled,(state,action)=>{
      const index = state.therapists.findIndex(therapy => therapy.id === action.payload.id);
      if (index > -1) {
        state.therapists[index] = action.payload;
      }
    })
 .addCase (updateTherapy.rejected, (state,action)=>{
  state.status='failed';
  state.error=action.payload as string;
 })

},
});

export default TherapySlice.reducer;