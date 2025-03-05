import { Button, Input,Modal,Select,Spin,Form,DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FaUser,FaMapMarkerAlt ,FaFile } from "react-icons/fa";
import { BiTime } from "react-icons/bi";
import { Calendar } from 'lucide-react';
import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { getAllAppointmnets } from "../../Redux/Adminslice/AllAppointment";
const {Option}=Select;



export default function AllAppointments(){
  const [AppViewModal,setAppViewModal]=useState(false);
  const [loading,setLoading] = useState(false);
  const [selectedApp,setSelectedApp]=useState([]);
  const dispatch=useDispatch();
  const [form] = Form.useForm();
  const {status,data:appointments}=useSelector((state:RootState)=>state.AllAppointment);


  // state for filter 

  const [searchItem,setSearchItem]=useState('');
  const [statusFilter,setStatusFilter]=useState('');
  const [appointmentDate,setAppointmentDate]=useState(null);

useEffect(() => {
  const AllDataAppointment=async()=>{
try{
  setLoading(true);
 await dispatch(getAllAppointmnets());
}
catch(error){
  const errorMessage = (error as Error).message;
  console.error(`Failed to get update all appointments: ${errorMessage}`);
}
finally{
  setLoading(false);
}
}
AllDataAppointment();
},[dispatch]);

  const handleModal=(appointment)=>{
    setSelectedApp(appointment);
    setAppViewModal(true);
  };
  const CancelAppModal=()=>{
    setAppViewModal(false);
    setSelectedApp('');
  };
// this is for converting date inf proper form
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: '2-digit',
  });
};

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
  });
};
  // Function that will help us to filter

  const filteredAppointments = appointments?.filter(item => {
    const patientFirstName=item?.patient?.user?.firstName || '';
    const therapistName=item?.therapist?.personalInformation?.name || '';
    const patientLastName=item?.patient?.user?.lastName || '';
    const appointmentStatus=item?.status || '';
    const appointmentStartTime=item?.startTime? new Date(item?.startTime):null;

    const matchesSearch =
      !searchItem ||
      patientFirstName.toLowerCase().includes(searchItem.toLowerCase()) ||
      patientLastName.toLowerCase().includes(searchItem.toLowerCase()) ||
      therapistName.toLowerCase().includes(searchItem.toLowerCase()); 
  
    const matchesStatus =
      statusFilter ===''|| appointmentStatus.toLowerCase()=== statusFilter.toLowerCase();
  
    const matchesDate =
      !appointmentDate ||
      (appointmentStartTime && appointmentStartTime.toDateString()===appointmentDate.toDate().toDateString());
      item.startTime.includes(appointmentDate);
  
    return matchesStatus && matchesDate && matchesSearch;
  }) || [];

  return(
      <div className="p-2 ml-4 bg-white rounded">
          <h4 className="text-purple-600 text-3xl font-semibold p-3">
            Appointments Management Dashboard
          </h4>
          {loading|| status==='loading' ? (
        <div className="flex items-center justify-center text-red-600 min-h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
           <div className="flex gap-2 my-4 mx-2">
            <Input type="text" placeholder="Search Patient Or Therapist"
            className="focus:outline-none focus:ring-2 w-96 p-1"
            value={searchItem}
            onChange={(e)=>setSearchItem(e.target.value)}
            />
            <div className="relative">
            <DatePicker type="text" placeholder="Select Appointment Date"
            className="w-96 p-1"
            value={appointmentDate}
            onChange={(date)=>setAppointmentDate(date)}
            // format="yyyy-MM-dd"
            />
            </div>
            <Select defaultValue="Filter By Status" className="w-96 "
            value={statusFilter}
            onChange={(value)=>setStatusFilter(value)}
            >
              <Option value="">Filter By Status</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Scheduled">Scheduled</Option>
              <Option value="Canceled">Cancelled</Option>
            </Select>
           </div>
        <div className="overflow-x-auto">
        <table className="w-full border-collapse">
       <thead>
        <tr className="text-purple-600 text-sm mb-2  font-semibold text-left">
        <th>N0</th>
        <th>Patient Name</th>
        <th>Therapist Name</th>
        <th>Appointment Date</th>
        <th>Appointment Time</th>
        <th>Location</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
       </thead>
       <tbody>
       {filteredAppointments.map((item,index) => (
        <tr key={item.id} className="text-black my-2">
          <td className="my-5 py-2">{index+1}</td>
          <td className="my-5 py-2">{item.patient.user.firstName}</td>
          <td className="my-5 py-2">{item.therapist.personalInformation.name}</td>
          <td className="my-5 py-2">{formatDate(item.startTime)}</td>
          <td className="my-5 py-2">{formatTime(item.endTime)}</td>
          <td className="my-5 py-2">{item.location}</td>
          <td   className={`italic m-5 p-2 ${item?.status === "Scheduled"? "text-blue-600": item?.status === "Rescheduled"? "text-green-500": item?.status === "Canceled"? "text-red-700": ""}`}>{item.status}</td>
          <td className="my-5 py-2">
            <Button onClick={()=>handleModal(item)}>View Details</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</>)}
{setSelectedApp &&(
<Modal open={AppViewModal} onCancel={CancelAppModal} footer={null} title="MORE APPOINTMENT DETAILS">
<Form
form={form}
layout="vertical"
><hr />
  <div className="flex justify-between my-3">
   <strong className="text-lg">Names: <strong >
    {`${selectedApp.patient?.user?.firstName || ''} ${selectedApp.patient?.user?.lastName || ''}`}</strong>
 </strong>

 <td   className={`italic  p-2 ${selectedApp?.status === "Scheduled"? "text-blue-600": selectedApp?.status === "Rescheduled"? "text-green-500": selectedApp?.status === "Canceled"? "text-red-700": ""}`}>{selectedApp.status}</td>
  </div>
  <p className="text-xl">Therapy Name: <strong className=" text-xl">
   {selectedApp.therapist?.personalInformation?.name}</strong></p>
<div className="grid grid-cols-2 my-3 gap-3 ">
 <div className="flex gap-3 mt-3 ">
  <Calendar size={30}  color="blue" className="mt-2"/>
  <div>
  <strong className="text-lg">Date</strong> <br />
    <p className="text-lg">{formatDate(selectedApp.startTime)}</p>
  </div>
</div>
<div className="flex gap-2 mt-3 justify-end">
  <BiTime size={30} color="blue" className="mt-2"/>
  <div>
  <strong className="text-lg">Time</strong><br />
    <p className="text-lg">{formatTime(selectedApp.endTime)}</p>
  </div>
</div>
<div className="flex gap-2 mt-3">
  <FaUser size={30} color="blue" className="mt-2"/>
  <div>
  <strong className="text-lg">User</strong> <br />
    <p className="text-lg">{selectedApp.therapist?.personalInformation?.name}</p>
  </div>
</div>
<div className="flex mt-3 gap-2 justify-end mr-3">
  <FaFile size={30} color="blue" className="mt-2"/>
  <div>
  <strong className="text-lg">Specials</strong><br />
  <p className="text-lg">{selectedApp.appointmentType}</p>
  </div>
</div>
<div className="flex mt-3 gap-2 ">
  <FaMapMarkerAlt  size={30} color="blue" className="mt-2"/>
  <div>
  <strong className="text-lg">Location</strong><br />
    <p className="text-lg">{selectedApp.location}</p>
  </div>
</div>
</div>
<strong className="text-lg">Notes:</strong>
<Form.Item>
  <TextArea className="w-full text-black text-xl capitalize" readOnly value={selectedApp.notes} />
</Form.Item>


</Form>
  
</Modal>
)}
</div>
  )
}