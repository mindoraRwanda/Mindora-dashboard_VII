/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Input, Button, Select, message, Switch,Spin } from "antd";
import { BiCalendar, BiEdit, BiTime } from "react-icons/bi";
import { FaPlus, FaTrash } from "react-icons/fa";
import { RootState } from "../../Redux/store";
import { AppDispatch } from "../../Redux/store";

import {
  deleteAvailableSlot,
  getAllAvailableSlot,
  updateAvailableSlot,
} from "../../Redux/TherapistSlice/Appointment_Slot";
import { createAvailableSlot } from "../../Redux/TherapistSlice/Appointment_Slot";
import { Globe } from "lucide-react";

interface SlotData {
  id: string;
  availableDay: string;
  startTime: string;
  endTime: string;
  date: string;
  timeZone: string;
  recurring: boolean;
}
export default function ManageAppointMents() {
  const [activeButton, setActiveButton] = useState("Availlable Slots");
  const [modalVisible, setModalVisible] = useState(false);
  const [editMOdal, setEditMOdal] = useState(false);
  const [SlotData, setSlotData] = useState<SlotData[]>([]);
  const [currentSlot, setCurrentSlot] = useState<SlotData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const dispatch = useDispatch<AppDispatch>(); 
  const [form] = Form.useForm();

  const [availableDay, setavailableDay] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [timeZone, setTimezone] = useState("");
  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");
  const [therapistId, setTherapistId] = useState("");
  const [formData, setFormData] = useState({ recurring: false });

  const {status } = useSelector((state: RootState) => ({status: state.availableSlot.status}));
  
  // useEffect to update slotData 
  useEffect(()=>{
    setSlotData(SlotData);
  },[SlotData])
  //  useEffect to get TherapistId from localStorage when component mounts
    useEffect(() => {
    const storedTherapistId = localStorage.getItem("TherapistId");
    if (storedTherapistId) {
      console.log("Retrieved Therapist LoggedIn ID:", storedTherapistId);
      setTherapistId(storedTherapistId);
      form.setFieldsValue({
        TherapistId: storedTherapistId,
      });
      dispatch(getAllAvailableSlot(storedTherapistId));
    }
  }, [dispatch, form]);

  // This useEffect will help us to get all availableslot of Therapist
  useEffect(() => {
    const fetchAllSlots = async () => {
      try{
        setLoading(true);
      const result = await dispatch(getAllAvailableSlot(therapistId));
      if (getAllAvailableSlot.fulfilled.match(result)) {
        setSlotData(result.payload);
      }
    }
    catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to load users: ${errorMessage}`);
    }
    finally {
      setLoading(false);
    }
    };

    
    fetchAllSlots();
  }, [dispatch, therapistId]);

  
  // This is modal for create Available Slot
  const showModal = () => {
    setModalVisible(true);
  };
  const handleCancelModal = () => {
    setModalVisible(false);
  };

  // The Modal For Update Available Slot
  const ShowEditModal = (SlotData:SlotData) => {
    setEditMOdal(true);
    setCurrentSlot(SlotData);

    const startTimeFormatted = new Date(SlotData.startTime).toLocaleTimeString("en-US",{hour12: false,hour: "2-digit",minute: "2-digit"});
    const endTimeFormatted = new Date(SlotData.endTime).toLocaleTimeString("en-US",{hour12: false,hour: "2-digit",minute: "2-digit"});
    form.setFieldsValue({
      availableDay: SlotData.availableDay,
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
      date: SlotData.date,
      timeZone: SlotData.timeZone,
      recurring: SlotData.recurring,
    });
  };
  const handleCancelEditModal = () => {
    setEditMOdal(false);
    form.resetFields();
  };
  // function to Reset Form
  const handleResetForm = () => {
    form.resetFields();
  };
  // delete Slot
  const handleDeleteSlot = async (id:string) => {
    const confirmed = window.confirm("Do you want to delete Slot?");
    if (confirmed) {
      try {
      const result= await dispatch(deleteAvailableSlot(id));
       if(deleteAvailableSlot.fulfilled.match(result)){
        message.success("Slot deleted successfully");
        dispatch(getAllAvailableSlot(therapistId));
       }
       else{
        message.error("Failed to delete Slot");
        dispatch(getAllAvailableSlot(therapistId));
       }
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to load users: ${errorMessage}`);
      }

    }
  };


  // function to handle form submission
  const handleSubmit = async (values:any) => {
    try {
      setIsCreating(true);
      const FormData = {
        therapistId,
        startTime: new Date(`${values.date}T${values.startTime}`).toISOString(),
        endTime: new Date(`${values.date}T${values.endTime}`).toISOString(),
        recurring: values.recurring || formData.recurring,
        date: values.date,
        availableDay: values.availableDay,
        timeZone: values.timeZone,
      };

  const result= await dispatch(createAvailableSlot(FormData));
 if(createAvailableSlot.fulfilled.match(result)) {
  message.success("Appointment Slot created successfully!");
  setModalVisible(false);
  form.resetFields();
  dispatch(getAllAvailableSlot(therapistId));;
 }
    } catch (error) {
      const errorMessage = (error as Error).message;
        message.error(`Failed to load users: ${errorMessage}`);
    }
    finally{
      setIsCreating(false);
    }
  };

// function to handle form submission for update
const handleUpdate = async (values:any) => {
  const confirmed = window.confirm('Are you sure you want to update this appointment slot?');
  if (confirmed && currentSlot?.id) {
    try {
      setIsUpdating (true);
      const updateFormData = {
        id: currentSlot.id, 
        // therapistId,
        startTime: new Date(`${values.date}T${values.startTime}`).toISOString(),
        endTime: new Date(`${values.date}T${values.endTime}`).toISOString(),
        recurring: values.recurring || formData.recurring,
        date: values.date,
        availableDay: values.availableDay,
        timeZone: values.timeZone,
      };
    const result= await dispatch(updateAvailableSlot(updateFormData ));
    if(updateAvailableSlot.fulfilled.match(result)){
      message.success("Appointment Slot updated successfully!");
      form.resetFields();
      setEditMOdal(false);
      dispatch(getAllAvailableSlot(therapistId));
    }
    else{
      message.error("Failed to update appointment slot.");
      dispatch(getAllAvailableSlot(therapistId));
    }
   
    } catch (error) {
      const errorMessage = (error as Error).message;
        message.error(`Failed to load users: ${errorMessage}`);
    }
    finally{
      setIsUpdating(false);
    }
  }
};

const handleActive = (buttonName:string) => {
  setActiveButton(buttonName);
};

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
  });
};

  const renderScheduleContent = () => (
    loading? (
      <div className="flex items-center justify-center text-red-600 min-h-screen">
      <Spin size="large" />
    </div>
             ):(
    <div className="bg-white rounded-lg shadow-xl border p-6 mt-3">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl capitalize text-black font-semibold">
          Appointment Availlable Slots{" "}
        </h1>
        <button
          className="bg-purple-600 text-white p-2 rounded font-semibold flex flex-row gap-2"
          onClick={showModal}
        >
          <FaPlus size={20} />
          Add New Slot
        </button>
      </div>

      {/* All Availlable Slot for the specific Therapist */}
      {SlotData.map((item, index) => {
        return (
          <div
            key={index}
            className="bg-white rounded-md shadow-xl border p-6 my-2"
          >
   
            <div className="flex justify-between">
              <div>
                <h1 className="text-purple-600 text-3xl font-semibold mb-5">
                  {item.availableDay}
                </h1>
                <div className="text-black text-xl my-2 flex gap-2">
                    <BiCalendar color="blue" size={24} className=""/>
                   <span>Date: </span>
                   <strong>{item.date}</strong> 
                 
                  </div>
                <div className="text-black text-xl my-2 flex gap-2">
                  <BiTime color="blue" size={24}/>
                  Start Time:  <strong>{formatTime(item.startTime)}</strong>
                </div>
                <p className="text-black text-xl my-2 flex  gap-2">
                <BiTime color="blue" size={24}/>
                  End Time: <strong>{formatTime(item.endTime)}</strong>
                </p>
                <p className="text-black text-xl my-2 flex gap-2">
                  <Globe color="blue" size={24}/>
                  Time Zone: <strong>{item.timeZone}</strong> 
                </p>
              </div>
              <div>
                {/* logic for edit and delete */}
                <div className="flex gap-8 mt-7">
                  <button
                    className="text-xl my-2 text-purple-600 flex gap-1"
                    onClick={() => ShowEditModal(item)}
                  >
                    <BiEdit size={21} className="mt-1" />
                    Edit
                  </button>
                  <button
                    className="text-xl my-2 text-red-500 flex gap-1"
                    onClick={() => handleDeleteSlot(item.id)}
                  >
                    <FaTrash size={21} className="mt-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          
          </div>
      );
      })}
    </div>
  ));

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      {/* Button selection */}
      <h1 className="text-black text-2xl p-2 bg-gray-100 rounded flex justify-center font-semibold">
         Availlable Slot
        </h1>
      <div className="flex flex-row gap-9  mt-9">
        {["Availlable Slots", "Notifications"].map(
          (buttonName) => (
            <button
              key={buttonName}
              className={`text-xl font-semibold p-2 rounded-md ${
                activeButton === buttonName
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => handleActive(buttonName)}
            >
              {buttonName}
            </button>
          )
        )}
      </div>
      {activeButton === "Availlable Slots" && renderScheduleContent()}

      <Modal
        open={modalVisible}
        footer={null}
        onCancel={handleCancelModal}
      >
        <Form
          form={form}
          className="bg-white rounded p-6"
          layout="vertical"
          onFinish={handleSubmit}
        >
          <h1 className="text-black text-lg font-semibold my-2 text-center">
            Create New Appointment Slot
          </h1>
          <Form.Item
            label="Availlable Day"
            name="availableDay"
            // rules={[{ required: true, message: "Please select a day" }]}
          >
            <Select
              value={availableDay}
              onChange={(value) => setavailableDay(value)}
              className="w-full p-1  rounded"
            >
              <Select.Option value="Monday">Monday</Select.Option>
              <Select.Option value="Tuesday">Tuesday</Select.Option>
              <Select.Option value="Wednesday">Wednesday</Select.Option>
              <Select.Option value="Thursday">Thursday</Select.Option>
              <Select.Option value="Friday">Friday</Select.Option>
              <Select.Option value="Saturday">Saturday</Select.Option>
              <Select.Option value="Sunday">Sunday</Select.Option>
            </Select>
            </Form.Item>
             <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label="Start Time"
              name="startTime"
              // rules={[{ required: true, message: "Please select a start time" }]}
            >
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-1  border rounded"
              />
            </Form.Item>

            <Form.Item
              label="End Time"
              name="endTime"
              // rules={[{ required: true, message: "Please select an end time" }]}
            >
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-1 border rounded"
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Date"
            name="date"
            // rules={[{ required: true, message: "Please select a date" }]}
          >
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-1 border rounded"
            />
          </Form.Item>
          <Form.Item
            label="Time Zone"
            name="timeZone"
            // rules={[{ required: true, message: "Please select a timeZone" }]}
          >
            <Select
              value={timeZone}
              onChange={(value) => setTimezone(value)}
              className="w-full p-1  rounded"
            >
              <Select.Option value="Africa/Khartoum">
                Africa/Khartoum
              </Select.Option>
              <Select.Option value="America/New_York">
                America/New_York
              </Select.Option>
              <Select.Option value="Asia/Kolkata">Asia/Kolkata</Select.Option>
              <Select.Option value="Europe/London">Europe/London</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="recurring" valuePropName="checked">
            <Switch
              checked={formData.recurring}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, recurring: checked }))
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              className="w-full bg-purple-600 text-white font-semibold"
              htmlType="submit"
              loading={isCreating}
              disabled={isCreating}
            >
              {status === "loading" ? "Create Slot" : "Create Slot"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Edit Availlable Slot */}

      <Modal open={editMOdal} footer={null} onCancel={handleCancelEditModal}>
        <Form form={form} className="bg-white rounded p-6" layout="vertical" onFinish={handleUpdate}>
          <h1 className="text-black text-xl font-semibold my-2 text-center">
            Edit Appointment Slot
          </h1>
          <Form.Item label="Available Day:" name="availableDay">
            <Select>
              <Select.Option value="Monday">Monday</Select.Option>
              <Select.Option value="Tuesday">Tuesday</Select.Option>
              <Select.Option value="Wednesday">Wednesday</Select.Option>
              <Select.Option value="Thursday">Thursday</Select.Option>
              <Select.Option value="Friday">Friday</Select.Option>
              <Select.Option value="Saturday">Saturday</Select.Option>
              <Select.Option value="Sunday">Sunday</Select.Option>
            </Select>
          </Form.Item>
          <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Start Time:" name="startTime">
         <Input type="time" className="w-full p-1 border text-black rounded" />
         </Form.Item>

            <Form.Item label="End Time:" name="endTime">
              <Input
                type="time"
                className="w-full p-1 border rounded "
              />
            </Form.Item>
          </div>
          <Form.Item label="Date:" name="date">
            <Input
              type="date"
              className="w-full p-1 border rounded"
            />
          </Form.Item>

          <Form.Item label="Time Zone:" name="timeZone">
            <Select>
              <Select.Option value="Africa/Khartoum">
                Africa/Khartoum 
              </Select.Option>
              <Select.Option value="America/New_York">
                America/New_York
              </Select.Option>
              <Select.Option value="Asia/Kolkata">Asia/Kolkata</Select.Option>
              <Select.Option value="Europe/London">Europe/London</Select.Option>
            </Select>
          </Form.Item>
          {/* Logic for Edit recurring */}

          <Form.Item name="recurring" valuePropName="checked">
  <Switch
    checked={formData.recurring}
    onChange={(checked) => setFormData((prev) => ({ ...prev, recurring: checked }))}
  />
</Form.Item>

          <Form.Item>
          <Button
  className="w-3/4 bg-purple-600 text-white font-semibold"
  htmlType="submit"
  loading={isUpdating}
  disabled={isUpdating}
>
  {status === "loading" ? "Update..." : "Update Slot"}
</Button>

            <Button
              className="w-1/4 bg-red-500 text-white font-semibold"
              onClick={handleResetForm}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {activeButton === "Notifications" && (
        <div className="bg-white rounded-lg shadow-xl border p-6 mt-3">
          <h1 className="text-black text-lg font-semibold">Notifications</h1>
          <p>No notifications at the moment.</p>
        </div>
      )}
    </div>
  );
}
