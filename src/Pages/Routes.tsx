
import AdminPatientsList from '../components/Admin/AdminPatientList';
import AdminTherapistList from '../components/Admin/AdminTherapistList';
import AdminUserList from '../components/Admin/AdminUsers';
import Home from '../components/Admin/Home';
import Patient_Appointment from '../components/Admin/Appointment';
import UserEngagement from '../components/Admin/UserEngagement';
import Messages from '../components/Admin/Patient_Messages';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useState } from 'react';
import Roles from '../components/Admin/Roles_Permissions';
import ContentManage from '../components/Admin/Content_Management';
import Communication from '../components/Admin/Communicaty_Management';
import Electronic_Records from '../components/Admin/Electronic_Records';
import Reports from '../components/Admin/Data_Report';
import Data_Security from '../components/Admin/Data_Security';
import Data_BackUp from '../components/Admin/Data_BackUp';
import Financial_Management from '../components/Admin/Financial_Management';
import Legal_Complaints from '../components/Admin/Legal_Complaints';


const AdminDashboard = () => {
  const admin = 'admin';
  const [activeComponent, setActiveComponent] = useState('home');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'home':
        return <Home userRole={admin} />;
      case 'therapiest':
        return <AdminTherapistList />;
        case 'Admin Users':
          return <AdminUserList/>;
          case 'UserEngagement':
            return <UserEngagement/>;
        case 'AdminPatientList':
        return <AdminPatientsList/>;
        case 'Patient_Appointment':
          return <Patient_Appointment/>;
        case 'Patient_Messages':
          return <Messages/>;
          case 'Roles and Permissions':
            return <Roles/>;
        case 'Content Management':
          return <ContentManage/>;
          case 'Community Management':
            return <Communication/>;
          case 'Electronic Records':
            return <Electronic_Records/>;
          case 'Data Reports':
            return <Reports/>;
        case 'Data Security':
          return <Data_Security/>;
  case 'Data backup':
    return <Data_BackUp/>;
    case 'Financial Management':
      return <Financial_Management/>
      case 'Legal and Complaints':
        return< Legal_Complaints/>;

    default:
        return <div className='text-black text-2xl'>Select a menu option</div>;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar userRole={admin} setActiveComponent={setActiveComponent} />
      <div className="flex flex-col flex-grow">
        <TopBar userRole={admin}/>
        <div className="flex-grow p-4  bg-gray-200">
        {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;