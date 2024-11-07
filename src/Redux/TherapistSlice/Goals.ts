import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface GoalState {
    treatmentPlanId: string;
    description: string;
    targetDate: string;
    status:string;
}
interface GoalState{
    data: GoalState[],
    status: 'idle' | 'loading' | 'succeeded' | 'rejected',
    error: string | null,
}

  

export const createGoal=createAsyncThunk('CreateGoal/createGoal',
    async (goalData: GoalState, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-goals', goalData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// this is for getting all Goals

export const getAllGoals=createAsyncThunk('GetAllGoals/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-goals');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// logic to get single Goal

export const getGoalById=createAsyncThunk('GetGoalById/get',
    async (id:string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-goals/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// logic for deleteGoals
export const deleteGoals=createAsyncThunk('DeleteGoals/delete',
    async (id:string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-goals/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Logics for Updating Goals
export const updateGoals=createAsyncThunk('UpdateGoals/update',
    async (data:{id:string; goalData: GoalState}, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-goals/${data.id}`, data.goalData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    });

const GoalPlanSlice = createSlice({
    name: 'goalPlan',
    initialState: {
      goals: [],
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
        .addCase(createGoal.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(createGoal.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.goals.push(action.payload);
          const goalId=action.payload?.id||action.payload.goalId;
          if(goalId){
              state.goalId=goalId;
              localStorage.setItem('goalId', goalId);
              console.log('Saved goalId:', goalId);
          }
        })
        .addCase(createGoal.rejected, (state, action) => {
          state.status = 'rejected';
          state.error = action.payload;
        })
        // this is for getting all Goals
        .addCase(getAllGoals.pending, (state) => {
            state.status = 'loading';
            state.error=null;
        })
     
        .addCase(getAllGoals.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.data = action.payload;
            state.error = null;
        })
        .addCase(getAllGoals.rejected,(state,action)=>{
            state.status='rejected';
            state.error=action.payload;
        })
        .addCase(getGoalById.pending, (state) => {
            state.status = 'loading';
            state.error=null;

        })
        .addCase(getGoalById.fulfilled, (state, action) => {
            state.status ='succeeded';
            state.data = action.payload;
            state.error=null;
        })
        .addCase(getGoalById.rejected, (state,action)=>{
            state.status='rejected';
            state.error=action.payload;

        })
        .addCase(deleteGoals.pending, (state) => {
            state.status = 'loading';
            state.error=null;
        })
        .addCase(deleteGoals.fulfilled, (state,action) => {
            state.status ='succeeded';
            state.goals=state.goals.filter(goal=>goal.id!==action.payload);
            state.error = null;
        })
        .addCase(deleteGoals.rejected, (state,action) => {
            state.status = 'rejected';
            state.error = action.payload;
        })
        .addCase(updateGoals.pending, (state) => {
            state.status = 'loading';
            state.error=null;
        })
        .addCase(updateGoals.fulfilled, (state,action) => {
            state.status ='succeeded';
            state.goals=state.goals.map(goal=>goal.id===action.payload.id?action.payload:goal);
            state.error=null;
        })
        .addCase(updateGoals.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload || "An error occurred while updating";
        });
        
    },
  });

export const { resetStatus } = GoalPlanSlice.actions;
export default GoalPlanSlice.reducer;