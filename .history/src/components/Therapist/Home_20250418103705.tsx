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
  ChartItem,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
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
type Appointment = {
  patient?: {
    personalInformation?: {
      gender?: string;
    }
  }
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

  const dispatch = useDispatch<AppDispatch>();
  const therapistId = localStorage.getItem('TherapistId');
    useEffect(()=>{
      if(therapistId){
      dispatch(getAppointmentById(therapistId));
      }
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
const appointment = useSelector((state: RootState) => state.appointment.appointments) as Appointment[];
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
  
      chartIns.current = new Chart(ctx as ChartItem, config);
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
  
      chartInsTherapy.current = new Chart(ctx as ChartItem, config);
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
  
      barChartIns.current = new Chart(ctx as ChartItem, config);
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
  
      lineChartIns.current = new Chart(ctx as ChartItem, config);
    }
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <h3 className="text-gray-700 text-3xl font-medium mb-6 ">
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
          <h3 className="text-xl text-gray-500 font-semibold mb-4">Future Enhancements
While the MVP focuses on essential features, future updates will expand the app's capabilities, including a web interface for broader accessibility, advanced machine learning algorithms for personalized recommendations, and integration with additional languages and support networks.
Therapy Dashboard Overview
The Therapy Dashboard is designed for healthcare providers such as doctors, therapists, and psychologists to manage and deliver mental health services effectively. The dashboard will be a web application built using Next js and Tailwind CSS, providing an intuitive and responsive interface. It will include comprehensive features to handle patient management, appointment scheduling, communication, documentation, and analytics.
Key Features for Healthcare Providers
1. Patient Management Dashboard
Access and Manage Patient Profiles: Healthcare providers can view and edit patient profiles, including personal details, medical history, and treatment plans.
Search and Filter Patients: Providers can search and filter patients by various criteria such as name, condition, and treatment status for efficient patient management.
2. Appointment Scheduling and Management
Schedule Appointments: Providers can schedule appointments with patients, view daily, weekly, and monthly calendars, and manage their availability.
Reschedule and Cancel Appointments: Providers can reschedule or cancel appointments as needed, ensuring flexibility in managing their schedules.
Send Reminders and Notifications: Automated reminders and notifications can be sent to patients about upcoming appointments to reduce no-shows.
3. Electronic Health Records (EHR) Integration
Access and Update Patient Health Records: Providers can securely access and update patient health records within the dashboard.
Future Integration with Existing EHR Systems: Although this might be implemented in the future, the dashboard will be designed to integrate seamlessly with existing EHR systems for efficient data exchange.
4. Secure Communication Channels
Messaging System: Secure text communication with patients and colleagues for quick and confidential exchanges.
Video and Audio Call Functionality: Providers can conduct virtual consultations through secure video and audio calls.
File Sharing: Secure file sharing for exchanging documents, reports, and images related to patient care.
5. Treatment Plan Management
Create and Update Treatment Plans: Providers can create, update, and track individualized treatment plans for patients.
Set Goals and Milestones: Set goals, milestones, and tasks for patients to follow, and monitor their adherence to treatment plans.
Adjust Treatment Plans as Needed: Providers can modify treatment plans based on patient progress and feedback.
6. Prescription and Medication Management
Prescribe Medications Electronically: Providers can prescribe medications electronically and manage prescriptions within the dashboard.
Track Patient Compliance: Monitor patient compliance with medication regimens and access their medication history.
Provide Recommendations: Based on medication history, providers can give tailored recommendations to patients.
7. Patient Progress Tracking and Analytics
Visualize Progress: Use charts and graphs to visualize patient progress over time.
Analyze Health Data: Analyze trends and patterns in patient health data to understand treatment efficacy.
Generate Reports: Create detailed reports on patient outcomes and treatment effectiveness.
8. Clinical Notes and Documentation
Record Clinical Notes: Providers can record and store clinical notes and observations during patient interactions.
Use Templates: Utilize templates for standardized documentation, such as SOAP notes.
Attach Files: Attach files, images, and other relevant documents to patient records.
9. Diagnostic Tools and Assessments
Access Diagnostic Tools: Utilize diagnostic tools and assessments for various mental health conditions.
Store and Review Results: Store assessment results within patient records and review them as needed.
Provide Feedback: Offer feedback and recommendations based on assessment outcomes.
10. Educational Resources and Content
Access Educational Materials: Providers can access a library of articles, videos, and courses on mental health topics.
Recommend Resources to Patients: Recommend relevant educational materials to patients to support their treatment.
Stay Updated: Providers can stay updated with the latest research and best practices in mental health care.
11. Referral and Collaboration Tools
Refer Patients: Providers can refer patients to specialists or other healthcare providers when needed.
Collaborate on Care Plans: Collaborate with other professionals on patient care plans and share data securely for coordinated care.
12. Billing and Insurance Management
Manage Billing Information: Handle billing information and process payments efficiently.
Verify Insurance Details: Verify and manage insurance details for patients to ensure smooth billing operations.
Generate Invoices and Reports: Create invoices and generate billing reports for administrative purposes.
13. Patient Feedback and Surveys
Collect Feedback: Gather patient feedback on services and treatment outcomes through surveys.
Analyze Insights: Analyze feedback to identify areas for improvement and enhance the quality of care.
Improve Patient Experience: Use insights from feedback to improve patient experience and satisfaction.
14. Emergency and Crisis Management
Manage Emergencies: Tools to manage patient emergencies and crises effectively.
Access Emergency Contacts: Quick access to emergency contact information and crisis intervention protocols.
Coordinate with Emergency Services: Enable quick response and coordination with emergency services when necessary.
15. Data Export and Integration
Export Data: Export patient data and reports in various formats such as PDF and CSV.
Integrate with Other Systems: Integrate with other healthcare systems and tools for comprehensive data management.
16. Notifications and Alerts
Real-Time Alerts: Receive real-time alerts for urgent patient issues or messages.
Appointment and Task Notifications: Get notified about upcoming appointments, tasks, and important updates.
Customizable Alerts: Set up customizable alerts for specific patient conditions or needs.
17. Analytics and Reporting Tools
Generate Detailed Reports: Create detailed reports on patient demographics, treatment outcomes, and service utilization.
Identify Trends: Use analytics tools to identify trends and make data-driven decisions.
Monitor KPIs: Monitor key performance indicators (KPIs) for practice management to ensure optimal operations.
</h3>
          <canvas ref={barChartRef} />
        </div>
      </div>
    </div>
  );
};

export default Home;
