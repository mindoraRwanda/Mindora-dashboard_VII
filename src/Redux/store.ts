  import { configureStore } from '@reduxjs/toolkit';
  import authReducer from './Adminslice/authSlice';
  import TherapyReducer from './Adminslice/ThearpySlice';
  import UserReducer from './Adminslice/UserSlice';
  import PatientReducer from './Adminslice/PatientSlice';
  import AppointmentReducer from './TherapistSlice/Appointment';
  import AvailableSlotReducer from './TherapistSlice/Appointment_Slot';
  import treatmentPlanReducer from './TherapistSlice/TreatmentPlan';
  import GoalPlanReducer from './TherapistSlice/Goals';
  import MilestoneReducer from './TherapistSlice/Milestones';
  import rescheduleReducer from './TherapistSlice/AppointmentChange';
  import AllAppointmentReducer from './Adminslice/AllAppointment';
  import CommunityReducer from './Adminslice/CommunitySlice';
  import CommunityPostReducer from './Adminslice/CommunityPost';
  import ArticlesReducer from './Adminslice/Article_Slice';
import BillingReportsReducer from './Adminslice/BillingReportSlice';
import CourseReducer from './Adminslice/CourseSlice';
  
  const store = configureStore({
    reducer: {
      auth: authReducer,
      Therapy: TherapyReducer,
      users: UserReducer,
      patients: PatientReducer,
      appointment: AppointmentReducer,
      availableSlot:AvailableSlotReducer,
      treatmentPlan:treatmentPlanReducer,
      goalPlan: GoalPlanReducer,
      milestone: MilestoneReducer,
      reschedule: rescheduleReducer, 
      AllAppointment: AllAppointmentReducer,
      Community: CommunityReducer,
      CommunityPost: CommunityPostReducer,
      articleContent: ArticlesReducer,
      BillingReports: BillingReportsReducer,
      courses: CourseReducer, 

     
    },
  });

  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;

  export default store;