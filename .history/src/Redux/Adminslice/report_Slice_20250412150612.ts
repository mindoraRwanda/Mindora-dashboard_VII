import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getPostReport = createAsyncThunk('get/reports',
    async(postId,{rejectedWithValue})=>{
        try {
            const response = await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/post-report/post/${selectedTotalUser.}`);
            return response.data;
        } catch (error) {
            return rejectedWithValue(error.response?.data || { message: error.message });
        }
    }
)
  