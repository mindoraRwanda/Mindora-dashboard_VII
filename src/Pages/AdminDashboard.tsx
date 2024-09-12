
import AdminTherapistList from '../components/Admin/AdminTherapistList';
import Home from '../components/Admin/Home';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useState } from 'react';


const AdminDashboard = () => {
  const admin = 'admin';
  const [activeComponent, setActiveComponent] = useState('home');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'home':
        return <Home/>;
      case 'therapiest':
        return <AdminTherapistList />;
      default:
        return <div>Select a menu option</div>;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar userRole={admin} setActiveComponent={setActiveComponent} />
      <div className="flex flex-col flex-grow">
        <TopBar userRole={admin} className="h-16 shadow-md" />
        <div className="flex-grow p-4  bg-gray-200">
        {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;