import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "../../Redux/Appointment";
import { message, Modal } from "antd";

export default function AppointmentList() {
  const appointments = [
    { id: 1, patientName: "John Doe", date: "2024-07-20", time: "10:00 AM" },
    { id: 2, patientName: "Jane Smith", date: "2024-07-21", time: "2:00 PM" },
    { id: 3, patientName: "Bob Johnson", date: "2024-07-22", time: "11:30 AM" },
  ];
  const [modal, setmodal] = useState("");

  const handleModal = () => {
    setmodal(true);
  };

  const cancelModal = () => {
    setmodal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex-row">
        {/* <button
          className="text-white p-1 rounded-md float-end font-semibold text-xl bg-purple-600"
          onClick={handleModal}
        >
          Create New
        </button> */}
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">
          Upcoming Appointments
        </h2>
      </div>
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Patient Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr
              key={appointment.id}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">
                  {appointment.patientName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                  {appointment.date}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                  {appointment.time}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal visible={modal} footer="" onCancel={cancelModal}>
        <p className="text-xl font-semibold my-3">Create New Appointment</p>
        <div className="grid grid-cols-2">
          <div className="my-2">
          <label htmlFor="startTime" className="my-2 text-lg">StartTime</label><br />
          <input type="time" id="startTime" name="startTime" className="border-2 border-gray-300 rounded-md p-1 w-full" /> 
          </div>
          <div className="my-2">
          <label htmlFor="endTime" className="my-2 text-lg">EndTime</label><br />
          <input type="time" id="endTime" name="endTime" className="border-2 border-gray-300 rounded-md p-1 w-full mx-2"/>
          </div>
          <div className="my-2">
          <label htmlFor="location" className="text-lg">Location</label><br />
          <input type="text" name="location" className="border-2 border-gray-300 rounded-md p-1 w-full "placeholder="Enter Location"/>
          </div>
          <div className="my-2">
          <label htmlFor="type" className="mx-2 text-lg">AppointmentType</label><br />
          <input type="text" name="appType" className="border-2 border-gray-300 rounded p-1 w-full mx-2" placeholder="Enter AppointmentType"/>   
          </div>
          <div className="my-2">
          <label htmlFor="status" className="text-lg">Status</label><br />
          <input type="text" name="status" className="border-2 border-gray-300 rounded p-1 w-full" placeholder="Enter status" />
          </div>  
          <div className="my-2">
          <label htmlFor="notes" className="mx-2 text-lg">Notes</label><br />
          <input type="text" name="notes" className="border-2 border-gray-300 rounded p-1 w-full mx-2" placeholder="Enter Notes"/>
          </div>
        </div>
        <button type="button" onClick={()=>message.info('new appointment created')} className="bg-purple-600 font-semibold text-white w-full p-2 my-2 rounded text-xl">Submit</button>
      </Modal>
    </div>
  );
}
