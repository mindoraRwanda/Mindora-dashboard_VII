import {
  Form,
  Input,
  Button,
  Radio,
  DatePicker,
  Typography,
  message,
} from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPatient } from "../../Redux/slice/PatientSlice";

const Text = Typography;
export default function CreatePatient({ addPatient }) {
  const [form] = Form.useForm(); // Create form instance for Ant Design form
  const [lastVisit, setLastVisit] = useState(null);
  const [gender, setGender] = useState("");
  const dispatch = useDispatch();
  const userId = "4c54c0ba-bb7d-45ed-b00c-7ef4c786ed5f";

  const handleSubmit = async () => {
    if (!lastVisit) {
      message.error("Please select a last visit date");
      return;
    }

    try {
      const result = await dispatch(
        createPatient({
          name,
          gender,
          email,
          lastVisit: lastVisit ? lastVisit.format("YYYY-MM-DD") : "",
          condition,
          age,
          contact,
          userId,
        })
      );
      if (createPatient.fulfilled.match(result)) {
        dispatch(createPatient);
        message.success("Patient created successfully");
      } else {
        message.error("Failed to create patient");
      }
    } catch (err) {
      message.error("Error creating patient: " + err.message);
    }
  };

  return (
    <div className="flex justify-center">
      <Form
        form={form}
        layout="vertical"
        className="bg-white rounded p-6 shadow-lg"
        onFinish={handleSubmit} // Trigger handleSubmit on form finish
      >
        <p className="text-black mb-8 text-center text-xl font-semibold">
          Create New Patient
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name" }]}
          >
            <Input
              type="text"
              className="w-full p-1 rounded border border-blue-600"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              type="email"
              className="w-full p-1 rounded border border-blue-600"
            />
          </Form.Item>

          <Form.Item
            label="Last Visit"
            className="w-full"
            rules={[
              { required: true, message: "Please select the last visit date" },
            ]}
          >
            <DatePicker
              onChange={(date) => setLastVisit(date)}
              className="border border-blue-600 w-full"
            />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Please input the age" }]}
          >
            <Input
              type="number"
              className="w-full  rounded border border-blue-600"
            />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="contact"
            rules={[
              { required: true, message: "Please input the phone number" },
            ]}
          >
            <Input
              type="number"
              className="w-full  rounded border border-blue-600"
            />
          </Form.Item>

          <Form.Item
            label="Condition"
            name="condition"
            rules={[
              { required: true, message: "Please input the phone number" },
            ]}
          >
            <Input
              type="text"
              className="w-full  rounded border border-blue-600"
            />
          </Form.Item>
        </div>
        <Form.Item>
          <Text className="font-semibold text-sm mb-2">Gender:</Text>
          <Radio.Group
            onChange={(e) => setGender(e.target.value)}
            value={gender}
          >
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="others">Others</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item className="text-center">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-600 text-white p-2 rounded  w-full"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
