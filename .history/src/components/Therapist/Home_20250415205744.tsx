import {
  FaCalendarAlt,
  FaChartBar,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  Chart,
  DoughnutController,
  BarController,
  LineController,
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Legend,
  Tooltip,
  ChartConfiguration,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { getAppointmentById, summation_Appointment } from "../../Redux/TherapistSlice/Appointment";



Chart.register(
  DoughnutController,
  BarController,
  LineController,
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Legend,
  Tooltip
);

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
};

const Home = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartRefTherapy = useRef<HTMLCanvasElement | null>(null);
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const lineChartRef = useRef<HTMLCanvasElement | null>(null);

  const chartIns = useRef<Chart | null>(null);
  const chartInsTherapy = useRef<Chart | null>(null);
  const barChartIns = useRef<Chart | null>(null);
  const lineChartIns = useRef<Chart | null>(null);

  const dispatch=useDispatch();
  const therapistId = localStorage.getItem('TherapistId');
    useEffect(()=>{
      dispatch(getAppointmentById(therapistId));
    },[dispatch,therapistId]);
  


  const [notifications] = useState<Notification[]>([
    { id: 1, title: "Emergency: John Doe", message: "Patient experiencing severe anxiety.", time: "2 mins ago" },
    { id: 2, title: "Emergency: Jane Smith", message: "Patient having panic attack.", time: "5 mins ago" },
    { id: 3, title: "Emergency: Alice Johnson", message: "Patient feeling suicidal.", time: "10 mins ago" },
  ]);

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  
const AppointStatus=useSelector((state:any)=>state.appointment.status);
const appointment=useSelector((state:RootState)=>state.appointment.appointments);
const Appoint_Sum=useSelector(summation_Appointment);
  
// Function to Display Gender for person who required appointment
const handleGender= (appointment: Appointment[]) => {
  console.log('Appointment Data: ', appointment);
  const female=appointment?.filter(appoint=>appoint.patient?.personalInformation?.gender?.toLowerCase()==='mamamale').length;
  const male=appointment?.filter(appoint=>appoint.patient?.personalInformation?.gender?.toLowerCase()==='others').length;
  return {female, male};
}


  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx && chartIns.current) {
        chartIns.current.destroy();
      }

  const {female, male} = handleGender(appointment);

      const config: ChartConfiguration = {
        type: "doughnut",
        data: {
          labels: [`female[${female}]`, `male[${male}]`],
          datasets: [
            {
              data: [female, male],
              backgroundColor: ["#FBA834", "#387ADF"],
            },
          ],
        },
        options: {
          responsive: true,
          animation: false
        }
      };
  
      chartIns.current = new Chart(ctx as ChartItem!, config);
    }
  }, [appointment]);

  useEffect(() => {
    if (chartRefTherapy.current) {
      const ctx = chartRefTherapy.current.getContext("2d");
      if (ctx && chartInsTherapy.current) {
        chartInsTherapy.current.destroy();
      }
  
      const config: ChartConfiguration = {
        type: "doughnut",
        data: {
          labels: ["Female[6]", "Male[4]"],
          datasets: [
            {
              data: [6, 4],
              backgroundColor: ["#41B06E", "#F7C04A"],
            },
          ],
        },
        options: {
          responsive: true,
          animation: false
        }
      };
  
      chartInsTherapy.current = new Chart(ctx!, config);
    }
  }, []);

  useEffect(() => {
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext("2d");
      if (ctx && barChartIns.current) {
        barChartIns.current.destroy();
      }
  
      const config: ChartConfiguration = {
        type: "bar",
        data: {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              label: "User Growth",
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: "#4A90E2",
            },
          ],
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          },
          animation: false
        }
      };
  
      barChartIns.current = new Chart(ctx!, config);
    }
  }, []);

  useEffect(() => {
    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext("2d");
      if (ctx && lineChartIns.current) {
        lineChartIns.current.destroy();
      }
  
      const config: ChartConfiguration = {
        type: "line",
        data: {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              label: "Therapy Sessions",
              data: [65, 59, 80, 81, 56, 55],
              fill: false,
              borderColor: "#36A2EB",
              tension: 0.1,
            },
          ],
        },
        options: {
          animation: false
        }
      };
  
      lineChartIns.current = new Chart(ctx!, config);
    }
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <h3 className="text-gray-700 text-3xl font-medium mb-6 flex justify-center">
        Welcome back to  <strong className="ml-2">Dashboard</strong>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75 text-white">
              <FaCalendarAlt size={24} />
            </div>
            <div className="ml-5">
              <h4 className="text-2xl font-semibold text-gray-700">
              {AppointStatus === "loading" ? "..." : Appoint_Sum}
              </h4>
              <div className="text-gray-500">Total Appointments</div>
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
            <div className="p-3 rounded-full bg-red-600 bg-opacity-75 text-white">
              <FaExclamationTriangle size={24} />
            </div>
            <div className="ml-5">
              <h4 className="text-2xl font-semibold text-gray-700">3</h4>
              <div className="text-gray-500">Emergency Notifications</div>
            </div>
          </div>
        </div>
        {/* <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-600 bg-opacity-75 text-white">
              <BsFillCalendar2EventFill size={24} />
            </div>
            <div className="ml-5">
              <h4 className="text-2xl font-semibold text-gray-700">2:30 pm</h4>
              <div className="text-gray-500">Upcoming event</div>
            </div>
          </div>
        </div> */}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl text-gray-500 font-semibold mb-4">Appointed</h3>
          <canvas ref={chartRef} />
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl text-gray-500 font-semibold mb-4">Patients</h3>
          <canvas ref={chartRefTherapy} />
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl text-gray-500 font-semibold mb-4">Growth</h3>
          <canvas ref={barChartRef} />
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-xl text-gray-500 font-semibold mb-4">Sessions</h3>
          <canvas ref={lineChartRef} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Emergency Notifications</h3>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer" onClick={() => openModal(notification)}>
              <h4 className="text-xl font-semibold text-gray-700">{notification.title}</h4>
              <p className="text-gray-500">{notification.message}</p>
              <div className="text-gray-400 text-sm mt-2">{notification.time}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedNotification && (
        <Modal open={isModalOpen} onCancel={closeModal} className="modal-content">
          <div className="p-6 bg-white rounded-lg">
            <h4 className="text-xl font-semibold text-gray-700">{selectedNotification.title}</h4>
            <p className="text-gray-500 mt-2">{selectedNotification.message}</p>
            <div className="text-gray-400 text-sm mt-4">{selectedNotification.time}</div>
            <button onClick={closeModal} className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
