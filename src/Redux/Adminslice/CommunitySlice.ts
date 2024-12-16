import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Community{
    moderatorId?: string;
    name: string;
    description: string;
    isPrivate?: boolean;
}
interface CommunityState{
    communities:Community[];
    status: 'idle' | 'loading' |'succeeded' |'rejected';
    error: string | null;
}
const initialState:CommunityState={
    communities:[],
    status:'idle',
    error:null
};

export const createCommunity=createAsyncThunk('createCommunity/create',
    async(CommunityData:Community,{rejectedValue})=>{
        try{
            const response=await axios.post<Community>('https://mindora-backend-beta-version-m0bk.onrender.com/api/support-communities',
            CommunityData);
            console.log("data catched:", response);
            return response.data;
        }
        catch (error){
            return rejectedValue(error as Error).message;
        }
    }
);

export const getAllcommunity=createAsyncThunk("getAll/getAllCommunity",
    async(__,{rejectedValue})=>{
        try{
            const response=await axios.get('https://mindora-backend-beta-version-m0bk.onrender.com/api/support-communities');
            console.log("data to be displayed",response.data);
            return response.data;
        }
        catch (error){
            return rejectedValue(error as Error).message;
        }
    });


const CommunityGroup=createSlice({
    name:'communityGroup',
    initialState,
    reducers: {},
    extraReducers:(build)=>{
        build.addCase(createCommunity.pending, (state) => {
            state.status='loading';
        })
        build.addCase(createCommunity.fulfilled, (state, action) => {
            state.status='succeeded';
            state.communities.push(action.payload); 
        })
        build.addCase(createCommunity.rejected, (state, action) => {
            state.status='rejected';
            state.error=action.payload;
        }) 

        build.addCase(getAllcommunity.pending,(state)=>{
            state.status='loading';
        })
        build.addCase(getAllcommunity.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.communities=action.payload;
        })
        build.addCase(getAllcommunity.rejected,(state,action)=>{
            state.status='rejected';
            state.error=action.payload;
        })
}})
export default CommunityGroup.reducer;