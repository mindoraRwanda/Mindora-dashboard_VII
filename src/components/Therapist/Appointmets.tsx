import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiTime } from "react-icons/bi";
import { FaRegCalendarAlt, FaUser } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import {
  deleteAppointment,
  getAppointmentById,
  updateAppointments,
} from "../../Redux/TherapistSlice/Appointment";
import { RootState, AppDispatch } from "../../Redux/store";
import { Button, Input, Modal, Select, Spin, Form, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Appointment } from "../../Redux/TherapistSlice/Appointment";

function Appointments() {
  const [filterStatus, setFilterStatus] = useState("all");
  const { appointments } = useSelector((state: RootState) => state.appointment);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  useEffect(() => {
    const therapistId = localStorage.getItem("TherapistId");
    if (therapistId) {
    const getAllApp = async () => {
      try {
        setLoading(true);
        await dispatch(getAppointmentById(therapistId));
        setLoading(false);
      } catch (error) {
        const errorMessage = (error as Error).message;
        message.error(`Failed to load appointments: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    getAllApp();
  }}, [dispatch]);

  const filteredAppointments =
    filterStatus === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === filterStatus);

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
  };

  const showEditModal = (appointment: any) => {
    const formatTime = (time:string) => new Date(time).toISOString().substr(11, 5);
    const formattedAppointment = {
      ...appointment,
      startTime: formatTime(appointment.startTime),
      endTime: formatTime(appointment.endTime),
    };
    setSelectedAppointment(appointment);
    form.setFieldsValue(formattedAppointment);
    setModal(true);
  };

  const handleCancelModal = () => {
    setModal(false);
    form.resetFields();
  };

  const handleUpdateApp = async (values:any) => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const startTimeISO = `${today}T${values.startTime}:00.000Z`;
      const endTimeISO = `${today}T${values.endTime}:00.000Z`;
      const appointmentData = {
        id: selectedAppointment?.id,
        startTime: startTimeISO,
        endTime: endTimeISO,
        location: values.location,
        appointmentType: values.appointmentType,
        status: values.status,
        notes: values.notes,
      };
       await dispatch(updateAppointments(appointmentData));
      message.success("Appointment updated successfully");
      setModal(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to update appointment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // function to delete appointment
  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    try {
      setLoading(true);
      if (selectedAppointment?.id) {
        dispatch(deleteAppointment(selectedAppointment.id));
      }
      message.success("Appointment deleted successfully");
      setModal(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to delete appointment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mt-3">
      <div className="">
        <div className="w-full bg-purple-600 text-white text-2xl p-3 rounded flex justify-between">
          <h1>Appointments Management - My Appointments</h1>
          <Select
            className="mr-7 rounded-lg bg-white"
            value={filterStatus}
            onChange={handleStatusChange}
          >
            <Select.Option value="all">All Appointment</Select.Option>
            <Select.Option value="waiting">Waiting</Select.Option>
            <Select.Option value="confirmed">Confirmed</Select.Option>
            <Select.Option value="canceled">Canceled</Select.Option>
            <Select.Option value="Scheduled">Scheduled</Select.Option>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="w-full border p-5 rounded my-5">
          <h1 className="font-bold text-black text-xl">
            {appointments.length}
          </h1>
          <div className="flex justify-center gap-2">
            <FaRegCalendarAlt size={24} color="black" />
            <h1 className="text-black text-xl font-semibold">
              Today's Appointment
            </h1>
          </div>
        </div>

        <div className="w-full border p-5 rounded my-5">
          <div className="text-2xl font-bold text-black">
            {appointments.filter((apt) => apt.status === "pending").length}
          </div>
          <div className="flex justify-center gap-2">
            <BiTime size={24} color="black" />
            <h1 className="text-xl text-black font-semibold">
              Pending Appointment
            </h1>
          </div>
        </div>

        <div className="w-full border p-5 rounded my-5">
          <div className="text-2xl font-bold text-black">
            {new Set(appointments.map((apt) => apt.id)).size}
          </div>
          <div className="flex justify-center gap-2">
            <FaUser size={24} color="black" />
            <h1 className="text-xl font-semibold text-black">Total Patient</h1>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center text-red-600 min-h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-xl border p-6 my-3">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-lg flex flex-row justify-between border-2 p-6 mt-3"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 p-3 rounded-full mt-4">
                  <FaUser className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-black mb-2 font-semibold">
                    {appointment.location}
                  </h3>
                  <p className="text-sm ml-2 text-gray-500">
                    {appointment.appointmentType}
                  </p>
                  <div className="space-x-2 mt-1">
                    <span className="flex gap-1 text-sm my-3 text-gray-500">
                      <MdLocationOn size={20} color="black" />
                      {appointment.location}
                    </span>
                    <span className="flex gap-1 text-sm text-gray-500">
                      <BiTime size={20} color="black" />
                      {appointment.startTime} to {appointment.endTime}
                    </span>
                  </div>
                  <p className="text-md mt-3 capitalize text-gray-500">
                    Notes: {appointment.notes}
                  </p>
                  <Button
                    className="p-3 bg-purple-600 my-2 text-white hover:bg-purple-800 text-lg"
                    onClick={() => showEditModal(appointment)}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Appointment"}
                  </Button>
                  <Button
                    className="p-3 bg-red-600 text-white hover:bg-red-800 text-lg ml-3"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div
                className={`italic m-5 p-2 ${
                  appointment.status === "Scheduled"
                    ? "text-blue-600"
                    : appointment.status === "waiting"
                    ? "text-green-500"
                    : appointment.status === "upcoming"
                    ? "text-orange-400"
                    : appointment.status === "canceled"
                    ? "text-red-700"
                    : ""
                }`}
              >
                {appointment.status}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modal}
        onCancel={handleCancelModal}
        footer={null}
        title="Update Appointment"
      >
        <Form
          form={form}
          className="bg-white rounded-lg shadow-xl p-6"
          layout="vertical"
          onFinish={handleUpdateApp}
        >
          <div className="grid grid-cols-2 gap-1">
            <Form.Item name="location" label="Location">
              <Input className="p-2" />
            </Form.Item>
            <Form.Item name="appointmentType" label="Appointment Type">
              <Input className="p-2" />
            </Form.Item>
            <Form.Item name="startTime" label="Start Time">
              <Input className="p-2" type="time" />
            </Form.Item>
            <Form.Item name="endTime" label="End Time">
              <Input className="p-2" type="time" />
            </Form.Item>
          </div>
          <Form.Item name="notes" label="Notes">
            <TextArea className="p-2 rounded-md" />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="waiting">Waiting</Select.Option>
              <Select.Option value="canceled">Canceled</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="upcoming">Upcoming</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-purple-600 text-white w-full"
              loading={loading}
            >
              Update Appointment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Appointments;
