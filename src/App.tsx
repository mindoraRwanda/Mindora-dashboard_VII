import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import AdminDashboard from './Pages/AdminDashboard';
import TherapyDashboard from './Pages/TherapyDashboard';
import ViewAppointment from '../src/components/Therapist/ViewAppointment';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<AdminDashboard/>} />
      <Route path="/therapy" element={<TherapyDashboard/>} />
      <Route path="/src/components/Therapist/ViewAppointment.tsx" element={<ViewAppointment/>} />
    </Routes>
  );
}

export default App;