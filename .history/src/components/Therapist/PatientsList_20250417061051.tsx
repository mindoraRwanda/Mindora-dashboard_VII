import React, { useEffect, useState } from "react";
import { message, Modal, Spin,Form, DatePicker,Checkbox } from "antd";
import moment from 'moment';
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {  Document, Packer, Paragraph, TextRun } from "docx";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { AppDispatch } from "../../Redux/store";
import {
  allPatients,
  deletePatient,
  updatePatient,
} from "../../Redux/Adminslice/PatientSlice";
import { createInvoice, deleteInvoice, getAllInvoices, UpdateInvoice } from "../../Redux/TherapistSlice/Invoice";
import { getAllService } from "../../Redux/TherapistSlice/Service";

// Define the Invoice interface
interface Invoice {
  id: string;
  userId: string;
  services: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  dueDate: string;
  createdAt: string;
  status: string;
}

// Updated Patient type to match PatientSlice.ts
export type Patient = {
  id: string|number;
  userId?: string;
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
  };
  personalInformation: {
    age: string | number;
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
  goToPlan: (patientId: string | number) => void;
}

export default function PatientsList({ goToPlan }: PatientsListProps) {
  const patient = useSelector((state: RootState) => state.patients.patients);
  const status = useSelector((state: RootState) => state.patients.status);
  const invoiceStatus = useSelector((state: RootState) => state.invoice.status);
  const service = useSelector((state: RootState) => state.servicess.services);
  const serviceStatus = useSelector((state: RootState) => state.servicess.status);
  const invoices = useSelector((state: RootState) => state.invoice.data);
  const invoicesStatus = useSelector((state: RootState) => state.invoice.status);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredPatient, setFilteredPatient] = useState<Patient[]>([]);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [ViewPatient, setViewPatient] = useState<Patient | null>(null);
  const [EditInvoiceMOdal, setEditInvoiceMOdal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 4;
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  const formatTime = (isoString: any) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // This used to get all patient in system
  useEffect(() => {
    const getAllPatients = async () => {
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

  const handleEditClick = (patient: Patient) => {
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
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatient.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleDelete = async (patientId: number | string) => {
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
    if (selectedPatient) {
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
    }
  };

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
                    break: 1,
                  }),
                  new TextRun({
                    text: `\nGender: ${patient.personalInformation.gender}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\nLast Visit: ${patient.medicalProfile.lastVisit}`,
                    break: 1,
                  }),
                  new TextRun({
                    break: 2,
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
      pdf.addImage(imgData, "PNG", 10, 10, canvas.width / 13, canvas.height / 12);
      pdf.save("Patients_list.pdf");
    });
  };
  
  // function to get data in excel
  const handleExportExcel = () => {
    const filteredPatient = currentPatients.map((patient) => ({
      Name: `${patient.user.firstName} ${patient.user.lastName || ''}`,
      Email: patient.user.email,
      Gender: patient.personalInformation.gender,
      Age: patient.personalInformation.age,
      LastVisit: patient.medicalProfile.lastVisit,
      Condition: patient.medicalProfile.condition,
      EmergencyContact: patient.emergencyContact.name,
      EmergencyEmail: patient.emergencyContact.email,
      EmergencyPhoneNumber: patient.emergencyContact.phoneNumber,
      PhoneNumber: patient.user.phoneNumber || '',
    }))
    const worksheet = XLSX.utils.json_to_sheet(filteredPatient);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    XLSX.writeFile(workbook, "Patients_list.xlsx");
  };

  // function to get individual patient information
  const addPatient = (newPatient: Patient) => {
    newPatient.id = patient.length + 1;
    const updatedPatients: Patient[] = [...patient, newPatient as Patient];
    setFilteredPatient(updatedPatients);
    setIsModalVisible(false);
    message.success("New Patient Added Successfully");
  };

  // This is here to display all the service are in system 
  useEffect(() => {
    console.log("Dispatching getAllService"); 
    dispatch(getAllService());
  }, [dispatch]);

  // this is for View the More about patient information
  const handleView = (patient: Patient) => {
    setViewPatient(prevPatient => prevPatient?.id === patient.id ? null : patient);
    if (patient && patient.user && patient.user.id) {
      setSelectedPatient(patient);
      console.log('Fetching Invoices for user:', patient.user.id);
      dispatch(getAllInvoices(patient.user.id));
    }
    console.log('patient data', patient);
  };

  // operations for Invoices
  const handleCreateInvoice = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedPatient || !selectedPatient.user || !selectedPatient.user.id) {
        message.error("User ID is required");
        return;
      }
      const requestedData = {
        userId: selectedPatient.user.id,
        services: values.services,
        dueDate: values.dueDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      };
      console.log('Sending data:', requestedData);
      
      await dispatch(createInvoice(requestedData)).unwrap();
      message.success('Invoice generated successfully');
      setIsInvoiceModalVisible(false);
      form.resetFields();
      await dispatch(allPatients());
    }
    catch (error) {
      message.error(`Failed to create invoice: ${error}`);
    }
  };

  // function that will be used to delete invoice
  const handleDeleteInvoice = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete');
    if (confirm) {
      try {
        await dispatch(deleteInvoice(id));
        message.success('Invoice deleted successfully');
        if (selectedPatient?.user?.id) {
          await dispatch(getAllInvoices(selectedPatient.user.id));
        }
      }
      catch (error) {
        message.error(`Failed to delete invoice: ${error}`);
      }
    }
  };

  // function to handle Edit Invoice
  const handleEditInvoiceClick = (invoice: Invoice) => {
    setEditInvoiceMOdal(true);
    setSelectedInvoice(invoice);
    console.log('The data of selected invoice', invoice);
    console.log('Services:', invoice.services);
  };

  // let's make sure the form is properly reset when the modal closes
  useEffect(() => {
    if (selectedInvoice && EditInvoiceMOdal) {
      form.setFieldsValue({
        dueDate: moment(selectedInvoice.dueDate),
        services: selectedInvoice.services.map((service: any) => service.id)
      });
    }
  }, [selectedInvoice, EditInvoiceMOdal, form]);

  // function to Update Invoice
  const handleUpdateInvoice = async (invoiceId: string) => {
    try {
      const values = await form.validateFields();
      const updatedInvoice = {
        id: invoiceId,
        userId: selectedInvoice?.userId,
        services: values.services,
        dueDate: values.dueDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      };
      console.log('Updating invoice:', updatedInvoice);
      await dispatch(UpdateInvoice(updatedInvoice)).unwrap();
      message.success('Invoice updated successfully');
      setEditInvoiceMOdal(false);
      form.resetFields();
      if (selectedPatient?.user?.id) {
        await dispatch(getAllInvoices(selectedPatient.user.id));
      }
    }
    catch (error) {
      message.error(`Failed to update invoice: ${error}`);
    }
  };

  // The rest of your component (return statement) remains the same
  
  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <Spin size="large" />
    </div>
  ) : (
    // Your existing JSX return...
    <div className="bg-white rounded-lg shadow-xl p-6">
      {/* Your existing UI code */}
    </div>
  );
}