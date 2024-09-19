import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import TherapyReducer from './slice/ThearpySlice';
import UserReducer from './slice/UserSlice';



const store = configureStore({
  reducer: {
    auth: authReducer,
    Therapy: TherapyReducer,
    users: UserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;