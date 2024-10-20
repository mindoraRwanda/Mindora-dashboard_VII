import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../../Redux/Appointment';

export default function AppointmentList() {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.appointments.items);
  const status = useSelector((state) => state.appointments.status);
  const error = useSelector((state) => state.appointments.error);

  // First useEffect for fetching appointments
  useEffect(() => {
    if (status === 'idle') {
      console.log('Dispatching fetchAppointments...');
      dispatch(fetchAppointments());
    }
  }, [status, dispatch]); // Ensure dispatch is included as it's a dependency

  // Second useEffect for logging appointments
  useEffect(() => {
    console.log('Appointments:', appointments);
  }, [appointments]); // Only run when appointments change

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!Array.isArray(appointments) || appointments.length === 0) {
    return <div>No appointments available.</div>;
  }

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
            <tr key={appointment.id || index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              <td className="px-6 py-4 border-b border-gray-300">
                <div className="text-sm font-medium text-gray-900">{appointment.therapistId}</div>
              </td>
              <td className="px-6 py-4 border-b border-gray-300">
                <div className="text-sm font-medium text-gray-900">{appointment.startTime}</div>
              </td>
              {/* <td className="px-6 py-4 border-b border-gray-300">
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
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
