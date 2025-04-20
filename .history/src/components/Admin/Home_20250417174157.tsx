import {
  FaCalendarAlt,
  FaVideo,
  FaChartBar,
  FaUserMd,
  FaUsers,
  FaMoneyBillWave,
  FaClipboardList,
  FaShieldAlt,
  FaBell,
  FaCog
} from "react-icons/fa";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
} from "chart.js";
import { MdAddCircle, MdSecurity, MdPeople, MdAccessTime } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Image, Input, Modal, Select, Badge, Tabs, Progress, Dropdown, Menu, DatePicker } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { getAllTherapists, SelectedTotalTherapist } from "../../Redux/Adminslice/ThearpySlice";
import { selectedTotalUser } from "../../Redux/Adminslice/UserSlice";
import { SelectedTotalPatints } from "../../Redux/Adminslice/PatientSlice";
import { BiCalendar, BiPhone, BiUser, BiSearchAlt } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoMdNotifications } from "react-icons/io";

const { TabPane } = Tabs;
const { Option } = Select;

Chart.register(
  DoughnutController, 
  ArcElement, 
  Legend, 
  Tooltip, 
  LineController, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarController,
  BarElement
);

type ChartRefType = Chart<"doughnut", number[], string>;

const list = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Cognitive Behavioral Therapy",
    phone: "+250 789897235",
    amount: "$250",
    lastmeet: "2024.08.12",
    status: "Completed"
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Psychodynamic Therapy",
    phone: "+250 789334235",
    amount: "$180",
    lastmeet: "2024.08.14",
    status: "Scheduled"
  },
  {
    id: 3,
    name: "Muvunyi Eric",
    role: "Child Psychology",
    phone: "+250 789262736",
    amount: "$200",
    lastmeet: "2024.08.12",
    status: "Completed"
  },
  {
    id: 4,
    name: "Sarah Mutoni",
    role: "Art Therapy",
    phone: "+250 789776541",
    amount: "$175",
    lastmeet: "2024.08.16",
    status: "Pending"
  }
];

// System notifications
const notifications = [
  {
    id: 1,
    title: "New Therapist Registration",
    message: "Dr. Rebecca Smith has registered as a new therapist",
    time: "10 minutes ago",
    type: "info"
  },
  {
    id: 2,
    title: "System Maintenance",
    message: "Scheduled system maintenance on August 20, 2024",
    time: "2 hours ago",
    type: "warning"
  },
  {
    id: 3,
    title: "Payment Received",
    message: "Payment of $150 received from patient ID: 2340",
    time: "Yesterday",
    type: "success"
  }
];

// Recent activities
const activities = [
  {
    id: 1,
    activity: "User account created",
    user: "John Doe",
    time: "Today, 09:30 AM"
  },
  {
    id: 2,
    activity: "Appointment scheduled",
    user: "Mary Smith",
    time: "Today, 11:45 AM"
  },
  {
    id: 3,
    activity: "Payment processed",
    user: "Robert Johnson",
    time: "Yesterday, 03:20 PM"
  },
  {
    id: 4,
    activity: "Content updated",
    user: "Admin",
    time: "Yesterday, 05:15 PM"
  }
];

type Meeting = {
  name: string;
  phoneNumber?: string;
  time: string;
  link: string;
  status?: string;
};

interface HomeProps {
  userRole: string;
}

interface Therapist {
  personalInformation?: {
    gender?: string;
  };
}

interface Patient {
  personalInformation?: {
    gender?: string;
  };
}

export const Home = ({ userRole }: HomeProps) => {
  const [visible, setVisible] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartRefUser = useRef<ChartRefType | null>(null);
  const chartIns = useRef<HTMLCanvasElement | null>(null);
  const chartInsTherapy = useRef<Chart | null>(null);
  const chartPat = useRef<HTMLCanvasElement | null>(null);
  const chartInsPat = useRef<ChartRefType | null>(null);
  const systemHealthRef = useRef<HTMLCanvasElement | null>(null);
  const systemHealthChart = useRef<Chart | null>(null);
  const userActivityRef = useRef<HTMLCanvasElement | null>(null);
  const userActivityChart = useRef<Chart | null>(null);
  const dispatch = useDispatch<any>();

  const TherapyStatus = useSelector((state: any) => state.Therapy.status);
  const PatientStatus = useSelector((state: any) => state.patients.status);
  const UserStatus = useSelector((state: any) => state.users.status);
  
  const TotalTherapist = useSelector(SelectedTotalTherapist);
  const TotalUser = useSelector(selectedTotalUser);
  const TotalPatients = useSelector(SelectedTotalPatints);

  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([
    {
      name: "Patrick Niyomugabo",
      phoneNumber: "0789897235",
      time: "2:00 - 3:00 PM",
      link: "https://meet.google.com",
      status: "Confirmed"
    },
    {
      name: "Maria Uwase",
      phoneNumber: "0789334561",
      time: "4:30 - 5:30 PM",
      link: "https://zoom.us/j/123456789",
      status: "Pending"
    }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    time: "",
    link: "",
    role: "",
    status: "Pending"
  });

  useEffect(() => {
    if (TherapyStatus === 'idle') {
      dispatch(getAllTherapists() as any);
    }
  }, [TherapyStatus, dispatch]);

  const therapists = useSelector((state: RootState) => state.Therapy.therapists);
  const patients = useSelector((state: RootState) => state.patients.patients);

  // Users gender chart
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartRefUser.current) {
          chartRefUser.current.destroy();
        }
        chartRefUser.current = new Chart(ctx as ChartItem, {
          type: "doughnut",
          data: {
            labels: ["Female [16]", "Male [13]"],
            datasets: [
              {
                data: [16, 13],
                backgroundColor: ["#4C51BF", "#ED64A6"],
                borderColor: ["#FFFFFF", "#FFFFFF"],
                borderWidth: 2
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  font: {
                    size: 12
                  }
                }
              }
            }
          }
        });
      }
    }
  }, []);

  // Function to get all gender counts for Therapist
  const CountGender = (therapists: Therapist[]) => {
    const female = therapists?.filter(t => t.personalInformation?.gender?.toLowerCase() === 'female').length;
    const male = therapists?.filter(t => t.personalInformation?.gender?.toLowerCase() === 'male').length;
    return { female, male };
  };

  // Therapist gender chart
  useEffect(() => {
    if (chartIns.current) {
      const ctx = chartIns.current?.getContext("2d");

      if (chartInsTherapy.current) {
        chartInsTherapy.current?.destroy();
      }

      const { female, male } = CountGender(therapists);
      
      chartInsTherapy.current = new Chart(ctx as ChartItem, {
        type: "doughnut",
        data: {
          labels: [`Female [${female}]`, `Male [${male}]`],
          datasets: [
            {
              data: [female, male],
              backgroundColor: ["#38B2AC", "#4299E1"],
              borderColor: ["#FFFFFF", "#FFFFFF"],
              borderWidth: 2
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 12
                }
              }
            }
          }
        }
      });
    }
  }, [therapists]);

  // Function for Break down Gender for Patient 
  const CountPatientGender = (patients: Patient[]) => {
    const female = patients?.filter(p => p.personalInformation?.gender?.toLowerCase() === 'female').length;
    const male = patients?.filter(p => p.personalInformation?.gender?.toLowerCase() === 'male').length;
    return { female, male };
  };

  // Patient gender chart
  useEffect(() => {
    if (chartPat.current) {
      const ctx = chartPat.current.getContext("2d");
      if (chartInsPat.current) {
        chartInsPat.current.destroy();
      }
      const { female, male } = CountPatientGender(patients);
      chartInsPat.current = new Chart(ctx as ChartItem, {
        type: "doughnut",
        data: {
          labels: [`Female [${female}]`, `Male [${male}]`],
          datasets: [
            {
              data: [female, male],
              backgroundColor: ["#9F7AEA", "#F6AD55"],
              borderColor: ["#FFFFFF", "#FFFFFF"],
              borderWidth: 2
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 12
                }
              }
            }
          }
        }
      });
    }
  }, [patients]);

  // System Health Chart
  useEffect(() => {
    if (systemHealthRef.current) {
      const ctx = systemHealthRef.current.getContext("2d");
      if (systemHealthChart.current) {
        systemHealthChart.current.destroy();
      }
      
      systemHealthChart.current = new Chart(ctx as ChartItem, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            {
              label: "Server Response Time (ms)",
              data: [250, 230, 290, 220, 210, 240, 200],
              borderColor: "#4C51BF",
              backgroundColor: "rgba(76, 81, 191, 0.1)",
              tension: 0.4,
              fill: true
            },
            {
              label: "Uptime (%)",
              data: [99.8, 99.9, 99.7, 99.9, 100, 99.8, 99.9],
              borderColor: "#38B2AC",
              backgroundColor: "rgba(56, 178, 172, 0.1)",
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            x: {
              ticks: {
                color: "#4B5563"
              },
              grid: {
                display: false
              }
            },
            y: {
              ticks: {
                color: "#4B5563"
              },
              grid: {
                color: "rgba(156, 163, 175, 0.2)"
              }
            }
          }
        }
      });
    }
  }, []);

  // User Activity Chart
  useEffect(() => {
    if (userActivityRef.current) {
      const ctx = userActivityRef.current.getContext("2d");
      if (userActivityChart.current) {
        userActivityChart.current.destroy();
      }
      
      userActivityChart.current = new Chart(ctx as ChartItem, {
        type: "bar",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Active Users",
              data: [65, 72, 78, 69, 85, 55, 40],
              backgroundColor: "rgba(129, 140, 248, 0.8)",
              borderRadius: 4
            },
            {
              label: "New Sessions",
              data: [35, 40, 45, 38, 50, 30, 25],
              backgroundColor: "rgba(167, 139, 250, 0.8)",
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            x: {
              ticks: {
                color: "#4B5563"
              },
              grid: {
                display: false
              }
            },
            y: {
              ticks: {
                color: "#4B5563"
              },
              grid: {
                color: "rgba(156, 163, 175, 0.2)"
              }
            }
          }
        }
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSend = () => {
    if (formData.name && formData.time && formData.link) {
      const newMeeting = {
        name: `${formData.name}:: ${formData.role}`,
        phoneNumber: formData.phone,
        time: formData.time,
        link: formData.link,
        status: formData.status
      };
      setUpcomingMeetings([...upcomingMeetings, newMeeting]);
      setFormData({ name: "", phone: "", time: "", link: "", role: "", status: "Pending" });
      setVisible(false);
    } else {
      console.log("Please fill out all required fields");
    }
  };

  const handleModal = () => {
    setVisible(true);
  };

  const handleCancelModal = () => {
    setVisible(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'green';
      case 'scheduled':
      case 'confirmed':
        return 'blue';
      case 'pending':
        return 'gold';
      default:
        return 'default';
    }
  };

  const toggleNotifications = () => {
    setNotificationDropdown(!notificationDropdown);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header section with user greeting and quick actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="text-gray-800 text-3xl font-medium mb-2">
            Welcome back, {userRole === "therapist" ? "Dr. Smith" : "Admin"}!
          </h3>
          <p className="text-gray-600">Here's what's happening with your platform today.</p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-4">
          <div className="relative">
            <button 
              className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all"
              onClick={toggleNotifications}
            >
              <Badge count={notifications.length} overflowCount={99}>
                <IoMdNotifications size={22} className="text-indigo-600" />
              </Badge>
            </button>
            
            {notificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${
                          notification.type === 'info' ? 'bg-blue-100 text-blue-600' : 
                          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
                          'bg-green-100 text-green-600'
                        }`}>
                          <IoMdNotifications size={16} />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <span className="text-xs font-medium text-gray-500 mt-2 block">{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View all notifications</a>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <Button 
              type="primary" 
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 border-0 shadow-md"
              icon={<FaCog className="mr-2" />}
            >
              Settings
            </Button>
          </div>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              AD
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="flex items-center bg-white rounded-lg shadow-md px-4 py-3">
          <BiSearchAlt size={24} className="text-gray-500 mr-3" />
          <input 
            type="text" 
            placeholder="Search for users, therapists, reports..." 
            className="flex-1 outline-none text-gray-700 placeholder-gray-500"
          />
          <Button type="primary" className="bg-indigo-600 hover:bg-indigo-700 border-0">
            Search
          </Button>
        </div>
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {userRole === "admin" && (
          <>
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75 text-white">
                  <FaUserMd size={24} />
                </div>
                <div className="ml-5">
                  <h4 className="text-2xl font-semibold text-gray-700">
                    {TherapyStatus === "loading" ? "..." : TotalTherapist}
                  </h4>
                  <div className="text-gray-500">Total Therapists</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">+5% from last month</span>
                  <a href="#" className="text-indigo-600 hover:underline">Details</a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-600 bg-opacity-75 text-white">
                  <FaUsers size={24} />
                </div>
                <div className="ml-5">
                  <h4 className="text-2xl font-semibold text-gray-700">
                    {UserStatus === "loading" ? "..." : TotalUser}
                  </h4>
                  <div className="text-gray-500">Total Users</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">+12% from last month</span>
                  <a href="#" className="text-indigo-600 hover:underline">Details</a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-600 bg-opacity-75 text-white">
                  <FaUsers size={24} />
                </div>
                <div className="ml-5">
                  <h4 className="text-2xl font-semibold text-gray-700">
                    {PatientStatus === "loading" ? "..." : TotalPatients}
                  </h4>
                  <div className="text-gray-500">Total Patients</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">+8% from last month</span>
                  <a href="#" className="text-indigo-600 hover:underline">Details</a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-600 bg-opacity-75 text-white">
                  <FaMoneyBillWave size={24} />
                </div>
                <div className="ml-5">
                  <h4 className="text-2xl font-semibold text-gray-700">$9,850</h4>
                  <div className="text-gray-500">Monthly Revenue</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">+15% from last month</span>
                  <a href="#" className="text-indigo-600 hover:underline">Details</a>
                </div>
              </div>
            </div>
          </>
        )}

        {userRole === "therapist" && (
          <>
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75 text-white">
                  <FaCalendarAlt size={24} />
                </div>
                <div className="ml-5">
                  <h4 className="text-2xl font-semibold text-gray-700">8</h4>
                  <div className="text-gray-500">New Appointments</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-600 bg-opacity-75 text-white">
                  <FaVideo size={24} />
                </div>
                <div className="ml-5">
                  <h4 className="text-2xl font-semibold text-gray-700">3</h4>
                  <div className="text-gray-500">Upcoming Video Calls</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-pink-600 bg-opacity-75 text-white">
                  <FaChartBar size={24} />
                </div>
                <div className="ml-5">
                  <h4 className="text-2xl font-semibold text-gray-700">5</h4>
                  <div className="text-gray-500">New Reports</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-500 bg-opacity-75 text-white">
                  <FaMoneyBillWave size={24} />
                </div>
                <div className="ml-5">
                  <h4 className="text-2xl font-semibold text-gray-700">$1,250</h4>
                  <div className="text-gray-500">Weekly Earnings</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {userRole === "admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
            <h4 className="text-xl font-semibold text-indigo-600 mb-4">User Gender Breakdown</h4>
            <canvas ref={chartRef} height="200"></canvas>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
            <h4 className="text-xl font-semibold text-indigo-600 mb-4">Therapist Gender Breakdown</h4>
            <canvas ref={chartIns} height="200"></canvas>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
            <h4 className="text-xl font-semibold text-indigo-600 mb-4">Patient Gender Breakdown</h4>
            <canvas ref={chartPat} height="200"></canvas>
          </div>
        </div>
      )}

      {/* System Health and Analytics Section */}
      {userRole === "admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-indigo-600">System Health</h4>
              <Badge status="success" text="All Systems Normal" />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Server Uptime</p>
                <p className="text-indigo-600 font-semibold text-lg">99.9%</p>
                <Progress percent={99.9} size="small" status="active" />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Response Time</p>
                <p className="text-indigo-600 font-semibold text-lg">230ms</p>
                <Progress percent={85} size="small" status="active" />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">Memory Usage</p>
                <p className="text-indigo-600 font-semibold text-lg">65%</p>
                <Progress percent={65} size="small" status="active" />
                </div>
            </div>
            </div>
            </div>
            
    )
  

    
};