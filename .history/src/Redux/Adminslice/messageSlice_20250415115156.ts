import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Interface defining the structure of a message
export interface Messages {
    id?: string;
    sender: string;
    recipient: string;
    content: string;
    timestamp: string;
}

// Interface defining the message state in Redux
interface MessagesState {
    messages: Messages[];
    messageCount: number;
    loading: boolean;
    status: "idle" | "loading" | "succeeded" | "rejected";
    error: string | null;
}

const initialState: MessagesState = {
    messages: [],
    messageCount: 0,
    loading: false,
    status: "idle",
    error: null
}

export const fetchMessages = createAsyncThunk('getMessages',
    async(_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/messages`);
            return response.data;
        }
        catch(error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchMessages.pending, (state) => {
            state.loading = true;
            state.status = "loading";
            state.error = null;
        })
        .addCase(fetchMessages.fulfilled, (state, action) => {
            state.loading = false;
            state.status = "succeeded";
            state.error = null;
            state.messages = action.payload;
            state.messageCount = action.payload.length;
        })
        .addCase(fetchMessages.rejected, (state, action) => {
            state.loading = false;
            state.status = "rejected";
            state.error = action.payload as string;
        })
    }
})

export default messagesSlice.reducer;