import { Input, Modal,Form, Select, Button } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { BiEdit, BiPlus } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { MdCancel } from "react-icons/md";


export default function SetMilestones() {
  const [showModal, setShowModal]=useState(false);
  const [form]=useForm();

  const handleShowModal=()=>{
    setShowModal(true);
  };
  const handleCancelModal=()=>{
    setShowModal(false);
  };
  return (
    <div className="bg-white rounded shadow-xl border p-6">
      <h1 className="text-white font-semibold rounded-sm text-3xl bg-purple-600 p-2 w-full">
        Treatment Plan Management - Milestones
      </h1>
      <div className="bg-white rounded  p-6 my-3">
        <div className="bg-slate-100 p-2 flex justify-between">
        <h2 className="text-purple-600 text-2xl font-semibold">
          Create Milestones
        </h2>
        <button className="text-white mr-4 p-2 bg-purple-600 rounded-md flex font-semibold" 
        onClick={handleShowModal}> <BiPlus size={23}/>Add new</button>
        </div>
        <div className="bg-gray-100 rounded shadow-xl border p-6 my-3">
          <h1 className="text-2xl font-semibold text-black"> List Of Mistones</h1>
        
          <div className="bg-white rounded-md shadow-xl border p-6 my-3 flex justify-between">
            <div>
            <h2 className="text-black font-semibold text-xl"> Reduce anxiety Symptoms</h2>
            <p className="text-black text-md my-2">Daily meditation and cognative behaviol techinics </p>
            <div className=""></div>
            <div className="bg-transparent my-5 p-2">
            <p className="text-yellow-600  text-xl p-1 rounded"> In Progress</p>
            </div>
            </div>
          
            <div className="">
              <Button className="mr-3 p-2 bg-purple-600 text-white font-semibold">
              <BiEdit size={20}/>  Edit
              </Button>
              <Button className="mr-3 p-2 bg-red-500 text-white font-semibold">
              <FaTrash size={20} /> Delete
              </Button>
            </div>
            </div>
          
        </div>
        </div>
        <Modal footer={null} visible={showModal} onCancel={handleCancelModal}>
      {/* Add your modal content here */}
      <Form form={form} >
        <h1 className="text-black text-2xl font-semibold my-3"> Create Milstone</h1>
        <Form.Item>
          <label htmlFor="date"> GoalId:</label>
          <Input 
          name="goalId"
          placeholder="Enter goal id"
          />
        </Form.Item>
        <Form.Item>
          <label htmlFor="title"> Milestone Title:</label>
        <Input 
          name="milestoneTitle"
          placeholder="Enter milestone title"
        />
        </Form.Item>
        <Form.Item>
          <label htmlFor="description"> Description:</label>
        <textarea className="w-full border rounded-md p-2 " 
          name="milestoneDescription"
          placeholder="Enter milestone description"/>
        </Form.Item>
        <Form.Item>
          <label htmlFor="Targetdate">Targetdate:</label>
          <Input 
          name="targetDate"
          type="date"
          placeholder="Enter target date"/>
        </Form.Item>
        <Form.Item>
          <label htmlFor="status">Status:</label>
          <Select>
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="not Started">Not Started</Select.Option>
          </Select>
        </Form.Item>
        <div className="flex">
        <Button className="w-3/4 p-2 bg-purple-600 text-white font-semibold">
          <BiPlus size={23}/> Create Milestone
        </Button>
        <Button className="w-1/4 p-2 bg-red-500 text-white" onClick={handleCancelModal}>
         <MdCancel size={20}/> Cancel
        </Button>
        </div>
      </Form>
    </Modal>
    </div>
 
  );
}
