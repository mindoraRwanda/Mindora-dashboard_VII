import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { getAppointmentById, summation_Appointment } from "../../Redux/TherapistSlice/Appointment";
import { Chart, registerables } from "chart.js";

// Register all Chart.js components
Chart.register(...registerables);

type Appointment = {
  id: string;
  patientName?: string;
  date?: string;
  time?: string;
  status?: string;
  patient?: {
    personalInformation?: {
      gender?: string;
      fullName?: string;
    }
  }
};

type Patient = {
  id: string;
  personalInformation: {
    fullName: string;
    gender: string;
  };
  condition?: string;
  lastAppointment?: string;
  nextAppointment?: string;
  treatmentProgress?: number;
};

// Mock data for upcoming appointments
const upcomingAppointments: Appointment[] = [
  { id: "1", patientName: "John Doe", date: "2025-04-19", time: "10:00 AM", status: "Confirmed" },
  { id: "2", patientName: "Sarah Johnson", date: "2025-04-19", time: "2:30 PM", status: "Pending" },
  { id: "3", patientName: "Michael Smith", date: "2025-04-20", time: "9:15 AM", status: "Confirmed" }
];

// Mock data for recent patients
const recentPatients: Patient[] = [
  { 
    id: "1", 
    personalInformation: { fullName: "Emma Davis", gender: "female" },
    condition: "Anxiety",
    lastAppointment: "2025-04-15",
    nextAppointment: "2025-04-22",
    treatmentProgress: 65
  },
  { 
    id: "2", 
    personalInformation: { fullName: "James Wilson", gender: "male" },
    condition: "Depression",
    lastAppointment: "2025-04-16",
    nextAppointment: "2025-04-23",
    treatmentProgress: 42
  },
  { 
    id: "3", 
    personalInformation: { fullName: "Olivia Brown", gender: "female" },
    condition: "PTSD",
    lastAppointment: "2025-04-17",
    nextAppointment: "2025-04-24",
    treatmentProgress: 78
  }
];

const Home = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week");
  const [notificationCount, setNotificationCount] = useState<number>(3);
  
  const appointmentChartRef = useRef<HTMLCanvasElement | null>(null);
  const patientsChartRef = useRef<HTMLCanvasElement | null>(null);
  const treatmentGrowthChartRef = useRef<HTMLCanvasElement | null>(null);
  const sessionsChartRef = useRef<HTMLCanvasElement | null>(null);

  const appointmentChartInstance = useRef<Chart | null>(null);
  const patientsChartInstance = useRef<Chart | null>(null);
  const treatmentGrowthChartInstance = useRef<Chart | null>(null);
  const sessionsChartInstance = useRef<Chart | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const therapistId = localStorage.getItem('TherapistId');
  
  useEffect(() => {
    if(therapistId) {
      dispatch(getAppointmentById(therapistId));
    }
  }, [dispatch, therapistId]);
  
  const appointmentStatus = useSelector((state: RootState) => state.appointment.status);
  const appointments = useSelector((state: RootState) => state.appointment.appointments) as Appointment[];
  const totalAppointments = useSelector(summation_Appointment);
  
  // Function to analyze gender data from appointments
  const analyzeGenderData = (appointmentData: Appointment[]) => {
    const female = appointmentData?.filter(appt => 
      appt.patient?.personalInformation?.gender?.toLowerCase() === 'female').length || 0;
    const male = appointmentData?.filter(appt => 
      appt.patient?.personalInformation?.gender?.toLowerCase() === 'male').length || 0;
    return { female, male };
  };

  // Initialize appointment chart
  useEffect(() => {
    if (appointmentChartRef.current) {
      const ctx = appointmentChartRef.current.getContext("2d");
      if (ctx && appointmentChartInstance.current) {
        appointmentChartInstance.current.destroy();
      }

      const { female, male } = analyzeGenderData(appointments);

      appointmentChartInstance.current = new Chart(ctx!, {
        type: "doughnut",
        data: {
          labels: [`Female [${female}]`, `Male [${male}]`],
          datasets: [{
            data: [female, male],
            backgroundColor: ["#FBA834", "#387ADF"],
          }]
        },
        options: {
          responsive: true,
          animation: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }, [appointments]);

  // Initialize patients chart
  useEffect(() => {
    if (patientsChartRef.current) {
      const ctx = patientsChartRef.current.getContext("2d");
      if (ctx && patientsChartInstance.current) {
        patientsChartInstance.current.destroy();
      }

      patientsChartInstance.current = new Chart(ctx!, {
        type: "doughnut",
        data: {
          labels: ["Female [6]", "Male [4]"],
          datasets: [{
            data: [6, 4],
            backgroundColor: ["#41B06E", "#F7C04A"],
          }]
        },
        options: {
          responsive: true,
          animation: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }, []);

  // Initialize treatment growth chart
  useEffect(() => {
    if (treatmentGrowthChartRef.current) {
      const ctx = treatmentGrowthChartRef.current.getContext("2d");
      if (ctx && treatmentGrowthChartInstance.current) {
        treatmentGrowthChartInstance.current.destroy();
      }

      treatmentGrowthChartInstance.current = new Chart(ctx!, {
        type: "bar",
        data: {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [{
            label: "Treatment Growth",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: "#387ADF",
          }]
        },
        options: {
          responsive: true,
          animation: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
    }
  }, []);

  // Initialize therapy sessions chart
  useEffect(() => {
    if (sessionsChartRef.current) {
      const ctx = sessionsChartRef.current.getContext("2d");
      if (ctx && sessionsChartInstance.current) {
        sessionsChartInstance.current.destroy();
      }

      sessionsChartInstance.current = new Chart(ctx!, {
        type: "line",
        data: {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [{
            label: "Therapy Sessions",
            data: [65, 59, 80, 81, 56, 55],
            fill: false,
            borderColor: "#36A2EB",
            tension: 0.1,
          }]
        },
        options: {
          responsive: true,
          animation: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, []);

  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle period change for analytics
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    // Here you would normally fetch new data based on the selected period
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotificationCount(0);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Welcome back to <strong>Dashboard</strong></h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
          <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Appointments Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-5">
              <h4 className="text-2xl font-semibold text-gray-700">
                {appointmentStatus === "loading" ? "..." : totalAppointments}
              </h4>
              <div className="text-gray-500">Total Appointments</div>
            </div>
          </div>
        </div>

        {/* Reports Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-600 bg-opacity-75 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-5">
              <h4 className="text-2xl font-semibold text-gray-700">5</h4>
              <div className="text-gray-500">New Reports</div>
            </div>
          </div>
        </div>

        {/* Emergency Notifications Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-600 bg-opacity-75 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-5">
              <h4 className="text-2xl font-semibold text-gray-700">{notificationCount}</h4>
              <div className="text-gray-500">Emergency Notifications</div>
            </div>
          </div>
        </div>

        {/* Active Patients Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-600 bg-opacity-75 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <h4 className="text-2xl font-semibold text-gray-700">10</h4>
              <div className="text-gray-500">Active Patients</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Middle Row - Today's Schedule & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-gray-700 font-semibold">Today's Schedule</h3>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                      <button className="text-gray-600 hover:text-gray-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-gray-700 font-semibold">Notifications</h3>
            {notificationCount > 0 && (
              <button 
                onClick={clearNotifications}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          {notificationCount > 0 ? (
            <div className="space-y-4">
              <div className="flex items-start p-3 bg-red-50 rounded-lg">
                <div className="flex-shrink-0 p-2 bg-red-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">Emergency Alert</h4>
                  <p className="mt-1 text-sm text-red-700">Patient John Doe reported severe anxiety symptoms.</p>
                  <p className="mt-1 text-xs text-red-600">30 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">Appointment Reminder</h4>
                  <p className="mt-1 text-sm text-yellow-700">You have a session with Sarah Johnson in 1 hour.</p>
                  <p className="mt-1 text-xs text-yellow-600">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">New Message</h4>
                  <p className="mt-1 text-sm text-blue-700">Dr. Rodriguez left a comment on Michael's treatment plan.</p>
                  <p className="mt-1 text-xs text-blue-600">3 hours ago</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No new notifications</p>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h3 className="text-xl text-gray-700 font-semibold">Analytics Overview</h3>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button 
              onClick={() => handlePeriodChange('week')}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedPeriod === 'week' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button 
              onClick={() => handlePeriodChange('month')}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedPeriod === 'month' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button 
              onClick={() => handlePeriodChange('year')}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedPeriod === 'year' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm text-gray-500 font-medium">Total Sessions</h4>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold text-gray-700">124</span>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">+12%</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm text-gray-500 font-medium">New Patients</h4>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold text-gray-700">8</span>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">+5%</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm text-gray-500 font-medium">Completion Rate</h4>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold text-gray-700">92%</span>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">+3%</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm text-gray-500 font-medium">Avg. Session Duration</h4>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold text-gray-700">48 min</span>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">-2%</span>
            </div>
          </div>
        </div>

        <div className="h-72">
          <canvas ref={sessionsChartRef} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Appointed Chart */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl text-gray-500 font-semibold mb-4">Appointed</h3>
          <canvas ref={appointmentChartRef} />
        </div>

        {/* Patients Chart */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl text-gray-500 font-semibold mb-4">Patients</h3>
          <canvas ref={patientsChartRef} />
        </div>

        {/* Treatment Growth Chart */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl text-gray-500 font-semibold mb-4">Treatment Growth</h3>
          <canvas ref={treatmentGrowthChartRef} />
        </div>
      </div>
      </div>
      