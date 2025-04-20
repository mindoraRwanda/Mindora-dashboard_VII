import React, { useEffect, useState } from "react";
import {  BiEditAlt } from "react-icons/bi";
import { MdDelete, MdPictureAsPdf } from "react-icons/md";
import CreatePatient from "../Admin/Create_Patient";
import { FaFileExcel, FaFileWord } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Button, message, Modal, Spin,Form, DatePicker,Checkbox } from "antd";
import moment from 'moment';
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {  Document, Packer, Paragraph, TextRun } from "docx";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { AppDispatch } from "../../Redux/store";
import { Patient } from "../../Redux/Adminslice/PatientSlice";
import {
  allPatients,
  deletePatient,
  PatientsListProps,
  updatePatient,
} from "../../Redux/Adminslice/PatientSlice";
import { createInvoice, deleteInvoice, getAllInvoices, UpdateInvoice } from "../../Redux/TherapistSlice/Invoice";
import { getAllService } from "../../Redux/TherapistSlice/Service";
// We defined type for Patient to optimize operations
export type Patient = {
  id: string|number;
  user: {
    id:string;
    firstName: string;
    email: string;
  };
  personalInformation: {
    age: string;
    gender: string;
  };
  medicalProfile: {
    lastVisit: string;
    condition: string;
  };
  emergencyContact: {
    name: string;
    email: string;
    phoneNumber: string;
  };
};
interface PatientsListProps {
  goToPlan: (patientId: string) => void;
}

export default function PatientsList({ goToPlan }:PatientsListProps) {
const patient = useSelector((state: RootState) => state.patients.patients);
const status = useSelector((state: RootState) => state.patients.status);
const invoiceStatus = useSelector((state: RootState) => state.invoice.status);
const service = useSelector((state: RootState) => state.servicess.services);
const serviceStatus = useSelector((state: RootState) => state.servicess.status);
const invoices=useSelector((state: RootState) => state.invoice.data);
const invoicesStatus = useSelector((state: RootState) =>state.invoice.status);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredPatient, setFilteredPatient] = useState<Patient[]>([]);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible]=useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [ViewPatient,setViewPatient] = useState(null);
  const [EditInvoiceMOdal,setEditInvoiceMOdal] = useState(false);
  const [selectedInvoice,setSelectedInvoice] = useState(null);


  // const [patients, setPatient] = useState<Patient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 4;
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    });
  };

  // This used to get all patient in system
  
  useEffect(() => {
    const getAllPatients=async()=>{
      try {
        setLoading(true);
       await dispatch(allPatients());
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to load users: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
    getAllPatients();
  }, [dispatch]);

  // This used for status change
  useEffect(() => {
    if (status === "succeeded") {
      setFilteredPatient(patient);
    }
  }, [status, patient]);

  const handleEditClick = (patient:Patient) => {
    setSelectedPatient(patient);
    setIsModalVisible(true);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = patient.filter((p: Patient) => 
      p.user?.firstName?.toLowerCase().includes(query.toLowerCase()) ||
       p.user?.email?.toLowerCase().includes(query.toLowerCase())
  ) as Patient[];
  setFilteredPatient(filtered);
  
    setCurrentPage(1);
  };
// this is for pagination
  const paginate = (pageNumber:number) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatient.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const handleDelete = async (patientId:number|string) => {
    const confirmed = window.confirm("Do you want to delete patient ?");
    if (confirmed) {
      try {
       await dispatch(deletePatient(patientId));
        message.success("Patient Deleted successfully");
       await dispatch(allPatients()); // Refresh the patient list
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to load users: ${errorMessage}`);
      }
    }
  };

    // Function to Update the Patient
    const handleUpdate = async (selectedPatient: Patient) => {
      if(selectedPatient){
      const confirmed = window.confirm(
        "Are you sure you want to update this patient?"
      );
      if (confirmed) {
        try {
          const updatePatientData = {
            personalInformation: {
              age: selectedPatient.personalInformation.age,
              gender: selectedPatient.personalInformation.gender,
            },
            medicalProfile: {
              lastVisit: selectedPatient.medicalProfile.lastVisit,
              condition: selectedPatient.medicalProfile.condition,
            },
            emergencyContact: {
              name: selectedPatient.emergencyContact.name,
              email: selectedPatient.emergencyContact.email,
              phoneNumber: selectedPatient.emergencyContact.phoneNumber,
            },
          };
          await dispatch(
            updatePatient({ id: selectedPatient.id, updatePatientData })
          ).unwrap();
          message.success("Patient updated successfully");
          setIsModalVisible(false);
          dispatch(allPatients());
        } catch (error) {
          const errorMessage = (error as Error).message;
          message.error(`Failed to load users: ${errorMessage}`);
        }
      }
    }};

  const handleExportWord = () => {
    const doc = new Document({
      sections: [
        {
          children: currentPatients.map(
            (patient: Patient) =>
              new Paragraph({
                children: [
                  new TextRun(`Name: ${patient.user.firstName}`),
                
                  new TextRun({
                    text: `\nEmail: ${patient.user.email}`,
                    break:2,
                  }),
                  new TextRun({
                    text: `\nGender: ${patient.personalInformation.gender}`,
                    break:2,
                  }),
                  new TextRun({
                    text: `\nLast Visit: ${patient.medicalProfile.lastVisit}`,
                    break:2,
                  }),
                ],
              })
          ),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "Patient_list.docx");
    });
  };

  const handleExportPDF = () => {
    const input = document.getElementById("Patient-table");
    if (!input) return;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, canvas.width / 12, canvas.height / 12);
      pdf.save("Patients_list.pdf");
    });
  };
  
// function to get data in excell
const handleExportExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredPatient);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
  XLSX.writeFile(workbook, "Patients_list.xlsx");
};



  // function to get individual patient information
  const addPatient = (newPatient:Patient) => {
    newPatient.id = patient.length + 1;
    const updatedPatients: Patient[] = [...patient, newPatient as Patient];
    // setPatient(updatedPatients);
    setFilteredPatient(updatedPatients);
    setIsModalVisible(false);
    message.success("New Patient Added Successfully");
  };
// This is here to display all the service are in system 
  useEffect(() =>{
    console.log("Dispatching getAllService"); 
    dispatch(getAllService());
  },[dispatch]);

  // this is for View the MOre about patient information
  const handleView = (patient:Patient) => {
    setViewPatient(prevPatient=>prevPatient?.id === patient.id? null:patient);
    if(patient && patient.user && patient.user.id){
     setSelectedPatient(patient);
     console.log('Fetching Invoices for user:',patient.user.id);
     dispatch(getAllInvoices(patient.user.id));
    }
    console.log('patient data',patient)
   };
  // operations for Invoices
  const handleCreateInvoice=async()=>{
   try{
    const values=await form.validateFields();
    if(!selectedPatient || !selectedPatient.user.id||!selectedPatient.user){
      message.error("User ID is required");
      return;
    }
    else{
      console.log("User Id",selectedPatient?.userId);
    };
    const requestedData={
      userId:selectedPatient.user.id,
      services: values.services,
      dueDate: values.dueDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    };
    console.log('Sending data:', requestedData);
    
    await dispatch(createInvoice(requestedData)).unwrap();
    message.success('invoice generated successfully');
    setIsInvoiceModalVisible(false);
    form.resetFields();
    await dispatch(allPatients());

   }
   catch(error){
    message.error(`Failed to create invoice: ${error}`);
   }
  };
  // function that will be used to delete invoice
  const handleDeleteInvoice =async(id:string)=>{
    const confirm=window.confirm('Are you sure you want to delete');
    if(confirm){
    try{
      await dispatch(deleteInvoice(id));
      message.success('Invoice deleted successfully');
      await dispatch(getAllInvoices());
    }
    catch(error){
      message.error(`Failed to delete invoice: ${error}`);
    }}
  };
  // function to handle Edit Invoice
  const handleEditInvoiceClick=(invoice)=>{
    setEditInvoiceMOdal(true);
    setSelectedInvoice(invoice);
    console.log('The data of selected invoice',invoice);
    console.log('Services:', invoice.services);
  };
  // let's make sure the form is properly reset when the modal closes
  useEffect(() => {
    if (selectedInvoice && EditInvoiceMOdal) {
      form.setFieldsValue({
        dueDate: moment(selectedInvoice.dueDate),
        services: selectedInvoice.services.map(service => service.id)
      });
    }
  }, [selectedInvoice, EditInvoiceMOdal, form]);
  // function to Update Invoice
const handleUpdateInvoice=async()=>{
  try{
    const values=await form.validateFields();
    const updatedInvoice={
      id:selectedInvoice.id,
      userId:selectedInvoice.userId,
      services: values.services,
      dueDate: values.dueDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    };
    console.log('Updating invoice:', updatedInvoice);
    await dispatch(UpdateInvoice(updatedInvoice)).unwrap();
    message.success('Invoice updated successfully');
    setEditInvoiceMOdal(false);
    form.resetFields();
    await dispatch(getAllInvoices());
  }
  catch(error){
    message.error(`Failed to update invoice: ${error}`);
  }
};

  return   loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <Spin size="large" />
    </div>
  ) : (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600"></h2>
    
      </div>
      <div className="flex gap-4 ">
      <div className="items-center border rounded bg-white flex float-right">
          <input
            type="text"
            name="query"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            className="rounded outline-none text-black -m-3 pl-6 "
          />
          <button
            type="submit"
            className="p-2 px-5 text-xl  text-black bg-white rounded-r"
          >
            <FiSearch />
          </button>
        </div>
        <div className="flex ml-auto gap-3 rounded-md mt-4">
          <button
             className="flex items-center space-x-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            onClick={handleExportPDF}
          >
            <MdPictureAsPdf size={20} /> Pdf
          </button>
          <button
            className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            onClick={handleExportExcel}
          >
            <FaFileExcel size={20} /> Excel
          </button>
          <button
            className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={handleExportWord}
          >
            <FaFileWord size={20} /> Word
          </button>
        </div>
      </div>
    
        <table id="Patient-table" className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                phone
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Last Visit
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <div className="text-sm leading-5 font-medium text-gray-900">
                    {patient.user.firstName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <div className="text-sm leading-5 text-gray-900">
                    {patient.user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <div className="text-sm leading-5 text-gray-900">
                    {patient.personalInformation.gender}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <div className="text-sm leading-5 text-gray-900">
                    {patient.personalInformation.age}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <div className="text-sm leading-5 text-gray-900">
                    {patient.medicalProfile.lastVisit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <div className="flex text-sm leading-5 text-gray-900">
                    <Button
                      className="flex mr-2 bg-transparent rounded border-2 border-slate-300 font-semibold  p-1 text-black"
                      onClick={() => handleView(patient)}
                    >
                      View Details
                    </Button>
                    <Button
                      className="flex mr-2 text-blue-700 border-2 border-slate-300 p-1 rounded font-semibold"
                      onClick={() => handleEditClick(patient)}
                    >
                      <BiEditAlt size={25} />
                    </Button>
                    <Button
                      className="flex mr-2 text-red-500 rounded  p-1 border-2 border-slate-300  font-semibold"
                      onClick={() => handleDelete(patient.id)}
                    >
                      <MdDelete size={25} />
                    </Button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <div className="text-sm leading-5 text-gray-900">
                    <button
                      className="bg-purple-600 text-white p-2 rounded font-semibold"
                      onClick={() => goToPlan(patient.id)}
                    >
                      Select To Plan
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         {/* Pagination Controls */}
      <div className="flex justify-end mt-4">
        {Array.from(
          { length: Math.ceil(filteredPatient.length / itemsPerPage) },
          (_, i) => i + 1
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={`px-3 py-1 border ${
              pageNumber === currentPage
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600"
            } mx-1 rounded`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      {invoicesStatus=='loading'?(
        <Spin size="large" className="flex justify-center"/>):
        (
        ViewPatient &&(
            <div className="mt-6 p-6 bg-purple-50 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-purple-600">
                  Patient Details: {ViewPatient.user.firstName}
                </h2>
                <Button 
                  onClick={() => setViewPatient(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Close
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-purple-600 mb-3">Personal Information</h3>
                  <div className="space-y-2 text-black">
                    <p><span className="font-medium">Age:</span> {ViewPatient.personalInformation.age}</p>
                    <p><span className="font-medium">Gender:</span> {ViewPatient.personalInformation.gender}</p>
                  </div>
                </div>
    
                {/* Medical Profile */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-purple-600 mb-3">Medical Profile</h3>
                  <div className="space-y-2 text-black">
                    <p><span className="font-medium">Last Visit:</span> {ViewPatient.medicalProfile.lastVisit}</p>
                    <p><span className="font-medium">Condition:</span> {ViewPatient.medicalProfile.condition}</p>
                  </div>
                </div>
    
                {/* Emergency Contact */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-purple-600 mb-3">Emergency Contact</h3>
                  <div className="space-y-2 text-black">
                    <p><span className="font-medium">Name:</span> {ViewPatient.emergencyContact.name}</p>
                    <p><span className="font-medium">Email:</span> {ViewPatient.emergencyContact.email}</p>
                    <p><span className="font-medium">Phone:</span> {ViewPatient.emergencyContact.phoneNumber}</p>
                  </div>
                </div>
              </div>
              {/* This for Viewing the Patient invoices */}
              <div className="mt-6 p-6 bg-purple-50 rounded-lg shadow-md">
                <div className="flex justify-between mb-2">
                <h2 className="text-lg font-semibold text-black">Patient Invoices</h2>
                  <Button onClick={()=>{setIsInvoiceModalVisible(true); setSelectedPatient(ViewPatient)}}className="bg-purple-600 text-white  p-1 rounded font-semibold">
                    Add Invoice
                  </Button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-gray-600 flex gap-6">
                      <th className="w-1/12 p-3 text-left "> Invoice #</th>
                      {/* <th className="w-1/12 p-2 text-left "> Patient Name</th> */}
                      <th className=" w-1/12 p-2 text-left "> Generated Date</th>
                      <th className="w-1/12 p-2 text-left "> Due Date</th>
                      <th className="w-2/12 p-2 text-left "> Service Offered</th>
                      <th className=" w-1/12 p-2 text-left "> Total Price for Service</th>
                      <th className="w-1/12 p-2 text-left "> Status</th>
                      <th className="w-1/12 p-2 text-left "> Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice, index) => (
                      <tr key={index} className="border-b text-gray-600 flex gap-6">
                        <td className="w-1/12 p-2 text-left">{index+1}</td>
                        <td className="w-1/12 p-2 text-left">{formatTime(invoice.createdAt)}</td>
                        <td className="w-1/12 p-2 text-left">{invoice.dueDate}</td>
                        <td className="w-2/12 p-2 text-left">{invoice.services[0].name}</td>
                        <td className="w-1/12 p-2 text-left">${invoice.services[0].price}</td>
                        <td className="w-1/12 p-2 text-left">{invoice.status}</td>
                        <td className="w-1/12 p-2 text-left flex">
                          <Button
                            className="flex-shrink-0 bg-blue-600 text-white px-2 py-1 rounded font-semibold"
                            onClick={() => handleEditInvoiceClick(invoice)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="flex-shrink-0 bg-red-500 text-white px-2 py-1 rounded font-semibold ml-2"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
            </div>
         ) )}
      <Modal open={isModalVisible} footer={null} onCancel={()=>setIsModalVisible(false)}>
        {selectedPatient ? (
          <div>
            <h2 className="text-xl text-center font-semibold mb-4">
               Edit Patient 
            </h2>
            <div className="grid grid-cols-2">
              <p className="text-black m-3">
                <span className="font-semibold">lastVisit:</span>
                <br />
                <input
                  type="text"
                  className="p-1 mt-2 w-full border-b-2 border-gray-300"
                  value={selectedPatient.medicalProfile.lastVisit}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      medicalProfile: {
                        ...selectedPatient.medicalProfile,
                        lastVisit: e.target.value,
                      },
                    })
                  }
                />
              </p>
              <p className="text-black m-3">
                <span className="font-semibold">Condition:</span>
                <br />

                <input
                  type="email"
                  className="p-1 mt-2 w-full border-b-2 border-gray-300"
                  value={selectedPatient.medicalProfile.condition}
                  // readOnly={!isEditable}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      medicalProfile: {
                        ...selectedPatient.medicalProfile,
                        condition: e.target.value,
                      },
                    })
                  }
                />
              </p>
              <p className="text-black m-3">
                <span className="font-semibold">Age:</span>
                <br />

                <input
                  type="text"
                  className="p-1 mt-2 w-full border-b-2 border-gray-300"
                  value={selectedPatient.personalInformation.age}
                  // readOnly={!isEditable}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      personalInformation: {
                        ...selectedPatient.personalInformation,
                        age: e.target.value,
                      },
                    })
                  }
                />
              </p>
              <p className="text-black m-3">
                <span className="font-semibold">gender:</span>
                <br />

                <input
                  type="text"
                  className="p-1 mt-2 w-full border-b-2 border-gray-300"
                  value={selectedPatient.personalInformation.gender}
                  // readOnly={!isEditable}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      personalInformation: {
                        ...selectedPatient.personalInformation,
                        gender: e.target.value,
                      },
                    })
                  }
                />
              </p>
              <p className="text-black m-3">
                <span className="font-semibold">EmergencyContact Name:</span>
                <br />

                <input
                  type="text"
                  className="p-1 mt-2 w-full border-b-2 border-gray-300"
                  value={selectedPatient.emergencyContact.name}
                  // readOnly={!isEditable}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      emergencyContact: {
                        ...selectedPatient.emergencyContact,
                        name: e.target.value,
                      },
                    })
                  }
                />
              </p>
              <p className="text-black m-3">
                <span className="font-semibold">EmergencyContact email:</span>
                <br />

                <input
                  type="text"
                  className="p-1 mt-2 w-full border-b-2 border-gray-300"
                  value={selectedPatient.emergencyContact.email}
                  // readOnly={!isEditable}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      emergencyContact: {
                        ...selectedPatient.emergencyContact,
                        email: e.target.value,
                      },
                    })
                  }
                />
              </p>
              <p className="text-black m-3">
                <span className="font-semibold">EmergencyContact Contact:</span>
                <br />

                <input
                  type="text"
                  className="p-1 mt-2 w-full border-b-2 border-gray-300"
                  value={selectedPatient.emergencyContact.phoneNumber}
                  // readOnly={!isEditable}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      emergencyContact: {
                        ...selectedPatient.emergencyContact,
                        phoneNumber: e.target.value,
                      },
                    })
                  }
                />
              </p>
            </div>
              <Button
              onClick={() => selectedPatient && handleUpdate(selectedPatient)}
                className="text-center border-2 p-2 ml-3 rounded-md bg-red-500 text-white font-semibold w-full"
              >
                Updating Patient
              </Button> 
          </div>
        ) : (
          <CreatePatient addPatient={addPatient} />
        )}
      </Modal>
      {/* Modal for creating invoice */}
      <Modal
        open={isInvoiceModalVisible}
        onCancel={() =>{setIsInvoiceModalVisible(false);form.resetFields()}}
        footer={null} title='Create Invoice'>
          <Form form={form}  layout='vertical' onFinish={handleCreateInvoice} >
           
            <Form.Item
              name="services"
              label='Service Offered'
              rules={[
                { required: true, message: 'Please select service offered' },
              ]}
            >
               {serviceStatus === 'loading' ? (
              <Spin size="large" />
             ) : (
             <Checkbox.Group className="flex flex-col gap-2 text-black">
             {service && service.map((serviceData)=>{
              return(
              <Checkbox value={serviceData.id} key={serviceData.id}>{serviceData.name}</Checkbox>
              );}
             )}
             </Checkbox.Group>)}
             </Form.Item>
             <Form.Item
             name="dueDate"
             label='Due Date'
             
             rules={[
                { required: true, message: 'Please select due date' },
              ]}
             >
              <DatePicker className="w-full"  format="YYYY-MM-DDTHH:mm:ss.SSSZ" />
            </Form.Item>
            <Button className="w-full bg-purple-600 text-white p-2" htmlType="submit" 
            disabled={invoiceStatus === "loading"}
            loading={invoiceStatus === "loading"}
            > Generate Invoice</Button>
          </Form>
      </Modal>
      {/* Modal for editing invoice */}
      <Modal
        open={EditInvoiceMOdal}
        onCancel={() => {setEditInvoiceMOdal(false);form.resetFields();}}
        footer={null} title='Edit Invoice'>
          {selectedInvoice &&(
            <Form form={form} layout='vertical' onFinish={()=>handleUpdateInvoice(selectedInvoice.id)}
            initialValues={{
              dueDate: moment(selectedInvoice.dueDate),
              services: selectedInvoice.services.map(service => service.id)
            }}
             >
              <Form.Item
                name="dueDate"
                label='Due Date'
              >
                <DatePicker className="w-full"  format="YYYY-MM-DDTHH:mm:ss.SSSZ" />
              </Form.Item>
              <Form.Item
               name="services"
                label='Service offered'
              >
                {serviceStatus==='loading'?(
                  <Spin size="small" className="flex justify-center" />):(
                    <Checkbox.Group className="flex flex-col gap-2 text-black"value={form.getFieldValue('services')}>
                    {service && service.map((serviceData)=>{
                     return(
                     <Checkbox value={serviceData.id} key={serviceData.id} >{serviceData.name}</Checkbox>
                     );}
                    )}
                    </Checkbox.Group>
                    )}
              </Form.Item>
              <Button className="w-full bg-purple-600 text-white p-2" htmlType="submit" disabled={invoiceStatus === "loading"} loading={invoiceStatus === "loading"}>
                Update Invoice
              </Button>
            </Form>
          )}
        </Modal>
    </div>
  );
}
