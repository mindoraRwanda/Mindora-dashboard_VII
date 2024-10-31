import { useEffect, useState } from "react";
import { FaUser, FaCalendar } from "react-icons/fa";
import { BiTime } from 'react-icons/bi';
import { useSelector,useDispatch } from "react-redux";
import { Modal,Form ,Input,Button,Select, message, Switch} from "antd";
import { RootState } from "../../Redux/store";
import PatientsList from "../Therapist/PatientsList";
import { resetStatus } from "../../Redux/TherapistSlice/Appointment_Slot";

import { createAvailableSlot, getAvailableSlot } from "../../Redux/TherapistSlice/Appointment_Slot";

export default function AppointmentList() {
  const [activeButton, setActiveButton] = useState("AllPatients");
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch=useDispatch();
  const [form] = Form.useForm();

  const [availableDay, setavailableDay] =useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [timeZone,setTimezone] = useState('');
  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");
  const [therapistId, setTherapistId] = useState('');
  const [formData, setFormData] = useState({recurring: false});
 

  const { status, error } = useSelector((state: RootState) => ({
    status: state.availableSlot?.status,
    error: state.availableSlot?.error,
  }));

  // Add useEffect to handle status changes
  useEffect(() => {
    if (status === 'succeeded') {
      message.success("Appointment slot successfully created");
      setModalVisible(false);
      form.resetFields();
      dispatch(resetStatus());
    } else if (status === 'rejected' && error) {
      message.error(error || "Failed to create appointment");
      dispatch(resetStatus());
    }
  }, [status, error, form, dispatch]);
  
  

   //  useEffect to get TherapistId from localStorage when component mounts
   useEffect(() => {
    const storedTherapistId = localStorage.getItem('TherapistId');
    if (storedTherapistId) {
      console.log("Retrieved Therapist LoggedIn ID:", storedTherapistId);
      setTherapistId(storedTherapistId);
      form.setFieldsValue({
        TherapistId: storedTherapistId,
      });
    }
  }, [form]);
  

  const [appointmentData, setAppointmentData] = useState({
  AllPatients:[],
    Schedule: [],
    // Placeholder for other button data
    MyAppointments: [
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
    form.resetFields();
    dispatch(resetStatus());
  };
// function to handle form submission
const handleSubmit = async (values) => {
  try {
  

    const appointmentData = {
      therapistId,
      startTime: new Date(`${values.date}T${values.startTime}`).toISOString(), 
      endTime: new Date(`${values.date}T${values.endTime}`).toISOString(),
      recurring: values.recurring || formData.recurring,
      date: values.date,
      availableDay: values.availableDay,
      timeZone: values.timeZone,
    };

    await dispatch(createAvailableSlot(appointmentData));
    if (status === 'succeeded') {
      dispatch(getAvailableSlot());  // Refresh the list after successful creation
  } 
  } catch (error) {
    message.error("Failed to create appointment: " + error.message);
  }
};
  const renderScheduleContent = () => (
    <div className="bg-white rounded-lg shadow-xl border p-6 mt-3">
      <div className="flex flex-row justify-between">
      <h1 className="text-2xl capitalize text-black font-semibold">Appointment Availlable Slots </h1>
      <button className="bg-purple-600 text-white p-2 rounded font-semibold flex flex-row gap-2" onClick={showModal}><FaCalendar size={20} />Add New Slot</button>
      </div>
    <div className="bg-white rounded-lg shadow-xl border p-6 mt-3">
      <h1 className="text-black">No appointment availlable</h1>
      </div>
  </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      {/* Button selection */}
      <div className="flex flex-row gap-9">
        {[ "AllPatients",
          "Availlable Slots",
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
    {activeButton === "AllPatients" && <PatientsList/>}
      {/* Conditional content based on active button */}
      {activeButton === "Availlable Slots" && renderScheduleContent()}

      {activeButton === "My Appointments" && (
        <div className="bg-white rounded-lg shadow-xl p-6 mt-3">
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
       
      )}

<Modal open={modalVisible} footer={null} onCancel={handleCancel} >
  <Form form={form} className="bg-white rounded p-6"
  layout="vertical" onFinish={handleSubmit}>
    <h1 className="text-black text-lg font-semibold my-2 text-center">
      Create New Appointment Slot
    </h1>
  
    <Form.Item
  label="TherapyId"
  name="TherapistId"
>
  <Input
    type="text"
    value={therapistId} 
    readOnly
    className="w-full p-1 border rounded text-black bg-red-100"
  />
</Form.Item>

   <Form.Item
   label="Availlable Day"
   name="availableDay"
   // rules={[{ required: true, message: "Please select a day" }]}
    >
      <Select
        value={availableDay}
        onChange={(value) => setavailableDay(value)}
        className="w-full p-1  rounded"
      >
        <Select.Option value="Monday">Monday</Select.Option>
        <Select.Option value="Tuesday">Tuesday</Select.Option>
        <Select.Option value="Wednesday">Wednesday</Select.Option>
        <Select.Option value="Thursday">Thursday</Select.Option>
        <Select.Option value="Friday">Friday</Select.Option>
        <Select.Option value="Saturday">Saturday</Select.Option>
        <Select.Option value="Sunday">Sunday</Select.Option>
      </Select>
    </Form.Item>
<div className="grid grid-cols-2 gap-2">
    <Form.Item
      label="Start Time"
      name="startTime"
      // rules={[{ required: true, message: "Please select a start time" }]}
    >
      <Input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="w-full p-1  border rounded"
      />
    </Form.Item>

    <Form.Item
      label="End Time"
      name="endTime"
      // rules={[{ required: true, message: "Please select an end time" }]}
    >
      <Input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="w-full p-1 border rounded"
      />
    </Form.Item>
    </div>
  <Form.Item
  label="Date"
  name="date"
      // rules={[{ required: true, message: "Please select a date" }]}
      >
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-1 border rounded"
      />
    </Form.Item>
<Form.Item
label="Time Zone"
  name="timeZone"
      // rules={[{ required: true, message: "Please select a timeZone" }]}
      >
      <Select
        value={timeZone}
        onChange={(value) => setTimezone(value)}
        className="w-full p-1  rounded"
      >
        <Select.Option value="Africa/Khartoum">Africa/Khartoum</Select.Option>
        <Select.Option value="America/New_York">America/New_York</Select.Option>
        <Select.Option value="Asia/Kolkata">Asia/Kolkata</Select.Option>
        <Select.Option value="Europe/London">Europe/London</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item name="recurring" valuePropName="checked">
  <Switch checked={formData.recurring} onChange={(checked) => setFormData(prev => ({ ...prev, recurring: checked }))} />
</Form.Item>



  <Form.Item>
  <Button
  className="w-full bg-purple-600 text-white font-semibold"
  htmlType="submit"
  loading={status === 'loading'}
  disabled={status === 'loading'}
>
  {status === 'loading' ? "Creating..." : "Create Slot"}
</Button>

    </Form.Item>
  </Form>
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
