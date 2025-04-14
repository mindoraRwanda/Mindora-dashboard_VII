import  { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Pagination, Select,Spin, Steps } from "antd";
import { AiOutlineSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { FaSync, FaTrash, FaUser,FaPhone, FaMapMarkerAlt, FaFirstAid, FaExclamationTriangle, FaPills, FaPlus } from "react-icons/fa";
import PatientsList from "./PatientsList";
import { useDispatch, useSelector } from "react-redux";



import {
  createPlan,
  deleteTreatmentPlan,
  getAllTreatmentPlan,
  resetStatus,
  updateTreatmentPlan,
} from "../../Redux/TherapistSlice/TreatmentPlan";
import { RootState,AppDispatch } from "../../Redux/store";
import TextArea from "antd/es/input/TextArea";
import { TreatmentPlan } from "../../Redux/TherapistSlice/TreatmentPlan";
import { getPatientById } from "../../Redux/Adminslice/PatientSlice";
import TreatmentPlan_Goal from "./SetGoal";
import SetMilestones from "./SetMilestones";




const{Step}=Steps;

export default function TreatmentPlanContent() {
  const [activeButton, setActiveButton] = useState("All Patients");
  const [TreatmentData, setTreatmentData] = useState<TreatmentPlan[]>([]);
  const [therapistId, setTherapistId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan|null>(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewAdjustments, setViewAdjustments] = useState(null);
  const [ActiveAjustButton, setActiveAjustButton] = useState<string>("progress");
  const [newAjustment, setNewAdjestment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep,setCurrentStep]=useState(0);
  const [currentPage,setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => ({
    status: state.treatmentPlan?.status,
    error: state.treatmentPlan?.error,
  }));
  const steps=[
    {
      title:"Create Plan",
      content:(
         <Form
              form={form}
              className="bg-white rounded p-6"
              layout="vertical"
              onFinish={(values)=>{handleCreatePlan(values);
                setCurrentStep(currentStep+1);}}
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
                <TextArea  placeholder="Enter description..." />
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
                    loading={status === "loading"}
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
      ),
    },
    {
      title:"Create Goal",
      content:(
        <div>
          <TreatmentPlan_Goal callMilestone={()=>setCurrentStep(currentStep+1)}/>
          <div className="flex justify-between">
          <Button type="primary" onClick={()=>setCurrentStep(currentStep-1)}>Previous</Button>
          <Button type="primary" onClick={()=>setCurrentStep(currentStep+1)} className="mr-5">Next</Button>
          </div>
        </div>
      )
    },
    {
      title:"Create Milestone",
      content:(
        <div>
           <SetMilestones/>
           <div className="flex justify-between my-2">
          <Button type="primary" onClick={()=>setCurrentStep(currentStep-1)} >Previous</Button>
          <Button type="primary"onClick={()=>setCurrentStep(0)}className="mr-5">Done</Button>
          </div>
        </div>
      ),
    },
  ];

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
      if (status === "succeeded") {
        form.resetFields();
        dispatch(resetStatus());
        setActiveButton("All Patients");
      } else if (status === "rejected" && error) {
        message.error(error || "Failed to create treatment plan.");
        dispatch(resetStatus());
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to create treatment plan: ${errorMessage}`);
    } 
  }, [status, dispatch, form, error]);

  // Logic for getting all TreatmentPlan
  useEffect(() => {
    const getTreatmentData = async () => {
      try{
        setLoading(true);
      const result = await dispatch(getAllTreatmentPlan());
      if (getAllTreatmentPlan.fulfilled.match(result)) {
        const treatData = result.payload;
        setTreatmentData(treatData);
      }}
      catch (error) {
        const errorMessage = (error as Error).message;
      message.error(`Failed to fetch treatment Plan: ${errorMessage}`);
      }
      finally{
        setLoading(false);
      }
    };
    getTreatmentData();
  }, [dispatch, setLoading]);

  useEffect(() => {
    if (status === "succeeded") {
      setEditModalVisible(false);
      form.resetFields();
    }
  }, [status, form]);
  
  const showModal=(plan:TreatmentPlan)=>{
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
  const handleProfile =(patient:any) => {
    console.log("selected Plan to patient:",patient);
    setSelectedPatient(patient);
    setProfileModal(true);
  };
const handleCancelProfile=()=>{
  setProfileModal(false);
  };

  // Function to get selected Patient Information form database
  const handlePatientSelected = (patientId:string) => {
    console.log("selected Patient Id",patientId);
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
          const errorMessage = (error as Error).message;
          message.error(`Failed to get patient data: ${errorMessage}`);
        } finally {
          setLoading(false);
        }
      };
      getPatientData();
      setActiveButton("Create Plan");
    }
  };

  // Logics for Treatment Plan
  const handleCreatePlan = async (values:any) => {
    try {
      setLoading(true);
      const formData : Omit<TreatmentPlan, 'id'> = {
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
        setActiveButton("Create Plan");
      } else if (createPlan.rejected.match(result)) {
        message.error("Failed to create treatment plan.");
        dispatch(resetStatus());
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to create Treatment Plan: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Function To update TreatmentPlan

  const handleUpdatePlan = async (values:any) => {
    if (!selectedPlan || !selectedPlan.id) {
      message.error("No valid plan selected for update");
      return;
  }
    try {
      setLoading(true);
      const formData = {
        id:selectedPlan.id,
        updateTreatmentData:{
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        id: selectedPlan.id,           
        patientId: selectedPlan.patientId, 
        therapistId: selectedPlan.therapistId,
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
      const errorMessage = (error as Error).message;
      message.error(`Failed to Update Treatment Plan: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Fucntion to delete Plan
  const handleDeletePlan = async (id:string) => {
    if (!id) {
      message.error("Invalid plan ID");
      return;
    }
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
         message.error("Failed to delete treatment Plan");
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
          message.error(`Failed to delete treatment Plan: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Part of Treatment Adjutsment 
  const handleAdjustment=(plan)=>{
    if(!plan ||!plan.id){
      message.error("No valid plan selected for adjustment");
      return;
    }
    setSelectedPlan(plan);
    setViewAdjustments(true);
  };

  const handleActive = (buttonName:any) => {
    setActiveButton(buttonName);
  };
  const renderContent = () => {
    switch (activeButton) {
      case "All Patients":
        return <PatientsList goToPlan={handlePatientSelected} />;
      case "Create Plan":
        return (
          <div className="bg-white rounded-lg  border p-6 mt-3">
            <Steps current={currentStep}>
              {steps.map((step,index)=>(
                <Step key={index} title={step.title}/>
              ))}
            </Steps>
            <div className="mt-6">{steps[currentStep].content}</div>
          </div>
        );
      case "View Plans":{
        const startIndex=(currentPage-1)*itemsPerPage;
        const endIndex=startIndex+itemsPerPage;
        const PlanToDisplay=TreatmentData.slice(startIndex, endIndex);
      
        return loading? (
            <div className="flex items-center justify-center text-red-600 min-h-screen">
            <Spin size="large" />
          </div>
                   ):(
          <div className="bg-white rounded-lg  p-6">
         
              {PlanToDisplay.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border p-2 mt-2"
                >
 
                  <div className="flex justify-between">
                    <div>
                      <p className="text-purple-600 text-2xl font-semibold">
                        {item.patient.user.firstName} {item.patient.user.lastName}
                      </p>
                      <p className="text-black text-md my-3 flex ">
                        <strong>Problem:</strong><h2 className="text-lg"> {item.title}</h2> 
                      </p>
                      <p className="text-black text-md my-3">
                        <strong>Description:</strong> {item.description}
                      </p>
                      <div className="flex gap-4">
                        <p className="text-black text-md my-3">
                          <strong>Start Time:</strong> {item.startDate}
                        </p>
                        <p className="text-black text-md my-3">
                          <strong>End Time:</strong> {item.endDate}
                        </p>
                      </div>
                      <p className="text-black text-md my-3">
                        <strong>Condition:</strong> {item.patient?.medicalProfile?.conditions|| 'no condition specified'}
                      </p>
                      <div className="flex gap-2 my-3">
                        <Button
                          className="p-1 text-white bg-purple-600 font-semibold rounded flex gap-1 text-md"
                          onClick={() => showModal(item)}
                        >
                          <FaSync />
                          Update
                        </Button>
                        <Button
                          className="p-1 text-white bg-red-500 font-semibold rounded flex gap-1 text-md"
                          onClick={() => item.id && handleDeletePlan(item.id)}
                        >
                          <FaTrash className="mt-1" />
                          Delete
                        </Button>
                        <Button onClick={()=>handleProfile(item.patient)} className="bg-blue-600 text-white">
                          View Profile
                        </Button>
                        <Button className="bg-yellow-600 text-white" onClick={()=>handleAdjustment(item)}>
                          Adjust Plan
                        </Button>
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
              )
            )}
                <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={TreatmentData.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            style={{ marginTop: 20,justifyContent:'end' }}
          />
                      {viewAdjustments && selectedPlan && (
                      <div className="mt-6 p-6 bg-purple-50 rounded-lg shadow-md">
                     <h3 className="text-xl font-semibold mb-4 text-black">
                          Adjustment Options for: {selectedPlan.title || "Selected Plan"}
                      </h3>
                      <div className="flex items-center mb-4 gap-2">
                      <Button 
        className={`${ActiveAjustButton === "progress" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-800"}`}
        onClick={() =>setActiveAjustButton("progress")}
      >
        Progress
        </Button>
        <Button 
        className={`${ActiveAjustButton === "feedback" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-800"}`}
        onClick={() => setActiveAjustButton("feedback")}
      >
        Feedback
      </Button> 
      <Button 
        className={`${ActiveAjustButton === "tasks" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-800"}`}
        onClick={() => setActiveAjustButton("tasks")}
      >
        Follow-up Tasks
      </Button>
      </div>
    </div>
  )}
   <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
    {
      ActiveAjustButton === "progress" && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-black">
            Progress Adjustment for: {selectedPlan?.title || "Selected Plan"}
          </h3>
          {/* Progress Adjustment Components */}
          <Button className="bg-purple-600 text-white p-2" onClick={()=>setNewAdjestment(true)}>
            <FaPlus className="mr-2" />
            Add Progress Adjustment
          </Button>
        </div>
      )}
      {ActiveAjustButton === "feedback" && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-black">
            Feedback Adjustment for: {selectedPlan?.title || "Selected Plan"}
          </h3>
          {/* Feedback Adjustment Components */}
        </div>
      )}
      {ActiveAjustButton === "tasks" && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-black">
            Follow-up Tasks Adjustment for: {selectedPlan?.title || "Selected Plan"}
          </h3>
          {/* Follow-up Task Adjustment Components */}
        </div>
   ) }
   </div>
          </div>
          )}
          
      default:
        return null;
    }
    
  };
  return (
    <div className="bg-white rounded border p-6">
     
        <h1 className="text-black flex justify-center  bg-gray   w-full p-2 text-3xl font-semibold">
           Treatment Plan
        </h1>
    
      <div className="flex flex-row gap-9 mt-9">
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
            <TextArea  placeholder="Enter description..." />
          </Form.Item>

          <Form.Item name="startDate" label="Start Date">
            <Input type="date" placeholder="Enter startDate..." />
          </Form.Item>
          <Form.Item name="endDate" label="End Date">
            <Input type="date" placeholder="Enter endDate..." />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select  id="status" className="w-full">
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
                loading={status === "loading"}
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
      {/* The following is Modal for Profile */}
      <Modal
      footer={null}
      open={profileModal} onCancel={handleCancelProfile}>
      <div className="flex justify-center p-1">
          <div className="flex rounded-full p-3 border-2">
          <FaUser size={35}/>
          </div>  
      </div>
        {selectedPatient && (
          <>
          <div className="flex justify-center">
            <h2 className="text-xl text-black font-semibold">
              {selectedPatient.user?.firstName} {selectedPatient.user?.lastName}
            </h2>
          </div>
        <div className="border p-1">
        <h2 className="flex font-semibold text-lg">EmergencyContact: </h2>
        <h2 className="flex gap-1 my-2"><FaUser size={17}/> Name:   {selectedPatient.emergencyContact.name}</h2>
        <h2 className="flex gap-1 my-2"><FaPhone size={17}/> Phone number:   {selectedPatient.emergencyContact.phone}</h2>
        <h2 className="flex gap-1 my-2"><FaMapMarkerAlt size={17}/> Address:   {selectedPatient.emergencyContact.address}</h2>
        <h2 className="flex font-semibold text-lg">Medical Profile: </h2>
        <h2 className="flex gap-1 my-2"><FaExclamationTriangle size={17}/> allergies:   {selectedPatient.medicalProfile.allergies}</h2>
        <h2 className="flex gap-1 my-2"><FaFirstAid size={17}/> Condition:   {selectedPatient.medicalProfile.conditions}</h2>
        <h2 className="flex gap-1 my-2"><FaPills size={17}/> Medication:   {selectedPatient.medicalProfile.medications}</h2>
          </div>
          </>
        )}
      </Modal>
      <Modal open={newAjustment} onCancel={()=>{setNewAdjestment(false);form.resetFields()}} footer={null} title="Create New Adjustment">
        <Form form={form} className="bg-white rounded p-6" layout="vertical">
          <Form.Item name="title" label="Title">
            <Input
              type="text"
              placeholder="Enter title... "
              className="text-black"
            />
          </Form.Item>
          <Form.Item name="reason" label="Reason">
            <TextArea  placeholder="Enter Reason...." />
          </Form.Item>
          <Form.Item name="modifiedBy" label="Modified By">
            <Input placeholder="Modified By..." />
          </Form.Item>
          <Button className="w-full bg-purple-600 p-3 text-white">New Adjestment</Button>
          </Form>
      </Modal>
    </div>
  );
}
