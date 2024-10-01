import React, { useState } from "react";
import { BiShow, BiEditAlt } from "react-icons/bi";
import { MdDelete, MdPictureAsPdf, MdFileCopy } from "react-icons/md";
import CreatePatient from "./Create_Patient";
import { FaFileExcel, FaFileWord } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { message, Modal } from "antd";
import VideoCall from "../VideoCall";
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun } from "docx";
import * as XLSX from 'xlsx';

export default function AdminPatientsList() {

  const initialPatients = [
    { id: 1, name: "John Doe", email: "john@example.com", gender: 'Male', lastLogin: "2024-07-18" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", gender: 'female', lastLogin: "2024-07-17" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", gender: 'Male', lastLogin: "2024-07-16" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredPatient, setFilteredPatient] = useState(initialPatients);
  const [patient, setPatient] = useState(initialPatients);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleEditClick = (patient) => {
    setIsEditable(true);
    setSelectedPatient(patient);
    setIsModalVisible(true);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = patient.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query)
    );
    setFilteredPatient(filtered);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatient.slice(indexOfFirstItem, indexOfLastItem);

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setIsModalVisible(true);
    setIsEditable(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (patientId) => {
    const confirmed = window.confirm('Do you want to delete patient ?');
    if (confirmed) {
      const updatePatient = patient.filter((patient) => patient.id !== patientId);
      setPatient(updatePatient);
      setFilteredPatient(updatePatient);
      message.success('Patient Deleted');
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
                  new TextRun(`Name: ${patient.name}`),
                  new TextRun({
                    text: `\nEmail: ${patient.email}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\nGender: ${patient.gender}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\nLast Visit: ${patient.lastLogin}`,
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

  const handleUpdate = (updatedPatient) => {
    const updatedPatients = patient.map((patient) =>
      patient.id === updatedPatient.id ? updatedPatient : patient
    );

    setPatient(updatedPatients);
    setFilteredPatient(updatedPatients);
    setIsModalVisible(false);
    message.success("Updated successfully");
  };

  const addPatient = (newPatient) => {
    newPatient.id = patient.length + 1;
    const updatedPatients = [...patient, newPatient];
    setPatient(updatedPatients);
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
    const input = document.getElementById('Patient-table');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, canvas.width / 12, canvas.height / 12);
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
          `Name: ${patient.name}, Email: ${patient.email}, Gender: ${patient.gender}, Last visit: ${patient.lastLogin}`
      )
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      message.success("Data copied to clipboard!");
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">List of Patients</h2>
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
          <button onClick={showModal} className="text-white font-bold p-2 px-2 cursor-pointer bg-purple-600 rounded-md">
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
              Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Gender
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Last Visit
            </th>
           
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.map((patient) => (
            <tr key={patient.id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">{patient.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">{patient.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">{patient.gender}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">{patient.lastLogin}</div>
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
        {Array.from({ length: Math.ceil(filteredPatient.length / itemsPerPage) }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={`px-3 py-1 border ${pageNumber === currentPage ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'} mx-1 rounded`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
<Modal open={isModalVisible}  footer={null} onCancel={handleCancel}>
    
{selectedPatient ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {
                isEditable ? " Edit Patient " :" Patient Details "
              }
            </h2>
          
            <p className="text-black m-3">
              <span>Name:</span><br />
              <input type="text"  className="p-1 mt-2 rounded-md border-2 border-gray-300"
               value={selectedPatient.name}
               readOnly={!isEditable}
               onChange={(e)=>setSelectedPatient({...selectedPatient, name:e.target.value})}/>
            </p>
            <p className="text-black m-3">
              <span>Email:</span><br />

              <input type="email"  className="p-1 mt-2 rounded-md border-2 border-gray-300"
              value={selectedPatient.email}
              readOnly={!isEditable}
              onChange={(e)=>setSelectedPatient({...selectedPatient,email:e.target.value})}/>
            </p>
            
            <p className="text-black m-3 flex">
              <span>Last Login:</span>
             <p className="text-md font-semibold ml-2">
               {selectedPatient.lastLogin}
          </p>
            </p>
           
            {isEditable &&(
              <button onClick={()=>handleUpdate(selectedPatient)} className="text-center border-2 p-2 ml-3 rounded-md bg-red-600 text-white font-semibold">Update
              </button>
            )}
             <VideoCall/>
          </div>
        ) : (
          <CreatePatient addPatient={addPatient}/>
        )}
</Modal>
     
    </div>
  );
}
