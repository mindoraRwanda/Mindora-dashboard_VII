import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import patientsReducer from './slice/Patients';
import appointmentReducer from '../Redux/Appointment';

const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
    appointments: appointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;