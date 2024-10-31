import {
  FaCalendarAlt,
  FaVideo,
  FaChartBar,
  FaUserMd,
  FaUsers,
} from "react-icons/fa";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Legend,
  Tooltip,
} from "chart.js";
import { MdAddCircle } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { Form, Image, Input, Modal } from "antd";
import FormItem from "antd/es/form/FormItem";



Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

const list = [
  {
    id: 1,
    name: "Alice",
    role: "Cognitive Behavioral Therapy",
    phone:"+250 789897235",
    amount:"$20",
    lastmeet:"2024.08.12"
  
  },
 
  {
    id: 3,
    name: "Muvunyi",
    role: "Child Psychology",
    phone:"+250 789262736",
    amount:"$30",
    lastmeet:"2024.08.12"
   
  },
  { id: 4, name: "Placide", role: "Boy's Methal", phone:"+25 078432535",amount:"$100",lastmeet:"2024.08.12" },
];

const Home = ({ userRole }) => {
  // const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const chartRef = useRef(null);
  const chartRefUser = useRef(null);
  const chartIns = useRef(null);
  const chartInsTherapy = useRef(null);
  const chartPat = useRef(null);
  const chartInsPat = useRef(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState([
    { name: "Muvunyi Patrick:: Boy Mental therapy", time: "Today at:2:00 - 3:00", link: "@ meet.google.mxz" },
    { name: " Uwampeta Alice::Family therapy", time: "Tomorrow at:17:00 - 19:00", link: "@ meet.google.mxz" }
  ]);
  const [formData, setFormData] = useState({ name: "", phone: "", time: "", link: "", role: "" });



  useEffect(() => {
    if (chartIns.current) {
      const ctx = chartIns.current.getContext("2d");
      if (chartInsTherapy.current) {
        chartInsTherapy.current.destroy();
      }
      chartInsTherapy.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Female[70]", "Male[10]"],
          datasets: [
            {
              data: [70, 10],
              backgroundColor: ["#41B06E", "#F7C04A"],
            },
          ],
        },
      });
    }
  });

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (chartRefUser.current) {
        chartRefUser.current.destroy();
      }
      chartRefUser.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Female[50]", "Male[30]"],
          datasets: [
            {
              data: [50, 30],
              backgroundColor: ["#FBA834", "#387ADF"],
            },
          ],
        },
      });
    }
  },[]);

  useEffect(() => {
    if (chartPat.current) {
      const ctx = chartPat.current.getContext("2d");
      if (chartInsPat.current) {
        chartInsPat.current.destroy();
      }
      chartInsPat.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Female[10]", "Male[40]"],
          datasets: [
            {
              data: [10, 40],
              backgroundColor: ["#41B06E", "#387ADF"],
            },
          ],
        },
      });
    }
  },[]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  

  const handleSend = () => {
    if (formData.name && formData.time && formData.link) {
      const newMeeting = {
        name: `${formData.name}:: ${formData.role}`,
        phone:formData.phone,
        time: formData.time,
        link: formData.link,
      };
      setUpcomingMeetings([...upcomingMeetings, newMeeting]);
      setFormData({ name: "", phone: "", time: "", link: "", role: "" }); // Reset form data
      setVisible(false); // Close the modal
    } else {
      console.log("Please fill out all fields");
    }
  };
 

  const handleModal=()=>{
    setVisible(true);
  }
const hanleCancelModal=()=>{
  setVisible(false);
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
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-600 bg-opacity-75 text-white">
                  <FaUserMd size={24} />
                </div>
                <div className="ml-5">
                  <h4 className="text-2xl font-semibold text-gray-700">15</h4>
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
                  <h4 className="text-2xl font-semibold text-gray-700">150</h4>
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
                  <h4 className="text-2xl font-semibold text-gray-700">300</h4>
                  <div className="text-gray-500">Total Patients</div>
                </div>
              </div>
            </div>

            <div className="flex gap-7 mt-4">
              <div className="border px-11 border-gray-400 bg-white rounded-xl hover:shadow-2xl
                md:w-52 lg:w-full hover:-translate-y-1 transform cursor-pointer duration-300 float-start h-fit pb-2">
                <p className="text-black font-semibold md:text-md text-2xl text-center my-3">
                  User Categories
                </p>
                <canvas ref={chartRef}></canvas>
              </div> 
              <div className="border px-11 border-gray-400 bg-white rounded-xl hover:shadow-2xl hover:-translate-y-1 transform cursor-pointer duration-300 float-start h-fit pb-2 md:w-52 lg:w-full">
                <p className="text-black font-semibold md:text-md text-2xl text-center my-3">
                  Therapy Categories
                </p>
                <canvas ref={chartIns}></canvas>
              </div>
              <div className="border px-11 border-gray-400 bg-white rounded-xl hover:shadow-2xl hover:-translate-y-1 transform cursor-pointer duration-300 float-start h-fit pb-2 md:w-52 lg:w-full">
                <p className="text-black font-semibold md:text-md text-2xl text-center my-3">
                  Patient Categories
                </p>
                <canvas ref={chartPat}></canvas>
              </div>
            </div>
          </>
        )}
      </div>

      {userRole === "admin" && (
              <div className="flex gap-7 mt-8">
                <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 w-3/5 md:w-1/2">
                  <h4 className="text-2xl font-semibold text-purple-600 mb-4 md:text-md">Recent Convesations</h4>
                  <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Phone</th>
                
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">Last Meet</th>
                </tr>
              </thead>
              <tbody>
                {list.map((user) => (
                  <tr key={user.id}>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{user.name}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{user.role}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{user.phone}</td>
                    
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{user.lastmeet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
                </div>
                <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 w-2/5 md:w-1/2">
                  <h4 className="text-2xl font-semibold text-purple-600 mb-4">Upcoming Meetings</h4>
                  {upcomingMeetings.map((meeting, index) => (
        <div key={index} className="text-black border border-gray-300 m-5 p-2 rounded">
          <h4 className="font-semibold mt-3">{meeting.name}</h4>
          <p className="leading-3 capitalize my-2">{meeting.phone}</p>
          <p className="leading-3 capitalize my-2">{meeting.time}</p>
          <p className="leading-3 capitalize my-2">{meeting.link}</p>
        </div>
      ))}
                 <button className="text-white bg-purple-600 border border-gray-300 rounded px-3 mr-4 py-1 flex float-right" onClick={handleModal}><MdAddCircle size={24}/>Add</button>
                </div>

                <Modal title="Add the Upcoming Event" visible={visible} onCancel={hanleCancelModal} footer={null}>
            <Form>
                <FormItem name="Name" label="Name:" rules={[{ required: true }]}>
                    <Input placeholder="Enter name" name="name" value={formData.name} onChange={handleInputChange} />
                </FormItem><br />

                <FormItem name="role" label="Role" rules={[{ required: true }]}>
                    <Input placeholder="Enter Role" name="role" value={formData.role} onChange={handleInputChange} />
                </FormItem><br />

                <FormItem name="Phone No:" label="Phone" rules={[{ required: true }]}>
                    <Input placeholder="Enter phone number" name="phone" value={formData.phone} onChange={handleInputChange} />
                </FormItem><br />

                <FormItem name="Time" label="Time:" rules={[{ required: true }]}>
                    <Input placeholder="Enter Time it will occur" name="time" value={formData.time} onChange={handleInputChange} />
                </FormItem><br />

                <FormItem name="Link" label="Link:" rules={[{ required: true }]}>
                    <Input placeholder="Enter Link will be Used " name="link" value={formData.link} onChange={handleInputChange} />
                </FormItem><br />
            </Form>
            <div className="flex justify-center mt-4">
                <button className="text-white bg-purple-600 border border-gray-300 px-2 py-1 rounded items-center flex" onClick={handleSend}>
                    <MdAddCircle size={24}/>Send
                </button>
            </div>
        </Modal>

              </div>
              
            )}

                   {userRole==="admin"&&(
                     <div className="flex gap-7 mt-8">
                    <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1  w-4/6">
                    <h4 className="text-2xl font-semibold text-purple-600 mb-4">Payment Management</h4>
                    <p className="text-black text-lg my-4 font-semibold"> Recent Payroll</p>

                  <table className="min-w-full">
                    <thead >
                      <tr className="gap-5 border-b-2 border-gray-300 px-5 py-2">
                        <th className="text-black capitalize text-xs leading-5 text-left  ">Patient Name</th>
                        <th className="text-black capitalize text-xs leading-5 text-left  ">Payed Date</th>
                        <th className="text-black capitalize text-xs leading-5 text-left px-5 py-2 flex float-right">Amount Payed</th>
                      </tr>
                    </thead>
                    <tbody>
                  {list.map((list)=>(
                  <tr key={list.id}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">
                  {list.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900">
                  {list.lastmeet}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                <div className="text-sm leading-5 font-medium text-gray-900 flex float-right">
                  {list.amount}
                </div>
              </td>
              </tr>
              ))}

              </tbody>
                  </table>
                   
                    </div>
                    <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 w-2/6 ">
                    <h4 className="text-2xl font-semibold text-purple-600 mb-4">Payment System</h4>
                    <div className="border border-gray-300 rounded">
                    
                      <div>
                      <Image src="/Images/momo.jpg" alt="momo" height={80} className="rounded m-2"/>
                      </div>
                      <div>
                      <p className="px-2 text-2xl text-black m-1">Payed with Mobile Money</p>
                      <p className="text-black text-md font-semibold ml-2">+25 0789897235</p>
                      </div>
                  
                      <strong className="text-black text-md font-sans ml-2"> Total Amount: $100</strong>
                    </div>
                  
                    <div className="border border-gray-300 rounded mt-8">
                     
                      <div>
                      <Image src="/Images/paypal.png" height={70} alt="paypal" className="rounded m-2"/>
                      </div>
                      <div>
                      <p className="px-2 text-2xl text-black m-1">Payed with PayPal</p>
                      <p className="text-black text-md font-semibold ml-2">1122363674674376</p>
                      </div>
                    
                      <strong className="text-black text-md font-sans ml-2"> Total Amount: $50</strong>
                    </div>
                    </div>
                    </div>
                )}
              
    </div>
  );
};

export default Home;
