import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BiShow, BiEditAlt } from "react-icons/bi";
import { MdDelete, MdPictureAsPdf, MdFileCopy } from "react-icons/md";
import { FaFileExcel, FaFileWord } from "react-icons/fa";
import { message, Modal } from "antd";
import Create_User from "./Create_User";
import VideoCall from "../VideoCall";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUsers, updateUser } from "../../Redux/slice/UserSlice";
import { deleteUser } from "../../Redux/slice/UserSlice";
import { useCallback } from "react";

export default function AdminUserList() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const status = useSelector((state) => state.users.status);


  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (status === "idle") {
      dispatch(GetAllUsers());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      setFilteredUsers(users);
    }
  }, [users, status]);

  const handleSearch = useCallback((event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query)||
        user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users]);


  const paginate = (pageNumber) => {
    if (pageNumber < 1) return;
    if (pageNumber > Math.ceil(filteredUsers.length / itemsPerPage)) return;
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleExportWord = () => {
    const doc = new Document({
      sections: [
        {
          children: currentUsers.map(
            (user) =>
              new Paragraph({
                children: [
                  new TextRun(`Name: ${user.name}`),
                  new TextRun({ text: `\nEmail: ${user.email}`, break: 1 }),
                  new TextRun({ text: `\nGender: ${user.gender}`, break: 1 }),
                  new TextRun({
                    text: `\nLast visit: ${user.lastLogin}`,
                    break: 1,
                  }),
                ],
              })
          ),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "User_list.docx");
    });
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsEditable(false);
    setIsModalVisible(true);
  };

  const showModal = () => {
    setSelectedUser(null);
    setIsEditable(true);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditable(true);
    setIsModalVisible(true);
  };

  const handleDelete = async(id:string) => {
    const confirmed = window.confirm("Are you sure you want to delete User?");
    if (confirmed) {
      console.log("User deleted");
    try{
      await dispatch(deleteUser(id));
      message.success('User deleted successfully');
      dispatch(GetAllUsers()); // Refresh the user list
    }
    catch(error){
      message.error("Error deleting user"+error.message);
    }
    }
  };

  const handleUpdate = async (user) => {
    try {
      await dispatch(updateUser({
        id: user.id,
        credentials: {
          firstName: user.firstName,
          email: user.email,
          password: user.password,
        },
      }));
      message.success('User updated successfully');
    } catch (error) {
      message.error("Error updating user: " + error.message);
    }
  };
  

  const handleBlock = () => {
    message.info("You will block User");
  };

  const addUser = (newUser) => {
    newUser.id = users.length + 1;
    setUsers([...users, newUser]);
    setFilteredUsers([...users, newUser]);
    setIsModalVisible(false);
    message.success("New User Added Successfully");
  };

  const handleExportPDF = () => {
    const input = document.getElementById("User-table");
    html2canvas(input, { scale: 2 }).then((canvas) => {
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
      pdf.save("User_list.pdf");
    });
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Users_list.xlsx");
  };

  const handleCopy = () => {
    const text = filteredUsers
      .map(
        (user) =>
          `Name: ${user.name}, Email: ${user.email}, Last Login: ${user.lastLogin}`
      )
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      message.success("Data copied to clipboard!");
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-3">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">Users</h2>
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
            {" "}
            + Add New
          </a>
        </div>
        <div className="flex ml-auto gap-3 rounded-md mt-4 ">
          <button
            className="text-white font-bold border-2 border-slate-300 p-2 cursor-pointer bg-purple-600 rounded-md flex"
            onClick={handleExportPDF}
          >
            <MdPictureAsPdf size={20} />
            Pdf
          </button>
          <button
            className="text-white font-bold border-2 border-slate-300 p-2 cursor-pointer bg-purple-600 rounded-md flex"
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
            className="text-white font-bold border-2 border-slate-300 p-2 cursor-pointer bg-purple-600 rounded-md flex"
            onClick={handleCopy}
          >
            <MdFileCopy size={20} />
            copy
          </button>
        </div>
      </div>

      {/* User table */}
      <table id="User-table" className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              FirstName
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              LastName
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>

            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">
                  {user.firstName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                  {user.lastName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900">
                  {user.email}
                </div>
              </td>
              <td className="py-5 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 text-gray-900 ml-5">
                  <button
                    className="border-2 border-gray-300 p-2 px-6 rounded-md font-semibold"
                    onClick={handleBlock}
                  >
                    Active
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="flex text-sm leading-5 text-gray-900">
                  <button
                    className="flex mr-2 bg-transparent rounded border-2 border-slate-300 font-semibold p-1 text-black"
                    onClick={() => handleView(user)}
                  >
                    <BiShow size={25} />
                  </button>
                  <button
                    className="flex mr-2 text-blue-700 border-2 border-slate-300 p-1 rounded font-semibold"
                    onClick={() => handleEdit(user)}
                  >
                    <BiEditAlt size={25} />
                  </button>
                  <button
                    className="flex mr-2 text-red-500 rounded p-1 border-2 border-slate-300 font-semibold"
                    onClick={() => handleDelete(user.id)}
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
          { length: Math.ceil(filteredUsers.length / itemsPerPage) },
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

      <Modal visible={isModalVisible} onCancel={handleCancel} footer={null}>
        {selectedUser ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {isEditable ? " Edit User " : " User Details "}
            </h2>
            <p className="text-black m-3">
              <span>Name:</span>
              <br />
              <input
                type="text"
                className="p-1 mt-2 rounded-md border-2 border-gray-300"
                value={selectedUser.firstName}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, firstName: e.target.value })
                }
              />
            </p>
            <p className="text-black m-3">
              <span>Email:</span>
              <br />

              <input
                type="email"
                className="p-1 mt-2 rounded-md border-2 border-gray-300"
                value={selectedUser.email}
                readOnly={!isEditable}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
            </p>

            {isEditable && (
              <button
                onClick={() => handleUpdate(selectedUser)}
                className="text-center border-2 p-2 ml-3 rounded-md bg-red-600 text-white font-semibold"
              >
                Update
              </button>
            )}
            <VideoCall />
          </div>
        ) : (
          <Create_User addUser={addUser} />
        )}
      </Modal>
    </div>
  );
}
