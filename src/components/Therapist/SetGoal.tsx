import React from "react";


import { MdCancel } from "react-icons/md";
import { BiPlus, BiEdit } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

export default function TreatmentPlan() {
  const { form } = Form.useForm();
     const Goaldata=[
      {
        id:1,
        title: "Goal 1",
        solt: 1,
        description: "This is a goal description",
        status: "Pending"
      },
      {
        id:2,
        title: "Goal 2",
        solt: 2,
        description: "This is a goal description",
        status: "Completed"
      },
      {
        id:3,
        title: "Goal 3",
        solt: 3,
        description: "This is a goal description",
        status: "Pending"
      }
    ];


  return (
    <div className="bg-white rounded shadow-xl border p-6">
      <div className="text-black flex flex-row">
        <h1 className="text-white text-3xl w-full p-2 font-semibold bg-purple-600 ">Treatment Plan Management - Goals Management</h1>
      </div>
      <div className="bg-white rounded-lg shadow-xl border p-6 mt-5">
        <h1 className="text-black text-2xl font-semibold ml-6">Create Goals</h1>
        <Form form={form} className="p-6" layout="vertical">
          <div className="flex flex-row gap-2">
            {/* logic for title */}
            <Form.Item className="w-3/4">
              <label htmlFor="title">GoalTitle:</label>
              <Input
                name="goalTitle"
                type="text"
                placeholder="Enter Goal Title"
              />
            </Form.Item>
            {/* logic for solt */}
            <Form.Item className="w-1/4 rounded">
              <label htmlFor="sorting">Sorting</label>
              <Select name="solt" id="solt" className="w-full" defaultValue="1">
                <Option value="1">Option 1</Option>
                <Option value="2">Option 2</Option>
                <Option value="3">Option 3</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item>
            <label htmlFor="description">Goal Description:</label>
            <TextArea
              name="goalDescription"
              type="text"
              placeholder="Enter Goal Description"
            />
          </Form.Item>
          {/* logic for date */}
          <div className="flex flex-row gap-2">
            <Form.Item className="w-3/4">
              <label htmlFor="targetDate">TargetDate:</label>
              <Input name="date" type="date" placeholder="Enter Goal Date" />
            </Form.Item>
            {/* logic for status */}

            <Form.Item className="w-1/4 rounded ">
              <label htmlFor="status">Status:</label>
              <Select
                name="status"
                id="status"
                className="w-full"
                defaultValue="Completed"
              >
                < Select.Option value="Completed">Completed</Select.Option>
                <Select.Option value="progress">In Progress</Select.Option>
                <Select.Option value="waiting">Not Started</Select.Option>
              </Select>
            </Form.Item>
          </div>
          {/* logic for button */}
          <div className="flex flex-row gap-2 mt-5">
            <button className="text-white bg-purple-600 border w-3/4 border-gray-300 px-2 py-1 rounded justify-center text-xl font-semibold gap-1 flex">
              <BiPlus size={27}/>
              Add Goal
            </button>
            <button className="text-white bg-red-500 border w-1/4 border-gray-300 px-2 py-1 rounded items-center font-semibold gap-1 flex">
              <MdCancel size={24} />
              Cancel
            </button>
          </div>
        </Form>
      </div>
      <div className="bg-white rounded-lg shadow-xl border p-6 mt-4">
        <h1 className="text-black text-2xl font-semibold ">
          {" "}
          List Of All Goals
        </h1>
        {/* logic for table */}
        <div className="flex flex-row gap-2 mt-5">
          <table className="w-full border-collapse">
            <thead className="border-b-2 ">
              <tr>
                <th className="px-2 py-2 text-left text-md font-semibold text-gray-700">
                  Goals
                </th>
                <th className="px-2 py-2 text-left text-md font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-2 py-2 text-left text-md font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-2 py-2 text-left text-md font-semibold text-gray-700">
                  Operations
                </th>
              </tr>
            </thead>
            <tbody>
              {Goaldata.map((Goal)=>(              <tr className="text-gray-800" key={Goaldata.id}>
                <td className="px-2 py-3">
                  <h1 className="text-black">{Goal.title}</h1>
                </td>
                <td className="px-2 py-3">
                  <h1 className="text-black"> {Goal.description}</h1>
                </td>
                <td className="px-2 py-3">
                  <h1 className="text-black"> {Goal.status}</h1>
                </td>
                <td className="px-2 py-3">
                  <div className="flex gap-2">
                    <button >
                      <BiEdit size={25} color="purple" />
                    </button>
                    <button >
                      <FaTrash size={23} color="red" />
                    </button>
                  </div>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
