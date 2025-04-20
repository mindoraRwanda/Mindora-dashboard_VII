import { createAsyncThunk,createSlice, isRejected, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";

interface CommunityPost{
    id?: string;
    communityId: string;
    userId: string;
    content: string;
    postId: string;
}

interface CommunityPostState{
        posts: CommunityPost[];
        status: 'idle' | 'loading' | 'succeeded' | 'rejected';
        error: string | null;
    
}

const initialState: CommunityPostState = {
    posts: [],
}
export const getAllCommunityPost=createAsyncThunk("getPost",
    async(__,{rejectWithValue})=>{
        const token=localStorage.getItem('token');
        try{
            const response=await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/posts`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        }
        catch(error){
            return rejectWithValue(error as Error).message;
        }
    }
);
export const deletePots=createAsyncThunk('deletePsot',
    async(id,{rejectWithValue})=>{
        try{
            await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/posts/${id}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return id;
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    }
);
export const UpdatePost=createAsyncThunk('UpdatePost',
    async({id,postData})=>{
        try{
            const response=await axios.put(`https://mindora-backend-beta-version-m0bk.onrender.com/api/posts/${id}`,postData,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.message);
        }

    }
);
const communityPostSlice=createSlice({
    name:'communityPost',
    initialState,
    reducers:{},
    extraReducers:(build) => build
    .addCase(getAllCommunityPost.pending, (state) => {
        state.status='loading';
    })
    .addCase(getAllCommunityPost.fulfilled, (state, action) => {
        state.status='succeeded';
        state.posts=action.payload;
    })
    .addCase(getAllCommunityPost.rejected, (state, action) => {
        state.status='rejected';
        state.error=action.payload as string | null;
    })
    .addCase(deletePots.pending,(state)=>{
        state.status='loading';
    })
    .addCase(deletePots.fulfilled,(state,action) => {
        state.status='succeeded';
        state.posts=state.posts.filter(post=>post.id!==action.payload);
    })
    .addCase(deletePots.rejected,(state,action) => {
        state.status='rejected';
        state.error=action.payload as string | null;
    })
    .addCase(UpdatePost.pending,(state)=>{
        state.status='loading';
    })
    .addCase(UpdatePost.fulfilled,(state,action) => {
        state.status='succeeded';
        const postIndex=state.posts.findIndex(post=>post.id===action.payload.id);
        if(postIndex>-1){
            state.posts[postIndex]=action.payload;
        }
    })
    .addCase(UpdatePost.rejected,(state,action) => {
        state.status='rejected';
        state.error=action.payload as string | null;
    })
});
export default  communityPostSlice.reducer;