import { FiSearch } from "react-icons/fi";
import { BiShow, BiEditAlt } from "react-icons/bi";
import { MdDelete, MdPictureAsPdf, MdFileCopy } from "react-icons/md";
import { FaFileExcel, FaFileWord } from "react-icons/fa";
import { useEffect, useState } from "react";
import { message, Modal } from "antd";
import Create_Therapy from "./Create_Therapy";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun } from "docx";
import VideoCall from "../VideoCall";
import { useDispatch, useSelector } from "react-redux";
import { deleteTherapy, getAllTherapists } from "../../Redux/slice/ThearpySlice";



export default function AdminTherapistList() {

const dispatch=useDispatch();

const  therapists= useSelector((state) => state.Therapy.therapists);
  const status = useSelector((state) => state.Therapy.status);


  const [searchQuery, setSearchQuery] = useState("");
  const [filteredtherapists, setFilteredtherapists] =useState([]);
  const [isShowModal, setShowModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (status === "idle") {
      dispatch(getAllTherapists());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      setFilteredtherapists(therapists);
    }
  }, [therapists, status]);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTherapy = filteredtherapists.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    const Add_Therapy = () => {
      setShowModal(false);
      message.success("New Therapist added successfully");
      dispatch(getAllTherapists()); // Fetch the updated list
    };
    

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = Therapy.filter(
      (therapist) =>
        therapist.personalInformation.name.toLowerCase().includes(query) ||
        therapist.diploma.toLowerCase().includes(query) // Assuming you want to search by diploma
    );
    
    setFilteredtherapists(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (therapist) => {
    setSelectedTherapy(therapist);
    setIsEditable(true);
    setShowModal(true);
  };

  const handleView = (therapist) => {
    setSelectedTherapy(therapist);
    setIsEditable(false);
    setShowModal(true);
  };

  const handleDelete = async (therapyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete Therapy?"
    );
    if (confirmed) {
 try{
  await dispatch(deleteTherapy(therapyId));
  message.success('delete therapy sucessfully');
  dispatch(getAllTherapists());
 }
catch(error){
  message.error( `failed to delete therapy ${error}`);
}
}
  };

const showModal = () => {
  setSelectedTherapy(null);
  setIsEditable(true);
  setShowModal(true);
};

  const handleCancel = () => {
    setShowModal(false);
  };


  const handleUpdate = (updateTherapy) => {
    const updateTherapies = therapists.map((therapist) =>
      therapist.id === updateTherapy.id ? updateTherapy : therapist
    );

    setTherapy(updateTherapies);
    setFilteredtherapists(updateTherapies);
    setShowModal(false);
    message.success("updated Therapy Successfully");
  };

  const handleExportPDF = () => {
    const input = document.getElementById("therapist-table");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage( imgData, "PNG",10,10,canvas.width / 12,canvas.height / 12
      );
      pdf.save("therapist_list.pdf");
    });
  };

  const handleExportWord = () => {
    const doc = new Document({
      sections: [
        {
          children: currentTherapy.map(
            (therapist) =>
              new Paragraph({
                children: [
                  new TextRun(`Name: ${therapist.name}`),
                  new TextRun({
                    text: `\nSpecialty: ${therapist.specialty}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\nPatients: ${therapist.patients}`,
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
      saveAs(blob, "therapist_list.docx");
    });
  };
  

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredtherapists);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Therapists");
    XLSX.writeFile(workbook, "therapist_list.xlsx");
  };



  const handleCopy = () => {
    const text = filteredtherapists
      .map(
        (therapist) =>
          `Name: ${therapist.name}, Specialty: ${therapist.specialty}, Patients: ${therapist.patients}`
      )
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      message.success("Data copied to clipboard!");
    });
  };



  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">
          Therapists
        </h2>
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
        <a
  onClick={showModal}
  className="text-white font-bold p-2 px-2 cursor-pointer bg-purple-600 rounded-md "
>
  + Add New
</a>

        </div>
        <div className="flex ml-auto gap-3 rounded-md mt-4 ">
          <button
            className="text-white font-bold border-2 border-slate-300 p-2 px-2 cursor-pointer bg-purple-600 rounded-md flex"
            onClick={handleExportPDF}
          >
            <MdPictureAsPdf size={20} />
            Pdf
          </button>
          <button
            className="text-white font-bold border-2 border-slate-300 p-2 px-2 cursor-pointer bg-purple-600 rounded-md flex"
            onClick={handleExportExcel}
          >
            <FaFileExcel size={20} />
            excel
          </button>
          <button
            className="text-white font-bold border-2 border-slate-300 p-2 px-2 cursor-pointer bg-purple-600 rounded-md flex"
            onClick={handleExportWord}
          >
            <FaFileWord size={20} />
            Word
          </button>
          <button
            className="text-white font-bold border-2 border-slate-300 p-2 px-2 cursor-pointer bg-purple-600 rounded-md flex"
            onClick={handleCopy}
          >
            <MdFileCopy size={20} />
            copy
          </button>
        </div>
      </div>

      <table id="therapist-table" className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Date of Birth
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>

            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Phone Number
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Diploma
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Licence
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Gender
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentTherapy.map((therapist) => (
            <tr key={therapist.id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">
                {therapist.personalInformation.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                {therapist.personalInformation.dateOfBirth}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                {therapist.personalInformation.address}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                {therapist.personalInformation.phoneNumber}
                </div>
              </td> 
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                {therapist.diploma}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                {therapist.licence}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                {therapist.personalInformation.gender}
                </div>
              </td>
              {/* <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900 ">
                  <button
                    className="border-2 border-gray-300 rounded-md p-2 px-6 font-semibold"
                    onClick={handleBlock}
                  >
                    Active
                  </button>
                </div>
              </td> */}
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="flex text-sm leading-5 text-gray-900">
                  <button
                    className="flex mr-2 bg-transparent p-2 border-2 rounded-md font-semibold border-slate-300 text-black"
                    onClick={() => handleView(therapist)}
                  >
                    <BiShow size={25} />
                  </button>
                  <button
                    className="flex mr-2 text-blue-700 p-1 bg-transparent border-2 font-semibold border-slate-300 rounded-md"
                    onClick={() => handleEdit(therapist)}
                  >
                    <BiEditAlt size={25} />
                  </button>
                  <button
                    className="flex mr-2 text-red-500  p-1 bg-transparent border-2 border-slate-300 rounded-md font-semibold"
                    onClick={() => handleDelete(therapist.id)}
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
          { length: Math.ceil(filteredtherapists.length / itemsPerPage) },
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
      <Modal footer={null} visible={isShowModal} onCancel={handleCancel}>

        {selectedTherapy ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {isEditable ? " Edit Therapy " : " Therapy Details "}
            </h2>
            <p className="text-black m-3">
              <span>Name:</span>
              <br />
              <input
                type="text"
                className="p-1 mt-2 border-2 rounded-md border-gray-300"
                value={selectedTherapy.name}
                readOnly={!isEditable}
                onChange={(e) =>
                  setSelectedTherapy({
                    ...selectedTherapy,
                    name: e.target.value,
                  })
                }
              />
            </p>
            <p className="text-black m-3">
              <span>Speciality:</span>
              <br />

              <input
                type="text"
                className="p-1 mt-2 rounded-md border-2 border-gray-300"
                value={selectedTherapy.specialty}
                readOnly={!isEditable}
                onChange={(e) =>
                  setSelectedTherapy({
                    ...selectedTherapy,
                    specialty: e.target.value,
                  })
                }
              />
            </p>

            <p className="text-black m-3">
              <span>Patients:</span> <br />
              <input
                type="number"
                className="p-1 mt-2 rounded-md border-2 border-gray-300"
                value={selectedTherapy.patients}
                readOnly={!isEditable}
                onChange={(e) =>
                  setSelectedTherapy({
                    ...selectedTherapy,
                    patients: e.target.value,
                  })
                }
              />
            </p>

            {isEditable && (
              <button
                onClick={() => handleUpdate(selectedTherapy)}
                className="text-center border-2 p-2 ml-3 rounded-md bg-red-600 text-white font-semibold"
              >
                Update
              </button>
            )}
             <VideoCall/>
          </div>
        ) : (
          <Create_Therapy Add_Therapy={Add_Therapy} />
        )}
       
      </Modal>
    </div>
  );
}
