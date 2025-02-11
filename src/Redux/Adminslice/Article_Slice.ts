import axios from "axios";
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

interface Article {
  id: string;
  name: string;
}

interface ArticleState {
  data: Article[];
  status: 'idle' | 'loading' |'succeeded' | 'failed';
}

const initialState: ArticleState = {
  data: [],
  status:"idle",
};

export const createArticle=createAsyncThunk('articleContent/createArticle',
 async(articleData:any,{rejectWithValue})=>{
    try{
        const response=await axios.post(`https://mindora-backend-beta-version-m0bk.onrender.com/api/articles`,articleData);
        return response.data;
    }
    catch(error){
        return rejectWithValue(error.message);
    }

 });

 const Articles=createSlice({
    name:'articleContent',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
       .addCase(createArticle.pending,(state)=>{
        state.status='loading';
       })
        .addCase(createArticle.fulfilled,(state,action)=>{
        state.status='succeeded';
        state.data.push(action.payload);
       })
       .addCase(createArticle.rejected,(state,action)=>{
        state.status='failed';
        console.log(action.payload);
       })
    },
 })
 export default Articles.reducer;