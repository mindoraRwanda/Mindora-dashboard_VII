import React, { useState } from 'react'
import { FaUser } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';

function Appointmets() {
  const [appointmentData, setAppointmentData]=useState([]);
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mt-3">
    {/* List of all appointments */}

    <div className='w-full bg-purple-600 text-white text-2xl p-3 rounded'>
     <h1> Appointments Management - My Appointments </h1>
    </div>
    {appointmentData.map((item, index) => (
      <div
        key={index}
        className="bg-white rounded-lg flex flex-row justify-between border-2 p-6 mt-3"
      >
        <div className="ml-2">
          <p className="text-black text-sm font-semibold flex flex-row gap-2">
            <FaUser size={23} /> {item.patient} - {item.therapist}
          </p>
          <p className="text-gray-500 text-sm">{item.appointmentType}</p>
          <input
            type="time"
            className="w-full p-1 border rounded text-black my-3"
            value={item.startTime}
          />
          <div className="flex flex-row gap-4 my-2">
          <p className="text-black text-sm flex flex-row gap-1">
           <BiTime size={19}/> StartTime: {item.startTime}
          </p>
          <p className="text-black text-sm flex flex-row gap-1">
           <BiTime size={19}/> EndTime: {item.endTime}
          </p>
          <p className="text-black text-sm flex flex-row gap-1">
           <BiTime size={19}/> Location: {item.location}
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
        
          {item.status === "completed" && (
            <p className="italic m-5 p-2 text-blue-600 ">
              {item.status}
            </p>
          )}
              {item.status === "waiting" && (
            <p className="italic m-5 p-2 text-green-500">
              {item.status}
            </p>
          )}
          {item.status === "Pending" && (
            <p className="italic m-5 p-2 text-orange-400">
              {item.status}
            </p>
          )}
            {item.status === "canceled" && (
            <p className="italic m-5 p-2 text-red-700">
              {item.status}
            </p>
          )}
     
      </div>
    ))}
  </div>
  )
}

export default Appointmets
