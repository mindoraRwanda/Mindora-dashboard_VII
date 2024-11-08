import React, { useEffect, useState } from "react";

import { MdCancel } from "react-icons/md";
import { FaSync, FaTrash } from "react-icons/fa";
import { AiOutlineSave } from "react-icons/ai";
import { Button, Form, Input, message, Modal, Select,Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import { createGoal, deleteGoals, getAllGoals, updateGoals } from "../../Redux/TherapistSlice/Goals";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

export default function TreatmentPlan() {
  const status = useSelector((state: RootState) => state.goalPlan.status);
  const [loading, setLoading] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [treatmentPlanId, setTreatmentPlanId] = useState(null);
  const [Goaldata, setGoalData] = useState([]);
  const [currentGoalId, setCurrentGoalId] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();


  const showModal=(goal)=>{
    setEditModalVisible(true);
    setCurrentGoalId(goal.id);
    form.setFieldsValue({
      description: goal.description,
      targetDate: goal.targetDate ? goal.targetDate.slice(0, 10) : "",
      status: goal.status,
    })
  };

  const handleCancelModal=()=>{
    setEditModalVisible(false);
    form.resetFields();
    dispatch(resetStatus());
  
  };


  // useEffect for Getting Single treatmentPlan
  useEffect(() => {
    const storedPlanId = localStorage.getItem("treatmentPlanId");
    if (storedPlanId) {
      setTreatmentPlanId(storedPlanId);
      form.setFieldsValue({
        treatmentPlanId: storedPlanId,
      });
    }
  }, [form]);

  // useEffect for Getting All Goals

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const result = await dispatch(getAllGoals());
        if (result && result.payload) {
          setGoalData(result.payload);
        }
      } catch (error) {
        console.error("Failed to fetch goals:", error);
      }
      finally{
        setLoading(false);
      }
    };
    fetchGoals();
  }, [dispatch]);

  // function for creating Goals
  const handleCreateGoal = async (values) => {
    try {
      setLoading(true);
      const goalData = {
        treatmentPlanId: values.treatmentPlanId,
        description: values.description,
        status: values.status,
        targetDate: values.targetDate,
      };
      await dispatch(createGoal(goalData));
      message.success("Goal created successfully!");
      form.resetFields();
    } catch (error) {
      message.error(`Failed to create goal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  // Logics for Updating goals
const handleUpdateGoal=async (values) => {
  try{
    setLoading(true);
    const goalData={
      description: values.description,
      status: values.status,
      targetDate: values.targetDate,
    };
     
    const result = await dispatch(updateGoals({
      id: currentGoalId,
      goalData: goalData
    }));
 if(updateGoals.fulfilled.match(result)){
  message.success("Goal updated successfully!");
  setEditModalVisible(false);
  form.resetFields();
  dispatch(getAllGoals());
 }
 else if(updateGoals.rejected.match(result)){
  message.error("Failed to update treatment plan.");
 }
  }
  catch(error){
    message.error(`Failed to update goal: ${error.message}`);
  }
  finally{
    setLoading(false);
  }
};

  // Function for deleting goals
  const handleDeleteGoal=async (id) => {
    try {
      setLoading(true);
      await dispatch(deleteGoals(id));
      message.success("Goal deleted successfully!");
    } catch (error) {
      message.error(`Failed to delete goal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow-xl border p-6">
      <div className="text-black flex flex-row">
        <h1 className="text-white text-3xl w-full p-2 font-semibold bg-purple-600 ">
          Treatment Plan Management - Goals Management
        </h1>
      </div>
      <div className="bg-white rounded-lg shadow-xl border p-6 mt-5">
        <h1 className="text-black text-2xl font-semibold ml-6">Create Goals</h1>
        <Form
          form={form}
          className="p-6"
          layout="vertical"
          onFinish={handleCreateGoal}
        >
          <Form.Item
            name="treatmentPlanId"
            label="TreatmentPlanId:"
            initialValue={treatmentPlanId}
            // hidden
          >
            <Input type="text" readOnly />
          </Form.Item>
          <Form.Item name="description" label="Description:">
            <TextArea type="text" placeholder="Enter Goal Description" />
          </Form.Item>
          {/* logic for date */}
          <div className="flex flex-row gap-2">
            <Form.Item className="w-1/2" name="targetDate" label="TargetDate">
              <Input type="date" placeholder="Enter Goal Date" />
            </Form.Item>
            {/* logic for status */}

            <Form.Item className="w-1/2 rounded " name="status" label="status:">
              <Select
                name="status"
                id="status"
                className="w-full"
                defaultValue=""
              >
                <Select.Option value="">Select Status</Select.Option>
                <Select.Option value="completed">completed</Select.Option>
                <Select.Option value="pending">pending</Select.Option>
                <Select.Option value="in-progress">in-progress</Select.Option>
              </Select>
            </Form.Item>
          </div>
          {/* logic for button */}

          <div className="flex gap-3">
            <Form.Item className="w-full">
              <Button
                className="w-2/3 bg-purple-600 text-white font-semibold"
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                <AiOutlineSave size={20} />
                {status === "loading" ? " Loading..." : "Create Goal"}
              </Button>
              <Button
                className="bg-red-500 text-white w-1/3 "
                onClick={() => form.resetFields()}
              >
                <MdCancel size={20} /> Resert
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className="bg-white rounded-lg shadow-xl border p-6 mt-4">
        <h1 className="text-black text-2xl font-semibold ">
          {" "}
          List Of All Goals
        </h1>
        {loading? (
   <div className="flex items-center justify-center text-red-600 min-h-screen">
   <Spin size="large" />
 </div>
          ):(
        <div className="bg-white rounded-lg shadow-xl p-6">
          {Goaldata.map((Goal) => (
            <div key={Goal.id} className="bg-white rounded-lg border p-2 mt-2">
              <div className="flex justify-between">
                <div>
                  <p className="text-black text-md my-3">
                    <strong>Description:</strong> {Goal.description}
                  </p>
                  <p className="text-black text-md my-3">
                    <strong>targetDate:</strong>
                    {Goal.targetDate}
                  </p>
                </div>

                <p
                  className={`italic m-5 p-2 text-sm  ${
                    Goal.status === "completed"
                      ? "text-purple-600"
                      : Goal.status === "in-progress"
                      ? "text-green-500"
                      : Goal.status === "pending"
                      ? "text-orange-400"
                      : Goal.status === "cancelled"
                      ? "text-red-700"
                      : ""
                  }`}
                >
                  {Goal.status}
                </p>
                <div className="flex gap-2 my-3">
                  <Button
                    className="p-1 text-white bg-purple-600 font-semibold rounded flex gap-1 text-md"
                     onClick={() => showModal(Goal)}
                  >
                    <FaSync />
                    Update
                  </Button>
                  <Button
                    className="p-1 text-white bg-red-500 font-semibold rounded flex gap-1 text-md"
                     onClick={() => handleDeleteGoal(Goal.id)}
                  >
                    <FaTrash className="mt-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
          )}
      </div>
      <Modal open={editModalVisible} footer={null} onCancel={handleCancelModal} title="Update Goal">
        <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateGoal}
          className="bg-white rounded p-6"
        >
          <Form.Item name="description" label="Description:">
            <Input type="text" placeholder="Enter Goal Description" />
          </Form.Item>
          <Form.Item name="targetDate" label="Target Date:">
            <Input type="date" placeholder="Enter Goal Target"/>
          </Form.Item>
          <Form.Item name="status" label="Goal Status">
            <Select>
              <Select.Option value="completed">completed</Select.Option>
              <Select.Option value="ongoing">ongoing</Select.Option>
              <Select.Option value="pending">pending</Select.Option>
              <Select.Option value="waiting">waiting</Select.Option>
            </Select>
          </Form.Item>
          <div className="flex gap-2">
            <Form.Item className="w-full">
              <Button
                className="w-2/3 bg-purple-600 text-white font-semibold"
                htmlType="submit"
                loading={loading} 
                disabled={loading}
              >
                <AiOutlineSave size={20} />{" "}
                {status === "loading" ? "Loading..." : "Update Treatment Goals"}
              </Button>
              <Button
                className="bg-red-500 text-white w-1/3 "
                onClick={() => form.resetFields()}
              >
                <MdCancel size={20} /> Cancel
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
