import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { getAppointmentById, summation_Appointment } from "../../Redux/TherapistSlice/Appointment";
import { Chart, registerables } from "chart.js";

// Register all Chart.js components
Chart.register(...registerables);

type Appointment = {
  patient?: {
    personalInformation?: {
      gender?: string;
    }
  }
};

const Home = () => {
  const appointmentChartRef = useRef<HTMLCanvasElement | null>(null);
  const patientsChartRef = useRef<HTMLCanvasElement | null>(null);
  const treatmentGrowthChartRef = useRef<HTMLCanvasElement | null>(null);

  const appointmentChartInstance = useRef<Chart | null>(null);
  const patientsChartInstance = useRef<Chart | null>(null);
  const treatmentGrowthChartInstance = useRef<Chart | null>(null);

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
          labels: [`female [${female}]`, `male [${male}]`],
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

  return (
    <div className="container mx-auto px-6 py-8">
      <h3 className="text-gray-700 text-3xl font-medium mb-6">
        Welcome back to <strong className="ml-2">Dashboard</strong>
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Appointments Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
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
        <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
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
        <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-600 bg-opacity-75 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-5">
              <h4 className="text-2xl font-semibold text-gray-700">3</h4>
              <div className="text-gray-500">Emergency Notifications</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default Home;