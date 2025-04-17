import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface MilestoneData {
  id?: string;
  goalId?: string;
  description: string;
  targetDate: string;
  status: string;
}

interface MilestoneState {
  data: MilestoneData[];
  status: 'idle' | 'loading' | 'succeeded' | 'rejected';
  error: string | null;
}

export const createMilestone = createAsyncThunk(
  'CreateMilestone/createMilestone',
  async (data: MilestoneData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-milestones',
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllMilestones = createAsyncThunk(
  'GetAllMilestones/getAllMilestones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-milestones'
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMilestone = createAsyncThunk(
  'deleteMilestone/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(
        `https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-milestones/${id}`
      );
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateMilestone = createAsyncThunk(
    'updateMilestone/update',
    async (updateData: { id: string; milestoneData: MilestoneData }, { rejectWithValue }) => {
      try {
        const { id, milestoneData } = updateData;
        const response = await axios.put(
          `https://mindora-backend-beta-version-m0bk.onrender.com/api/treatment-milestones/${id}`,
          milestoneData
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

const milestoneSlice = createSlice({
  name: 'milestones',
  initialState: {
    data: [] as MilestoneData[],
    status: 'idle',
    error: null,
  } as MilestoneState,
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
      .addCase(createMilestone.fulfilled, (state, action: PayloadAction<MilestoneData>) => {
        state.status = 'succeeded';
        state.data.push(action.payload);
      })
      .addCase(createMilestone.rejected, (state, action: PayloadAction<string>) => {
        state.status = 'rejected';
        
      })
      .addCase(getAllMilestones.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllMilestones.fulfilled, (state, action: PayloadAction<MilestoneData[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(getAllMilestones.rejected, (state, action: PayloadAction<string>) => {
        state.status = 'rejected';
        state.error = action.payload as string;
      })
      .addCase(deleteMilestone.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteMilestone.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.error = null;
        state.data = state.data.filter((mile) => mile.id !== action.payload);
      })
      .addCase(deleteMilestone.rejected, (state, action: PayloadAction<string>) => {
        state.status = 'rejected';
        state.error = action.payload as string;
      })
      .addCase(updateMilestone.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateMilestone.fulfilled, (state, action: PayloadAction<MilestoneData>) => {
        state.status = 'succeeded';
        const index = state.data.findIndex((milestone) => milestone.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateMilestone.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message || 'Failed to update milestone';
      });
  },
});

export const { resetStatus } = milestoneSlice.actions;
export default milestoneSlice.reducer;