import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import AdminDashboard from './Pages/Routes';
import TherapyDashboard from './Pages/TherapyRoutes';
import ForgotPassword from './Pages/forgot-password';
import { ResetPassword } from './Pages/resertPassword';
import ViewAppointment from './components/Therapist/Appointment AvaillableSlot';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path="/dashboard" element={<AdminDashboard/>} />
      <Route path="/therapy" element={<TherapyDashboard/>} />
      <Route path="/resetPassword/:token" element={<ResetPassword />} />
      <Route path="/src/components/Therapist/ViewAppointment.tsx" element={<ViewAppointment/>} />
    </Routes>
  );
}

export default App;