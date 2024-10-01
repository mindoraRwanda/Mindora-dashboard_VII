import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import AdminDashboard from './Pages/Routes';
import TherapyDashboard from './Pages/TherapyDashboard';
import ForgotPassword from './Pages/forgot-password';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path="/dashboard" element={<AdminDashboard/>} />
      <Route path="/therapy" element={<TherapyDashboard/>} />
      
    </Routes>
  );
}

export default App;