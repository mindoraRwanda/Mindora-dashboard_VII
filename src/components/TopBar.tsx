import { Modal,message } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMessage, MdNotificationsNone } from "react-icons/md";
import { IoCalendarNumber } from "react-icons/io5";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { changePass } from "../Redux/Adminslice/authSlice";
import { RootState } from "../Redux/store";

interface TopBarProps {
  userRole: string;
  items?: any[];
}
export default function TopBar({ userRole, items = [] }:TopBarProps) {
  const { t, i18n } = useTranslation(); 
  const [filteredItems, setFilteredItems] = useState(items);
  const [calendarModal, setCalendarModal] = useState(false);
  const [name, setName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [value, setValue] = useState(new Date());
  const [open,setOpen]=useState(false);
  const [ChangePassModal, SetChangePassModal] = useState(false);
  const[oldPassword,setOldPassword]=useState('');
  const[newPassword,setNewPassword]=useState('');
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const {status}=useSelector((state:RootState)=>state.auth);


  const ShowPassModal = () => {
    SetChangePassModal(true);
    setOpen(false);
  };
  const CancelPassModal = () => {
    SetChangePassModal(false);
  };
  const handleLogout = () => {
    navigate("/");
    setOpen(false);
  };
  const menus=[
    {label:"Profile",onClick:()=>setOpen(false)},
    {label:"Change Password",onClick:ShowPassModal},
    {label:"Logout",onClick:handleLogout},
  ];
  const handleModal = () => {
    setCalendarModal(true);
  };

  const handleCancel = () => {
    setCalendarModal(false);
  };
  const handleCalendarChange = (nextValue: any) => {
    setValue(nextValue);
  };
  // function to get name of logedIn user stored at local storage
  useEffect(()=>{
    const storedName = localStorage.getItem("fullName");
    const storedProfileImage = localStorage.getItem("profileImage");
    if(storedName){
      setName(storedName);
    }
    if(storedProfileImage){
     setProfilePhoto(storedProfileImage);
    }
  }, []);
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);
  
  const handleLanguageChange = (e:any) => {
    const selectedLanguage = e.target.value;
    i18n.changeLanguage(selectedLanguage).then(() => {
      if (filteredItems !== items) {
        setFilteredItems([...items]);
      }
    });
  };
  // Function to validate password
  const validatePasswords = () => {
    if (!oldPassword || !newPassword) {
      message.error('Both old and new passwords are required');
      return false;
    }
    if (oldPassword === newPassword) {
      message.error('New password must be different from old password');
      return false;
    }
    if (newPassword.length < 5) {
      message.error('New password must be at least 5 characters long');
      return false;
    }
    return true;
  };

// function to change password by using userId.
  const handleChangePass= async (oldPassword:string,newPassword:string) => {
    if (!validatePasswords()) return;
    const UserId = localStorage.getItem('UserId');
    console.log('Logged In UserId', UserId);
    if (!UserId) {
      message.error('User ID not found. Please login again');
      return;
    };
    try{
      console.log('Attempting to change password with:', { 
        UserId, 
        oldPasswordLength: oldPassword.length, 
        newPasswordLength: newPassword.length 
      });
  const response= await dispatch(changePass({UserId,oldPassword,newPassword})).unwrap();
  console.log('Password change response:', response);
    SetChangePassModal(false);
    message.success('Changed password successfully');
    }
    catch(error:any){
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      message.error(`Failed to change password: ${errorMessage}`);
    }
  };


 
  return (
    <header className="bg-white shadow-md w-full fixed z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className=" lg:text-2xl font-semibold text-purple-600 sm:text-sm md:text-sm">
          {userRole === "therapist" ? t('Therapist_dashboard') : t('Admin_dashboard')}
        </h1>

        <div className="flex gap-4 items-center">
          <div className="text-gray-600 text-xl">
            <select
              id="languageSelect"
              className="form-select p-1 rounded border-2 border-gray-100"
              aria-label="Default select example"
              onChange={handleLanguageChange} 
            >
              <option value="en">English</option>
              <option value="kin">Kinyarwanda</option>
            </select>
          </div>

          {/* Icons and Buttons */}
          <button className="text-purple-600 mx-3" onClick={handleModal}>
            <IoCalendarNumber size={32} />
          </button>
          <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <MdOutlineMessage className="text-3xl ml-5 text-purple-600" />
          </a>

          <a href="#" data-bs-toggle="dropdown">
            <MdNotificationsNone className="text-3xl ml-5 text-purple-600" />
          </a>

          {/* Profile Section */}
          <div className="flex items-center gap-2  relative">
            <img
            onClick={()=>setOpen(!open)}
             src={profilePhoto || "https://via.placeholder.com/40"}
              alt="User Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            <span className="text-gray-700 font-medium capitalize text-xl cursor-pointer" 
            onClick={()=>setOpen(!open)}>{name}</span>
            {open && (
            <div className="top-12 absolute bg-white px-10 shadow w-60 rounded-md ">
              <ul>
                {menus.map((menu) =>
                  <li
                  key={menu.label}
                  onClick={(menu.onClick)}
                 className="text-black text-lg font-semibold cursor-pointer p-1 mt-1 hover:bg-blue-100 rounded">{menu.label}</li>
                )}
              </ul>
            </div>
            )}
          </div>
        </div>
      </div>
 {/* Modal for calendar */}
      <Modal
        title="Calendar"
        footer={null}
        open={calendarModal}
        onCancel={handleCancel}
        className="text-center"
      >
        <div className="flex justify-center">
        <Calendar 
        onChange={handleCalendarChange} 
       value={value} 
        />
        </div>
      </Modal>
      {/* Modal for Change Password */}

      <Modal open={ChangePassModal}   onCancel={() => {
          CancelPassModal();
          setOldPassword('');
          setNewPassword('');
        }} footer={null} className="float-end mr-5">
        <div className="grid grid-cols-1">
          <h3 className="font-bold text-xl py-3"> Change PassWord</h3>
          <p>Your New Password must be different to the current password.</p>
          <input
            type="password"
            value={oldPassword}
            onChange={(e)=>setOldPassword(e.target.value)}
            className="border-2 p-2 mt-6 rounded-md w-full"
            placeholder="Enter Old Password"
          />{" "}
          <br />
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
            className="border-2 w-full p-2  rounded-md"
          />
          <button
            onClick={()=>handleChangePass(oldPassword,newPassword)}
            disabled={status ==="loading"}
            className="bg-purple-600 p-2 mt-3 w-full rounded-md text-white"
          >
           {status === 'loading' ? 'Loading...' : 'Change Pasword'}
          </button>
        </div>
      </Modal>
    </header>
  );
}