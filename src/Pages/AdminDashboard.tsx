import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const AdminDashboard = () => {
  const admin = 'admin';

  return (
    <div className="flex h-screen">
      <Sidebar userRole={admin} />
      <div className="flex flex-col flex-grow">
        <TopBar userRole={admin} className="h-16 bg-white shadow-md" />
        <div className="flex-grow p-4">
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;