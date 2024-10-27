import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Adminslice/authSlice';
import TherapyReducer from './Adminslice/ThearpySlice';
import UserReducer from './Adminslice/UserSlice';
import PatientReducer from './Adminslice/PatientSlice';



const store = configureStore({
  reducer: {
    auth: authReducer,
    Therapy: TherapyReducer,
    users: UserReducer,
    patients: PatientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;