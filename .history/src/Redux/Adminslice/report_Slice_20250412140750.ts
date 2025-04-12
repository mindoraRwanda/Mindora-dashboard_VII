import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getReport = createAsyncThunk('get/reports',
    async({postId:string,{reje}})
)
  