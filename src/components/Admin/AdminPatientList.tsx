import React, { useEffect, useState } from "react";
import { BiShow, BiEditAlt } from "react-icons/bi";
import { MdDelete, MdPictureAsPdf, MdFileCopy } from "react-icons/md";
import CreatePatient from "./Create_Patient";
import { FaFileExcel, FaFileWord } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { message, Modal,Spin } from "antd";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState,AppDispatch } from "../../Redux/store";
import {
  allPatients,
  deletePatient,
  updatePatient,
} from "../../Redux/Adminslice/PatientSlice";
import { Patient } from "../../Redux/Adminslice/PatientSlice";
import { getAllAppintmentforPatient } from "../../Redux/TherapistSlice/Appointment";

export default function AdminPatientsList() {
  const patient = useSelector((state: RootState) => state.patients.patients);
  const status = useSelector((state:RootState) => state.patients.status);
  const slots= useSelector((state:RootState) => state.appointment.appointments);
  const slotStatus = useSelector((state:RootState) => state.appointment.status);


  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredPatient, setFilteredPatient] = useState<Array<Patient>>([]);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId] = useState<string>("");
  const itemsPerPage = 4;
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const getAllPatients=async()=>{
      try {
        setLoading(true);
       await dispatch(allPatients());
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to get update all patient : ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    getAllPatients();
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      setFilteredPatient(patient as unknown as Patient[]);
    }
  }, [status, patient]);

  const handleEditClick = (patient:Patient) => {
    setIsEditable(true);
    setSelectedPatient(patient);
    setIsModalVisible(true);
  };
 useEffect(()=>{
  if(selectedPatient?.id){
    console.log( "That is the id of selected patient",selectedPatient.id);
    dispatch(getAllAppintmentforPatient(selectedPatient.id));
  }
 },[dispatch, selectedPatient]);

 const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
  });
};
 
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredPatients = patient.filter((patient: any) =>
      patient.emergencyContact.name.toLowerCase().includes(query) ||
      patient.user.email.toLowerCase().includes(query)
    );
    setFilteredPatient([...filteredPatients]);
    setCurrentPage(1);
  };

  const paginate = (pageNumber:any) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatient.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleView = (patient:Patient) => {
    setSelectedPatient(patient);
    setIsModalVisible(true);
    setIsEditable(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (patientId:any) => {
    const confirmed = window.confirm("Do you want to delete patient ?");
    if (confirmed) {
      try {
        dispatch(deletePatient(patientId));
        message.success("Patient Deleted successfully");
        dispatch(allPatients()); 
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to delete patient: ${errorMessage}`);
      }
    }
  };

  const handleExportWord = () => {
    const doc = new Document({
      sections: [
        {
          children: currentPatients.map(
            (patient) =>
              new Paragraph({
                children: [
                  new TextRun(`Name: ${patient.firstName}`),
                  new TextRun({
                    text: `\nEmail: ${patient.email}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\nGender: ${patient.personalInformation.gender}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\nAge: ${patient.personalInformation.age}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\nAddress: ${patient.personalInformation.address}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\n`,
                    break: 1,
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

  const handleUpdate = async (selectedPatient:any) => {
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
        message.error(`Failed to update : ${errorMessage}`);
      }
    }
  };

  const addPatient = (newPatient:any) => {
    newPatient.id = patient.length + 1;
    const updatedPatients = [...patient, newPatient];
    // setPatient(updatedPatients);
    setFilteredPatient(updatedPatients);
    setIsModalVisible(false);
    message.success("New Patient Added Successfully");
  };

  const showModal = () => {
    setSelectedPatient(null);
    setIsEditable(true);
    setIsModalVisible(true);
  };

  const handleExportPDF = () => {
    const input = document.getElementById("Patient-table");
    html2canvas(input!, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(
        imgData,
        "PNG",
        10,
        10,
        canvas.width / 12,
        canvas.height / 12
      );
      pdf.save("Patients_list.pdf");
    });
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPatient);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    XLSX.writeFile(workbook, "Patients_list.xlsx");
  };

  const handleCopy = () => {
    const text = filteredPatient
      .map(
        (patient) =>
          `Name: ${patient.user.firstName}, ` +
          `Email: ${patient.user.email}, ` +  
          `Gender: ${patient.personalInformation.gender}, ` + 
          `Address: ${patient.personalInformation.address}, `   
      )
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <Spin size="large" />
    </div>
  ) : (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex justify-between ">
        <h2 className="text-purple-600 text-3xl font-semibold">Patients</h2>
        <div className="items-center border rounded bg-white flex float-right">
          <input
            type="text"
            name="query"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            className="rounded-l outline-none text-black m-3"
          />
          <button
            type="submit"
            className="p-2 text-xl text-black bg-white rounded-r"
          >
            <FiSearch />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex float-left border-2 border-slate-300 rounded-md mt-4">
          <button
            onClick={showModal}
            className="text-white font-bold p-2 px-2 cursor-pointer bg-purple-600 rounded-md"
          >
            + Add New
          </button>
        </div>
        <div className="flex ml-auto gap-3 rounded-md mt-4">
          <button
            className="text-white font-bold border-2 border-slate-300 p-2 cursor-pointer bg-purple-600 rounded-md flex"
            onClick={handleExportPDF}
          >
            <MdPictureAsPdf size={20} /> Pdf
          </button>
          <button
            className="text-white font-bold border-2 border-slate-300 p-2 cursor-pointer bg-purple-600 rounded-md flex"
            onClick={handleExportExcel}
          >
            <FaFileExcel size={20} /> Excel
          </button>
          <button
            className="text-white font-bold border-2 border-slate-300 p-2 cursor-pointer bg-purple-600 rounded-md flex"
            onClick={handleExportWord}
          >
            <FaFileWord size={20} /> Word
          </button>
          <button
            className="text-white font-bold border-2 border-slate-300 p-2 cursor-pointer bg-purple-600 rounded-md flex"
            onClick={handleCopy}
          >
            <MdFileCopy size={20} /> Copy
          </button>
        </div>
      </div>


      <table id="Patient-table" className="min-w-full">
        <thead>
          <tr>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          Profile
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              phone
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
             Email
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Age
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
             Address
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.map((patient:Patient) => (
            <tr key={patient.id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">
                  {patient.profileImage ? (
                 <img src={patient.profileImage}
                  alt="Profile Picture"
                  className="rounded-full h-10 w-10"
                 />):(
                 <img src= "https://via.placeholder.com/40"/>
                 )}

                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">
                  {patient.firstName} {patient.lastName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                  {patient.phoneNumber}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                  {patient.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                  {patient.age}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                  {patient.address}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="flex text-sm leading-5 text-gray-900">
                  <button
                    className="flex mr-2 bg-transparent rounded border-2 border-slate-300 font-semibold  p-1 text-black"
                    onClick={() => handleView(patient)}
                  >
                    <BiShow size={25} />
                  </button>
                  <button
                    className="flex mr-2 text-blue-700 border-2 border-slate-300 p-1 rounded font-semibold"
                    onClick={() => handleEditClick(patient)}
                  >
                    <BiEditAlt size={25} />
                  </button>
                  <button
                    className="flex mr-2 text-red-500 rounded  p-1 border-2 border-slate-300  font-semibold"
                    onClick={() => handleDelete(patient.id)}
                  >
                    <MdDelete size={25} />
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
      <Modal open={isModalVisible} footer={null} onCancel={handleCancel}>
        {selectedPatient ? (
          <div>
            <h2 className="text-xl text-center font-semibold mb-4">
              {isEditable ? " Edit Patient " : " Patient Details "}
            </h2>
            <div className="grid grid-cols-2">
              <p className="text-black m-3">
                <span className="font-semibold">lastVisit:</span>
                <br />
                <input
                  type="text"
                  className="p-1 mt-2 w-full border-b-2 border-gray-300"
                  value={selectedPatient.medicalProfile.lastVisit}
                  readOnly={!isEditable}
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
                  readOnly={!isEditable}
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
                  readOnly={!isEditable}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      personalInformation: {
                        ...selectedPatient.personalInformation,
                        age: Number(e.target.value), 
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
                  readOnly={!isEditable}
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
                  readOnly={!isEditable}
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
                  readOnly={!isEditable}
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
                  readOnly={!isEditable}
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

            <div className="mt-3 border-2 w-full rounded-md">
          <span className="text-lg font-semibold ml-2 my-10">Patient Appointments</span>
          {slotStatus === 'loading' ? (
            <p>Loading...</p>
          ) : slotStatus === 'succeeded' && slots.length > 0 ? (
            <div>
              {slots.map((slot) => (
                <div key={slot.id}>
                  <div className="flex mt-2 justify-between mx-5 ">
                    <label>Available Day</label>
                    <p className="text-md">Monday</p>
                  </div>
                  
                  <div className="flex grid-cols-2 justify-between mx-5 mt-2">
                    <h2 className="flex gap-2">Start_Time: <p>{formatTime(slot.startTime)}</p></h2>
                    <h2 className="flex gap-2">End_Time: <p>{formatTime(slot.endTime)}</p></h2>
                  </div>
                  <div className="flex grid-cols-2 justify-between mx-5 mt-2">
                    <h2 className="flex gap-2">Appointment_location: <p>{slot.appointmentType}</p></h2>
                    <h2 className="flex gap-2">Patient_name: <p>{slot.patient.user.firstName}.{slot.patient.user.lastName}</p></h2>
                  </div>
                  <div className="flex grid-cols-2 justify-between mx-5 mt-2">
                    <h2 className="flex gap-2">Patient_Gender: <p>{slot.patient.personalInformation.gender}</p></h2>
                    <h2 className="flex gap-2">Patient_Phone: <p>{slot.patient.personalInformation.phone}</p></h2>
                  </div>
                 </div>
              ))} 
            </div>
           ) : (
            <p>No available slots found.</p>
          )} 
        </div>
            {isEditable && (
              <button
                onClick={() => handleUpdate(selectedPatient)}
                className="text-center border-2 p-2 ml-3 rounded-md bg-red-500 text-white font-semibold w-full"
              >
                {status === "loading" ? "Updating ..." : "Update"}
              </button>
            )}
            {/* <VideoCall/> */}
          </div>
        ) : (
          <CreatePatient
          userId={userId}
          addPatient={addPatient} 
          onSuccess={addPatient}
          />

        )}
      </Modal>
    </div>
  );
}
