import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import TherapyReducer from './slice/ThearpySlice';
import UserReducer from './slice/UserSlice';
import PatientReducer from './slice/PatientSlice';



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