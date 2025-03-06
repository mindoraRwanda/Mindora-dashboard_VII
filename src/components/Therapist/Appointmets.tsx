import {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiTime } from "react-icons/bi";
import { FaRegCalendarAlt, FaUser,FaPhone,FaEnvelope,FaMapMarkerAlt,FaFirstAid, FaBriefcase, FaBriefcaseMedical } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import {
  deleteAppointment,
  getAppointmentById,
  updateAppointments,
} from "../../Redux/TherapistSlice/Appointment";
import { RootState, AppDispatch } from "../../Redux/store";
import { Button, Input, Modal, Select, Spin, Form, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Appointment } from "../../Redux/TherapistSlice/Appointment";
import {getAllAppointmentChanges,Reschedule } from "../../Redux/TherapistSlice/AppointmentChange";
import { createReschedule } from "../../Redux/TherapistSlice/AppointmentChange";
import AppointmentChange from "./Appointment Change";

function Appointments() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeView, setActiveView] = useState("all");
  const [activeButton, setActiveButton] = useState("Personal Information");
  const { appointments } = useSelector((state: RootState) => state.appointment);
  const [selectedPatient,setSelectedPatient]=useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [RescheduleLoading, setRescheduleLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [ProfileModal,setProfileModal] = useState(false);
  const [changedAppointments, setChangedAppointments] = useState<Reschedule[]>([]);
  const [selectedAppointment, setSelectedAppointment] =useState<Appointment | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  useEffect(() => {
    const therapistId = localStorage.getItem("TherapistId");
    if (therapistId) {
      const getAllApp = async () => {
        try {
          setLoading(true);
          await dispatch(getAppointmentById(therapistId));
          const changedResult=await dispatch(getAllAppointmentChanges()).unwrap();
          setChangedAppointments(changedResult);
          setLoading(false);
        } catch (error) {
          message = error.message
          // const errorMessage = (error as Error).message;
          // message.error(`Failed to load appointments: ${errorMessage}`);
        } finally {
          setLoading(false);
        }
      };
      getAllApp();
    }
  }, [dispatch]);

  const getUniquePatients = () => {
    const uniquePatients = new Set(appointments.map((apt) => apt.patientId));
    return Array.from(uniquePatients);
  };


  const getAppointmentRequests = () => {
    return appointments.filter((apt) => apt.status === "Cancelled");
  };
  
  const getDisplayedAppointments = () => {
    switch (activeView) {
         case "requests":
            return getAppointmentRequests();
            case "changed":
         return [{id:'appointment-change',component:<AppointmentChange/>}];
         case "patients":
            { const uniquePatients = getUniquePatients();
            return uniquePatients.map((patientId) => {
                const patientAppointments = appointments.filter(
                    (apt) => apt.patientId === patientId
                );
                return patientAppointments[0];
            }); }
         default:
            return filteredAppointments; 
    }
};
  const handleStatsCardClick = (view: string) => {
    setActiveView(view);
  };
  const filteredAppointments =
    filterStatus === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === filterStatus);

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
  };

  const showEditModal = (appointment: any) => {
    const formatTime = (time: string) =>
      new Date(time).toISOString().substr(11, 5);
    const formattedAppointment = {
      ...appointment,
      startTime: formatTime(appointment.startTime),
      endTime: formatTime(appointment.endTime),
    };
    setSelectedAppointment(appointment);
    form.setFieldsValue(formattedAppointment);
    setModal(true);
  };

  const handleProfileModal= (appointment: any) => {
    console.log("Selected appointment:", appointment);
    setSelectedPatient(appointment);
    setProfileModal(true);
  };

  const handleCancelModal = () => {
    setModal(false);
    form.resetFields();
  };
const handleCanceProfileModal=()=>{
  setProfileModal(false);
};
const handleActiveButton= (buttonName:any) => {
setActiveButton(buttonName);
};

// this is for time format
const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
  });
};

const renderContent=()=>{
  if (!selectedPatient) return <p>No data available</p>;
  switch(activeButton){
    case "Personal Information":
    return(
    <div className="my-2 p-2 rounded-sm border grid grid-cols-2">
      <div>
         <h2 className="flex text-black gap-1 my-2"><FaUser size={20}/> Emergency Name</h2>
         <strong>{selectedPatient.patient?.emergencyContact?.name|| "no emergency name"}</strong>
         </div><div>
      <h2 className="flex text-black gap-1 my-2"><FaPhone size={20}/>  Emergency Contact </h2>
       <strong> {selectedPatient.patient?.emergencyContact?.contact|| "no emergency contact"}</strong></div>
       <div>
      <h2 className="flex text-black gap-1 my-2"><FaEnvelope size={20}/> Emergency Email</h2>
      <strong> {selectedPatient.patient?.emergencyContact?.email|| "no emergency Email"}</strong></div>
      <div>
      <h2 className="flex text-black gap-1 my-2"><FaMapMarkerAlt size={20}/> Address:</h2>
      <strong> {selectedPatient.location|| "no address"}</strong></div>
    </div>);
    case "Medical Informaton":
    return (
      <div className=" my-2 p-2 rounded-sm border">
          <h2 className="flex text-black gap-1 my-2"><FaFirstAid size={20}/> Condition</h2>
          <strong>{selectedPatient.patient?.medicalProfile?.condition || "no medical condition"}</strong>
      </div>
    );
    case "Appointment History":
      return(
        <div className="my-2 p-2 rounded-sm border">
             <h2 className="flex text-black gap-1 my-2"><FaFirstAid size={20}/> Last Visit</h2>
             <strong>{selectedPatient.patient?.medicalProfile?.lastVist || "no Last visit Appear"}</strong>

        </div>
      )
    default:
    return <p>Default View</p>;
  }
};

  const handleUpdateApp = async (values: any) => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const startTimeISO = `${today}T${values.startTime}:00.000Z`;
      const endTimeISO = `${today}T${values.endTime}:00.000Z`;
      const appointmentData = {
        id: selectedAppointment?.id,
        startTime: startTimeISO,
        endTime: endTimeISO,
        location: values.location,
        appointmentType: values.appointmentType,
        status: values.status,
        notes: values.notes,
      } as Appointment;
      await dispatch(updateAppointments(appointmentData));
      message.success("Appointment updated successfully");
      setModal(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to update appointment",error);
    } finally {
      setLoading(false);
    }
  };

  // function to delete appointment
  const handleDelete = async (id:string) => {
    if (!id) {
      message.error('Invalid appointment ID');
      return;
    }
    console.log("selected id to be deleted",id);
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    try {
      setLoading(true);
 
       await dispatch(deleteAppointment(id)).unwrap();
      
      message.success("Appointment deleted successfully");
      setModal(false);
      form.resetFields();
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to delete appointment change: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
// codes for Open Appointment changes

const handleChangeModal=(appointment:Appointment)=>{
  console.log("Selected appointment:", appointment);
  setSelectedAppointment(appointment);
  setRescheduleModal(true);
  const startDate = new Date(appointment.startTime);
  const endDate = new Date(appointment.endTime);
  
  form.setFieldsValue({
    appointmentId: appointment.id,
    newStartTime: startDate.toTimeString().substring(0, 5),
    newEndTime: endDate.toTimeString().substring(0, 5),
    actionTime: new Date().toISOString().substring(0, 16),
    actionBy: localStorage.getItem('UserId'),
    reason: '',
  });
};
// const handleCancleReschedule=()=>{
//   setRescheduleModal(false);
//   form.resetFields();
// };

const handleReschedule=async(values:any)=>{
  try{
    setRescheduleLoading(true);
    if (!selectedAppointment?.id) {
      message.error('No appointment selected for rescheduling');
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const data:Reschedule={
      appointmentId: selectedAppointment.id,
      newStartTime: `${today}T${values.newStartTime}:00.000Z`,
      newEndTime: `${today}T${values.newEndTime}:00.000Z`,
      action:values.action,
      reason:values.reason,
      actionTime: new Date(values.actionTime).toISOString(),
      actionBy: values.actionBy || localStorage.getItem('UserId'),
    };
   const result=await dispatch(createReschedule(data));

    if(createReschedule.fulfilled.match(result)){
      message.success("Appointment rescheduled successfully");
      setRescheduleModal(false);
      form.resetFields();
    }
    else{
      const errorMessage = result.payload instanceof Error 
    ? result.payload.message 
    : 'Failed to reschedule';
  throw new Error(errorMessage);
    }
  }
    catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to reschedule appointment: ${errorMessage}`);
    
  }
  finally{
    setRescheduleLoading(false);
  }
};
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mt-3">
      <div className="w-full bg-purple-600 text-white text-2xl p-3 rounded flex justify-between">
        <h1>Appointments Management - My Appointments</h1>
        <Select
          className="mr-7 rounded-lg bg-white"
          value={filterStatus}
          onChange={handleStatusChange}
        >
          <Select.Option value="all">All Appointment</Select.Option>
          <Select.Option value="Rescheduled">Rescheduled</Select.Option>
          <Select.Option value="Cancelled">Cancelled</Select.Option>
          <Select.Option value="Scheduled">Scheduled</Select.Option>
        </Select>
      </div>


      <div className="grid grid-cols-4 gap-4">
        <Button
          className={`w-full border p-10 rounded my-5 ${
            activeView === "all" ? "border-purple-600" : ""
          }`}
          onClick={() => handleStatsCardClick("all")}
        >
          <h1 className="font-bold text-black text-xl">
            {appointments.length}
          </h1>
          <div className="flex justify-center gap-2">
            <FaRegCalendarAlt size={24} color="black" />
            <h1 className="text-black text-md font-semibold">
              All Appointments
            </h1>
          </div>
        </Button>

        <Button
          className={`w-full border p-10 rounded my-5 ${
            activeView === "requests" ? "border-purple-600" : ""
          }`}
          onClick={() => handleStatsCardClick("requests")}
        >
          <h1 className="font-bold text-black text-xl">
            {getAppointmentRequests().length}
          </h1>
          <div className="flex justify-center gap-2">
            <FaRegCalendarAlt size={24} color="black" />
            <h1 className="text-black text-md font-semibold">
              Appointment Request
            </h1>
          </div>
        </Button>

  
        <Button 
        className={`w-full border p-10 rounded my-5 ${activeView === 'Appointment changed' ? 'border-purple-600' : ''}`}
          onClick={() => handleStatsCardClick('changed')}
        >
          <div className="text-2xl font-bold text-black">
          {changedAppointments.length}
          </div>
          <div className="flex justify-center gap-2">
            <BiTime size={24} color="black" />
            <h1 className="text-md text-black font-semibold">
               Appointment Changed
            </h1>
          </div>
        </Button>

        <Button 
        className={`w-full border p-10 rounded my-5 ${activeView === 'patients' ? 'border-purple-600' : ''}`}
          onClick={() => handleStatsCardClick('patients')}
        >
          <div className="text-2xl font-bold text-black">
            {getUniquePatients().length}
          </div>
          <div className="flex justify-center gap-2">
            <FaUser size={24} color="black" />
            <h1 className="text-md font-semibold text-black">Total Patient</h1>
          </div>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center text-red-600 min-h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <div className="bg-white px-6">
           <h2 className="text-xl font-semibold mb-4">
            {activeView === 'all' && 'All Appointments'}
            {activeView === 'requests' && 'Appointment Requests'}
            {activeView === 'changed'&&'Appointment changed'}
            {activeView === 'patients' && 'Patient List'}
          </h2>
          {getDisplayedAppointments().map((appointment) => (
            appointment.component ?(
              <div key="appointment-change" className="w-full">
              {appointment.component}
            </div>
            ):(
            <div
              key={appointment.id}
              className="bg-white rounded-lg flex flex-row justify-between border-2 p-6 mt-3"
            >
              <div className=" items-start space-x-4">
                <div className="flex gap-2">
                <div className="bg-gray-100 p-3 rounded-full">
                  <img src={appointment.therapist.user.profileImage}
                  alt="UserProfile"
                  className="object-cover w-12 h-12 rounded-full" 
                  width={120}
                  height={120} 
                  />
                </div>
                <div>
                  <h3 className="text-black mb-2 mt-2 font-semibold">
                  {`${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`}
                  </h3>
                  <p className="text-black capitalize">{appointment.patient.personalInformation.gender}</p>
                  </div>
                  </div>
                  <hr className="text-black w-full m-4" />
                  <div>
                  
                  <div className="space-x-2 mt-1 grid grid-cols-2">
                  <p className="text-md ml-2 text-gray-700 flex gap-2">
                    <FaBriefcaseMedical size={24} color="blue" className="mt-4"/>
                    <div className="text-md">
                    <p className="text-lg">condition</p>
                    <strong>{appointment.appointmentType}</strong>
                    </div>
                  </p>
                    <span className="flex gap-1 text-md my-3 text-gray-700">
                      <MdLocationOn size={25} color="blue" className="mt-4" />
                      <div className="text-md">
                      <p className="text-lg">Location</p>
                     <strong>{appointment.location}</strong> </div>
                    </span>
                    <span className="flex gap-1 text-md text-gray-700">
                      <BiTime size={25} color="blue" className="mt-3" />
                      <div className="text-md">
                      <p className="text-lg">Start Time</p>
                      <strong>{formatTime(appointment.startTime)}</strong></div>
                    </span>
                    <span className="flex gap-1 text-md text-gray-700">
                      <BiTime size={25} color="blue" className="mt-3" />
                      <div className="text-md">
                      <p className="text-lg">End Time</p>
                      <strong>{formatTime(appointment.endTime)}</strong></div>
                    </span>
                  </div>
                  <p className="text-2xl my-5 mx-3 capitalize text-gray-800">
                    Notes: {appointment.notes}
                  </p>
                  <Button
                    className="p-3 bg-purple-600 my-2 text-white hover:bg-purple-800 text-lg"
                    onClick={() => showEditModal(appointment)}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update"}
                  </Button>
                  <Button
                    className="p-3 bg-purple-600 my-2 mx-2 text-white hover:bg-purple-800 text-lg"
                    onClick={()=>handleChangeModal(appointment)}
                    disabled={loading}
                  >
                    {loading ? "Reschedule..." : "Reschedule"}
                  </Button>
                
                  <Button
                    className="p-3 bg-red-600 text-white hover:bg-red-800 text-lg mr-1  "
                    onClick={()=>handleDelete(appointment.id)}
                  >
                    Delete
                  </Button>
                  <Button type="primary"
                  onClick={()=>handleProfileModal(appointment)}
                  disabled={loading}>
                  {loading?"Loading...":"View Profile"}
                  </Button>
                </div>
              </div>
              <div className={`italic m-5 p-2 ${appointment?.status === "Scheduled"? "text-blue-600": appointment?.status === "Rescheduled"? "text-green-500": appointment?.status === "canceled" ? "text-red-700": ""}`}>{appointment?.status}
              </div>
            </div>
            )
          ))}
        </div>
      )}

      <Modal
        open={modal}
        onCancel={handleCancelModal}
        footer={null}
        title="Update Appointment"
        >
        <Form
          form={form}
          className="bg-white rounded-lg shadow-xl p-6"
          layout="vertical"
          onFinish={handleUpdateApp}
         >
          <div className="grid grid-cols-2 gap-1">
            <Form.Item name="location" label="Location">
              <Input className="p-2" />
            </Form.Item>
            <Form.Item name="appointmentType" label="Appointment Type">
              <Input className="p-2" />
            </Form.Item>
            <Form.Item name="startTime" label="Start Time">
              <Input className="p-2" type="time" />
            </Form.Item>
            <Form.Item name="endTime" label="End Time">
              <Input className="p-2" type="time" />
            </Form.Item>
          </div>
          <Form.Item name="notes" label="Notes">
            <TextArea className="p-2 rounded-md" />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
              <Select.Option value="Scheduled">Scheduled</Select.Option>
              <Select.Option value="Rescheduled">Rescheduled</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-purple-600 text-white w-full"
              loading={loading}
            >
              Update Appointment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    {/* Modal for appointment change */}
    <Modal
      open={rescheduleModal}
      onCancel={()=>{setRescheduleModal(false);form.resetFields()}}
      footer={null}
      title="Reschedule Appointment">
      <Form
        form={form}
        className="bg-white rounded-lg shadow-xl p-6"
        layout="vertical"
        onFinish={handleReschedule}
      >
        <Form.Item name="appointmentId" label="Appointment ID" hidden>
          <Input className="p-1 rounded" disabled />
        </Form.Item>
     

        <div className="grid grid-cols-2 gap-2">
          <Form.Item name="newStartTime" label="New Start Time">
            <Input className="p-1" type="time" />
          </Form.Item>
          
          <Form.Item name="newEndTime" label="New End Time">
            <Input className="p-1" type="time" />
          </Form.Item>
         
          <Form.Item name="action" label="Action" initialValue="Rescheduled">
            <Select>
              <Select.Option value="Rescheduled">Rescheduled</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="actionBy" label="Action By" hidden>
            <Input className="p-1 rounded-md text-black" disabled />
          </Form.Item>
      

        <Form.Item name="actionTime" label="Action Time">
          <Input className="p-1" type="datetime-local" />
        </Form.Item>
        </div>
        <Form.Item name="reason" label="Reason">
          <TextArea className="p-2 rounded-md" />
        </Form.Item>
        
        <Button
          type="primary"
          htmlType="submit"
          className="bg-purple-600 text-white w-full"
          disabled={RescheduleLoading}
        >
          {RescheduleLoading ? "Rescheduling..." : "Reschedule appointment"}
        </Button>
      </Form>
    </Modal>

  {/* Modal to display medical profile of patient */}
  <Modal
  open={ProfileModal}
  footer={null}
  onCancel={handleCanceProfileModal}
  >
 {selectedPatient && selectedPatient.patient && (
    <div>
      <div  className=" flex justify-center  ">
        <div  className=" p-6 flex justify-center border rounded-full">
        <img src={selectedPatient.therapist.user.profileImage}
                  alt="UserProfile"
                  className="object-cover w-12 h-12 rounded-full" 
                  width={120}
                  height={120} 
                  />
      </div>
      </div>
      <strong className="text-black text-xl flex justify-center">
        {`${selectedPatient.patient.user.firstName} ${selectedPatient.patient.user.lastName}`}
      </strong>
      <div className="flex flex-row gap-9 bg-gray-200 rounded-sm p-1 mt-2">
        {['Personal Information','Medical Informaton','Appointment History'].map((buttonName)=>(
          <button
            key={buttonName}
            className={`flex  text-md text-white m-1 bg-purple-500 rounded ${activeButton === buttonName? 'text-black' : ''}`}
            onClick={()=>handleActiveButton(buttonName)}
          >
            {buttonName}
          </button>
        ))}

      </div>
      {renderContent()}
    </div>
   
  )}

  </Modal>
    </div>
  );
}

export default Appointments;
