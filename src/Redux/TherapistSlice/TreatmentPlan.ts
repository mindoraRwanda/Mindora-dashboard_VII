    import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
    import axios from "axios";

    interface TreatmentPlan {
        patientId: string;
        therapistId: string;
        title: string;
        descriptions: string;
        startDate: number | string;
        endDate: number | string;
        status: string
    }

    interface TreatmentState {
        data: TreatmentPlan[];
        loading: boolean;
        status: "idle" | "loading" | "succeeded" | "rejected";
        error: string | null;
    }

    const initialState: TreatmentState = {
        data: [],
        loading: false,
        status: "idle",
        error: null
    }

    export const createPlan = createAsyncThunk(
        'createPlan/create',
        async (data: TreatmentPlan, { rejectWithValue }) => {
            try {
                const response = await axios.post(
                    'https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment_plans',
                    data
                );
                return response.data;
            } catch (error) {
                return rejectWithValue(error.message);
            }
        }
    );

    //   logic for getting all treatmentPlan

    export const getAllTreatmentPlan = createAsyncThunk("getAllTreatmentPlan/getAll",
        async (_, { rejectWithValue }) => {
            try {
                const response = await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment_plans`);
                return response.data;
            } catch (error) {
                return rejectWithValue(error.message);
            }
        }
    );
    // Logics for deleting TreatmentPlans

    export const deleteTreatmentPlan=createAsyncThunk('deletePlan/delete',
        async(id:string,{rejectWithValue})=>{
            try{
                const response=await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment_plans/${id}`);
                return response.data;
            }
            catch (err){
                return rejectWithValue(err.message);
            }
        }
    );

    // Logics for updating TreatmentPlans

    export const updateTreatmentPlan=createAsyncThunk('UpdateTreatment/Update',
        async(data:{id:string;updateTreatmentData:TreatmentPlan},{rejectWithValue})=>{
            try{
                const response=await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment_plans/${data.id}`,data.updateTreatmentData);
                return response.data;
            }
            catch (err){
                return rejectWithValue(err.message);
            }
        }
    );

    const treatmentPlanSlice = createSlice({
        name: 'treatmentPlan',
        initialState,
        reducers: {
            resetStatus: (state) => {
                state.status = 'idle';
                state.error = null;
            },
        },
        extraReducers: (builder) => {
            builder
                .addCase(createPlan.pending, (state) => {
                    state.status = "loading";
                })
                .addCase(createPlan.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.data.push(action.payload);
                })
                .addCase(createPlan.rejected, (state, action) => {
                    state.status = "rejected";
                    state.error = action.payload as string;
                })
                .addCase(getAllTreatmentPlan.pending, (state) => {
                    state.status = 'loading';
                    state.error = null;
                })

                .addCase(getAllTreatmentPlan.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.data = action.payload;
                    state.error = null;
                })
                .addCase(getAllTreatmentPlan.rejected, (state) => {
                    state.status = 'rejected';
                    state.error = action.payload as string;

                })
                .addCase (deleteTreatmentPlan.pending, (state)=>{
                    state.status='loading';
                    state.error=null;
                })
                .addCase(deleteTreatmentPlan.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.data = state.data.filter(item => item.id!== action.payload.id);
                })
                .addCase(deleteTreatmentPlan.rejected, (state,action) =>{
                    state.status='rejected';
                    state.error=action.payload;
                })
                .addCase(updateTreatmentPlan.pending,(state)=>{
                    state.status='loading';
                    state.error=null;
                })
    .addCase(updateTreatmentPlan.fulfilled, (state,action) =>{
        state.status='succeeded';
        const index = state.data.findIndex(data => data.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
    }
    })

    .addCase(updateTreatmentPlan.rejected,(state,action)=>{
        state.status='rejected';
        state.error=action.payload;
    })

                .addCase(resetStatus, (state) => {
                    state.status = 'idle';
                    state.error = null;
                });
        },
    });

    export const { resetStatus } = treatmentPlanSlice.actions;
    export default treatmentPlanSlice.reducer;