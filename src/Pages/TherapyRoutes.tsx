import { useState } from 'react';
import Home from '../components/Therapist/Home';
 import Sidebar from '../components/Sidebar';
 import TopBar from '../components/TopBar';
import ManageAppointMents from '../components/Therapist/Appointment AvaillableSlot';
 import VideoCall from '../components/Therapist/VideoCall';
import Reports from '../components/Therapist/Reports';
import PatientsList from '../components/Therapist/PatientsList';
import AdminPatientsList from '../components/Admin/AdminPatientList';
import PatientMessages from '../components/Therapist/PatientMessages';
import TreatmentPlanupdate from '../components/Therapist/TreatmentPlanupdate';
//  import SetGoal from '../components/Therapist/SetGoal';
import TrackPatient from '../components/Therapist/TrackPatient';
//  import SetMilestone from '../components/Therapist/SetMilestones';
import Appointmets from '../components/Therapist/Appointmets';
import AppointmentChange from '../components/Therapist/Appointment Change';
import { useNavigate } from 'react-router-dom';

const UserRole = {
  THERAPIST: "therapist",
};

export default function DashboardPage() {
  const [userRole, setUserRole] = useState(UserRole.THERAPIST);
  const [activeComponent, setActiveComponent] = useState("Home");
  const navigate = useNavigate();
  const goToPlan = () => {
    navigate("/treatment-plan"); 
  };
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Home':
        return <Home />
        case 'videoCall':
          return <VideoCall />
      case 'TreatmentPlan':
      return <TreatmentPlanupdate />;
      case 'TrackPatient':
      return <TrackPatient />;
      case 'AvaillableSlots':
       return <ManageAppointMents />;
      case 'Patients':
       return <PatientsList goToPlan={goToPlan} />;
       case "PatientsList":
        return <PatientsList />
      case 'Messages':
        return <PatientMessages />;
      case 'reports':
        return <Reports />;
          case 'Appointmets':
            return <Appointmets/>
            case 'Appointment Changes':
              return<AppointmentChange/>
      default:
       return (
        <div><h1 className='text-black text-2xl'>No Data</h1></div>
       );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className='w-72'>
      <Sidebar 
        userRole={userRole} 
        setActiveComponent={setActiveComponent} 
        setUserRole={setUserRole}
      />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar userRole={userRole} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-purple-100 to-pink-100 p-6 dark:bg-gray-900 dark:text-white">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
}
