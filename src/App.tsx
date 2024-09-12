import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import AdminDashboard from './Pages/AdminDashboard';
import TherapyDashboard from './Pages/TherapyDashboard';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<AdminDashboard/>} />
      <Route path="/therapy" element={<TherapyDashboard/>} />
      
    </Routes>
  );
}

export default App;