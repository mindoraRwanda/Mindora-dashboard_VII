import { useState } from 'react';
import Home from '../components/Therapist/Home';
 import Sidebar from '../components/Sidebar';
 import TopBar from '../components/TopBar';
import ManageAppointMents from '../components/Therapist/Appointment AvaillableSlot';
 import VideoCall from '../components/Therapist/VideoCall';
import Reports from '../components/Therapist/Reports';
import PatientsList from '../components/Therapist/PatientsList';
import TreatmentPlanupdate from '../components/Therapist/TreatmentPlanupdate';
import Medication from '../components/Therapist/Medication';
import Appointmets from '../components/Therapist/Appointmets';
import { useNavigate } from 'react-router-dom';
import Prescription from '../components/Therapist/Prescrition';

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
      case 'Medication':
      return <Medication />;
      case 'AvaillableSlots':
       return <ManageAppointMents />;
      case 'Patients':
       return <PatientsList goToPlan={goToPlan} />;
       case "PatientsList":
        return <PatientsList />
      case 'reports':
        return <Reports />;
          case 'Appointmets':
            return <Appointmets/>;
              case'Prescription':
              return <Prescription/>
              case 'Settings':
                return <Sett
      default:
       return (
        <div><h1 className='text-black text-2xl flex justify-center mt-10'>No Content</h1></div>
       );
    }
  };

  return (
    <div className="flex h-screen ">
      <div className=' w-1/5'>
      <Sidebar 
        userRole={userRole} 
        setActiveComponent={setActiveComponent} 
        setUserRole={setUserRole}
      />
      </div>
      <div className="flex flex-col flex-grow w-4/5 pl-10">
        <TopBar userRole={userRole} /> <div className="flex-grow bg-gray-200 mt-14">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}
