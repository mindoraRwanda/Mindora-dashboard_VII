import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../../Redux/Appointment';

export default function AppointmentList() {
  const dispatch = useDispatch();

  // Use optional chaining and provide fallback for 'appointments' in case it's undefined
  const appointments = useSelector((state) => state.appointments?.items || []);
  const status = useSelector((state) => state.appointments?.status);
  const error = useSelector((state) => state.appointments?.error);

  useEffect(() => {
    console.log('Dispatching fetchAppointments...'); // Log dispatch action
    dispatch(fetchAppointments());
  }, [dispatch]); // No need to track 'status' here

  useEffect(() => {
    console.log('Appointments:', appointments); // Log appointments data when updated
  }, [appointments]);

  // Handle loading state
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (status === 'failed') {
    console.error('Error:', error); // Log error in case of failure
    return <div>Error: {error}</div>;
  }

  // Handle empty appointments case
  if (appointments.length === 0) {
    return <div className='text-black'>No appointments available</div>;
  }

  // Render appointments table if data is available
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-purple-600">Upcoming Appointments</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient ID
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Time
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Time
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Appointment Type
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={appointment.id || index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              <td className="px-6 py-4 border-b border-gray-300">
                <div className="text-sm font-medium text-gray-900">{appointment.patientId}</div>
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                <div className="text-sm text-gray-900">{new Date(appointment.startTime).toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                <div className="text-sm text-gray-900">{new Date(appointment.endTime).toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                <div className="text-sm text-gray-900">{appointment.location}</div>
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                <div className="text-sm text-gray-900">{appointment.appointmentType}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
