import React, { useState } from "react";
import { BiClinic } from "react-icons/bi";


import {
  FaCalendarAlt,
  FaVideo,
  FaChartBar,
  FaUserMd,
  FaBars,
  FaHome,
  FaTimes,
  FaCog,
  FaRegUser,
  FaList,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaReadme,
  FaEdit,FaFileInvoice,FaResearchgate,FaTemperatureHigh,
} from "react-icons/fa";
import { FaBarsProgress, FaNotesMedical,  FaRegFaceSurprise } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


import { GoChevronDown } from "react-icons/go";
import { IoPeople } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { MdOutlineDocumentScanner, MdOutlineMessage, MdOutlineSettings } from "react-icons/md";
import { PiCallBellBold } from "react-icons/pi";
import { SiArkecosystem, SiFiles, SiDatabricks } from "react-icons/si";

export default function Sidebar({ userRole, setActiveComponent, setUserRole }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [SidebarOpen,setSidebarOpen]=useState(false);
  const navigate = useNavigate();

   const handleNavigation = (component) => {
    navigate(`/${userRole}/${component}`);
  };


  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const toggerOpenBar=()=>{
    setSidebarOpen(!SidebarOpen);
  }

  return (
    <>
  <button className="md:hidden p-4" onClick={toggerOpenBar}>
        {SidebarOpen ? (
          <FaTimes className="text-3xl text-red-700" />
        ) : (
          <FaBars className="text-2xl text-gray-700" /> 
        )}
      </button>
    <div className={`fixed inset-y-0 left-0 transform ${SidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 bg-white bg-opacity-90 overflow-y-auto transition duration-200 ease-in-out z-10 md:relative`}>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-purple-600">Dashboard</h2>
        {/* <button
          onClick={() => setUserRole(userRole === "therapist" ? "admin" : "therapist")}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition duration-200"
        >
          Switch to {userRole === "therapist" ? "Admin" : "Therapist"}
        </button> */}
      </div>
      <nav className="mt-8">
        <a onClick={() => setActiveComponent('home')} className="cursor-pointer flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200">
          <FaHome className="mr-3" /> Home
        </a>
        {userRole === "therapist" ? (
          <>
            {/* <a
              onClick={() => setActiveComponent("videoCall")}
              className="cursor-pointer flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200"
            > */}
            <a onClick={() => setActiveComponent("appointments")} className="cursor-pointer flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200">
              <FaCalendarAlt className="mr-3" /> View Appointments
            </a>
            <a onClick={() => setActiveComponent("videoCall")} className="cursor-pointer flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200">
              <FaVideo className="mr-3" /> Make Video Call
            </a>
            <a
              onClick={() => setActiveComponent('Patients')}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
            >
              <FaList className="mr-3" /> Patients List
            </a>
            {/* <a
              onClick={() => setActiveComponent('Messages')}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
            > */}
            <a onClick={() => setActiveComponent('Messages')} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <MdOutlineMessage className="mr-3" /> Patients Messages
            </a>
            <a
              onClick={() => setActiveComponent('reports')}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
            >
              <FaChartBar className="mr-3" /> View Reports
            </a>
            <div className="relative">
              <a
                onClick={() => toggleDropdown("TreatmentPlan")}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
              >
                <FaCalendarCheck className="mr-3" /> Treatment Plan <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "TreatmentPlan" && (
                <div className="ml-6">
                  <a
                    onClick={() => setActiveComponent("TreatmentPlan")}
                    className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
                  >
                    <p className="flex"><LuDot className="m-1" />Create and Update</p>
                  </a>
                  <a
                    onClick={() => setActiveComponent("SetGoal")}
                    className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
                  >
                    <p className="flex"><LuDot className="m-1 text-sm" /> Set Goals and Milestones</p>
                  </a>
                </div>
              )}
            </div>
            <div className="relative">
              <a
                onClick={() => toggleDropdown("MedicationManagement")}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
              >
                <FaNotesMedical className="mr-3" /> Medication Management <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "MedicationManagement" && (
                <div className="ml-6">
                  <a
                    onClick={() => setActiveComponent("TrackPatient")}
                    className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
                  >
                    <p className="flex"><LuDot className="m-1" />Track Patient</p>
                  </a>
                  <a
                    onClick={() => setActiveComponent("Recommandation")}
                    className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
                  >
                    <p className="flex"><LuDot className="m-1 text-sm" /> Provide Recommendations</p>
                  </a>
                </div>
              )}
            </div>
            <div className="relative">
              <a
                onClick={() => toggleDropdown("PatientProgress")}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
              >
                <FaBarsProgress className="mr-3" /> Patient Progress <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "PatientProgress" && (
                <div className="ml-6">
                  <a
                    onClick={() => setActiveComponent("patientChat")}
                    className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
                  >
                    <p className="flex"><LuDot className="m-1" />Patient Chart</p>
                  </a>
                  <a
                    onClick={() => setActiveComponent("appointment")}
                    className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
                  >
                    <p className="flex"><LuDot className="m-1 text-sm" /> Report</p>
                  </a>
                </div>
              )}
            </div>
            <a
              onClick={() => setActiveComponent('Record')}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
            >
              <FaEdit className="mr-3" /> Recording Patient
              </a>
            <a onClick={() => setActiveComponent('settings')} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <MdOutlineSettings className="mr-3" /> Setting
            </a>
            <a
              onClick={() => setActiveComponent('education')}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
            >
              <FaReadme className="mr-3" /> Education Resources
            </a>
            <a
              onClick={() => setActiveComponent('Chat')}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
            >
              <FaRegFaceSurprise className="mr-3" /> Referral and Collaboration
            </a>
            <a
              onClick={() => setActiveComponent('invoice')}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
            >
              <FaFileInvoice className="mr-3" /> Billing and Insurance
            </a>
            <a
              onClick={() => setActiveComponent('patients feedback')}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
            >
              <FaResearchgate className="mr-3" /> Patients Feedback
            </a>
            <a
              onClick={() => setActiveComponent('Emegency')}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
            >
              <FaTemperatureHigh className="mr-3" /> Emergency
            </a>
            <div className="relative">
              <a
                onClick={() => toggleDropdown("Notification")}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
              >
                <PiCallBellBold className="mr-3" /> Notification <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "Notification" && (
                <div className="ml-6">
                  <a
                    onClick={() => setActiveComponent("sendNot")}
                    className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
                  >
                    <p className="flex"><LuDot className="m-1" />Send Notification</p>
                  </a>
                  <a
                    onClick={() => setActiveComponent("Notification")}
                    className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
                  >
                    <p className="flex"><LuDot className="m-1 text-sm" /> View Notification</p>
                  </a>
                </div>
              )}
            </div> 
          </>
        ) : (
          <>

            <a onClick={() => setActiveComponent('therapists')} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <FaUserMd className="mr-3" /> View Therapists
            </a>
       
           
            <div className="relative">
              <a onClick={() => toggleDropdown("userManagement")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                <FaRegUser className="mr-3 text-sm" /> User Management <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "userManagement" && (
                <div className="ml-6">
                  <a onClick={() => setActiveComponent("users")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1" /> User details</p>
                  </a>
                 
                  <a onClick={() => setActiveComponent("engagement")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1 text-sm" /> User Engagement</p>
                  </a>
                </div>
              )}
            </div>
            <div className="relative">
              <a onClick={() => toggleDropdown("patientManagement")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                <IoPeople className="mr-3" /> Patient Management <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "patientManagement" && (
                <div className="ml-6">
                  <a onClick={() => setActiveComponent("Patient list")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1" /> Patient List</p>
                  </a>
                  <a onClick={() => setActiveComponent("appointment")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1 text-sm" /> Appointments</p>
                  </a>
                  <a onClick={() => setActiveComponent("Messages")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1 text-sm" /> Patient Message</p>
                  </a>
                </div>
              )}
            </div>
            <div className="relative">
              <a onClick={() => toggleDropdown("systemManagement")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                <SiArkecosystem className="mr-3" /> System Management <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "systemManagement" && (
                <div className="ml-6">
                 <a onClick={() => setActiveComponent("roles")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1 text-sm" /> Role and Permissions</p>
                  </a>
                 
             
                  <a onClick={() => setActiveComponent("Content Management")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1 text-sm" /> Content Management</p>
                  </a>
                </div>
              )}
            </div>
            
           
         
            <a onClick={() => setActiveComponent("communication")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <PiCallBellBold className="mr-3 text-xl" /> Community Management
            </a>
            <a onClick={() => setActiveComponent("electronic health records")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <SiFiles className="mr-3" /> Electronic Health Records
              </a>
            <div className="relative">
              <a onClick={() => toggleDropdown("dataManagement")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                <SiDatabricks className="mr-3" /> Data Management <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "dataManagement" && (
                <div className="ml-6">
                  <a onClick={() => setActiveComponent("reports")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1" /> Data Reports</p>
                  </a>
                  <a onClick={() => setActiveComponent("data security")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1 text-sm" /> Data Security</p>
                  </a>
                  <a onClick={() => setActiveComponent("data backup")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1 text-sm" /> Backup and Recovery</p>
                  </a>
                </div>
              )}
            </div>
            <a onClick={() => setActiveComponent("financial")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <FaMoneyBillWave className="mr-3 text-2xl" /> Financial and Billing Management
            </a>
            <a onClick={() => setActiveComponent("legal and compliance")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <p className="flex"><MdOutlineDocumentScanner className="m-1 text-xl" /> Legal and Compliance</p>
            </a>
            <a onClick={() => setActiveComponent("settings")} className="flex items-center text-2xl px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <FaCog className="mr-3" /> Settings
            </a>
           
          </>
        )}
      </nav>
    </div>
    </>
  );
}
