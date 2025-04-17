import axios from "axios";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

interface PatientMedication {
    id?: string;
    name: string;
    description: string;
    dosageForm: number;
    strength: string;
};

interface PatientMedicationState {
    data: PatientMedication[];
    status: 'idle' | 'loading' | 'succeeded' | 'rejected',
};

const initialState: PatientMedicationState = {
    data: [],
    status: 'idle'
};
export const createMedication=createAsyncThunk("createMedication",
    async (data:PatientMedication , { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://mindora-backend-beta-version-m0bk.onrender.com/api/medications`,data);
            return response.data;
        } catch (error:any) {
            return rejectWithValue(error.message);
        }  
});

export const getAllMedication=createAsyncThunk("geAllMedication",
    async (_, {rejectWithValue})=>{
        try{
            const response=await axios.get<PatientMedication[]>(`https://mindora-backend-beta-version-m0bk.onrender.com/api/medications`);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);
export const updateMedication=createAsyncThunk('updateMedication',
    async(data:PatientMedication, {rejectWithValue})=>{
        try{
            const response=await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/medications/${data.id}`,data);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);

export const deleteMedication=createAsyncThunk("deleteMedication",
    async(id:string, {rejectWithValue})=>{
        try{
            await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/medications/${id}`);
            return id;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);

const medicationSlice = createSlice({
    name: "medication",
    initialState,
    reducers: {},
    extraReducers:(builders)=> {
        builders
        .addCase(createMedication.pending, (state) => {
            state.status = 'loading';
           })
           .addCase(createMedication.fulfilled, (state, action) => {
                state.status ='succeeded';
                state.data.push(action.payload);
           })
           .addCase(createMedication.rejected, (state, action) => {
                state.status ='rejected';
                console.log(action.payload);
           })
       .addCase(getAllMedication.pending, (state) => {
        state.status = 'loading';
       })
       .addCase(getAllMedication.fulfilled, (state, action) => {
            state.status ='succeeded';
            state.data=action.payload;
       })
       .addCase(getAllMedication.rejected, (state, action) => {
            state.status ='rejected';
            console.log(action.payload);
       })
       .addCase(updateMedication.pending, (state) => {
        state.status = 'loading';
       })
       .addCase(updateMedication.fulfilled, (state, action) => {
            state.status ='succeeded';
            state.data=state.data.map((medication)=>medication.id===action.payload.id? action.payload : medication);
       })
       .addCase(updateMedication.rejected, (state, action) => {
            state.status ='rejected';
            console.log(action.payload);
       })
      
       .addCase(deleteMedication.pending, (state) => {
        state.status = 'loading';
       })
       .addCase(deleteMedication.fulfilled, (state, action) => {
            state.status ='succeeded';
            state.data=state.data.filter((medication)=>medication.id!==action.payload);
       })
       .addCase(deleteMedication.rejected, (state, action) => {
            state.status ='rejected';
            console.log(action.payload);
       })

      
    }
})

export default medicationSlice.reducer;