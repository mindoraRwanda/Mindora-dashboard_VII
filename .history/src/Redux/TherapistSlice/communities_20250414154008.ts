import axions from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCommunities = createAsyncThunk('get/allcommunities',
    async()