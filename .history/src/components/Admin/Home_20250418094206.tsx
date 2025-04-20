"use client"

import type React from "react"

import {
  FaCalendarAlt,
  FaVideo,
  FaChartBar,
  FaUserMd,
  FaUsers,
  FaShieldAlt,
  FaDatabase,
  FaServer,
  FaFileAlt,
  FaUserShield,
  FaLock,
  FaClipboardList,
} from "react-icons/fa"
import { MdAddCircle, MdSecurity, MdBackup, MdSettings } from "react-icons/md"
import { Tabs, Card, Progress, Badge, Alert, Tag } from "antd"
import { Chart, DoughnutController, ArcElement, Legend, Tooltip, type ChartItem } from "chart.js"
import { useEffect, useRef, useState } from "react"
import { Button, Form, Input, Modal } from "antd"
import FormItem from "antd/es/form/FormItem"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../Redux/store"
import { getAllTherapists, SelectedTotalTherapist } from "../../Redux/Adminslice/ThearpySlice"
import { selectedTotalUser } from "../../Redux/Adminslice/UserSlice"
import { SelectedTotalPatints } from "../../Redux/Adminslice/PatientSlice"
import { BiCalendar, BiPhone, BiUser } from "react-icons/bi"
type ChartRefType = Chart<"doughnut", number[], string>

Chart.register(DoughnutController, ArcElement, Legend, Tooltip)

const list = [
  {
    id: 1,
    name: "Alice",
    role: "Cognitive Behavioral Therapy",
    phone: "+250 789897235",
    amount: "$20",
    lastmeet: "2024.08.12",
  },

  {
    id: 3,
    name: "Muvunyi",
    role: "Child Psychology",
    phone: "+250 789262736",
    amount: "$30",
    lastmeet: "2024.08.12",
  },
]
type Meeting = {
  name: string
  phoneNumber?: string // Made optional since not all meetings have it
  time: string
  link: string
}
interface HomeProps {
  userRole: string
}
interface Therapist {
  personalInformation?: {
    gender?: string
  }
}

interface Patient {
  personalInformation?: {
    gender?: string
  }
}
const Home = ({ userRole }: HomeProps) => {
  const [visible, setVisible] = useState(false)
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartRefUser = useRef<ChartRefType | null>(null)
  const chartIns = useRef<HTMLCanvasElement | null>(null)
  const chartInsTherapy = useRef<Chart | null>(null)
  const chartPat = useRef<HTMLCanvasElement | null>(null)
  const chartInsPat = useRef<ChartRefType | null>(null)
  const dispatch = useDispatch<any>()

  const TherapyStatus = useSelector((state: any) => state.Therapy.status)
  const PatientStatus = useSelector((state: any) => state.patients.status)
  const UserStatus = useSelector((state: any) => state.users.status)

  const TotalTherapist = useSelector(SelectedTotalTherapist)
  const TotalUser = useSelector(selectedTotalUser)
  const TotalPatients = useSelector(SelectedTotalPatints)

  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([
    {
      name: "Ptrick",
      phoneNumber: "0789897235",
      time: "2:00 - 3:00",
      link: "https://meet.google.com",
    },
  ])
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    time: "",
    link: "",
    role: "",
  })

  useEffect(() => {
    if (TherapyStatus === "idle") {
      dispatch(getAllTherapists() as any)
    }
  }, [TherapyStatus, dispatch])

  const therapists = useSelector((state: RootState) => state.Therapy.therapists)
  const patients = useSelector((state: RootState) => state.patients.patients)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        if (chartRefUser.current) {
          chartRefUser.current.destroy()
        }
        // const {female,male}=counterUserGender(users);
        chartRefUser.current = new Chart(ctx as ChartItem, {
          type: "doughnut",
          data: {
            labels: ["Female[16]", "Male[13]"],
            datasets: [
              {
                data: [50, 30],
                backgroundColor: ["#FBA834", "#387ADF"],
              },
            ],
          },
        })
      }
    }
  }, [])
  // function to get all gender counts for Therapist .
  const CountGender = (therapists: Therapist[]) => {
    const female = therapists?.filter((t) => t.personalInformation?.gender?.toLowerCase() === "female").length
    const male = therapists?.filter((t) => t.personalInformation?.gender?.toLowerCase() === "male").length
    return { female, male }
  }
  useEffect(() => {
    if (chartIns.current) {
      const ctx = chartIns.current?.getContext("2d")

      if (chartInsTherapy.current) {
        chartInsTherapy.current?.destroy()
      }

      const { female, male } = CountGender(therapists)

      chartInsTherapy.current = new Chart(ctx as ChartItem, {
        type: "doughnut",
        data: {
          labels: [`female[${female}]`, `male[${male}]`],
          datasets: [
            {
              data: [female, male],
              backgroundColor: ["#41B06E", "#F7C04A"],
            },
          ],
        },
      })
    }
  }, [])

  // Function for Break down Gender for Patient
  const CountPatientGender = (patients: Patient[]) => {
    const female = patients?.filter((p) => p.personalInformation?.gender?.toLowerCase() === "female").length
    const male = patients?.filter((p) => p.personalInformation?.gender?.toLowerCase() === "male").length
    return { female, male }
  }
  useEffect(() => {
    if (chartPat.current) {
      const ctx = chartPat.current.getContext("2d")
      if (chartInsPat.current) {
        chartInsPat.current.destroy()
      }
      const { female, male } = CountPatientGender(patients)
      chartInsPat.current = new Chart(ctx as ChartItem, {
        type: "doughnut",
        data: {
          labels: [`female[${female}]`, `male[${male}]`],
          datasets: [
            {
              data: [female, male],
              backgroundColor: ["#41B06E", "#387ADF"],
            },
          ],
        },
      })
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSend = () => {
    if (formData.name && formData.time && formData.link) {
      const newMeeting = {
        name: `${formData.name}:: ${formData.role}`,
        phone: formData.phone,
        time: formData.time,
        link: formData.link,
      }
      setUpcomingMeetings([...upcomingMeetings, newMeeting])
      setFormData({ name: "", phone: "", time: "", link: "", role: "" })
      setVisible(false)
    } else {
      console.log("Please fill out all fields")
    }
  }

  const handleModal = () => {
    setVisible(true)
  }
  const hanleCancelModal = () => {
    setVisible(false)
  }
  return (
    <div className="container mx-auto px-6 py-8">
      <h3 className="text-gray-700 text-3xl font-medium mb-6">
        Welcome back, {userRole === "therapist" ? "Dr. Smith" : "Admin"}!
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userRole === "therapist" ? (
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
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 ">
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
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 ">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-600 bg-opacity-75 text-white">
                  <FaUserMd size={24} />
                </div>
                <div className="ml-5">
                  <h4 className="text-2xl font-semibold text-gray-700">
                  {TherapyStatus === "loading" ? "..." : TotalTherapist}
                  </h4>
                  <div className="text-gray-500">Total Therapists</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-600 bg-opacity-75 text-white">
                  <FaUsers size={24} />
                </div>
                <div className="ml-5">
                  <h4 className="text-2xl font-semibold text-gray-700">
                  {UserStatus === "loading" ? "..." : TotalUser}
                  </h4>
                  <div className="text-gray-500">Total Users</div>
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
                      {PatientStatus === "loading" ? "..." : TotalPatients}</h4>
                  <div className="text-gray-500">Total Patients</div>
                </div>
              </div>
            </div>

            
          </>
        )}
      </div>

      {userRole === "admin" && (
  <>
    <Tabs defaultActiveKey="1" className="mt-8 bg-white rounded-lg shadow-xl p-4">
      <Tabs.TabPane tab="Dashboard Overview" key="1">
        <div className="flex gap-7 mb-6">
          <div
            className="border px-11 border-gray-400 bg-white rounded-xl hover:shadow-2xl
            md:w-52 lg:w-full hover:-translate-y-1 transform cursor-pointer duration-300 float-start h-fit pb-2"
          >
            <p className="text-black font-semibold md:text-md text-xl text-center my-3">
              User's Gender BreakDown
            </p>
            <canvas ref={chartRef}></canvas>
          </div>
          <div className="border px-11 border-gray-400 bg-white rounded-xl hover:shadow-2xl hover:-translate-y-1 transform cursor-pointer duration-300 float-start h-fit pb-2 md:w-52 lg:w-full">
            <p className="text-black font-semibold md:text-md text-xl text-center my-3">
              Therapist's Gender BreakDown
            </p>
            <canvas ref={chartIns}></canvas>
          </div>
          <div className="border px-11 border-gray-400 bg-white rounded-xl hover:shadow-2xl hover:-translate-y-1 transform cursor-pointer duration-300 float-start h-fit pb-2 md:w-52 lg:w-full">
            <p className="text-black font-semibold md:text-md text-xl text-center my-3">
              Patient's Gender BreakDown
            </p>
            <canvas ref={chartPat}></canvas>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300">
            <h4 className="text-xl font-semibold text-purple-600 mb-4">System Health</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Server Uptime</span>
                  <span className="text-sm font-medium text-green-600">99.9%</span>
                </div>
                <Progress percent={99.9} status="active" strokeColor="#10B981" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Database Load</span>
                  <span className="text-sm font-medium text-yellow-600">65%</span>
                </div>
                <Progress percent={65} status="active" strokeColor="#F59E0B" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">API Response Time</span>
                  <span className="text-sm font-medium text-green-600">120ms</span>
                </div>
                <Progress percent={85} status="active" strokeColor="#10B981" />
              </div>
            </div>
            <div className="mt-4">
              <Alert 
                message="System Status: Operational" 
                type="success" 
                showIcon 
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300">
            <h4 className="text-xl font-semibold text-purple-600 mb-4">Recent Alerts</h4>
            <div className="space-y-3">
              <Alert
                message="Security Update Required"
                description="System security update available. Schedule maintenance within 7 days."
                type="warning"
                showIcon
                className="mb-3"
              />
              <Alert
                message="Database Backup Completed"
                description="Daily backup completed successfully at 02:00 AM."
                type="success"
                showIcon
                className="mb-3"
              />
              <Alert
                message="New User Registrations"
                description="15 new users registered in the last 24 hours."
                type="info"
                showIcon
              />
            </div>
          </div>
        </div>
      </Tabs.TabPane>

      <Tabs.TabPane tab="User Management" key="2">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-semibold text-purple-600">User Account Management</h4>
            <Button type="primary" className="bg-purple-600 hover:bg-purple-700">
              <MdAddCircle className="mr-1" /> Add New User
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">User ID</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Last Login</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">USR-001</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">John Doe</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">Patient</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Tag color="green">Active</Tag>
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">2023-08-15 14:30</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Button size="small" className="mr-2">Edit</Button>
                    <Button size="small" danger>Suspend</Button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">USR-002</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">Jane Smith</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">Therapist</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Tag color="green">Active</Tag>
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">2023-08-16 09:15</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Button size="small" className="mr-2">Edit</Button>
                    <Button size="small" danger>Suspend</Button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">USR-003</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">Robert Johnson</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">Family Member</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Tag color="red">Inactive</Tag>
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">2023-08-10 11:45</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Button size="small" className="mr-2">Edit</Button>
                    <Button size="small" type="primary" className="bg-green-600 hover:bg-green-700">Activate</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Tabs.TabPane>

      <Tabs.TabPane tab="Security & Compliance" key="3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            title={<span className="text-purple-600 font-semibold"><FaLock className="inline mr-2" /> Data Security</span>} 
            className="shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <FaShieldAlt className="text-green-600 mr-2" /> 
                  <span>Data Encryption</span>
                </span>
                <Tag color="green">Enabled</Tag>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <MdSecurity className="text-green-600 mr-2" /> 
                  <span>Two-Factor Authentication</span>
                </span>
                <Tag color="green">Enabled</Tag>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <FaUserShield className="text-green-600 mr-2" /> 
                  <span>Role-Based Access Control</span>
                </span>
                <Tag color="green">Configured</Tag>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <FaDatabase className="text-yellow-600 mr-2" /> 
                  <span>Database Vulnerability Scan</span>
                </span>
                <Tag color="orange">Scheduled</Tag>
              </div>
              <Button type="primary" className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                Security Settings
              </Button>
            </div>
          </Card>

          <Card 
            title={<span className="text-purple-600 font-semibold"><FaClipboardList className="inline mr-2" /> Compliance Status</span>} 
            className="shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <span>HIPAA Compliance</span>
                </span>
                <Tag color="green">Compliant</Tag>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <span>GDPR Compliance</span>
                </span>
                <Tag color="green">Compliant</Tag>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <span>Data Retention Policy</span>
                </span>
                <Tag color="green">Implemented</Tag>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <span>Privacy Policy</span>
                </span>
                <Tag color="green">Updated</Tag>
              </div>
              <div className="mt-4">
                <Alert 
                  message="Next Compliance Audit" 
                  description="Scheduled for October 15, 2023" 
                  type="info" 
                  showIcon 
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card 
            title={<span className="text-purple-600 font-semibold"><FaFileAlt className="inline mr-2" /> Recent Audit Logs</span>} 
            className="shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Timestamp</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">User</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Action</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">IP Address</th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">2023-08-16 14:32:45</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">admin@example.com</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">User account created</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">192.168.1.105</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">
                      <Tag color="green">Success</Tag>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">2023-08-16 13:15:22</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">therapist@example.com</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">Patient record accessed</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">192.168.1.110</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">
                      <Tag color="green">Success</Tag>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">2023-08-16 11:05:17</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">unknown@example.com</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">Failed login attempt</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">203.0.113.42</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">
                      <Tag color="red">Failed</Tag>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Button>View All Logs</Button>
            </div>
          </Card>
        </div>
      </Tabs.TabPane>

      <Tabs.TabPane tab="System Management" key="4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            title={<span className="text-purple-600 font-semibold"><FaServer className="inline mr-2" /> System Status</span>} 
            className="shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm font-medium text-green-600">42%</span>
                </div>
                <Progress percent={42} status="active" strokeColor="#10B981" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm font-medium text-yellow-600">68%</span>
                </div>
                <Progress percent={68} status="active" strokeColor="#F59E0B" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Disk Space</span>
                  <span className="text-sm font-medium text-green-600">35%</span>
                </div>
                <Progress percent={35} status="active" strokeColor="#10B981" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Network Traffic</span>
                  <span className="text-sm font-medium text-green-600">28%</span>
                </div>
                <Progress percent={28} status="active" strokeColor="#10B981" />
              </div>
            </div>
          </Card>

          <Card 
            title={<span className="text-purple-600 font-semibold"><MdBackup className="inline mr-2" /> Backup Status</span>} 
            className="shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="space-y-4">
              <Alert
                message="Last Backup: Successful"
                description="Database backup completed on August 16, 2023 at 02:00 AM"
                type="success"
                showIcon
                className="mb-3"
              />
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <div className="font-medium">Daily Backup</div>
                  <div className="text-sm text-gray-500">Next scheduled: August 17, 2023 at 02:00 AM</div>
                </div>
                <Badge status="processing" text="Scheduled" />
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <div className="font-medium">Weekly Full Backup</div>
                  <div className="text-sm text-gray-500">Next scheduled: August 20, 2023 at 01:00 AM</div>
                </div>
                <Badge status="processing" text="Scheduled" />
              </div>
              <Button type="primary" className="w-full mt-2 bg-purple-600 hover:bg-purple-700">
                Run Manual Backup
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card 
            title={<span className="text-purple-600 font-semibold"><MdSettings className="inline mr-2" /> System Configuration</span>} 
            className="shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-3">General Settings</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>System Timezone</span>
                    <span className="text-sm text-gray-600">UTC-05:00 (Eastern Time)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Maintenance Mode</span>
                    <Tag color="red">Disabled</Tag>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>User Registration</span>
                    <Tag color="green">Enabled</Tag>
                  </div>
                </div>
              </div>
              <div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button>Reset to Default</Button>
              <Button type="primary" className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
            </div>
          </Card>
        </div>
      </Tabs.TabPane>

      <Tabs.TabPane tab="Support & Tickets" key="5">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-semibold text-purple-600">Support Ticket Management</h4>
            <Button type="primary" className="bg-purple-600 hover:bg-purple-700">
              <MdAddCircle className="mr-1" /> Create New Ticket
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Ticket ID</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Subject</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Reported By</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Priority</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Created</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">TKT-001</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">Cannot access patient records</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">Dr. Jane Smith</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Tag color="red">Open</Tag>
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Tag color="red">High</Tag>
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">2023-08-16 09:15</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Button size="small" className="mr-2">View</Button>
                    <Button size="small" type="primary" className="bg-green-600 hover:bg-green-700">Respond</Button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">TKT-002</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">Payment system error</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">John Doe</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Tag color="orange">In Progress</Tag>
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Tag color="orange">Medium</Tag>
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">2023-08-15 14:30</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Button size="small" className="mr-2">View</Button>
                    <Button size="small" type="primary" className="bg-green-600 hover:bg-green-700">Respond</Button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">TKT-003</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">Feature request: Calendar integration</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">Robert Johnson</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Tag color="green">Resolved</Tag>
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Tag color="blue">Low</Tag>
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">2023-08-10 11:45</td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    <Button size="small" className="mr-2">View</Button>
                    <Button size="small">Reopen</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <Card title="Support Analytics" className="shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h5 className="text-lg font-medium text-gray-700">Open Tickets</h5>
                  <p className="text-3xl font-bold text-red-600 mt-2">5</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h5 className="text-lg font-medium text-gray-700">Avg. Response Time</h5>
                  <p className="text-3xl font-bold text-green-600 mt-2">2.5h</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h5 className="text-lg font-medium text-gray-700">Satisfaction Rate</h5>
                  <p className="text-3xl font-bold text-blue-600 mt-2">94%</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Tabs.TabPane>
  </Tabs>

    <div className="flex gap-7 mt-8">
      <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 w-3/5 md:w-1/2">
        <h4 className="text-2xl font-semibold text-purple-600 mb-4 md:text-md">
          Recent Convesations
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Phone
                </th>

                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                  Last Meet
                </th>
              </tr>
            </thead>
            <tbody>
  list.map((user) => (
    <tr key={user.id}>
      <td className="py-2 px-4 border-b text-sm text-gray-700">{user.name}</td>
      <td className="py-2 px-4 border-b text-sm text-gray-700">{user.role}</td>
      <td className="py-2 px-4 border-b text-sm text-gray-700">{user.phone}</td>
      <td className="py-2 px-4 border-b text-sm text-gray-700">{user.lastmeet}</td>
    </tr>
  ))
  </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 w-2/5 md:w-1/2">
        <h4 className="text-2xl font-semibold text-purple-600 mb-4">
          Upcoming Meetings
        </h4>
  upcomingMeetings.map((meeting, index) => (
    <div key={index} className="text-black border border-gray-300 m-5 p-2 rounded">
      <div className="flex gap-7">
        <div>
          <BiUser size={24} />
          <h4 className="font-semibold mt-3">Name: {meeting.name}</h4>
        </div>
        <div>
          <BiPhone size={24} />
          <p className="my-3">Phone: {meeting.phoneNumber}</p>
          <p className="leading-3 capitalize my-1">Time: {meeting.time}</p>
        </div>
        <div>
          <BiCalendar size={24} />
          <p className="my-3">Meet Link: {meeting.link}</p>
        </div>
      </div>
    </div>
  ))
  ;<button
    className="text-white bg-purple-600 border border-gray-300 rounded px-3 mr-4 py-1 flex float-right"
    onClick={handleModal}
  >
    <MdAddCircle size={24} />
    Add
  </button>
  </div>
    </div>

    <div className="flex gap-7 mt-8">
      <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1  w-4/6">
        <h4 className="text-2xl font-semibold text-purple-600 mb-4">
          Payment Management
        </h4>
        <p className="text-black text-lg my-4 font-semibold">
  Recent
  Payroll
  </p>

        <table className="min-w-full">
          <thead>
            <tr className="gap-5 border-b-2 border-gray-300 px-5 py-2">
              <th className="text-black capitalize text-xs leading-5 text-left  ">
                Patient Name
              </th>
              <th className="text-black capitalize text-xs leading-5 text-left  ">
                Payed Date
              </th>
              <th className="text-black capitalize text-xs leading-5 text-left px-5 py-2 flex float-right">
                Amount Payed
              </th>
            </tr>
          </thead>
          <tbody>
  list.map((item) => (
    <tr key={item.id}>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
        <div className="text-sm leading-5 font-medium text-gray-900">{item.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
        <div className="text-sm leading-5 font-medium text-gray-900">{item.lastmeet}</div>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
        <div className="text-sm leading-5 font-medium text-gray-900 flex float-right">{item.amount}</div>
      </td>
    </tr>
  ))
  </tbody>
        </table>
      </div>
      <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 w-2/6 ">
        <h4 className="text-2xl font-semibold text-purple-600 mb-4">
          Payment System
        </h4>
        <div className="border border-gray-300 rounded">
          <div>
            <Image
              src="/Images/momo.jpg"
              alt="momo"
              height=
  80
  className="rounded m-2"
            />
  </div>
          <div>
            <p className="px-2 text-2xl text-black m-1">
              Payed
  with Mobile Money
  </p>
            <p className="text-black text-md font-semibold ml-2">
              +25 0789897235
            </p>
          </div>

          <strong className="text-black text-md font-sans ml-2">
  Total
  Amount: $100
  </strong>
        </div>

        <div className="border border-gray-300 rounded mt-8">
          <div>
            <Image
              src="/Images/paypal.png"
              height=
  70
  alt = "paypal"
  className="rounded m-2"
            />
  </div>
          <div>
            <p className="px-2 text-2xl text-black m-1">
              Payed
  with PayPal
  </p>
            <p className="text-black text-md font-semibold ml-2">
              1122363674674376
            </p>
          </div>

          <strong className="text-black text-md font-sans ml-2">
  Total
  Amount: $50
  </strong>
        </div>
      </div>
    </div>
  </>
)
}
;<Modal title="Add the Upcoming Event" open={visible} onCancel={hanleCancelModal} footer={null}>
  <Form layout="vertical">
    <div className="grid grid-cols-2 gap-2">
      <FormItem name="Name" label="Name:" rules={[{ required: true }]}>
        <Input placeholder="Enter name" name="name" value={formData.name} onChange={handleInputChange} />
      </FormItem>

      <FormItem name="role" label="Role" rules={[{ required: true }]}>
        <Input placeholder="Enter Role" name="role" value={formData.role} onChange={handleInputChange} />
      </FormItem>

      <FormItem name="Phone No:" label="Phone" rules={[{ required: true }]}>
        <Input placeholder="Enter phone number" name="phone" value={formData.phone} onChange={handleInputChange} />
      </FormItem>

      <FormItem name="Time" label="Time:" rules={[{ required: true }]}>
        <Input placeholder="Enter Time it will occur" name="time" value={formData.time} onChange={handleInputChange} />
      </FormItem>

      <FormItem name="Link" label="Link:" rules={[{ required: true }]}>
        <Input placeholder="Enter Link will be Used " name="link" value={formData.link} onChange={handleInputChange} />
      </FormItem>
    </div>
  </Form>

  <Button
    className="text-white bg-purple-600 border border-gray-300 px-2 py-1 rounded items-center flex w-full"
    onClick={handleSend}
  >
    <MdAddCircle size={24} />
    Send
  </Button>
</Modal>
</div>
  )
}

export default Home
