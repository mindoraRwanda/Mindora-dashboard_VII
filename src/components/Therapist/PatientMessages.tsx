import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients } from '../../Redux/slice/Patients';
import { FaFileAlt, FaDownload, FaChartBar } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';

export default function Messages() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const dispatch = useDispatch();
  const { data: patients, loading, error } = useSelector((state) => state.patients);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const renderMessageDetails = (patient) => {
    const { medicalProfile, personalInformation, emergencyContact, user } = patient || {};
    return (
      <div className="mt-4 p-4 bg-slate-300 rounded-lg">
        <h3 className="font-semibold text-red-400">Patient Details:</h3>
        <p className="text-black mt-3 font-bold">Medical Profile</p>
        <p className="text-black">Notes: {medicalProfile?.notes || 'N/A'}</p>
        <p className="text-black">Allergies: {medicalProfile?.allergies?.join(', ') || 'None'}</p>
        <p className="text-black">Conditions: {medicalProfile?.conditions?.join(', ') || 'None'}</p>
        <p className="text-black">Medications: {medicalProfile?.medications?.join(', ') || 'None'}</p>
        
        <p className="text-black mt-3 font-bold">Personal Information</p>
        <p className="text-black">Phone: {personalInformation?.phone || 'N/A'}</p>
        <p className="text-black">Gender: {personalInformation?.gender || 'N/A'}</p>
        <p className="text-black">Address: {personalInformation?.address || 'N/A'}</p>
        <p className="text-black">Date of Birth: {new Date(personalInformation?.dateOfBirth).toLocaleDateString() || 'N/A'}</p>

        <p className="text-black mt-3 font-bold">Emergency Contact</p>
        <p className="text-black">Name: {emergencyContact?.name || 'N/A'}</p>
        <p className="text-black">Phone: {emergencyContact?.phone || 'N/A'}</p>
        <p className="text-black">Address: {emergencyContact?.address || 'N/A'}</p>
        <p className="text-black">Relationship: {emergencyContact?.relationship || 'N/A'}</p>
        
        <p className="text-black mt-3 font-bold">User Information</p>
        <p className="text-black">Full Name: {user?.firstName} {user?.lastName}</p>
        <p className="text-black">Username: {user?.username}</p>
        <p className="text-black">Email: {user?.email}</p>
        <p className="text-black">Role: {user?.role}</p>
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <p className="text-2xl text-purple-600 my-4 font-semibold">Patient List</p>
      {Array.isArray(patients) && patients.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <ul className="divide-y divide-gray-200">
              {patients.map((patient) => (
                <li key={patient.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <FaMessage className="h-6 w-6 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{patient.user.firstName} {patient.user.lastName}</p>
                      <p className="text-sm text-gray-500">{new Date(patient.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(patient)}
                      className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {selectedMessage && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-purple-600">Patient Details</h3>
                {renderMessageDetails(selectedMessage)}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>No patients found</p>
      )}
    </div>
  );
}
