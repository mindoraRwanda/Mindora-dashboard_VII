import React, { useState } from 'react';
import Home from '../components/Therapist/Home';
 import Sidebar from '../components/Sidebar';
 import TopBar from '../components/TopBar';
import AppointmentList from '../components/Therapist/ViewAppointment';
 import VideoCall from '../components/Therapist/VideoCall';
import Reports from '../components/Therapist/Reports';
// import Settings from './Components/Therapist/Settings';
import PatientsList from '../components/PatientsList';
import PatientMessages from '../components/Therapist/PatientMessages';
import TreatmentPlanupdate from '../components/Therapist/TreatmentPlanupdate';
 import SetGoal from '../components/Therapist/SetGoal';
import TrackPatient from '../components/Therapist/TrackPatient';
// import Recommendations from './Components/Therapist/Recommandation';
// import PatientChart from './Components/Therapist/PatientChart';
// import SearchingPatient from './Components/Therapist/SearchingPatient'; // Updated import path
// import ClinicRecord from './Components/Therapist/ClinicRecord';
// import PatientsSurvey from './Components/Therapist/PatientsSurvey';
// import Emergency from './Components/Therapist/Emergency';
// import EducationResource from './Components/Therapist/EducationResources';
// import Invoice from './Components/Therapist/Invoice';
// import Chat from './Components/Therapist/Chat';
// import NotificationsPage from './Components/Therapist/Notification';
// import SendNotificationPage from './Components/Therapist/SendNotification';

const UserRole = {
  THERAPIST: "therapist",
};

export default function DashboardPage() {
  const [userRole, setUserRole] = useState(UserRole.THERAPIST);
  const [activeComponent, setActiveComponent] = useState("Home");

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Home':
        return <Home />
        case 'videoCall':
          return <VideoCall />
      // case 'sendNot':
      //   return <SendNotificationPage />;
      // case 'Notification':
      //   return <NotificationsPage />;
      // case 'Emegency':
      //   return <Emergency />;
      // case 'patients feedback':
      //   return <PatientsSurvey />;
      // case 'Record':
      //   return <ClinicRecord />;
      // case 'Searching':
      //   return <SearchingPatient />;
      case 'TreatmentPlan':
      return <TreatmentPlanupdate />;
      case 'SetGoal':
      return <SetGoal />;
      case 'TrackPatient':
      return <TrackPatient />;
      // case 'Recommandation':
      //   return <Recommendations />;
      // case 'patientChat':
      //   return <PatientChart />;
      // case 'Chat':
      //   return <Chat />;
      case 'appointments':
       return <AppointmentList />;
      case 'Patients':
       return <PatientsList />;
      case 'Messages':
        return <PatientMessages />;
      case 'reports':
        return <Reports />;
      // case 'invoice':
      //   return <Invoice />;
      // case 'education':
      //   return <EducationResource />;
      // case 'settings':
      //   return <Settings />;
      default:
       return <AppointmentList />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Sidebar 
        userRole={userRole} 
        setActiveComponent={setActiveComponent} 
        setUserRole={setUserRole}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar userRole={userRole} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-purple-100 to-pink-100 p-6 dark:bg-gray-900 dark:text-white">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
}
