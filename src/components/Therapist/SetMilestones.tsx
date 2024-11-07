import { Input, Modal, Form, Select, Button, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { BiEdit, BiPlus } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import TextArea from "antd/es/input/TextArea";
import {
  createMilestone,
  deleteMilestone,
  getAllMilestones,
  updateMilestone,
} from "../../Redux/TherapistSlice/Milestones";

export default function SetMilestones() {
  const [showModal, setShowModal] = useState(false);
  const [Loading, setLoading] = useState(null);
  const [goalId, setGoalId] = useState(null);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [milestoneData, SetMilestones] = useState([]);

  const status = useSelector((state: RootState) => state.milestone.status);
  const [form] = useForm();
  const dispatch = useDispatch();

  const handleShowModal = (milestone) => {
    setShowModal(true);
    setCurrentMilestone(milestone.id);
    form.setFieldsValue({
      description: milestone.description,
      targetDate: milestone.targetDate ? milestone.targetDate.slice(0, 10) : "",
      status: milestone.status,
    });
  };
  const handleCancelModal = () => {
    setShowModal(false);
    form.resetFields();
  };

  // efect to get Stored goalId
  useEffect(() => {
    const storedGoalId = localStorage.getItem("goalId");
    console.log("storeGoalId", storedGoalId);
    if (storedGoalId) {
      setGoalId(storedGoalId);
      form.setFieldsValue({ goalId: storedGoalId });
    }
  }, [form]);
  // To get all milestones
  useEffect(() => {
    const fetchAllMilestones = async () => {
      try {
        const result = await dispatch(getAllMilestones());
        if (result && result.payload) {
          SetMilestones(result.payload);
        }
      } catch (error) {
        message.error(`Failed to fetch milestones: ${error.message}`);
      }
    };

    fetchAllMilestones();
  }, [dispatch]);

  // function to create milestones
  const handleCreateMilestones = async (values) => {
    try {
      setLoading(true);
      const Data = {
        goalId: values.goalId,
        targetDate: values.targetDate,
        description: values.description,
        status: values.status,
      };
      await dispatch(createMilestone(Data));
      message.success("Milestone created successfully");
      form.resetFields();
      setShowModal(false);
    } catch (error) {
      message.error(`Failed to create milestone: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // function to update milestones

  const handleUpdateMilestone = async (values) => {
    try {
      setLoading(true);
      const milestoneData = {
      
        targetDate: values.targetDate,
        description: values.description,
        status: values.status,
      };
      const result = await dispatch(updateMilestone({  id: currentMilestone,milestoneData:milestoneData}));
      if (updateMilestone.fulfilled.match(result)) {
        message.success("Milestone updated successfully");
        form.resetFields();
        setShowModal(false);
      } else if (updateMilestone.rejected.match(result)) {
        message.error("Failed to update treatment plan.");
      }
    } catch (error) {
      message.error(`Failed to update goal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // function to delete milestones
  const handleDeleteGoal = async (id) => {
    try {
      setLoading(true);
      await dispatch(deleteMilestone(id));
      message.success("Milestone deleted successfully");
    } catch (error) {
      message.error(`Failed to delete milestone: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
          <button
            className="text-white mr-4 p-2 bg-purple-600 rounded-md flex font-semibold"
            onClick={handleShowModal}
          >
            {" "}
            <BiPlus size={23} />
            Add new
          </button>
        </div>
        <div className="bg-gray-100 rounded shadow-xl border p-6 my-3">
          <h1 className="text-2xl font-semibold text-black">
            {" "}
            List Of Mistones
          </h1>

          <div className="bg-white rounded-md shadow-xl border p-6 my-3 ">
            {milestoneData.map((milestone) => (
              <div key={milestone.id} className="flex justify-between">
                <div>
                  <h2 className="text-black  text-xl my-2">
                    <strong>Description:</strong>
                    <br />
                    {milestone.description}
                  </h2>
                  <p className="text-black text-md my-2">
                    <strong>TargetDate: </strong> {milestone.targetDate}
                  </p>
                </div>
                <div className="bg-transparent  p-2">
                  <p
                    className={`italic  text-sm  ${
                      milestone.status === "completed"
                        ? "text-purple-600"
                        : milestone.status === "in-progress"
                        ? "text-green-500"
                        : milestone.status === "pending"
                        ? "text-orange-400"
                        : milestone.status === "cancelled"
                        ? "text-red-700"
                        : ""
                    }`}
                  >
                    {milestone.status}
                  </p>
                </div>
                <div className="">
                  <Button className="mr-3 p-2 bg-purple-600 text-white font-semibold"
                    onClick={()=>handleShowModal(milestone)}>
                    <BiEdit size={20} /> update
                  </Button>
                  <Button
                    className="mr-3 p-2 bg-red-500 text-white font-semibold"
                    onClick={() => handleDeleteGoal(milestone.id)}
                  >
                    <FaTrash size={20} /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal footer={null} visible={showModal} onCancel={handleCancelModal}>
        {/* Add your modal content here */}
        <Form
          form={form}
          layout="vertical"
          onFinish={currentMilestone ? handleUpdateMilestone : handleCreateMilestones}
          initialValues={{ goalId }}
        >
          <h1 className="text-black text-2xl font-semibold my-3">
          {currentMilestone ? "Update Milestone" : "Create Milestone"}
          </h1>
          {!currentMilestone && (
            <Form.Item name="goalId" label="Enter GoalId:">
              <Input className="p-2 text-black" type="text" readOnly value={goalId} />
            </Form.Item>
          )}
          <Form.Item name="description" label="Description:">
            <TextArea
              className="w-full rounded-md p-2 "
              placeholder="Enter milestone description"
            />
          </Form.Item>
          <Form.Item name="targetDate" label="Targetdate:">
            <Input
              type="date"
              className="p-2"
              placeholder="Enter target date"
            />
          </Form.Item>
          <Form.Item name="status" label="Status:">
            <Select name="status" defaultValue="">
              <Select.Option value="">Select Status</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="not Started">Not Started</Select.Option>
            </Select>
          </Form.Item>
          <div className="flex">
          <Button className="w-3/4 p-2 bg-purple-600 text-white font-semibold" htmlType="submit" loading={status === "loading"} disabled={status === "loading"}>
              <BiPlus size={23} />
              {status === "loading" ? "Loading..." : currentMilestone ? "Update Milestone" : "Create Milestone"}
            </Button>
            <Button
              className="w-1/4 p-2 bg-red-500 text-white"
              onClick={() => form.resetFields()}
            >
              <MdCancel size={20} /> Resert
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
