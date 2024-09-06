import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function TherapyDashboard() {
  const admin = 'therapist';
  return (
    <div className="flex h-screen">
      <Sidebar userRole={admin} className="w-64 bg-gray-800 text-white" />
      <div className="flex flex-col flex-grow">
        <TopBar userRole={admin} className="h-16 bg-white shadow-md" />
        <div className="flex-grow p-4">
        </div>
      </div>
    </div>
  )
}
