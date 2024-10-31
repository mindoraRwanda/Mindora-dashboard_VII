import React, { useState } from "react";
import { HiOutlineClipboardList } from "react-icons/hi";
import { AiOutlineSave } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import { BiPlus } from "react-icons/bi";
import SetGoal from "./SetGoal";

export default function TreatmentPlan() {
  const [activeButton, setActiveButton] = useState("Create Plan");
  const [showAdditionGoals, setShowAdditionGoals] = useState(false);
  const[showAdditionMilistones, setShowAdditionMilistones] = useState(false);
  const [showAdditionalTasks, setShowAdditionalTasks] = useState(false);

  const handleActive = (buttonName) => {
    setActiveButton(buttonName);
  };

  const toggerGoals = () => {
    setShowAdditionGoals(!showAdditionGoals);
  };
  const toggerMilistones = () => {
    setShowAdditionMilistones(!showAdditionMilistones);
  };
  const toggerTasks = () => {
    setShowAdditionalTasks(!showAdditionalTasks);
  };

  const AdditionGoals = () => {
    return (
      <div className="flex flex-row gap-2">
        {/* Addition Goals logic here */}
        <input
          type="text"
          id="goal"
          name="goal"
          className="w-1/2 p-1 border-2 rounded-md text-black my-3"
          placeholder="Goal discription..."
        />
        <select className="w-1/2 p-1 border-2 rounded-md text-black my-3">
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>
    );
  };

  const AdditionMilistones = () => {
    return(
      <div className="flex flex-row gap-2">
        <input
        type="text"
        id="milistone"
        name="milistone"
        className="w-1/3 p-1 border-2 rounded-md text-black my-3"
        placeholder="Milistone description..."
        />
        {/* Logic for date */}
        <input
        type="date"
        id="date"
        name="date"
        className="w-1/3 p-1 border-2 rounded-md text-black my-3"
        />
        {/* logic for status */}
        <select
        className="w-1/3 p-1 border-2 rounded-md text-black my-3"
        >
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>
    )
  };

  const AdditionalTasks = () => {
    return(
      <div className="flex flex-row gap-2">
        <input
        type="text"
        id="task"
        name="task"
        className="w-1/3 p-1 border-2 rounded-md text-black my-3"
        placeholder="Task description..."
        />
        {/* Logic for date */}
        <input
        type="date"
        id="date"
        name="date"
        className="w-1/3 p-1 border-2 rounded-md text-black my-3"
        />
        {/* Logic for status */}
        <select
        className="w-1/3 p-1 border-2 rounded-md text-black my-3"
        >
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>
    )
  };

 

  return (
    <div className="bg-white rounded-lg shadow-xl border p-6">
      <div className="text-black flex flex-row">
        <HiOutlineClipboardList size={32} />
        <h1 className="text-black text-2xl font-semibold">
          Treatment Plan Management
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
          <label className="text-black" for="patientName">
            {" "}
            Patient Name:
          </label>
          <br />
          <input
            type="text"
            id="patientName"
            name="patientName"
            className="w-full p-1 border-2 rounded-md text-black my-3"
            placeholder="Enter patient name..."
          />
          <div className="flex flex-row justify-between mt-5">
            <h1 className="font-semibold text-black text-xl">Goals</h1>
            <button
              className="border-purple-600 border text-black p-1 rounded font-semibold flex flex-row "
              onClick={toggerGoals}
            >
              <BiPlus size={25} />
              Add Goal
            </button>
          </div>
          {showAdditionGoals && <AdditionGoals />}
            {/* For milestones */}
        <div className="flex flex-row justify-between mt-5">
        <h1 className="font-semibold text-black text-xl">Milestones</h1>
        <button className="border-purple-600 border  text-black p-1 rounded font-semibold flex flex-row "
         onClick={toggerMilistones}>
          <BiPlus size={25} />
          Add Milestone
        </button>
      </div>
      {showAdditionMilistones && <AdditionMilistones />}

      {/* Logic of Task */}
      <div className="flex flex-row justify-between mt-5">
        <h1 className="font-semibold text-black text-xl">Tasks</h1>
        <button className="border-purple-600 border  text-black p-1 rounded font-semibold flex flex-row "
         onClick={toggerTasks}>
          <BiPlus size={25} />
          Add Task
        </button>
      </div>
      {showAdditionalTasks && <AdditionalTasks />}

      {/* Logic of Save and Cancel */}
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
        <SetGoal/>
      )}
    </div>
  );
}
