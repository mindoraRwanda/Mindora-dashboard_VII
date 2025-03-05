import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createPrescription, deletePrescription, fetchAllPrescription, updatePrescription, } from '../../Redux/TherapistSlice/MedicationPrescription';
import { Button, DatePicker,Form,Input, Modal, Select, Spin,message } from 'antd';
import { Search } from 'lucide-react';
import TextArea from 'antd/es/input/TextArea';
import { getAllMedication } from '../../Redux/TherapistSlice/MedicationSlice';
import { getAllPatientOfTherapy } from '../../Redux/Adminslice/PatientSlice';
import dayjs from 'dayjs';
import { BiPlus } from 'react-icons/bi';

export default function Prescription() {
  const medicaPredictions=useSelector((state:RootState)=>state.MedicationPrescription.data);
  const statusPre=useSelector((state:RootState)=>state.MedicationPrescription.status);
  const medicals=useSelector((state:RootState)=>state.Medication.data);
  const specificPatients=useSelector((state:RootState)=>state.patients.Patient);

  const [showPrescription,setShowPrescription]=useState(false);
  const [currentPrescriptionId, setCurrentPrescriptionId] = useState(null);
  const dispatch=useDispatch();
  const [form] = Form.useForm();

// this is for converting date inf proper form
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: '2-digit',
  });
};
//to get patient information for therapist
useEffect(()=>{
  dispatch(getAllPatientOfTherapy());
},[dispatch]);

// This is for getting all medications
useEffect(() => {
dispatch(getAllMedication());
},[dispatch]);
  // These are for Medication Prescriptions
// useEffect for fetching all prescription
useEffect(()=>{
  dispatch(fetchAllPrescription());
},[dispatch]) 


// Function to create prescription
const handleCreatePrescription=async()=>{
  const therapistId=localStorage.getItem('TherapistId');
  try{
    const values=await form.validateFields();
    const prescriptionData={
      patientId:"159204fc-2726-428e-ab4f-dc6ef2d91f12",
      therapistId:therapistId,
      medicationId:values.medicationId,
      dosage:values.dosage,
      duration:values.duration,
      startDate:values.startDate,
      endDate:values.endDate,
      status:values.status,
      notes: values.notes,
    };
    console.log('data that is being sent:',prescriptionData);
    const result=await dispatch(createPrescription(prescriptionData));
    if(createPrescription.fulfilled.match(result)){
      message.success("Medication Prescription created successfully!");
      form.resetFields();
      setShowPrescription(false);
      dispatch(fetchAllPrescription());
    }
  }
  catch(error){
    console.log(error.message);
  }
};
// Function to get edit modal
const handleShowPrescription=(id)=>{
  setShowPrescription(true);
  const prescription=medicaPredictions.find((prescription)=>prescription.id===id);
  console.log("Found prescription:", prescription);
  if(prescription){
    form.setFieldsValue({
      medicationId:prescription.medicationId,
      dosage:prescription.dosage,
      duration:prescription.duration,
      startDate: prescription.startDate ? dayjs(prescription.startDate) : null,
      endDate: prescription.endDate ? dayjs(prescription.endDate) : null,
      status: prescription.status,
      notes: prescription.notes,
    });
  }
  else{
    message.error('Prescription not found to update');
  }
  setCurrentPrescriptionId(id);
}
// to update prescription
const handleUpdatePrescription=async(id:string)=>{
  if(!currentPrescriptionId){
    message.error('No prescription selected for update');
    return;
  };
  try{
    const values=await form.validateFields();
    const updatedPrescription={
      id:currentPrescriptionId,
      medicationId:values.medicationId,
      dosage:values.dosage,
      duration:values.duration,
      startDate:values.startDate,
      endDate:values.endDate,
      status:values.status,
      notes: values.notes,
    };
    console.log('data that is being sent:',updatedPrescription);
    const result=await dispatch(updatePrescription(updatedPrescription));
    if(updatePrescription.fulfilled.match(result)){
      message.success("Medication Prescription updated successfully!");
      form.resetFields();
      setShowPrescription(false);
      setCurrentPrescriptionId(null);
      dispatch(fetchAllPrescription());
    }
  }
  catch(error){
    console.log(error.message);
  }
};
//Function to delete a Prescription
const handleDeletePrescription=(id:string)=>{
  const confirmDelete = window.confirm('Are you sure you want to delete this prescription?');
  if(confirmDelete){
    dispatch(deletePrescription(id));
    message.success('Medication Prescription deleted successfully');
    dispatch(fetchAllPrescription());
}};
  return (
    <div className="bg-white rounded border pt-6 px-2 mt-14">
      <div className='flex gap-1'>
      <div className='w-1/3 p-5'>
      <h1 className="text-black text-2xl font-bold ">
        List of Patient
      </h1>
      <ul className="list-disc pl-6">
      {specificPatients && specificPatients.length > 0 ? (
        specificPatients.map((patients)=>(
          <li key={patients.id} className="border-b py-2">
            <div className="flex gap-4">
              <h3 className="text-gray-600 text-sm">{patients.name}</h3>
              <Button className="p-2 text-white font-semibold bg-blue-600 rounded-md">
                View
              </Button>
            </div>
          </li>
        ))):(
          <p className="text-center text-gray-500">No Patient Found</p>
        )}
      </ul>
      
      </div>
      <div className="w-2/3">
            <div className="flex justify-between gap-5 w-full my-2">
              <h2 className="text-xl font-bold text-black">
                Medication Prescription
              </h2>
              <div className="flex items-center w-1/3  border-r rounded px-2">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full text-lg px-2"
                />
                <Search className="ml-auto" size={30} color="black" />
              </div>

              <Button className="mt-1 p-5 text-white font-semibold bg-purple-600 rounded-md" onClick={()=>setShowPrescription(true)}>
              <BiPlus size={25}/>  Create Prescription
              </Button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-gray-600  ">
                  <th className="p-3 text-left ">ID</th>
                  <th className="p-3 text-left ">Medication Name</th>
                  <th className="p-3 text-left ">Notes</th>
                  <th className="p-3 text-left ">Dosage</th>
                  <th className="p-3 text-left ">Duration</th>
                  <th className="p-3 text-left ">start date</th>
                  <th className="p-3 text-left ">End date</th>
                  <th className="p-3 text-left ">Status</th>
                  <th className="p-3 text-left ">Action</th>
                </tr>
              </thead>
              <tbody>
                {statusPre==='loading'?(
                    <div className="flex items-center justify-center ">
                      <Spin size="large" />
                  </div>
                ):(medicaPredictions.map((prescrition,index)=>(
                <tr className="text-black" key={index}>
                  <td className="p-3">{index+1}</td>
                  <td className="p-3">{prescrition.medication ? prescrition.medication.name : 'N/A'}</td>
                  <td className="p-3">
                    {prescrition.notes}
                   
                  </td>
                  <td className="p-3">{prescrition.dosage}</td>
                  <td className="p-3">{prescrition.duration}</td>
                  <td className="p-3">{formatDate(prescrition.startDate)}</td>
                  <td className="p-3">{formatDate(prescrition.endDate)}</td>
                  <td className="p-3">{prescrition.status}</td>
                  <td className="p-3 flex">
                    <Button className="text-sm font-semibold text-white bg-blue-600 rounded-md p-2" onClick={()=>handleShowPrescription(prescrition.id)}>
                      Edit
                    </Button>
                    <Button className="ml-2 text-sm font-semibold text-white bg-red-600 rounded-md p-2" onClick={()=>handleDeletePrescription(prescrition.id)}>
                      Delete
                    </Button>
                  </td>
                </tr> 
                )))}
              </tbody>
            </table>
          </div></div>
            {/* That is Modal for handling Medication Prescription */}
      <Modal
        open={showPrescription}
        onCancel={() => {setShowPrescription(false);form.resetFields();setCurrentPrescriptionId(null)}}
        footer={null}
        title={currentPrescriptionId ? "Update Medication Prescription":"Create Medication Prescription"}
        >
          <Form form={form} layout="vertical">
            <Form.Item label="Medication" name="medicationId" rules={[{required: true,message: "Please select the medication!"}, ]}>
              <Select
                placeholder="Select medication"
                options={medicals.map((med) => ({
                  value: med.id,
                  label: med.name,
                }))}
              />
            </Form.Item>
            <Form.Item label="Dosage" name="dosage" rules={[{required: true,message: "Please input the medication dosage!"}, ]}>
              <Input />
            </Form.Item><div className="grid grid-cols-2 gap-2 ">
            <Form.Item label="Duration" name="duration" rules={[{required: true,message:"Please input the duration"}, ]}>
              <Input/>
            </Form.Item>
            <Form.Item label="Status" name="status" className="w-full" rules={[{required:true,message: "Please select the status"},]}>
              <Select
                placeholder="Select status"
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                ]}
              />
            </Form.Item>
            
            <Form.Item label="Start Date" name="startDate" className="w-full" rules={[{required: true,message: "Please select the start date"}, ]}>
              <DatePicker />
            </Form.Item>
            <Form.Item label="End Date" name="endDate" className="w-full" rules={[{required: true,message: "Please select the end date"}, ]}>
              <DatePicker />
            </Form.Item>
            
            </div>
            <Form.Item label="Notes" name="notes" rules={[{required: true,message: "Please input the medication notes!"}, ]}>
              <TextArea />
            </Form.Item>
            <Button className="w-full bg-purple-600 text-white p-3" onClick={currentPrescriptionId ? handleUpdatePrescription:handleCreatePrescription}
             loading={statusPre==="loading"} disabled={statusPre==='loading'}
            >
              {currentPrescriptionId? "Update Prescription":"Create Prescrption"}</Button>
          </Form>

        </Modal>
      </div>
  )
}
