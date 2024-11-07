import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Milestone{
    goalId: string;
    description: string;
    targetDate: string;
    status: string;
};

interface Milestone{
    data: Milestone[],
    status: 'idle' | 'loading' | 'succeeded' | 'rejected',
    error: string | null,
};

export const createMilestone=createAsyncThunk('CreateMilestone/createMilestone',
    async (Data: Milestone, { rejectWithValue }) => {
        try{
            const response = await axios.post('https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-milestones', Data);
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    });

    // Logics for getting all

    export const getAllMilestones=createAsyncThunk('GetAllMilestones/getAllMilestones',
        async (_, { rejectWithValue }) => {
            try{
                const response = await axios.get('https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-milestones');
                return response.data;
            }
            catch(error){
                return rejectWithValue(error.message);
            }
        });

        // logic for deleting milestones

        export const deleteMilestone=createAsyncThunk('deleteMilestone/delete',
            async (id: string, { rejectWithValue }) => {
                try{
                    const response = await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-milestones/${id}`);
                    return response.data;
                }
                catch(error){
                    return rejectWithValue(error.message);
                }
            });
    // Logic for update milestones

    export const updateMilestone=createAsyncThunk('updateMilestone/update',
        async (Data:{id:string,  milestoneData:Milestone}, { rejectWithValue }) => {
            try{
                const response = await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-milestones/${Data.id}`, Data.milestoneData);
                return response.data;
            }
            catch(error){
                return rejectWithValue(error.message);
            }
        });

    const milestoneSlice= createSlice({
        name:'milestones',
        initialState:{
            data: [],
            status: 'idle',
            error: null,
        },
        reducers: {
            resetStatus: (state) => {
                state.status = 'idle';
                state.error = null;
            },
        },
        extraReducers: (builder) => {
            builder
                .addCase(createMilestone.pending, (state) => {
                    state.status = 'loading';
                })
                .addCase(createMilestone.fulfilled, (state, action) => {
                    state.status ='succeeded';
                    state.data.push(action.payload);
                })
                .addCase(createMilestone.rejected, (state, action) => {
                    state.status ='rejected';
                    state.error = action.payload;
                })
                .addCase(getAllMilestones.pending,(state)=>{
                    state.status='loading';
                    state.error=null;
                })
                .addCase(getAllMilestones.fulfilled, (state, action) => {
                    state.status ='succeeded';
                    state.data = action.payload;
                })
                .addCase(getAllMilestones.rejected, (state, action)=>{
                    state.status='rejected';
                    state.error=action.payload as string;
                })
                .addCase(deleteMilestone.pending,(state)=>{
                    state.status='loading';
                    state.error=null;
                })
                .addCase(deleteMilestone.fulfilled, (state, action) => {
                    state.status ='succeeded';
                    state.error = null;
                    state.data = state.data.filter((mile) => mile.id!== action.payload);
                })
                .addCase(deleteMilestone.rejected,(state,action)=>{
                    state.status='rejected';
                    state.error=action.payload as string;
                })
                .addCase(updateMilestone.pending,(state)=>{
                    state.status='pending';
                    state.error=null;
                })
                .addCase(updateMilestone.fulfilled,(state,action)=>{
                    state.status ='succeeded';
                    const index = state.data.findIndex((milestone) => milestone.goalId === action.payload.goalId);
                    if (index !== -1) {
                        state.data[index] = action.payload; 
                    }
                })
                .addCase(updateMilestone.rejected,(state, action) =>{
                    state.status ='rejected';
                    state.error=action.payload as string;
                })
        }
    });
    export const {resetStatus} = milestoneSlice.actions;
    export default milestoneSlice.reducer;




