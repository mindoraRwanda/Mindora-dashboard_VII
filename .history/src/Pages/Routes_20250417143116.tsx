
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
import Article_Management from '../components/Admin/Article_Management';
import BillingReports from '../components/Admin/Billing_Report';
import Data_Security from '../components/Admin/Data_Security';
import Data_BackUp from '../components/Admin/Data_BackUp';
import Financial_Management from '../components/Admin/Financial_Management';
import Legal_Complaints from '../components/Admin/Legal_Complaints';
import Course_Management from '../components/Admin/Course_Management';
import Settings from '../components/settings';



const AdminDashboard = () => {
  const admin = 'admin';
  const [activeComponent, setActiveComponent] = useState('home');
  const [selectedCourseId] = useState<string | null>(null);

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
          case 'Artcicle_management':
            return (
              <Article_Management
                selectedCourseId={selectedCourseId}
                setActiveButton={setActiveButton}
              />
            );
            
          case 'BillingReports':
            return <BillingReports/>;
        case 'Data Security':
          return <Data_Security/>;
      case 'Data backup':
       return <Data_BackUp/>;
      case 'Financial Management':
      return <Financial_Management/>
      case 'Legal and Complaints':
        return< Legal_Complaints/>;
        case 'Courses Management':
          return <Course_Management/>;
          case 'Settings':
            return <Settings/>

    default:
        return <div className='flex justify-center text-black text-3xl mt-10'>?</div>;
    }
  };

  return (
    <div className="flex h-screen">
       <div className="w-1/5 px-3 -ml-3">
      <Sidebar userRole={admin} setActiveComponent={setActiveComponent} />
      </div>
      <div className="flex flex-col flex-grow w-4/5 pl-10">
        <TopBar userRole={admin}/>
        <div className="flex-grow bg-gray-200 mt-14">
        {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;