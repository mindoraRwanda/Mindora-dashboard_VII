import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Select } from "antd";
import { AiOutlineSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
// import { BiTime } from "react-icons/bi";
import { FaSync, FaTrash } from "react-icons/fa";
import PatientsList from "./PatientsList";
import { useDispatch, useSelector } from "react-redux";
import { getPatientById } from "../../Redux/Adminslice/PatientSlice";
import {
  createPlan,
  deleteTreatmentPlan,
  getAllTreatmentPlan,
  resetStatus,
  updateTreatmentPlan,
} from "../../Redux/TherapistSlice/TreatmentPlan";
import { RootState } from "../../Redux/store";
import TextArea from "antd/es/input/TextArea";

export default function TreatmentPlan() {
  const [activeButton, setActiveButton] = useState("All Patients");
  const [TreatmentData, setTreatmentData] = useState([]);
  const [therapistId, setTherapistId] = useState(null);
  const [loading, setLoading] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { status, error } = useSelector((state: RootState) => ({
    status: state.treatmentPlan?.status,
    error: state.treatmentPlan?.error,
  }));
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleActive = (buttonName) => {
    setActiveButton(buttonName);
  };
  // This is used for getting Therapist It Logged In
  useEffect(() => {
    const storedTherapistId = localStorage.getItem("TherapistId");
    if (storedTherapistId) {
      setTherapistId(storedTherapistId);
      console.log("Retrieved Therapist LoggedIn id:", storedTherapistId);
      form.setFieldsValue({
        TherapistId: storedTherapistId,
      });
    }
  }, [form]);

  // This used for status
  useEffect(() => {
    try {
      setLoading(true);
      if (status === "succeeded") {
        form.resetFields();
        dispatch(resetStatus());
        setActiveButton("All Patients");
      } else if (status === "rejected" && error) {
        message.error(error || "Failed to create treatment plan.");
        dispatch(resetStatus());
      }
    } catch (error) {
      console.log("Failed to create treatment plan:", error);
      message.error("Failed to create treatment plan");
    } finally {
      setLoading(false);
    }
  }, [status, dispatch, form, error]);

  // Logic for getting all TreatmentPlan
  useEffect(() => {
    const getTreatmentData = async () => {
      const result = await dispatch(getAllTreatmentPlan());
      if (getAllTreatmentPlan.fulfilled.match(result)) {
        const treatData = result.payload;
        setTreatmentData(treatData);
      }
    };
    getTreatmentData();
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      setEditModalVisible(false);
      form.resetFields();
    }
  }, [status, form]);
  
  const showModal=(plan)=>{
    setSelectedPlan(plan);
    form.setFieldsValue({
      id: plan.id,
      title: plan.title,
      description: plan.description,
      startDate: plan.startDate ? plan.startDate.split("T")[0] : "",
      endDate: plan.endDate ? plan.endDate.split("T")[0] : "",
      status: plan.status,
    });
    setEditModalVisible(true);
  };

  const handleCancelModal = () => {
    form.resetFields();
    setEditModalVisible(false);
  };

  // Function to get selected Patient Information form database
  const handlePatientSelected = (patientId) => {
    if (patientId) {
      const getPatientData = async () => {
        try {
          setLoading(true);
          const result = await dispatch(getPatientById(patientId));
          if (getPatientById.fulfilled.match(result)) {
            message.success("Patient Selected successfully");
            const patientData = result.payload;
            console.log("SELECTED Patients Data:", patientData);
            form.setFieldsValue({
              patientId: patientData.id,
              TherapistId: therapistId,
            });
          }
        } catch (error) {
          console.log("Failed to get patient data:", error.message);
        } finally {
          setLoading(false);
        }
      };
      getPatientData();
      setActiveButton("Create Plan");
    }
  };

  // Logics for Treatment Plan
  const handleCreatePlan = async (values) => {
    try {
      setLoading(true);
      const formData = {
        therapistId: values.TherapistId,
        patientId: values.patientId,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        title: values.treatmentTitle,
        description: values.description,
        status: values.status,
      };
      const result = await dispatch(createPlan(formData));
      if (createPlan.fulfilled.match(result)) {
        message.success("Treatment plan created successfully!");
        form.resetFields();
        dispatch(resetStatus());
        setActiveButton("View Plans");
      } else if (createPlan.rejected.match(result)) {
        message.error("Failed to create treatment plan.");
        dispatch(resetStatus());
      }
    } catch (error) {
      message.error(`Failed to create treatment plan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function To update TreatmentPlan

  const handleUpdatePlan = async (values) => {
    try {
      setLoading(true);
      const formData = {
        id:selectedPlan.id,
        updateTreatmentData:{
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        title: values.title,
        description: values.description,
        status: values.status,
        }
      };
      const result = await dispatch(updateTreatmentPlan(formData));
      if (updateTreatmentPlan.fulfilled.match(result)) {
        message.success("Treatment plan updated successfully!");
        setEditModalVisible(false);
        form.resetFields();
        dispatch(resetStatus());
        setActiveButton("View Plans");
      
      } else if (updateTreatmentPlan.rejected.match(result)) {
        message.error("Failed to update treatment plan.");
        dispatch(resetStatus());
      }
    } catch (error) {
      message.error(`Failed to update treatment plan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fucntion to delete Plan
  const handleDeletePlan = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete");
    if (confirmed) {
      try {
        setLoading(true);
        const result = await dispatch(deleteTreatmentPlan(id));
        if (deleteTreatmentPlan.fulfilled.match(result)) {
          message.success("Treatment plan deleted successfully!");
          setEditModalVisible(false);
          setActiveButton("View Plans");
          dispatch(resetStatus());
        
        } else if (deleteTreatmentPlan.rejected.match(result)) {
          message.error("Failed to delete treatment plan.");
        }
      } catch (error) {
        message.error(`Failed to delete treatment plan: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };
  const renderContent = () => {
    switch (activeButton) {
      case "All Patients":
        return <PatientsList goToPlan={handlePatientSelected} />;
      case "Create Plan":
        return (
          <div className="bg-white rounded-lg shadow-xl border p-6 mt-3">
            <Form
              form={form}
              className="bg-white rounded p-6"
              layout="vertical"
              onFinish={handleCreatePlan}
            >
              <h1 className="text-black text-2xl font-semibold mb-5 ">
                Create Patient Plan
              </h1>
              <Form.Item label="PatientId:" name="patientId" hidden>
                <Input type="text" placeholder="Enter patientId ..." readOnly />
              </Form.Item>

              <Form.Item
                label="TherapistId:"
                name="TherapistId"
                initialValue={therapistId}
                hidden
              >
                <Input
                  type="text"
                  placeholder="Enter therapistId... "
                  readOnly
                />
              </Form.Item>
              <Form.Item label="Treatment Title:" name="treatmentTitle">
                <Input type="text" placeholder="Enter treatmentTitle..." />
              </Form.Item>
              <Form.Item label="Description:" name="description">
                <TextArea type="textarea" placeholder="Enter description..." />
              </Form.Item>
              <div className="flex gap-2">
                <Form.Item
                  label="Start Date:"
                  name="startDate"
                  className="w-1/2"
                >
                  <Input type="date" placeholder="Enter startDate..." />
                </Form.Item>
                <Form.Item label="End Date:" name="endDate" className="w-1/2">
                  <Input type="date" placeholder="Enter endDate..." />
                </Form.Item>
              </div>
              <Form.Item label="Status:"name="status">
                <Select id="status" className="w-full">
                  <Select.Option value="">Select Status</Select.Option>
                  <Select.Option value="Active">Pending</Select.Option>
                  <Select.Option value="Ongoing">Ongoing</Select.Option>
                  <Select.Option value="Completed">Completed</Select.Option>
                  <Select.Option value="Cancelled">Cancelled</Select.Option>
                </Select>
              </Form.Item>

              <div className="flex gap-2">
                <Form.Item className="w-full">
                  <Button
                    className="w-2/3 bg-purple-600 text-white font-semibold"
                    htmlType="submit"
                    isLoading={status === "loading"}
                    disabled={status === "loading"}
                  >
                    <AiOutlineSave size={20} />{" "}
                    {status === "loading"
                      ? "Creating..."
                      : "Create Treatment Plan"}
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
          </div>
        );
      case "View Plans":
        return (
          <div className="bg-white rounded-lg shadow-xl p-6">
            {loading ? (
              <div className="text-center text-xl text-black py-8">
                Loading...
              </div>
            ) : TreatmentData.length === 0 ? (
              <div className="text-center py-8">No treatment plans found</div>
            ) : (
              TreatmentData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border p-2 mt-2"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-purple-600 text-2xl font-semibold">
                        {item.title}
                      </p>
                      <p className="text-black text-md my-3">
                        <strong>Description:</strong> {item.description}
                      </p>
                      <div className="flex gap-4">
                        <p className="text-black text-md my-3">
                          <strong>Start Time:</strong>
                          {item.startDate}
                        </p>
                        <p className="text-black text-md my-3">
                          <strong>End Time:</strong> {item.endDate}
                        </p>
                      </div>
                      <p className="text-black text-md my-3">
                        <strong>Condition:</strong>
                        {item.patient.medicalProfile.conditions}
                      </p>
                      <div className="flex gap-2 my-3">
                        <button
                          className="p-1 text-white bg-purple-600 font-semibold rounded flex gap-1 text-md"
                          onClick={() => showModal(item)}
                        >
                          <FaSync />
                          Update
                        </button>
                        <button
                          className="p-1 text-white bg-red-500 font-semibold rounded flex gap-1 text-md"
                          onClick={() => handleDeletePlan(item.id)}
                        >
                          <FaTrash className="mt-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                    <div>
                      <p
                        className={`italic m-5 p-2 text-sm font-semibold ${
                          item.status === "Completed"
                            ? "text-purple-600"
                            : item.status === "Ongoing"
                            ? "text-green-500"
                            : item.status === "Pending"
                            ? "text-orange-400"
                            : item.status === "Cancelled"
                            ? "text-red-700"
                            : ""
                        }`}
                      >
                        {item.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded shadow-xl border p-6">
      <div className="text-black flex flex-row">
        <h1 className="text-white bg-purple-600  w-full p-2 text-3xl font-semibold">
          Treatment Plan Management - Create Treatment Plan
        </h1>
      </div>
      <div className="flex flex-row gap-9 mt-10">
        {["All Patients", "Create Plan", "View Plans"].map((buttonName) => (
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

      {renderContent()}

      <Modal open={editModalVisible} footer={null} onCancel={handleCancelModal}>
        <Form
          form={form}
          className="bg-white rounded p-6"
          layout="vertical"
          onFinish={handleUpdatePlan}
        >
          <Form.Item name="title" label="Title">
            <Input
              type="text"
              placeholder="Enter title... "
              className="text-black"
            />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea type="textarea" placeholder="Enter description..." />
          </Form.Item>

          <Form.Item name="startDate" label="Start Date">
            <Input type="date" placeholder="Enter startDate..." />
          </Form.Item>
          <Form.Item name="endDate" label="End Date">
            <Input type="date" placeholder="Enter endDate..." />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select name="status" id="status" className="w-full">
              <Select.Option value="Active">Pending</Select.Option>
              <Select.Option value="Ongoing">Ongoing</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex gap-2">
            <Form.Item className="w-full">
              <Button
                className="w-2/3 bg-purple-600 text-white font-semibold"
                htmlType="submit"
                isLoading={status === "loading"}
                disabled={status === "loading"}
              >
                <AiOutlineSave size={20} />{" "}
                {status === "loading" ? "Updating..." : "Update Treatment Plan"}
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
