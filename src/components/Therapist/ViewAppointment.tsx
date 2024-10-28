import { useEffect, useState } from "react";
import { FaUser, FaCalendar } from "react-icons/fa";
import { BiTime } from 'react-icons/bi';
import { useSelector,useDispatch } from "react-redux";
import { Modal,Form ,Input,Button,Select, message} from "antd";
import { CreateAppointment } from "../../Redux/TherapistSlice/Appointment";
import { getPatientById } from "../../Redux/Adminslice/PatientSlice";
import { fetchTherapy } from "../../Redux/Adminslice/ThearpySlice";




export default function AppointmentList() {
  const [activeButton, setActiveButton] = useState("Schedule");
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch=useDispatch();
  const [form] = Form.useForm();
  const [name,setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [typeApp, setTypeApp] = useState("");
  const [statusApp, setStatusApp] = useState("Scheduled");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
// These are used in useEffect hooks but not defined
const [patientId, setPatientId] = useState(null);
const [therapistId, setTherapistId] = useState(null);

  const{status,error}=useSelector((state)=>({
    status: state.appointment.status,
    error: state.appointment.error,
  }));

    // Add useEffect to handle status changes
  useEffect(()=>{
    if(status==='succeeded'){
      message.success("Appointment successfully");
      setModalVisible(false);
      form. resetFields();
    }
    else if(status==='rejected'&& error){
      message.error("Failed to schedule appointment: "+error);
     
    }
  },[status, error, form]);

// useEffect for handling patient data


  useEffect(()=>{
    if(patientId){
      const fetchAppData =async()=>{
        try{
       const result=await dispatch(getPatientById(patientId));
       if(getPatientById.fulfilled.match(result)){
        const userData = result.payload;
        form.setFieldsValue({
          name: userData.name,
        });
       }
        }
        catch(error){
          message.error("Failed to get patient data: "+error);
        }
  };
  fetchAppData();
}
},[dispatch, form]);

// the following Effect is for getting the therapist

  useEffect(()=>{
    if(therapistId){
      const featchTherapy=async()=>{
        try{
       const result=await dispatch(fetchTherapy(therapistId));
       if(fetchTherapy.fulfilled.match(result)){
        const therapyData = result.payload;
        form.setFieldsValue({
        typeApp: therapyData.type,
        duration: therapyData.duration,
        });
       }
      }
       catch(error){
          message.error("Failed to get therapist data: "+error);
        }
    }
    featchTherapy();
  }},[dispatch,form]);


  const [appointmentData, setAppointmentData] = useState({
    Schedule: [
      {
        name: "John Doe",
        session: "Therapy Session",
        type: "General checkup",
        time: "09:00",
        duration: "30 minutes",
        statusApp: "confirmed",
      },
      {
        name: "Placide Ikundabayo",
        session: "General checkup",
        type: "General checkup",
        time: "11:00",
        duration: "30 minutes",
        statusApp: "pending",
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
        statusApp: "completed",
      },
      {
        id: 2,
        date: "oct 29 2024",
        time: "10:00",
        duration: "45 minutes",
        patient: "Jane Smith",
        therapist: "Bob Johnson",
        statusApp: "Pending",
      },
      {
        id: 3,
        date: "oct 30 2024",
        time: "11:00",
        duration: "60 minutes",
        patient: "Alice Johnson",
        therapist: "Bob Johnson",
        statusApp: "waiting",
      },
      {
        id: 4,
        date: "oct 31 2024",
        time: "12:00",
        duration: "45 minutes",
        patient: "Bob Johnson",
        therapist: "Alice Johnson",
        statusApp: "canceled",
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
    form.resetFields();
    dispatch(resetStatus());
  };
  const handleResert=()=>{
    form.resetFields();
    dispatch(resetStatus());
  }
// function to handle form submission

const handleSubmit=async()=>{
  // handle form submission logic here

  try{
  const AppointmentData={
  
    therapistId:therapistId,
    patientId: patientId,
    name: name,
    date: date,
    startTime: startTime,
    endTime: endTime,
    appointmentType:typeApp,
    statusApp: statusApp,
    duration:parseInt(duration),
    location: location || 'DefaultLocation',
    notes: notes,
  };
    console.log("that is data to be submitted", AppointmentData);
    const result=await dispatch(CreateAppointment(AppointmentData));
    console.log("Server Patient response:", result);
}
  catch(error){
    message.error("Failed to create Appointment: " + error.message);
    form.resetFields();
  }
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
              item.statusApp === "confirmed" ? "text-green-500" : "text-orange-500"
            }`}
          >
            {item.statusApp}
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
        // </div>
      )}

<Modal open={modalVisible} footer={null} onCancel={handleCancel} >
  <Form form={form} className="bg-white rounded p-6"
  layout="vertical" onFinish={handleSubmit}>
    <h1 className="text-black text-lg font-semibold my-2 text-center">
      Create New Appointment
    </h1>
    <div className="grid grid-cols-2 gap-2">
    <Form.Item
      label="Patient Name"
      name="name"
      // rules={[{ required: true, message: "Please enter the patient's name" }]}
    > 
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Patient Name"
        className="w-full p-1 border rounded "
      />
    </Form.Item>

    <Form.Item
      label="Date"
      name="date"
      // rules={[{ required: true, message: "Please select a date" }]}
    >
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-1  border rounded"
      />
    </Form.Item>

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

    <Form.Item
      label="Appointment Type"
      name="type"
      // rules={[{ required: true, message: "Please select an appointment type" }]}
    >
      <Select
        value={typeApp}
        onChange={(value) => setTypeApp(value)}
        className="w-full p-1  rounded"
      >
        <Select.Option value="General checkup">General checkup</Select.Option>
        <Select.Option value="Routine checkup">Routine checkup</Select.Option>
        <Select.Option value="Follow-up checkup">Follow-up checkup</Select.Option>
        <Select.Option value="Physical therapy">Physical therapy</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      label="Status"
      name="statusApp"
      // rules={[{ required: true, message: "Please select a status" }]}
    >
      <Select
        value={statusApp}
        onChange={(value) => setStatusApp(value)}
        className="w-full p-1  rounded"
      >
        <Select.Option value="scheduled">Scheduled</Select.Option>
        <Select.Option value="completed">Completed</Select.Option>
        <Select.Option value="waiting">Waiting</Select.Option>
        <Select.Option value="pending">Pending</Select.Option>
        <Select.Option value="canceled">Canceled</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      label="Duration (Minutes)"
      name="duration"
      // rules={[{ required: true, message: "Please specify duration in minutes" }]}
    >
      <Input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="w-full p-1 border rounded"
        placeholder="Minutes"
      />
    </Form.Item>
    <Form.Item
      label="location (place)"
      name="location"
      // rules={[{ required: true, message: "Please specify duration in minutes" }]}
    >
      <Input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-1 border rounded"
        placeholder="place"
      />
    </Form.Item>
    </div>
    <Form.Item label="Notes" name="notes">
      <Input.TextArea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Text information here ...."
        className="w-full p-1 border rounded"
        rows={3}
      />
    </Form.Item>

    <Form.Item className="text-right">
    <Button
        className="text-sm bg-transparent border-red-500 text-black p-1 rounded mr-2 hover:bg-blue-400"
        onClick={handleResert}
      >
        Resert
      </Button>
      <Button
        className="text-black text-sm bg-transparent border-gray-500 p-1 rounded mr-2"
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button
  type="primary"
  htmlType="submit"
  loading={status === "loading"}
  disabled={status==="loading"}
>
  {status === "loading" ? "Creating..." : "Create Appointment"}
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
