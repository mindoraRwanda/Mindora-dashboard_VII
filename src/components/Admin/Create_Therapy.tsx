import { useState } from "react";
import { Typography, Form, Input, Button, Radio } from "antd";


const Label = Typography;

export default function CreateTherapy() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [patients, setPatients] = useState("");
  const [form] = Form.useForm();

  return (
    <div className="flex justify-center">
      <Form className="bg-white rounded" form={form}>
        <p className="text-black mb-8 text-center text-xl font-semibold">
          Create New Therapy
        </p>

        <div className="grid grid-cols-1 gap-4">
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter your Name" }]}
          >
            <Label className="font-semibold text-sm mb-2">Names:</Label>
            <Input
              className="flex w-80 h-3 p-4 rounded bg-transparent border border-blue-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please Enter your Email" }]}
          >
            <Label className="font-semibold text-sm mb-2">Email:</Label>
            <Input
              className="flex w-80 h-3 p-4 rounded bg-transparent border border-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="specialty"
            rules={[{ required: true, message: "Please enter your Specialty" }]}
          >
            <Label className="font-semibold text-sm mb-2">Specialty:</Label>
            <Input
              className="flex w-80 h-3 p-4 rounded bg-transparent border border-blue-600"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="patients"
            rules={[
              {
                required: true,
                message: "Please Enter the number of Patients",
              },
            ]}
          >
            <Label className="font-semibold text-sm mb-2">Patients:</Label>
            <Input
              className="flex w-80 h-3 p-4 rounded bg-transparent border border-blue-600"
              value={patients}
              onChange={(e) => setPatients(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="gender"
            rules={[{ required: true, message: "Please select Gender" }]}
          >
            <Label className="font-semibold text-sm mb-2">Gender:</Label>
            <Radio.Group>
              <Radio value="male" onChange={(e) => setGender(e.target.value)}>
                Male
              </Radio>
              <Radio value="female" onChange={(e) => setGender(e.target.value)}>
                Female
              </Radio>
              <Radio value="others" onChange={(e) => setGender(e.target.value)}>
                Others
              </Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <Form.Item className="text-center">
          <Button type="primary">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
