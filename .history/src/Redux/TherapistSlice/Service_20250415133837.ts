import axios from "axios";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
interface Service{
    id?: string;
    name: string;
    description: string;
}

interface ServiceState {
    services: Service[];
    status: "idle" | "loading" | "succeeded" | "rejected" ;
    err
}

const initialState: ServiceState = {
    services: [],
    status: "idle",
};

export const getAllService=createAsyncThunk('getAllService',
    async (_,{rejectWithValue})=>{
        try{
            const response=await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/services`);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);
const ServiceSlice=createSlice({
    name:"Services",
    initialState,
    reducers:{},
    extraReducers:builder=>builder
       .addCase(getAllService.pending, (state) => {
            state.status = "loading";
        })
       .addCase(getAllService.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.services = action.payload;
        })
       .addCase(getAllService.rejected, (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        })
})

export default ServiceSlice.reducer;