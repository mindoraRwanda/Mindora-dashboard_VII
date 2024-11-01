import React, { useState } from "react";
import { Form,Input } from "antd";
import { AiOutlineSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { FaUser,FaSync,FaTrash   } from "react-icons/fa";


export default function TreatmentPlan() {
  const [activeButton, setActiveButton] = useState("Create Plan");
  const handleActive = (buttonName) => {
    setActiveButton(buttonName);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [TreatmentData, setTreatmentData] = useState({
    AllData: [
      {
        id: 1,
        date: "oct 28 2024",
        startTime: "09:00",
        endTime: "09:00",
        duration: "30 minutes",
        patient: "John Doe",
        title:"Mental checking",
        description:" This time we are going to do some test",
        therapist: "Placide Ikundabayo",
        statusApp: "completed",
      },
      {
        id: 1,
        date: "oct 28 2024",
        startTime: "09:00",
        endTime: "09:00",
        duration: "30 minutes",
        patient: "John Doe",
        title:"Mental checking",
        description:" This time we are going to do some test",
        therapist: "Placide Ikundabayo",
        statusApp: "Pending",
      }
    ],
  });
 const [form]=Form.useForm();





 

  return (
    <div className="bg-white rounded shadow-xl border p-6">
      <div className="text-black flex flex-row">
        <h1 className="text-white bg-purple-600  w-full p-2 text-3xl font-semibold">
       Treatment Plan Management - Create Treatment Plan
        </h1>
      </div>
      <div className="flex flex-row gap-9 mt-10">
        {["Create Plan", "View Plans"].map((buttonName) => (
          <button
            key={buttonName}
            className={`text-lg font-semibold p-1 rounded ${
              activeButton === buttonName
                ? "bg-purple-600 text-white hover:bg-purple-800"
                : "bg-gray-200 text-black hover:bg-gray-400"
            }`}
            onClick={() => handleActive(buttonName)}
          >
            {buttonName}
          </button>
        ))}
        ;
      </div>
      {activeButton === "Create Plan" && (
        <div className="bg-white rounded-lg shadow-xl border p-6 mt-3">
          <Form form={form} className="bg-white rounded "
          layout="vertical"
           >
           <h1 className="text-black text-lg font-semibold my-2 text-center">Create Plan</h1>
            <Form.Item
              label="PatientId:"
              name="patientId">
                <Input
                  type="text"
                  placeholder="Enter patientId ..."
                />
             </Form.Item>
             {/* logic for therapistId */}
             <Form.Item
              label="TherapistId:"
              name="therapistId">
                <Input
                  type="text"
                  placeholder="Enter therapistId..."
                />
              </Form.Item>
              {/* logic for treatment Title */}
              <Form.Item
              label="Treatment Title:"
              name="treatmentTitle">
                <Input
                  type="text"
                  placeholder="Enter treatmentTitle..."
                />
              </Form.Item>
              {/* logic for description */}
              <Form.Item
              label="Description:"
              name="description">
                <Input
                  type="textarea"
                  placeholder="Enter description..."
                />
              </Form.Item>
              {/* logic for startDate */}
              <Form.Item
              label="Start Date:"
              name="startDate">
                <Input
                  type="date"
                  placeholder="Enter startDate..."
                />
              </Form.Item>
              {/* logic for endDate  */}
              <Form.Item
              label="End Date:"
              name="endDate">
                <Input
                  type="date"
                  placeholder="Enter endDate..."
                />
              </Form.Item>
              {/* logic for status */}
              <Form.Item
              label="Status:"
          
              >
                <select name="status" id="status"    className="w-full border p-2">
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Completed">Completed</option>
                </select>
              </Form.Item>
          </Form>
          <div className="flex flex-row gap-2 mt-5">
    
    <button className="bg-purple-600 border text-white p-1 rounded font-semibold flex flex-row gap-1 w-3/4 justify-center hover:bg-purple-800 ">
     <AiOutlineSave size={22}/> Save Treatment Plan
    </button>
    <button className="border-red-400 border text-white bg-red-500 p-1 rounded font-semibold flex flex-row gap-1 w-1/4 hover:bg-red-600">
    <MdCancel size={22}/>  Cancel
    </button>
 
    </div>
        </div>
      )};

    
      {activeButton === "View Plans" && (
     <div className="bg-white rounded-lg shadow-xl p-6 ">
     {/* List of all appointments */}
     {TreatmentData.AllData.map((item, index) => (
       <div
         key={index}
         className="bg-white rounded-lg flex flex-row justify-between border-2 p-2 mt-2 "
       >
         <div className="ml-2">
           <p className="text-black text-sm font-semibold flex flex-row gap-2">
             <FaUser size={23} /> {item.patient} - {item.therapist}
           </p>
           <div className="flex flex-row gap-1  mt-5 mb-2">
           <label htmlFor="title" className="text-black text-lg">Title:</label>
           <p className="text-black text-lg font-semibold">{item.title}</p>
           </div>
           <label htmlFor="description" className="text-black">Description:</label>
           <textarea 
            id="description"
             name="description"
             className="w-full border-2 p-2 rounded-md text-black"
             value={item.description}
             readOnly
             />
           <div className="flex flex-row gap-4 my-2">
           <p className="text-black text-sm flex flex-row gap-1">
            <BiTime size={19}/> Date: {item.date}
           </p>
           
           <p className="text-black text-sm flex flex-row gap-1">
            <BiTime size={19}/> Time: {item.startTime}
           </p>
           <p className="text-black text-sm flex flex-row gap-1">
            <BiTime size={19}/> Time: {item.endTime}
           </p>
           <p className="text-black text-sm flex flex-row gap-1">
            <BiTime size={19}/> Duration: {item.duration}
           </p>
           </div>
           <div className="my-4 flex flex-row">
             <button className=" text-sm bg-purple-600  gap-1 text-white p-2 rounded flex flex-row  hover:bg-purple-800">
              <FaSync size={20} color="white"/> Update
             </button>
             <button className="text-white text-sm bg-red-500 gap-1   p-2 rounded ml-2 flex flex-row hover:bg-red-700">
              <FaTrash size={20} color="white"/> Delete
             </button>
         
           </div>
         </div>
         
           {item.statusApp === "completed" && (
             <p className="italic m-5 p-2 text-blue-600 ">
               {item.statusApp}
             </p>
           )}
               {item.statusApp === "waiting" && (
             <p className="italic m-5 p-2 text-green-500">
               {item.statusApp}
             </p>
           )}
           {item.statusApp === "Pending" && (
             <p className="italic m-5 p-2 text-orange-400">
               {item.statusApp}
             </p>
           )}
             {item.statusApp === "canceled" && (
             <p className="italic m-5 p-2 text-red-700">
               {item.statusApp}
             </p>
           )}
      
       </div>
     ))}
   </div>
      )}
    </div>
  );
}
