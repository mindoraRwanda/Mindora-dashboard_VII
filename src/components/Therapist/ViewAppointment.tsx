import { useState } from "react";
import { FaUser, FaCalendar } from "react-icons/fa";
import { BiTime } from 'react-icons/bi';
import { AiOutlinePlus } from "react-icons/ai";
import { Modal } from "antd";


export default function AppointmentList() {
  const [activeButton, setActiveButton] = useState("Schedule");
  const [modalVisible, setModalVisible] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    Schedule: [
      {
        name: "John Doe",
        session: "Therapy Session",
        type: "General checkup",
        time: "09:00",
        duration: "30 minutes",
        status: "confirmed",
      },
      {
        name: "Placide Ikundabayo",
        session: "General checkup",
        type: "General checkup",
        time: "11:00",
        duration: "30 minutes",
        status: "pending",
      },
    ],
    // Placeholder for other button data
    MyAppointments: [
      {
        id: 1,
        date: "oct 28 2024",
        time: "09:00",
        duration: "30 minutes",
        patient: "John Doe",
        therapist: "Placide Ikundabayo",
        status: "completed",
      },
      {
        id: 2,
        date: "oct 29 2024",
        time: "10:00",
        duration: "45 minutes",
        patient: "Jane Smith",
        therapist: "Bob Johnson",
        status: "Pending",
      },
      {
        id: 3,
        date: "oct 30 2024",
        time: "11:00",
        duration: "60 minutes",
        patient: "Alice Johnson",
        therapist: "Bob Johnson",
        status: "waiting",
      },
      {
        id: 4,
        date: "oct 31 2024",
        time: "12:00",
        duration: "45 minutes",
        patient: "Bob Johnson",
        therapist: "Alice Johnson",
        status: "canceled",
      },
    ],
    Notifications: [],
  });

  const handleActive = (buttonName) => {
    setActiveButton(buttonName);
  };

  const showModal = () => {
    setModalVisible(true);
  };
  const handleCancel = () => {
    setModalVisible(false);
  };

  const renderScheduleContent = () => (
    <div className="bg-white rounded-lg shadow-xl border p-6 mt-3">
      {/* the following is for days schedule */}

      <h1 className="text-black text-lg font-semibold ">
        {" "}
        Schedule Management
      </h1>
      <div className="bg-white rounded-lg shadow-xl border p-6 mt-3">
        <h1 className="text-black text-lg">Schedule Appointment</h1>
        {/* days */}

        <div className="flex flex-row gap-4 m-3">
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            Monday
          </button>
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            Tuesday
          </button>
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            Wednesday
          </button>
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            Thursday
          </button>
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            Friday
          </button>
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            Saturday
          </button>
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            Sunday
          </button>
        </div>
        <h1 className=" text-black text-lg"> Available Time Slot</h1>
        {/* time slots */}
        <div className="flex flex-row gap-4 m-3">
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            09:00 - 10:00
          </button>
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            10:00 - 11:00
          </button>
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            11:00 - 12:00
          </button>
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            12:00 - 13:00
          </button>
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            13:00 - 14:00
          </button>
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            14:00 - 15:00
          </button>
          <button className="border-2 border-gray-200 text-black p-2 rounded-md">
            15:00 - 16:00
          </button>
        </div>
      </div>

      {/* This is schedule of the Day */}
      <h1 className="text-black text-lg font-semibold mt-10">
        Today's Schedule
      </h1>
      {appointmentData.Schedule.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-lg flex flex-row justify-between border-2 p-6 mt-3"
        >
          <div className="ml-2">
            <p className="text-black text-sm font-semibold flex flex-row gap-2">
              <FaUser size={23} /> {item.name} - {item.session}
            </p>
            <p className="text-gray-500 text-sm">{item.type}</p>
            <input
              type="time"
              className="w-full p-1 border rounded text-black my-2"
              value={item.time}
              onChange={(e) => {
                const updatedData = [...appointmentData.Schedule];
                updatedData[index].time = e.target.value;
                setAppointmentData((prev) => ({
                  ...prev,
                  Schedule: updatedData,
                }));
              }}
            />
            <p className="text-black text-sm flex flex-row my-2"><BiTime size={18}/>Duration: {item.duration}</p>
            <div className="my-2">
              <button className="text-white text-sm bg-purple-700 p-1 rounded">
                ReSchedule
              </button>
              <button className="text-white text-sm bg-red-500 m-1 p-1 rounded ml-2">
                Cancel
              </button>
              <button className="text-white text-sm bg-gray-500 m-1 p-1 rounded">
                Remainder
              </button>
            </div>
          </div>
          <p
            className={`text-green-900 italic m-5 p-2 ${
              item.status === "confirmed" ? "text-green-500" : "text-orange-500"
            }`}
          >
            {item.status}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      {/* Button selection */}
      <div className="flex flex-row gap-9">
        {[
          "Schedule",
          "My Appointments",
          "Notifications",
        ].map((buttonName) => (
          <button
            key={buttonName}
            className={`text-xl font-semibold p-2 rounded-md ${
              activeButton === buttonName
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => handleActive(buttonName)}
          >
            {buttonName}
          </button>
        ))}
      </div>

      {/* Conditional content based on active button */}
      {activeButton === "Schedule" && renderScheduleContent()}

      {activeButton === "My Appointments" && (
        <div className="bg-white rounded-lg shadow-xl p-6 mt-3">
          <div className="flex flex-row justify-between">
            <h1 className="text-black text-lg font-semibold">
              List of All My Appointments
            </h1>
            <button className="bg-purple-700 text-md text-white p-2 rounded flex flex-row gap-1 mb-3" onClick={showModal}>
              <FaCalendar size={20} /> create new Appointment
            </button>
          </div>


            {/* List of all appointments */}
            {appointmentData.MyAppointments.map((item, index) => (
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
                      const updatedData = [...appointmentData.MyAppointments];
                      updatedData[index].time = e.target.value;
                      setAppointmentData((prev) => ({
                        ...prev,
                        MyAppointments: updatedData,
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
        // </div>
      )}

       <Modal open={modalVisible} footer={null} onCancel={handleCancel}>
        <div className="bg-white w-full  p-6 mt-3 text-black">
          <h1 className="text-black text-lg font-semibold my-2 text-center">
            Create New Appointment
          </h1>
          {/* Form for creating new appointment */}
          <label htmlFor="name" className="font-semibold">
            Patient Name
          </label>
          <br />
          <input
            type="text"
            id="name"
            placeholder="Enter Patient Name"
            className="w-full p-1 my-2 border rounded"
          />
          <br />
          <br />
          <label htmlFor="date" className="font-semibold">
            Date
          </label>
          <br />
          <input
            type="date"
            id="date"
            className="w-full p-1 my-1 border rounded"
          />
          <br />
          <br />
          <label htmlFor="StartTime" className="font-semibold">
            Start Time
          </label>
          <br />
          <input
            type="time"
            id="StartTime"
            className="w-full p-1 my-1 border rounded"
          />
          <br />
          <br />
          <label htmlFor="EndTime" className="font-semibold">
            End Time
          </label>
          <br />
          <input
            type="time"
            id="EndTime"
            className="w-full p-1 my-1 border rounded"
          /> <br /> <br />
          <label htmlFor="type" className="font-semibold">
            Appointment Type
          </label>
          <br />
          <select id="type" className="w-full p-1 my-1 border rounded">
            <option value="General checkup">General checkup</option>
            <option value="Routine checkup">Routine checkup</option>
            <option value="Follow-up checkup">Follow-up checkup</option>
            <option value="Physical therapy">Physical therapy</option>
          </select>
          <br />
          <br />
          <label htmlFor="duration" className="font-semibold">
            Duration
          </label>
          <br />
          <input
            type="number"
            id="duration"
            className="w-full p-1 my-1 border rounded"
            placeholder="Minutes"
          />
          <br />
          <br />
          <label htmlFor="notes" className="font-semibold">
            Notes(info)
          </label>
          <br />
          <textarea
            id="notes"
            placeholder="Text information here ...."
            className="w-full p-1 my-1 border rounded"
            rows="3"
          />
          <br />
          
          <button className="text-white text-sm bg-gray-500 p-1 rounded">
            Cancel
          </button>
          <button className="text-white text-sm bg-purple-700 p-1 mx-2 rounded">
           Create Appointment
          </button>
          
        </div>
        </Modal>

      {activeButton === "Notifications" && (
        <div className="bg-white rounded-lg shadow-xl border p-6 mt-3">
          <h1 className="text-black text-lg font-semibold">Notifications</h1>
          <p>No notifications at the moment.</p>
        </div>
      )}
    </div>
  );
}
