import { useState,SetStateAction,Dispatch, useEffect } from "react";
// import { BiClinic } from "react-icons/bi";

import {
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
  FaEdit,
  FaForward,
} from "react-icons/fa";

import { Image } from "antd";
import { FaBarsProgress, FaNotesMedical, FaRegFaceSurprise } from "react-icons/fa6";
import { GoChevronDown } from "react-icons/go";
import { IoPeople } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import { MdOutlineDocumentScanner, MdOutlineMessage, MdOutlineSettings } from "react-icons/md";
import { PiCallBellBold } from "react-icons/pi";
import { SiArkecosystem, SiFiles, SiDatabricks } from "react-icons/si";
import { EyeIcon } from "lucide-react";


interface SidebarProps {
  userRole: string;
  setActiveComponent: Dispatch<SetStateAction<string>>;
  setUserRole: Dispatch<SetStateAction<string>>;
}
export default function Sidebar(props: SidebarProps) {
  const { userRole, setActiveComponent } = props;
  const [profilePhoto, setProfilePhoto] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState('');

  const toggleDropdown = (dropdown:any) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const toggleOpenBar = () => {
    setSidebarOpen(!SidebarOpen);
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

  return (
    <>
      <button className="md:hidden fixed top-0 left-0 p-4 z-20" onClick={toggleOpenBar}>
        {SidebarOpen ? (
          <FaTimes className="text-3xl text-red-700" />
        ) : (
          <FaBars className="text-2xl text-gray-700" />
        )}
      </button>
    <div className={`fixed overflow-auto top-0 h-full  transform ${SidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-62 bg-white bg-opacity-90 transition duration-200 ease-in-out z-10 `}>
    <div className="flex flex-col h-full">
      <div className="px-6 py-2">
        <h2 className="text-3xl font-bold text-purple-600">Dashboard</h2>
      </div>
      <nav className="mt-8">
     
        {userRole === "therapist" ? (
          
           <>
               <div className="bg-gray-100  mx-5 rounded-md">
            <div className="rounded-full flex justify-center mx-5 p-2">
          <Image  src={profilePhoto || "https://via.placeholder.com/40"} 
            alt="Friend" className="my-1 rounded-full " width={150} height={150} />
            </div>
            <div className="flex justify-center">
              <strong className="text-lg text-gray-500">{name}</strong>
            </div>
            <div className="text-black flex justify-center my-3 gap-3 text-xl">
              <FaEdit size={20}/> 
              <EyeIcon size={25}/>
            </div>
          </div>
              <a onClick={() => setActiveComponent("Home")} className="cursor-pointer flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200">
             <FaHome className="mr-3" /> Home
           </a>
           <div className="relative">
             <a
               onClick={() => toggleDropdown("appointments")}
               className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
             >
               <FaNotesMedical className="mr-3" /> Appointments Management <GoChevronDown className="ml-1" />
             </a>
             {openDropdown === "appointments" && (
               <div className="ml-6">
                 <a
                   onClick={() => setActiveComponent("AvaillableSlots")}
                   className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
                 >
                   <p className="flex"><LuDot className="m-1" /> Availlable slots</p>
                 </a>
                 <a
                   onClick={() => setActiveComponent("Appointmets")}
                   className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
                 >
                   <p className="flex"><LuDot className="m-1 text-sm" /> Appointments</p>
                 </a>
                 <a
                   onClick={() => setActiveComponent("Appointment Changes")}
                   className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
                 >
                   <p className="flex"><LuDot className="m-1 text-sm" /> Appointment Changes</p>
                 </a>
               </div>
             )}
           </div>
           <a onClick={() => setActiveComponent("TreatmentPlan")} className="cursor-pointer flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200">
             <FaCalendarCheck className="mr-3" /> Treatment Plan Management 
           </a>
           <a onClick={() => setActiveComponent("videoCall")} className="cursor-pointer flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200">
             <FaVideo className="mr-3" /> Make Video Call
           </a>
           <a
             onClick={() => setActiveComponent('PatientsList')}
             className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer"
           >
             <FaList className="mr-3" /> Patients List
           </a>
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
             <FaRegFaceSurprise className="mr-3" /> Chat
           </a>
           <a onClick={() => setActiveComponent('settings')} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
             <MdOutlineSettings className="mr-3" /> Setting
           </a>
         </>
          
        ) : (
          <>
          <div className="bg-gray-100  mx-5 rounded-md">
            <div className="rounded-full flex justify-center mx-5 p-2">
          <Image  src={profilePhoto || "https://via.placeholder.com/40"} 
            alt="Friend" className="my-1 rounded-full " width={150} height={150} />
            </div>
            <div className="flex justify-center">
              <strong className="text-lg text-gray-500">{name}</strong>
            </div>
            <div className="text-black flex justify-center my-3 gap-3 text-xl">
              <FaEdit size={20}/> 
              <EyeIcon size={25}/>
            </div>
          </div>
             <a onClick={() => setActiveComponent('home')} className="cursor-pointer flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200">
          <FaHome className="mr-3" /> Home
        </a>
            <a onClick={() => setActiveComponent('therapiest')} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <FaUserMd className="mr-3" /> View Therapists
            </a>
       
           
            <div className="relative">
              <a onClick={() => toggleDropdown("userManagement")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                <FaRegUser className="mr-3 text-sm" /> User Management <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "userManagement" && (
                <div className="ml-6">
                  <a onClick={() => setActiveComponent("Admin Users")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1" /> User details</p>
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
                  <a onClick={() => setActiveComponent("AdminPatientList")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1" /> Patient List</p>
                  </a>
                  <a onClick={() => setActiveComponent("Patient_Appointment")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1 text-sm" /> Appointments</p>
                  </a>
                  <a onClick={() => setActiveComponent("Patient_Messages")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
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
                 <a onClick={() => setActiveComponent("Roles and Permissions")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1 text-sm" /> Role and Permissions</p>
                  </a>
                 
             
                  <a onClick={() => setActiveComponent("Content Management")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1 text-sm" /> Content Management</p>
                  </a>
                </div>
              )}
            </div>
            <a onClick={() => setActiveComponent("Community Management")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <PiCallBellBold className="mr-3 text-xl" /> Community Management
            </a>

            <div className="relative">
              <a onClick={() => toggleDropdown("CourseManagement")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                <SiDatabricks className="mr-3" />Courses Management <GoChevronDown className="ml-1" />
              </a>
            {
              openDropdown ==='CourseManagement' &&(
                <div className="ml-6">
                <a onClick={() => setActiveComponent("Courses Management")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                  <p className="flex"><FaForward className="m-1" />Courses Management</p>
                </a>
                <a onClick={() => setActiveComponent("Artcicle_management")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                <FaForward className="mr-3" /> Article Management
                </a>
                </div>
              )
            }
            </div>

            <div className="relative">
              <a onClick={() => toggleDropdown("dataManagement")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                <SiDatabricks className="mr-3" /> Report Management <GoChevronDown className="ml-1" />
              </a>
              {openDropdown === "dataManagement" && (
                <div className="ml-6">
                  <a onClick={() => setActiveComponent("BillingReports")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1" /> Billing Reports</p>
                  </a>
                  <a onClick={() => setActiveComponent("Data Security")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1 text-sm" /> Data Security</p>
                  </a>
                  <a onClick={() => setActiveComponent("Data backup")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
                    <p className="flex"><LuDot className="m-1 text-sm" /> Backup and Recovery</p>
                  </a>
                </div>
              )}
            </div>
            <a onClick={() => setActiveComponent("Financial Management")} className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <FaMoneyBillWave className="mr-3 text-2xl" /> Financial and Billing Management
            </a>
            <a onClick={() => setActiveComponent("Legal and Complaints")} className="block px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <p className="flex"><MdOutlineDocumentScanner className="m-1 text-xl" /> Legal and Compliance</p>
            </a>
            <a onClick={() => setActiveComponent("settings")} className="flex items-center text-2xl px-6 py-3 text-gray-700 hover:bg-purple-100 transition duration-200 cursor-pointer">
              <FaCog className="mr-3" /> Settings
            </a>
           
          </>
        )}
      </nav>
    </div>
    </div>
    </>
  );
}
