/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BiShow, BiEditAlt } from "react-icons/bi";
import { MdDelete, MdPictureAsPdf, MdFileCopy } from "react-icons/md";
import { FaFileExcel, FaFileWord } from "react-icons/fa";
import { Button, message, Modal,Spin } from "antd";
import Create_User from "./Create_User";
import VideoCall from "../VideoCall";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUsers, updateUser } from "../../Redux/Adminslice/UserSlice";
import { deleteUser } from "../../Redux/Adminslice/UserSlice";
import { useCallback } from "react";
import CreateTherapy from "./Create_Therapy";
import CreatePatient from "./Create_Patient";
import { User } from "../../Redux/Adminslice/UserSlice";
import { RootState } from "../../Redux/store";

export default function AdminUserList() {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users) as User[];
  const status = useSelector((state: RootState) => state.users.status);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [TherapyRole, setTherapyRole] = useState(false);
  const [therapyUserId, setTherapyUserId] = useState<string | null>(null);
  const [PatientId, setPatientId] = useState<string | null>(null);
  const [PatientRole, setPatientRole] = useState(false);
  const [newRole, setNewRole] = useState("");
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);


// Effect to get all users
useEffect(() => {
 const fetchAllusers=async()=>{
    try{
    setLoading(true);
    await dispatch(GetAllUsers());
  }
  catch(error){
    const errorMessage = (error as Error).message;
    message.error(`Failed to load users: ${errorMessage}`);
  }
finally{
  setLoading(false);
}
  };
  fetchAllusers();
}, [dispatch]);



  useEffect(() => {
    if (status === "succeeded") {
      setFilteredUsers(users);
    }
  }, [users, status]);

  const handleTherapyRole = (e: React.ChangeEvent<HTMLSelectElement>, user: User) => {
    const selectedRole = e.target.value;
    setNewRole(selectedRole);
    if (selectedRole === "therapy" || selectedRole === "therapist") {
      setTherapyRole(true);
      setTherapyUserId(user.id);
    } else if (selectedRole === "patient") {
      setPatientRole(true);
      setPatientId(user.id);
    }
    dispatch(updateUser({ id: user.id, credentials: { role: selectedRole } }));
  };

  // this will handle the creation of Patient

  const handleSearch = useCallback(
    (event:any) => {
      const query = event.target.value.toLowerCase();
      setSearchQuery(query);

      const filtered = users.filter(
        (user:any) =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    },
    [users]
  );
  const paginate = (pageNumber:any) => {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) return;
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
                  new TextRun(`Name: ${user.firstName}`),
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

  const handleView = (user:any) => {
    setSelectedUser({
      ...user,
      date: user.date || "",
    });
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
    setPatientRole(false);
    setTherapyRole(false);
  };

  const handleEdit = (user:any) => {
    setSelectedUser(user);
    setIsEditable(true);
    setIsModalVisible(true);
  };

  const handleChangeRole = (user:any) => {
    setSelectedUser(user);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete User?");
    if (confirmed) {
      try {
        await dispatch(deleteUser(id));
        console.log("User deleted successfully")
        message.success("User deleted successfully");
        dispatch(GetAllUsers()); // Refresh the user list
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to delete user: ${errorMessage}`);
      }
    }
  };

  const handleUpdate = async (user:User) => {
    const confirmed = window.confirm("Are you sure you want to update User?");
    if (confirmed) {
      try {
        await dispatch(
          updateUser({
            id: user.id,
            credentials: {
              firstName: user.firstName,
              email: user.email,
              date: user.lastLogin,
            },
          })
        );
        message.success("User updated successfully");
        dispatch(GetAllUsers()); // Refresh the user list
        setIsModalVisible(false);
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to load users: ${errorMessage}`);
      }
    }
  };

  const handleBlock = () => {
    const confirm = window.confirm("Are Sure you want to Block this User?");
    if (confirm) {
      message.info("You will block User");
    }
  };

  const addUser = (newUser:any) => {
    newUser.id = users.length + 1;
    dispatch(createUser(newUser)).then(() => {
      setUsers([...users, newUser]);
      setFilteredUsers([...users, newUser]);
      setIsModalVisible(false);
      message.success("New User Added Successfully");
    });
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

  const handleSuccess = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-3">
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl font-bold m-5 text-purple-600">Users</h2>
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
     { loading ? (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    ) : (<>
      <div className="flex gap-4 mb-8">
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
        </div>
      </div>

   

  
      <table id="User-table" className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              no
            </th>
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
              Roles
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Change Roles
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
          {currentUsers.map((user,index) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">
                  {index+1}
                </div>
              </td>
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
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <button onClick={() => handleChangeRole(user)}>
                  <div className="text-sm leading-5 text-white bg-purple-600 p-1 rounded-md ">
                    {/* // we need to display roles here */}
                    {user.role ? user.role : "no Role assigned"}
                  </div>
                </button>
              </td>
               
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <select
                  className="border text-black w-30 my-2 rounded-md p-2 "
                  onChange={(e) => handleTherapyRole(e, user)}
                  value={user.role || ""}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="patient">Patient</option>
                  <option value="therapy">Therapy</option>
                </select>
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

      <Modal open={isModalVisible} onCancel={handleCancel} footer={null}>
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
                className="p-1 mt-2 rounded-md border-2 border-gray-300 w-full"
                value={selectedUser.firstName}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    firstName: e.target.value,
                  })
                }
              />
            </p>
            <p className="text-black m-3">
              <span>Email:</span>
              <br />

              <input
                type="email"
                className="p-1 mt-2 rounded-md border-2 border-gray-300 w-full"
                value={selectedUser.email}
                readOnly={!isEditable}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
            </p>

            {isEditable && (
              <Button
                onClick={() => handleUpdate(selectedUser)}
                className="text-center border-2 py-2 rounded-md bg-red-600 text-white font-semibold w-full"
                disabled={status === 'loading'}
                loading={status === 'loading'}
              >
               {status === 'loading' ? 'Updating...' : 'Update'}
              </Button>
            )}
            <VideoCall />
          </div>
        ) : (
          <Create_User onSuccess={handleSuccess} addUser={addUser} />
        )}
        {/* the following are for therapist */}
      </Modal>
      <Modal open={TherapyRole} footer={null} onCancel={handleCancel}>
        <CreateTherapy userId={therapyUserId} onSuccess={handleSuccess} />
      </Modal>

      {/* the following are for Patient */}
      <Modal open={PatientRole} footer={null} onCancel={handleCancel}>
        <CreatePatient userId={PatientId} onSuccess={handleSuccess}/>
      </Modal>
      </>)}
    </div>
  );
}
