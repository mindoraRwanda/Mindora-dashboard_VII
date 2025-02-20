import axios from "axios";
import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

interface comments{
    id?: string;
    postId: string;

}

interface commentState{
    data: comments[],
    status: "idle" | "loading" | "succeeded" | "rejected" ;
}

const initialState: commentState = {
    data: [],
    status: "idle",
};

export const fetchPostCommnet=createAsyncThunk('fetchCommnet',
    async (postId: string) => {
        try {
            const response = await axios.get<comments[]>(
                `https://mindora-backend-beta-version-m0bk.onrender.com/api/post/${postId}/comments`,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                   
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw error;
        }
    }
);

const CommentSlice=createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers:(builder)=> {
       builder
       .addCase(fetchPostCommnet.pending,(state)=>{
            state.status='loading';
        })
        .addCase(fetchPostCommnet.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.data=action.payload;
        })
        .addCase(fetchPostCommnet.rejected,(state,action)=>{
            state.status='rejected';
            state.error = action.error.message;
            console.log("comment not visible",action.payload);
        })
    }
 });
export default  CommentSlice.reducer;
