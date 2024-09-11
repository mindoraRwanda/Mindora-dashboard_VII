import {
    FaCalendarAlt,
    FaVideo,
    FaChartBar,
    FaUserMd,
    FaUsers,
  } from "react-icons/fa";
  import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from "chart.js";
  import { MdAddCircle } from "react-icons/md";
  import { useEffect, useRef, useState } from "react";
  import { Form, Input, Modal } from "antd";
//   import { useTranslation } from 'next-intl';
  
  // Register Chart.js components
  Chart.register(DoughnutController, ArcElement, Legend, Tooltip);
  
  const list = [
    { id: 1, name: "Alice", role: "Cognitive Behavioral Therapy", phone: "+250 789897235", amount: "$20", lastmeet: "2024.08.12" },
    { id: 3, name: "Muvunyi", role: "Child Psychology", phone: "+250 789262736", amount: "$30", lastmeet: "2024.08.12" },
    { id: 4, name: "Placide", role: "Boy's Mental Health", phone: "+250 078432535", amount: "$100", lastmeet: "2024.08.12" },
  ];
  
  const Home = ({ userRole }) => {
    const [visible, setVisible] = useState(false);
    const chartRef = useRef(null);
    const chartIns = useRef(null);
    const chartPat = useRef(null);
    const [upcomingMeetings, setUpcomingMeetings] = useState([
      { name: "Muvunyi Patrick:: Boy Mental therapy", time: "Today at:2:00 - 3:00", link: "@ meet.google.mxz" },
      { name: " Uwampeta Alice::Family therapy", time: "Tomorrow at:17:00 - 19:00", link: "@ meet.google.mxz" }
    ]);
    const [formData, setFormData] = useState({ name: "", phone: "", time: "", link: "", role: "" });
  
    useEffect(() => {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");
        new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Female[50]", "Male[30]"],
            datasets: [{ data: [50, 30], backgroundColor: ["#FBA834", "#387ADF"] }],
          },
        });
      }
      if (chartIns.current) {
        const ctx = chartIns.current.getContext("2d");
        new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Female[70]", "Male[10]"],
            datasets: [{ data: [70, 10], backgroundColor: ["#41B06E", "#F7C04A"] }],
          },
        });
      }
      if (chartPat.current) {
        const ctx = chartPat.current.getContext("2d");
        new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Female[10]", "Male[40]"],
            datasets: [{ data: [10, 40], backgroundColor: ["#41B06E", "#387ADF"] }],
          },
        });
      }
    }, []);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSend = () => {
      if (formData.name && formData.time && formData.link) {
        const newMeeting = { name: `${formData.name}:: ${formData.role}`, phone: formData.phone, time: formData.time, link: formData.link };
        setUpcomingMeetings([...upcomingMeetings, newMeeting]);
        setFormData({ name: "", phone: "", time: "", link: "", role: "" }); // Reset form
        setVisible(false); // Close modal
      } else {
        console.log("Please fill out all fields");
      }
    };
  
    const handleModal = () => setVisible(true);
    const handleCancelModal = () => setVisible(false);
  
    return (
      <div className="container mx-auto px-6 py-8">
        <h3 className="text-gray-700 text-3xl font-medium mb-6">
          Welcome back, {userRole === "therapist" ? "Dr. Smith" : "Admin"}!
        </h3>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userRole === "therapist" ? (
            <>
              <div className="card"><FaCalendarAlt size={24} /><h4>8 New Appointments</h4></div>
              <div className="card"><FaVideo size={24} /><h4>3 Upcoming Video Calls</h4></div>
              <div className="card"><FaChartBar size={24} /><h4>5 New Reports</h4></div>
            </>
          ) : (
            <>
              <div className="card"><FaUserMd size={24} /><h4>15 Total Therapists</h4></div>
              <div className="card"><FaUsers size={24} /><h4>150 Total Users</h4></div>
              <div className="card"><FaUsers size={24} /><h4>300 Total Patients</h4></div>
              <div className="charts">
                <div><canvas ref={chartRef}></canvas></div>
                <div><canvas ref={chartIns}></canvas></div>
                <div><canvas ref={chartPat}></canvas></div>
              </div>
            </>
          )}
        </div>
  
        {userRole === "admin" && (
          <div className="admin-section">
            <div className="recent-conversations">
              <h4>Recent Conversations</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Last Meet</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.role}</td>
                      <td>{user.phone}</td>
                      <td>{user.lastmeet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="upcoming-meetings">
              <h4>Upcoming Meetings</h4>
              {upcomingMeetings.map((meeting, index) => (
                <div key={index} className="meeting-card">
                  <h4>{meeting.name}</h4>
                  <p>{meeting.phone}</p>
                  <p>{meeting.time}</p>
                  <p>{meeting.link}</p>
                </div>
              ))}
              <button className="add-meeting-button" onClick={handleModal}>
                <MdAddCircle size={24} />Add
              </button>
            </div>
          </div>
        )}
  
        <Modal title="Add the Upcoming Event" visible={visible} onCancel={handleCancelModal} footer={null}>
          <Form>
            <Form.Item label="Name">
              <Input name="name" value={formData.name} onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Role">
              <Input name="role" value={formData.role} onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Phone">
              <Input name="phone" value={formData.phone} onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Time">
              <Input name="time" value={formData.time} onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Link">
              <Input name="link" value={formData.link} onChange={handleInputChange} />
            </Form.Item>
          </Form>
          <button className="modal-submit-button" onClick={handleSend}>
            <MdAddCircle size={24} />Send
          </button>
        </Modal>
      </div>
    );
  };
  
  export default Home;
  