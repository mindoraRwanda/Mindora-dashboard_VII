import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import TherapyReducer from './slice/ThearpySlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    Therapy: TherapyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;