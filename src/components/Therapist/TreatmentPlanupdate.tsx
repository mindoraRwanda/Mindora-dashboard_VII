import React, { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
// import { AiOutlineSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { FaUser, FaSync, FaTrash } from "react-icons/fa";
import PatientsList from "./PatientsList";
import { useDispatch, useSelector } from "react-redux";
import { getPatientById } from "../../Redux/Adminslice/PatientSlice";
import { createPlan,resetStatus} from "../../Redux/TherapistSlice/TreatmentPlan";


export default function TreatmentPlan() {
  const [activeButton, setActiveButton] = useState("All Patients");

  const { status } = useSelector((state: RootState) => ({
    status: state.treatmentPlan?.status,
    error: state.treatmentPlan?.error,
  }));
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleActive = (buttonName) => {
    setActiveButton(buttonName);
  };

  // Function to get selected Patient Information form database
  const handlePatientSelected = (patientId) => {
    if (patientId) {
      const getPatientData = async () => {
        try {
          const result = await dispatch(getPatientById(patientId));
          if (getPatientById.fulfilled.match(result)) {
            const patientData = result.payload;
            console.log(patientData);
            form.setFieldsValue({
              patientId: patientData.id,
            });
          }
        } catch (error) {
          console.log("Failed to get patient data:", error.message);
        }
      };
      getPatientData();
      setActiveButton("Create Plan");
    }
  };

  // This is used for getting Therapist It Logged In
  useEffect(() => {
    const storedTherapistId = localStorage.getItem("TherapistId");
    if (storedTherapistId) {
      console.log("Retrieved Therapist LoggedIn ID:", storedTherapistId);
      form.setFieldsValue({
        TherapistId: storedTherapistId,
      });
    }
  }, [form]);

  // Logics for Treatment Plan
  const handleCreatePlan = async (values) => {
    try {
      const formData = {
        TherapistId: values.TherapistId,
        patientId: values.patientId,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        title: values.treatmentTitle,
        description: values.description,
        status: values.status,
      };
      // Add new treatment plan to database
      const result = await dispatch(createPlan(formData));
      if (createPlan.fulfilled.match(result)) {
        message.success("Treatment plan created successfully!");
        form.resetFields();
        dispatch(resetStatus);
        setActiveButton("All Patients");
      } else if (createPlan.rejected.match(result)) {
        message.error("Failed to create treatment plan.");
        dispatch(resetStatus);
      }
    } catch (error) {
      message.destroy("Failed to create treatment plan:", error.message);
    }
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
        title: "Mental checking",
        description: " This time we are going to do some test",
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
        title: "Mental checking",
        description: " This time we are going to do some test",
        therapist: "Placide Ikundabayo",
        statusApp: "Pending",
      },
    ],
  });

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
      {activeButton === "All Patients" && (
        <PatientsList goToPlan={handlePatientSelected} />
      )}
      ;
      {activeButton === "Create Plan" && (
        <div className="bg-white rounded-lg shadow-xl border p-6 mt-3">
          <Form
            form={form}
            className="bg-white rounded "
            layout="vertical"
            onFinish={handleCreatePlan}
          >
            <h1 className="text-black text-2xl font-semibold mb-5 ">
              Create Patient Plan
            </h1>
            <Form.Item label="PatientId:" name="patientId">
              <Input type="text" placeholder="Enter patientId ..." readOnly />
            </Form.Item>

            <Form.Item label="TherapistId:" name="TherapistId">
              <Input type="text" placeholder="Enter therapistId..." />
            </Form.Item>
            <Form.Item label="Treatment Title:" name="treatmentTitle">
              <Input type="text" placeholder="Enter treatmentTitle..." />
            </Form.Item>
            <Form.Item label="Description:" name="description">
              <Input type="textarea" placeholder="Enter description..." />
            </Form.Item>
            <Form.Item label="Start Date:" name="startDate">
              <Input type="date" placeholder="Enter startDate..." />
            </Form.Item>
            <Form.Item label="End Date:" name="endDate">
              <Input type="date" placeholder="Enter endDate..." />
            </Form.Item>
            <Form.Item label="Status:">
              <select name="status" id="status" className="w-full border p-2">
                <option value="">Select Status</option>
                <option value="Active">Pending</option>
                <option value="Inactive">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </Form.Item>
          </Form>

          <Form.Item className="flex justify-between">
            <Button
              className="w-3/4 bg-purple-600 px-10 text-white font-semibold"
              htmlType="submit"
              loading={status === "loading"} 
              disabled={status === "loading"}
            >
              {status === "loading" ? "Creating..." : "Create Treatment Plan"}
            </Button>

            <Button
              className="border-red-400 border text-white bg-red-500 px-10 rounded
               font-semibold flex flex-row gap-1 w-1/4 hover:bg-red-600"
              onClick={() => form.resetFields()} // Reset form or add cancel action
            >
              <MdCancel size={22} /> Cancel
            </Button>
          </Form.Item>
        </div>
      )}
      ;
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
                  <label htmlFor="title" className="text-black text-lg">
                    Title:
                  </label>
                  <p className="text-black text-lg font-semibold">
                    {item.title}
                  </p>
                </div>
                <label htmlFor="description" className="text-black">
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full border-2 p-2 rounded-md text-black"
                  value={item.description}
                  readOnly
                />
                <div className="flex flex-row gap-4 my-2">
                  <p className="text-black text-sm flex flex-row gap-1">
                    <BiTime size={19} /> Date: {item.date}
                  </p>

                  <p className="text-black text-sm flex flex-row gap-1">
                    <BiTime size={19} /> Time: {item.startTime}
                  </p>
                  <p className="text-black text-sm flex flex-row gap-1">
                    <BiTime size={19} /> Time: {item.endTime}
                  </p>
                  <p className="text-black text-sm flex flex-row gap-1">
                    <BiTime size={19} /> Duration: {item.duration}
                  </p>
                </div>
                <div className="my-4 flex flex-row">
                  <button className=" text-sm bg-purple-600  gap-1 text-white p-2 rounded flex flex-row  hover:bg-purple-800">
                    <FaSync size={20} color="white" /> Update
                  </button>
                  <button className="text-white text-sm bg-red-500 gap-1   p-2 rounded ml-2 flex flex-row hover:bg-red-700">
                    <FaTrash size={20} color="white" /> Delete
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
                <p className="italic m-5 p-2 text-red-700">{item.statusApp}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
