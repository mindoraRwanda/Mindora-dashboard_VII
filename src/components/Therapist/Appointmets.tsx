import React, { useState } from 'react'
import { FaUser } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';

function Appointmets() {
  const [appointmentData, setAppointmentData]=useState({
    Appointments: [
      {
        id: 1,
        date: "oct 28 2024",
        time: "09:00",
        duration: "30 minutes",
        patient: "John Doe",
        therapist: "Placide Ikundabayo",
        statusApp: "completed",
      }
    ],
  })
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mt-3">
    {/* List of all appointments */}

    <div className='w-full bg-purple-600 text-white text-2xl p-3 rounded'>
     <h1> Appointments Management - My Appointments </h1>
    </div>
    {appointmentData.Appointments.map((item, index) => (
      <div
        key={index}
        className="bg-white rounded-lg flex flex-row justify-between border-2 p-6 mt-3"
      >
        <div className="ml-2">
          <p className="text-black text-sm font-semibold flex flex-row gap-2">
            <FaUser size={23} /> {item.patient} - {item.therapist}
          </p>
          <p className="text-gray-500 text-sm">{item.type}</p>
          <input
            type="time"
            className="w-full p-1 border rounded text-black my-3"
            value={item.time}
            onChange={(e) => {
              const updatedData = [...appointmentData.Appointments];
              updatedData[index].time = e.target.value;
              setAppointmentData((prev) => ({
                ...prev,
                Appointments: updatedData,
              }));
            }}
          />
          <div className="flex flex-row gap-4 my-2">
          <p className="text-black text-sm flex flex-row gap-1">
           <BiTime size={19}/> Date: {item.date}
          </p>
          <p className="text-black text-sm flex flex-row gap-1">
           <BiTime size={19}/> Time: {item.time}
          </p>
          <p className="text-black text-sm flex flex-row gap-1">
           <BiTime size={19}/> Duration: {item.duration}
          </p>
          </div>
          <div className="my-2">
            <button className="text-white text-sm bg-purple-700 p-2 rounded">
              ReSchedule
            </button>
            <button className="text-black text-sm bg-transparent border-red-500 border m-1 p-2 rounded ml-2">
              Cancel
            </button>
            <button className="text-black text-sm bg-transparent border border-gray-600 m-1 p-2 rounded">
              Remainder
            </button>
          </div>
        </div>
        
          {item.statusApp === "completed" && (
            <p className="italic m-5 p-2 text-blue-600 ">
              {item.statusApp}
            </p>
          )}
              {item.statusApp === "waiting" && (
            <p className="italic m-5 p-2 text-green-500">
              {item.statusApp}
            </p>
          )}
          {item.statusApp === "Pending" && (
            <p className="italic m-5 p-2 text-orange-400">
              {item.statusApp}
            </p>
          )}
            {item.statusApp === "canceled" && (
            <p className="italic m-5 p-2 text-red-700">
              {item.statusApp}
            </p>
          )}
     
      </div>
    ))}
  </div>
  )
}

export default Appointmets
