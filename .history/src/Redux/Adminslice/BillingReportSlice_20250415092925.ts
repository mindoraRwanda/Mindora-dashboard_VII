import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios  from "axios";

interface Reports{
    id?: string;
    startDate?: Date;
    endDate?: Date;
    totalAmount: number;
    totalRevenue?: number;
    approvedInsuranceClaims?: number;
    pendingInsuranceClaims?: number;
    rejectedInsuranceClaims?: number;
    updatedAt?: string;
}

interface ReportsState{
    data: Reports[],
    status: "idle" | "loading" | "succeeded" | "rejected" ;
}

const initialState: ReportsState = {
    data: [],
    status: "idle"
};

export const createBillReport=createAsyncThunk("createBillReport",
    async (formData, {rejectWithValue})=>{
        try{
            const response = await axios.post(`https://mindora-backend-beta-version-m0bk.onrender.com/api/billing-reports`, formData);
            return response.data;
        } catch(error:any){
            return rejectWithValue(error.message);
        }
    });
    export const getBillingReports=createAsyncThunk('getall',
        async (_, { rejectWithValue }) => {
            try {
                const response = await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/billing-reports`);
                return response.data;
            } catch (error:any) {
                return rejectWithValue(error.message);
            }
        }
    );
    export const updateBillReport=createAsyncThunk("editBillReport",
        async (formData:{id:string}, {rejectWithValue})=>{
            try{
                const response=await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/billing-reports/${formData.id}`,formData);
                return response.data;
            }
            catch(error:any){
                return rejectWithValue(error.message);
            }

        });
    export const deleteBillReport=createAsyncThunk("deleteBillReport",
        async (id:number, {rejectWithValue})=>{
            try{
                const response=await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/billing-reports/${id}`);
                return response.data;
            }
            catch(error:any){
                return rejectWithValue(error.message);
            }
        })

    const BillingReports=createSlice({
        name:"BillingReports",
        initialState,
        reducers:{},
        extraReducers:builder=>{
            builder
            .addCase(createBillReport.pending,(state)=>{
                state.status="loading";
            })
            .addCase(createBillReport.fulfilled,(state,action)=>{
                state.status="succeeded";
                state.data=[...state.data, action.payload];
            })
            .addCase(createBillReport.rejected,(state,action)=>{
                state.status="rejected";
                console.log(action.payload);
            })
            .addCase(getBillingReports.pending,(state)=>{
                state.status="loading";
            })
            .addCase(getBillingReports.fulfilled,(state,action)=>{
                state.status="succeeded";
                state.data=action.payload;
            })
            .addCase(getBillingReports.rejected,(state,action)=>{
                state.status="rejected";
                console.log(action.payload);
            })
            .addCase(updateBillReport.pending, (state)=>{
                state.status="loading";
            })
            .addCase(updateBillReport.fulfilled, (state,action)=>{
                state.status="succeeded";
                state.data=state.data.map(report=>report.id===action.payload.id? action.payload : report);
            })
            .addCase(updateBillReport.rejected,(state,action)=>{
                state.status="rejected";
                console.log('Update Failed',action.payload);
            })
            .addCase(deleteBillReport.pending,(state)=>{
                state.status="loading";
            })
            .addCase(deleteBillReport.fulfilled,(state,action)=>{
                state.status="succeeded";
                state.data=state.data.filter(report=>report.id!==action.payload);
            })
            .addCase(deleteBillReport.rejected,(state,action)=>{
                state.status="rejected";
                console.log('Delete Failed',action.payload);
            })
        }

    })
    export default BillingReports.reducer;