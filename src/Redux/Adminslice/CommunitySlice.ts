import { createAsyncThunk,createSlice, isRejected } from "@reduxjs/toolkit";
import axios from "axios";

interface Community{
    id?: string;
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
    export const GetCommunityById=createAsyncThunk('GetCommunityById',
        async(id,{rejectedValue})=>{
            try{
                const response=await axios.get(`https://mindora-backend-beta-version-m0bk.onrender.com/api/support-communities/${id}`);
                return response.data;
            }
            catch (error){
                return rejectedValue(error as Error).message;
            }
        }
    );
    export const UpdateCommunity=createAsyncThunk('UpdateCommunity/update',
        async({id,CommunityData}:{id:string,CommunityData:Partial<Community>},{rejectWithValue})=>{
        try{
            const response=await axios.put<Community>(`https://mindora-backend-beta-version-m0bk.onrender.com/api/support-communities/${id}`,CommunityData);
            console.log("data to be updated",response.data);
            return response.data;
        }
        catch (error){
            return rejectWithValue(error as Error).message;
        }
    });
    export const deleteCommunity=createAsyncThunk('deleteCommunity/delete',
    async(id:string,{rejectWithValue})=>{
        try{
            const response=await axios.delete(`https://mindora-backend-beta-version-m0bk.onrender.com/api/support-communities/${id}`);
            console.log("data to be deleted",response.data);
            return response.data;
        }
        catch (error){
            return rejectWithValue(error as Error).message;
        }
    }
);

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
        build.addCase(GetCommunityById.pending,(state)=>{
            state.status='loading';
        })
        build.addCase(GetCommunityById.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.selectedCommunity=action.payload;
        })
        build.addCase(GetCommunityById.rejected,(state,action)=>{
            state.status='rejected';
            state.error=action.payload;
        })
        
        build.addCase(deleteCommunity.pending,(state)=>{
            state.status='loading'; 
        })
        build.addCase(deleteCommunity.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.communities=state.communities.filter((community)=>community.id!==action.payload);
        })
        build.addCase(deleteCommunity.rejected,(state,action)=>{
            state.status='rejected';
            state.error=action.payload;
        })
        build.addCase(UpdateCommunity.pending,(state)=>{
            state.status='loading';
        })
        build.addCase(UpdateCommunity.fulfilled,(state,action)=>{
            state.status='succeeded';
            const index = state.communities.findIndex(comm => comm.id === action.payload.id);
            if (index !== -1) {
                state.communities[index] = action.payload;
            }
        })
        build.addCase(UpdateCommunity.rejected,(state,action)=>{
            state.status='rejected';
            state.error=action.payload;
        })
}})
export default CommunityGroup.reducer;