import axios from "axios";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

interface Report {
    id: string;
    startDate: string | number;
    endDate: string | number;
    moodSummary?: {
        averageRating?: number;
        moodDistribution?: Record<string, number>;
        mostFrequentMood?: string;
    };
    symptomSummary?: {
        mostSeverity?: string;
        mostFrequentSymptom?: string | null;
        symptomDistribution?: Record<string, number>;
    };
    createdAt?: string;
    updatedAt?: string;
}

interface ReportState {
    Reports: Report[];
    status: "idle" | "loading" | "succeeded" | "rejected" ;
    error: string | null;
}

const initialState: ReportState = {
    Reports: [],
    status: "idle",
    error: null,
};

export const createReport=createAsyncThunk('createReport',
    async(reportData,{rejectWithValue})=>{
        try{
            const response=await axios.post(`https://mindora-backend-beta-version-m0bk.onrender.com/api/progress/logs/report`,reportData);
            return response.data;
        }
        catch(error:any){
           return rejectWithValue(error.message);
        }
    }
);
export const getAllReports=createAsyncThunk('getReport',
    async(userId:string,{rejectWithValue})=>{
        try{
            const response=await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/progress/logs/report/user/${userId}`);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    }
);

export const updatePatientReport = createAsyncThunk('updatePatientReport',
    async(updateData:Report,{rejectWithValue})=>{
        try{
            const response=await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/progress/logs/report/${updateData.id}`,updateData);
            return response.data;
        }
        catch(error:any){
            return rejectWithValue(error.message);
        }
    });
    export const deletePatientReport = createAsyncThunk('deletePatientReport',
        async(id:string,{rejectWithValue})=>{
            try{
                await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/progress/logs/report/${id}`);
                return id as ;
            }
            catch(error:any){
                return rejectWithValue(error.message);
            }
        });
    
const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {},
    extraReducers:(builder)=> {
        builder
        .addCase(createReport.pending,(state)=>{
            state.status="loading";
        })
        .addCase(createReport.fulfilled,(state,action)=>{
            state.status="succeeded";
            state.Reports=[...state.Reports, action.payload];
        })
        .addCase(createReport.rejected,(state,action)=>{
            state.status="rejected";
            console.log(action.payload);
        })
        .addCase(getAllReports.pending,(state)=>{
            state.status="loading";
        })
        .addCase(getAllReports.fulfilled,(state,action)=>{
            state.status="succeeded";
            state.Reports=action.payload;
            state.error=null;
        })
        .addCase(getAllReports.rejected,(state,action)=>{
            state.status="failed";
            console.log(action.payload);
        })
        .addCase(updatePatientReport.pending,(state)=>{
            state.status="loading";
        })
        .addCase(updatePatientReport.fulfilled,(state,action)=>{
            state.status="succeeded";
            state.Reports=state.Reports.map((report)=>report.id===action.payload.id? action.payload: report);
        })
        .addCase(updatePatientReport.rejected,(state,action)=>{
            state.status="failed";
            console.log(action.payload);
        })
        .addCase(deletePatientReport.pending,(state)=>{
            state.status="loading";
        })
        .addCase(deletePatientReport.fulfilled,(state,action)=>{
            state.status="succeeded";
            state.Reports=state.Reports.filter((report)=>report.id!==action.payload);
        })
        .addCase(deletePatientReport.rejected,(state,action)=>{
            state.status="failed";
            console.log(action.payload);
        })}
});

export default reportSlice.reducer;